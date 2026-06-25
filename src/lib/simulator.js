// Simulateur d'adoption : à partir d'une race du catalogue, estime ce que
// représente la vie avec ce chien (activité, stimulation, bruit, poils, santé,
// budget, temps quotidien). Heuristiques locales basées sur les traits et les
// données de la fiche. Fonctionne hors-ligne.

import { traitValue, breedRange } from './breedFilters'

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))
const tier = (v) => (v >= 80 ? 'Très élevé' : v >= 60 ? 'Élevé' : v >= 40 ? 'Modéré' : 'Faible')

function formatEuro(n) {
  const rounded = Math.round(n / 50) * 50
  return `≈ ${rounded.toLocaleString('fr-FR')} € / an`
}

function formatTime(hours) {
  const mins = Math.round((hours * 60) / 15) * 15
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h <= 0) return `≈ ${m} min / jour`
  return m ? `≈ ${h} h ${m} / jour` : `≈ ${h} h / jour`
}

// breed → { rows:[[label, value, tag]], annual, time, note }
export function estimateSimulation(breed) {
  const energy = traitValue(breed, 'energie') ?? 50
  const educ = traitValue(breed, 'facilit') ?? 50
  const entretien = traitValue(breed, 'entretien') ?? 50

  const mental = clamp(energy * 0.6 + (100 - educ) * 0.2 + 10)
  const bruit = clamp(energy * 0.4 + 25)

  const sante = Array.isArray(breed.sante) ? breed.sante : []
  const risques = clamp(sante.length * 22)
  const santeTag = sante.length ? sante.slice(0, 2).join(', ') : 'Peu de prédispositions'

  const poilsTag = entretien >= 80 ? 'Mue intense' : entretien >= 60 ? 'Mue forte' : entretien >= 40 ? 'Modérée' : 'Réduite'

  const rows = [
    ['Activité sportive', energy, tier(energy)],
    ['Stimulation mentale', mental, tier(mental)],
    ['Niveau de bruit', bruit, bruit >= 60 ? 'Vocal' : bruit >= 40 ? 'Modéré' : 'Discret'],
    ['Quantité de poils', entretien, poilsTag],
    ['Risques santé', risques, santeTag],
  ]

  // Budget : taille (poids) + entretien + suivi santé.
  const wRange = breedRange(breed, 'poids')
  const weight = wRange ? (wRange[0] + wRange[1]) / 2 : 20
  const annual = formatEuro(700 + weight * 45 + entretien * 4 + sante.length * 80)

  // Temps quotidien : surtout porté par l'énergie.
  const time = formatTime(0.5 + (energy / 100) * 2)

  const note =
    `Vivre avec un ${breed.nom} représente ${time.replace('≈ ', 'environ ')} d'activité et ` +
    `${mental >= 70 ? 'un fort' : mental >= 45 ? 'un réel' : 'un léger'} besoin de stimulation mentale.` +
    (entretien >= 70 ? ' Prévoyez un entretien du poil régulier.' : '') +
    (energy >= 75 ? ' Peu adapté à une vie sédentaire.' : '')

  return { rows, annual, time, note }
}
