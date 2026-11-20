# Rapport d'Audit de Securite & Tests Defensifs (HomeServices SaaS - Sprint 09)

> **Statut global : DURCI & VERIFIE**
> Date de l'audit : 2026-11-19
> Perimetre : Application Next.js 16, Authentification Better-Auth, Server Actions, API Routes / Webhooks, Supabase PostgreSQL (RLS & Grants), Tigris S3, Paystack, Upstash QStash/Redis et Dependances npm.

---

## 1. Resume Executif

Un audit complet de securite applicative (SAST manuel du code backend, analyse SCA des dependances via `pnpm audit`, inspection de la configuration RLS Supabase PostgREST et controles defensifs sur build de production live) a permis d'identifier et de corriger **13 points de durcissement** :
- **3 Critiques** (`SEC-01` Escalation de role Better-Auth, `SEC-02` Contournement montant/role Paystack & activation anticipee sur `invoice.create`, `SEC-03` Exposition PostgREST Supabase sur `pro_profiles` et tables privees)
- **5 Elevees** (`SEC-04` Path Traversal / Spoofing URL S3 Tigris, `SEC-05` Verification JWT `alg`/body sur Upstash QStash, `SEC-06` Machine a etats & integrite des reservations, `SEC-07` Injection HTML dans les templates email Resend, `SEC-08` CVE runtime `effect <= 3.22.0`)
- **3 Moyennes** (`SEC-09` En-tete CSP & retrait `X-Powered-By`, `SEC-10` Validation Zod des identifiants Admin/Catalogue/Disponibilites, `SEC-11` Sanitisation des messages d'erreur serveur)
- **2 Faibles** (`SEC-12` Durcissement anti Open-Redirect avec caracteres de controle, `SEC-13` Nettoyage de fichier mort `route.ts.disabled` et alignement `isModerated` du seed)

Tous les correctifs ont ete compiles (`tsc --noEmit`, `eslint`, `next build`), deployes sur Supabase (`prisma migrate deploy`) et valides en conditions reelles contre le serveur de production et l'API PostgREST live.

---

## 2. Registre des Vulnerabilites & Remediations

| ID | Severite | CWE / OWASP | Composants affectes | Constat initial | Remediation appliquee | Statut |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SEC-01` | CRITIQUE | CWE-269 / A01 | `src/lib/auth.ts` | `userType` (`input: true`) n'etait sanitise qu'a la creation (`create.before`), permettant a un client connecte de tenter une escalation via `POST /api/auth/update-user`. | Ajout de `databaseHooks.user.update.before` levant `APIError("FORBIDDEN")` sur `userType` et `emailVerified` (`/update-user`) et rejetant les URL d'avatar non `https://` ou `/`. | CORRIGE & VERIFIE |
| `SEC-02` | CRITIQUE | CWE-840 / A04 | `src/lib/paystack.ts`, `src/lib/validations/subscription.ts`, `src/server/actions/subscription.ts`, `src/app/api/webhooks/paystack/route.ts` | Validation insuffisante du role vs plan Pro/Client, du montant paye vs tarif du plan, activation possible sur `invoice.create`, confiance aveugle dans `expectedPlan` et absence de verification d'origine sur `callbackUrl`. | Verification role/formule, validation `amount >= planDef.amountFCFA`, controle devise `XOF`/`XAF`, non-activation sur `invoice.create`, validation schema Zod webhook, blocage simulation sous `VERCEL=1` et sanitisation stricte `callbackUrl`. | CORRIGE & VERIFIE |
| `SEC-03` | CRITIQUE | CWE-200 / A01 | `prisma/migrations/20261119233000_harden_rls_column_grants/migration.sql` | Les politiques RLS historiques autorisaient `SELECT` `anon` sur l'ensemble des colonnes de `pro_profiles` (`kycDocumentUrl`, `phoneNumber`, `whatsappNumber`, `address`, `userId`) et `reviews` via PostgREST. | Migration SQL revoquant tous les droits `anon`/`authenticated` sur les tables privees (`users`, `sessions`, `accounts`, `verifications`, `bookings`, `subscriptions`, `unavailability_periods`, `reviews`) et limitant `pro_profiles` a un `GRANT SELECT` colonne par colonne sur les seuls champs catalogue publics. | CORRIGE & VERIFIE |
| `SEC-04` | ELEVEE | CWE-22 / A01 | `src/lib/storage.ts`, `src/server/actions/pro-catalog.ts` | Construction possible de cles contenant `..`, confiance dans `publicUrl` soumis par le client lors de la confirmation upload, et absence de contrainte regex stricte sur `objectKey`. | Ajout de `isValidStorageObjectKey`, `isValidOwnedObjectKey`, `buildTigrisPublicUrl` (URL canonique reconstruite cote serveur) et `ContentLength` sur `PutObjectCommand`. | CORRIGE |
| `SEC-05` | ELEVEE | CWE-347 / A02 | `src/lib/qstash.ts`, `src/app/api/queues/follow-up/route.ts` | Le verificateur JWT QStash ne controlait pas explicitement `header.alg === "HS256"`, tolerait l'absence de `claims.exp` ou `claims.body`, et la route API n'utilisait pas de schema Zod strict sur le payload. | Exigence stricte `header.alg === "HS256"`, `exp` et `nbf`, hash SHA-256 obligatoire de `rawBody` en `timingSafeEqual`, schema Zod `discriminatedUnion` et controle `isValidStorageObjectKey` sur `STORAGE_CLEANUP`. | CORRIGE & VERIFIE |
| `SEC-06` | ELEVEE | CWE-841 / A04 | `src/lib/validations/booking.ts`, `src/server/actions/booking.ts`, `src/server/actions/booking-status.ts` | Reservations possibles sur dates passees, auto-reservation d'un pro sur sa propre offre, absence de blocage transactionnel sur `UnavailabilityPeriod` et transitions de statuts non restreintes. | Rejet des dates passees, anti auto-reservation, verification transactionnelle `UnavailabilityPeriod`, machine a etats stricte (`NEGOTIATING -> IN_PROGRESS/CANCELLED -> COMPLETED`), increment atomique `completedTasks` et rate limiting sur `validateOfferAction`/`answerTaskFollowUpAction`. | CORRIGE |
| `SEC-07` | ELEVEE | CWE-79 / A03 | `src/emails/reset-password-email.tsx`, `src/emails/task-follow-up-email.tsx` | Interpolation directe des variables utilisateur et URL dans le HTML brut des emails Resend. | Ajout et application systematique de `escapeHtml()` et `sanitizeHttpUrl()` + `encodeURIComponent()` sur tous les parametres rendus. | CORRIGE |
| `SEC-08` | ELEVEE | GHSA-7589-6fvf-x4pw | `pnpm-workspace.yaml`, `pnpm-lock.yaml` | Dependance transitive runtime `effect@3.20.0` exposee a une vulnerabilite ReDoS (`<= 3.22.0`). | Ajout d'un override `effect: '^3.22.1'` dans `pnpm-workspace.yaml` et regeneration du lockfile (`pnpm audit --prod` = **0 vulnerabilite**). | CORRIGE & VERIFIE |
| `SEC-09` | MOYENNE | CWE-693 / A05 | `next.config.ts` | Absence d'en-tete `Content-Security-Policy` explicite et exposition de l'en-tete `X-Powered-By: Next.js`. | Ajout d'une politique `Content-Security-Policy` stricte (`frame-ancestors 'none'`, `object-src 'none'`, origines Tigris/Supabase/Paystack autorisees) et `poweredByHeader: false`. | CORRIGE & VERIFIE |
| `SEC-10` | MOYENNE | CWE-20 / A03 | `src/server/actions/admin.ts`, `src/server/actions/availability.ts`, `src/server/actions/pro-catalog.ts` | Plusieurs parametres (`proProfileId`, `reviewId`, `periodId`, `serviceId`, `languages`, `name`, `decision`) n'etaient pas valides par Zod en entree d'action. | Validation Zod systematique sur les identifiants, enums de decision et tableaux de langues/noms avant acces Prisma. | CORRIGE |
| `SEC-11` | MOYENNE | CWE-209 / A05 | `src/server/actions/*.ts`, `src/app/api/webhooks/paystack/route.ts`, `src/app/api/queues/follow-up/route.ts` | Des blocs `catch` renvoyaient directement `err.message` vers le navigateur ou appelant webhook. | Journalisation serveur via `console.error` et retour de messages generiques en francais sans fuite d'informations internes. | CORRIGE |
| `SEC-12` | FAIBLE | CWE-601 / A01 | `src/app/login/page.tsx`, `src/components/auth/social-auth-buttons.tsx` | Verification de `callbackUrl` ameliorable contre les caracteres de controle ASCII et normalisation OAuth. | Filtrage des caracteres `[\u0000-\u001f\u007f]`, `//` et `\` dans `sanitizeCallbackUrl` et `sanitizeOAuthCallbackUrl`. | CORRIGE & VERIFIE |
| `SEC-13` | FAIBLE | CWE-1059 | `src/app/api/auth/[...all]/route.ts.disabled`, `prisma/seed-data.ts`, `prisma/seed.ts` | Fichier desactive residuel dans l'arborescence API Auth et incoherence `isModerated: false` sur les avis seedes non signalement. | Suppression de `route.ts.disabled` et alignement `isModerated: true` pour les 14 avis valides seedes (les 2 avis signales restant a modérer). | CORRIGE & VERIFIE |

---

## 3. Audit des Dependances (`pnpm audit`)

- **Dependances de production (`pnpm audit --prod --audit-level=low`) :** **0 vulnerabilite** (`No known vulnerabilities found`), apres application de `effect: '^3.22.1'` dans [pnpm-workspace.yaml](file:///c:/Users/hanok/Dev/Personal-Project/home-services/pnpm-workspace.yaml).
- **Dependances de developpement uniquement (`devDependencies`) :** Les alertes restantes remontees par `pnpm audit --audit-level=low` concernent exclusivement des outils CLI/lint hors runtime de production (`zod@3.25.76` embarque par `@modelcontextprotocol/sdk` sous `shadcn`, et `minimatch` sous `eslint-config-next`). Le runtime applicatif utilise `zod@4.6.7`.

---

## 4. Matrice des Controles Live & Tests Defensifs

Tous les controles suivants ont ete executes sur le build de production (`next start -p 3099`) et sur la base Supabase PostgreSQL / PostgREST live apres deploiement des migrations :

| Controle | Cible | Resultat observe | Verdict |
| :--- | :--- | :--- | :--- |
| `CTRL-1` | En-tetes HTTP `GET /` | `CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` presents ; `X-Powered-By` absent | PASS |
| `CTRL-2` | Acces anonyme `/dashboard/{admin,pro,client}` | Redirection HTTP `307` vers `/login` sans fuite de contenu | PASS |
| `CTRL-3` | Requete CSRF `POST /api/auth/sign-in/email` (`Origin: https://evil.example`) | Rejet HTTP `403 INVALID_ORIGIN` | PASS |
| `CTRL-4` | Webhooks Paystack & QStash non signes / signature falsifiee / JWT `alg: none` | Rejet HTTP `401` sur l'ensemble des vecteurs | PASS |
| `CTRL-5` | Escalation de privilege (`client` -> `POST /api/auth/update-user` `{userType:"admin"}` + avatar `javascript:` + acces `/dashboard/admin` & `/pro`) | `HTTP 403` sur role, `HTTP 400` sur avatar, session conserve `userType="client"`, redirections `307` vers `/dashboard/client` | PASS |
| `CTRL-6` | Isolation horizontale/verticale `pro` -> `/dashboard/admin` | Redirection HTTP `307` vers `/dashboard/pro` | PASS |
| `CTRL-7` | Acces autorise `admin` -> `/dashboard/admin` | HTTP `200` | PASS |
| `CTRL-8` | Supabase PostgREST Anon RLS (`users`, `sessions`, `accounts`, `bookings`, `reviews` + colonnes restreintes `pro_profiles.kycDocumentUrl`, `phoneNumber` vs `availabilityStatus`) | Tables privees HTTP `401`/`403`, colonnes sensibles `pro_profiles` HTTP `401`/`403`, colonnes publiques catalogue HTTP `200` | PASS |
| `EVAL` | Juge deterministe `python evals/run_fullstack_eval.py` (mode FULL) | `typecheck`, `lint`, `rsi_memory_hygiene`, `security_audit`, `eval_unit_tests`, `prod_build` = `100/100 PASS` | PASS |

Une suite Playwright perenne est egalement disponible dans [security-guards.spec.ts](file:///c:/Users/hanok/Dev/Personal-Project/home-services/e2e/security-guards.spec.ts) pour re-executer ces verifications en CI/pre-release.
