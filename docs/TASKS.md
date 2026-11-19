# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 03) |  |   [?] SPRINT 03 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 03 Done!)   |  | (Queue Empty)           |  | Sprint 02 (11 tasks)    |
|                         |  |                         |  | [x] TASK-PROD-ENV-01 [S]|
|                         |  |                         |  | [x] TASK-DB-MIGRATE [L] |
|                         |  |                         |  | [x] TASK-AUTH-REAL  [L] |
|                         |  |                         |  | [x] TASK-RBAC-GUARD [M] |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 03: Production Foundations (Env, Supabase DB + RLS & Real Auth/RBAC)

- [x] **`TASK-PROD-ENV-01` - [Scope: S] Environment Validation (`src/env.ts`), `.env.local` Shadowing Fix & Paystack Secret Hardening**
  - **Priority:** CRITICAL
  - **Target files:** `src/env.ts`, `.env.example`, `.env.local`, `.env`, `src/lib/paystack.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-PROD-ENV-01.01`: Comment out empty assignments in `.env.local` so `.env` keys are not shadowed, ensure `BETTER_AUTH_SECRET` is configured in `.env`, and document Paystack env keys in `.env.example`.
    - [x] `TASK-PROD-ENV-01.02`: Implement Zod runtime env validation in `src/env.ts` and remove the `BETTER_AUTH_SECRET` fallback from `verifyPaystackWebhookSignature` in `src/lib/paystack.ts`.

- [x] **`TASK-DB-MIGRATE-01` - [Scope: L] Prisma 7 Config, Schema Indexes, Supabase Migration, Seed & RLS Policies**
  - **Priority:** CRITICAL
  - **Target files:** `prisma.config.ts`, `prisma/prisma.config.ts`, `prisma/schema.prisma`, `prisma/migrations/**/*`, `prisma/seed.ts`, `package.json`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-DB-MIGRATE-01.01`: Migrate to root `prisma.config.ts` (Prisma 7 `defineConfig` format) and install `dotenv` + `tsx`.
    - [x] `TASK-DB-MIGRATE-01.02`: Extend `prisma/schema.prisma` with `UnavailabilityPeriod`, `portfolioImages`, `languages`, uniqueness/FK indexes, and apply migration + `prisma generate`.
    - [x] `TASK-DB-MIGRATE-01.03`: Enable Supabase Row Level Security (`ENABLE ROW LEVEL SECURITY`) across all 13 tables with explicit public catalog policies and create idempotent `prisma/seed.ts`.

- [x] **`TASK-AUTH-REAL-01` - [Scope: L] Real Better-Auth Wiring (Login, Role-Based Register, ProProfile Provisioning, Forgot/Reset Password)**
  - **Priority:** CRITICAL
  - **Target files:** `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/validations/auth.ts`, `src/contexts/auth-context.tsx`, `src/emails/reset-password-email.tsx`, `src/lib/qstash.ts`, `src/lib/resend.ts`, `src/app/api/queues/follow-up/route.ts`, `src/app/api/auth/[...all]/route.ts.disabled`, `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/forgot-password/page.tsx`, `src/app/reset-password/page.tsx`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-AUTH-REAL-01.01`: Configure `user.additionalFields` (`userType`, `phoneNumber`), role sanitization + auto `ProProfile` creation hooks in `src/lib/auth.ts`, `inferAdditionalFields` + zero emojis in `src/lib/auth-client.ts`, and remove legacy `route.ts.disabled`.
    - [x] `TASK-AUTH-REAL-01.02`: Wire QStash + Resend password reset emails and connect `/login`, `/register`, `/forgot-password`, and `/reset-password` to real Better-Auth flows.

- [x] **`TASK-RBAC-GUARD-01` - [Scope: M] Server-Side RBAC Guards, Dynamic Session Sidebar/Header & Server Action Auth Hardening**
  - **Priority:** HIGH
  - **Target files:** `src/server/auth-guard.ts`, `src/middleware.ts`, `src/app/dashboard/**/*`, `src/components/dashboard/dashboard-sidebar.tsx`, `src/components/site-header.tsx`, `src/server/actions/*.ts`, `src/app/**/*`, `src/components/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-RBAC-GUARD-01.01`: Implement `src/server/auth-guard.ts` and protect `/dashboard`, `/dashboard/client`, `/dashboard/pro`, and `/dashboard/admin` layouts by session & role.
    - [x] `TASK-RBAC-GUARD-01.02`: Update `DashboardSidebar` and `SiteHeader` with real authenticated user session + logout, and enforce `requireActionSession` / ownership checks across all Server Actions.

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
