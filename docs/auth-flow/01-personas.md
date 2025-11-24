# Personas Utilisateurs - Flow d'Authentification

## Vue d'Ensemble

Trois personas représentatifs des utilisateurs clés de la plateforme de services à domicile, identifiés pour optimiser les flows d'authentification selon leurs besoins, comportements et points de friction spécifiques.

---

## Persona 1: Sophie Martin - La Professionnelle Pressée

### Profil Démographique
- **Âge**: 34 ans
- **Profession**: Directrice marketing en agence
- **Localisation**: Paris, France
- **Situation familiale**: Célibataire, vit seule en appartement
- **Niveau d'éducation**: Master en marketing digital

### Photo Description
Femme dynamique en tenue professionnelle décontractée, consultant son smartphone dans un environnement urbain moderne.

### Objectifs Principaux
1. **Primaire**: Réserver rapidement des services à domicile (ménage, plomberie) sans friction
2. **Secondaire**: Accéder à son historique de réservations depuis n'importe quel appareil
3. **Tertiaire**: Gérer ses paiements et factures de manière centralisée

### Motivations
- **Gain de temps**: Cherche des solutions rapides pour déléguer les tâches domestiques
- **Fiabilité**: Privilégie les services professionnels vérifiés
- **Flexibilité**: Besoin d'accéder à la plateforme depuis mobile et desktop
- **Simplicité**: Évite les processus complexes qui ralentissent sa prise de décision

### Frustrations & Points de Douleur
- **Inscription longue**: Abandonne si le formulaire demande trop d'informations
- **Mots de passe oubliés**: Frustrée par les processus de récupération compliqués
- **Multiples appareils**: Veut que sa session persiste entre mobile et ordinateur
- **Vérifications email**: Irritée par les étapes de vérification qui retardent l'accès
- **Formulaires répétitifs**: N'aime pas ressaisir les mêmes informations

### Utilisation Technologique
- **Appareils**: iPhone 14 Pro, MacBook Air
- **Applications favorites**: Uber, Deliveroo, Airbnb, Banking apps
- **Niveau technique**: Avancé - utilise password managers (1Password)
- **Comportement**: Utilise Face ID/Touch ID, préfère l'authentification sociale
- **Contexte d'usage**: 60% mobile (déplacements), 40% desktop (bureau/domicile)

### User Stories

**US-1.1**: En tant que Sophie, je veux me connecter avec mon compte Google en un clic, afin de ne pas perdre de temps à créer un nouveau compte avec mot de passe.

**US-1.2**: En tant que Sophie, je veux que ma session reste active entre mes appareils, afin de ne pas avoir à me reconnecter à chaque fois que je change d'appareil.

**US-1.3**: En tant que Sophie, je veux réinitialiser mon mot de passe en 2 minutes maximum, afin de pouvoir réserver rapidement le service dont j'ai besoin maintenant.

### Implications UX pour l'Authentification
- ✅ Prioriser l'authentification sociale (Google, Apple)
- ✅ Option "Se souvenir de moi" activée par défaut
- ✅ Récupération de mot de passe ultra-rapide (lien magique)
- ✅ Validation progressive sans bloquer l'accès immédiat
- ✅ Support biométrique (Face ID/Touch ID) sur mobile
- ❌ Éviter les formulaires multi-étapes pour l'inscription
- ❌ Pas de vérification email obligatoire avant premier usage

---

## Persona 2: Jean Dubois - Le Senior Prudent

### Profil Démographique
- **Âge**: 62 ans
- **Profession**: Retraité, ancien comptable
- **Localisation**: Lyon, France
- **Situation familiale**: Marié, 2 enfants adultes
- **Niveau d'éducation**: Licence en comptabilité

### Photo Description
Homme mature avec lunettes, assis devant un ordinateur de bureau, air concentré et méticuleux.

### Objectifs Principaux
1. **Primaire**: Trouver des professionnels de confiance pour des travaux (jardinier, électricien)
2. **Secondaire**: Comprendre clairement les conditions d'utilisation et la sécurité
3. **Tertiaire**: Contacter facilement le support en cas de problème

### Motivations
- **Sécurité**: Préoccupé par la protection de ses données personnelles et bancaires
- **Clarté**: Besoin d'instructions explicites à chaque étape
- **Confiance**: Recherche des indicateurs de fiabilité (certifications, avis)
- **Contrôle**: Veut comprendre ce qui se passe avec ses informations
- **Assistance**: Apprécie d'avoir de l'aide disponible en cas de blocage

### Frustrations & Points de Douleur
- **Jargon technique**: Se sent perdu face aux termes comme "OAuth" ou "SSO"
- **Erreurs cryptiques**: Ne comprend pas les messages d'erreur techniques
- **Navigation complexe**: Perd facilement le fil si trop d'options
- **Petits textes**: Difficulté à lire les labels et messages trop petits
- **Validation silencieuse**: Angoissé si aucun feedback après une action
- **Mots de passe complexes**: Frustré par les exigences strictes sans explication

### Utilisation Technologique
- **Appareils**: PC Windows, smartphone Android (Samsung)
- **Applications utilisées**: Email, banque en ligne, quelques sites d'actualités
- **Niveau technique**: Débutant/Intermédiaire - prudent avec les nouvelles technologies
- **Comportement**: Note ses mots de passe, méfiant de l'authentification sociale
- **Contexte d'usage**: 85% desktop, 15% mobile (consultatif uniquement)

### User Stories

**US-2.1**: En tant que Jean, je veux voir clairement pourquoi mon mot de passe est refusé, afin de comprendre ce que je dois corriger sans me sentir bloqué.

**US-2.2**: En tant que Jean, je veux avoir une explication simple de ce qui se passe après mon inscription, afin de me sentir en confiance avec la plateforme.

**US-2.3**: En tant que Jean, je veux pouvoir contacter le support directement depuis la page de connexion, afin d'obtenir de l'aide si je rencontre un problème d'authentification.

### Implications UX pour l'Authentification
- ✅ Messages d'erreur ultra-clairs avec solutions explicites
- ✅ Indicateur de force de mot de passe pédagogique
- ✅ Labels et textes avec taille minimum 14px
- ✅ Confirmation visuelle à chaque étape (checkmarks, messages de succès)
- ✅ Lien vers support/aide visible sur toutes les pages auth
- ✅ Explication des bénéfices de créer un compte
- ✅ Option d'inscription par email/mot de passe (familier)
- ❌ Éviter l'auth sociale comme unique option
- ❌ Pas de captchas complexes

---

## Persona 3: Malik Hassan - L'Artisan Connecté

### Profil Démographique
- **Âge**: 29 ans
- **Profession**: Plombier indépendant
- **Localisation**: Marseille, France
- **Situation familiale**: En couple, pas d'enfants
- **Niveau d'éducation**: CAP plomberie

### Photo Description
Jeune homme en tenue de travail, consultant son smartphone pendant une pause, environnement chantier.

### Objectifs Principaux
1. **Primaire**: S'inscrire comme prestataire pour recevoir des demandes de clients
2. **Secondaire**: Gérer son profil professionnel et ses disponibilités
3. **Tertiaire**: Suivre ses réservations et paiements en temps réel

### Motivations
- **Opportunités business**: Cherche à développer sa clientèle
- **Mobilité**: Besoin d'accéder à la plateforme en déplacement
- **Efficacité**: Veut répondre rapidement aux demandes clients
- **Professionnalisme**: Souhaite une image professionnelle sur la plateforme
- **Autonomie**: Préfère gérer lui-même son activité sans intermédiaire

### Frustrations & Points de Douleur
- **Processus d'inscription long**: Abandonnerait si trop de documents requis dès le départ
- **Validation tardive**: Frustré si son compte n'est pas activé rapidement
- **Notifications manquées**: Craint de perdre des opportunités
- **Accès mobile limité**: Besoin que toutes les fonctions soient disponibles sur mobile
- **Connexion fréquente**: Irrité si doit se reconnecter plusieurs fois par jour

### Utilisation Technologique
- **Appareils**: Smartphone Android (utilisé 90% du temps), parfois tablette
- **Applications favorites**: WhatsApp, Instagram, Google Maps, apps bancaires
- **Niveau technique**: Intermédiaire - à l'aise avec les apps mobiles
- **Comportement**: Préfère les notifications push, utilise géolocalisation
- **Contexte d'usage**: 90% mobile (en déplacement constant), 10% tablette (soirée)

### User Stories

**US-3.1**: En tant que Malik, je veux m'inscrire rapidement en tant que professionnel avec les informations essentielles, afin de commencer à recevoir des demandes sans délai.

**US-3.2**: En tant que Malik, je veux rester connecté sur mon téléphone pendant plusieurs jours, afin de ne pas perdre de temps à me reconnecter entre chaque intervention.

**US-3.3**: En tant que Malik, je veux être notifié immédiatement après mon inscription, afin de savoir quand je peux commencer à utiliser la plateforme.

### Implications UX pour l'Authentification
- ✅ Inscription progressive: infos essentielles d'abord, détails plus tard
- ✅ Optimisation mobile-first (touch targets, inputs adaptés)
- ✅ Session longue durée sur mobile (30 jours)
- ✅ Support de l'authentification biométrique
- ✅ Notification push confirmant l'inscription réussie
- ✅ Distinction claire type de compte (client vs professionnel) dès l'inscription
- ✅ Option de compléter le profil après la première connexion
- ❌ Pas de double authentification obligatoire (optionnelle)
- ❌ Éviter les étapes de vérification bloquantes

---

## Synthèse & Priorisation des Besoins

### Besoins Communs (Must-Have)
1. **Rapidité**: Tous veulent un processus d'auth rapide (< 2 minutes)
2. **Clarté**: Messages et feedback immédiat à chaque action
3. **Flexibilité**: Support multi-appareils avec session persistante
4. **Sécurité visible**: Indicateurs visuels de protection des données

### Besoins Divergents à Équilibrer
| Besoin | Sophie | Jean | Malik | Solution UX |
|--------|--------|------|-------|-------------|
| Auth sociale | +++++ | + | +++ | Proposer, ne pas imposer |
| Instructions détaillées | + | +++++ | ++ | Textes d'aide contextuels pliables |
| Mobile-first | ++++ | + | +++++ | Design responsive avec prio mobile |
| Session longue | ++++ | ++ | +++++ | Configurable ("Se souvenir" + durée) |
| Vérification email | + | +++ | ++ | Optionnelle, avec avantages clairs |

### Segments Prioritaires pour le Design

**Phase 1 - MVP**: Focus sur Sophie (professionnels urbains pressés)
- Authentification sociale en priorité
- Process ultra-rapide
- Mobile-first

**Phase 2 - Expansion**: Optimisation pour Jean (seniors)
- Amélioration des messages d'aide
- Support/assistance visible
- Accessibilité renforcée

**Phase 3 - Professionnels**: Adaptation pour Malik
- Inscription pro séparée
- Validation de compte progressive
- Notifications métier

---

## Matrices de Décision UX

### Fonctionnalités d'Authentification par Impact

| Fonctionnalité | Sophie | Jean | Malik | Score Total | Priorité |
|----------------|--------|------|-------|-------------|----------|
| Auth sociale (Google/GitHub) | 10 | 3 | 7 | 20 | P0 |
| Récupération mot de passe rapide | 9 | 8 | 6 | 23 | P0 |
| "Se souvenir de moi" | 10 | 5 | 10 | 25 | P0 |
| Validation temps réel | 8 | 9 | 7 | 24 | P0 |
| Indicateur force mot de passe | 6 | 10 | 6 | 22 | P0 |
| Messages d'erreur clairs | 7 | 10 | 8 | 25 | P0 |
| Lien magique (passwordless) | 9 | 4 | 5 | 18 | P1 |
| Biométrie (Face/Touch ID) | 9 | 2 | 8 | 19 | P1 |
| Double authentification | 4 | 6 | 2 | 12 | P2 |
| Vérification email obligatoire | 2 | 7 | 3 | 12 | P2 |

**Légende des scores**: 1-10 (1=pas important, 10=critique)  
**Priorités**: P0=MVP, P1=Phase 2, P2=Phase 3

---

## Intégration Better-auth

### Comment Better-auth Répond aux Besoins des Personas

Better-auth a été choisi comme solution d'authentification car il répond directement aux besoins prioritaires identifiés dans nos personas :

#### Pour Sophie (Professionnelle Pressée) ✅

**Besoins identifiés :**
- Authentification sociale rapide (Google)
- Session persistante multi-appareils
- Récupération mot de passe ultra-rapide

**Solutions Better-auth :**
```typescript
// Configuration OAuth Google
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }
}

// Session longue durée
session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 jours
  cookieCache: { enabled: true }
}

// Reset password rapide (15 min)
resetPasswordTokenExpiresIn: 900
```

**Impact UX :**
- Connexion Google en 1 clic via [`authClient.signIn.social()`](../04-better-auth-integration.md)
- Sessions automatiquement synchronisées entre appareils
- Flow reset password optimisé avec tokens courte durée

#### Pour Jean (Senior Prudent) ✅

**Besoins identifiés :**
- Messages d'erreur ultra-clairs
- Option email/password traditionnelle
- Indicateurs de sécurité visibles

**Solutions Better-auth :**
```typescript
// Email/password activé
emailAndPassword: {
  enabled: true,
  minPasswordLength: 8,
  requireEmailVerification: false, // Non bloquant
  autoSignIn: true
}

// Validation robuste côté serveur
// avec messages d'erreur explicites retournés par l'API
```

**Impact UX :**
- Choix entre OAuth et email/password (pas imposé)
- Validation de mot de passe progressive avec feedback clair
- Better-auth fournit codes d'erreur structurés (`EMAIL_ALREADY_EXISTS`, etc.)

#### Pour Malik (Artisan Connecté) ✅

**Besoins identifiés :**
- Inscription rapide (infos minimales)
- Session longue sur mobile
- Pas de 2FA obligatoire

**Solutions Better-auth :**
```typescript
// Auto-login après inscription
emailAndPassword: {
  autoSignIn: true,
  disableSignUp: false
}

// Session mobile optimisée
session: {
  expiresIn: 60 * 60 * 24 * 30 // 30 jours possible
}
```

**Impact UX :**
- Inscription simplifiée : nom, email, password → connecté immédiatement
- Session persistante adapté usage mobile intensif
- 2FA disponible en plugin mais non activé (Phase 2 si besoin)

### Mapping Fonctionnalités Better-auth vs Besoins Personas

| Fonctionnalité Better-auth | Sophie | Jean | Malik | Implémentation |
|----------------------------|--------|------|-------|----------------|
| OAuth Social (Google) | +++++ | ++ | +++ | [`lib/auth.ts`](../04-better-auth-integration.md) |
| Email/Password | ++ | +++++ | ++++ | Configuration `emailAndPassword` |
| Session Management | +++++ | +++ | +++++ | Auto-géré par Better-auth |
| Password Reset | ++++ | ++++ | +++ | [`authClient.forgetPassword()`](../04-better-auth-integration.md) |
| Auto Sign-in | ++++ | + | +++++ | `autoSignIn: true` |
| Email Verification | + | +++ | + | `requireEmailVerification: false` |
| Rate Limiting | +++ | ++++ | ++ | Natif dans Better-auth |
| Hooks React | +++++ | ++ | +++++ | [`useSession()`](../04-better-auth-integration.md) |

**Légende** : + faible intérêt, +++++ critique

### Points Techniques Clés

1. **Pas de composants UI fournis** : Better-auth est headless. Utilisation des composants du design system existant ([`Card`](../../src/components/ui/card.tsx), [`Button`](../../src/components/ui/button.tsx), [`Input`](../../src/components/ui/input.tsx))

2. **TypeScript natif** : Type-safety complète garantit moins d'erreurs runtime

3. **Next.js App Router** : Intégration native avec Server Components et Server Actions

4. **Prisma + Supabase** : Schéma prédéfini, migrations automatiques

### Évolution Future (Phase 2+)

Better-auth offre des plugins pour répondre à des besoins futurs :

- **2FA/MFA** : Si Jean demande plus de sécurité
- **Magic Links** : Alternative passwordless pour Sophie
- **Passkeys** : Auth biométrique mobile pour Malik
- **Email OTP** : Codes à 6 chiffres comme alternative

**Référence** : Voir [`04-better-auth-integration.md`](./04-better-auth-integration.md) pour configuration détaillée

---

**Dernière mise à jour**: 2025-11-23
**Version**: 1.1.0 (Intégration Better-auth)
**Validé par**: UX Research Expert + Technical Architect