import { C } from '../theme'

// Fonctions grid — 7 sections, each with a pastel tile tint and its items.
export const TOOL_GROUPS = [
  {
    label: 'Identité & races', tint: C.tintSable, items: [
      { icon: '📷', title: 'Identification photo', id: 'identify' },
      { icon: '📐', title: 'Analyse morphologique', id: 'morpho' },
      { icon: '⚖', title: 'Comparateur', id: 'compare' },
      { icon: '📖', title: 'Fiche de race', id: 'fiche' },
      { icon: '🐾', title: 'Catalogue des races', id: 'catalogue' },
      { icon: '🗺', title: 'Carte du monde', id: 'worldmap' },
      { icon: '🧬', title: 'Maladies génétiques', id: 'genetics' },
    ],
  },
  {
    label: 'Adoption & compatibilité', tint: C.tintSauge, items: [
      { icon: '🏠', title: 'Mode de vie', id: 'lifestyle' },
      { icon: '🏡', title: 'Compatibilité adoption', id: 'compat' },
      { icon: '🤝', title: 'Compatibilité chiens', id: 'dogcompat' },
      { icon: '🔮', title: "Simulateur d'adoption", id: 'simulator' },
    ],
  },
  {
    label: 'Comportement & langage', tint: C.tintBlush, items: [
      { icon: '💬', title: 'Assistant comportement', id: 'behavior' },
      { icon: '🧭', title: 'Profil psychologique', id: 'psy' },
      { icon: '🎥', title: 'Traducteur (vidéo)', id: 'translate' },
      { icon: '🐕', title: 'Langage corporel', id: 'bodylang' },
      { icon: '❓', title: 'Pourquoi mon chien ?', id: 'whydog' },
      { icon: '🔊', title: 'Reconnaissance aboiement', id: 'barkrecog' },
      { icon: '🤫', title: 'Anti-aboiement', id: 'barkprevent' },
    ],
  },
  {
    label: 'Santé & prévention', tint: C.tintMenthe, items: [
      { icon: '♥', title: 'Carnet de santé', id: 'carnet' },
      { icon: '🔬', title: 'Analyse santé photo', id: 'healthphoto' },
      { icon: '⚖', title: 'Poids & forme', id: 'weight' },
      { icon: '⏳', title: 'Âge humain', id: 'agehuman' },
      { icon: '🩺', title: 'Détection de douleur', id: 'pain' },
      { icon: '📊', title: 'Analyse prédictive', id: 'predictive' },
      { icon: '📋', title: 'Pré-consultation véto', id: 'vetprep' },
    ],
  },
  {
    label: 'Alimentation', tint: C.tintArgile, items: [
      { icon: '🍖', title: 'Assistant alimentation', id: 'nutrition' },
      { icon: '👨‍🍳', title: 'Recettes maison', id: 'recipes' },
    ],
  },
  {
    label: 'Activité & éducation', tint: C.tintCiel, items: [
      { icon: '🎓', title: "Coach d'éducation", id: 'coach' },
      { icon: '☀', title: 'Activités du jour', id: 'activities' },
      { icon: '🌦', title: 'Programmes météo', id: 'weatherprog' },
      { icon: '🧭', title: 'Parcours de promenade', id: 'walkroute' },
      { icon: '🧠', title: 'Exercices mentaux', id: 'mentalex' },
      { icon: '📈', title: "Niveau d'activité", id: 'activitylevel' },
    ],
  },
  {
    label: 'Suivi & avancé', tint: C.tintLilas, items: [
      { icon: '🕓', title: 'Chronologie de vie', id: 'timeline' },
      { icon: '✨', title: 'Jumeau numérique', id: 'twin' },
      { icon: '🌳', title: 'Pedigree & lignées', id: 'pedigree' },
    ],
  },
]

export const HOME_QUICK = [
  { icon: '💬', tint: C.tintBlush, title: 'Comportement', sub: 'Poser un problème', id: 'behavior' },
  { icon: '🎥', tint: C.tintCiel, title: 'Traducteur', sub: 'Filmer Stanley', id: 'translate' },
  { icon: '🧭', tint: C.tintLilas, title: 'Profil psy.', sub: 'Test 4 questions', id: 'psy' },
  { icon: '☀', tint: C.tintSable, title: 'Activités', sub: 'Selon la météo', id: 'activities' },
]

export const HOME_ALERTS = [
  { text: 'Rappel vaccin CHPPiL', when: 'dans 15 j', color: C.warn },
  { text: 'Vermifuge à renouveler', when: 'dans 24 j', color: C.successDk },
]

export const PROFILE_LINKS = [
  { icon: '🧭', title: 'Profil psychologique', id: 'psy' },
  { icon: '🌳', title: 'Pedigree & lignées', id: 'pedigree' },
  { icon: '📖', title: 'Fiche de race', id: 'fiche' },
  { icon: '♥', title: 'Carnet de santé', id: 'carnet' },
  { icon: '⚙', title: 'Paramètres', id: 'settings' },
]
