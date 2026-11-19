# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 06) |  |   [?] SPRINT 06 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 06 Done!)   |  | (Next: Sprint 07 UI/A11y|  | Sprint 02 (11 tasks)    |
|                         |  |  Mobile-First & Shadcn) |  | Sprint 03 (4 tasks)     |
|                         |  |                         |  | Sprint 04 (3 tasks)     |
|                         |  |                         |  | Sprint 05 (4 tasks)     |
|                         |  |                         |  | Sprint 06 (3 tasks)     |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 06: Admin Governance, Legal/SEO & Go-Live Readiness

- [x] **`TASK-ADMIN-DB-01` - [Scope: L] Admin Dashboard 100% Prisma, Signed KYC Viewer, Review Recalculation & Mock Removal**
  - **Priority:** HIGH
  - **Target files:** `src/server/queries/admin.ts`, `src/server/actions/admin.ts`, `src/app/dashboard/admin/page.tsx`, `src/app/dashboard/admin/admin-dashboard-view.tsx`, `src/lib/mock-data.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-ADMIN-DB-01.01`: Implement `src/server/queries/admin.ts` and upgrade `src/server/actions/admin.ts` (`getKycSignedDocumentUrlAction`, transactional review recalculation, Category & City CRUD).
    - [x] `TASK-ADMIN-DB-01.02`: Migrate `/dashboard/admin` to RSC + Prisma (`admin-dashboard-view.tsx`), verify zero `mock-data` imports across `src/` & `prisma/`, and delete `src/lib/mock-data.ts`.

- [x] **`TASK-LEGAL-SEO-01` - [Scope: M] Legal Pages, Error/404 Boundaries, Footer Links & Dynamic SEO**
  - **Priority:** MEDIUM
  - **Target files:** `src/app/legal/**/*`, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`, `src/components/site-footer.tsx`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-LEGAL-SEO-01.01`: Create `/legal/cgu`, `/legal/confidentialite`, `/legal/mentions-legales`, branded `not-found.tsx` and `error.tsx`.
    - [x] `TASK-LEGAL-SEO-01.02`: Add dynamic `robots.ts`, `sitemap.ts`, French OpenGraph `metadata` in `src/app/layout.tsx`, and replace `#` placeholders in `SiteFooter`.

- [x] **`TASK-E2E-TESTS-01` - [Scope: M] Playwright E2E Spec, Deployment Runbook & Live Smoke Check**
  - **Priority:** MEDIUM
  - **Target files:** `package.json`, `playwright.config.ts`, `e2e/critical-flows.spec.ts`, `docs/DEPLOYMENT.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-E2E-TESTS-01.01`: Install `@playwright/test`, configure `playwright.config.ts`, author `e2e/critical-flows.spec.ts`, and write `docs/DEPLOYMENT.md`.
    - [x] `TASK-E2E-TESTS-01.02`: Execute live production HTTP smoke verification (public 200, RBAC 307, webhooks/queues 401, 404) and pass `python evals/run_fullstack_eval.py` (100/100 PASS).

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
