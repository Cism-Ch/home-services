# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
|    [>] IN PROGRESS      |  |    [x] SPRINT 18 DONE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (Aucune tache active)   |  | [x] TASK-UI18-SVC-MODAL |  | Sprint 02-12 (40 tasks) |
|                         |  |                         |  | Sprint 13-17 (22 tasks) |
|                         |  |                         |  | (Full Archive Logged)   |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Completed Sprint 18: Refonte Modale Paysage Prestations, Modeles Rapides Complets, Filigranes & Lueurs Orangees (100/100 PASS)

### [x] `TASK-UI18-SVC-MODAL-01` — Modeles Rapides 20 Categories & Modale Paysage Responsive avec Filigranes
- [x] Completer `src/lib/service-templates.ts` avec `categoryId` exact et des modeles FCFA pour les 20 categories (25 modeles dont `securite`, `maconnerie`, `jardinage` + modeles complementaires).
- [x] Ajouter `.no-scrollbar` dans `src/app/globals.css` pour masquer les barres de defilement dans la modale.
- [x] Refondre `src/components/dashboard/create-service-dialog.tsx` : choix de categorie en premier filtrant les modeles rapides, mise en page paysage (`lg:max-w-5xl`) a marges uniformes (`p-5 sm:p-6`), illustration metier agrandie, filigranes d'icones par categorie (cards + grand fond de modale) et lueurs orangees radiales GPU.
- [x] Valider via `python evals/run_fullstack_eval.py` (`100/100 PASS`).

---

## Completed Tasks History

| Date | Task ID | Title & Description | Created / Modified Files |
| :--- | :--- | :--- | :--- |
| 2026-11-22 | SPRINT-17 | Extension Catalogue Metiers (+10 Categories dont Luminaires separe de Domotique, Illustrations Flat, Templates FCFA & Seed Supabase) | `prisma/seed-data.ts`, `src/lib/category-illustrations.ts`, `src/lib/service-templates.ts`, `public/images/services/*` |
| 2026-11-22 | SPRINT-16 | CRUD/Archivage Services, Proxy S3 `/api/upload`, Hero ShaderGradient, 10 Illustrations Metiers, Admin Health & Moderation KYC/Avis | `src/app/api/upload/*`, `src/app/dashboard/admin/health/*`, `src/components/marketing/hero-shader-background.tsx`, `src/lib/category-illustrations.ts`, `public/images/services/*` |
| 2026-11-21 | SPRINT-15 | Correctifs Responsive Mobile (Drawer `/services`, Autocomplete, `CalendarCheck`, centrage mobile, Footer `2x2`) & Page `/pricing` Cover | `src/app/pricing/*`, `src/app/services/services-browser.tsx`, `src/components/service-autocomplete.tsx`, `src/components/site-footer.tsx`, `e2e/*` |
| 2026-11-21 | SPRINT-14 | Refonte UI/UX : Nunito, Autocomplete Services, Modes `3x1`/`3x2`/`3x3`/`4x3`, Sidebar, `AnimatePresence`, Notifications & Compteurs | `src/app/layout.tsx`, `src/components/service-autocomplete.tsx`, `src/components/catalog-layout-toolbar.tsx`, `src/components/motion/*`, `src/lib/notifications.ts`, `e2e/*` |
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
