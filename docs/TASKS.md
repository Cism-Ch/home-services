# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 08) |  |   [?] SPRINT 08 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 08 Done!)   |  | (All Sprints 02-08 Done)|  | Sprint 02 (11 tasks)    |
|                         |  |                         |  | Sprint 03 (4 tasks)     |
|                         |  |                         |  | Sprint 04 (3 tasks)     |
|                         |  |                         |  | Sprint 05 (4 tasks)     |
|                         |  |                         |  | Sprint 06 (3 tasks)     |
|                         |  |                         |  | Sprint 07 (4 tasks)     |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 08: Jeu de Donnees de Test (Mock Seed DB) & Documentation des Comptes

- [x] **`TASK-SEED-DATA-01` - [Scope: L] Dataset Structure & Seed Prisma Idempotent (1 Admin, 5 Clients, 20 Pros)**
  - **Priority:** HIGH
  - **Target files:** `prisma/load-env.ts`, `prisma/seed-data.ts`, `prisma/seed.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SEED-DATA-01.01`: Create `prisma/load-env.ts` and `prisma/seed-data.ts` with typed fixtures for 1 Admin, 5 Clients, 20 Professionals (2 per category across all 10 categories with verified `locationsData` city IDs), ~46 FCFA services, 4 unavailabilities, 22 subscriptions, 20 multi-status bookings, and 16 mutual reviews (including 2 reported).
    - [x] `TASK-SEED-DATA-01.02`: Update `prisma/seed.ts` to upsert all 26 users and their Better-Auth `Account` (`providerId: "credential"`, `accountId: user.id`, password hashed via `hashPassword` from `better-auth/crypto`), bulk-seed weekly `TimeSlot`s, recalculate exact Pro ratings/counts from seeded rows, guard against production execution, and invalidate Upstash Redis catalog cache.

- [x] **`TASK-SEED-DOCS-01` - [Scope: M] Documentation Comptes de Test, Injection Supabase & Verification Auth Live**
  - **Priority:** HIGH
  - **Target files:** `docs/TEST_ACCOUNTS.md`, `src/lib/auth.ts`, `src/lib/auth-client.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SEED-DOCS-01.01`: Author `docs/TEST_ACCOUNTS.md` (zero emojis) documenting all 26 accounts (1 Admin, 5 Clients, 20 Pros) with login credentials, roles, specialties, zones, KYC/availability/subscription states, and guided end-to-end test scenarios.
    - [x] `TASK-SEED-DOCS-01.02`: Execute `pnpm run db:seed` twice against live Supabase PostgreSQL to prove idempotency, pass `python evals/run_fullstack_eval.py` (`100/100 PASS`), and verify live HTTP `200` sign-in on `/api/auth/sign-in/email` for Admin, Client, and Pro accounts.

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
