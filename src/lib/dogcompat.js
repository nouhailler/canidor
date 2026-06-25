// Compatibilité entre deux chiens : chien A = le chien du profil, chien B saisi
// par l'utilisateur. Estimation locale à partir des sexes, de l'écart d'énergie
// (déduit de la race via le catalogue + tempérament), de la sociabilité et de
// l'écart d'âge. Fonctionne hors-ligne ; l'IA reste disponible en complément.

import { traitValue } from './breedFilters'

export const TEMPERAMENTS = ['Calme', 'Équilibré', 'Énergique', 'Dominant', 'Craintif']
const TEMPER_ENERGY = { Calme: -20, Équilibré: 0, Énergique: 20, Dominant: 10, Craintif: -12 }

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

function findBreed(breeds, race) {
  const n = norm(race)
  if (!n) return null
  return breeds.find((b) => norm(b.nom) === n) || breeds.find((b) => { const bn = norm(b.nom); return bn.includes(n) || n.includes(bn) }) || null
}

function energyOf(breeds, race, temperament) {
  const b = findBreed(breeds, race)
  const base = (b && traitValue(b, 'energie')) ?? 50
  return clamp(base + (TEMPER_ENERGY[temperament] || 0))
}

function sociaOf(breeds, race) {
  const b = findBreed(breeds, race)
  return (b && traitValue(b, 'sociab')) ?? 50
}

const verdictOf = (score) =>
  score >= 82 ? 'Excellente compatibilité'
    : score >= 65 ? 'Bonne compatibilité'
      : score >= 45 ? 'Compatibilité modérée'
        : 'Compatibilité délicate'

// a/b : { nom, race, sexe, age, temperament? }. Renvoie { score, verdict, points }.
export function estimateDogCompat(a, b, breeds) {
  const eA = energyOf(breeds, a.race)
  const eB = energyOf(breeds, b.race, b.temperament)
  const sA = sociaOf(breeds, a.race)
  const sB = sociaOf(breeds, b.race)
  const opposite = a.sexe && b.sexe && a.sexe !== b.sexe
  const energyGap = Math.abs(eA - eB)
  const ageGap = Math.abs((Number(a.age) || 0) - (Number(b.age) || 0))

  let score = 72
  score += opposite ? 12 : -7
  score -= energyGap * 0.25
  if (energyGap < 15) score += 6
  score += (sA + sB - 100) * 0.12
  if (ageGap > 5) score -= (ageGap - 5) * 1.5
  if (b.temperament === 'Dominant') score -= 8
  if (b.temperament === 'Craintif') score -= 6
  score = clamp(score)

  const points = []
  points.push(opposite ? 'Sexes opposés : entente souvent facilitée.' : 'Même sexe : surveillez les rapports de dominance au début.')
  points.push(energyGap < 18 ? "Niveaux d'énergie proches : jeux équilibrés." : "Écart d'énergie marqué : un chien risque d'épuiser l'autre, prévoyez des temps calmes séparés.")
  if (sA < 45 || sB < 45) points.push('Sociabilité limitée chez l’un des deux : présentations progressives indispensables.')
  if (b.temperament === 'Dominant') points.push(`Tempérament dominant de ${b.nom || 'l’autre chien'} : encadrez les premières interactions.`)
  if (b.temperament === 'Craintif') points.push(`${b.nom || 'L’autre chien'} est craintif : laissez-lui le temps et une échappatoire.`)
  if (ageGap > 5) points.push('Grand écart d’âge : respectez le rythme du plus âgé.')
  points.push('Présentez-les en terrain neutre la première fois.')
  points.push('Surveillez le partage des jouets et des gamelles au début.')

  return { score, verdict: verdictOf(score), points }
}
