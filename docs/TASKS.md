# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 04) |  |   [?] SPRINT 04 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 04 Done!)   |  | (Queue Empty)           |  | Sprint 02 (11 tasks)    |
|                         |  |                         |  | Sprint 03 (4 tasks)     |
|                         |  |                         |  | [x] TASK-CATALOG-DB [L] |
|                         |  |                         |  | [x] TASK-SLOTS-DB-01 [L]|
|                         |  |                         |  | [x] TASK-DASH-DB-01  [L]|
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 04: 100% Prisma Production Data & End of mock-data.ts

- [x] **`TASK-CATALOG-DB-01` - [Scope: L] Shared Formatters/Types, Prisma Public Catalog Queries & Public Pages Migration**
  - **Priority:** CRITICAL
  - **Target files:** `src/lib/formatters.ts`, `src/lib/types/catalog.ts`, `src/server/queries/catalog.ts`, `src/components/**/*`, `src/app/page.tsx`, `src/app/services/**/*`, `src/app/professionals/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-CATALOG-DB-01.01`: Extract `formatFCFA` into `src/lib/formatters.ts`, create `src/lib/types/catalog.ts`, and implement `src/server/queries/catalog.ts` backed by Prisma with subscriber priority sorting.
    - [x] `TASK-CATALOG-DB-01.02`: Refactor UI components (`ProCard`, `ProHeader`, `ProServicesList`, `ProReviews`, `ServiceListingCard`, `ServiceFilter`, `BookingSummary`, `BookingTicket`, `CreateServiceDialog`, `BillingInvoices`) off `mock-data.ts` and migrate `/`, `/services`, `/professionals`, `/professionals/pros/[id]` to RSC + Prisma with Skeletons and zero emojis.

- [x] **`TASK-SLOTS-DB-01` - [Scope: L] Real TimeSlot & Unavailability Persistence, Dynamic DateTimePicker & Anti-Double-Booking**
  - **Priority:** CRITICAL
  - **Target files:** `src/server/actions/availability.ts`, `src/server/actions/booking.ts`, `src/components/date-time-picker.tsx`, `src/app/dashboard/pro/availability/**/*`, `src/app/book/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SLOTS-DB-01.01`: Implement `src/server/actions/availability.ts` and persist Pro weekly `TimeSlot` + `UnavailabilityPeriod` entries in `/dashboard/pro/availability`.
    - [x] `TASK-SLOTS-DB-01.02`: Upgrade `DateTimePicker`, migrate `/book/[proId]/[serviceId]` to RSC + Prisma, and enforce transactional anti-double-booking with canonical `User.id` FK in `src/server/actions/booking.ts`.

- [x] **`TASK-DASHBOARDS-DB-01` - [Scope: L] Client & Pro Dashboards 100% Prisma, Atomic Rating/Task Counters & Real Error Handling**
  - **Priority:** CRITICAL
  - **Target files:** `src/server/queries/dashboard.ts`, `src/server/actions/booking-status.ts`, `src/server/actions/reviews.ts`, `src/server/actions/pro-catalog.ts`, `src/app/dashboard/client/**/*`, `src/app/dashboard/pro/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-DASHBOARDS-DB-01.01`: Implement `src/server/queries/dashboard.ts` and migrate Client and Pro dashboard pages to real Prisma data.
    - [x] `TASK-DASHBOARDS-DB-01.02`: Remove silent `catch {}` fallbacks, send real booking metadata to QStash, atomically recalculate `rating` / `reviewsCount` / `completedTasks` on `ProProfile`, and verify zero `mock-data` imports outside Admin.

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
