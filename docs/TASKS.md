# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 13) |  |   [?] SPRINT 13 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| [x] Sprint 13 COMPLETE   |  | (All SP13 Tasks Done!)   |  | Sprint 02-11 (34 tasks) |
|     (Ready -> Commit)   |  |                         |  | Sprint 12 (6 tasks)     |
|                         |  | [x] TASK-HERO-COVER-01  |  | (Full Archive Logged)   |
|                         |  | [x] TASK-MOTION-PERF-01 |  |                         |
|                         |  |                         |  |                         |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 13: Hero Cover Zero-CLS, Framer Motion GPU-Only, Transitions & Perf 60fps

### [x] `TASK-HERO-COVER-01` — Hero Plein Ecran Cover & Slogan Dynamique Zero-CLS
- [x] Passer `HeroSection` (`src/components/marketing/hero-section.tsx`) en RSC plein ecran (`min-h-[calc(100svh-4rem)]`) avec ancre `#quick-search` et lueur radiale continue dans `src/components/marketing/glow.tsx`.
- [x] Verrouiller la hauteur de `HeroSloganRotator` (`src/components/hero-slogan-rotator.tsx`) via une grille ghost-stack CSS sans `filter: blur`, pause si onglet masque / `prefers-reduced-motion`, et delta de page `0px`.

### [x] `TASK-MOTION-CORE-01` — Socle Framer Motion (`LazyMotion`, `MotionConfig`, Presets GPU)
- [x] Creer `src/lib/motion.ts` (variantes GPU `transform`/`opacity` uniquement), `src/components/motion/motion-provider.tsx` (`<LazyMotion features={domMax}>` + `<MotionConfig reducedMotion="user">`), `src/components/motion/reveal.tsx` (`RevealOnScroll`, `StaggerGrid`, `StaggerItem`), et `src/components/motion/scroll-progress.tsx`.
- [x] Integrer `MotionProvider` et `ScrollProgress` dans `src/app/layout.tsx`.

### [x] `TASK-MOTION-SCROLL-01` — Defilement Fluide & Suppression des Goulets GPU (`blur-3xl` / `spin`)
- [x] Remplacer les 12 calques `blur-3xl` / `blur-xl` et `animate-[spin]` (`how-it-works.tsx`, `page.tsx`, `quick-search.tsx`, `services-browser.tsx`, `professionals-browser.tsx`, `about/page.tsx`, `site-footer.tsx`) par des radial-gradients legers.
- [x] Remplacer `.animate-appear` / `animate-slide-down` par `RevealOnScroll`/`StaggerGrid` hors-viewport, garder le Hero above-the-fold immediat, et cibler les proprietes `transition-*` sur les cartes.

### [x] `TASK-MOTION-NAV-01` — Transitions Routes, `layoutId` & Parcours Reservation
- [x] Creer `src/app/template.tsx` (micro-transition d'entree GPU compatible `sticky`), ajouter indicateurs glissants `layoutId` dans `MainNav` et `DashboardSidebar`, et progression animee dans `BookingStepper`.
- [x] Animer les transitions directionnelles d'etapes dans `BookingClient` et l'apparition des creneaux horaires dans `DateTimePicker`.

### [x] `TASK-MOTION-PERF-01` — Verification Multi-Viewports Zero-CLS, Regles UI Motion & Juge `100/100`
- [x] Ajouter le test Sprint 13 dans `e2e/responsive-layout.spec.ts` (Cover hero, delta `<= 0.5px` lors de la rotation du slogan, zero `.blur-3xl`/`animate-[spin`, navigation routes, booking transitions, `reducedMotion`).
- [x] Consigner `[R-UI-14]` et `[R-UI-15]` dans `.agents/rules/modules/ui_frontend.md` et valider avec `python evals/run_fullstack_eval.py` (`100/100 PASS`).

### [x] `TASK-PROD-FIX-01` — Durcissement Production (Prisma/Vercel, SSL Supabase, Redis/URL Fail-Safe, Digest Erreur)
- [x] Garantir `prisma generate && next build` dans `package.json` et durcir `src/lib/prisma.ts` (SSL `.supabase.co`/`.supabase.com` + normalisation `sslmode`, singleton serverless `max: 5`).
- [x] Securiser `metadataBase` dans `src/app/layout.tsx`, `getRedisClient()` dans `src/lib/redis.ts`, fallback resilient sur `src/app/page.tsx`, et affichage du `digest` dans `src/app/error.tsx`.
- [x] Valider avec `python evals/run_fullstack_eval.py` (`100/100 PASS`).

---

## Completed Tasks History

| Date | Task ID | Title & Description | Created / Modified Files |
| :--- | :--- | :--- | :--- |
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
