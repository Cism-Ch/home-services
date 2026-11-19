# HomeServices SaaS - Guide de Mise en Production (Go-Live Runbook)

Document de reference pour le deploiement en production de la plateforme HomeServices (Cote d'Ivoire / UEMOA, XOF / FCFA, zero commission sur les prestations).

---

## 1. Variables d'Environnement Obligatoires

Verifier chaque variable via `src/env.ts` avant le deploiement :

| Domaine | Variable(s) | Remarques |
| :--- | :--- | :--- |
| **Application** | `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` | `BETTER_AUTH_SECRET` >= 32 caracteres aleatoires. `NEXT_PUBLIC_APP_URL` en HTTPS. |
| **Base Supabase** | `DATABASE_URL`, `DIRECT_URL` | Utiliser le pooler IPv4 Supavisor (`:6543` pgbouncer pour runtime, `:5432` direct pour `prisma migrate deploy`). |
| **Supabase Realtime** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SERVICE_ROLE_KEY` strictement cote serveur (broadcast prive `user-bookings:*`). |
| **Upstash Redis** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Cache catalogue (`catalog:*`) et rate limiting glissant. |
| **Upstash QStash** | `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` | Signatures verifiees dans `/api/queues/follow-up`. |
| **Resend Email** | `RESEND_API_KEY`, `EMAIL_FROM` | Domaine DNS verifie (SPF, DKIM, DMARC) avant envoi en production. |
| **Tigris Data (S3)** | `TIGRIS_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION` | Configurer CORS sur le bucket Tigris pour autoriser `PUT` depuis `NEXT_PUBLIC_APP_URL`. |
| **Paystack (XOF)** | `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `PAYSTACK_PLAN_*` | Pointer le webhook Paystack vers `https://<domaine>/api/webhooks/paystack`. |

### Configuration CORS recommandee sur le bucket Tigris S3

```json
[
  {
    "AllowedOrigins": ["https://votre-domaine.ci"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 2. Sequence de Deploiement Base & Build

```bash
# 1. Installer les dependances figees et generer Prisma Client
pnpm install --frozen-lockfile

# 2. Appliquer toutes les migrations PostgreSQL (incluant RLS et publication Realtime)
pnpm exec prisma migrate deploy

# 3. Initialiser le referentiel GEO + categories (idempotent)
pnpm run db:seed

# 4. Compiler et auditer
pnpm exec prisma validate
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build

# 5. Valider le contrat complet RSI (score requis : 100/100 PASS)
python evals/run_fullstack_eval.py
```

---

## 3. Smoke Tests Post-Deploiement & E2E

```bash
# Lancer la suite Playwright contre le serveur de production demarre
pnpm exec playwright install chromium
pnpm run test:e2e
```

Points de controle manuels rapides apres mise en ligne :
1. `GET /robots.txt` et `GET /sitemap.xml` repondent `200`.
2. `GET /dashboard/admin` sans session redirige (`307`) vers `/login`.
3. `POST /api/webhooks/paystack` sans en-tete `x-paystack-signature` renvoie `401`.
4. `POST /api/queues/follow-up` sans signature QStash renvoie `401`.
5. Upload d'une photo portfolio sur `/dashboard/pro/profile` retourne HTTP `200` sur `PUT` Tigris et persiste dans Prisma.

---

## 4. Procedure de Rollback

1. Revenir au commit Git precedent stable et redeployer l'image/build Next.js.
2. Si une migration SQL doit etre annulee manuellement, ne jamais executer `prisma migrate reset` en production ; creer une migration corrective inverse ou restaurer un snapshot Point-In-Time (PITR) Supabase.
3. En cas de rotation de cles (`BETTER_AUTH_SECRET`, `PAYSTACK_SECRET_KEY`, `QSTASH_*`), deployer d'abord les nouvelles variables dans l'hebergeur puis redeployer l'application.
