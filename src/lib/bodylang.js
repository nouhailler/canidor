// Langage corporel : grille d'observation guidée. L'utilisateur renseigne ce
// qu'il voit (contexte + signaux corporels), on en construit une description
// envoyée à l'IA texte — ce qui fonctionne même avec les modèles gratuits
// d'OpenRouter (pas besoin d'analyse d'image). La photo reste un bonus quand un
// modèle vision est configuré.

export const BODYLANG_FIELDS = [
  { k: 'Contexte', options: ['Au repos', 'Face à un inconnu', 'Face à un autre chien', 'Pendant le jeu', 'À un bruit fort', 'Près de sa gamelle / son jouet', 'À votre départ', 'En balade', 'Chez le vétérinaire'] },
  { k: 'Oreilles', options: ['Neutres', 'Dressées vers l’avant', 'En arrière / plaquées', 'Mobiles, qui bougent'] },
  { k: 'Queue', options: ['À l’horizontale', 'Haute et raide', 'Haute, remue vite', 'Remue souplement (tout l’arrière)', 'Basse', 'Entre les pattes'] },
  { k: 'Posture', options: ['Détendue', 'Penchée vers l’avant', 'En retrait / reculée', 'Figée / raide', 'Basse / accroupie', 'Révérence (avant bas, arrière haut)', 'Couché sur le dos'] },
  { k: 'Yeux / regard', options: ['Doux, clignements', 'Fixe et intense', 'Évite le regard', 'Blanc de l’œil visible (œil de baleine)', 'Pupilles dilatées'] },
  { k: 'Gueule / babines', options: ['Détendue, légèrement ouverte', 'Fermée et tendue', 'Babines retroussées (dents visibles)', 'Halètement', 'Se lèche les babines / bâille'] },
  { k: 'Poils (dos / nuque)', options: ['Normaux', 'Hérissés (pilo-érection)'] },
  { k: 'Vocalises', options: ['Aucune', 'Aboiements', 'Grognements', 'Gémissements / couinements', 'Grognement + aboiement'] },
  { k: 'Mouvement', options: ['Immobile, détendu', 'Figé / tendu', 'Agité / excité', 'S’approche', 'S’éloigne / fuit', 'Tourne en rond'] },
  { k: 'Signaux d’apaisement', options: ['Aucun', 'Bâillement', 'Léchage de truffe', 'Détourne la tête', 'Renifle le sol', 'Se secoue'] },
]

export const BODYLANG_DEFAULTS = Object.fromEntries(BODYLANG_FIELDS.map((f) => [f.k, f.options[0]]))

// Description textuelle des signaux observés (+ détails libres), pour l'IA.
export function buildDescription(fields, extra) {
  const parts = BODYLANG_FIELDS.map((f) => `${f.k} : ${fields[f.k]}`)
  if (extra && extra.trim()) parts.push(`Autres détails : ${extra.trim()}`)
  return parts.join(' ; ')
}
