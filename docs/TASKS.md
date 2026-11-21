# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
|    [>] IN PROGRESS      |  |    [x] SPRINT 15 DONE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (Aucune tache active)   |  | [x] TASK-UI15-FIX-MOB   |  | Sprint 02-12 (40 tasks) |
|                         |  | [x] TASK-UI15-PRICING   |  | Sprint 13-14 (13 tasks) |
|                         |  |                         |  | (Full Archive Logged)   |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Completed Sprint 15: Correctifs Responsive Mobile (Sidebar/Drawer, Autocomplete, Cards, Footer) & Page Tarifs Cover (100/100 PASS)

### [x] `TASK-UI15-FIX-MOB-01` — Correctifs Responsive Mobile & Alignements UI
- [x] Corriger le Drawer mobile et la sidebar filtres sur `/services` (`max-h-[88dvh]`, scroll natif sans piege Radix/Vaul, grille `lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]`).
- [x] Corriger l'affichage mobile et le positionnement de la dropdown `ServiceAutocomplete` (`text-left`, `max-h-[min(55vh,320px)]`, `z-50`, tailles tactiles).
- [x] Remplacer l'icone `Sparkles` du bouton `Réserver` par `CalendarCheck` dans `ServiceListingCard`.
- [x] Centrer sur mobile le contenu des cards `ServiceCard` ("Nos Services") ainsi que les badges/titres/sous-titres des sections de la page d'accueil.
- [x] Aligner `SiteFooter` en grille adaptative `1x1` / `2x2` / `4x1` (`min-[360px]:grid-cols-2 lg:grid-cols-4`).

### [x] `TASK-UI15-PRICING-01` — Page Tarifs (`/pricing`) en Cover Animee Client vs Professionnel & Menu
- [x] Ajouter le lien `Tarifs` (`/pricing`) dans `MainNav`, `SiteHeader` (mobile) et `SiteFooter`.
- [x] Creer `src/app/pricing/page.tsx` et `src/app/pricing/pricing-experience.tsx` en Cover plein ecran demandant de maniere animee si l'utilisateur est Client/Particulier ou Professionnel/Entreprise avec les formules XOF `PAYSTACK_PLANS`.
- [x] Etendre `e2e/responsive-layout.spec.ts` (couverture `/pricing`, drawer mobile `/services`, footer `2x2`, autocomplete mobile) et valider `100/100 PASS`.

---

## Completed Tasks History

| Date | Task ID | Title & Description | Created / Modified Files |
| :--- | :--- | :--- | :--- |
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
