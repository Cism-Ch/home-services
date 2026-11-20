# Rapport d'Audit UI, Responsivite, Alignement & Regles Agents (Sprint 11)

- **Date :** 2026-11-20
- **Perimetre audite :** `124` fichiers `.tsx` sous `src/` (pages publiques, authentification, pages legales/erreur, dashboards Client / Pro / Admin, primitives UI et layout global), suite E2E `e2e/responsive-layout.spec.ts` et memoire procedurale `.agents/rules/modules/ui_frontend.md`.
- **Commit preparatoire associe :** `c9bd08b` (`TASK-UI-SCROLL-01` — ajout de `data-scroll-behavior="smooth"` sur `<html>` dans `src/app/layout.tsx`).
- **Statut Sprint 11 :** Conforme et pret pour mise en production (non committe a ce stade, en attente de validation utilisateur).

---

## 1. Synthese des Anomalies Structurelles Corrigees

### 1.1 Conteneurs Full-Width, Alignement & En-tete (`TASK-LAYOUT-CONTAINER-01`)
1. **Standardisation des conteneurs principaux :** Uniformisation sur `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` pour `SiteHeader`, `SiteFooter`, `DashboardLayout`, la page d'accueil (`src/app/page.tsx`, `HeroSection`, `QuickSearch`, `FeaturedServices`), le catalogue (`src/app/services/*`), les profils artisans (`src/app/professionals/*`), `AboutPage` et les pages d'erreur (`error.tsx`, `not-found.tsx`). Conteneurs adaptes `max-w-6xl` sur le tunnel de reservation (`/book/[proId]/[serviceId]`) et `max-w-4xl` sur `/legal/*`.
2. **Pages d'authentification (`login`, `register`, `forgot-password`, `reset-password`) :** Suppression des wrappers asymetriques / `container` nu sans centrage ni marge laterale au profit d'un centrage flex canonique (`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center`) contenant un bloc `w-full max-w-[400px]` (`440px` pour `register`).
3. **Hero & Sections Full-Width :** Suppression de `fade-bottom` et `pb-0` dans `src/components/marketing/hero-section.tsx` qui rognaient `HowItWorks`, deplacement du degrade `Key Metrics` dans `src/app/about/page.tsx` vers la `<section className="w-full ...">` externe, et remplacement de `relative -top-12` par `-mt-12 md:-mt-16` dans `src/components/pro-header.tsx` pour supprimer le vide vertical fantome.
4. **Menu Mobile & Theme :** Ajout du padding horizontal/vertical (`px-6 py-6 overflow-y-auto`) dans le `SheetContent` de `SiteHeader`, ajout de `pointer-events-none` et contraintes de largeur sur les halos decoratifs du footer, et traduction francaise de `ModeToggle` (`Changer le thème`, `Clair`, `Sombre`, `Système`, `Luxe`).

### 1.2 Rythme `Card` shadcn/ui v4 & Grilles Iso-Hauteur (`TASK-LAYOUT-CARDS-01`)
1. **`<Card><form>` sans espacement vertical :** Ajout de `className="flex flex-col gap-6"` sur les `<form>` enfants directs de `<Card>` (7 composants : `password-security-card.tsx`, `client-settings-view.tsx`, `pro-settings-view.tsx`, `login`, `register`, `forgot-password`, `reset-password`).
2. **Suppression des barres blanches et doubles paddings :** Normalisation `py-0 gap-0` / `pb-0` sur les cartes a en-tete image ou split (`service-listing-card.tsx`, `pro-services-view.tsx`, `pro-services-list.tsx`, `client-bookings-view.tsx`, `client/page.tsx`, `pro/page.tsx`, `client-follow-up-card.tsx`, `pro-live-status-banner.tsx`, `responsive-table.tsx`), et suppression des doubles paddings dans `how-it-works.tsx`, `booking-summary.tsx`, `about/page.tsx` et `availability-client.tsx`.
3. **Grilles iso-hauteur & typographie :** Application de `h-full` + `mt-auto` / `flex-1` (`how-it-works.tsx`, `featured-services.tsx`, `pro-card.tsx`, `service-card.tsx`), retrait de la classe inexistante `xs:grid-cols-2` dans `src/app/page.tsx`, et uniformisation des `<h1>` de dashboards en `text-2xl sm:text-3xl`.

### 1.3 Overlays, Calendrier, Actions & Tableaux Mobiles (`TASK-LAYOUT-OVERLAYS-01`)
1. **Agenda Pro (`pro-schedule-view.tsx`) & `DateTimePicker` (`date-time-picker.tsx`) :** Grille `xl:grid-cols-[310px_minmax(0,1fr)]`, `overflow-x-auto` autour du `Calendar`, creneaux `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` avec boutons multi-lignes (`h-auto min-h-10 py-2 whitespace-normal`).
2. **Boutons de contact (`pro-contact-actions.tsx`) & Sidebar Dashboard (`dashboard-sidebar.tsx`) :** Passage en `min-w-0 w-full sm:w-auto sm:flex-1 sm:min-w-[160px]`, correction marge mobile et `pb-6 overflow-y-auto` sur le drawer mobile du dashboard.
3. **Modales responsives :** Padding adaptatif `p-4 sm:p-6` dans `src/components/ui/dialog.tsx` et bornes `sm:max-w-* max-h-[90vh] overflow-y-auto` sur les modales (`client-bookings-view.tsx`, `pro-schedule-view.tsx`, `booking-ticket.tsx`, `client-follow-up-card.tsx`, `create-service-dialog.tsx`).

---

## 2. Defauts Reels Interceptes & Corriges en Execution Live Playwright

L'execution de `e2e/responsive-layout.spec.ts` contre le build de production (`next start -p 3099`) a detecte trois regressions reelles invisibles a l'analyse statique :

1. **Debordement mobile sur `/login` (`scrollWidth=565 > 375`) et `/register` :**
   - *Cause :* `src/components/ui/separator.tsx` impose `shrink-0 data-[orientation=horizontal]:w-full`. Deux `<Separator />` nus en freres d'un label dans `flex items-center justify-center` forcaient une largeur horizontale cumulee de `200% + label`.
   - *Fix :* Adoption du pattern shadcn canonique `absolute inset-0 flex items-center` + `Separator className="w-full"` sous un label `relative bg-card px-2` (`src/app/login/page.tsx`, `src/app/register/page.tsx`).
2. **Debordement desktop sur `/dashboard/pro/profile` (`scrollWidth=1672 > 1440`) :**
   - *Cause :* Dans `src/components/file-upload-button.tsx`, `<Input type="file" className="sr-only" />` heritait de `w-full` depuis `src/components/ui/input.tsx`, creant un element `position: absolute` large de `928px` dont l'extension atteignait `right=1672`.
   - *Fix :* Remplacement de `sr-only` par `hidden` (`display: none`) dans `src/components/file-upload-button.tsx`, complete par `min-w-0` sur les colonnes de grille dans `src/app/dashboard/pro/profile/pro-profile-view.tsx`.
3. **Debordement mobile sur `/dashboard/admin` (`scrollWidth=399 > 375`) :**
   - *Cause :* Le rendu carte mobile de `src/components/data-display/responsive-table.tsx` utilisait `grid gap-3 md:hidden` sans `grid-cols-1 min-w-0`, laissant CSS Grid calculer une piste `minmax(auto, 1fr)` elargie par `p.truncate` (`white-space: nowrap`) dans `admin-dashboard-view.tsx`.
   - *Fix :* Application de `grid-cols-1 min-w-0`, `Card` avec `min-w-0 overflow-hidden`, `[overflow-wrap:anywhere]` dans `responsive-table.tsx`, et remplacement de `truncate` par `line-clamp-2 break-words` dans `admin-dashboard-view.tsx`.

---

## 3. Mesures Geometriques Verifiees en Chrome Headless (`4 passed`)

Commande executee sur build de production (`pnpm build` + `next start -p 3099`, `--workers=1`, `PLAYWRIGHT_CHANNEL=chrome`) aux viewports `375x812` (mobile), `768x1024` (tablette) et `1440x900` (desktop) :

| Test | Perimetre & Assertions | Resultats observes |
| :--- | :--- | :--- |
| **Test 1 (`[GEO-T1]`)** | `10` routes publiques/auth (`/`, `/services`, `/professionals`, fiche pro, tunnel reservation, `/about`, `/login`, `/register`, `/forgot-password`, `/legal/cgu`) x `3` viewports | `30/30` verifications HTTP `200`, `0` debordement horizontal (`scrollWidth <= innerWidth + 1`) |
| **Test 2 (`[GEO-T2]`)** | Alignement bord gauche/droite `Header`/`Footer` (`1440px`) + hauteur uniforme de la grille 6 categories (mode `reducedMotion: "reduce"`) | `headerLeft=80`, `footerLeft=80` (`0px` ecart), `headerRight=1360`, `footerRight=1360` (`0px` ecart), `categoryCount=6`, `categoryDelta=0` |
| **Test 3 (`[GEO-T3]`)** | Marges symetriques de la carte Auth `/login` & padding interne du drawer `Menu` en mobile (`375px`) | `cardLeft=16`, `cardRightMargin=16`, `drawerLinkX=23.18`, `drawerRight=318.75` |
| **Test 4 (`[GEO-T4]`)** | `10` routes authentifiees (`3` Client, `6` Pro, `1` Admin) x `3` viewports + confinement du `Calendar` sur `/dashboard/pro/schedule` | `30/30` verifications sans overflow ; `Calendar` contenu : mobile `312.5 <= 359`, tablette `653 <= 744`, desktop `680 <= 710` |

---

## 4. Regles Agents Capitalisees (`.agents/rules/modules/ui_frontend.md`)

Treize regles strictes (`[R-UI-01]` a `[R-UI-13]`, `17` lignes < plafond `80`, ASCII pur) ont ete enregistrees pour eviter toute regression future :
1. **`[R-UI-01]` Mobile-First :** Classes de base `< 640px`, breakpoints standards Tailwind v4 uniquement (jamais `xs:`).
2. **`[R-UI-02]` Conteneurs Full-Width :** Section externe `w-full` pour les fonds/degrades/blurs, contenu interne `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`, centrage auth en flex.
3. **`[R-UI-03]` Rythme `Card` v4 :** `flex flex-col gap-6` sur `<Card><form>`, `py-0 gap-0` / `overflow-hidden` sur cartes image/split, aucun double padding.
4. **`[R-UI-04]` Modales & Drawers :** `sm:max-w-* max-h-[90vh] overflow-y-auto` sur `DialogContent`, padding et scroll sur `SheetContent`.
5. **`[R-UI-05]` Tailles Intrinseques & Debordement :** `w-full sm:w-auto sm:min-w-[...]`, `grid-cols-1 min-w-0` sur grilles mobiles empilees, `min-w-0 [overflow-wrap:anywhere]` sur enfants flex, `hidden` (jamais `sr-only` sur `Input` `w-full`), sidebar calendrier `>= 300px` avec `overflow-x-auto`.
6. **`[R-UI-06]` Grilles Iso-Hauteur :** `flex flex-col h-full`, `CardContent flex-1`, `CardFooter mt-auto`.
7. **`[R-UI-07]` Chevauchements Sans Vide :** Marges negatives (`-mt-12 md:-mt-16`) au lieu de `relative -top-*`.
8. **`[R-UI-08]` 100 % shadcn/ui :** Zero `<button>`/`<input>` HTML bruts hors `ui/` et emails, `cn` depuis `@/lib/utils`, `aria-label` systematiques, actions visibles sur tactile (`opacity-100 sm:opacity-0 sm:group-hover:opacity-100`).
9. **`[R-UI-09]` Parite Multi-Themes :** `@custom-variant dark` liant `.dark` et `.luxury`.
10. **`[R-UI-10]` Smooth Scroll Next.js :** `data-scroll-behavior="smooth"` sur `<html>` avec garde `@media (prefers-reduced-motion: reduce)`.
11. **`[R-UI-11]` Etats Visuels & Cibles Tactiles :** Chargement (`Skeleton`), erreur (`Alert`), vide, et cibles tactiles `>= 44px`.
12. **`[R-UI-12]` Controle Geometrique Multi-Viewports :** Verification Playwright live obligatoire (`375px`, `768px`, `1440px`) avant cloture.
13. **`[R-UI-13]` Contention `Separator` en Flex :** Jamais de `<Separator />` nu dans une ligne `flex` sans `flex-1` ou wrapper `absolute inset-0`.
