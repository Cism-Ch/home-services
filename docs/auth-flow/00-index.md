# Documentation UX - Flow d'Authentification

## Vue d'Ensemble du Projet

Conception complète du flow d'authentification (login/register) pour la plateforme Next.js de services à domicile, utilisant **Better-auth** comme solution d'authentification et respectant le design system luxueux existant (bleu marine/beige/orange).

### Solution Technique : Better-auth

Le projet utilise **Better-auth**, une librairie d'authentification framework-agnostic pour TypeScript qui offre :
- **Sécurité robuste** : Gestion automatique des tokens, sessions sécurisées, protection CSRF
- **Flexibilité d'implémentation** : S'intègre parfaitement avec Next.js App Router
- **Réduction de complexité** : Évite la redondance de code pour OAuth, sessions, tokens
- **Écosystème extensible** : Plugins pour 2FA, magic links, passkeys disponibles
- **TypeScript natif** : Type-safety complète sur client et serveur

## Structure de la Documentation

### 1. Découverte & Définition
- **[01-personas.md](./01-personas.md)** - Personas utilisateurs détaillés
- **[02-user-flows.md](./02-user-flows.md)** - Flows utilisateurs et cas d'usage
- **[03-edge-cases.md](./03-edge-cases.md)** - Cas limites et gestion d'erreurs
- **[04-better-auth-integration.md](./04-better-auth-integration.md)** - 🆕 Intégration technique Better-auth

### 2. Design & Spécifications
- **[04-login-specs.md](./04-login-specs.md)** - Spécifications détaillées de la page Login
- **[05-register-specs.md](./05-register-specs.md)** - Spécifications détaillées de la page Register
- **[06-forgot-password-specs.md](./06-forgot-password-specs.md)** - Flow mot de passe oublié
- **[07-ui-components.md](./07-ui-components.md)** - Composants UI à créer
- **[08-microcopy.md](./08-microcopy.md)** - Messages et textes utilisateur

### 3. Architecture Technique
- **[09-frontend-architecture.md](./09-frontend-architecture.md)** - Architecture frontend
- **[10-backend-api.md](./10-backend-api.md)** - Spécifications API et backend
- **[11-validation-schemas.md](./11-validation-schemas.md)** - Schémas de validation Zod
- **[12-state-management.md](./12-state-management.md)** - Gestion d'état et authentification

### 4. Design System
- **[13-design-tokens.md](./13-design-tokens.md)** - Tokens design (couleurs, animations, effets)
- **[14-accessibility.md](./14-accessibility.md)** - Guidelines accessibilité WCAG 2.1 AA
- **[15-responsive-design.md](./15-responsive-design.md)** - Adaptations responsive

### 5. Implémentation
- **[16-implementation-plan.md](./16-implementation-plan.md)** - Plan d'implémentation priorisé
- **[17-testing-strategy.md](./17-testing-strategy.md)** - Stratégie de tests

## Design System Existant

### Couleurs Principales
- **Primary**: Bleu marine `#1B2632` - `215 28% 15%`
- **Secondary**: Beige `#C9C1B1` - `40 16% 74%`
- **Accent**: Orange `#F09235` - `29 86% 57%`
- **Brand Gradient**: `from-[hsl(27 96% 61%)]` to `to-[hsl(31 97% 72%)]`

### Effets Signature
- **Glow effects**: `.glow-brand`, `.glow-brand-lg`
- **Hover transformations**: `-translate-y-2` + `shadow-2xl`
- **Animations**: `animate-appear`, delays 100-1000ms
- **Transitions**: 300-500ms avec cubic-bezier

### Composants Disponibles
- Form (react-hook-form + zod)
- Button (variants: default, outline, ghost)
- Input (avec focus-visible et aria-invalid)
- Card, Label, Checkbox, Badge, Dialog, Tabs

## Stack Technique

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Better-auth + @better-auth/prisma
- **Database**: Supabase (PostgreSQL) via Prisma ORM
- **OAuth Provider**: Google (GitHub en Phase 2)
- **Validation**: Zod + react-hook-form + @hookform/resolvers
- **UI**: shadcn/ui (style "new-york")
- **Theming**: next-themes (light/dark/luxury)
- **Icons**: lucide-react
- **Styling**: Tailwind CSS 4

## Objectifs UX Prioritaires

1. **Sécurité visible** - Indicateurs de force mot de passe, validation temps réel
2. **Feedback immédiat** - États de chargement, messages d'erreur contextuels
3. **Accessibilité** - Navigation clavier, screen readers, focus management
4. **Friction minimale** - Autofill, validation progressive, auth sociale
5. **Cohérence visuelle** - Respect strict du design system existant

## Statut de la Documentation

### Phase 1 - Découverte & Architecture (Complété)
- [x] Index créé et mis à jour avec Better-auth
- [x] Personas utilisateurs définis
- [x] User flows documentés
- [x] Edge cases identifiés
- [x] **Intégration Better-auth documentée** 🆕

### Phase 2 - Spécifications Détaillées (À venir)
- [ ] Spécifications UI Login
- [ ] Spécifications UI Register
- [ ] Flow mot de passe oublié détaillé
- [ ] Composants UI à créer
- [ ] Microcopy et messages

### Phase 3 - Implémentation (À venir)
- [ ] Configuration Better-auth serveur
- [ ] Configuration Better-auth client
- [ ] Migration base de données
- [ ] Implémentation composants UI
- [ ] Tests et validation

---

**Dernière mise à jour**: 2025-11-23  
**Version**: 1.0.0  
**Auteur**: UX Design Expert