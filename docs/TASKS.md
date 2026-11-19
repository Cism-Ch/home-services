# [SSOT] TASKS.md - Central Registry & Task Tracker

> Single Source of Truth (SSOT) for orchestrating technical and functional tasks.
> Absolute rule for AI Agents: Consult before every task, update immediately on completion.
> Strict ceiling: 250 lines.

---

## Synthetic Kanban View

```
+-------------------------+  +-------------------------+  +-------------------------+
| [>] IN PROGRESS (SP 07) |  |   [?] SPRINT 07 QUEUE   |  |       [X] ARCHIVES      |
+-------------------------+  +-------------------------+  +-------------------------+
| (All Sprint 07 Done!)   |  | (All Sprints 02-07 Done)|  | Sprint 02 (11 tasks)    |
|                         |  |                         |  | Sprint 03 (4 tasks)     |
|                         |  |                         |  | Sprint 04 (3 tasks)     |
|                         |  |                         |  | Sprint 05 (4 tasks)     |
|                         |  |                         |  | Sprint 06 (3 tasks)     |
|                         |  |                         |  | Sprint 07 (4 tasks)     |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## Active Sprint 07: Audit de Conformite shadcn/ui & Responsivite Mobile-First

- [x] **`TASK-UI-TOKENS-01` - [Scope: M] Tailwind v4 & Design Tokens Hardening (`globals.css`)**
  - **Priority:** HIGH
  - **Target files:** `src/app/globals.css`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-UI-TOKENS-01.01`: Fix `:root` WCAG AA contrast tokens, wrap all bare HSL triplets in `.luxury` inside `hsl(...)`, expose `--color-brand` in `@theme inline`.
    - [x] `TASK-UI-TOKENS-01.02`: Add `overflow-x: clip` on `body` and `@media (prefers-reduced-motion: reduce)` safeguards.

- [x] **`TASK-UI-SHADCN-01` - [Scope: L] Strict `shadcn/ui` Compliance & Primitive Cleanup**
  - **Priority:** HIGH
  - **Target files:** `src/components/ui/table.tsx`, `src/components/ui/responsive-table.tsx`, `src/components/marketing/**/*`, `src/components/skeleton-premium.tsx`, `src/components/city-combobox.tsx`, `src/components/pro-card.tsx`, `src/components/quick-search.tsx`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-UI-SHADCN-01.01`: Install shadcn `ui/table.tsx`, migrate `ResponsiveTable`, move marketing components out of `src/components/ui/`, delete unused `ui/icons.tsx`.
    - [x] `TASK-UI-SHADCN-01.02`: Eliminate nested `<Link><Button>` and nested `<Button><div role="button">` across components (`asChild`, sibling controls, real category slugs in `QuickSearch`).

- [x] **`TASK-UI-MOBILE-01` - [Scope: L] Mobile-First Layout Refactoring (320px-1440px)**
  - **Priority:** HIGH
  - **Target files:** `src/components/site-header.tsx`, `src/app/dashboard/layout.tsx`, `src/components/dashboard/dashboard-sidebar.tsx`, `src/app/dashboard/**/*`, `src/components/booking-stepper.tsx`, `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/professionals/**/*`, `src/app/services/**/*`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-UI-MOBILE-01.01`: Update `SiteHeader` (`lg:` breakpoint), add `min-w-0` to Dashboard `<main>`, fix `TabsList` multi-row wrapping, and fix stacked mobile borders/widths in Schedule, Bookings & Availability.
    - [x] `TASK-UI-MOBILE-01.02`: Refactor `BookingStepper`, `HeroSection`, `page.tsx`, `professionals-browser.tsx`, `services-browser.tsx`, and `about/page.tsx` (RSC + mobile padding, zero blocking `opacity-0`).

- [x] **`TASK-UI-A11Y-01` - [Scope: M] Multi-Viewport Responsive/A11y E2E Spec & Full Verification**
  - **Priority:** MEDIUM
  - **Target files:** `e2e/responsive-a11y.spec.ts`, `docs/TASKS.md`
  - **Acceptance criteria:**
    - [x] `TASK-UI-A11Y-01.01`: Create `e2e/responsive-a11y.spec.ts` verifying 320px/375px/768px/1280px viewports (zero horizontal overflow, no nested interactive controls).
    - [x] `TASK-UI-A11Y-01.02`: Pass `python evals/run_fullstack_eval.py` (`100/100 PASS`) and live production HTTP smoke verification.

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
