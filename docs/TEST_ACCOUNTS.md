# Comptes de Test & Jeu de Donnees Fictives (HomeServices)

> **[ATTENTION - ENVIRONNEMENTS DEV / STAGING UNIQUEMENT]**
> Ce document recense exclusivement des profils fictifs injectes via `prisma/seed.ts`
> pour valider manuellement l'interface web, l'authentification Better-Auth et les parcours metier.
> Le script refuse par defaut toute execution lorsque `NODE_ENV=production`
> (sauf variable explicite `ALLOW_TEST_SEED=true`).

---

## Commandes d'Injection & Personnalisation

```bash
# Injection idempotente (26 utilisateurs, 20 profils Pro, 46 services FCFA, creneaux, reservations, avis)
pnpm run db:seed
```

Les mots de passe par defaut peuvent etre surcharges avant execution via variables d'environnement :
- `SEED_ADMIN_PASSWORD` (defaut : `AdminServ2026!`)
- `SEED_CLIENT_PASSWORD` (defaut : `ClientServ2026!`)
- `SEED_PRO_PASSWORD` (defaut : `ProServ2026!`)

| Role | Mot de passe par defaut | Route de connexion | Espace apres connexion |
| :--- | :--- | :--- | :--- |
| Administrateur (1) | `AdminServ2026!` | `/login` | `/dashboard/admin` |
| Clients (5) | `ClientServ2026!` | `/login` | `/dashboard/client` |
| Professionnels (20) | `ProServ2026!` | `/login` | `/dashboard/pro` |

---

## 1. Compte Administrateur (1)

| # | Nom | Email | Mot de passe | Telephone | Perimetre |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | Direction HomeServices | `admin@homeservices.ci` | `AdminServ2026!` | `+225 07 00 00 00 01` | Validation KYC, moderation avis, KPIs MRR Paystack, CRUD Categories/Villes |

---

## 2. Comptes Clients Fictifs (5)

| # | Nom | Email | Mot de passe | Telephone | Formule Paystack | Cas d'usage & donnees associees |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Jean-Marc Kouadio | `client@homeservices.ci` | `ClientServ2026!` | `+225 05 06 07 08 09` | `CLIENT_GOLD` (`ACTIVE`, 2 000 XOF) | Client Or historique : 4 reservations `COMPLETED`, 1 `IN_PROGRESS`, 1 `NEGOTIATING`, avis donnes & recu signale |
| 2 | Fatou Bamba | `fatou.bamba@test.homeservices.ci` | `ClientServ2026!` | `+225 07 45 21 30 12` | `CLIENT_GOLD` (`ACTIVE`, 2 000 XOF) | Client Or actif : 1 mission `COMPLETED` recente **sans avis client** (`seed-booking-12`) + `IN_PROGRESS` + `NEGOTIATING` |
| 3 | Yves N'Zi | `yves.nzi@test.homeservices.ci` | `ClientServ2026!` | `+225 01 41 88 22 04` | Standard (aucune) | Client gratuit : 3 `COMPLETED`, 1 `IN_PROGRESS`, 1 `NEGOTIATING`. Ideal pour tester l'upgrade Client Or |
| 4 | Aminata Touré | `aminata.toure@test.homeservices.ci` | `ClientServ2026!` | `+225 07 89 14 56 33` | `CLIENT_GOLD` (`PAST_DUE`, 2 000 XOF) | Abonnement en impaye (`PAST_DUE`) : 2 `COMPLETED`, 1 `IN_PROGRESS`, 1 `CANCELLED` |
| 5 | Cédric Brou | `cedric.brou@test.homeservices.ci` | `ClientServ2026!` | `+225 05 72 19 44 80` | Standard (aucune) | Nouveau compte vierge (0 reservation) pour tester le premier parcours complet |

---

## 3. Comptes Professionnels Fictifs (20 — 2 par categorie metier)

Tous les comptes professionnels utilisent le mot de passe `ProServ2026!` (sauf surcharge `SEED_PRO_PASSWORD`) et disposent de creneaux hebdomadaires du lundi au samedi (`08:00-10:00`, `10:00-12:00`, `14:00-16:00`, `16:00-18:00`).

| # | Nom | Email | Categorie principale | Zone GEO | Disponibilite | Statut KYC | Abonnement Paystack | Nb Services |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | Amadou Kouassi | `amadou.kouassi@homeservices.ci` | Plomberie (+ Clim) | Abidjan - Cocody | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_ENTERPRISE` (`ACTIVE`) | 3 |
| 2 | Moussa Diop | `moussa.diop@homeservices.ci` | Électricité | Dakar - Almadies | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_ENTERPRISE` (`ACTIVE`) | 2 |
| 3 | Ibrahim Koné | `ibrahim.kone@test.homeservices.ci` | Plomberie | Abidjan - Yopougon | `BUSY_TODAY` | `APPROVED` (Verifie) | `PRO_PREMIUM` (`ACTIVE`) | 2 |
| 4 | Serge Aka | `serge.aka@test.homeservices.ci` | Électricité | Abidjan - Marcory | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_PREMIUM` (`ACTIVE`) | 2 |
| 5 | Drissa Ouattara | `drissa.ouattara@test.homeservices.ci` | Climatisation & Froid | Abidjan - Riviera | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_ENTERPRISE` (`ACTIVE`) | 3 |
| 6 | Fabrice Yao | `fabrice.yao@test.homeservices.ci` | Climatisation & Froid | Abidjan - Plateau | `AVAILABLE` | `PENDING` | `PRO_STANDARD` (`TRIALING`) | 2 |
| 7 | Nadia Koffi | `nadia.koffi@test.homeservices.ci` | Ménage & Entretien | Abidjan - Cocody | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_PREMIUM` (`ACTIVE`) | 3 |
| 8 | Mariam Diallo | `mariam.diallo@test.homeservices.ci` | Ménage & Entretien | Abidjan - Marcory | `BUSY_TODAY` | `APPROVED` (Verifie) | `PRO_STANDARD` (`ACTIVE`) | 2 |
| 9 | Pascal Gnagne | `pascal.gnagne@test.homeservices.ci` | Peinture & Décoration | Abidjan - Riviera | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_PREMIUM` (`ACTIVE`) | 2 |
| 10 | Christian Ahou | `christian.ahou@test.homeservices.ci` | Peinture & Décoration | Yamoussoukro | `OFFLINE` | `PENDING` | `PRO_STANDARD` (`TRIALING`) | 2 |
| 11 | Souleymane Traoré | `souleymane.traore@test.homeservices.ci` | Déménagement & Manutention | Abidjan - Treichville | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_ENTERPRISE` (`ACTIVE`) | 3 |
| 12 | Éric Blé | `eric.ble@test.homeservices.ci` | Déménagement & Manutention | Abidjan - Koumassi | `AVAILABLE` | `REJECTED` | `PRO_STANDARD` (`PAST_DUE`) | 2 |
| 13 | Karim Sanogo | `karim.sanogo@test.homeservices.ci` | Serrurerie & Sécurité | Abidjan - Plateau | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_PREMIUM` (`ACTIVE`) | 3 |
| 14 | Alain Doh | `alain.doh@test.homeservices.ci` | Serrurerie & Sécurité | Abidjan - Port-Bouët | `BUSY_TODAY` | `PENDING` | `PRO_PREMIUM` (`TRIALING`) | 2 |
| 15 | Jean-Luc Assoumou | `jeanluc.assoumou@test.homeservices.ci` | Menuiserie & Ébénisterie | Abidjan - Bingerville | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_PREMIUM` (`ACTIVE`) | 3 |
| 16 | Franck Kacou | `franck.kacou@test.homeservices.ci` | Menuiserie & Ébénisterie | Grand-Bassam | `AVAILABLE` | `NOT_SUBMITTED` | Aucun | 2 |
| 17 | Aboubacar Cissé | `aboubacar.cisse@test.homeservices.ci` | Maçonnerie & Carrelage | Abidjan - Abobo | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_STANDARD` (`ACTIVE`) | 2 |
| 18 | Wilfried Zadi | `wilfried.zadi@test.homeservices.ci` | Maçonnerie & Carrelage | Bouaké | `OFFLINE` | `PENDING` | `PRO_STANDARD` (`PAST_DUE`) | 2 |
| 19 | Claire Adjoua | `claire.adjoua@test.homeservices.ci` | Jardinage & Espaces Verts | Abidjan - Cocody | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_PREMIUM` (`ACTIVE`) | 2 |
| 20 | Paul Mbarga | `paul.mbarga@test.homeservices.ci` | Jardinage & Espaces Verts | Douala - Bonanjo / Akwa | `AVAILABLE` | `APPROVED` (Verifie) | `PRO_STANDARD` (`ACTIVE`) | 2 |

---

## 4. Scenarios de Test End-to-End Recommandes

### Parcours 1 — Catalogue Public & Reservation de Creneau (Client)
1. Sans connexion ou avec `cedric.brou@test.homeservices.ci` / `ClientServ2026!`, explorer `/services` et `/professionals`.
2. Filtrer par ville (`Abidjan - Cocody`, `Dakar - Almadies`, `Yamoussoukro`) et par metier : verifier que les Pros `PRO_ENTERPRISE` (`Amadou Kouassi`, `Moussa Diop`, `Drissa Ouattara`, `Souleymane Traoré`) apparaissent prioritairement.
3. Reserver un creneau sur la fiche d'un pro disponible (`Amadou Kouassi` ou `Nadia Koffi`) et verifier le blocage anti-double-reservation sur la date choisie.

### Parcours 2 — Dashboard Client & Avis Mutuels
1. Se connecter avec `fatou.bamba@test.homeservices.ci` / `ClientServ2026!`.
2. Aller dans `/dashboard/client/bookings` : deposer un avis sur la prestation `COMPLETED` de `Jean-Luc Assoumou` (`seed-booking-12`) et verifier le recalcul de la note du prestataire.
3. Se connecter avec `aminata.toure@test.homeservices.ci` ou `yves.nzi@test.homeservices.ci` pour tester le parcours d'abonnement `CLIENT_GOLD` dans `/dashboard/client/settings`.

### Parcours 3 — Dashboard Prestataire (Disponibilite, KYC & Planning)
1. Se connecter avec `amadou.kouassi@homeservices.ci` / `ProServ2026!`.
2. Dans `/dashboard/pro/schedule`, passer une demande `NEGOTIATING` en `IN_PROGRESS`, ou marquer une intervention `IN_PROGRESS` comme `COMPLETED` puis noter le client.
3. Dans `/dashboard/pro/availability`, ajouter une periode d'indisponibilite ou basculer `availabilityStatus` (`AVAILABLE` -> `BUSY_TODAY`) et verifier la propagation temps reel.
4. Se connecter avec `franck.kacou@test.homeservices.ci` / `ProServ2026!` pour tester un compte sans abonnement (`NOT_SUBMITTED`), l'upload KYC et la souscription Paystack.

### Parcours 4 — Administration Plateforme (KYC, Moderation, Revenus)
1. Se connecter avec `admin@homeservices.ci` / `AdminServ2026!`.
2. Dans `/dashboard/admin`, consulter la file **Validation KYC** : 4 profils `PENDING` (`Fabrice Yao`, `Christian Ahou`, `Alain Doh`, `Wilfried Zadi`), 1 `REJECTED` (`Éric Blé`) et 1 `NOT_SUBMITTED` (`Franck Kacou`).
3. Dans l'onglet **Moderation Avis**, traiter les 2 avis signales (`seed-review-10` note 2/5 sur `Ibrahim Koné`, et `seed-review-16` sur `Jean-Marc Kouadio`) et verifier le recalcul automatique de la moyenne d'`Ibrahim Koné` lorsqu'un avis est masque.
4. Verifier les KPIs d'abonnements MRR en FCFA (22 abonnements reparts sur `ACTIVE`, `TRIALING`, `PAST_DUE`).
