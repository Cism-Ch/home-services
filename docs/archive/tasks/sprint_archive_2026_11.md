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
