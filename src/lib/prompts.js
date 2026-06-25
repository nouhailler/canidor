// Prompt construction for Canidor's AI features. The dog profile is injected so
// answers stay specific to Stanley (or the edited profile).

export function systemPrompt(dog) {
  return (
    "Tu es l'assistant IA de Canidor, une application pour propriétaires de chiens. " +
    `Le chien concerné : ${dog.nom}, ${dog.race}, ${dog.sexe}, ${dog.ageAnnees} ans, ${dog.poidsKg} kg. ` +
    'Réponds toujours en français, de façon concise, structurée et bienveillante. ' +
    "Utilise des listes courtes quand c'est utile. " +
    "Rappelle, quand le sujet touche la santé, que ton analyse est indicative et ne remplace pas un vétérinaire. " +
    "N'invente pas de certitudes médicales."
  )
}

// Build a {system,user} pair into OpenRouter messages, with optional image.
export function buildMessages({ dog, instruction, image }) {
  const user = image
    ? { role: 'user', content: [{ type: 'text', text: instruction }, { type: 'image_url', image_url: { url: image } }] }
    : { role: 'user', content: instruction }
  return [{ role: 'system', content: systemPrompt(dog) }, user]
}

// Per-screen instruction templates (kept short; UI already shows structured demo data).
export const INSTRUCTIONS = {
  identify: "À partir de cette photo, identifie la race la plus probable du chien, donne un pourcentage de confiance, d'éventuels croisements et le gabarit estimé.",
  healthphoto: (zone) => `Observe cette photo de la zone « ${zone} » du chien. Décris les signes visibles éventuels (rougeur, inflammation, parasites), donne une recommandation prudente et précise quand consulter un vétérinaire.`,
  translate: "Interprète le langage corporel du chien sur cette image/vidéo : émotion dominante, posture, queue, oreilles, expression. Donne un niveau de confiance.",
  bodylang: (desc) => `Décode le langage corporel décrit ou montré : ${desc || 'scène fournie'}. Donne l'émotion probable et les signaux (oreilles, queue, regard, posture).`,
  pain: "Analyse la posture/démarche du chien sur ce média. Repère d'éventuels signes de douleur ou d'inconfort et conseille prudemment, sans poser de diagnostic.",
  barkrecog: "Classe le type d'aboiement probable (alerte, jeu, solitude, demande) et donne un court conseil adapté.",
  behavior: (c) => `Mon chien présente ce comportement : « ${c} ». Donne les causes probables, des exercices conseillés et les erreurs à éviter.`,
  behaviorJSON: (c) => `Mon chien présente ce comportement : « ${c} ». Réponds UNIQUEMENT par un objet JSON valide, sans texte ni balises autour, au format exact : {"ctx":"contexte court (âge/situation typique)","causes":["3 causes probables"],"exos":["3 exercices conseillés"],"avoid":["3 erreurs à éviter"]}. Réponds en français, en phrases courtes.`,
  breedScreenings: (nom) => `Liste les dépistages et examens vétérinaires conseillés pour la race « ${nom} » (tests génétiques, suivis de santé, bilans). Réponds en puces courtes, une ligne par dépistage, sans introduction ni conclusion. Réponds en français.`,
  screeningTest: (test, race) => `Explique le dépistage / examen vétérinaire canin « ${test} »${race ? ` (recommandé pour le ${race})` : ''}. Structure ta réponse en sections avec des puces : **En quoi ça consiste** (ce qui est examiné, comment), **Pourquoi le faire** (ce qu'il permet de détecter ou prévenir), **Quand et à quelle fréquence** (âge, périodicité), **Comment se déroule l'examen** pour le chien. Rappelle que ceci est indicatif et ne remplace pas l'avis d'un vétérinaire. Réponds en français, de façon concrète.`,
  healthCondition: (cond, race) => `Explique la pathologie canine « ${cond} »${race ? ` (fréquente chez le ${race})` : ''}. Structure ta réponse en sections claires avec des puces : **Ce que c'est** (description simple), **Ce que cela implique** pour le chien au quotidien, **Comment aider le chien** (gestes, aménagements, prévention), **Solutions et traitements** possibles. Rappelle que ceci est indicatif et ne remplace pas un diagnostic vétérinaire. Réponds en français, de façon concrète.`,
  ficheInfo: (nom) => `Donne des informations complémentaires détaillées sur la race « ${nom} ». Couvre : tempérament, besoins d'exercice et d'activité, éducation, compatibilité (enfants, autres animaux), entretien du pelage, et points de vigilance santé. Structure la réponse en sections avec des puces courtes et concrètes. Réponds en français.`,
  activityDetail: (a) => `Détaille l'activité canine « ${a.titre} » (${a.tag}, ~${a.duree}). Réponds UNIQUEMENT par un objet JSON valide, sans texte ni balises autour, au format exact : {"materiel":["matériel nécessaire, 2 à 4 éléments"],"etapes":["3 à 5 étapes concrètes, dans l'ordre"],"conseil":"1 conseil de sécurité ou d'efficacité"}. Réponds en français, en phrases courtes.`,
  whydog: (q) => `Pourquoi mon chien fait-il ceci : « ${q} » ? Explique l'origine comportementale, si c'est fréquent/normal, et le signe d'alerte éventuel.`,
  barkprevent: (t) => `Donne une méthode pas à pas, positive et sans punition, pour réduire les aboiements déclenchés par : « ${t} ».`,
  lifestyle: (fields) => `Voici mon mode de vie : ${fields}. Quelles races me conviennent le mieux et pourquoi ? Donne un court rapport.`,
  compat: (fields) => `Mon mode de vie : ${fields}. Propose un top de races compatibles avec une justification courte chacune.`,
  dogcompat: (a, b, prof) => `Estime la compatibilité entre ${a} et un autre chien (${b} : ${prof}). Donne un score, un verdict et des points d'attention.`,
  vetprep: (sym) => `Prépare un résumé clair pour le vétérinaire à partir de ces symptômes observés : ${sym}. Structure : motif, symptômes, début, alimentation, comportement.`,
  morpho: (fields) => `À partir de ces caractéristiques morphologiques : ${fields}, estime les races les plus probables avec un pourcentage.`,
  nutrition: (dog) => `Donne des conseils nutritionnels pour ${dog.nom} (${dog.race}, ${dog.poidsKg} kg, ${dog.ageAnnees} ans) : besoins, répartition des repas, points de vigilance.`,
  predictive: "Estime les principaux risques de santé à long terme pour ce chien et donne des conseils de prévention.",
}
