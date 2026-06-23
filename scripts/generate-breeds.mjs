#!/usr/bin/env node
// Génère un fichier JSON de fiches de races (importable tel quel dans Canidor)
// à partir d'un fichier texte plat — un nom de race par ligne — via OpenRouter.
//
// FORMAT D'ENTRÉE (fichier .txt) :
//   - une race par ligne
//   - lignes vides et lignes commençant par # ignorées
//   - indice optionnel après « | » pour lever une ambiguïté (n° FCI, pays, nom EN)
//   exemples :
//       Berger Australien
//       Akita Inu | FCI 255, Japon
//       Épagneul Breton | Brittany Spaniel
//
// USAGE :
//   OPENROUTER_API_KEY=sk-or-... node scripts/generate-breeds.mjs races.txt -o breeds.json
//   npm run breeds:gen -- races.txt -o breeds.json -m meta-llama/llama-3.3-70b-instruct:free
//
// OPTIONS :
//   -o, --out <fichier>     fichier de sortie         (def. breeds.json)
//   -m, --model <id>        modèle OpenRouter         (def. $OPENROUTER_MODEL ou llama-3.3-70b:free)
//   -k, --key <clé>         clé OpenRouter            (def. $OPENROUTER_API_KEY)
//   -d, --delay <ms>        pause entre appels        (def. 1200)
//   --append                fusionne avec le JSON de sortie existant (dédup par nom)
//
// Le JSON produit suit exactement le schéma d'import de l'application
// (voir src/lib/breeds.js » normalizeBreed). Il se colle/charge dans
// Catalogue » ⇪ Importer JSON.

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const BASE = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

/* ---------- CLI ---------- */
function parseArgs(argv) {
  const o = { in: null, out: 'breeds.json', model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL, key: process.env.OPENROUTER_API_KEY || '', delay: 1200, append: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-o' || a === '--out') o.out = argv[++i]
    else if (a === '-m' || a === '--model') o.model = argv[++i]
    else if (a === '-k' || a === '--key') o.key = argv[++i]
    else if (a === '-d' || a === '--delay') o.delay = Number(argv[++i]) || 0
    else if (a === '--append') o.append = true
    else if (!a.startsWith('-')) o.in = a
  }
  return o
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ---------- normalisation (miroir de src/lib/breeds.js) ---------- */
const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)))
const str = (v, fb = '') => (v == null ? fb : String(v).trim())
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

function normalizeBreed(raw = {}, source = 'import') {
  const traits = Array.isArray(raw.traits)
    ? raw.traits.filter((t) => Array.isArray(t) && t.length >= 2).map((t) => [str(t[0]), clamp(t[1])])
    : []
  return {
    id: raw.id || uid(),
    nom: str(raw.nom || raw.name),
    groupe: str(raw.groupe || raw.breed_group, '—'),
    origine: str(raw.origine || raw.origin, '—'),
    taille: str(raw.taille, '—'),
    poids: str(raw.poids, '—'),
    vie: str(raw.vie || raw.life_span, '—'),
    tags: Array.isArray(raw.tags) ? raw.tags.map((t) => str(t)).filter(Boolean).slice(0, 5) : [],
    traits,
    histoire: str(raw.histoire),
    sante: Array.isArray(raw.sante) ? raw.sante.map((s) => str(s)).filter(Boolean) : [],
    note: str(raw.note),
    image: str(raw.image),
    source,
  }
}

/* ---------- prompt (miroir de breedAIInstruction) ---------- */
function instruction(name, hint) {
  const who = hint ? `${name} (précision : ${hint})` : name
  return (
    `Établis une fiche de race canine complète et factuelle pour : « ${who} ». ` +
    'Réponds UNIQUEMENT par un objet JSON valide, sans texte ni balises autour, au format exact : ' +
    '{"nom":"...","groupe":"Groupe FCI","origine":"Pays","taille":"X–Y cm","poids":"X–Y kg",' +
    '"vie":"X–Y ans","tags":["3 à 4 adjectifs"],' +
    `"traits":[["Énergie",0-100],["Facilité d'éducation",0-100],["Sociabilité",0-100],["Entretien du poil",0-100]],` +
    '"histoire":"2 à 3 phrases","sante":["3 à 5 problèmes fréquents"],"note":"1 phrase de conseil"}. ' +
    'Réponds en français. N\'invente pas la race si elle n\'existe pas : renvoie alors {"nom":""}.'
  )
}

function extractJSON(text) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('réponse illisible')
  return JSON.parse(text.slice(start, end + 1))
}

/* ---------- appel OpenRouter avec retries ---------- */
async function callOpenRouter({ key, model, content, retries = 2 }) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(BASE, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key.trim(),
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://canidor.app',
        'X-Title': 'Canidor breeds generator',
      },
      body: JSON.stringify({ model, messages: [{ role: 'user', content }], max_tokens: 700, temperature: 0.4 }),
    })
    if (r.ok) {
      const json = await r.json()
      return json?.choices?.[0]?.message?.content?.trim() || ''
    }
    // 429 / 5xx → retry avec backoff
    if ((r.status === 429 || r.status >= 500) && attempt < retries) {
      await sleep(2000 * (attempt + 1))
      continue
    }
    let detail = ''
    try { detail = (await r.json())?.error?.message || '' } catch { /* ignore */ }
    throw new Error(detail || `HTTP ${r.status}`)
  }
}

/* ---------- main ---------- */
async function main() {
  const o = parseArgs(process.argv.slice(2))
  if (!o.in) { console.error('Erreur : fichier d\'entrée manquant.\nUsage : node scripts/generate-breeds.mjs races.txt -o breeds.json'); process.exit(1) }
  if (!o.key) { console.error('Erreur : clé OpenRouter absente (OPENROUTER_API_KEY ou -k).'); process.exit(1) }

  const raw = await readFile(o.in, 'utf8')
  const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
  const entries = lines.map((l) => {
    const [name, hint] = l.split('|').map((s) => s.trim())
    return { name, hint: hint || '' }
  })

  if (!entries.length) { console.error('Aucune race dans le fichier.'); process.exit(1) }

  // --append : repartir du JSON existant
  const existing = []
  if (o.append && existsSync(o.out)) {
    try { existing.push(...JSON.parse(await readFile(o.out, 'utf8'))) } catch { /* ignore */ }
  }
  const byName = new Map(existing.map((b, i) => [String(b.nom || '').toLowerCase(), i]))
  const out = [...existing]
  const failed = []

  console.log(`▶ ${entries.length} race(s) · modèle ${o.model}\n`)
  for (let i = 0; i < entries.length; i++) {
    const { name, hint } = entries[i]
    const tag = `[${i + 1}/${entries.length}] ${name}`
    try {
      const text = await callOpenRouter({ key: o.key, model: o.model, content: instruction(name, hint) })
      const breed = normalizeBreed(extractJSON(text), 'import')
      if (!breed.nom) throw new Error('race introuvable / non reconnue')
      const k = breed.nom.toLowerCase()
      if (byName.has(k)) out[byName.get(k)] = breed
      else { byName.set(k, out.length); out.push(breed) }
      console.log(`✓ ${tag} → ${breed.nom} (${breed.groupe})`)
    } catch (e) {
      console.log(`✗ ${tag} — ${e.message}`)
      failed.push(hint ? `${name} | ${hint}` : name)
    }
    if (i < entries.length - 1 && o.delay) await sleep(o.delay)
  }

  await writeFile(o.out, JSON.stringify(out, null, 2), 'utf8')
  console.log(`\n✅ ${out.length} fiche(s) écrites dans ${o.out}`)
  if (failed.length) {
    const fpath = o.out.replace(/\.json$/, '') + '.failed.txt'
    await writeFile(fpath, failed.join('\n') + '\n', 'utf8')
    console.log(`⚠ ${failed.length} échec(s) → ${fpath} (relançable avec --append)`)
  }
  console.log('\n→ Importez ce fichier dans l\'app : Catalogue » ⇪ Importer JSON » Fichier…')
}

main().catch((e) => { console.error('Erreur fatale :', e.message); process.exit(1) })
