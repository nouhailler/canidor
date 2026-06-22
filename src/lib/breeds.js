// Breed catalogue helpers: a single normalized schema shared by the static seed,
// user-added breeds, AI-generated fiches, JSON import and The Dog API import.

import { chatCompletion } from './openrouter'

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

// Standard 0–100 trait labels used across the app (Fiche bars, morpho, etc.).
export const STANDARD_TRAITS = ['Énergie', "Facilité d'éducation", 'Sociabilité', 'Entretien du poil']

const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)))
const str = (v, fallback = '') => (v == null ? fallback : String(v).trim())

// Coerce any loosely-shaped object into a valid breed record.
export function normalizeBreed(raw = {}, source = 'import') {
  const traits = Array.isArray(raw.traits)
    ? raw.traits
        .filter((t) => Array.isArray(t) && t.length >= 2)
        .map((t) => [str(t[0]), clamp(t[1])])
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

export function isValidBreed(b) {
  return !!(b && b.nom)
}

/* ---------------- JSON import ---------------- */

export const IMPORT_TEMPLATE = JSON.stringify(
  [
    {
      nom: 'Akita Inu',
      groupe: 'Groupe 5',
      origine: 'Japon',
      taille: '61–67 cm',
      poids: '32–45 kg',
      vie: '10–13 ans',
      tags: ['Loyal', 'Indépendant', 'Digne'],
      traits: [['Énergie', 60], ["Facilité d'éducation", 55], ['Sociabilité', 50], ['Entretien du poil', 70]],
      histoire: "Race japonaise ancienne du nord du Honshū, à l'origine chien de chasse au gros gibier puis symbole national.",
      sante: ['Dysplasie de la hanche', 'Hypothyroïdie', 'Affections oculaires'],
      note: 'Caractère affirmé : socialisation précoce indispensable.',
      image: '',
    },
  ],
  null,
  2,
)

// Parse a JSON string (array or single object) into normalized breeds.
// Returns { breeds, error }.
export function parseImportJSON(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { breeds: [], error: 'JSON invalide : vérifiez la syntaxe.' }
  }
  const arr = Array.isArray(data) ? data : [data]
  const breeds = arr.map((r) => normalizeBreed(r, 'import')).filter(isValidBreed)
  if (!breeds.length) return { breeds: [], error: 'Aucune race valide (champ « nom » requis).' }
  return { breeds, error: '' }
}

/* ---------------- AI generation ---------------- */

export function breedAIInstruction(name) {
  return (
    `Établis une fiche de race canine complète et factuelle pour : « ${name} ». ` +
    'Réponds UNIQUEMENT par un objet JSON valide, sans texte ni balises autour, au format exact : ' +
    '{"nom":"...","groupe":"Groupe FCI","origine":"Pays","taille":"X–Y cm","poids":"X–Y kg",' +
    '"vie":"X–Y ans","tags":["3 à 4 adjectifs"],' +
    `"traits":[["Énergie",0-100],["Facilité d'éducation",0-100],["Sociabilité",0-100],["Entretien du poil",0-100]],` +
    '"histoire":"2 à 3 phrases","sante":["3 à 5 problèmes fréquents"],"note":"1 phrase de conseil"}. ' +
    "N'invente pas la race si elle n'existe pas : renvoie alors {\"nom\":\"\"}."
  )
}

function extractJSON(text) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Réponse IA illisible.')
  return JSON.parse(text.slice(start, end + 1))
}

export async function generateBreed({ name, key, model, signal }) {
  const text = await chatCompletion({
    key,
    model,
    messages: [{ role: 'user', content: breedAIInstruction(name) }],
    signal,
    maxTokens: 700,
  })
  const breed = normalizeBreed(extractJSON(text), 'ai')
  if (!isValidBreed(breed)) throw new Error(`Race « ${name} » introuvable.`)
  return breed
}

/* ---------------- The Dog API import ---------------- */

const DOG_API = 'https://api.thedogapi.com/v1/breeds'

function imageUrl(b) {
  if (b.image && b.image.url) return b.image.url
  if (b.reference_image_id) return `https://cdn2.thedogapi.com/images/${b.reference_image_id}.jpg`
  return ''
}

const rangeUnit = (metric, unit) => {
  const s = str(metric)
  if (!s) return '—'
  return `${s.replace(/\s*-\s*/, '–')} ${unit}`
}

function mapDogApi(b) {
  return normalizeBreed(
    {
      nom: b.name,
      groupe: b.breed_group,
      origine: b.origin || (b.country_code ? b.country_code : ''),
      taille: rangeUnit(b.height && b.height.metric, 'cm'),
      poids: rangeUnit(b.weight && b.weight.metric, 'kg'),
      vie: str(b.life_span).replace(/years?/i, 'ans'),
      tags: str(b.temperament).split(',').map((t) => t.trim()).filter(Boolean).slice(0, 4),
      histoire: b.bred_for ? `Sélectionné à l'origine pour : ${str(b.bred_for).toLowerCase()}.` : '',
      note: str(b.temperament),
      image: imageUrl(b),
    },
    'dogapi',
  )
}

// Fetch the public catalogue. Returns normalized breeds (throws on failure).
export async function fetchDogApiBreeds({ signal } = {}) {
  const r = await fetch(DOG_API, { signal })
  if (!r.ok) throw new Error(`The Dog API a répondu ${r.status}.`)
  const data = await r.json()
  return (data || []).map(mapDogApi).filter(isValidBreed)
}
