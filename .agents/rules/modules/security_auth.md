# Module: Security, Auth & Sensitive Data

> Anti-Bloat Rule: This module must NEVER exceed **80 lines**.

- [R-SEC-01] Strictly validate sessions and permissions server-side at the start of every controller or action.
- [R-SEC-02] NEVER expose password hashes, tokens, or private keys to the client.
- [R-SEC-03] Encrypt at rest (AES-256) all user-provided secrets, tokens, or sensitive credentials.
- [R-SEC-04] Guarantee absolute integrity of environment variables (`.env`) without deleting existing keys.
- [R-SEC-05] Never cap read-only Better-Auth GET /get-session with a low global rateLimit.max; enforce strict customRules on mutating auth endpoints (/sign-in/*, /sign-up/*, password reset) and avoid console.error on expected 4xx client auth responses.
