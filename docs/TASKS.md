# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
|    [>] IN PROGRESS      |  |    [x] SPRINT 14 DONE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (Aucune tache active)   |  | [x] TASK-UI14-FONT-HDR  |  | Sprint 02-12 (40 tasks) |
|                         |  | [x] TASK-UI14-AUTOCOMP  |  | Sprint 13 + Prod (6)    |
|                         |  | [x] TASK-UI14-LAYOUTS   |  | (Full Archive Logged)   |
|                         |  | [x] TASK-UI14-SIDEBAR   |  |                         |
|                         |  | [x] TASK-UI14-PRESENCE  |  |                         |
|                         |  | [x] TASK-UI14-TOASTS    |  |                         |
|                         |  | [x] TASK-UI14-COUNTERS  |  |                         |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Completed Sprint 14: UI/UX Nunito, Autocomplete Services, Modes Grille/Liste, Sidebar, Presence & Notifications (100/100 PASS)

### [x] `TASK-UI14-FONT-HEADER-01` — Police Nunito, Header Translucide Sans Bordure & Cartes Hero/Presentation
- [x] Migrer la police principale vers `Nunito` (`next/font/google`, poids 400..800) dans `src/app/layout.tsx` et `src/app/globals.css`.
- [x] Refondre `SiteHeader` en barre translucide sans bordure avec densification au scroll, et raffiner `HowItWorks` et `FeaturedServices`.

### [x] `TASK-UI14-AUTOCOMPLETE-01` — Auto-Completion Services Disponibles sur la Recherche
- [x] Creer `src/components/service-autocomplete.tsx` (navigation clavier, Metiers + Prestations Prisma avec tarif FCFA) redirigeant vers `/services?q=...&category=...`.
- [x] Integrer dans `QuickSearch` (`src/app/page.tsx`) et dans l'en-tete de `/services`.

### [x] `TASK-UI14-LAYOUT-MODES-01` — Outils d'Affichage Row / Column (`3x1`, `3x2`, `3x3`, `4x3`)
- [x] Creer `src/components/catalog-layout-toolbar.tsx` (`ToggleGroup` + persistance `localStorage` via `useSyncExternalStore`) avec les 4 presets : `min 3x1 (row)`, `3x2 (6/page)`, `3x3 (9/page, defaut)`, `4x3 (12/page)`.
- [x] Ajouter `layout="row" | "grid"` sur `ServiceListingCard` et `ProCard`, supprimer la 4e colonne ecrasante sur `/services` et `/professionals`.

### [x] `TASK-UI14-SIDEBAR-01` — Optimisation Sidebar de Filtrage `/services`
- [x] Passer la mise en page desktop `/services` sur `lg:grid-cols-[300px_minmax(0,1fr)]` (`Drawer` sur `< lg`), borner la sidebar sticky avec `ScrollArea` interne, compteur de filtres actifs et `ServiceFilter` nettoye.

### [x] `TASK-UI14-PRESENCE-01` — Transitions & Apparition/Disparition (`AnimatePresence`) sur Elements Cles
- [x] Creer `src/components/motion/presence-primitives.tsx` et `src/components/motion/back-to-top.tsx` (bouton retour haut anime), animer puces de filtres actifs, etats vides/remplis, changements de layout et dropdown autocomplete.

### [x] `TASK-UI14-TOASTS-01` — Normalisation des Notifications (`sonner`) & Feedback Interactions
- [x] Corriger la parite theme `.luxury` + `closeButton` + `bottom-right` dans `src/components/ui/sonner.tsx` et `src/app/layout.tsx`, creer `src/lib/notifications.ts` (deduplication `id` anti-spam), et couvrir `SiteHeader` logout, `CatalogLayoutToolbar`, `ModeToggle` et reinitialisation des filtres.

### [x] `TASK-UI14-COUNTERS-PERF-01` — Compteurs Animes, Optimisation Perf UI & Validation `100/100`
- [x] Creer `src/components/motion/animated-counter.tsx` (`useInView`, `tabular-nums`, `prefers-reduced-motion`) et l'integrer dans `QuickSearch`, `ProfessionalsBrowser` et `AboutPage`.
- [x] Etendre `e2e/responsive-layout.spec.ts` (13/13 PASS) et valider avec `python evals/run_fullstack_eval.py` (`100/100 PASS`).

---

## Completed Tasks History

| Date | Task ID | Title & Description | Created / Modified Files |
| :--- | :--- | :--- | :--- |
| 2026-11-20 | SPRINT-13 | Hero Cover Zero-CLS, Framer Motion GPU-Only, Transitions, Perf 60fps & Durcissement Prod (`TASK-PROD-FIX-01`) | `src/lib/motion.ts`, `src/components/motion/*`, `src/app/template.tsx`, `src/lib/prisma.ts`, `src/lib/redis.ts`, `src/app/error.tsx`, `package.json`, `e2e/*` |
| 2026-11-20 | SPRINT-12 | Full-Width `1920px+`, Lueur Hero, Capacite `1..N` Multi-Jours & Hotfix Auth `429`/Proxy | `src/lib/scheduling.ts`, `src/proxy.ts`, `src/lib/auth.ts`, `prisma/schema.prisma`, `src/app/**/*`, `e2e/**/*` |
| 2026-11-03 | TASK-GIT-01 | Git Initialization & Security Audits | `.gitignore`, `evals/security_audit.py`, `evals/run_fullstack_eval.py`, `docs/TASKS.md` |
| 2026-11-03 | TASK-I18N-01 | Complete Repository Internationalization (EN) | `README.md`, `AGENTS.md`, `CHANGELOG.md`, `docs/TASKS.md`, `.agents/**/*`, `evals/**/*`, `.gitignore` |
| 2026-11-03 | TASK-SCRIPTS-01 | Clean Emojis & Pure ASCII Output in Scripts | `evals/memory_engine.py`, `evals/rsi_orchestrator.py`, `evals/security_audit.py`, `evals/stack_inspector.py`, `evals/version_manager.py`, `docs/TASKS.md` |
| 2026-11-03 | TASK-RSI-RESET-01 | RSI Reset Engine & `/reset-rsi` Workflow | `evals/reset_rsi.py`, `.agents/workflows/reset-rsi.md`, `docs/TASKS.md` |
| 2026-11-03 | TASK-DOCS-01 | GitHub Documentation Suite & Open Source Readiness | `README.md`, `docs/ARCHITECTURE.md`, `CONTRIBUTING.md`, `LICENSE`, `docs/TASKS.md` |
| 2026-11-04 | TASK-DOCS-02 | Production-Grade Docs, Pure ASCII, Modern Agentic IDEs & Mermaid | `README.md`, `docs/ARCHITECTURE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `.agents/**/*`, `docs/TASKS.md` |
| 2026-11-04 | TASK-RSI-SPEC-01 | Protocol Versioning, Battle-Tested IDE Use Cases & Deterministic Emoji Guard | `VERSION`, `package.json`, `evals/security_audit.py`, `evals/version_manager.py`, `.agents/rules/system_core.md`, `README.md`, `docs/TASKS.md` |
| 2026-11-04 | TASK-DECOUPLE-01 | Decouple Protocol from Application Layer, Remove Premature package.json | `VERSION`, `evals/version_manager.py`, `README.md`, `docs/TASKS.md` |
| 2026-11-04 | TASK-CI-01 | GitHub Actions CI & Automated Release Pipelines | `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/TASKS.md` |
| 2026-11-04 | TASK-CI-FIX-01 | Fix Linux CI Subprocess Execution in Deterministic Judge | `evals/run_fullstack_eval.py`, `docs/TASKS.md` |
| 2026-11-05 | TASK-MEM-01 | Refine 2-Step Lossless Memory Consolidation & Module Splitting | `README.md`, `docs/ARCHITECTURE.md`, `.agents/prompts/meta_optimizer.md`, `.agents/workflows/rsi-feature.md`, `docs/TASKS.md` |
| 2026-11-05 | TASK-PAT-01 | Hybrid Pattern Recognition & Operational Security Engine | `.agents/rules/modules/pattern_recognition.md`, `.agents/rules/fullstack_playbook.md`, `evals/memory_engine.py`, `evals/security_audit.py`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md` |
| 2026-11-05 | TASK-TOPO-SCOPE-01 | Topological Repo Map, Blast Radius Analyzer & Scope Drift Guard | `evals/stack_inspector.py`, `evals/rsi_orchestrator.py`, `.agents/rules/modules/pattern_recognition.md`, `.agents/workflows/rsi-feature.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md` |
| 2026-11-05 | TASK-ORCH-01 | Cold-Start Session Pulse (`--pulse`) & Automated Task Rollover (`--rollover`) | `evals/rsi_orchestrator.py`, `.agents/workflows/rsi-feature.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md` |
| 2026-11-05 | TASK-DOCS-03 | Comprehensive README Overhaul with Hero Header & Full Protocol Cycle | `README.md`, `docs/TASKS.md` |
| 2026-11-05 | TASK-INIT-01 | Full Migration to pnpm & Build Pipeline Validation | `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package-lock.json`, `README.md`, `docs/TASKS.md` |
| 2026-11-05 | TASK-ENV-01 | Supabase Migration & Environment Variables Configuration | `.env.example`, `.env.local`, `docs/TASKS.md` |
| 2026-11-05 | TASK-SEC-01 | Vulnerability Audit & Security Hardening | `src/middleware.ts`, `src/app/api/auth/[...all]/route.ts`, `next.config.ts`, `src/lib/auth.ts`, `src/lib/prisma.ts`, `docs/TASKS.md` |
| 2026-11-05 | TASK-SKILLS-01 | Ecosystem Skills Integration (Tailwind, UI, Prisma, Storage, Upstash, Resend) | `.agents/skills/**/*`, `skills-lock.json`, `docs/TASKS.md` |
| 2026-11-05 | TASK-SKILLS-PRUNE-01 | Prune Unused Skill Files, Create .bak Archive & Agent Restore Log | `.agents/skills/**/*`, `backups/skills/**/*`, `docs/TASKS.md` |
