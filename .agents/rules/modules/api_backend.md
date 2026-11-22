# Module: API & Backend

> Anti-Bloat Rule: This module must NEVER exceed **80 lines**.

- [R-API-01] Consistently return predictable structures matching `{ success: true, data } | { success: false, error }`.
- [R-API-02] Protect sensitive endpoints and submission forms with rate-limiting.
- [R-API-03] Process heavy tasks asynchronously via workers or message queues with signature verification.
- [R-API-04] Make asynchronous jobs strictly idempotent to support automatic retries without side effects.
- [R-API-05] Server-Side S3 Proxy & Safe Soft-Archive: Prefer authenticated server-side upload (`POST /api/upload` via `PutObjectCommand`) and admin document streaming (`GetObjectCommand` with inline/attachment headers) over direct browser `PUT` to avoid CORS `Failed to fetch` failures; check dependent `onDelete: Restrict` counts before deleting catalog entities and soft-archive (`isActive: false`) when historical bookings exist instead of crashing on `P2003`.
