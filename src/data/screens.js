// Screen registry: id -> { title, tab, root }
// tab is the parent bottom-tab; root screens hide the back arrow.
export const SCREENS = {
  home: { title: 'Bonjour 👋', tab: 'home', root: true },
  tools: { title: 'Fonctions', tab: 'tools', root: true },
  carnet: { title: 'Carnet de santé', tab: 'health', root: true },
  profile: { title: 'Profil de Stanley', tab: 'profile', root: true },
  catalogue: { title: 'Catalogue des races', tab: 'home' },
  identify: { title: 'Identification', tab: 'tools' },
  morpho: { title: 'Analyse morphologique', tab: 'tools' },
  compare: { title: 'Comparateur de races', tab: 'tools' },
  fiche: { title: 'Fiche de race', tab: 'tools' },
  behavior: { title: 'Assistant comportement', tab: 'tools' },
  psy: { title: 'Profil psychologique', tab: 'profile' },
  compat: { title: 'Compatibilité', tab: 'tools' },
  pedigree: { title: 'Pedigree', tab: 'profile' },
  healthphoto: { title: 'Analyse santé photo', tab: 'health' },
  translate: { title: 'Traducteur canin', tab: 'tools' },
  coach: { title: 'Coach éducation', tab: 'tools' },
  activities: { title: 'Activités du jour', tab: 'tools' },
  simulator: { title: "Simulateur d'adoption", tab: 'tools' },
  lifestyle: { title: 'Analyse du mode de vie', tab: 'tools' },
  agehuman: { title: 'Âge humain', tab: 'health' },
  weight: { title: 'Poids & forme', tab: 'health' },
  activitylevel: { title: "Niveau d'activité", tab: 'tools' },
  barkprevent: { title: 'Anti-aboiement', tab: 'tools' },
  weatherprog: { title: 'Programmes météo', tab: 'tools' },
  bodylang: { title: 'Langage corporel', tab: 'tools' },
  genetics: { title: 'Maladies génétiques', tab: 'health' },
  nutrition: { title: 'Assistant alimentation', tab: 'health' },
  recipes: { title: 'Recettes maison', tab: 'health' },
  worldmap: { title: 'Carte des races', tab: 'tools' },
  timeline: { title: 'Chronologie de vie', tab: 'profile' },
  predictive: { title: 'Analyse prédictive', tab: 'health' },
  pain: { title: 'Détection de douleur', tab: 'health' },
  walkroute: { title: 'Parcours de promenade', tab: 'tools' },
  barkrecog: { title: "Reconnaissance d'aboiement", tab: 'tools' },
  mentalex: { title: 'Exercices mentaux', tab: 'tools' },
  dogcompat: { title: 'Compatibilité entre chiens', tab: 'tools' },
  vetprep: { title: 'Pré-consultation véto', tab: 'health' },
  whydog: { title: 'Pourquoi mon chien ?', tab: 'tools' },
  twin: { title: 'Jumeau numérique', tab: 'profile' },
  settings: { title: 'Paramètres', tab: 'profile' },
}

// Tab -> root screen id
export const TAB_ROOT = { home: 'home', tools: 'tools', health: 'carnet', profile: 'profile' }

export function tabOf(screen) {
  return (SCREENS[screen] || SCREENS.home).tab
}
