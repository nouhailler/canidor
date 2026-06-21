# Handoff : Canidor — application mobile pour chiens (PWA)

## Overview
**Canidor** est une application mobile (PWA, cible Netlify) qui regroupe l'identification, la santé, le comportement, l'éducation et l'alimentation du chien. Le prototype met en scène un chien fil-rouge — **Stanley**, Cocker Spaniel Anglais, mâle, 4 ans, 17 kg — et couvre **~35 fonctionnalités**, un **onboarding**, une **aide contextuelle** sur chaque écran, et un écran **Paramètres** pour connecter une clé **OpenRouter** et choisir un modèle gratuit.

Langue : **français uniquement**. Plateforme : **mobile plein écran** (pas de cadre device).

## À propos des fichiers de design
Les fichiers de ce bundle sont des **références de design réalisées en HTML** — un prototype qui montre l'apparence et le comportement visés, **pas du code de production à copier tel quel**. La tâche est de **recréer ces écrans dans l'environnement cible** (idéalement **React** + un router, ou **Next.js** pour une PWA déployable sur Netlify ; un framework natif est aussi possible) en utilisant ses conventions et sa librairie de composants. S'il n'existe pas encore d'environnement, choisissez la stack la plus adaptée à une PWA mobile (React + Vite + PWA plugin, ou Next.js) et implémentez-y les écrans.

Le fichier de design est un **Design Component** (`design/Canidor.dc.html`) : un format de prototype maison. Il s'ouvre dans un navigateur (il charge `support.js`, son runtime). Lisez-le comme une **source de vérité visuelle et comportementale** : le markup, les styles inline et la classe logique `Component` décrivent exactement layout, couleurs, copy, états et transitions. Ne le portez pas littéralement — réimplémentez-le proprement.

## Fidélité
**Haute fidélité (hifi).** Couleurs, typographie, espacements, rayons, ombres, copy et interactions sont définitifs. Reproduisez l'UI au pixel près avec la librairie de composants du codebase cible. Les visuels (photos chien, plats, etc.) sont des **placeholders rayés** avec légende monospace : à remplacer par de vraies images.

---

## Système de design (Design Tokens)

### Couleurs
| Rôle | Hex |
|---|---|
| Fond application (crème) | `#F5EFE4` |
| Letterbox / fond body (espresso) | `#2A211B` |
| Encre / héros / titres / barres / cartes sombres | `#2A211B` |
| Texte sur fond sombre | `#F5EFE4` |
| **Accent primaire** (boutons, onglet actif, liens) | `#C2603C` |
| Texte sur accent | `#FFF7F0` |
| Surface carte | `#FFFFFF` |
| Bordure carte | `#ECDFCB` |
| Ombre carte | `0 2px 14px rgba(86,56,24,.05)` |
| Tuile d'icône / encart info (défaut) | `#F4E8D5` |
| Piste de progression / segments | `#E9DBC6` |
| Texte corps | `#564B40` |
| Texte secondaire | `#897A67` |
| Texte tertiaire / labels | `#A89878` |
| Texte ténu (sur sombre) | `#9B8A74` |
| Gris clairs | `#D7C7AF`, `#DBCBB2`, `#B6A488` |
| Succès | `#4E9A66` / `#4E7A45` · fond `#E7F0E2` |
| Avertissement | `#BC7A2C` |
| Danger | `#B0543E` · fond `#F7E6DA`, bordure `#E6C2AE` |

**Tuiles d'icônes par section de l'écran Fonctions** (pastels) :
`Identité & races` sable `#F3E2C6` · `Adoption & compatibilité` sauge `#E2ECDA` · `Comportement & langage` blush `#F4DFD7` · `Santé & prévention` menthe `#DBEAE0` · `Alimentation` argile `#F0E1CC` · `Activité & éducation` ciel `#DDE7EF` · `Suivi & avancé` lilas `#E7E1EF`.

### Typographie
- **Display / titres / grands nombres** : `Instrument Serif` (Google Fonts), regular + italic.
- **UI / corps** : `Hanken Grotesk` (Google Fonts), poids 400/500/600/700.
- **Mono** (placeholders, ids techniques) : `ui-monospace, monospace`.
- Échelle : labels de section 11px, `letter-spacing:.12em`, `uppercase`, 600 · corps 13–15px · titre app-bar (serif) 25px · grands nombres serif 30–60px · texte statut 14px.

### Rayons, espacement, frame
- Rayons : cartes 14–22px, tuiles 9–16px, pilules `999px`.
- Frame téléphone : colonne `max-width:430px`, hauteur plein écran, **status bar iOS** 44px (heure 9:41, signal, 5G, batterie), zone de safe-area basse ~26px sous la tab bar.
- Contenu : padding horizontal 20px, gap cartes 10–12px.

---

## Navigation
Navigation **combinée** : une **tab bar** basse à 4 entrées + des **sous-écrans** ouverts depuis le dashboard ou la grille Fonctions.

**Tab bar (icônes SVG dessinées, currentColor) :**
1. **Accueil** (maison) → dashboard
2. **Fonctions** (étincelles) → grille de toutes les fonctions, en 7 sections
3. **Santé** (cœur + pouls) → Carnet de santé
4. **Profil** (patte) → profil du chien

Onglet actif : icône + label en **terracotta `#C2603C`**, dans une pastille `#F6E2D8`. Inactif : `#B6A488`.

Modèle de routing : un **état `screen`** (string) sélectionne l'écran ; chaque écran connaît son `tab` parent. La flèche « ‹ » de l'app-bar revient à la racine du tab courant (ou, dans les écrans à liste/détail comme Catalogue & Carte du monde, du détail vers la liste). Le bouton « ? » ouvre une **feuille d'aide** contextuelle (bottom sheet) propre à l'écran.

---

## Écrans / Vues

> Captures dans `screenshots/`. Chaque écran possède app-bar (retour + titre serif + aide), et la plupart un en-tête « héros » sombre ou une carte d'intro.

### Onboarding (`11-onboarding.png`)
3 slides plein écran sur fond espresso : wordmark **Canidor** (logo patte terracotta + nom serif), kicker, grand titre serif, corps, liste de features à puces, indicateur de progression (barres), CTA crème « Continuer » / « Commencer », lien « Passer l'introduction ». Rejouable depuis Profil → « Revoir l'introduction ».

### Accueil / Dashboard (`01-accueil.png`)
- **Carte profil** (héros espresso) : avatar, nom **Stanley**, sous-titre `Cocker Spaniel Anglais · 4 ans · ♂`, indice de **forme** (76).
- **Activité du jour** (carte) → lien vers Activités.
- **Alertes santé** (liste, pastilles colorées) → lien Carnet.
- **Accès rapide** : grille 2×2 de cartes à tuile pastel (Comportement, Traducteur, Profil psy., Activités).
- **Catalogue** : carte sombre cliquable (3 vignettes superposées) → Catalogue des races.

### Fonctions (`02-fonctions.png`)
Grille **2 colonnes** de cartes compactes (tuile pastel + titre), groupées en 7 sections (voir tokens). Inventaire complet :

**Identité & races** : Identification photo · Analyse morphologique · Comparateur · Fiche de race · Catalogue des races · Carte du monde · Maladies génétiques.
**Adoption & compatibilité** : Mode de vie · Compatibilité adoption · Compatibilité chiens · Simulateur d'adoption.
**Comportement & langage** : Assistant comportement · Profil psychologique · Traducteur (vidéo) · Langage corporel · Pourquoi mon chien ? · Reconnaissance d'aboiement · Anti-aboiement.
**Santé & prévention** : Carnet de santé · Analyse santé photo · Poids & forme · Âge humain · Détection de douleur · Analyse prédictive · Pré-consultation véto.
**Alimentation** : Assistant alimentation · Recettes maison.
**Activité & éducation** : Coach d'éducation · Activités du jour · Programmes météo · Parcours de promenade · Exercices mentaux · Niveau d'activité.
**Suivi & avancé** : Chronologie de vie · Jumeau numérique · Pedigree & lignées.

### Détail de chaque fonction (patterns)
Les écrans suivent **7 archétypes** réutilisables :

- **Rapport** (formulaire pré-rempli → bouton → résultat) : Mode de vie (`compat % par race`), Compatibilité chiens, Pré-consultation véto, Compatibilité adoption, Analyse morphologique.
- **Capture IA** (idle → *analyzing* avec ligne de scan + spinner ~2 s → résultat) : Identification photo, Analyse santé photo, Traducteur vidéo, Langage corporel, Détection de douleur, Reconnaissance d'aboiement (onde audio animée).
- **Explainer** (chips de cas → causes / exercices / erreurs ou origine / fréquence / alerte) : Assistant comportement (`07`), Pourquoi mon chien ?, Anti-aboiement.
- **Questionnaire** (étapes + barre de progression → archétype + dimensions + recommandations) : Profil psychologique (`06`).
- **Générateur** (liste + bouton « régénérer », onglets) : Activités du jour, Programmes météo (onglets Pluie/Canicule/Hiver), Parcours de promenade, Exercices mentaux, Recettes maison.
- **Calcul / Info** (héros chiffre + table + barres) : Âge humain (33 ans), Poids & forme (17 kg → « Surpoids léger », jauge), Niveau d'activité (échelle 3 niveaux), Assistant alimentation (kcal/protéines/portions), Analyse prédictive (3 jauges de risque), Fiche de race (`03`), Comparateur (double barres), Simulateur d'adoption, Maladies génétiques (sélecteur de race + profil de vigilance).
- **Liste / détail** : Catalogue des races (`05`, grille de vignettes → fiche), Carte du monde (grille de pays → races du pays), Pedigree (arbre 3 générations + COI), Chronologie de vie (timeline verticale), Jumeau numérique (`08`).

### Carnet de santé (`04-carnet-sante.png`)
Bandeau de rappels ; sections Vaccins (statuts colorés), Vermifuges & traitements, **Courbe de poids** (barres), Rendez-vous ; raccourci « Analyser un symptôme par photo ».

### Profil (`10-profil.png`)
Héros, stats (**4 ans / 17 kg / Mâle**), liens (Profil psychologique, Pedigree, Fiche de race, Carnet, **Paramètres**), « Revoir l'introduction ».

### Paramètres — connexion OpenRouter (`09-parametres-openrouter.png`)
Voir la section dédiée ci-dessous.

---

## Interactions & comportement
- **Transitions** : apparition des écrans `@keyframes rise` (10px + fade, ~.35s) ; feuille d'aide `sheetup` (.32s) ; barres `bar` (largeur 0→valeur, .8s) ; scan `scanline` ; spinner `spin` ; queue qui remue `wag` ; point REC `pulsered`.
- **Capture IA** : `idle → analyzing` (overlay sombre + ligne de scan + spinner) → `result` après ~2000 ms (simulation à remplacer par un vrai appel IA).
- **Hover** (desktop) : cartes/options → bordure `#2A211B`.
- **Feuille d'aide** : overlay sombre + bottom sheet ; titre, intro, 3 tips numérotés, avertissement « ne remplace pas un vétérinaire », bouton « J'ai compris ».
- **Disclaimers** : tous les écrans santé/IA affichent un avertissement vétérinaire.

## Gestion d'état (state)
État principal du prototype (à transposer en store/route/state local) :
`screen`, `helpOpen`, `catSel` (catalogue), `countrySel` (carte), `genBreed` (race génétique), `weatherTab`, `whyActive`, `behaviorActive`, `coachWeek`, `psyStep`/`psyDone`, `lifeDone`, `compatDone`, `dogCompatDone`, `vetDone`/`vetSet`, `morphoDone`, et des stages `idStage`/`bodyStage`/`painStage`/`barkStage`/`healthPhotoStage`/`translateStage` (`idle|analyzing|result`).
**OpenRouter** : `orKey`, `orStatus` (`idle|checking|valid|invalid`), `orMsg`, `orModel`, `orShow`.

---

## Intégration OpenRouter (à implémenter pour de vrai)
L'écran **Paramètres** est le point de connexion IA. Comportement attendu :

1. **Saisie de clé** : champ texte (toggle Afficher/Masquer), placeholder `sk-or-v1-...`, lien vers `https://openrouter.ai/keys`.
2. **Validation** : contrôle de format (`^sk-or-` et longueur ≥ 16) puis appel réel `GET https://openrouter.ai/api/v1/auth/key` avec en-tête `Authorization: Bearer <clé>`.
   - `200` → **validée**, on stocke la clé.
   - non-OK (ex. `401`) → **refusée (code)**.
   - erreur réseau/CORS → repli : on enregistre la clé avec un message « vérification réseau indisponible ».
3. **Sélection de modèle (gratuit)** : visible une fois la clé valide. Liste radio des modèles `:free` :
   - `deepseek/deepseek-r1:free` — DeepSeek R1
   - `deepseek/deepseek-chat-v3-0324:free` — DeepSeek V3
   - `meta-llama/llama-3.3-70b-instruct:free` — Llama 3.3 70B
   - `google/gemini-2.0-flash-exp:free` — Gemini 2.0 Flash
   - `qwen/qwen-2.5-72b-instruct:free` — Qwen 2.5 72B
   - `mistralai/mistral-small-3.1-24b-instruct:free` — Mistral Small 3.1
   - *(Amélioration possible : charger dynamiquement `GET /api/v1/models` et filtrer `pricing.prompt === "0"`.)*
4. **Persistance** : clé et modèle stockés **localement sur l'appareil** — clés `localStorage` `canidor_or_key` et `canidor_or_model`, rechargées au démarrage (au montage). Ne jamais transmettre la clé ailleurs ; l'afficher masquée.
5. **Câblage des fonctions IA** : les écrans « Capture IA », « Rapport » et « Explainer » doivent appeler `POST https://openrouter.ai/api/v1/chat/completions` avec la clé + le modèle choisi (et l'image/vidéo/texte pertinent), puis mapper la réponse sur l'UI existante. Tant qu'aucune clé n'est configurée, prévoir un état « connectez une clé dans Paramètres ».

---

## Assets
- **Aucune image binaire** dans le prototype. Les visuels sont des **placeholders rayés** (`repeating-linear-gradient`) avec légende monospace (« photo », « vidéo · 0:06 », « photo plat »…) → à remplacer par de vraies photos.
- **Icônes** : pictos de la tab bar et logo = **SVG inline** (`stroke/fill = currentColor`). Le reste de l'UI utilise des **emojis** comme icônes (📷, ♥, 🧬, 🍖…). À remplacer par un set d'icônes maison si souhaité.
- **Polices** : `Instrument Serif` + `Hanken Grotesk` via Google Fonts.
- **Drapeaux** (Carte du monde) : emojis drapeaux.

## Fichiers
- `design/Canidor.dc.html` — le prototype complet (markup + styles inline + classe logique `Component` = source de vérité). S'ouvre dans un navigateur.
- `design/support.js` — runtime nécessaire pour ouvrir le `.dc.html` (ne pas porter ; outil de prototypage).
- `screenshots/*.png` — captures de référence (écran complet par image).
- `PROMPT.md` — prompt prêt à coller dans Claude Code.
