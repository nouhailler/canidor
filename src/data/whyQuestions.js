// Catalogue de situations « Pourquoi mon chien… » classées par contexte, pour
// aider l'utilisateur à retrouver son cas sans avoir à le formuler finement.
// Les réponses détaillées sont fournies par l'IA (bouton « Demander à l'IA »),
// sauf pour quelques cas très courants pré-renseignés (WHY_STATIC).

export const WHY_CATEGORIES = [
  { cat: 'À la maison', icon: '🏠', questions: [
    'Tourne sur lui-même avant de se coucher',
    'Me suit dans toutes les pièces',
    'Aboie à la sonnette ou à la porte',
    'Gratte le sol ou son panier avant de dormir',
    'Détruit des objets quand je suis absent',
    'Bâille quand je le caresse',
    'Pousse des objets ou ma main avec son nez',
    'Se couche contre moi ou sur mes pieds',
  ] },
  { cat: 'Dehors & en balade', icon: '🌳', questions: [
    'Tire en laisse',
    'Mange de l’herbe',
    'Se roule dans l’herbe ou des odeurs fortes',
    'Renifle longuement chaque recoin',
    'Se fige et refuse d’avancer',
    'Ramasse et avale tout ce qu’il trouve',
    'Aboie sur les vélos',
    'Court après les voitures',
  ] },
  { cat: 'Repas & nourriture', icon: '🦴', questions: [
    'Engloutit sa gamelle très vite',
    'Grogne quand on approche de sa gamelle',
    'Enterre ou cache sa nourriture',
    'Refuse de manger quand il est seul',
    'Quémande à table',
    'Boit énormément d’eau',
    'Trie et laisse certaines croquettes',
  ] },
  { cat: 'Besoins & propreté', icon: '🚽', questions: [
    'Fait ses besoins à l’intérieur',
    'Mange ses crottes (coprophagie)',
    'Marque son territoire un peu partout',
    'Gratte le sol après avoir fait ses besoins',
    'Tourne longtemps avant de se soulager',
    'Veut toujours le même endroit',
  ] },
  { cat: 'Avec des personnes', icon: '🧍', questions: [
    'Aboie sur le facteur ou le livreur',
    'Saute sur les invités',
    'A peur des inconnus',
    'Grogne sur les hommes (casquette, parapluie…)',
    'Se cache derrière moi',
    'Réclame sans cesse de l’attention',
  ] },
  { cat: 'Avec d’autres chiens', icon: '🐕', questions: [
    'Tire pour aller voir les autres chiens',
    'Grogne ou aboie sur les autres chiens',
    'A peur des grands chiens',
    'S’impose face aux petits chiens',
    'Renifle l’arrière-train des autres',
    'S’excite puis s’énerve en laisse (frustration)',
  ] },
  { cat: 'Avec les enfants', icon: '🧒', questions: [
    'A peur des jeunes enfants',
    'Devient surexcité avec les enfants',
    'Surveille ou « garde » le bébé',
    'Grogne si un enfant approche de sa gamelle',
    'Se met à l’écart quand les enfants jouent',
  ] },
  { cat: 'Sommeil & repos', icon: '😴', questions: [
    'Dort énormément dans la journée',
    'Court ou gémit en dormant',
    'Refuse de dormir seul',
    'Se colle à moi la nuit',
    'Se réveille et s’agite la nuit',
  ] },
  { cat: 'Eau, chaleur & météo', icon: '🌦️', questions: [
    'A peur de l’eau ou du bain',
    'Adore se baigner et boire dans les flaques',
    'Halète beaucoup quand il fait chaud',
    'Tremble quand il fait froid',
    'Panique pendant les orages ou feux d’artifice',
    'Creuse un trou pour se rafraîchir',
  ] },
  { cat: 'Hormones & reproduction', icon: '🧬', questions: [
    'Chevauche des coussins, des pattes ou des jambes',
    'Réagit fortement en présence d’une femelle',
    'Devient agité ou fugue (chaleurs alentour)',
    'Marque beaucoup plus que d’habitude',
  ] },
  { cat: 'Toilettage & corps', icon: '🐾', questions: [
    'Se lèche frénétiquement les pattes',
    'Se mordille la base de la queue',
    'Traîne l’arrière-train sur le sol',
    'Secoue souvent la tête',
    'Penche la tête quand je parle',
    'Éternue pendant le jeu',
  ] },
  { cat: 'Émotions & stress', icon: '💭', questions: [
    'Tremble sans raison apparente',
    'Se lèche les babines ou bâille dans certaines situations',
    'Halète alors qu’il n’a pas chaud',
    'Devient soudainement collant',
    'Détourne le regard quand je le gronde',
  ] },
]

// Réponses instantanées (sans IA) pour quelques cas très fréquents.
export const WHY_STATIC = {
  'Tourne sur lui-même avant de se coucher': { origin: "Comportement ancestral : aplatir l'herbe et vérifier les alentours avant de se coucher.", freq: 'Tout à fait normal et fréquent.', alert: 'Si cela devient obsessif ou douloureux, consultez.' },
  'Mange de l’herbe': { origin: 'Régulation digestive ou simple appétence ; comportement courant.', freq: 'Occasionnel = normal.', alert: 'Si quotidien avec vomissements répétés, consultez.' },
  'Penche la tête quand je parle': { origin: "Ajustement de l'ouïe et lecture de vos expressions ; signe d'attention.", freq: 'Normal et plutôt bon signe.', alert: 'Si la tête reste penchée en permanence, vérifiez les oreilles.' },
  'Se lèche frénétiquement les pattes': { origin: 'Stress, allergie ou irritation cutanée.', freq: 'Léger et ponctuel = souvent normal.', alert: 'Si rougeurs, perte de poils ou léchage constant, consultez.' },
}
