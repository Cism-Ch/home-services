# Référentiel & Index des Composants UI/UX (`@/components`)

> Ce document constitue l'index de référence de tous les composants de l'application.
> **Règle d'or (AGENTS.md - Règle 6) :** Réutilisation stricte des composants shadcn/ui & Radix. Zéro réinvention de la roue (pas de modale `div` artisanale, pas de tooltip avec `title`, pas de drawer artisanal). Toujours utiliser en priorité les primitives documentées ci-dessous.

---

## 1. Primitives UI Shadcn / Radix (`@/components/ui/*`) — 36 Composants

| Composant | Fichier Source | Rôle & Usage |
| :--- | :--- | :--- |
| `AlertDialog` | `src/components/ui/alert-dialog.tsx` | Dialogue d'alerte modale bloquante (confirmation de suppression ou d'annulation). |
| `Avatar` | `src/components/ui/avatar.tsx` | Photo de profil avec fallback initiales (clients et prestataires). |
| `Badge` | `src/components/ui/badge.tsx` | Badges de statut (`En négociation`, `En traitement`, `Traitée`), devises et catégories. |
| `Breadcrumb` | `src/components/ui/breadcrumb.tsx` | Fil d'Ariane pour la navigation hiérarchique dans le catalogue. |
| `Button` | `src/components/ui/button.tsx` | Boutons d'action standards et variantes (`default`, `outline`, `secondary`, `ghost`, `link`). |
| `Calendar` | `src/components/ui/calendar.tsx` | Calendrier interactif pour le choix de dates de créneaux. |
| `Card` | `src/components/ui/card.tsx` | Conteneur avec `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. |
| `Checkbox` | `src/components/ui/checkbox.tsx` | Case à cocher accessible pour filtres et formulaires. |
| `Command` | `src/components/ui/command.tsx` | Palette de commande et recherche rapide (villes, métiers, prestataires). |
| `Dialog` | `src/components/ui/dialog.tsx` | Fenêtre modale contextuelle (réservation, détails, notation). |
| `Drawer` | `src/components/ui/drawer.tsx` | Tiroir tactile mobile swipe-down (conçu pour l'usage mobile majoritaire en Afrique). |
| `DropdownMenu` | `src/components/ui/dropdown-menu.tsx` | Menus d'actions déroulants contextuels. |
| `Form` | `src/components/ui/form.tsx` | Formulaires accessibles couplés avec `react-hook-form` et `zod`. |
| `Glow` | `src/components/ui/glow.tsx` | Effet décoratif de lueur diffuse pour les sections en avant. |
| `HeroSection` | `src/components/ui/hero-section.tsx` | Section Hero de la page d'accueil avec titre, sous-titre et conteneur de médias. |
| `Icons` | `src/components/ui/icons.tsx` | Dictionnaire d'icônes SVG communes (OAuth, marques). |
| `Input` | `src/components/ui/input.tsx` | Champ de saisie texte simple. |
| `Label` | `src/components/ui/label.tsx` | Étiquette accessible liée aux champs de formulaires. |
| `Mockup` | `src/components/ui/mockup.tsx` | Cadre mockup applicatif pour la présentation visuelle. |
| `Pagination` | `src/components/ui/pagination.tsx` | Pagination accessible pour les catalogues et tables de données. |
| `Popover` | `src/components/ui/popover.tsx` | Fenêtre flottante déclenchée par un clic pour filtres ou sélections rapides. |
| `Progress` | `src/components/ui/progress.tsx` | Barre de progression d'onboarding, de profil ou de quota d'offres. |
| `RadioGroup` | `src/components/ui/radio-group.tsx` | Sélection exclusive par boutons radio (ex: choix de forfait Paystack). |
| `ResponsiveTable` | `src/components/ui/responsive-table.tsx` | Composant hybride table complète sur desktop et cartes individuelles auto sur mobile. |
| `ScrollArea` | `src/components/ui/scroll-area.tsx` | Barre de défilement stylisée et accessible pour listes longues. |
| `Select` | `src/components/ui/select.tsx` | Sélecteur d'options déroulant accessible. |
| `Separator` | `src/components/ui/separator.tsx` | Séparateur horizontal ou vertical pour structurer les surfaces. |
| `Sheet` | `src/components/ui/sheet.tsx` | Panneau latéral tiroir (utilisé pour les menus latéraux). |
| `Skeleton` | `src/components/ui/skeleton.tsx` | Primitives de chargement textuel ou bloc standard. |
| `SkeletonPremium` | `src/components/ui/skeleton-premium.tsx` | Squelettes pré-composés haut de gamme : `card`, `avatar`, `profile`, `row` avec effet shimmer. |
| `Slider` | `src/components/ui/slider.tsx` | Curseur de sélection de plage numérique (fourchettes de tarifs en FCFA). |
| `Sonner` | `src/components/ui/sonner.tsx` | Système de notifications Toast via `toast()` (`richColors`, accessible). |
| `Switch` | `src/components/ui/switch.tsx` | Bascule d'activation booléenne (ex: switch disponibilité Pro). |
| `Tabs` | `src/components/ui/tabs.tsx` | Système d'onglets de navigation au sein d'une page. |
| `Textarea` | `src/components/ui/textarea.tsx` | Champ de texte multiligne pour descriptions et avis. |
| `Tooltip` | `src/components/ui/tooltip.tsx` | Infobulles d'aide et de détails (badges vérifiés, explications de statuts). |

---

## 2. Composants d'Authentification (`@/components/auth/*`)

| Composant | Fichier Source | Rôle |
| :--- | :--- | :--- |
| `LoadingButton` | `src/components/auth/loading-button.tsx` | Bouton avec état de chargement asynchrone intégré. |
| `PasswordStrength` | `src/components/auth/password-strength-indicator.tsx` | Jauge de complexité de mot de passe en temps réel. |
| `SocialAuthButtons` | `src/components/auth/social-auth-buttons.tsx` | Boutons de connexion sociale OAuth (Google, GitHub). |

---

## 3. Composants Tableau de Bord (`@/components/dashboard/*`)

| Composant | Fichier Source | Rôle |
| :--- | :--- | :--- |
| `DashboardSidebar` | `src/components/dashboard/dashboard-sidebar.tsx` | Navigation latérale unifiée adaptative (Desktop sticky + Mobile Sheet). |
| `CreateServiceDialog` | `src/components/dashboard/create-service-dialog.tsx` | Modale de publication d'une prestation avec tarif indicatif en FCFA. |
| `BillingInvoices` | `src/components/dashboard/billing-invoices.tsx` | Historique des factures d'abonnements Paystack. |
| `ProLiveStatusBanner` | `src/components/dashboard/pro-live-status-banner.tsx` | Commutateur de statut pro en direct (`Disponible`, `Occupé aujourd'hui - Offre en traitement`, `Hors ligne`) avec verrouillage automatique. |
| `ClientFollowUpCard` | `src/components/dashboard/client-follow-up-card.tsx` | Notification interactive client ("Vos tâches ont-elles été finalisées ? [Oui / En cours / Non]") libérant le pro et ouvrant l'avis. |

---

## 4. Composants Métier & Navigation (`@/components/*`)

| Composant | Fichier Source | Rôle & Évolution Métier |
| :--- | :--- | :--- |
| `SiteHeader` | `src/components/site-header.tsx` | En-tête principal, navigation globale, statut de session Better-Auth. |
| `MainNav` | `src/components/main-nav.tsx` | Liens de navigation du site vitrine. |
| `SiteFooter` | `src/components/site-footer.tsx` | Pied de page avec liens utiles et mentions légales. |
| `ModeToggle` | `src/components/mode-toggle.tsx` | Sélecteur de thème clair / sombre / système. |
| `QuickSearch` | `src/components/quick-search.tsx` | Barre de recherche rapide (métiers et villes africaines). |
| `FeaturedServices` | `src/components/featured-services.tsx` | Vitrine des prestations populaires avec tarifs en FCFA. |
| `HowItWorks` | `src/components/how-it-works.tsx` | Explication du cycle de mise en relation directe. |
| `ServiceCard` | `src/components/service-card.tsx` | Carte résumé d'un service dans le catalogue. |
| `ServiceListingCard` | `src/components/service-listing-card.tsx` | Carte détaillée d'un service avec avis et prestataire associé. |
| `ServiceFilter` | `src/components/service-filter.tsx` | Filtres de recherche par ville, catégorie et disponibilité. |
| `ProCard` | `src/components/pro-card.tsx` | Carte de présentation d'un artisan avec statut temps réel (`Disponible` / `Occupé`). |
| `ProHeader` | `src/components/pro-header.tsx` | Bannière de profil prestataire avec boutons d'action rapide (WhatsApp / Appel). |
| `ProServicesList` | `src/components/pro-services-list.tsx` | Liste des prestations proposées par un prestataire spécifique. |
| `ProReviews` | `src/components/pro-reviews.tsx` | Affichage des avis clients reçus par le prestataire. |
| `AddReviewForm` | `src/components/add-review-form.tsx` | Formulaire d'attribution de note par étoiles et avis écrit. |
| `BookingStepper` | `src/components/booking-stepper.tsx` | Barre d'étapes de réservation d'un créneau horaire. |
| `DateTimePicker` | `src/components/date-time-picker.tsx` | Sélection de date et créneau horaire disponible. |
| `BookingSummary` | `src/components/booking-summary.tsx` | Récapitulatif de la demande de rendez-vous avant transmission. |
| `BookingTicket` | `src/components/booking-ticket.tsx` | Fiche détaillée imprimable du rendez-vous confirmé. |
| `ProContactActions` | `src/components/pro-contact-actions.tsx` | Boutons d'action immédiate WhatsApp (`wa.me` avec note vocale et texte pré-rempli) et Appel direct (`tel:`). |
| `CityCombobox` | `src/components/city-combobox.tsx` | Sélecteur déroulant de ville/commune ivoirienne et régionale avec recherche dynamique et stratégies de tri (`populaire`, `alphabétique`, `région`). |
| `HeroSloganRotator` | `src/components/hero-slogan-rotator.tsx` | Animateur Framer Motion fluide des 4 slogans officiels de la plateforme en page d'accueil. |
