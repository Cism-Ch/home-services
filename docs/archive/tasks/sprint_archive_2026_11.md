# Archived Sprint Tasks (2026-11)

- [x] **`TASK-SKILLS-PRUNE-01` - Prune Unused Skill Files, Create .bak Archive & Agent Restore Log**
  - **Priority:** MEDIUM
  - **Target files:** `.agents/skills/**/*`, `backups/skills/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SKILLS-PRUNE-01.01`: Identify non-essential skills files across unused languages, marketing, and non-target stacks.
    - [x] `TASK-SKILLS-PRUNE-01.02`: Archive pruned files into `.bak` archive and generate structured restoration log and helper script.
    - [x] `TASK-SKILLS-PRUNE-01.03`: Verify tooling integrity with `python evals/stack_inspector.py` and test file restoration.

- [x] **`TASK-SKILLS-01` - Ecosystem Skills Integration (UI, Tailwind, Prisma, Storage, Infrastructure)**
  - **Priority:** MEDIUM
  - **Target files:** `.agents/skills/**/*`, `skills-lock.json`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SKILLS-01.01`: Install Tailwind CSS design system and Tailwind v4 + shadcn UI skills.
    - [x] `TASK-SKILLS-01.02`: Install Prisma, Upstash, Resend, and Tigris storage skills.
    - [x] `TASK-SKILLS-01.03`: Validate complete tooling coverage via `evals/stack_inspector.py`.

- [x] **`TASK-SEC-01` - Vulnerability Audit & Codebase Security Hardening**
  - **Priority:** HIGH
  - **Target files:** `src/middleware.ts`, `src/app/api/auth/[...all]/route.ts`, `next.config.ts`, `src/lib/auth.ts`, `src/lib/prisma.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-SEC-01.01`: Configure HTTP security headers in `next.config.ts` (Clickjacking, MIME sniffing, HSTS, CSP/Permissions).
    - [x] `TASK-SEC-01.02`: Secure `src/middleware.ts` to guard `/dashboard/*` with Better-Auth session cookie and prevent open redirects.
    - [x] `TASK-SEC-01.03`: Enable Better-Auth Next.js route handler (`src/app/api/auth/[...all]/route.ts`) and prevent credential leaks in logs.
    - [x] `TASK-SEC-01.04`: Validate zero type errors (`pnpm exec tsc --noEmit`) and successful production build (`pnpm run build`).

- [x] **`TASK-ENV-01` - Supabase Migration & Environment Variables Configuration**
  - **Priority:** HIGH
  - **Target files:** `.env.example`, `.env.local`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-ENV-01.01`: Create `.env.example` documenting Supabase (DB & API), Better-Auth, Tigris S3, Upstash Redis/QStash, and Resend.
    - [x] `TASK-ENV-01.02`: Preconfigure `.env.local` template for development without leaking production secrets.
    - [x] `TASK-ENV-01.03`: Verify static security audit and deterministic judge (`python evals/security_audit.py`).

- [x] **`TASK-DOCS-03` - Comprehensive README Overhaul with Hero Header & Full Protocol Cycle**
  - **Priority:** HIGH
  - **Target files:** `README.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-DOCS-03.01`: Design an elegant ASCII banner hero header and cohesive typography hierarchy.
    - [x] `TASK-DOCS-03.02`: Document real-world failure scenarios 6 & 7 (Scope Drift & Reinventing Existing Infrastructure).
    - [x] `TASK-DOCS-03.03`: Upgrade the operational Mermaid diagram with the complete end-to-end loop (`--pulse`, `--map`, `--impact`, `--diagnose`, `--scope`, `--rollover`).
    - [x] `TASK-DOCS-03.04`: Validate with deterministic judge (`100/100 PASS`) and ASCII hygiene check.

- [x] **`TASK-ORCH-01` - Cold-Start Session Pulse (`--pulse`) & Automated Task Rollover (`--rollover`)**
  - **Priority:** HIGH
  - **Target files:** `evals/rsi_orchestrator.py`, `.agents/workflows/rsi-feature.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-ORCH-01.01`: Implement `--pulse` in `evals/rsi_orchestrator.py` for 1-command cold-start situational awareness (`< 50ms`).
    - [x] `TASK-ORCH-01.02`: Implement `--rollover` (with `--dry-run`) in `evals/rsi_orchestrator.py` to archive completed `[x]` sprint blocks to `docs/archive/tasks/` and keep `docs/TASKS.md` under 250 lines.
    - [x] `TASK-ORCH-01.03`: Update `.agents/workflows/rsi-feature.md`, `README.md`, and `docs/ARCHITECTURE.md`.
    - [x] `TASK-ORCH-01.04`: Validate full deterministic evaluation (`100/100 PASS`) and guardrails.

- [x] **`TASK-TOPO-SCOPE-01` - Topological Repo Map, Blast Radius Analyzer & Scope Drift Guard**
  - **Priority:** HIGH
  - **Target files:** `evals/stack_inspector.py`, `evals/rsi_orchestrator.py`, `.agents/rules/modules/pattern_recognition.md`, `.agents/workflows/rsi-feature.md`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-TOPO-SCOPE-01.01`: Add `--map` (Topological Repo Map & Canonical Singletons) and `--impact <file>` (Blast Radius Predictor) to `evals/stack_inspector.py`.
    - [x] `TASK-TOPO-SCOPE-01.02`: Add `--scope` and `--strict-scope` (Scope Drift Guard vs active `[-]` task in `docs/TASKS.md`) to `evals/rsi_orchestrator.py`.
    - [x] `TASK-TOPO-SCOPE-01.03`: Add `[R-PAT-05]` and `[R-PAT-06]` to `.agents/rules/modules/pattern_recognition.md` and update `.agents/workflows/rsi-feature.md`, `README.md`, and `docs/ARCHITECTURE.md`.
    - [x] `TASK-TOPO-SCOPE-01.04`: Validate full deterministic evaluation (`100/100 PASS`) and guardrails.

- [x] **`TASK-PAT-01` - Hybrid Pattern Recognition & Operational Security Engine**
  - **Priority:** HIGH
  - **Target files:** `.agents/rules/modules/pattern_recognition.md`, `.agents/rules/fullstack_playbook.md`, `evals/memory_engine.py`, `evals/security_audit.py`, `README.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-PAT-01.01`: Create `.agents/rules/modules/pattern_recognition.md` (`< 80` lines, pure ASCII) and index it in `.agents/rules/fullstack_playbook.md`.
    - [x] `TASK-PAT-01.02`: Implement `--diagnose` in `evals/memory_engine.py` for instant deterministic error pattern resolution (`< 10ms`).
    - [x] `TASK-PAT-01.03`: Implement `audit_operational_patterns()` in `evals/security_audit.py` to block runtime anti-patterns.
    - [x] `TASK-PAT-01.04`: Update `README.md` and `docs/ARCHITECTURE.md` and validate full deterministic evaluation (`100/100 PASS`).

- [x] **`TASK-MEM-01` - Refine Memory Consolidation & Module Splitting Protocol**
  - **Priority:** HIGH
  - **Target files:** `README.md`, `docs/ARCHITECTURE.md`, `.agents/prompts/meta_optimizer.md`, `.agents/workflows/rsi-feature.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-MEM-01.01`: Update `README.md` and `docs/ARCHITECTURE.md` to formalize the 2-step anti-bloat strategy (lossless synthesis of redundant rules OR granular module splitting).
    - [x] `TASK-MEM-01.02`: Update `.agents/prompts/meta_optimizer.md` and `.agents/workflows/rsi-feature.md` to forbid lossy compression of distinct technical rules and instruct splitting when needed.
    - [x] `TASK-MEM-01.03`: Validate full deterministic evaluation (100/100 PASS) and guardrails.

- [x] **`TASK-CI-FIX-01` - Fix Linux CI Subprocess Execution in Deterministic Judge**
  - **Priority:** HIGH
  - **Target files:** `evals/run_fullstack_eval.py`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-CI-FIX-01.01`: Support list-based command execution in `run_cmd` to eliminate string quoting errors on Linux/Unix.
    - [x] `TASK-CI-FIX-01.02`: Pass Python invocations as tokenized argument lists (`[py, str(path), ...]`).
    - [x] `TASK-CI-FIX-01.03`: Enable cross-platform shell execution when shell string commands are passed.
    - [x] `TASK-CI-FIX-01.04`: Validate full deterministic evaluation (100/100 PASS).

- [x] **`TASK-CI-01` - GitHub Actions CI & Automated Release Pipeline**
  - **Priority:** HIGH
  - **Target files:** `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-CI-01.01`: Create `.github/workflows/ci.yml` for pull requests and branch validation.
    - [x] `TASK-CI-01.02`: Create `.github/workflows/release.yml` triggered on tags (`v*`) with deterministic quality gate.
    - [x] `TASK-CI-01.03`: Verify workflow files are tracked by Git and excluded from `.gitignore`.
    - [x] `TASK-CI-01.04`: Validate full deterministic evaluation (100/100 PASS).

- [x] **`TASK-DECOUPLE-01` - Decouple Workflow Protocol from Application Package.json**
  - **Priority:** HIGH
  - **Target files:** `package.json`, `VERSION`, `evals/version_manager.py`, `README.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-DECOUPLE-01.01`: Remove premature application `package.json` to maintain true language-agnostic template purity.
    - [x] `TASK-DECOUPLE-01.02`: Ensure `evals/version_manager.py` cleanly operates with `VERSION` and `CHANGELOG.md` alone.
    - [x] `TASK-DECOUPLE-01.03`: Clarify in `README.md` that `package.json` belongs to the application layer (`TASK-INIT-01`).
    - [x] `TASK-DECOUPLE-01.04`: Validate full deterministic evaluation (100/100 PASS).

- [x] **`TASK-RSI-SPEC-01` - Protocol Versioning, Real IDE Use Cases & Deterministic Emoji Guard**
  - **Priority:** HIGH
  - **Target files:** `VERSION`, `package.json`, `evals/security_audit.py`, `evals/run_fullstack_eval.py`, `.agents/rules/system_core.md`, `README.md`
  - **Acceptance criteria:**
    - [x] `TASK-RSI-SPEC-01.01`: Establish official protocol versioning via `VERSION` file, `package.json`, and SemVer synchronization.
    - [x] `TASK-RSI-SPEC-01.02`: Implement deterministic ASCII and Emoji guard in `evals/security_audit.py` to block agents from committing emojis or non-ASCII characters.
    - [x] `TASK-RSI-SPEC-01.03`: Add real-world, battle-tested failure scenarios in `README.md` (Cursor, Windsurf, Claude Code, Cline).
    - [x] `TASK-RSI-SPEC-01.04`: Add `[R-SYS-05]` in `.agents/rules/system_core.md` and validate with deterministic judge (100/100 PASS).

- [x] **`TASK-DOCS-02` - Comprehensive Documentation Overhaul (No Emojis, Agentic IDEs, Mermaid)**
  - **Priority:** HIGH
  - **Target files:** `README.md`, `docs/ARCHITECTURE.md`, `AGENTS.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-DOCS-02.01`: Remove all emojis across `README.md` and related docs for clean, professional presentation.
    - [x] `TASK-DOCS-02.02`: Frame context around modern agentic coding environments (Cursor, Windsurf, Google Antigravity, Claude Code, Copilot Workspace, Cline).
    - [x] `TASK-DOCS-02.03`: Replace crude loop ASCII graph with a clean, high-clarity GitHub-native Mermaid diagram.
    - [x] `TASK-DOCS-02.04`: Provide thorough, production-grade documentation of memory duality, dynamic injection, the 4-phase cycle, and deterministic evaluation.
    - [x] `TASK-DOCS-02.05`: Validate deterministic evaluation (100/100 PASS) and guardrails.

- [x] **`TASK-RSI-RESET-01` - Standalone RSI Reset Engine & `/reset-rsi` Workflow**
  - **Priority:** HIGH
  - **Target files:** `evals/reset_rsi.py`, `.agents/workflows/reset-rsi.md`, `evals/run_fullstack_eval.py`
  - **Acceptance criteria:**
    - [x] `TASK-RSI-RESET-01.01`: Create `evals/reset_rsi.py` with pure ASCII output supporting `--dry-run`, `--hard`, `--keep-rules`, `--backup`.
    - [x] `TASK-RSI-RESET-01.02`: Create workflow `.agents/workflows/reset-rsi.md` for conversational agent execution (`/reset-rsi`).
    - [x] `TASK-RSI-RESET-01.03`: Deterministic validation and test execution.

- [x] **`TASK-DOCS-01` - GitHub Documentation Suite & Open Source Readiness**
  - **Priority:** HIGH
  - **Target files:** `README.md`, `docs/ARCHITECTURE.md`, `CONTRIBUTING.md`, `LICENSE`
  - **Acceptance criteria:**
    - [x] `TASK-DOCS-01.01`: Overhaul `README.md` with complete GitHub badges, quickstart, CLI reference, and architecture diagrams.
    - [x] `TASK-DOCS-01.02`: Create deep-dive `docs/ARCHITECTURE.md` (feedback loops, evaluation harness, memory duality).
    - [x] `TASK-DOCS-01.03`: Add `CONTRIBUTING.md` and MIT `LICENSE` for public open-source usage.
    - [x] `TASK-DOCS-01.04`: Validate full deterministic evaluation (100/100 PASS) and guardrails.

- [x] **`TASK-INIT-01` - Project Scaffolding & Initial Setup (pnpm Migration)**
  - **Priority:** MEDIUM
  - **Target files:** `package.json`, `pnpm-lock.yaml`, `README.md`
  - **Acceptance criteria:**
    - [x] `TASK-INIT-01.01`: Technical baseline, migration to pnpm and lockfile generation.
    - [x] `TASK-INIT-01.02`: Deterministic validation with typecheck (`pnpm exec tsc --noEmit`) and production build (`pnpm run build`).

- [x] **`TASK-HYGIENE-01` - [Scope: XS] Lint Fixes, Zero Emoji Enforcement & Judge 100/100**
  - **Priority:** CRITICAL
  - **Target files:** `AGENTS.md`, `evals/security_audit.py`, `src/app/dashboard/client/page.tsx`, `src/app/professionals/pros/[id]/page.tsx`, `src/**/*`, `docs/archive/tasks/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-HYGIENE-01.01`: Remove residual emojis from `src/app/dashboard/client/page.tsx` and `src/app/professionals/pros/[id]/page.tsx`.
    - [x] `TASK-HYGIENE-01.02`: Fix ESLint errors across `src/` and refine `evals/security_audit.py` so French accents in `AGENTS.md` are permitted while strictly blocking emojis.
    - [x] `TASK-HYGIENE-01.03`: Validate `100/100 PASS` on `python evals/run_fullstack_eval.py`.

- [x] **`TASK-UI-INDEX-01` - [Scope: M] Missing Shadcn Primitives, Skeletons & Component Index**
  - **Priority:** CRITICAL
  - **Target files:** `src/components/ui/**/*`, `src/app/layout.tsx`, `package.json`, `pnpm-lock.yaml`, `docs/COMPONENT_INDEX.md`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-UI-INDEX-01.01`: Install missing shadcn primitives (`skeleton`, `drawer`, `sonner`, `tooltip`, `popover`, `separator`, `scroll-area`, `breadcrumb`, `pagination`, `radio-group`, `command`, `progress`).
    - [x] `TASK-UI-INDEX-01.02`: Create `SkeletonPremium` and `ResponsiveTable` components for consistent loading states and mobile-first tables.
    - [x] `TASK-UI-INDEX-01.03`: Generate `docs/COMPONENT_INDEX.md` documenting all UI, Auth, Dashboard, and Business components.

- [x] **`TASK-PRISMA-01` - [Scope: L] Complete SaaS Prisma Schema (XOF, Time Slots, Offer Status, Mutual Reviews, Paystack)**
  - **Priority:** CRITICAL
  - **Target files:** `prisma/schema.prisma`, `src/lib/mock-data.ts`, `src/lib/validations/**/*`, `src/components/booking-ticket.tsx`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-PRISMA-01.01`: Extend `prisma/schema.prisma` with `ProProfile` (`availabilityStatus`, WhatsApp, city, KYC), `Category`, `City`, `Service` (XOF/FCFA), `TimeSlot`, `Booking` (`NEGOTIATING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), `Review` (mutual), and `Subscription` (Paystack).
    - [x] `TASK-PRISMA-01.02`: Replace EUR/French mock data with Francophone Africa cities (Abidjan, Dakar, Douala, Cotonou, Lome) and FCFA pricing.
    - [x] `TASK-PRISMA-01.03`: Create Zod validation schemas for all domain inputs and validate Prisma schema integrity.

- [x] **`TASK-HERO-GEO-01` - [Scope: S] Animated 4-Slogan Hero (Framer Motion) & Searchable/Sortable Geo City Selector**
  - **Priority:** HIGH
  - **Target files:** `src/app/page.tsx`, `src/components/ui/hero-section.tsx`, `src/components/city-combobox.tsx`, `src/components/quick-search.tsx`, `src/components/service-filter.tsx`, `src/lib/cities-data.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-HERO-GEO-01.01`: Implement Framer Motion text rotator for the 4 official project slogans with elegant transitions.
    - [x] `TASK-HERO-GEO-01.02`: Build comprehensive searchable and sortable `CityCombobox` component covering Côte d'Ivoire cities, towns, and main communes + regional hubs.
    - [x] `TASK-HERO-GEO-01.03`: Integrate `CityCombobox` into `QuickSearch` and `ServiceFilter` with live filtering and "Available today" toggle.

- [x] **`TASK-BOOKING-SLOTS-01` - [Scope: L] Time-Slot Appointment Booking, Negotiation State & Direct WhatsApp/Phone Contact**
  - **Priority:** HIGH
  - **Target files:** `src/app/book/[proId]/[serviceId]/page.tsx`, `src/app/professionals/pros/[id]/page.tsx`, `src/components/booking-*.tsx`, `src/components/pro-header.tsx`, `src/server/actions/booking.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-BOOKING-SLOTS-01.01`: Refactor `/book/[proId]/[serviceId]` for pure time-slot reservation (no online service payment) creating an offer in `NEGOTIATING` status.
    - [x] `TASK-BOOKING-SLOTS-01.02`: Add direct WhatsApp (`wa.me` with pre-filled context & voice note prompt) and Phone (`tel:`) buttons on Pro profiles and booking tickets.

- [x] **`TASK-PRO-STATUS-01` - [Scope: L] Automatic Pro Availability Lock on Validated Offer & Interactive Client Follow-Up**
  - **Priority:** HIGH
  - **Target files:** `src/app/dashboard/pro/page.tsx`, `src/app/dashboard/pro/availability/page.tsx`, `src/app/dashboard/pro/schedule/page.tsx`, `src/app/dashboard/client/page.tsx`, `src/app/dashboard/client/bookings/page.tsx`, `src/components/dashboard/**/*`, `src/server/actions/booking-status.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-PRO-STATUS-01.01`: Automatically switch Pro availability to `BUSY_TODAY` and lock overlapping time slots when a negotiated offer is validated by the client (`IN_PROGRESS`), with manual override toggle.
    - [x] `TASK-PRO-STATUS-01.02`: Implement interactive follow-up notification prompt for clients ("Has your task been finalized? [Yes / In Progress / No]") to synchronize task completion (`COMPLETED`), unlock Pro availability, and trigger rating.

- [x] **`TASK-PRO-CATALOG-01` - [Scope: M] Pro Services CRUD in FCFA, African Business Profile & Tigris S3 KYC Upload**
  - **Priority:** HIGH
  - **Target files:** `src/app/dashboard/pro/services/page.tsx`, `src/app/dashboard/pro/profile/page.tsx`, `src/app/dashboard/pro/settings/page.tsx`, `src/lib/storage.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-PRO-CATALOG-01.01`: Update Pro settings and profile forms with African phone country codes, WhatsApp number, local registration (RCCM/IFU/CNI), and FCFA service pricing.
    - [x] `TASK-PRO-CATALOG-01.02`: Configure Tigris S3 presigned URLs for portfolio images and KYC document uploads.

- [x] **`TASK-MUTUAL-REVIEWS-01` - [Scope: M] Bidirectional Mutual Review System (Client <-> Pro)**
  - **Priority:** MEDIUM
  - **Target files:** `src/components/add-review-form.tsx`, `src/components/pro-reviews.tsx`, `src/app/dashboard/client/bookings/page.tsx`, `src/app/dashboard/pro/schedule/page.tsx`, `src/server/actions/reviews.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-MUTUAL-REVIEWS-01.01`: Enable Client -> Pro and Pro -> Client star ratings and written reviews strictly after a booking reaches `COMPLETED` status.

- [x] **`TASK-PAYSTACK-01` - [Scope: L] Paystack Subscriptions (Pro 5k/10k/20k FCFA + 1 Month Free & Client Gold 2k FCFA)**
  - **Priority:** HIGH
  - **Target files:** `src/lib/paystack.ts`, `src/app/api/webhooks/paystack/route.ts`, `src/components/dashboard/billing-invoices.tsx`, `src/app/dashboard/client/settings/page.tsx`, `src/app/dashboard/pro/settings/page.tsx`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-PAYSTACK-01.01`: Implement Paystack checkout and subscription plans for Pros (5 000, 10 000, 20 000 FCFA/month with 1 month free trial) and Clients (2 000 FCFA/month Gold badge & search boost).
    - [x] `TASK-PAYSTACK-01.02`: Implement verified Paystack webhook handler and FCFA billing invoice history.

- [x] **`TASK-ASYNC-NOTIFY-01` - [Scope: M] Upstash QStash & Resend Follow-Up Notifications**
  - **Priority:** MEDIUM
  - **Target files:** `src/lib/qstash.ts`, `src/lib/resend.ts`, `src/app/api/queues/**/*`, `src/emails/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-ASYNC-NOTIFY-01.01`: Dispatch asynchronous follow-up emails ("Has your task been finalized? [Yes / In Progress / No]") and status alerts via Upstash QStash (`receiver.verify`) and Resend React Email templates.

- [x] **`TASK-ADMIN-FLOW-01` - [Scope: L] Admin Governance Portal (`/dashboard/admin`)**
  - **Priority:** MEDIUM
  - **Target files:** `src/app/dashboard/admin/**/*`, `src/components/dashboard/dashboard-sidebar.tsx`, `src/middleware.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-ADMIN-FLOW-01.01`: Build `/dashboard/admin` with Pro KYC verification queue, mutual review moderation, city/category management, and Paystack subscription KPIs.

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
