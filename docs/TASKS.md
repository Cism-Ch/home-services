# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 11) |  |   [?] SPRINT 11 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| [x] Sprint 11 COMPLETE   |  | (All SP11 Tasks Done!)   |  | Sprint 02 (11 tasks)    |
|     (60 E2E Geo Checks) |  |                         |  | Sprint 03-04 (7 tasks)  |
|                         |  |                         |  | Sprint 05-06 (7 tasks)  |
|                         |  |                         |  | Sprint 07-09 (10 tasks) |
|                         |  |                         |  | Sprint 10 + UI (5 tasks)|
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 11: Audit Global Responsivite, Full-Width, Alignement & Regles Agents

### [x] `TASK-LAYOUT-CONTAINER-01` — Normalisation Full-Width, Conteneurs Canoniques & Header/Auth
- [x] Standardiser les conteneurs principaux sur `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` avec sections externes `w-full`.
- [x] Corriger les 4 pages auth (`container` sans `mx-auto px-4` / grille asymétrique), le bleed `About`, `HeroSection` (`fade-bottom` / `pb-0`), `ProHeader` (`relative -top-*` -> `-mt-*`) et les marges du drawer `SiteHeader`.
- [x] Localiser `ModeToggle` en français (`Clair`, `Sombre`, `Système`, `Luxe`).

### [x] `TASK-LAYOUT-CARDS-01` — Harmonisation `Card` v4, `<Card><form>`, Grilles Iso-Hauteur & `<h1>`
- [x] Ajouter `flex flex-col gap-6` aux 7 blocs `<Card><form>` sans espacement vertical.
- [x] Corriger les barres blanches / doubles paddings sur `ServiceListingCard`, `ProServicesView`, `ProServicesList`, `ClientBookingsView`, `HowItWorks`, `BookingSummary`, `About`, tableaux de bord Client/Pro.
- [x] Aligner les hauteurs de grilles (`h-full` + `mt-auto`), retirer la classe morte `xs:grid-cols-2` dans `page.tsx`, et uniformiser les `<h1>` Dashboard (`text-2xl sm:text-3xl`).

### [x] `TASK-LAYOUT-OVERLAYS-01` — Correction Overflow Calendrier, Créneaux, Contact & Modales
- [x] Passer `ProScheduleView` en `xl:grid-cols-[310px_minmax(0,1fr)]` pour éviter le débordement du `Calendar` sur tablette.
- [x] Sécuriser `DateTimePicker` (slots `(Réservé)` multi-lignes + scroll calendrier), `ProContactActions` (`min-w-0 w-full sm:w-auto sm:flex-1`), `DashboardSidebar` (marge mobile + scroll drawer) et toutes les `DialogContent` (`sm:max-w-*`, `p-4 sm:p-6`, `max-h-[90vh] overflow-y-auto`).

### [x] `TASK-LAYOUT-RULES-E2E-01` — Règles Agents UI, Suite Géométrique Playwright & Rapport
- [x] Enrichir `.agents/rules/modules/ui_frontend.md` (< 80 lignes, ASCII pur, 13 règles durables `[R-UI-01]`..`[R-UI-13]`).
- [x] Créer `e2e/responsive-layout.spec.ts` et vérifier 20 routes live en Chrome headless à `375px`, `768px`, `1440px` (`60/60` contrôles, `4 passed`).
- [x] Rédiger `docs/UI_RESPONSIVE_AUDIT_REPORT.md` (zéro emoji) et valider à `100/100 PASS` (`python evals/run_fullstack_eval.py`).

---

## Completed Tasks History

| Date | Task ID | Title & Description | Created / Modified Files |
| :--- | :--- | :--- | :--- |
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
