# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 10) |  |   [?] SPRINT 10 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 10 Done!)   |  | (All SP10 Impl Done)    |  | Sprint 02 (11 tasks)    |
|                         |  |                         |  | Sprint 03-04 (7 tasks)  |
|                         |  |                         |  | Sprint 05-06 (7 tasks)  |
|                         |  |                         |  | Sprint 07 (4 tasks)     |
|                         |  |                         |  | Sprint 08-09 (6 tasks)  |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 10: Unification 100 % shadcn/ui & Maturite Design System

### [x] `TASK-DS-CLEAN-01` — Assainissement du socle `src/components/ui/` & Tokens Theme
- [x] Corriger les 11 imports `from "cn"` vers `from "@/lib/utils"` dans `src/components/ui/`.
- [x] Supprimer le paquet redondant `cn` de `package.json` et vérifier `pnpm audit --prod` = 0 CVE.
- [x] Activer la variante `dark:` sur le thème `.luxury` dans `src/app/globals.css`.
- [x] Déplacer `responsive-table.tsx` vers `src/components/data-display/responsive-table.tsx`.
- [x] Enrichir `badge.tsx` (`success`/`warning`/`info`), `progress.tsx` (`indicatorClassName`), localiser `pagination.tsx` (FR) et ajouter `alert.tsx`, `toggle.tsx`, `toggle-group.tsx`.

### [x] `TASK-DS-RAW-01` — Suppression de tous les `<button>` et `<input>` natifs hors `ui/` + Correctifs UX
- [x] Créer `src/components/star-rating.tsx` (`RadioGroup` accessible) et `src/components/file-upload-button.tsx`.
- [x] Remplacer les contrôles natifs dans `register/page.tsx`, `create-service-dialog.tsx`, `add-review-form.tsx`, `client-follow-up-card.tsx`, `pro-profile-view.tsx`, `city-combobox.tsx`.
- [x] Corriger le double bug `ClientFollowUpCard` (unmount avant dialog + persistance réelle `submitMutualReviewAction`) et les `aria-label` / visibilité tactile manquants.

### [x] `TASK-DS-ADOPT-01` — Adoption complète des primitives dormantes, Navigation & Badges sémantiques
- [x] Adopter `Progress`, `Skeleton`, `Alert`, `Form`, `Separator`, `ToggleGroup`, `Breadcrumb`, `Drawer`, `ScrollArea`, `Pagination`.
- [x] Mettre à niveau `MainNav` (`usePathname()` + `aria-current="page"`) et `BookingStepper` (`<nav><ol><li aria-current="step">`).
- [x] Migrer tous les `<Badge>` à couleurs hardcodées vers `success` / `warning` / `info`.

### [x] `TASK-DS-AUDIT-01` — Vérification statique 0 dérive, Juge Déterministe, Smoke Test & Commit
- [x] Audit statique : 0 import `cn`, 0 `<button>`/`<input>` hors `ui/`, 0 primitive inutilisée dans `src/components/ui/`.
- [x] Validation `python evals/run_fullstack_eval.py` (`100/100 PASS`), `pnpm audit --prod` (0 CVE), smoke test HTTP `200` et commit `feat(sprint-10)`.

### [x] `TASK-UI-SCROLL-01` — Attribut `data-scroll-behavior="smooth"` sur `<html>`
- [x] Ajouter `data-scroll-behavior="smooth"` dans `src/app/layout.tsx` pour désactiver le scroll fluide lors des transitions de routes Next.js 16.
- [x] Valider avec `python evals/run_fullstack_eval.py` (`100/100 PASS`).

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
