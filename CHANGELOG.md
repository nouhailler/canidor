# Changelog

Toutes les évolutions notables de Canidor sont consignées ici.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et le projet suit le [versionnage sémantique](https://semver.org/lang/fr/).

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

[0.1.0]: https://github.com/nouhailler/canidor/releases/tag/v0.1.0
