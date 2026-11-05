# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 02) |  |   [?] SPRINT 02 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 02 Done!)   |  | (Queue Empty)           |  | [x] TASK-HYGIENE-01 [XS]|
|                         |  |                         |  | [x] TASK-UI-INDEX-01 [M]|
|                         |  |                         |  | [x] TASK-PRISMA-01  [L] |
|                         |  |                         |  | [x] TASK-HERO-GEO-01 [S] |
|                         |  |                         |  | [x] TASK-BOOK-SLOTS [L] |
|                         |  |                         |  | [x] TASK-PRO-STATUS [L] |
|                         |  |                         |  | [x] TASK-PRO-CATALOG[M] |
|                         |  |                         |  | [x] TASK-REVIEWS-01 [M] |
|                         |  |                         |  | [x] TASK-PAYSTACK-01[L] |
|                         |  |                         |  | [x] TASK-ASYNC-NOTIF[M] |
|                         |  |                         |  | [x] TASK-ADMIN-FLOW [L] |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 02: SaaS Core Flows, Slot Booking & Paystack Monetization

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
