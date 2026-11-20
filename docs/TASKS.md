# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 09) |  |   [?] SPRINT 09 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 09 Done!)   |  | (All Sprints 02-09 Done)|  | Sprint 02 (11 tasks)    |
|                         |  |                         |  | Sprint 03-04 (7 tasks)  |
|                         |  |                         |  | Sprint 05-06 (7 tasks)  |
|                         |  |                         |  | Sprint 07 (4 tasks)     |
|                         |  |                         |  | Sprint 08 (2 tasks)     |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 09: Audit de Vulnerabilites & Tests de Penetration Applicative

- [x] **`TASK-SEC-AUDIT-01` - [Scope: L] Durcissement Auth Escalation, Paystack & QStash**
  - **Priority:** CRITICAL
  - **Target files:** `src/lib/auth.ts`, `src/lib/paystack.ts`, `src/lib/qstash.ts`, `src/app/api/webhooks/paystack/route.ts`, `src/app/api/queues/follow-up/route.ts`, `src/server/actions/subscription.ts`, `src/lib/validations/subscription.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SEC-AUDIT-01.01`: Remove `route.ts.disabled` and add Better-Auth `databaseHooks.user.update.before` blocking client-side `userType`/`emailVerified` escalation and unsafe avatar schemes.
    - [x] `TASK-SEC-AUDIT-01.02`: Enforce Paystack plan/role eligibility, verified amount >= plan price, strict callback origin allowlist, `invoice.create` non-activation, QStash `alg: "HS256"` + mandatory SHA-256 `claims.body`, and Zod webhook payload schemas.

- [x] **`TASK-SEC-LOGIC-01` - [Scope: L] Durcissement Server Actions, S3 Anti-Traversal, Email XSS & Redirections**
  - **Priority:** HIGH
  - **Target files:** `src/lib/storage.ts`, `src/server/actions/booking.ts`, `src/server/actions/booking-status.ts`, `src/server/actions/pro-catalog.ts`, `src/server/actions/admin.ts`, `src/server/actions/availability.ts`, `src/server/actions/reviews.ts`, `src/lib/validations/booking.ts`, `src/emails/task-follow-up-email.tsx`, `src/emails/reset-password-email.tsx`, `src/components/auth/social-auth-buttons.tsx`, `src/app/login/page.tsx`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SEC-LOGIC-01.01`: Enforce strict S3 objectKey ownership & canonical URL construction in `storage.ts`/`pro-catalog.ts`, plus HTML escaping and URL sanitization in email templates.
    - [x] `TASK-SEC-LOGIC-01.02`: Enforce booking state-machine transitions, self-booking prevention, past-date & unavailability overlap checks, open-redirect control-char hardening, and sanitized server error responses.

- [x] **`TASK-SEC-INFRA-01` - [Scope: M] Supabase RLS Column Grants, CSP/Headers & CVE Remediation**
  - **Priority:** HIGH
  - **Target files:** `prisma/migrations/20261119233000_harden_rls_column_grants/migration.sql`, `prisma/seed-data.ts`, `prisma/seed.ts`, `next.config.ts`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SEC-INFRA-01.01`: Deploy Supabase column-level SELECT grant on `pro_profiles` blocking `kycDocumentUrl`/PII, revoke anon table privileges on private tables, align seeded reviews `isModerated` flags, and add CSP + disable `X-Powered-By` in `next.config.ts`.
    - [x] `TASK-SEC-INFRA-01.02`: Remediate production CVE (`effect >= 3.22.1`) and confirm `pnpm audit --prod --audit-level=low` reports 0 vulnerabilities.

- [x] **`TASK-SEC-PENTEST-01` - [Scope: M] Suite de Tests Defensifs, Controles Live & Rapport d'Audit**
  - **Priority:** HIGH
  - **Target files:** `e2e/security-guards.spec.ts`, `docs/SECURITY_AUDIT_REPORT.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SEC-PENTEST-01.01`: Create `e2e/security-guards.spec.ts` and author comprehensive `docs/SECURITY_AUDIT_REPORT.md` (zero emojis).
    - [x] `TASK-SEC-PENTEST-01.02`: Pass `python evals/run_fullstack_eval.py` (`100/100 PASS`) and execute all 8 live HTTP + Supabase PostgREST security controls.

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
