// Local morphology → breed estimator. Turns the criteria chosen on the Morpho
// screen into a ranked list of probable breeds, so the result reflects the input
// instead of being hardcoded. Works fully offline; the AI panel below the bars
// stays available for a deeper narrative analysis.

export const MORPHO_OPTIONS = [
  { k: 'Taille au garrot', options: ['Petite (< 40 cm)', 'Moyenne (40–55 cm)', 'Grande (> 55 cm)'] },
  { k: 'Poids', options: ['Léger (< 12 kg)', 'Moyen (12–25 kg)', 'Lourd (> 25 kg)'] },
  { k: 'Forme des oreilles', options: ['Tombantes longues', 'Tombantes courtes', 'Dressées', 'Semi-dressées'] },
  { k: 'Longueur du museau', options: ['Court', 'Moyen', 'Long'] },
  { k: 'Type de poil', options: ['Court lisse', 'Mi-long ondulé', 'Long', 'Dur / filaire', 'Bouclé'] },
  { k: 'Couleur', options: ['Fauve', 'Doré', 'Noir', 'Noir & feu', 'Bringé', 'Blanc', 'Tricolore', 'Gris / bleu'] },
]

export const MORPHO_DEFAULTS = {
  'Taille au garrot': 'Petite (< 40 cm)',
  Poids: 'Moyen (12–25 kg)',
  'Forme des oreilles': 'Tombantes longues',
  'Longueur du museau': 'Moyen',
  'Type de poil': 'Mi-long ondulé',
  Couleur: 'Fauve',
}

// Compact breed knowledge base keyed on the same option vocabulary.
const BREEDS = [
  { name: 'Cocker Spaniel Anglais', taille: 'Petite (< 40 cm)', poids: 'Moyen (12–25 kg)', oreilles: 'Tombantes longues', museau: 'Moyen', poil: 'Mi-long ondulé', couleurs: ['Fauve', 'Doré', 'Noir', 'Tricolore'] },
  { name: 'Cocker Américain', taille: 'Petite (< 40 cm)', poids: 'Léger (< 12 kg)', oreilles: 'Tombantes longues', museau: 'Court', poil: 'Long', couleurs: ['Fauve', 'Doré', 'Noir'] },
  { name: 'Springer Spaniel', taille: 'Moyenne (40–55 cm)', poids: 'Moyen (12–25 kg)', oreilles: 'Tombantes longues', museau: 'Moyen', poil: 'Mi-long ondulé', couleurs: ['Tricolore', 'Noir', 'Blanc'] },
  { name: 'Setter Anglais', taille: 'Grande (> 55 cm)', poids: 'Lourd (> 25 kg)', oreilles: 'Tombantes longues', museau: 'Long', poil: 'Long', couleurs: ['Tricolore', 'Blanc'] },
  { name: 'Labrador Retriever', taille: 'Grande (> 55 cm)', poids: 'Lourd (> 25 kg)', oreilles: 'Tombantes courtes', museau: 'Moyen', poil: 'Court lisse', couleurs: ['Fauve', 'Doré', 'Noir'] },
  { name: 'Golden Retriever', taille: 'Grande (> 55 cm)', poids: 'Lourd (> 25 kg)', oreilles: 'Tombantes courtes', museau: 'Long', poil: 'Long', couleurs: ['Doré', 'Fauve'] },
  { name: 'Berger Allemand', taille: 'Grande (> 55 cm)', poids: 'Lourd (> 25 kg)', oreilles: 'Dressées', museau: 'Long', poil: 'Mi-long ondulé', couleurs: ['Noir & feu', 'Noir'] },
  { name: 'Border Collie', taille: 'Moyenne (40–55 cm)', poids: 'Moyen (12–25 kg)', oreilles: 'Semi-dressées', museau: 'Moyen', poil: 'Mi-long ondulé', couleurs: ['Tricolore', 'Noir', 'Blanc'] },
  { name: 'Beagle', taille: 'Petite (< 40 cm)', poids: 'Moyen (12–25 kg)', oreilles: 'Tombantes longues', museau: 'Moyen', poil: 'Court lisse', couleurs: ['Tricolore', 'Fauve'] },
  { name: 'Teckel', taille: 'Petite (< 40 cm)', poids: 'Léger (< 12 kg)', oreilles: 'Tombantes longues', museau: 'Long', poil: 'Court lisse', couleurs: ['Fauve', 'Noir & feu'] },
  { name: 'Jack Russell', taille: 'Petite (< 40 cm)', poids: 'Léger (< 12 kg)', oreilles: 'Semi-dressées', museau: 'Moyen', poil: 'Dur / filaire', couleurs: ['Blanc', 'Tricolore'] },
  { name: 'Caniche', taille: 'Moyenne (40–55 cm)', poids: 'Moyen (12–25 kg)', oreilles: 'Tombantes longues', museau: 'Long', poil: 'Bouclé', couleurs: ['Noir', 'Blanc', 'Fauve'] },
  { name: 'Husky Sibérien', taille: 'Grande (> 55 cm)', poids: 'Lourd (> 25 kg)', oreilles: 'Dressées', museau: 'Moyen', poil: 'Mi-long ondulé', couleurs: ['Gris / bleu', 'Noir'] },
  { name: 'Bouledogue Français', taille: 'Petite (< 40 cm)', poids: 'Léger (< 12 kg)', oreilles: 'Dressées', museau: 'Court', poil: 'Court lisse', couleurs: ['Bringé', 'Fauve'] },
]

const W = { taille: 3, poids: 2, oreilles: 3, museau: 2, poil: 3, couleur: 1 }

function scoreBreed(b, f) {
  let s = 0
  if (b.taille === f['Taille au garrot']) s += W.taille
  if (b.poids === f.Poids) s += W.poids
  if (b.oreilles === f['Forme des oreilles']) s += W.oreilles
  if (b.museau === f['Longueur du museau']) s += W.museau
  if (b.poil === f['Type de poil']) s += W.poil
  if (b.couleurs.includes(f.Couleur)) s += W.couleur
  return s
}

// Returns up to 4 { name, pct } ranked, percentages summing to ~100.
export function estimateBreeds(fields) {
  const ranked = BREEDS
    .map((b) => ({ name: b.name, score: scoreBreed(b, fields) + 0.3 })) // small floor avoids all-zero
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  const total = ranked.reduce((sum, r) => sum + r.score, 0)
  const out = ranked.map((r) => ({ name: r.name, pct: Math.round((r.score / total) * 100) }))
  // Correct rounding drift onto the top breed so the bars total 100 %.
  const drift = 100 - out.reduce((sum, r) => sum + r.pct, 0)
  if (out.length) out[0].pct += drift
  return out
}
