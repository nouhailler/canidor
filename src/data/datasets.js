// All static datasets ported faithfully from the prototype's Component class.

export const OB = [
  {
    kicker: 'Bienvenue',
    title: 'Tout pour votre chien, au même endroit',
    body: 'Identification, santé, comportement et éducation — un compagnon intelligent pour mieux comprendre Stanley.',
    features: ['Reconnaissance de race par photo', 'Carnet de santé avec rappels', "Coach d'éducation personnalisé"],
  },
  {
    kicker: 'Intelligence',
    title: 'Une IA qui observe avec vous',
    body: 'Analysez une photo, traduisez une posture, identifiez un problème de comportement — en quelques secondes.',
    features: ['Traducteur de comportement', 'Analyse santé par photo', 'Assistant comportemental'],
  },
  {
    kicker: 'Au quotidien',
    title: 'Des conseils adaptés, chaque jour',
    body: "L'app s'ajuste à la race, l'âge et l'énergie de votre chien pour des recommandations vraiment utiles.",
    features: ['Activités selon la météo', 'Profil psychologique', "Programme d'éducation par paliers"],
  },
]

export const COCKER = {
  nom: 'Cocker Spaniel Anglais',
  origine: 'Royaume-Uni',
  groupe: 'Groupe 8 (Leveurs & rapporteurs)',
  vie: '12 – 15 ans',
  poids: '13 – 14,5 kg',
  taille: '38 – 41 cm',
  histoire:
    'Développé au pays de Galles et en Angleterre pour lever et rapporter la bécasse (“woodcock”), d’où son nom. Le plus petit des chiens de chasse leveurs britanniques, devenu chien de compagnie très populaire au XXe siècle.',
  traits: [["Niveau d'énergie", 72], ["Besoin d'exercice", 70], ['Intelligence', 80], ["Facilité d'éducation", 75], ['Entretien du poil', 82], ['Sociabilité', 90]],
  sante: ['Otites (oreilles tombantes)', 'Atrophie rétinienne progressive', 'Dysplasie de la hanche', 'Affections oculaires', 'Surpoids si sous-exercé'],
  tags: ['Affectueux', 'Joyeux', 'Sportif', 'Sensible'],
}

export const BREEDS = [
  { nom: 'Cocker Spaniel Anglais', groupe: 'Groupe 8', origine: 'Royaume-Uni', taille: '38–41 cm', poids: '13–14,5 kg', vie: '12–15 ans', tags: ['Affectueux', 'Joyeux', 'Sportif'], traits: [['Énergie', 72], ["Facilité d'éducation", 75], ['Sociabilité', 90], ['Entretien du poil', 82]], note: 'Oreilles tombantes à surveiller (otites). Idéal en famille active.' },
  { nom: 'Berger Australien', groupe: 'Groupe 1', origine: 'États-Unis', taille: '46–58 cm', poids: '16–32 kg', vie: '12–15 ans', tags: ['Intelligent', 'Actif', 'Loyal'], traits: [['Énergie', 95], ["Facilité d'éducation", 85], ['Sociabilité', 80], ['Entretien du poil', 65]], note: 'Très fort besoin de stimulation mentale et physique.' },
  { nom: 'Cavalier King Charles', groupe: 'Groupe 9', origine: 'Royaume-Uni', taille: '30–33 cm', poids: '5–8 kg', vie: '9–14 ans', tags: ['Doux', 'Câlin', 'Sociable'], traits: [['Énergie', 45], ["Facilité d'éducation", 70], ['Sociabilité', 95], ['Entretien du poil', 60]], note: 'Parfait en appartement. Sensible aux affections cardiaques.' },
  { nom: 'Husky Sibérien', groupe: 'Groupe 5', origine: 'Sibérie', taille: '50–60 cm', poids: '16–27 kg', vie: '12–15 ans', tags: ['Endurant', 'Indépendant', 'Vocal'], traits: [['Énergie', 95], ["Facilité d'éducation", 55], ['Sociabilité', 70], ['Entretien du poil', 70]], note: "Grand fugueur, supporte mal la chaleur. ~2 h d'activité/jour." },
  { nom: 'Bouledogue Français', groupe: 'Groupe 9', origine: 'France', taille: '27–35 cm', poids: '8–14 kg', vie: '10–12 ans', tags: ['Calme', 'Affectueux', 'Drôle'], traits: [['Énergie', 40], ["Facilité d'éducation", 65], ['Sociabilité', 85], ['Entretien du poil', 30]], note: 'Brachycéphale : respiration à surveiller, effort par temps chaud.' },
  { nom: 'Border Collie', groupe: 'Groupe 1', origine: 'Royaume-Uni', taille: '46–56 cm', poids: '12–20 kg', vie: '12–15 ans', tags: ['Vif', 'Brillant', 'Travailleur'], traits: [['Énergie', 98], ["Facilité d'éducation", 95], ['Sociabilité', 70], ['Entretien du poil', 60]], note: "La race la plus intelligente : s'ennuie vite sans occupation." },
  { nom: 'Golden Retriever', groupe: 'Groupe 8', origine: 'Royaume-Uni', taille: '51–61 cm', poids: '25–34 kg', vie: '10–12 ans', tags: ['Gentil', 'Patient', 'Fidèle'], traits: [['Énergie', 70], ["Facilité d'éducation", 90], ['Sociabilité', 95], ['Entretien du poil', 70]], note: 'Excellent chien de famille. Sujet à la dysplasie.' },
  { nom: 'Beagle', groupe: 'Groupe 6', origine: 'Royaume-Uni', taille: '33–40 cm', poids: '9–11 kg', vie: '12–15 ans', tags: ['Curieux', 'Gourmand', 'Joueur'], traits: [['Énergie', 80], ["Facilité d'éducation", 55], ['Sociabilité', 85], ['Entretien du poil', 40]], note: 'Suit son flair : rappel difficile, tendance à la prise de poids.' },
  { nom: 'Carlin', groupe: 'Groupe 9', origine: 'Chine', taille: '25–30 cm', poids: '6–8 kg', vie: '12–15 ans', tags: ['Affectueux', 'Comique', 'Calme'], traits: [['Énergie', 35], ["Facilité d'éducation", 60], ['Sociabilité', 90], ['Entretien du poil', 40]], note: 'Très attaché à son maître. Respiration et yeux à surveiller.' },
  { nom: 'Berger Allemand', groupe: 'Groupe 1', origine: 'Allemagne', taille: '55–65 cm', poids: '22–40 kg', vie: '9–13 ans', tags: ['Loyal', 'Protecteur', 'Intelligent'], traits: [['Énergie', 85], ["Facilité d'éducation", 90], ['Sociabilité', 70], ['Entretien du poil', 65]], note: 'Polyvalent et fidèle. Prédisposé à la dysplasie de la hanche.' },
]

export const NF = {
  lifestyle: {
    fields: [['Logement', 'Maison avec jardin'], ['Enfants', 'Oui (6 et 9 ans)'], ['Télétravail', '3 j / semaine'], ['Temps libre', 'Modéré'], ['Expérience', 'Intermédiaire']],
    results: [['Golden Retriever', 92], ['Cavalier King Charles', 88], ['Cocker Spaniel', 84], ['Beagle', 71], ['Border Collie', 48]],
    summary: "Votre quotidien convient à 92% à un Golden Retriever, mais seulement à 48% à un Border Collie : votre temps libre modéré couvre mal son immense besoin d'activité.",
  },
  agehuman: {
    big: '33 ans', sub: 'Cocker · 4 ans → adulte',
    table: [['1 an', '15 ans'], ['4 ans', '33 ans'], ['7 ans', '45 ans'], ['10 ans', '57 ans'], ['13 ans', '69 ans']],
    note: 'La première année équivaut à ~15 ans humains, la deuxième à ~9 ans, puis ~4 ans par an pour un chien de taille moyenne.',
  },
  weight: {
    current: '17 kg', ideal: '14,0 kg', range: '13,0 – 14,5 kg', verdict: 'Surpoids léger', pct: 80,
    objectifs: ['Réduire la ration d’environ 10%', 'Augmenter l’activité quotidienne', 'Repeser dans 3 semaines'],
    tip: 'À 17 kg, Stanley dépasse le standard du Cocker (13–14,5 kg). Une perte progressive de 2 à 3 kg lui ferait du bien.',
  },
  activitylevel: {
    level: 'Activité normale', idx: 62, scale: ['Sous-stimulation', 'Normal', 'Suractivité'],
    stats: [['Promenades', '14 / sem'], ['Jeux', '8 / sem'], ['Activités', '3 / sem']],
    recos: ['Équilibre satisfaisant pour un Cocker de 4 ans.', 'Ajoutez 1 séance de flair les jours de pluie.', 'Surveillez les signes de fatigue après le sport.'],
  },
  barkprevent: {
    triggers: ['À la fenêtre', 'À la solitude', "Demande d'attention", 'Sonnette'],
    steps: [['Identifier le déclencheur', 'Notez le contexte exact de chaque aboiement.'], ["Réduire l'exposition", 'Film occultant, bruit blanc, espace calme.'], ['Récompenser le silence', 'Marquez et récompensez les moments calmes.'], ['Dépenser avant', "Une balade avant les pics d'aboiement."], ['Ignorer la demande', "Ne cédez pas à l'aboiement d'attention."]],
    avoid: ['Crier (perçu comme une participation)', 'Collier anti-aboiement', 'Punir après coup'],
  },
  weather: {
    Pluie: { icon: '🌧', items: [["Jeux d'intelligence", 'Tapis de fouille & gobelets', 'Mental'], ['Cache-cache friandises', "Dans tout l'appartement", 'Flair'], ['Apprentissage de tour', '“Fais le beau” en 3 séances', 'Éducation']] },
    Canicule: { icon: '🔥', items: [['Sorties tôt / tard', 'Avant 8h et après 21h', 'Physique'], ['Tapis rafraîchissant', 'Repos au frais', 'Confort'], ['Kong glacé', 'Friandises congelées', 'Mental']] },
    Hiver: { icon: '❄', items: [['Balade dynamique', 'Rythme soutenu pour se réchauffer', 'Physique'], ['Parcours intérieur', 'Slalom & sauts bas', 'Physique'], ['Mastication longue', 'Os à mâcher adapté', 'Calme']] },
  },
  bodylang: {
    emotion: 'Détente', conf: '88%', emoji: '😌',
    parts: [['Oreilles', 'Au repos, ni dressées ni plaquées'], ['Queue', 'Basse et molle, légers mouvements'], ['Regard', 'Doux, clignements lents'], ['Posture', 'Poids réparti, corps relâché']],
    detect: ['Stress', 'Peur', 'Excitation', 'Agressivité', 'Détente'],
  },
  genetics: {
    breeds: ['Berger Allemand', 'Cocker Spaniel', 'Golden Retriever', 'Bouledogue Français', 'Cavalier King Charles'],
    data: {
      'Berger Allemand': { vig: 'Élevée', risks: [['Dysplasie de la hanche', 'Fréquent'], ['Myélopathie dégénérative', 'Modéré'], ['Ballonnement gastrique', 'Modéré']], tests: ['Radiographie hanches/coudes', 'Test ADN myélopathie'] },
      'Cocker Spaniel': { vig: 'Modérée', risks: [['Atrophie rétinienne progressive', 'Modéré'], ['Otites chroniques', 'Fréquent'], ['Dysplasie de la hanche', 'Faible']], tests: ['Examen ophtalmo annuel', 'Contrôle des oreilles'] },
      'Golden Retriever': { vig: 'Élevée', risks: [['Dysplasie hanche/coude', 'Fréquent'], ['Cancers (prédisposition)', 'Modéré'], ['Affections cardiaques', 'Modéré']], tests: ['Radiographie articulaire', 'Bilan cardiaque'] },
      'Bouledogue Français': { vig: 'Élevée', risks: [['Syndrome brachycéphale', 'Fréquent'], ['Hernies discales', 'Modéré'], ['Allergies cutanées', 'Fréquent']], tests: ['Bilan respiratoire', 'Suivi dermatologique'] },
      'Cavalier King Charles': { vig: 'Très élevée', risks: [['Maladie valvulaire mitrale', 'Fréquent'], ['Syringomyélie', 'Modéré']], tests: ['Échographie cardiaque', 'IRM si signes neuro'] },
    },
  },
  nutrition: {
    kcal: '760 kcal', prot: '52 g', portions: '2 repas · ≈ 205 g',
    rows: [['Besoin énergétique', '760 kcal / jour'], ['Protéines', '52 g (≈ 28%)'], ['Lipides', '22 g'], ['Ration croquettes', '≈ 205 g / jour'], ['Répartition', '2 repas (matin / soir)']],
    tip: 'Calcul pour un adulte stérilisé de 17 kg, activité modérée. Recalculé automatiquement à chaque pesée.',
  },
  recipes: [
    { nom: 'Poulet, riz & courgette', kcal: '310 kcal / portion', tags: ['Sans céréales ✕', 'Digeste'], desc: "Blanc de poulet, riz complet, courgette vapeur, filet d'huile de colza." },
    { nom: 'Bœuf maigre & patate douce', kcal: '340 kcal / portion', tags: ['Riche en fer'], desc: 'Bœuf 5% MG, patate douce, carottes, persil.' },
    { nom: 'Poisson blanc & quinoa', kcal: '290 kcal / portion', tags: ['Hypoallergénique'], desc: 'Cabillaud, quinoa, haricots verts, huile de poisson.' },
  ],
  world: {
    countries: [
      ['Royaume-Uni', '🇬🇧', ['Cocker Spaniel', 'Beagle', 'Border Collie', 'Golden Retriever'], 'Berceau de nombreuses races de chasse et de berger.', 'Très élevée'],
      ['France', '🇫🇷', ['Bouledogue Français', 'Berger de Beauce', 'Caniche', 'Braque'], 'Des bouviers aux chiens de salon raffinés.', 'Élevée'],
      ['Allemagne', '🇩🇪', ['Berger Allemand', 'Teckel', 'Boxer', 'Doberman'], 'Réputée pour ses chiens de travail polyvalents.', 'Élevée'],
      ['États-Unis', '🇺🇸', ['Berger Australien', 'Pitbull', 'Coonhound'], 'Races de ranch et de compagnie modernes.', 'Élevée'],
      ['Japon', '🇯🇵', ['Akita', 'Shiba Inu', 'Spitz japonais'], 'Races ancestrales au tempérament indépendant.', 'Croissante'],
      ['Russie / Sibérie', '🇷🇺', ['Husky Sibérien', 'Samoyède', 'Borzoï'], 'Chiens de traîneau endurants du Grand Nord.', 'Modérée'],
    ],
  },
  timeline: [
    ['Aujourd’hui', 'Apprentissage', 'A maîtrisé le “pas bouger” 30 s', '📘'],
    ['Il y a 3 j', 'Poids', 'Pesée : 17,0 kg (à surveiller)', '⚖'],
    ['12 mars', 'Santé', 'Rappel vaccinal CHPPiL effectué', '💉'],
    ['28 févr.', 'Photo', 'Première neige 🐾', '📷'],
    ['15 janv.', 'Apprentissage', 'Marche en laisse sans tirer', '📘'],
    ['2 nov.', 'Événement', 'Arrivée à la maison', '🏡'],
  ],
  predictive: {
    risks: [["Risque d'obésité", 32, 'Modéré'], ['Risque articulaire', 24, 'Faible'], ['Risque cardiaque', 12, 'Faible']],
    factors: ['Activité modérée mais régulière', 'Poids stable au standard', 'Race peu prédisposée au cœur'],
    recos: ["Maintenir 1h d'activité quotidienne", "Surveiller la ration en cas de baisse d'activité", 'Bilan articulaire dès 7 ans'],
  },
  pain: {
    signs: [['Posture', 'Dos légèrement voûté détecté', 'warn'], ['Démarche', "Report de poids sur l'arrière", 'warn'], ['Mobilité', 'Hésitation au lever', 'warn'], ['Visage', 'Aucune tension faciale', 'ok']],
    verdict: 'Signes légers · à surveiller', advice: "Plusieurs indices d'inconfort postérieur. Limitez les sauts et observez 48 h.",
  },
  walk: {
    duree: '35 min', rythme: 'Modéré', dist: '2,4 km', terrain: 'Parc & sentiers',
    segments: [['0–10 min', 'Échauffement au pas', '🚶'], ['10–25 min', 'Trot + 2 jeux de rappel', '🎾'], ['25–35 min', 'Reniflage libre & retour calme', '👃']],
    note: 'Adapté à un Cocker adulte par temps nuageux et frais.',
  },
  bark: {
    result: "Demande d'attention", conf: '82%', emoji: '🔊',
    types: [['Alerte', 'Bref, répété, aigu'], ['Jeu', 'Aigu, entrecoupé'], ['Solitude', 'Plaintif, modulé'], ['Demande', 'Insistant, dirigé vers vous']],
    advice: "Aboiement court et dirigé vers vous : répondez au besoin (eau, sortie) sans renforcer l'insistance.",
  },
  mentalex: {
    breed: 'Cocker Spaniel',
    items: [['Recherche olfactive', 'Cacher 5 friandises dans la pièce', 'Facile'], ['Discrimination de jouets', 'Nommer puis rapporter le bon jouet', 'Moyen'], ['Boîte à problèmes', 'Ouvrir des trappes pour la récompense', 'Moyen'], ['Parcours de réflexion', "Enchaîner 3 ordres dans l'ordre", 'Difficile']],
  },
  dogcompat: {
    a: 'Stanley', b: 'Luna',
    bProfile: [['Âge', '3 ans'], ['Sexe', 'Femelle'], ['Race', 'Labrador'], ['Tempérament', 'Calme']],
    score: 78, verdict: 'Bonne compatibilité',
    points: ['Sexes opposés : entente facilitée.', "Niveaux d'énergie proches.", 'Présenter en terrain neutre la première fois.', 'Surveiller le partage des jouets au début.'],
  },
  vet: {
    symptoms: ["Perte d'appétit", 'Vomissements', 'Boiterie', 'Léthargie', 'Démangeaisons', 'Toux'],
    checked: ['Léthargie', "Perte d'appétit"],
    report: [['Motif', 'Baisse de forme depuis 3 jours'], ['Symptômes', 'Léthargie, appétit réduit'], ['Début', 'Il y a 3 jours, progressif'], ['Alimentation', 'Ration habituelle, boit normalement'], ['Comportement', 'Moins joueur, dort davantage']],
  },
  why: {
    cases: [
      { q: 'Tourne sur lui-même avant de dormir', origin: "Comportement ancestral : aplatir l'herbe et vérifier les alentours avant de se coucher.", freq: 'Tout à fait normal et fréquent.', alert: 'Si cela devient obsessif ou douloureux, consultez.' },
      { q: "Mange de l'herbe", origin: 'Régulation digestive ou simple appétence ; comportement courant.', freq: 'Occasionnel = normal.', alert: 'Si quotidien + vomissements répétés, consultez.' },
      { q: 'Penche la tête quand je parle', origin: "Ajustement de l'ouïe et lecture de vos expressions ; signe d'attention.", freq: 'Normal et plutôt bon signe.', alert: 'Si penchée en permanence, vérifiez les oreilles.' },
      { q: 'Lèche frénétiquement ses pattes', origin: 'Stress, allergie ou irritation cutanée.', freq: 'Léger = normal.', alert: 'Si rougeurs ou perte de poils, consultez.' },
    ],
  },
  twin: {
    now: [['Poids', '17 kg'], ['Forme', '74 / 100'], ['Activité', 'Normale'], ['Âge', '4 ans (33 ans humains)']],
    proj: [['Poids dans 18 mois', '17,8 kg', '+0,8 kg si rien ne change'], ['Risque de surpoids', '54%', 'déjà au-dessus du standard'], ['Articulations', 'Stables', 'bilan conseillé dès 7 ans'], ['Énergie', 'Légère baisse', 'vers 6–7 ans']],
    scenario: "Si le niveau d'activité actuel se maintient, le risque de surpoids dans 18 mois est estimé à 54%. +20 min d'activité/jour le ramènerait à 30%.",
  },
}

export const COMPARE = {
  a: { nom: 'Cocker Spaniel', tag: 'Votre chien' },
  b: { nom: 'Berger Australien', tag: 'Comparé' },
  rows: [['Énergie', 72, 95], ['Intelligence', 80, 95], ["Facilité d'éducation", 75, 85], ["Besoin d'exercice", 70, 95], ['Compatibilité enfants', 90, 80], ['Compatibilité chats', 70, 60], ['Aboiements', 60, 65]],
}

export const PSYQ = [
  { q: 'Comment réagit votre chien face à un inconnu ?', opts: ['Il fonce le saluer', 'Il observe puis approche', 'Il reste en retrait'] },
  { q: "Après une promenade d'une heure, votre chien est…", opts: ['Toujours partant pour plus', 'Calme et satisfait', 'Épuisé'] },
  { q: 'Devant un nouveau jouet, il…', opts: ['Le démonte en analysant', 'Joue sans réfléchir', "S'en désintéresse vite"] },
  { q: 'Quand vous quittez la pièce, il…', opts: ['Vous suit partout', 'Reste tranquille', 'Cherche puis se recouche'] },
]

export const PSYRESULT = {
  archetype: "L'explorateur enthousiaste",
  blurb: "Curieux, sociable et plein d'allant. Stanley a besoin de nouveauté et d'interactions pour s'épanouir ; l'ennui est son principal ennemi.",
  dims: [['Tempérament', 'Sociable & vif'], ["Niveau d'énergie", 'Élevé'], ['Besoins cognitifs', 'Importants'], ['Besoins sociaux', 'Élevés']],
  recos: ['Variez les parcours de promenade pour nourrir sa curiosité.', "Intégrez 10 min de jeux d'intelligence par jour.", 'Privilégiez les renforcements positifs courts et fréquents.'],
}

export const COMPAT = [
  ['Cavalier King Charles', 96, 'Calme, affectueux, parfait en appartement'],
  ['Bichon Frisé', 92, "Petit, sociable, peu d'exercice"],
  ['Carlin', 89, 'Très attaché, adapté aux enfants'],
  ['Bouledogue Français', 86, "Tranquille, peu d'aboiements"],
  ['Cocker Spaniel', 81, "Joyeux mais demande plus d'activité"],
]

export const HEALTH = {
  vaccins: [['CHPPiL', 'À jour', 'Rappel 12/03/2027', 'ok'], ['Rage', 'À jour', 'Rappel 12/03/2027', 'ok'], ['Toux du chenil', 'Bientôt', 'Rappel 05/07/2026', 'warn']],
  vermifuges: [['Milbemax', '15/04/2026', 'Prochain : 15/07/2026', 'ok']],
  traitements: [['Anti-puces (Bravecto)', '01/05/2026', "Actif jusqu'au 01/08/2026", 'ok']],
  poids: [['Jan', 12.6], ['Fév', 12.9], ['Mar', 13.0], ['Avr', 13.1], ['Mai', 13.2], ['Juin', 13.2]],
  rdv: [['28 juin', 'Contrôle annuel + vaccin', 'Dr. Lemoine'], ['14 sept.', 'Détartrage', 'Clinique des Tilleuls']],
}

export const COACH = [
  { n: 1, theme: 'Le rappel', desc: 'Revenir au pied à la voix', prog: 100, state: 'Terminé' },
  { n: 2, theme: 'Marche en laisse', desc: 'Sans tirer, allure régulière', prog: 70, state: 'En cours' },
  { n: 3, theme: 'Assis & Couché', desc: 'Positions à la demande', prog: 30, state: 'En cours' },
  { n: 4, theme: 'Pas bouger', desc: 'Rester en place malgré les distractions', prog: 0, state: 'À venir' },
  { n: 5, theme: 'Distractions', desc: 'Obéir en environnement stimulant', prog: 0, state: 'À venir' },
]

// Pool of activities used by the "Activité du jour" generator. The daily pick is
// derived deterministically from the date + dog (see useDailyActivity), so it
// rotates day to day while staying stable through a single day. When an
// OpenRouter key is configured the generator replaces these with AI suggestions.
export const ACTIVITY_POOL = [
  { titre: 'Pistage olfactif', duree: '20 min', tag: 'Flair', icon: '👃', why: 'Cachez 5 friandises dans le jardin ou la maison et laissez-le les retrouver. Le travail du nez est très fatigant mentalement.' },
  { titre: "Jeux d'intelligence", duree: '15 min', tag: 'Mental', icon: '🧠', why: 'Tapis de fouille, gobelets retournés ou puzzle à friandises : de quoi muscler la réflexion sans effort physique intense.' },
  { titre: 'Rapport au parc', duree: '30 min', tag: 'Physique', icon: '🎾', why: 'Une session de rapport de balle pour dépenser le trop-plein d’énergie et renforcer le rappel dans la foulée.' },
  { titre: 'Parcours maison', duree: '15 min', tag: 'Agilité', icon: '🏠', why: 'Improvisez un slalom entre coussins et un tunnel sous une chaise : agilité douce, idéale par mauvais temps.' },
  { titre: 'Marche reniflage', duree: '25 min', tag: 'Promenade', icon: '🌳', why: 'Une balade lente où il choisit le rythme et renifle à volonté : décompression et confiance.' },
  { titre: 'Rappel ludique', duree: '15 min', tag: 'Éducation', icon: '🎯', why: 'Alternez les rappels à distance avec récompense et jeu. Courtes répétitions, beaucoup d’enthousiasme.' },
  { titre: 'Mastication active', duree: '20 min', tag: 'Calme', icon: '🦴', why: 'Un os à mâcher adapté ou un Kong garni : la mastication libère du stress et apaise les chiens excités.' },
  { titre: 'Apprentissage d’un tour', duree: '10 min', tag: 'Mental', icon: '✨', why: 'Apprenez « donne la patte » ou « tourne » en micro-séances. La nouveauté stimule et renforce le lien.' },
  { titre: 'Bain de nature', duree: '40 min', tag: 'Exploration', icon: '🥾', why: 'Une sortie en forêt ou en sentier : terrains variés, nouvelles odeurs et dépense complète.' },
  { titre: 'Cache-cache', duree: '15 min', tag: 'Flair', icon: '🔍', why: 'Cachez-vous dans la maison et appelez-le une fois : il vous cherche au flair, excellent pour le lien et le rappel.' },
]

export const SIM = {
  breed: 'Husky Sibérien',
  annual: '≈ 2 100 € / an', time: '≈ 2 h / jour',
  rows: [['Activité sportive', 90, 'Très élevé'], ['Stimulation mentale', 85, 'Forte'], ['Niveau de bruit', 70, 'Hurlements'], ['Quantité de poils', 95, 'Mue intense'], ['Risques santé', 45, 'Dysplasie, yeux']],
  note: "Posséder un Husky représente environ 2 h d'activité par jour et un fort besoin de stimulation mentale. Peu adapté à la vie sédentaire ou aux climats chauds.",
}

export const BEHAVIOR = [
  { case: 'Mordille les meubles', ctx: 'Chiot · phase de dentition', causes: ['Poussée dentaire (3–6 mois)', 'Ennui / manque de stimulation', "Recherche d'attention"], exos: ['Proposez 2–3 jouets à mâcher adaptés', 'Augmentez les sorties et jeux de flair', 'Récompensez quand il mâche le bon objet'], avoid: ['Le gronder après coup (inefficace)', 'Lui donner une vieille chaussure', 'Le laisser seul sans alternative à mâcher'] },
  { case: 'Anxiété de séparation', ctx: 'Adulte · vocalises au départ', causes: ['Hyper-attachement', 'Départs trop chargés émotionnellement', "Manque d'autonomie"], exos: ['Désensibilisez les rituels de départ', 'Départs progressifs (1, 5, 15 min)', 'Jouet distributeur au moment de partir'], avoid: ['Punir à votre retour', 'Faire de grands au revoir', 'Multiplier les retours pour vérifier'] },
  { case: 'Aboiements excessifs', ctx: 'Adulte · à la fenêtre', causes: ['Stimuli visuels (passants)', 'Excitation non canalisée', 'Renforcement involontaire'], exos: ["Réduisez l'accès visuel (film occultant)", 'Apprenez le “silence” récompensé', "Dépensez avant les pics d'activité"], avoid: ['Crier (perçu comme participation)', 'Colliers anti-aboiements', 'Ignorer la cause de fond'] },
]

// Pedigree (static)
export const PEDIGREE = {
  gp: [{ name: 'Ch. Rosewood Max', champ: true }, { name: 'Lily of Ashdown', champ: false }, { name: 'Ch. Bramble Jack', champ: true }, { name: 'Daisy Belle', champ: false }],
  parents: [{ name: 'Hazel du Vallon', sex: '♀', champ: false }, { name: 'Ch. Oscar des Bruyères', sex: '♂', champ: true }],
  coi: '6,25 %', champs: '3', desc: '5 portées suivies',
}

// Translate result signals (static)
export const TRANSLATE_SIGNALS = [
  ['Posture', 'Avant abaissé, arrière relevé'],
  ['Queue', 'Remuée, large amplitude'],
  ['Oreilles', "Détendues, vers l'avant"],
  ['Expression', 'Gueule ouverte, “sourire”'],
]

// Morpho fields + results (static)
export const MORPHO_FIELDS = [
  { k: 'Taille au garrot', v: '≈ 39 cm' }, { k: 'Poids', v: '13 kg' },
  { k: 'Forme des oreilles', v: 'Tombantes, longues' }, { k: 'Longueur du museau', v: 'Moyen' },
  { k: 'Type de poil', v: 'Mi-long, ondulé' }, { k: 'Couleur', v: 'Fauve' },
]
export const MORPHO_RESULTS = [
  { name: 'Cocker Spaniel Anglais', pct: 72 }, { name: 'Springer Spaniel', pct: 16 },
  { name: 'Cocker Américain', pct: 8 }, { name: 'Setter (croisé)', pct: 4 },
]

// Compat (lifestyle->races) input fields (static)
export const COMPAT_FIELDS = [
  { k: 'Logement', v: 'Appartement' }, { k: 'Jardin', v: 'Non' }, { k: 'Enfants', v: 'Oui' },
  { k: 'Autres animaux', v: 'Chat' }, { k: 'Temps disponible', v: '≈ 2 h / jour' },
]

// Identify result (static)
export const IDENTIFY_RESULT = {
  race: 'Cocker Spaniel Anglais', pct: '87%',
  stats: [['Croisement', '13% Springer'], ['Confiance', 'Élevée', 'ok'], ['Âge estimé', 'Adulte'], ['Gabarit', 'Moyen']],
}
