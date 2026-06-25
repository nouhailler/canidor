# CONTEXT — Canidor

Document de contexte pour reprendre le développement sans relire tout le code.
Pour l'historique daté, voir [CHANGELOG.md](CHANGELOG.md).

## 1. Vision

Canidor est une **PWA mobile francophone** pour propriétaires de chiens. Elle
regroupe identification, santé, comportement, éducation et alimentation autour d'un
chien fil-rouge, **Stanley** (Cocker Spaniel Anglais, mâle, 4 ans, 17 kg).

L'app a été **recréée proprement** à partir d'un prototype haute-fidélité fourni
dans `design_handoff_canidor/` (`design/Canidor.dc.html` = source de vérité pour
layout, couleurs, copy, états et transitions). Le prototype n'a **pas** été copié
tel quel ; il a servi de référence visuelle et comportementale.

## 2. Stack & décisions

- **React 18 + Vite 5** — pas de framework lourd, démarrage rapide.
- **React Router** — une route par écran : `/` (accueil), `/tools`, `/carnet`,
  `/profile`, et `/<fonction>` pour les sous-écrans. `main.jsx` monte deux routes
  (`/` et `/:screenId`) qui rendent toutes deux `<App />`.
- **vite-plugin-pwa** (`registerType: autoUpdate`) — manifeste, service worker,
  cache des polices Google, icônes. PWA installable, prête Netlify.
- **Aucune librairie UI** — composants maison + **design tokens** centralisés
  (`src/theme.js`). Choix assumé pour la fidélité pixel au prototype.
- **Polices** : `Instrument Serif` (titres, grands nombres) + `Hanken Grotesk` (UI),
  chargées via Google Fonts.

### Modèle de navigation

Le prototype utilise un état `screen` (string) ; chaque écran connaît son `tab`
parent (`home` / `tools` / `health` / `profile`). On a transposé ça en routes :

- `src/data/screens.js` — registre `SCREENS` (titre, tab, root) + `TAB_ROOT`.
- `App.jsx` lit `:screenId` depuis l'URL, calcule le tab actif, gère la flèche
  retour (retour à la racine du tab courant) et la feuille d'aide.
- **ChromeContext** (`src/store/ChromeContext.jsx`) permet aux écrans liste/détail
  (Catalogue, Carte du monde) de surcharger le titre de l'app-bar et le bouton
  retour pendant qu'un détail est ouvert, et expose `goScreen` pour naviguer.

## 3. État applicatif

`src/store/AppContext.jsx` (React Context + hooks) fournit :

- **Onboarding** : `onboarded`, `completeOnboarding`, `replayOnboarding`
  (persisté `localStorage: canidor_onboarded`). Onboarding 3 slides rejouable
  depuis Profil → « Revoir l'introduction ».
- **Profil chien éditable** : `dog` + `updateDog` (persisté `canidor_dog`).
  Champs : nom, race, sexe, âge, poids, forme, lof. Édité depuis l'écran Profil.
- **Profil chien — photo** : `dog.photo` (data URL) + cadrage `dog.photoPos` /
  `dog.photoZoom` (recentrage + zoom), édités depuis Profil, repris en miniature
  d'accueil (`Avatar` accepte `src`/`pos`/`zoom`).
- **OpenRouter** (texte) : `orKey`, `orStatus` (`idle|checking|valid|invalid`),
  `orMsg`, `orModel`, `orShow`, `models`, `aiReady`, `modelName` + actions.
  Rehydraté depuis `localStorage` (`canidor_or_key`, `canidor_or_model`).
- **Fournisseur vision** (image) : `vProvider` (`openai|anthropic|google`),
  `vKey`, `vStatus`, `vMsg`, `vModel`, `vModels`, `vShow`, `visionReady`,
  `visionModelName` + actions (`onVKeyChange`, `selectVProvider`, `validateVKey`,
  `selectVModel`, `toggleVShow`). Persisté (`canidor_v_provider/_key/_model`).
- **Routeur d'analyse** : `runAnalysis({ instruction, image, images, signal })`
  — image(s) → fournisseur vision si configuré, sinon texte via OpenRouter.

Le **catalogue de races** vit dans `src/store/BreedsContext.jsx` : base
(`BREEDS`) fusionnée avec les ajouts/overrides persistés (`canidor_breeds`),
dédup par nom ; `setBreedImage` / `setBreedImagePos` créent un override sans
rendre une race de base supprimable. Activités du jour : `ActivityContext`
(reco du jour, météo réelle, historique).

Les états d'interaction **éphémères** (étapes de questionnaire, stage de scan,
onglet météo, sélection de race…) vivent en `useState` local dans chaque écran.
Beaucoup d'écrans persistent en plus leur **historique / cache** local (voir §6).

## 4. Intégration OpenRouter (`src/lib/openrouter.js`)

- `validateKey(key)` — format `^sk-or-` + longueur ≥ 16, puis `GET /auth/key`.
  `200` → valide ; non-OK → invalide (code) ; exception réseau/CORS → repli valide
  avec message d'avertissement.
- `fetchFreeModels(key)` — `GET /models`, filtre `pricing.prompt === "0"` et
  `:free`. Retourne `null` en cas d'échec (l'appelant garde la liste curée
  `src/data/models.js`).
- `chatCompletion({ key, model, messages, signal })` — `POST /chat/completions`
  (en-têtes `HTTP-Referer` + `X-Title`). Retourne le texte assistant.
- `visionMessage(text, imageDataUrl)` — message multimodal (image optionnelle).

## 5. Câblage IA dans les écrans

- `src/lib/prompts.js` — `systemPrompt(dog)` injecte le profil ; `INSTRUCTIONS`
  contient un gabarit d'instruction par écran ; `buildMessages` assemble system +
  user (+ image).
- `src/hooks/useAnalysis.js` :
  - `useAnalysis()` — machine **Capture IA** (`idle → analyzing → result`). Si
    `aiReady`, appel réel OpenRouter (durée mini ~1,2 s) ; sinon **simulation 2 s**
    fidèle au prototype. Expose `aiText`, `aiError`, `aiReady`.
  - `useAIText()` — génération one-shot pour panneaux **Rapport/Explainer**.
- Composants `src/components/CaptureScreen.jsx` (archétype Capture IA, render-props
  `idle`/`result`) et `src/components/ai.jsx` (`AIPanel`, `AIResultCard`,
  `ConnectKeyNote`, mini-rendu markdown).

Sans clé : la démo statique s'affiche + une invite « connectez une clé ». Avec
clé+modèle : la réponse du modèle est rendue dans une carte « Analyse IA ».

Les hooks `useAnalysis`/`useAIText` passent désormais par `runAnalysis`
(AppContext) : `aiReady` y est compris comme `OpenRouter || vision`. Les zones
d'upload (`UploadBox`) sont de **vrais sélecteurs de fichier** ; l'image n'est
exploitée que si un **modèle vision** est configuré (sinon repli texte).

### Analyse d'images (fournisseurs vision)

- `src/lib/visionProviders.js` — `VISION_PROVIDERS`, `validateVisionKey`,
  `fetchVisionModels`, `visionComplete({ images, … })`. Adaptateurs OpenAI /
  Anthropic (base64 + `anthropic-dangerous-direct-browser-access`) / Google
  (`generateContent` + `inline_data`). **Multi-images** supporté.
- `src/lib/videoFrames.js` — `pickVideoFile`, `extractFrames(file, n)` :
  échantillonne `n` frames via `<video>` + canvas (les API chat n'ingèrent pas de
  flux vidéo). Utilisé par le Traducteur canin.

## 6. Données (`src/data/`)

- `screens.js` — registre des écrans (titre, tab, root).
- `help.js` — `HELP` : intro + 3 tips par écran (feuille d'aide contextuelle).
- `datasets.js` — toutes les données métier portées du prototype : `OB`
  (onboarding), `COCKER`, `BREEDS`, `NF` (lifestyle, âge, poids, génétique,
  nutrition, recettes, monde, timeline, prédictif, douleur, promenade, aboiement,
  exercices mentaux, compat. chiens, véto, « pourquoi », jumeau…), `COMPARE`,
  `PSYQ`/`PSYRESULT`, `COMPAT`, `HEALTH`, `COACH`, `ACTIVITIES`, `SIM`, `BEHAVIOR`,
  `PEDIGREE`, etc.
- `tools.js` — grille Fonctions (7 sections, tuiles pastel), accès rapide accueil,
  alertes, liens du profil.
- `models.js` — `FREE_MODELS` (repli).
- `whyQuestions.js` — `WHY_CATEGORIES` (12 catégories, ~70 questions) + `WHY_STATIC`
  (réponses instantanées pour les cas courants) de l'écran « Pourquoi mon chien ? ».

> `BEHAVIOR` (datasets) compte désormais **16 cas** détaillés. `PSYQ`/`PSYRESULT`,
> `COMPARE`, `COMPAT`, `SIM`, `NF.why`/`NF.bodylang`/`NF.genetics` ne sont plus
> utilisés : leurs écrans sont devenus dynamiques (voir §8b).

### 6b. Logique métier & caches (`src/lib/`)

- **Estimations locales (sans IA)** : `morpho.js` (races probables), `lifestyle.js`
  (mode de vie + compatibilité adoption), `dogcompat.js` (entente entre deux
  chiens), `simulator.js` (simulateur d'adoption), `psyProfile.js` (profil
  psychologique scoré), `bodylang.js` (grille d'observation), `breedFilters.js`
  (parsing taille/poids/vie + traits, filtres catalogue).
- **Race & images** : `breeds.js` (normalisation/import/IA/The Dog API),
  `breedImage.js` (Wikimédia, Google Images, fichier, URL), `weather.js`
  (géoloc + Open-Meteo).
- **Caches localStorage** (génération IA réutilisable, une clé par sujet) :
  `behaviorCache`, `activityDetail`, `breedInfoCache`, `healthInfoCache`,
  `screeningInfoCache`, `breedScreeningsCache`, `morphoHistory`. Historiques :
  activités (`canidor_activity_history`), morpho (`canidor_morpho_history`).

## 7. Design tokens (`src/theme.js`)

Crème `#F5EFE4`, espresso `#2A211B`, accent terracotta `#C2603C`, pastels par
section, succès/avertissement/danger, ombres de carte, helpers `stripes()` pour les
placeholders rayés. **Ne pas introduire de couleurs hors charte.**

## 8. Écrans (`src/screens/`)

Regroupés par section dans des fichiers multi-composants, exposés via le registre
`screens/index.js` (`getScreen(id)`), résolu par `App.jsx` :

- `Home.jsx`, `Tools.jsx`, `Profile.jsx` (photo + cadrage), `Carnet.jsx`, `Settings.jsx` (OpenRouter + vision)
- `identity.jsx` — Identify, Morpho, Compare, Fiche, Catalogue, Worldmap, Genetics
- `behavior.jsx` — Behavior, Psy, Translate, Bodylang, Whydog, Barkprevent, Barkrecog
- `health.jsx` — HealthPhoto, Weight, Agehuman, Pain, Predictive, Vetprep, Nutrition, Recipes
- `activity.jsx` — Coach, Activities, Weatherprog, Walkroute, Mentalex, Activitylevel
- `adoption.jsx` — Lifestyle, Compat, Dogcompat, Simulator
- `advanced.jsx` — Timeline, Twin, Pedigree

### 8b. Écrans devenus dynamiques (v0.2.0)

La plupart des écrans « vitrine » du prototype sont désormais **interactifs** :
Catalogue/Fiche (recherche, auto-complétion, filtres, ajout/IA/import, photo +
recadrage, infos IA, pathologies cliquables), Morpho (+ historique), Comparateur
(2 races), Worldmap (races cliquables → Fiche), Genetics (tout le catalogue +
dépistages IA), Activities (météo réelle + historique), Lifestyle, Compat,
Dogcompat (2 chiens), Simulator, Behavior (16 cas), Psy (questionnaire scoré),
Translate (photo/vidéo → vision), Bodylang (grille guidée), Whydog (catalogue
catégorisé), Carnet (éditable).

## 9. Icônes & PWA

`public/icons/` (192, 512, maskable-512), `public/apple-touch-icon.png`,
`public/favicon.svg` + `favicon.ico` — patte crème sur carré arrondi terracotta
`#C2603C`. Manifeste configuré dans `vite.config.js`. Captures pour la doc dans
`docs/screens/` (régénérables avec Playwright sur le build de preview).

## 10. Pistes d'évolution

- **Vidéo native** via l'API Files de Gemini (au lieu de l'échantillonnage de
  frames) pour une vraie lecture du mouvement.
- Export PDF / partage du rapport pré-consultation véto et des profils.
- Câbler les derniers écrans encore statiques (Twin, Pedigree, Timeline,
  Predictive, certains écrans nutrition).
- Synchronisation cloud optionnelle du profil et des historiques (aujourd'hui
  100 % local).
