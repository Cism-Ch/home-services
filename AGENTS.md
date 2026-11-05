# AGENTS.md - AI Agent Reference & RSI Protocol

This document governs engineering guidelines, codebase governance, and the Recursive Self-Improvement (RSI) protocol.

---

### Inviolable Rules Summary

1. **Architecture & Strict Typing:** Zero type errors, strong inference, and systematic runtime validation.
2. **Task Tracking (Inviolable SSOT - `docs/TASKS.md`):**
    - **No Unregistered Coding:** All work MUST be attached to a formalized task in `docs/TASKS.md` (`TASK-DOMAIN-XX`) with a description and checkable acceptance criteria.
    - **Real-Time Updates:** Mark `[-]` at start, `[x]` upon completion.
    - **Validation Before Closure:** Never mark a task completed without validating with the deterministic judge (`python evals/run_fullstack_eval.py`).
    - **Strict Ceiling:** `docs/TASKS.md` must never exceed **250 lines** (Rollover to `docs/archive/tasks/`).
3. **RSI Protocol (Recursive Self-Improvement):**
    - **Modular Procedural Memory:** Consult `.agents/rules/modules/` for specialized rules (< 80 lines per file).
    - **Adaptive Deterministic Judge:** Validate progress with `python evals/run_fullstack_eval.py --quick`.
    - **Meta-Cognitive Loop:** Adopt `.agents/prompts/meta_optimizer.md` to extract lessons and enrich sub-playbooks when fixing bugs or after security audits.
    - **Dedicated Workflow:** Use the `/rsi-feature` command.
4. **Anti-Saturation Test Cadence:**
    - Micro-edits without global test suite -> Milestone checkpoint with compact `--quick` -> Task closure with full validation.
5. **Memory Duality:**
    - IDE Artifacts for episodic session tracking; `.agents/rules/modules/` files for durable procedural memory.
6. **Réutilisation Stricte des Composants UI shadcn/ui & Radix (Zéro Réinvention de la Roue) :**
    - **Catalogue Complet à Disposition (40 Composants) :** Le dossier `@/components/ui` intègre l'ensemble officiel des primitives shadcn/Radix. Toujours vérifier et utiliser en priorité ces composants déjà stylisés et testés :
        - _Surfaces & Layout :_ `Card`, `PremiumCard`, `Sheet`, `Dialog`, `Drawer` (tactile swipe-down), `ScrollArea`, `Separator`, `Resizable`, `AspectRatio`.
        - _Actions & Navigation :_ `Button`, `PremiumButton`, `Badge`, `Tabs`, `Breadcrumb`, `Pagination`, `Menubar`, `Toggle`, `ToggleGroup`.
        - _Formulaires & Saisie :_ `Input`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `Select`, `Label`.
        - _Overlays & Feedback :_ `Tooltip`, `Popover`, `HoverCard`, `ContextMenu`, `DropdownMenu`, `AlertDialog`, `Toast`, `Skeleton`, `SkeletonPremium`, `Progress`, `Command` (palette `cmdk`).
        - _Données & Tables :_ `ResponsiveTable` (table desktop et cartes mobiles auto).
    - **Interdiction de Réinventer l'UI :** Ne jamais recoder manuellement de modal (`<div>` en fixed), de tooltip avec `title` HTML ou état local, de menu tiroir ou de dropdown artisanal avec des `useState` isolés. Toujours composer à partir des primitives `@/components/ui`.
    - **Nouveaux Composants via CLI shadcn :** Si un composant UI standard est absent du dossier `@/components/ui`, utiliser le CLI ou le skill shadcn (`npx shadcn@latest add <component>`) plutôt que de bricoler une implémentation artisanale sans accessibilité ARIA.
7. **Sécurité `.env`** : Ne jamais supprimer les variables d'environnement existantes et faire atention a leur noms.

### Notes

<!-- .env .env.local .env.example -->

Les Clé doivent être stockées de manière sécurisée et ne doivent jamais être partagées.
Elles doivent être stockées dans un fichier `.env` et ne doivent jamais être partagées.

<!-- Emoji -->

Ne pas utiliser d'emoji.

<!-- Shadcn -->

Utiliser les skills Shadcn UI pour construire les composant et coder l'UI/UX.
Ne pas inventer des d'implémentation de shadcn ui, utiliser les skills et régles Shadcn. ajouter toujours des skelton de chargement web au composant d'UI des qu'ils n'en n'ont pas ou sont créee.

<!-- Framer Motion-->

Tout composants cree doit avoir des animation et des transitions en utilisant framer motion. en respectant les règles de framer motion compatible avec le stack actuelle et en utilisant le skill framer motion.

### Notre Sass

Nous developpons un Sass ultra moderne pour mettre en relation clients et prestataires de service en Afrique. pour l'heure voici en synthese ce que le site doit permettre de faire.

- Langue du site: principalement le francais et secondairement l'anglais.
- Devise: XOF (FCFA)
- Pays: Principalement francophone.
- On ne reçoit pas d'argent sur le site. Les transaction se font entre clients et prestataires en dehors du site.
- On met en relation les clients et les prestataires de service.
- Un client peut rechercher un prestataire par catégorie de service et par ville.
- Un prestataire peut s'inscrire et proposer ses services.
- Si mise en relation il y a, le client et le prestataire entre en contact via les moyens de communication qu'ils jugent utiles. Apres la prestation, le client peut laisser un avis sur le prestataire et le prestataire peut laisser un avis sur le client.
- les moyens de communication sont un numero de telephone pour les appeles et un whatsapp pour les discussion et note vocal.
- Il y auras trois niveaux d'abonnement a mettre en place pour les prestataires:
    - abonnement standard: 5 000 FCFA/mois avec 1 mois offer
    - abonnement premium: 10 000 FCFA/mois avec 1 mois offer
    - abonnement entreprise: 20 000 FCFA/mois avec 1 mois offer
- Pour les clients:
    - Il n'y a pas d'abonnement, libre usage.
    - abonnement 2000 FCFA/mois pour des avantages specifique du comptes comme un badge premium or et un meilleurs positionnemnt dans les recherches des prestataires mais aussi pour soutenir le projet, etc.
- On utilise Paystack pour les transactions.

<!-- Slogan multiple a faire defiler avec des animation sur la pages d'accueil (Hero) -->

"Trouver le professionnel qu'il vous faut."
"Trouver des prestataires de services locaux et inversement."
"Trouver les prestataires de services qu'il vous faut."
"Trouver les clients qu'il vous faut."
