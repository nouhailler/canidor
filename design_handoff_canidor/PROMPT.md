# Prompt — implémenter Canidor avec Claude Code

Copie-colle ce prompt dans Claude Code, à la racine du projet cible.

---

Tu vas implémenter **Canidor**, une application mobile pour chiens, livrée comme **PWA** (déploiement visé : Netlify). Un prototype de design haute-fidélité est fourni dans `design_handoff_canidor/`. **Lis d'abord `design_handoff_canidor/README.md` en entier**, puis ouvre `design_handoff_canidor/design/Canidor.dc.html` comme **source de vérité** (markup + styles inline + classe `Component` = layout, couleurs, copy, états, transitions exacts). Les captures sont dans `design_handoff_canidor/screenshots/`.

## Cadre
- **Ne copie pas** le HTML du prototype tel quel : c'est une référence. Recrée les écrans proprement.
- Stack recommandée si rien n'existe : **React + Vite + `vite-plugin-pwa`** (ou **Next.js** si tu préfères) + **React Router**. Si un environnement existe déjà, suis ses conventions et sa librairie de composants.
- **Français uniquement.** Mobile plein écran (max-width 430px, centré), status bar factice, tab bar basse à 4 entrées.
- Respecte **fidèlement** les design tokens du README (crème `#F5EFE4`, espresso `#2A211B`, accent terracotta `#C2603C`, pastels par section, polices `Instrument Serif` + `Hanken Grotesk`, rayons, ombres).

## Étapes
1. **Scaffolding** : projet PWA (manifeste, service worker, icônes, thème), routing, layout téléphone (status bar + zone scrollable + tab bar), thème/tokens centralisés.
2. **Navigation** : tab bar (Accueil / Fonctions / Santé / Profil) avec icônes SVG et état actif terracotta ; système d'écrans + bouton retour ; **feuille d'aide contextuelle** réutilisable (un contenu d'aide par écran) ; **onboarding** 3 slides rejouable.
3. **Données** : modélise le chien **Stanley** (Cocker Spaniel Anglais, mâle, 4 ans, 17 kg) et les jeux de données du prototype (races, carnet de santé, modèles, etc.). Centralise-les ; rends le profil éditable.
4. **Écrans** : implémente les ~35 fonctions groupées en 7 sections (voir README). Factorise via les **7 archétypes** (Rapport, Capture IA, Explainer, Questionnaire, Générateur, Calcul/Info, Liste/détail) en composants réutilisables. Reproduis états et transitions (apparition, scan d'analyse ~2 s, barres animées).
5. **Paramètres / OpenRouter** :
   - champ de clé (Afficher/Masquer), **validation réelle** via `GET https://openrouter.ai/api/v1/auth/key` (`Authorization: Bearer`), gestion `200` / non-OK / erreur réseau (repli) ;
   - sélection d'un **modèle gratuit** (liste `:free` du README, idéalement chargée dynamiquement depuis `/api/v1/models` filtrée `pricing.prompt === "0"`) ;
   - persistance locale `localStorage` (`canidor_or_key`, `canidor_or_model`), rechargée au démarrage, clé jamais exfiltrée.
6. **Câblage IA** : branche les écrans Capture IA / Rapport / Explainer sur `POST https://openrouter.ai/api/v1/chat/completions` avec la clé + le modèle choisis (texte/image/vidéo selon l'écran), mappe les réponses sur l'UI existante, et prévois un état « connectez une clé » si aucune clé n'est configurée.
7. **Finitions** : placeholders d'images remplaçables par de vraies photos, disclaimers vétérinaires conservés, accessibilité (cibles ≥ 44px, contrastes), responsive, build PWA installable + prêt Netlify.

## Garde-fous
- Conserve tous les **avertissements vétérinaires** (les analyses IA sont indicatives).
- Respecte la **vie privée** : la clé OpenRouter reste sur l'appareil.
- Vise une **fidélité pixel** au prototype pour le style ; n'invente pas de nouvelles couleurs hors tokens.
