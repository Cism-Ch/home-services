# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 05) |  |   [?] SPRINT 05 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 05 Done!)   |  | (Queue Empty)           |  | Sprint 02 (11 tasks)    |
|                         |  |                         |  | Sprint 03 (4 tasks)     |
|                         |  |                         |  | Sprint 04 (3 tasks)     |
|                         |  |                         |  | Sprint 05 (4 tasks)     |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 05: Cloud Integrations (Redis, Tigris S3, Paystack & Realtime)

- [x] **`TASK-REDIS-CACHE-01` - [Scope: M] Upstash Redis Cache-Aside & Server Action Rate Limiting**
  - **Priority:** HIGH
  - **Target files:** `src/lib/redis.ts`, `src/server/queries/catalog.ts`, `src/server/actions/booking.ts`, `src/server/actions/reviews.ts`, `src/server/actions/pro-catalog.ts`, `src/server/actions/booking-status.ts`, `src/server/actions/subscription.ts`, `src/server/actions/admin.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-REDIS-CACHE-01.01`: Implement `src/lib/redis.ts` singleton client, catalog cache helpers (`getCachedOrFetch`, `invalidateCatalogCache`), and sliding-window `Ratelimit` (`enforceRateLimit`).
    - [x] `TASK-REDIS-CACHE-01.02`: Wire cache-aside + invalidation on public catalog queries/mutations and enforce rate limits on booking, review, upload presign, and Paystack checkout Server Actions.

- [x] **`TASK-TIGRIS-REAL-01` - [Scope: M] Real Tigris S3 Direct Upload, Portfolio/KYC Persistence & QStash Cleanup Worker**
  - **Priority:** HIGH
  - **Target files:** `next.config.ts`, `src/lib/storage.ts`, `src/app/api/queues/follow-up/route.ts`, `src/server/actions/pro-catalog.ts`, `src/app/dashboard/pro/profile/pro-profile-view.tsx`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-TIGRIS-REAL-01.01`: Upgrade `src/lib/storage.ts` using `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` (MIME + 5 MB limits, read URL, `DeleteObjectCommand`) and wire real deletion in `/api/queues/follow-up`.
    - [x] `TASK-TIGRIS-REAL-01.02`: Implement `confirmPortfolioUploadAction`, `confirmAvatarUploadAction`, `confirmKycUploadAction`, ownership-verified `removeStoredAssetAction`, and real `<input type="file">` direct S3 `PUT` upload UI in `pro-profile-view.tsx`.

- [x] **`TASK-PAYSTACK-PROD-01` - [Scope: L] Paystack Recurring Plans, Callback Verification, Webhook Hardening & Settings Migration**
  - **Priority:** HIGH
  - **Target files:** `src/lib/paystack.ts`, `src/app/api/webhooks/paystack/route.ts`, `src/server/actions/subscription.ts`, `src/server/queries/dashboard.ts`, `src/components/dashboard/billing-invoices.tsx`, `src/app/dashboard/client/settings/**/*`, `src/app/dashboard/pro/settings/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-PAYSTACK-PROD-01.01`: Support Paystack recurring plan codes, add `verifyPaystackTransaction`, harden `/api/webhooks/paystack` (`invoice.create`, `invoice.payment_failed`), and add `verifyAndSyncSubscriptionAction` + profile/business settings actions.
    - [x] `TASK-PAYSTACK-PROD-01.02`: Refactor `BillingInvoices`, `/dashboard/client/settings`, and `/dashboard/pro/settings` to Prisma + `@/lib/formatters` (zero `mock-data` imports) with callback verification and password change.

- [x] **`TASK-REALTIME-01` - [Scope: M] Supabase Realtime Selective Subscriptions & Optimistic UI**
  - **Priority:** MEDIUM
  - **Target files:** `prisma/migrations/**/*`, `src/lib/supabase-client.ts`, `src/lib/supabase-server.ts`, `src/hooks/use-realtime-status.ts`, `src/components/dashboard/pro-live-status-banner.tsx`, `src/components/pro-live-status-badge.tsx`, `src/components/pro-header.tsx`, `src/app/dashboard/client/bookings/**/*`, `src/app/dashboard/pro/schedule/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-REALTIME-01.01`: Enable `supabase_realtime` publication on `public.pro_profiles`, add `supabase-client.ts` + `supabase-server.ts` broadcast helper, and trigger booking status broadcasts from booking mutations.
    - [x] `TASK-REALTIME-01.02`: Implement `useProAvailabilityRealtime` and `useBookingStatusRealtime` hooks and wire them into `ProLiveStatusBanner`, `ProHeader`, `ClientBookingsView`, and `ProScheduleView`.

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
