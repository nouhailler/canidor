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
- **OpenRouter** : `orKey`, `orStatus` (`idle|checking|valid|invalid`), `orMsg`,
  `orModel`, `orShow`, `models`, `aiReady`, `modelName` + actions (`onKeyChange`,
  `toggleShow`, `selectModel`, `validateKey`). Rehydraté au montage depuis
  `localStorage` (`canidor_or_key`, `canidor_or_model`).

Les états d'interaction **éphémères** (étapes de questionnaire, stage de scan,
onglet météo, sélection de race…) vivent en `useState` local dans chaque écran.

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

> Limitation actuelle : les écrans photo/vidéo envoient l'instruction **en texte**
> (placeholders, pas de vraie image uploadée). Le support vision est déjà câblé
> dans `openrouter.js`/`prompts.js` pour brancher de vraies images plus tard.

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

## 7. Design tokens (`src/theme.js`)

Crème `#F5EFE4`, espresso `#2A211B`, accent terracotta `#C2603C`, pastels par
section, succès/avertissement/danger, ombres de carte, helpers `stripes()` pour les
placeholders rayés. **Ne pas introduire de couleurs hors charte.**

## 8. Écrans (`src/screens/`)

Regroupés par section dans des fichiers multi-composants, exposés via le registre
`screens/index.js` (`getScreen(id)`), résolu par `App.jsx` :

- `Home.jsx`, `Tools.jsx`, `Profile.jsx`, `Carnet.jsx`, `Settings.jsx`
- `identity.jsx` — Identify, Morpho, Compare, Fiche, Catalogue, Worldmap, Genetics
- `behavior.jsx` — Behavior, Psy, Translate, Bodylang, Whydog, Barkprevent, Barkrecog
- `health.jsx` — HealthPhoto, Weight, Agehuman, Pain, Predictive, Vetprep, Nutrition, Recipes
- `activity.jsx` — Coach, Activities, Weatherprog, Walkroute, Mentalex, Activitylevel
- `adoption.jsx` — Lifestyle, Compat, Dogcompat, Simulator
- `advanced.jsx` — Timeline, Twin, Pedigree

## 9. Icônes & PWA

`public/icons/` (192, 512, maskable-512), `public/apple-touch-icon.png`,
`public/favicon.svg` + `favicon.ico` — patte crème sur carré arrondi terracotta
`#C2603C`. Manifeste configuré dans `vite.config.js`. Captures pour la doc dans
`docs/screens/` (régénérables avec Playwright sur le build de preview).

## 10. Pistes d'évolution

- Upload réel de photos/vidéos et envoi multimodal aux écrans Capture IA.
- Export PDF/partage du rapport pré-consultation véto.
- Sélecteur de race réel dans Simulateur / Comparateur (actuellement statiques).
- Synchronisation cloud optionnelle du profil (aujourd'hui 100 % local).
