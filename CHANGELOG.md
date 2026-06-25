# Changelog

Toutes les évolutions notables de Canidor sont consignées ici.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et le projet suit le [versionnage sémantique](https://semver.org/lang/fr/).

## [0.2.0] — 2026-06-25

Passage des écrans « vitrine » du prototype à des **fonctionnalités réellement
dynamiques** (saisies éditables, calculs locaux, persistance), et ajout d'un
**second fournisseur IA multimodal** pour l'analyse d'images.

### Ajouté — Fournisseur IA « vision » (photo / vidéo)
- Nouvelle section **Paramètres** sous OpenRouter : choix d'un fournisseur
  **OpenAI / Anthropic / Google**, saisie de clé, **validation** et liste des
  **modèles multimodaux** récupérée en direct chez le fournisseur, sélection du
  modèle. Persistance locale (`canidor_v_provider/_key/_model`).
- `src/lib/visionProviders.js` — adaptateurs par fournisseur (formats OpenAI /
  Anthropic base64 + en-tête `anthropic-dangerous-direct-browser-access` /
  Google `generateContent`), **support multi-images**.
- **Routeur d'analyse** (`runAnalysis`, `AppContext`) : une image part vers le
  modèle vision, le texte via OpenRouter ; les zones d'upload deviennent de
  **vrais sélecteurs de fichier** (Identification, santé photo, douleur…).
- **Traducteur canin** refait : photo **ou** courte vidéo → extraction de
  **frames** côté navigateur (`src/lib/videoFrames.js`) → analyse vision,
  **résultat dynamique** (émotion, confiance, signaux) au lieu d'un résultat figé.

### Ajouté — Écrans rendus dynamiques
- **Catalogue & fiche de race** : recherche + **auto-complétion** (dès 3 car.),
  **filtres** (taille, poids, espérance de vie, énergie, éducation, sociabilité,
  entretien), ajout manuel, **génération IA**, import **The Dog API**, import
  JSON. Éditeur de **photo** (Wikimédia / Google Images / fichier / URL) avec
  **recadrage**. Bloc **infos IA** enregistrable/régénérable. **Pathologies
  cliquables** → explication IA.
- **Analyse morphologique** : critères éditables, estimation locale,
  **historique** des recherches.
- **Comparateur de races** dynamique (deux races au choix).
- **Carte des races** : races **cliquables** → fiche (génération IA si absente).
- **Maladies génétiques** : sélection sur **tout le catalogue**, affections
  issues de la fiche (cliquables → IA), **dépistages générés par l'IA** par race.
- **Activités du jour** : **météo réelle géolocalisée** (Open-Meteo),
  recommandation **adaptée à la météo**, détails IA, **historique**.
- **Carnet de santé éditable**.
- **Mode de vie**, **compatibilité adoption**, **compatibilité entre chiens**
  (deux chiens au choix), **simulateur d'adoption** : saisies éditables +
  **estimation locale** calculée depuis les traits du catalogue (sans IA).
- **Assistant comportement** : **16 cas** détaillés (causes / exercices /
  erreurs) consultables hors-ligne + cas IA + saisie libre.
- **Profil psychologique** : vrai **questionnaire scoré** (11 questions, 6
  dimensions, archétype, points forts/vigilance, recommandations).
- **Langage corporel** : **grille d'observation guidée** (10 signaux) → analyse
  IA texte ; photo en bonus.
- **« Pourquoi mon chien ? »** : **catalogue de ~70 questions** classées en 12
  catégories de situations + saisie libre.

### Ajouté — Profil du chien
- **Photo** du chien (éditable), avec **recadrage + zoom** (aperçu live),
  reprise en miniature sur l'accueil ; cadre d'accueil cliquable → profil.

### Ajouté — Outillage
- **Script de génération batch** de fiches de races via OpenRouter
  (`scripts/generate-breeds.mjs`) : persistance incrémentale **crash-safe**
  (JSONL, écriture atomique, reprise), option `--max-tokens`.
- Nombreux modules : `breeds`, `morpho`, `breedFilters`, `lifestyle`,
  `dogcompat`, `simulator`, `psyProfile`, `bodylang`, `weather`, `breedImage`,
  et caches locaux (`activityDetail`, `behaviorCache`, `breedInfoCache`,
  `healthInfoCache`, `screeningInfoCache`, `breedScreeningsCache`,
  `morphoHistory`).

### Modifié
- **Catalogue de races** géré par `BreedsContext` (base + ajouts persistés,
  overrides par nom pour image/cadrage).
- **StatusBar** : retrait des **faux indicateurs** de prototype (9:41, 5G,
  batterie), conservée comme simple espace réservé.

### Confidentialité
- Les clés des fournisseurs vision restent **sur l'appareil** ; les appels
  partent directement du navigateur vers le fournisseur (en-tête d'autorisation
  uniquement). La géolocalisation n'est utilisée que pour la météo et n'est pas
  transmise hors d'Open-Meteo / du service de géocodage.

## [0.1.0] — 2026-06-21

Première version — recréation complète du prototype haute-fidélité en PWA.

### Ajouté
- **Scaffolding PWA** : React 18 + Vite 5 + `vite-plugin-pwa` (manifeste, service
  worker `autoUpdate`, cache des polices), React Router.
- **Layout téléphone** : status bar factice (9:41, 5G, batterie), zone scrollable,
  tab bar basse à 4 entrées (Accueil / Fonctions / Santé / Profil) avec icônes SVG
  et état actif terracotta en pastille.
- **Design tokens centralisés** (`src/theme.js`) : crème, espresso, terracotta,
  pastels par section, polices Instrument Serif + Hanken Grotesk, placeholders rayés.
- **Onboarding** 3 slides sur fond espresso, rejouable depuis le Profil.
- **Aide contextuelle** : feuille (bottom sheet) propre à chaque écran, avec
  avertissement vétérinaire.
- **~35 écrans** dans 7 sections, factorisés via 7 archétypes (Rapport, Capture IA,
  Explainer, Questionnaire, Générateur, Calcul/Info, Liste/détail).
- **Transitions** fidèles : apparition `rise`, barres animées `bar`, scan
  `scanline` + spinner (~2 s), queue `wag`, point REC `pulsered`, feuille `sheetup`.
- **Données centralisées** (`src/data/`) : Stanley + races, carnet de santé,
  comportements, nutrition, génétique, modèles, contenus d'aide, etc.
- **Profil éditable** (nom, race, sexe, âge, poids, indice de forme), persisté en
  `localStorage`.
- **Paramètres / OpenRouter** :
  - champ de clé avec bascule Afficher/Masquer ;
  - **validation réelle** via `GET /api/v1/auth/key` (gestion `200` / non-OK /
    repli réseau) ;
  - **liste de modèles gratuits chargée dynamiquement** depuis `/api/v1/models`
    (filtre `pricing.prompt === "0"`), avec repli sur une liste `:free` curée ;
  - persistance locale (`canidor_or_key`, `canidor_or_model`) rechargée au démarrage.
- **Câblage IA** des écrans Capture IA / Rapport / Explainer sur
  `POST /api/v1/chat/completions` (clé + modèle choisis), réponses mappées sur l'UI,
  état « connectez une clé » en l'absence de configuration.
- **Avertissements vétérinaires** conservés sur tous les écrans santé / IA.
- **Icônes PWA** (192 / 512 / maskable / apple-touch / favicon) : patte crème sur
  carré arrondi terracotta.
- **Déploiement** : `netlify.toml` (build + fallback SPA).
- **Documentation** : `README.md` illustré, `CONTEXT.md`, `CHANGELOG.md`.

### Confidentialité
- La clé OpenRouter reste **sur l'appareil** et n'est jamais transmise ailleurs que
  dans l'en-tête `Authorization` des appels directs à openrouter.ai.

[0.2.0]: https://github.com/nouhailler/canidor/releases/tag/v0.2.0
[0.1.0]: https://github.com/nouhailler/canidor/releases/tag/v0.1.0
