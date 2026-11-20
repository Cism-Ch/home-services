# Audit Framer Motion, Defilement & Preparation du Sprint 13

- **Date :** 2026-11-20
- **Dependance detectee :** `framer-motion@^14.9.1` (`package.json`)
- **Objectif du Sprint 13 :** Transformer la navigation, le defilement et les micro-interactions vers une fluidite GPU 60fps coherente, sans jank ni blocage du LCP (`Largest Contentful Paint`).

---

## 1. Etat des Lieux Observe dans le Codebase

| Constat | Fichiers concernes | Impact actuel |
| :--- | :--- | :--- |
| **`framer-motion` quasi inutilise** | `src/components/hero-slogan-rotator.tsx` (1 seul composant sur 124 `.tsx`) | Bundle `framer-motion` deja charge sans benefice sur le reste de l'application ; animation `filter: blur(4px)` sur `<h1>` couteuse en repaint |
| **`47` classes `.animate-appear` CSS au montage** | `src/app/page.tsx`, `services-browser.tsx`, `professionals-browser.tsx`, dashboards | Jouees des le chargement initial hors-viewport (les sections en bas de page sont deja figees avant que l'utilisateur ne scrolle jusqu'a elles) |
| **Animations GPU lourdes (`blur-3xl`)** | `src/components/how-it-works.tsx:45,51` (6 calques `-inset-[100%] blur-3xl animate-[spin_8s/12s]`) + `10` halos `blur-3xl` | Surcharge de rasterisation/compositing lors du scroll rapide sur mobile et ecrans HiDPI |
| **Absences sur la navigation & transitions** | `src/app/layout.tsx`, manquants `template.tsx`, `MainNav`, `DashboardSidebar`, `BookingClient`, `BookingStepper` | Changement de page sec sans repere visuel ; absence d'indicateur actif glissant (`layoutId`) et de transitions directionnelles entre les 4 etapes de reservation |
| **Accessibilite & `prefers-reduced-motion`** | `src/app/globals.css:406` seul | Absence de `<MotionConfig reducedMotion="user">` centralise pour les animations JS Framer Motion |

---

## 2. Plan & Architecture Cible — Sprint 13

### `TASK-MOTION-CORE-01` — Socle `<MotionProvider>`, Presets GPU & Accessibilite
- Creer `src/lib/motion.ts` : courbes unifiees (`easeOutExpo = [0.22, 1, 0.36, 1]`, springs legeres), variantes `fadeUp`, `staggerContainer`, `cardHover`, `stepSlide`, strictement basees sur `transform` et `opacity` (zero `filter: blur`, zero `width/height` anime).
- Creer `src/components/motion/motion-provider.tsx` encapsulant `<MotionConfig reducedMotion="user">` et l'integrer dans `src/app/layout.tsx`.
- Optimiser `HeroSloganRotator` (`src/components/hero-slogan-rotator.tsx`) en supprimant `filter: blur(4px)` au profit d'un glissement vertical pur `y` + `opacity` et en maintenant le rendu initial `<h1>` immediat pour proteger le LCP.

### `TASK-MOTION-SCROLL-01` — Defilement Fluide (`RevealOnScroll`, `StaggerGrid`, `ScrollProgress`)
- Creer `src/components/motion/reveal.tsx` (`RevealOnScroll` via `whileInView` + `viewport={{ once: true, amount: 0.15 }}`, `StaggerGrid` pour les grilles services/pros/KPIs) et `src/components/motion/scroll-progress.tsx` (barre de progression discrete 2px en haut du viewport sur les pages longues).
- Remplacer progressivement les `.animate-appear` hors-viewport dans `page.tsx`, `featured-services.tsx`, `quick-search.tsx`, `about/page.tsx`, `services-browser.tsx`, `professionals-browser.tsx` par `RevealOnScroll` / `StaggerGrid` (en laissant la section Hero above-the-fold visible immediatement).
- Remplacer les 2 disques rotatifs `blur-3xl animate-[spin]` de `HowItWorks` par des halos radiaux CSS statiques/opaques legers au survol afin de restaurer un scroll à 60fps constant.

### `TASK-MOTION-NAV-01` — Transitions de Routes, `layoutId` & Parcours Interactifs
- Ajouter `src/app/template.tsx` avec micro-transition d'entree GPU (`y: 6 -> 0`, `opacity: 0.92 -> 1`, `180ms`) pour eviter les flashs de contenu entre routes App Router sans retarder le premier affichage.
- Ajouter un indicateur de navigation haut (`TopNavProgress`) pour les transitions lentes SSR/Supabase.
- Ajouter un indicateur actif anime par `layoutId` (`MainNav` soulignement continu, `DashboardSidebar` lien actif, `BookingStepper` progression fluide du trait et badge d'etape).
- Animer `BookingClient` (transitions directionnelles gauche/droite entre etapes `1 -> 4` avec `AnimatePresence mode="wait"`), l'apparition du panneau des creneaux horaires dans `DateTimePicker` et le filtrage catalogue (`services-browser.tsx` / `professionals-browser.tsx`).

### `TASK-MOTION-PERF-01` — Controle 60fps, Reduced Motion, Regles Agents & Validation
- Etendre `e2e/responsive-layout.spec.ts` avec verifications multi-etapes `BookingClient` (transitions sans debordement), mode `reducedMotion: "reduce"` et navigation inter-pages.
- Enrichir `.agents/rules/modules/ui_frontend.md` (reste < 80 lignes) avec les regles GPU-only & LCP protection pour Framer Motion.
- Valider build de production, Lighthouse / Playwright et `python evals/run_fullstack_eval.py` (`100/100 PASS`).
