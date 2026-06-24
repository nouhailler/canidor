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
//   -m, --model <id>        modèle OpenRouter         (def. $OPENROUTER_MODEL ou gpt-oss-120b:free)
//   -k, --key <clé>         clé OpenRouter            (def. $OPENROUTER_API_KEY)
//   -d, --delay <ms>        pause entre appels        (def. 1200)
//   --max-tokens <n>        tokens max par réponse    (def. 1200 ; à monter pour
//                           les modèles de raisonnement dont le JSON est tronqué)
//   --append                fusionne avec le JSON de sortie existant (dédup par nom)
//
// CRASH-SAFE & REPRISE :
//   - Après chaque fiche réussie : ajout au JSONL <out>.partial (1 objet/ligne)
//     puis réécriture atomique de <out> (tmp → rename) — <out> est donc toujours
//     un catalogue valide et importable, jamais corrompu même en plein plantage.
//   - Reprise : relancez exactement la même commande, les entrées déjà notées
//     dans <out>.done sont sautées (on repart d'où on en était).
//   - À la fin d'un run complet, <out>.partial et <out>.done sont supprimés.
//
// Le JSON produit suit exactement le schéma d'import de l'application
// (voir src/lib/breeds.js » normalizeBreed). Il se colle/charge dans
// Catalogue » ⇪ Importer JSON.

import { readFile, writeFile, appendFile, rename, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const BASE = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'openai/gpt-oss-120b:free'

/* ---------- CLI ---------- */
function parseArgs(argv) {
  const o = { in: null, out: 'breeds.json', model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL, key: process.env.OPENROUTER_API_KEY || '', delay: 1200, maxTokens: 1200, append: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '-o' || a === '--out') o.out = argv[++i]
    else if (a === '-m' || a === '--model') o.model = argv[++i]
    else if (a === '-k' || a === '--key') o.key = argv[++i]
    else if (a === '-d' || a === '--delay') o.delay = Number(argv[++i]) || 0
    else if (a === '--max-tokens') o.maxTokens = Number(argv[++i]) || 1200
    else if (a === '--append') o.append = true
    else if (!a.startsWith('-')) o.in = a
  }
  return o
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ---------- persistance robuste (crash-safe) ---------- */
// Écriture atomique : on écrit dans un .tmp puis rename() (atomique sur le même
// FS) → le fichier cible n'est jamais vu à moitié écrit, même en plein plantage.
async function writeAtomic(path, data) {
  const tmp = path + '.tmp'
  await writeFile(tmp, data, 'utf8')
  await rename(tmp, path)
}

// Lit un fichier « un JSON par ligne » (JSONL) en ignorant les lignes vides
// ou tronquées (une ligne à moitié écrite lors d'un crash est simplement sautée).
async function readJSONL(path) {
  if (!existsSync(path)) return []
  const txt = await readFile(path, 'utf8')
  const out = []
  for (const line of txt.split('\n')) {
    const t = line.trim()
    if (!t) continue
    try { out.push(JSON.parse(t)) } catch { /* ligne tronquée → ignorée */ }
  }
  return out
}

// Lit un fichier « une clé par ligne » en un Set (clés en minuscules).
async function readKeySet(path) {
  const set = new Set()
  if (!existsSync(path)) return set
  const txt = await readFile(path, 'utf8')
  for (const line of txt.split('\n')) {
    const t = line.trim()
    if (t) set.add(t.toLowerCase())
  }
  return set
}

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
async function callOpenRouter({ key, model, content, maxTokens = 1200, retries = 2 }) {
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(BASE, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key.trim(),
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://canidor.app',
        'X-Title': 'Canidor breeds generator',
      },
      body: JSON.stringify({ model, messages: [{ role: 'user', content }], max_tokens: maxTokens, temperature: 0.4 }),
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
    return { name, hint: hint || '', src: l } // src = clé de reprise (ligne d'entrée)
  })

  if (!entries.length) { console.error('Aucune race dans le fichier.'); process.exit(1) }

  // Fichiers d'état pour reprise crash-safe
  const partialPath = o.out + '.partial' // JSONL : une fiche par ligne, ajoutée au fil de l'eau
  const donePath = o.out + '.done'       // une ligne d'entrée par chien déjà traité (reprise)

  const out = []
  const byName = new Map()
  const addToOut = (breed) => {
    const k = String(breed.nom || '').toLowerCase()
    if (byName.has(k)) out[byName.get(k)] = breed
    else { byName.set(k, out.length); out.push(breed) }
  }

  // --append : on repart aussi du JSON complet existant (fusion par nom).
  if (o.append && existsSync(o.out)) {
    try { JSON.parse(await readFile(o.out, 'utf8')).forEach(addToOut) } catch { /* ignore */ }
  }
  // Reprise : recharge les fiches déjà produites (.partial) et les entrées déjà faites (.done).
  ;(await readJSONL(partialPath)).forEach(addToOut)
  const done = await readKeySet(donePath)

  const failed = []
  let skipped = 0

  console.log(`▶ ${entries.length} race(s) · modèle ${o.model}`)
  if (done.size) console.log(`↻ reprise : ${done.size} déjà fait(s) seront sautés`)
  console.log('')

  for (let i = 0; i < entries.length; i++) {
    const { name, hint, src } = entries[i]
    const tag = `[${i + 1}/${entries.length}] ${name}`

    if (done.has(src.toLowerCase())) { skipped++; console.log(`↷ ${tag} — déjà fait, sauté`); continue }

    try {
      const text = await callOpenRouter({ key: o.key, model: o.model, content: instruction(name, hint), maxTokens: o.maxTokens })
      const breed = normalizeBreed(extractJSON(text), 'import')
      if (!breed.nom) throw new Error('race introuvable / non reconnue')
      addToOut(breed)

      // Persistance incrémentale, dans cet ordre pour ne jamais marquer « fait »
      // une fiche dont les données ne seraient pas déjà sur le disque :
      //   1) on ajoute la fiche au JSONL .partial (append)
      //   2) on réécrit canidor.json atomiquement (toujours valide & importable)
      //   3) on marque la ligne comme faite dans .done
      // Si ça plante entre 1 et 3, la fiche est conservée et l'entrée sera
      // simplement régénérée (puis dédupliquée par nom) à la reprise.
      await appendFile(partialPath, JSON.stringify(breed) + '\n', 'utf8')
      await writeAtomic(o.out, JSON.stringify(out, null, 2))
      await appendFile(donePath, src + '\n', 'utf8')
      done.add(src.toLowerCase())

      console.log(`✓ ${tag} → ${breed.nom} (${breed.groupe})`)
    } catch (e) {
      console.log(`✗ ${tag} — ${e.message}`)
      failed.push(src)
    }
    if (i < entries.length - 1 && o.delay) await sleep(o.delay)
  }

  // Run complet : canidor.json reflète tout, on l'écrit une dernière fois puis
  // on supprime les fichiers d'état de reprise (.partial / .done).
  await writeAtomic(o.out, JSON.stringify(out, null, 2))
  if (existsSync(partialPath)) await unlink(partialPath)
  if (existsSync(donePath)) await unlink(donePath)

  console.log(`\n✅ ${out.length} fiche(s) écrites dans ${o.out}`)
  if (skipped) console.log(`↷ ${skipped} déjà fait(s) sautés à la reprise`)
  if (failed.length) {
    const fpath = o.out.replace(/\.json$/, '') + '.failed.txt'
    await writeFile(fpath, failed.join('\n') + '\n', 'utf8')
    console.log(`⚠ ${failed.length} échec(s) → ${fpath} (relançable avec --append)`)
  }
  console.log('\n→ Importez ce fichier dans l\'app : Catalogue » ⇪ Importer JSON » Fichier…')
}

main().catch((e) => { console.error('Erreur fatale :', e.message); process.exit(1) })
