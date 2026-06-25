// Profil psychologique du chien : questionnaire scoré sur 6 dimensions, calcul
// d'un archétype, de points forts / de vigilance et de recommandations. Local,
// sans IA (l'écran propose une analyse IA approfondie en complément).

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))

// Dimensions évaluées (clé + libellé + phrase « point fort » associée).
export const DIMS = [
  { key: 'socia', label: 'Sociabilité', strong: 'Très sociable, facile à présenter.' },
  { key: 'energie', label: "Niveau d'énergie", strong: 'Belle vitalité, partenaire de sport.' },
  { key: 'confiance', label: 'Confiance en soi', strong: 'Assuré et stable émotionnellement.' },
  { key: 'curiosite', label: 'Curiosité', strong: 'Vif d’esprit, apprend vite.' },
  { key: 'independance', label: 'Indépendance', strong: 'Autonome, supporte bien la solitude.' },
  { key: 'calme', label: 'Maîtrise de soi', strong: 'Posé, bon self-control.' },
]

const dimLabel = (key) => (DIMS.find((d) => d.key === key) || {}).label || key

// Qualificatif court affiché à côté de chaque barre.
export function dimQualifier(key, pct) {
  const map = {
    socia: ['Réservé', 'Sélectif', 'Sociable'],
    energie: ['Calme', 'Modéré', 'Énergique'],
    confiance: ['Émotif', 'Prudent', 'Assuré'],
    curiosite: ['Peu explorateur', 'Curieux', 'Très curieux'],
    independance: ['Très attaché', 'Équilibré', 'Autonome'],
    calme: ['Impulsif', 'Posé', 'Très posé'],
  }
  const t = map[key] || ['Faible', 'Moyen', 'Élevé']
  return pct >= 67 ? t[2] : pct >= 40 ? t[1] : t[0]
}

export const PSY_QUESTIONS = [
  { q: 'Face à un inconnu dans la rue, votre chien…', opts: [
    { label: 'Fonce le saluer joyeusement', scores: { socia: 2, confiance: 2 } },
    { label: 'Observe puis approche prudemment', scores: { socia: 1, confiance: 1 } },
    { label: 'Reste en retrait ou méfiant', scores: { socia: 0, confiance: 0 } },
  ] },
  { q: 'Après une heure de promenade active, il est…', opts: [
    { label: 'Encore plein d’énergie, en redemande', scores: { energie: 2 } },
    { label: 'Content et apaisé', scores: { energie: 1 } },
    { label: 'Fatigué, il va se coucher', scores: { energie: 0 } },
  ] },
  { q: 'Devant un nouveau casse-tête ou jouet, il…', opts: [
    { label: 'L’explore et cherche à le résoudre', scores: { curiosite: 2 } },
    { label: 'Joue spontanément sans réfléchir', scores: { curiosite: 1, energie: 1 } },
    { label: 'S’en désintéresse vite', scores: { curiosite: 0 } },
  ] },
  { q: 'Quand vous quittez la pièce, il…', opts: [
    { label: 'Vous suit partout', scores: { independance: 0, socia: 1 } },
    { label: 'Reste tranquille où il est', scores: { independance: 2, calme: 1 } },
    { label: 'Cherche un instant puis se recouche', scores: { independance: 1 } },
  ] },
  { q: 'Face à un bruit soudain, il…', opts: [
    { label: 'Sursaute à peine et reste calme', scores: { confiance: 2, calme: 2 } },
    { label: 'Sursaute puis se remet vite', scores: { confiance: 1, calme: 1 } },
    { label: 'Panique ou se cache', scores: { confiance: 0, calme: 0 } },
  ] },
  { q: 'En présence d’autres chiens, il…', opts: [
    { label: 'Va jouer avec enthousiasme', scores: { socia: 2, energie: 1 } },
    { label: 'Salue poliment puis vaque', scores: { socia: 1 } },
    { label: 'Les évite ou se raidit', scores: { socia: 0 } },
  ] },
  { q: 'Quand il veut quelque chose (sortie, jeu), il…', opts: [
    { label: 'Insiste fort (aboie, saute)', scores: { calme: 0, energie: 1 } },
    { label: 'Sollicite puis attend', scores: { calme: 1 } },
    { label: 'Patiente calmement', scores: { calme: 2 } },
  ] },
  { q: 'Pour apprendre un nouvel ordre, il…', opts: [
    { label: 'Comprend très vite', scores: { curiosite: 2, confiance: 1 } },
    { label: 'Apprend avec de la répétition', scores: { curiosite: 1 } },
    { label: 'Se décourage ou se distrait', scores: { curiosite: 0 } },
  ] },
  { q: 'Dans un lieu inconnu (café, gare), il…', opts: [
    { label: 'Explore, parfaitement à l’aise', scores: { confiance: 2, curiosite: 1 } },
    { label: 'Reste près de vous et observe', scores: { confiance: 1, socia: 1 } },
    { label: 'Est tendu et veut partir', scores: { confiance: 0 } },
  ] },
  { q: 'Laissé seul à la maison, il est…', opts: [
    { label: 'Parfaitement serein', scores: { independance: 2, calme: 1 } },
    { label: 'Un peu en attente puis OK', scores: { independance: 1 } },
    { label: 'Stressé (vocalises, dégâts)', scores: { independance: 0, calme: 0 } },
  ] },
  { q: 'Son moment préféré, c’est…', opts: [
    { label: 'Courir et se dépenser sans fin', scores: { energie: 2 } },
    { label: 'Résoudre, fouiller, chercher', scores: { curiosite: 2 } },
    { label: 'Des câlins au calme', scores: { socia: 1, calme: 1, energie: 0 } },
  ] },
]

// Archétypes (du plus spécifique au plus général). match(d) reçoit les scores
// 0–100 par dimension.
const ARCHETYPES = [
  { name: 'Le sensible prudent', match: (d) => d.confiance <= 38,
    blurb: 'Chien émotif et attentif à son environnement. Il a besoin de prévisibilité et de douceur pour gagner en assurance.' },
  { name: 'La pile électrique', match: (d) => d.energie >= 65 && d.calme <= 40,
    blurb: 'Débordant d’énergie et facilement excité. Sans cadre ni dépense suffisante, il peine à se poser.' },
  { name: 'Le travailleur cérébral', match: (d) => d.energie >= 58 && d.curiosite >= 62,
    blurb: 'Vif, endurant et avide de défis. Il s’épanouit dans le travail, l’apprentissage et les jeux de réflexion.' },
  { name: 'L’explorateur enthousiaste', match: (d) => d.socia >= 58 && d.energie >= 58,
    blurb: 'Curieux, sociable et plein d’allant. Il a besoin de nouveauté et d’interactions ; l’ennui est son principal ennemi.' },
  { name: 'Le pot-de-colle affectueux', match: (d) => d.socia >= 55 && d.independance <= 42,
    blurb: 'Très attaché et démonstratif. Il vit pour vous, mais doit apprendre à rester serein quand il est seul.' },
  { name: 'L’indépendant serein', match: (d) => d.independance >= 58 && d.calme >= 52,
    blurb: 'Autonome et posé. Il apprécie votre compagnie sans en dépendre et gère bien la solitude.' },
  { name: 'Le tranquille pantouflard', match: (d) => d.energie <= 42 && d.calme >= 52,
    blurb: 'Calme et casanier. Quelques sorties tranquilles et de la douceur suffisent à son bonheur.' },
  { name: 'L’équilibré polyvalent', match: () => true,
    blurb: 'Tempérament équilibré, sans excès marqué. Adaptable, il convient à de nombreux modes de vie.' },
]

function buildStrengths(dims) {
  return dims.filter((d) => d.pct >= 65).map((d) => DIMS.find((x) => x.key === d.key).strong)
}

function buildWatch(d) {
  const w = []
  if (d.confiance <= 40) w.push('Émotivité : désensibilisation douce, évitez les expositions brutales.')
  if (d.calme <= 40) w.push('Impulsivité : travaillez le retour au calme et l’auto-contrôle.')
  if (d.socia <= 40) w.push('Sociabilité sélective : privilégiez des rencontres choisies et positives.')
  if (d.independance <= 40) w.push('Dépendance affective : construisez l’autonomie par des absences progressives.')
  if (d.energie >= 72) w.push('Forte énergie : prévoyez une dépense physique et mentale quotidienne.')
  return w
}

function buildRecos(d, arch) {
  const r = []
  if (d.energie >= 60) r.push('Prévoyez 2 sorties actives par jour et un vrai défouloir.')
  if (d.curiosite >= 60) r.push('10 min de jeux d’intelligence ou de flair chaque jour.')
  if (d.calme <= 45) r.push('Instaurez des routines de retour au calme (tapis, mastication).')
  if (d.confiance <= 45) r.push('Avancez par paliers face aux situations nouvelles, sans forcer.')
  if (d.independance <= 45) r.push('Travaillez les absences progressivement pour bâtir l’autonomie.')
  if (d.socia <= 45) r.push('Multipliez les rencontres positives et contrôlées.')
  if (d.socia >= 65) r.push('Profitez de sa sociabilité : sorties collectives et congénères.')
  if (d.curiosite >= 65 && d.energie < 60) r.push('Misez sur les jeux de réflexion plutôt que le sport intensif.')
  // Toujours au moins un repère général.
  r.push('Privilégiez le renforcement positif, en séances courtes et fréquentes.')
  return [...new Set(r)].slice(0, 6)
}

export function computeProfile(answers) {
  const sum = {}, max = {}
  PSY_QUESTIONS.forEach((q, qi) => {
    const localMax = {}
    q.opts.forEach((o) => Object.entries(o.scores).forEach(([k, v]) => { localMax[k] = Math.max(localMax[k] || 0, v) }))
    Object.entries(localMax).forEach(([k, v]) => { max[k] = (max[k] || 0) + v })
    const chosen = q.opts[answers[qi]] || q.opts[0]
    Object.entries(chosen.scores).forEach(([k, v]) => { sum[k] = (sum[k] || 0) + v })
  })
  const dims = DIMS.map((d) => ({ key: d.key, label: d.label, pct: max[d.key] ? clamp((sum[d.key] / max[d.key]) * 100) : 50 }))
  const byKey = Object.fromEntries(dims.map((d) => [d.key, d.pct]))
  const arch = ARCHETYPES.find((a) => a.match(byKey)) || ARCHETYPES[ARCHETYPES.length - 1]
  return {
    dims,
    archetype: arch.name,
    blurb: arch.blurb,
    strengths: buildStrengths(dims),
    watch: buildWatch(byKey),
    recos: buildRecos(byKey, arch),
  }
}

// Résumé textuel du profil, pour l'analyse IA approfondie.
export function profileSummary(profile) {
  const dims = profile.dims.map((d) => `${dimLabel(d.key)} ${d.pct}%`).join(', ')
  return `archétype « ${profile.archetype} » ; ${dims}`
}
