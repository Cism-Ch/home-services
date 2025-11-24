# User Flows - Authentification

## Vue d'Ensemble

Documentation détaillée des parcours utilisateurs pour les flows d'authentification (login, register, récupération mot de passe), avec états, décisions et variations selon les personas.

---

## Table des Matières

1. [Flow Login - Connexion](#flow-login---connexion)
2. [Flow Register - Inscription](#flow-register---inscription)
3. [Flow Mot de Passe Oublié](#flow-mot-de-passe-oublié)
4. [Flow Authentification Sociale](#flow-authentification-sociale)
5. [Flow Vérification Email](#flow-vérification-email)
6. [États et Transitions](#états-et-transitions)

---

## Flow Login - Connexion

### Flow Principal - Connexion Réussie

```
[Point d'Entrée]
    ↓
[Page Login] → État: Formulaire vide, focus auto sur email
    │
    ├─→ [Saisie Email]
    │   ├─→ Validation temps réel (format email)
    │   ├─→ Feedback visuel (✓ ou ✗)
    │   └─→ Suggestions autofill (si navigateur)
    │
    ├─→ [Saisie Mot de passe]
    │   ├─→ Toggle visibilité (icône œil)
    │   ├─→ Pas de validation temps réel (sécurité)
    │   └─→ Autofill gestionnaire mots de passe
    │
    ├─→ [Checkbox "Se souvenir de moi"]
    │   └─→ Par défaut: non coché (sécurité)
    │
    ├─→ [Clic "Se connecter"]
    │   ↓
    │   [Validation Frontend]
    │   ├─→ Email valide ? Non → Afficher erreur
    │   ├─→ Password rempli ? Non → Afficher erreur
    │   └─→ Tout OK → Continuer ↓
    │   
    │   [État Loading]
    │   ├─→ Bouton désactivé + spinner
    │   ├─→ Formulaire désactivé
    │   └─→ Requête POST /api/auth/login
    │       ↓
    │   [Réponse Serveur: 200 Success]
    │   ├─→ Stocker token (localStorage ou cookie)
    │   ├─→ Mettre à jour contexte auth
    │   ├─→ Animation succès (✓ + message)
    │   └─→ Redirection (300ms delay)
    │       ↓
    │   [Dashboard ou page origin]
    │
    └─→ [OU Auth Sociale] → Voir flow dédié
```

### Variations du Flow

#### Variation 1: Utilisateur déjà connecté
```
[Arrivée sur /login]
    ↓
[Détection session active]
    ↓
[Redirection automatique vers Dashboard]
```

#### Variation 2: Login avec redirection
```
[Page protégée sans auth]
    ↓
[Middleware détecte non-auth]
    ↓
[Redirection /login?redirect=/page-protegee]
    ↓
[Après login réussi]
    ↓
[Redirection vers /page-protegee (pas Dashboard)]
```

#### Variation 3: "Se souvenir de moi" activé
```
[Login réussi avec remember=true]
    ↓
[Génération refresh token longue durée (30j)]
    ↓
[Stockage refresh token (httpOnly cookie)]
    ↓
[Sessions persistantes entre appareils]
```

### Points de Décision Clés

| Point | Condition | Action Oui | Action Non |
|-------|-----------|------------|------------|
| Email valide? | Format email regex | Continuer | Erreur inline temps réel |
| Credentials valides? | Backend vérifie | Success + redirect | Erreur "Email ou mot de passe incorrect" |
| Email vérifié? | user.emailVerified | Login OK | Proposer renvoi email (optionnel) |
| Rate limit atteint? | > 5 tentatives | Bloquer 15min + captcha | Continuer |
| 2FA activé? | user.twoFactorEnabled | Demander code 2FA | Login direct |

---

## Flow Register - Inscription

### Flow Principal - Inscription Réussie

```
[Point d'Entrée]
    ↓
[Page Register] → État initial
    │
    ├─→ [Choix Type Compte] (Si applicable)
    │   ├─→ Client (par défaut)
    │   └─→ Professionnel → Flag userType='pro'
    │
    ├─→ [Saisie Nom Complet]
    │   ├─→ Validation temps réel (min 2 mots)
    │   └─→ Feedback visuel
    │
    ├─→ [Saisie Email]
    │   ├─→ Validation format temps réel
    │   ├─→ Vérification unicité (debounced 500ms)
    │   │   ├─→ Disponible: ✓ vert
    │   │   └─→ Déjà utilisé: Erreur + lien "Se connecter?"
    │   └─→ Suggestions corrections (ex: @gmai.com → @gmail.com)
    │
    ├─→ [Saisie Mot de passe]
    │   ├─→ Validation temps réel
    │   ├─→ Indicateur force (Faible/Moyen/Fort)
    │   │   └─→ Critères visibles:
    │   │       • Min 8 caractères
    │   │       • 1 majuscule
    │   │       • 1 chiffre
    │   │       • 1 caractère spécial (optionnel mais ↑ force)
    │   └─→ Toggle visibilité
    │
    ├─→ [Confirmation Mot de passe]
    │   ├─→ Validation: match avec mot de passe
    │   └─→ Feedback temps réel
    │
    ├─→ [Checkbox CGU/Politique] (Requis)
    │   ├─→ Liens modaux vers documents
    │   └─→ Validation: doit être coché
    │
    ├─→ [Checkbox Newsletter] (Optionnel)
    │   └─→ Par défaut: non coché
    │
    ├─→ [Clic "S'inscrire"]
    │   ↓
    │   [Validation Frontend Complète]
    │   ├─→ Tous champs valides ? Non → Focus premier champ erreur
    │   └─→ OK → Continuer ↓
    │
    │   [État Loading]
    │   ├─→ Bouton désactivé + spinner + texte "Création du compte..."
    │   └─→ Requête POST /api/auth/register
    │       ↓
    │   [Réponse Serveur: 201 Created]
    │   ├─→ Compte créé avec user_id
    │   ├─→ Email vérification envoyé (background)
    │   ├─→ Auto-login (génération token)
    │   └─→ Stockage token
    │       ↓
    │   [Animation Succès]
    │   ├─→ Confetti ou checkmark animé
    │   ├─→ Message "Bienvenue [Prénom] !"
    │   └─→ (300ms delay)
    │       ↓
    │   [Redirection]
    │   ├─→ Si client: /dashboard?welcome=true
    │   └─→ Si pro: /onboarding/pro (compléter profil)
    │
    └─→ [OU Auth Sociale] → Voir flow dédié
```

### Flow Post-Inscription

```
[Après création compte]
    ↓
[Page Welcome/Onboarding] (Optionnel)
    │
    ├─→ [Bannière info]
    │   "Email de vérification envoyé à [email]"
    │   └─→ Lien "Renvoyer l'email" (si pas reçu)
    │
    ├─→ [Tour guidé - Première visite]
    │   ├─→ Tooltips fonctionnalités clés
    │   ├─→ Skip possible
    │   └─→ Marquage: user.onboardingCompleted = true
    │
    └─→ [Accès complet plateforme]
        └─→ Fonctionnalités premium bloquées si email non vérifié (optionnel)
```

### Variations du Flow

#### Variation 1: Inscription Professionnel
```
[Sélection "Compte Professionnel"]
    ↓
[Formulaire étendu]
    ├─→ Champs standards (nom, email, password)
    ├─→ + Nom entreprise (optionnel à ce stade)
    ├─→ + Téléphone professionnel
    └─→ + Type de services (multi-select)
    ↓
[Après inscription]
    ↓
[Redirection /onboarding/pro]
    ├─→ Étape 1: Profil entreprise
    ├─→ Étape 2: Services & tarifs
    ├─→ Étape 3: Disponibilités
    ├─→ Étape 4: Documents (SIRET, assurances)
    └─→ Étape 5: Validation manuelle équipe
        ↓
    [Compte pro actif]
```

#### Variation 2: Inscription Express (Minimal)
```
[Utilisateur pressé - Persona Sophie]
    ↓
[Formulaire minimal]
    ├─→ Email uniquement
    ├─→ Password (généré auto si auth sociale)
    └─→ CGU acceptées implicitement avec disclaimer
    ↓
[Inscription en 1 clic]
    ↓
[Complétion profil progressive]
    └─→ Demandes info au fil de l'usage
```

### Points de Décision Clés

| Point | Condition | Action Oui | Action Non |
|-------|-----------|------------|------------|
| Email unique? | DB query email exists | Erreur + lien login | Continuer |
| Password assez fort? | Score >= 3/5 | Accepter | Warning mais autoriser |
| CGU acceptées? | checkbox checked | Continuer | Bloquer soumission |
| Type compte? | Client vs Pro | Flow différencié | Default: Client |
| Email valide? | Format + MX records | Continuer | Erreur détaillée |

---

## Flow Mot de Passe Oublié

### Flow Principal - Récupération Réussie

```
[Page Login]
    ↓
[Clic "Mot de passe oublié?"]
    ↓
[Page /forgot-password]
    │
    ├─→ [Saisie Email]
    │   ├─→ Validation format
    │   └─→ Autofill suggestion
    │
    ├─→ [Clic "Réinitialiser"]
    │   ↓
    │   [État Loading]
    │   └─→ POST /api/auth/forgot-password
    │       ↓
    │   [Réponse: 200 (toujours même réponse pour sécurité)]
    │       ↓
    │   [Page Confirmation]
    │   ├─→ Message: "Si un compte existe avec cet email,
    │   │    vous recevrez un lien de réinitialisation"
    │   ├─→ Timer countdown (60s avant renvoyer)
    │   ├─→ Lien "Retour au login"
    │   └─→ Note sécurité: "Vérifiez vos spams"
    │
    └─→ [Backend - Async]
        ├─→ Vérifier email existe ? Oui → Continuer | Non → Log & stop
        ├─→ Générer token unique (UUID + timestamp)
        ├─→ Stocker: password_reset_tokens table
        │   • user_id
        │   • token (hashed)
        │   • expires_at (15 minutes)
        │   • used: false
        ├─→ Envoyer email avec lien
        │   reset-password?token=[TOKEN]
        └─→ Log tentative (sécurité)

[Utilisateur reçoit email]
    ↓
[Clic sur lien dans email]
    ↓
[Page /reset-password?token=xxx]
    │
    ├─→ [Validation Token]
    │   ├─→ Token valide? Non → Page erreur "Lien expiré/invalide"
    │   │   └─→ Lien "Demander un nouveau lien"
    │   └─→ Oui → Afficher formulaire
    │
    ├─→ [Formulaire Nouveau Mot de Passe]
    │   ├─→ Nouveau mot de passe
    │   │   └─→ Indicateur force
    │   ├─→ Confirmation mot de passe
    │   │   └─→ Validation match
    │   └─→ Note: "Différent de l'ancien" (optionnel)
    │
    ├─→ [Clic "Enregistrer nouveau mot de passe"]
    │   ↓
    │   [État Loading]
    │   └─→ POST /api/auth/reset-password
    │       {token, newPassword}
    │       ↓
    │   [Backend]
    │   ├─→ Valider token (non expiré, non utilisé)
    │   ├─→ Hash nouveau password
    │   ├─→ UPDATE users SET password_hash
    │   ├─→ Marquer token: used=true
    │   ├─→ Invalider toutes sessions existantes
    │   └─→ Email notification changement password
    │       ↓
    │   [Page Succès]
    │   ├─→ Message "Mot de passe modifié avec succès"
    │   ├─→ Bouton "Se connecter maintenant"
    │   └─→ Auto-redirect après 3s
    │       ↓
    │   [Page Login]
    │   └─→ Bannière: "Connectez-vous avec votre nouveau mot de passe"
    │
    └─→ [Sécurité]
        ├─→ Rate limit: 3 demandes max par email / 1h
        ├─→ Logs toutes tentatives
        └─→ Notification email propriétaire compte
```

### Variations du Flow

#### Variation 1: Token Expiré
```
[Clic lien reset après 15min]
    ↓
[Page Erreur]
    ├─→ "Ce lien a expiré"
    ├─→ Explication claire
    └─→ Bouton "Demander un nouveau lien"
        ↓
    [Retour à /forgot-password]
    └─→ Email pré-rempli
```

#### Variation 2: Lien Magique (Passwordless)
```
[Option alternative moderne]
    ↓
[Page Login]
    ↓
[Clic "Se connecter par email"]
    ↓
[Saisie email uniquement]
    ↓
[Envoi lien magique (token unique)]
    ↓
[Clic lien dans email]
    ↓
[Login automatique + session créée]
    ↓
[Dashboard]
```

### Points de Décision Clés

| Point | Condition | Action Oui | Action Non |
|-------|-----------|------------|------------|
| Email existe? | DB lookup | Envoyer email reset | Message générique (sécurité) |
| Token valide? | Non expiré + non utilisé | Afficher form | Page erreur |
| Rate limit? | < 3 demandes / heure | Continuer | Erreur "Trop de tentatives" |
| Password différent? | != ancien (optionnel) | Accepter | Warning recommandation |

---

## Flow Authentification Sociale

### Flow OAuth (Google / GitHub)

```
[Page Login ou Register]
    ↓
[Clic "Continuer avec Google"]
    ↓
[Redirection vers OAuth Provider]
    ├─→ URL: https://accounts.google.com/oauth/authorize
    ├─→ Params: client_id, redirect_uri, scope, state
    └─→ Fenêtre popup ou redirect selon contexte
        ↓
[Utilisateur sur page Google]
    ├─→ Déjà connecté Google? Oui → Consent screen
    └─→ Non → Login Google puis consent
        ↓
[Acceptation permissions]
    ├─→ Email, profil basique
    └─→ (Pas d'accès Gmail ou autres)
        ↓
[Redirection callback]
    ↓
[/api/auth/callback/google?code=xxx&state=yyy]
    ↓
[Backend]
    ├─→ Valider state (CSRF protection)
    ├─→ Échanger code contre access_token
    ├─→ Récupérer profil user de Google
    │   {email, name, picture, email_verified}
    ├─→ Vérifier email dans DB
    │   ├─→ Existe? → Login
    │   │   ├─→ Générer JWT
    │   │   ├─→ Lier compte OAuth si pas déjà fait
    │   │   └─→ Rediriger /dashboard
    │   │
    │   └─→ Pas existe? → Register automatique
    │       ├─→ Créer user {
    │       │     email (verified),
    │       │     name,
    │       │     avatar: picture URL,
    │       │     oauth_provider: 'google',
    │       │     oauth_id: google_sub
    │       │   }
    │       ├─→ Générer JWT
    │       └─→ Rediriger /welcome?new=true
    │
    └─→ [Frontend reçoit token]
        ├─→ Stocker token
        ├─→ Mettre à jour état auth
        └─→ Affichage interface authentifiée
```

### Flow Liaison de Comptes

```
[User déjà inscrit par email]
    ↓
[Essaye login OAuth avec même email]
    ↓
[Backend détecte email existe]
    ↓
[Proposition]
    ├─→ Option 1: "Lier les comptes"
    │   ├─→ Demander password actuel (sécurité)
    │   └─→ Après validation: lier OAuth au compte
    │
    └─→ Option 2: "Utiliser compte existant"
        └─→ Login avec email/password
```

### Points de Décision Clés

| Point | Condition | Action Oui | Action Non |
|-------|-----------|------------|------------|
| State valide? | CSRF token match | Continuer | Erreur sécurité |
| Email déjà existe? | DB lookup | Login | Register auto |
| Email vérifié (OAuth)? | email_verified=true | Marquer vérifié | Demander vérif |
| Compte déjà lié OAuth? | oauth_id existe | Login direct | Proposer liaison |

---

## Flow Vérification Email

### Flow Standard

```
[Après inscription]
    ↓
[Email envoyé automatiquement]
    ├─→ Subject: "Vérifiez votre adresse email"
    ├─→ Contenu:
    │   • Lien vérification
    │   • Expire dans 24h
    │   • Bouton CTA proéminent
    └─→ Footer: aide contact
        ↓
[User clique lien email]
    ↓
[GET /verify-email?token=xxx]
    ↓
[Backend]
    ├─→ Valider token (exists, not expired, not used)
    ├─→ UPDATE users SET email_verified = true
    ├─→ Marquer token used
    └─→ Log vérification
        ↓
[Page Succès]
    ├─→ Animation succès
    ├─→ "Email vérifié avec succès ✓"
    ├─→ User déjà connecté?
    │   ├─→ Oui: Bouton "Continuer" → Dashboard
    │   └─→ Non: Bouton "Se connecter"
    └─→ Auto-redirect après 3s
```

### Flow Renvoi Email

```
[User pas reçu email]
    ↓
[Bannière dashboard ou settings]
    "Email non vérifié"
    ↓
[Clic "Renvoyer email de vérification"]
    ↓
[Vérifications]
    ├─→ Déjà vérifié? → Message "Déjà vérifié"
    ├─→ Rate limit (1 email / 5min)? → Erreur avec countdown
    └─→ OK → Envoyer nouvel email
        ↓
[Message confirmation]
    "Email envoyé à [email address]"
    └─→ Timer avant prochain renvoi possible
```

---

## États et Transitions

### États Globaux d'Authentification

```typescript
enum AuthState {
  UNAUTHENTICATED = 'unauthenticated',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  ERROR = 'error'
}

enum EmailVerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified'
}
```

### Machine d'États - Login

```
[IDLE]
    ↓ user inputs credentials
[VALIDATING_INPUT]
    ├─→ invalid → [IDLE] (show errors)
    └─→ valid ↓
[SUBMITTING]
    ├─→ network error → [ERROR]
    ├─→ 401 Unauthorized → [IDLE] (show error message)
    ├─→ 429 Too Many Requests → [RATE_LIMITED]
    └─→ 200 Success ↓
[AUTHENTICATED]
    └─→ redirect
```

### Machine d'États - Register

```
[IDLE]
    ↓ user starts typing
[VALIDATING_REALTIME]
    ├─→ email check debounced
    ├─→ password strength calculated
    └─→ all valid ↓
[SUBMITTABLE]
    ↓ user clicks register
[CREATING_ACCOUNT]
    ├─→ 409 Conflict (email exists) → [IDLE] (show error)
    ├─→ 422 Validation Error → [IDLE] (show errors)
    └─→ 201 Created ↓
[ACCOUNT_CREATED]
    ├─→ auto-login ↓
    └─→ [AUTHENTICATED]
        └─→ redirect to onboarding
```

---

## Métriques UX Clés

### KPIs de Performance

| Métrique | Target | Mesure |
|----------|--------|--------|
| Time to Login | < 30s | Du clic sur page à dashboard |
| Time to Register | < 90s | Du début form à compte créé |
| Password Reset Time | < 2min | De la demande à nouveau login |
| Social Auth Time | < 15s | Du clic OAuth à dashboard |
| Error Recovery Time | < 10s | De l'erreur à correction réussie |

### Taux de Conversion Cibles

- **Login Success Rate**: > 95%
- **Register Completion**: > 70%
- **Password Reset Success**: > 85%
- **Social Auth Adoption**: > 40%
- **Email Verification**: > 60% (dans 24h)

---

**Dernière mise à jour**: 2025-11-23
**Version**: 1.1.0 (Intégration Better-auth)
**Références**: [01-personas.md](./01-personas.md) | [04-better-auth-integration.md](./04-better-auth-integration.md)

---

## Intégration Better-auth - Implémentation des Flows

### Flow Login - Implémentation Better-auth

**Code Client (React Component)**:
```typescript
import { authClient } from "@/lib/auth-client";

const handleLogin = async (email: string, password: string) => {
  await authClient.signIn.email({
    email,
    password,
    rememberMe: true,
    callbackURL: "/dashboard"
  });
};
```

**Code Serveur (Validation Session)**:
```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers()
});
```

**APIs Better-auth utilisées**:
- `authClient.signIn.email()` - Login email/password
- `auth.api.getSession()` - Validation côté serveur
- Gestion automatique: tokens, cookies sécurisés, CSRF protection

**Référence**: Voir [04-better-auth-integration.md](./04-better-auth-integration.md#login-emailpassword)

---

### Flow Register - Implémentation Better-auth

**Code Client (React Component)**:
```typescript
import { authClient } from "@/lib/auth-client";

const handleRegister = async (data: RegisterData) => {
  try {
    await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/dashboard?welcome=true"
    });
    // autoSignIn: true donc user déjà connecté
  } catch (error) {
    if (error.code === "EMAIL_ALREADY_EXISTS") {
      // Afficher message + lien vers login
    }
  }
};
```

**Configuration Serveur**:
```typescript
// lib/auth.ts
emailAndPassword: {
  enabled: true,
  minPasswordLength: 8,
  autoSignIn: true, // Login automatique après inscription
  requireEmailVerification: false // Optionnel, non bloquant
}
```

**APIs Better-auth utilisées**:
- `authClient.signUp.email()` - Inscription
- Validation automatique: email unique, password strength
- Gestion: création user + compte + session automatique

**Référence**: Voir [04-better-auth-integration.md](./04-better-auth-integration.md#register-emailpassword)

---

### Flow Mot de Passe Oublié - Implémentation Better-auth

**Code Client - Demande Reset**:
```typescript
import { authClient } from "@/lib/auth-client";

const handleForgotPassword = async (email: string) => {
  await authClient.forgetPassword({
    email,
    redirectTo: "/reset-password"
  });
  // Message générique affiché (sécurité)
};
```

**Code Client - Reset Password**:
```typescript
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const token = searchParams.get("token");

const handleResetPassword = async (newPassword: string) => {
  await authClient.resetPassword({
    token: token!,
    newPassword
  });
  // Rediriger vers /login avec succès
};
```

**Configuration Serveur**:
```typescript
// lib/auth.ts
emailAndPassword: {
  resetPasswordTokenExpiresIn: 900, // 15 minutes
  sendResetPassword: async ({ user, url, token }) => {
    // Envoyer email avec lien reset
    await sendPasswordResetEmail({
      to: user.email,
      resetUrl: url,
      userName: user.name
    });
  }
}
```

**APIs Better-auth utilisées**:
- `authClient.forgetPassword()` - Demande reset
- `authClient.resetPassword()` - Nouveau password
- Gestion automatique: génération token, expiration, validation

**Référence**: Voir [04-better-auth-integration.md](./04-better-auth-integration.md#mot-de-passe-oublié)

---

### Flow OAuth - Implémentation Better-auth

**Code Client - Google OAuth**:
```typescript
import { authClient } from "@/lib/auth-client";

const handleGoogleLogin = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard"
  });
  // Redirection automatique vers Google
  // Puis retour sur /api/auth/callback/google
};
```

**Configuration Serveur**:
```typescript
// lib/auth.ts
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    scope: ["email", "profile"]
  }
}
```

**Flow Automatique Better-auth**:
1. `authClient.signIn.social()` déclenche redirect
2. Utilisateur consent sur Google
3. Callback `/api/auth/callback/google` géré automatiquement
4. Better-auth crée/login user + session
5. Redirect vers `callbackURL`

**Gestion Conflit Email** (automatique):
- Si email existe: login + liaison compte OAuth
- Si email nouveau: création user + compte OAuth
- Tout géré par Better-auth

**Référence**: Voir [04-better-auth-integration.md](./04-better-auth-integration.md#oauth-google)

---

## Récapitulatif APIs Better-auth

### APIs Client Better-auth

| Méthode | Usage | Flow Concerné |
|---------|-------|---------------|
| `authClient.signIn.email()` | Login email/password | Login |
| `authClient.signIn.social()` | OAuth Google/GitHub | OAuth |
| `authClient.signUp.email()` | Inscription | Register |
| `authClient.forgetPassword()` | Demande reset | Password Reset |
| `authClient.resetPassword()` | Nouveau password | Password Reset |
| `authClient.signOut()` | Déconnexion | Tous |
| `useSession()` | Hook React session | Tous |

### APIs Serveur Better-auth

| Méthode | Usage | Contexte |
|---------|-------|----------|
| `auth.api.getSession()` | Valider session | Server Components |
| `auth.handler` | Routes API auth | `/api/auth/[...all]` |
| `getSessionCookie()` | Check cookie | Middleware |

### Avantages Better-auth pour les Flows

✅ **Sécurité** : Tokens, CSRF, rate limiting automatiques  
✅ **Performance** : Cookie cache, sessions optimisées  
✅ **Type-safety** : TypeScript natif sur client et serveur  
✅ **Maintenance** : Moins de code custom à maintenir  
✅ **Évolutivité** : Plugins pour 2FA, magic links, etc.

### Prochaines Étapes Implémentation

1. Configuration serveur (`lib/auth.ts`)
2. Configuration client (`lib/auth-client.ts`)
3. API Routes (`app/api/auth/[...all]/route.ts`)
4. Composants UI avec design system
5. Tests flows complets

**Référence complète** : [04-better-auth-integration.md](./04-better-auth-integration.md)

**Références**: Basé sur personas [01-personas.md](./01-personas.md)