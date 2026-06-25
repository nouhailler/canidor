// Analyse du mode de vie : champs éditables + estimation locale de la
// compatibilité par race, calculée à partir des traits du catalogue (énergie,
// éducation, sociabilité, entretien). Fonctionne hors-ligne ; l'IA reste
// disponible pour un rapport approfondi.

import { traitValue } from './breedFilters'

// Champs proposés à l'utilisateur (clé d'affichage → options sélectionnables).
export const LIFESTYLE_FIELDS = [
  { k: 'Logement', options: ['Appartement', 'Maison sans jardin', 'Maison avec jardin'] },
  { k: 'Enfants', options: ['Aucun', 'Oui, en bas âge', 'Oui, plus de 6 ans'] },
  { k: 'Présence', options: ['Absent en journée', 'Télétravail partiel', 'Présent à la maison'] },
  { k: 'Temps libre', options: ['Faible', 'Modéré', 'Élevé'] },
  { k: 'Expérience', options: ['Débutant', 'Intermédiaire', 'Expérimenté'] },
]

export const LIFESTYLE_DEFAULTS = {
  Logement: 'Maison avec jardin',
  Enfants: 'Oui, plus de 6 ans',
  Présence: 'Télétravail partiel',
  'Temps libre': 'Modéré',
  Expérience: 'Intermédiaire',
}

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))

// Capacité du foyer à absorber un chien énergique (0–100), déduite du temps
// libre, du logement et de la présence à la maison.
function energyCapacity(f) {
  const temps = { Faible: 30, Modéré: 55, Élevé: 85 }[f['Temps libre']] ?? 55
  const logement = { Appartement: -12, 'Maison sans jardin': 4, 'Maison avec jardin': 15 }[f.Logement] ?? 0
  const presence = { 'Absent en journée': -8, 'Télétravail partiel': 5, 'Présent à la maison': 10 }[f.Présence] ?? 0
  return clamp(temps + logement + presence)
}

// Score 0–100 de compatibilité d'une race avec le mode de vie décrit.
export function scoreBreed(breed, f) {
  const energy = traitValue(breed, 'energie') ?? 50
  const socia = traitValue(breed, 'sociab') ?? 50
  const educ = traitValue(breed, 'facilit') ?? 50
  const entretien = traitValue(breed, 'entretien') ?? 50
  const cap = energyCapacity(f)

  let score = 100
  // Chien trop énergique pour la capacité du foyer.
  if (energy > cap) score -= (energy - cap) * 0.7
  // Chien très calme dans un foyer très actif : léger décalage.
  else if (cap - energy > 45) score -= (cap - energy - 45) * 0.2

  // Enfants : pénalise une faible sociabilité (davantage en bas âge).
  if (f.Enfants && f.Enfants !== 'Aucun') {
    const w = f.Enfants === 'Oui, en bas âge' ? 0.35 : 0.22
    score -= (100 - socia) * w
  }

  // Expérience du maître : un débutant pâtit d'une éducation difficile.
  const expW = { Débutant: 0.32, Intermédiaire: 0.15, Expérimenté: 0 }[f.Expérience] ?? 0.15
  score -= (100 - educ) * expW

  // Absence en journée : un chien très sociable supporte mal la solitude.
  if (f.Présence === 'Absent en journée' && socia > 60) score -= (socia - 60) * 0.3

  // Peu de temps libre : un entretien du poil élevé pèse un peu.
  if (f['Temps libre'] === 'Faible' && entretien > 60) score -= (entretien - 60) * 0.2

  return clamp(score)
}

// Top des races compatibles (catalogue trié par score décroissant).
export function estimateCompat(f, breeds, limit = 6) {
  return breeds
    .filter((b) => Array.isArray(b.traits) && b.traits.length)
    .map((b) => ({ name: b.nom, pct: scoreBreed(b, f) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit)
}

/* ---------------- Compatibilité adoption (top races + raison) ---------------- */

export const ADOPTION_FIELDS = [
  { k: 'Logement', options: ['Appartement', 'Maison'] },
  { k: 'Jardin', options: ['Non', 'Oui'] },
  { k: 'Enfants', options: ['Non', 'Oui'] },
  { k: 'Autres animaux', options: ['Aucun', 'Chat', 'Chien'] },
  { k: 'Temps disponible', options: ['< 1 h / jour', '≈ 2 h / jour', '> 3 h / jour'] },
]

export const ADOPTION_DEFAULTS = {
  Logement: 'Appartement',
  Jardin: 'Non',
  Enfants: 'Oui',
  'Autres animaux': 'Chat',
  'Temps disponible': '≈ 2 h / jour',
}

function adoptionCapacity(f) {
  const temps = { '< 1 h / jour': 30, '≈ 2 h / jour': 55, '> 3 h / jour': 85 }[f['Temps disponible']] ?? 55
  const logement = f.Logement === 'Maison' ? 6 : -8
  const jardin = f.Jardin === 'Oui' ? 12 : 0
  return clamp(temps + logement + jardin)
}

export function scoreAdoption(breed, f) {
  const energy = traitValue(breed, 'energie') ?? 50
  const socia = traitValue(breed, 'sociab') ?? 50
  const educ = traitValue(breed, 'facilit') ?? 50
  const cap = adoptionCapacity(f)

  let score = 100
  if (energy > cap) score -= (energy - cap) * 0.7
  if (f.Enfants === 'Oui') score -= (100 - socia) * 0.25
  if (f['Autres animaux'] && f['Autres animaux'] !== 'Aucun') score -= (100 - socia) * 0.2
  if (f.Logement === 'Appartement' && energy > 60) score -= (energy - 60) * 0.25
  return clamp(score)
}

// Courte raison expliquant l'adéquation d'une race au foyer décrit.
function adoptionReason(breed, f) {
  const energy = traitValue(breed, 'energie') ?? 50
  const socia = traitValue(breed, 'sociab') ?? 50
  const educ = traitValue(breed, 'facilit') ?? 50
  const entretien = traitValue(breed, 'entretien') ?? 50
  const parts = []
  if (energy < 45 && f.Logement === 'Appartement') parts.push("calme, adapté à l'appartement")
  else if (energy < 45) parts.push('tempérament posé')
  else if (energy > 70) parts.push('énergique et sportif')
  if (socia >= 70) parts.push(f.Enfants === 'Oui' ? 'sociable avec les enfants' : 'très sociable')
  if (educ >= 65) parts.push('facile à éduquer')
  if (entretien < 45) parts.push('entretien réduit')
  return (parts.slice(0, 2).join(', ') || 'bon équilibre pour votre foyer').replace(/^./, (c) => c.toUpperCase())
}

// Top des races à adopter pour le foyer décrit : { name, pct, reason }.
export function estimateAdoption(f, breeds, limit = 5) {
  return breeds
    .filter((b) => Array.isArray(b.traits) && b.traits.length)
    .map((b) => ({ name: b.nom, pct: scoreAdoption(b, f), reason: adoptionReason(b, f) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, limit)
}

// Phrase de synthèse référant la meilleure et la moins bonne race affichées.
export function summarize(results) {
  if (!results.length) return 'Ajoutez des races au catalogue pour estimer votre compatibilité.'
  const best = results[0]
  const worst = results[results.length - 1]
  if (results.length === 1) return `Votre quotidien convient à ${best.pct}% à un ${best.name}.`
  return `Votre quotidien convient à ${best.pct}% à un ${best.name}, mais seulement à ${worst.pct}% à un ${worst.name} : pensez à adapter votre choix à votre temps libre et votre logement.`
}
