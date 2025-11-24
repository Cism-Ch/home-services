# Edge Cases & Gestion d'Erreurs - Authentification

## Vue d'Ensemble

Documentation exhaustive des cas limites, scénarios d'erreur et stratégies de gestion pour les flows d'authentification. Garantit une expérience robuste et résiliente.

---

## Table des Matières

1. [Cas Limites Login](#cas-limites-login)
2. [Cas Limites Register](#cas-limites-register)
3. [Cas Limites Mot de Passe Oublié](#cas-limites-mot-de-passe-oublié)
4. [Cas Limites Auth Sociale](#cas-limites-auth-sociale)
5. [Erreurs Réseau & Performance](#erreurs-réseau--performance)
6. [Sécurité & Abus](#sécurité--abus)
7. [Gestion des Sessions](#gestion-des-sessions)
8. [Stratégies de Récupération](#stratégies-de-récupération)

---

## Cas Limites Login

### EC-L01: Credentials Incorrects

**Scénario**: Email ou mot de passe invalide

**Comportement Actuel Problématique**:
- Message générique peu informatif
- Pas d'indication du champ erroné
- Compteur de tentatives invisible

**Solution UX**:
```
[Après 3 tentatives échouées]
├─→ Message: "Email ou mot de passe incorrect"
├─→ Suggestion: "Avez-vous oublié votre mot de passe ?"
├─→ Link visible: "Réinitialiser mon mot de passe"
├─→ Compteur visible: "Tentative 3/5"
└─→ [Après 5 tentatives]
    ├─→ Bloquer pendant 15 minutes
    ├─→ Message: "Trop de tentatives. Réessayez dans 15 minutes"
    ├─→ Timer countdown visible
    └─→ Option: "Réinitialiser le mot de passe maintenant"
```

**Persona Impact**:
- **Sophie**: Frustration minimisée par suggestion proactive
- **Jean**: Rassuré par explication claire et option d'aide
- **Malik**: Peut résoudre rapidement via reset

---

### EC-L02: Compte Non Vérifié (Email)

**Scénario**: User tente de se connecter, email pas encore vérifié

**Option A - Bloquant** (Non recommandé pour MVP):
```
[Login avec email non vérifié]
    ↓
[Erreur: "Email non vérifié"]
├─→ Message: "Veuillez vérifier votre email avant de vous connecter"
├─→ Bouton: "Renvoyer l'email de vérification"
└─→ Empêcher login
```

**Option B - Non Bloquant** (Recommandé):
```
[Login avec email non vérifié]
    ↓
[Login réussi]
    ↓
[Bannière dashboard]
├─→ Type: Warning (orange, dismissible)
├─→ Message: "Vérifiez votre email pour accéder à toutes les fonctionnalités"
├─→ CTA: "Renvoyer l'email"
└─→ Fermeture: Persiste jusqu'à vérification
```

**Justification Option B**:
- Friction réduite (Sophie)
- Accès immédiat aux services de base
- Conversion meilleure (pas de blocage)

---

### EC-L03: Compte Suspendu/Désactivé

**Scénario**: Compte banni ou désactivé par modération

**Solution UX**:
```
[Tentative login compte suspendu]
    ↓
[Erreur 403]
├─→ Message principal: "Votre compte a été temporairement suspendu"
├─→ Raison (si applicable): "Activité suspecte détectée"
├─→ Durée: "Jusqu'au [DATE]" ou "Permanent"
├─→ Actions:
│   ├─→ Lien: "Contacter le support"
│   ├─→ Email direct: support@plateforme.fr
│   └─→ Référence ticket: #XXXXX
└─→ Pas de bouton login (inutile)
```

---

### EC-L04: Session Expirée Pendant Utilisation

**Scénario**: User actif, token expire silencieusement

**Solution UX**:
```
[Détection token expiré sur requête API]
    ↓
[Modal non-intrusif]
├─→ Titre: "Session expirée"
├─→ Message: "Pour votre sécurité, reconnectez-vous"
├─→ Formulaire inline:
│   ├─→ Email (pré-rempli, disabled)
│   └─→ Mot de passe (focus auto)
├─→ Checkbox: "Se souvenir de moi" (coché par défaut)
├─→ Bouton: "Se reconnecter"
└─→ [Après succès]
    ├─→ Fermer modal
    ├─→ Reprendre action interrompue
    └─→ Toast: "Vous êtes de nouveau connecté"
```

**Prévention**:
- Refresh token automatique 5 min avant expiration
- Warning 2 min avant expiration si user actif
- Option "Rester connecté" pour sessions longues

---

### EC-L05: Multiple Sessions Actives

**Scénario**: User connecté sur plusieurs appareils

**Comportement**:
```
[Nouveau login détecté]
    ↓
[Options de sécurité]

Option A - Permissif (Recommandé):
├─→ Autoriser sessions multiples
├─→ Afficher dans Settings:
│   "Vos sessions actives"
│   ├─→ iPhone (Paris) - Actif maintenant
│   ├─→ MacBook (Paris) - Il y a 2h
│   └─→ Bouton "Déconnecter toutes les autres sessions"

Option B - Restrictif:
├─→ Modal: "Déjà connecté sur un autre appareil"
├─→ Choix:
│   ├─→ "Déconnecter l'autre session" (login ici)
│   └─→ "Annuler" (rester sur ancienne session)
```

---

### EC-L06: Capitalisation Email

**Scénario**: User entre `Jean.Dupont@Gmail.COM` mais inscrit avec `jean.dupont@gmail.com`

**Solution**:
```
[Normalisation automatique]
├─→ Backend: Convertir email en lowercase
├─→ Comparaison case-insensitive
└─→ Login réussi sans erreur

[Frontend]
└─→ Suggestion auto-lowercase dans placeholder
    "exemple@email.com" (tout minuscule)
```

---

### EC-L07: Espaces dans Email/Password

**Scénario**: User copie-colle avec espaces accidentels

**Solution**:
```
[Détection espaces]
├─→ Frontend: trim() automatique
├─→ Si espaces détectés après trim:
│   └─→ Warning subtil: "Espaces supprimés"
└─→ Continuer normalement
```

---

### EC-L08: Autofill Incorrect

**Scénario**: Navigateur autofill mauvais mot de passe

**Solution**:
```
[Après erreur login]
├─→ Vérifier si autofill utilisé (attribut autocomplete)
├─→ Si oui, ajouter au message d'erreur:
│   "Si votre mot de passe a été rempli automatiquement,
│    vérifiez qu'il est correct"
└─→ Bouton: "Effacer et ressaisir manuellement"
```

---

## Cas Limites Register

### EC-R01: Email Déjà Utilisé

**Scénario**: User essaie de s'inscrire avec email existant

**Solution UX**:
```
[Validation email (debounced)]
    ↓
[Email existe déjà]
├─→ Erreur inline temps réel
├─→ Message: "Cet email est déjà utilisé"
├─→ Suggestion: "Vous avez déjà un compte ?"
├─→ Lien: "Se connecter" (redirect /login avec email pré-rempli)
└─→ Lien secondaire: "Mot de passe oublié ?"
```

**Sécurité**:
- Ne pas révéler si email existe (timing attack)
- Réponse identique que email existe ou non (délai artificiel)

---

### EC-R02: Mot de Passe Trop Faible

**Scénario**: User choisit "123456" ou "password"

**Solution UX**:
```
[Validation temps réel]
├─→ Indicateur force: Rouge "Trop faible"
├─→ Liste critères non remplis:
│   ✗ Minimum 8 caractères
│   ✗ Au moins 1 majuscule
│   ✗ Au moins 1 chiffre
│   ✗ Éviter mots communs
├─→ Suggestions:
│   "Essayez d'ajouter des chiffres et symboles"
└─→ Bloquer soumission si score < 2/5
```

**Liste noire mots de passe**:
- password, 123456, qwerty, azerty, admin
- Prenom, nom de la plateforme
- Dates communes (19XX, 20XX)

---

### EC-R03: Mots de Passe Ne Correspondent Pas

**Scénario**: Erreur de saisie dans confirmation

**Solution UX**:
```
[Validation temps réel sur blur]
├─→ Comparaison après 500ms typing pause
├─→ Si différent:
│   ├─→ Erreur inline: "Les mots de passe ne correspondent pas"
│   ├─→ Icône rouge sur les deux champs
│   └─→ Focus guidé vers champ "Confirmer"
└─→ Si identique:
    └─→ Checkmark vert sur champ confirmation
```

---

### EC-R04: Nom Invalide (Un seul mot)

**Scénario**: User entre seulement "Jean" sans nom de famille

**Solution UX**:
```
[Validation nom complet]
├─→ Si < 2 mots:
│   ├─→ Warning (pas bloquant): "Entrez votre nom complet"
│   ├─→ Exemple: "Ex: Jean Dupont"
│   └─→ Autoriser soumission quand même (edge case: nom unique)
└─→ Si caractères spéciaux bizarres:
    └─→ Accepter lettres accentuées, tirets, apostrophes
        "Marie-José O'Connor" ✓
```

---

### EC-R05: Email Temporaire/Jetable

**Scénario**: User utilise service email jetable (10minutemail.com)

**Solution**:
```
[Détection domaine jetable]
├─→ Base données domaines jetables (API)
├─→ Si détecté:
│   ├─→ Warning: "Les emails temporaires ne sont pas acceptés"
│   ├─→ Raison: "Pour votre sécurité et la qualité du service"
│   └─→ Bloquer inscription
└─→ Exception: Autoriser si user contacte support
```

**Liste domaines à bloquer**:
- 10minutemail.com, guerrillamail.com, temp-mail.org
- Maintenir liste à jour via API externe

---

### EC-R06: Age < 18 ans (Si applicable)

**Scénario**: Champ date de naissance optionnel, user mineur

**Solution**:
```
[Validation date de naissance]
├─→ Si age < 18:
│   ├─→ Message: "Vous devez avoir au moins 18 ans"
│   ├─→ Option: "Inscription avec consentement parental"
│   └─→ Formulaire additionnel: email parent/tuteur
└─→ Si pas de date fournie:
    └─→ Accepter avec disclaimer legal
```

---

### EC-R07: Caractères Spéciaux dans Nom

**Scénario**: Nom avec emojis ou caractères non-latins

**Solution**:
```
[Validation caractères]
├─→ Autoriser: Lettres (toutes langues), espaces, tirets, apostrophes
├─→ Exemples valides:
│   ✓ François-José
│   ✓ O'Brien
│   ✓ 王小明 (caractères chinois)
│   ✓ Müller (umlauts)
├─→ Bloquer: Emojis, chiffres, symboles bizarres
│   ✗ Jean😀
│   ✗ John123
└─→ Message si rejet: "Le nom contient des caractères non autorisés"
```

---

### EC-R08: Connexion Perdue Pendant Inscription

**Scénario**: Network error au milieu du formulaire

**Solution UX**:
```
[Détection perte connexion]
├─→ Sauvegarder brouillon dans localStorage
├─→ Banner offline: "Connexion perdue"
├─→ Bouton: "Réessayer"
└─→ [Retour online]
    ├─→ Récupérer données sauvegardées
    ├─→ Toast: "Données récupérées"
    └─→ Permettre soumission
```

---

## Cas Limites Mot de Passe Oublié

### EC-F01: Email Inexistant

**Scénario**: User demande reset pour email non enregistré

**Solution UX** (Sécurité vs UX):
```
[Option A - Sécurisée] (Recommandé):
├─→ Message générique identique:
│   "Si un compte existe avec cet email, vous recevrez un lien"
├─→ Ne révèle pas si email existe (sécurité)
└─→ Backend: Ne rien envoyer si email inexistant

[Option B - UX friendly]:
├─→ Message clair: "Aucun compte avec cet email"
├─→ Suggestion: "Créer un compte ?"
└─→ Risque: Révèle existence comptes (énumération)
```

**Recommandation**: Option A pour sécurité

---

### EC-F02: Multiples Demandes Reset

**Scénario**: User clique 10x "Envoyer" sans attendre

**Solution**:
```
[Rate limiting]
├─→ Max 1 email / 5 minutes par adresse
├─→ Après 1ère demande:
│   ├─→ Désactiver bouton
│   ├─→ Timer countdown: "Nouveau lien disponible dans 4:32"
│   └─→ Message: "Email déjà envoyé. Vérifiez vos spams"
└─→ [Après 3 demandes / 1h]
    └─→ Bloquer temporairement (protection)
```

---

### EC-F03: Lien Reset Expiré

**Scénario**: User clique lien après 16 minutes (expiration 15min)

**Solution UX**:
```
[Page /reset-password?token=EXPIRED]
├─→ Détection token expiré
├─→ Message clair:
│   "Ce lien a expiré"
│   "Les liens de réinitialisation sont valables 15 minutes"
├─→ Formulaire inline:
│   "Entrez votre email pour recevoir un nouveau lien"
│   [Email input] [Bouton: Renvoyer]
└─→ Pas de retour à /forgot-password (économise 1 clic)
```

---

### EC-F04: Lien Déjà Utilisé

**Scénario**: User clique 2x sur même lien reset

**Solution**:
```
[Token déjà marqué "used"]
├─→ Message: "Ce lien a déjà été utilisé"
├─→ Options:
│   ├─→ Si changement récent (< 10min):
│   │   "Votre mot de passe a été modifié il y a X minutes"
│   │   Bouton: "Se connecter"
│   └─→ Si besoin nouveau reset:
│       "Demander un nouveau lien"
│       [Email input pré-rempli] [Bouton]
```

---

### EC-F05: Reset Pendant Session Active

**Scénario**: User connecté, fait reset password via email

**Solution**:
```
[Reset réussi pendant session active]
├─→ Invalider token session actuel
├─→ Déconnecter toutes sessions
├─→ Rediriger vers /login
├─→ Message: "Mot de passe modifié. Reconnectez-vous"
└─→ Email notification: "Password modifié depuis [APPAREIL/IP]"
```

---

## Cas Limites Auth Sociale

### EC-S01: Email OAuth Déjà Utilisé (Autre Méthode)

**Scénario**: User inscrit avec email/password, essaie login Google avec même email

**Solution UX**:
```
[Détection conflit]
├─→ Modal: "Un compte existe déjà avec cet email"
├─→ Options:
│   ├─→ Option 1: "Lier les comptes"
│   │   ├─→ Demander password actuel (sécurité)
│   │   └─→ Après validation: associer OAuth au compte
│   │
│   └─→ Option 2: "Se connecter avec mot de passe"
│       └─→ Redirect /login avec email pré-rempli
└─→ Après liaison: Login direct via OAuth à l'avenir
```

---

### EC-S02: Échec Récupération Profil OAuth

**Scénario**: OAuth réussit, mais API profile échoue

**Solution**:
```
[OAuth callback success, profile API fail]
├─→ Retry automatique 3x (exponential backoff)
├─→ Si toujours fail:
│   ├─→ Créer compte avec email minimal
│   ├─→ Demander nom manuellement:
│   │   Modal: "Complétez votre profil"
│   │   [Nom complet input]
│   └─→ Avatar placeholder générique
└─→ Log erreur pour debug (Sentry)
```

---

### EC-S03: User Refuse Permissions OAuth

**Scénario**: User annule sur page consent Google

**Solution UX**:
```
[Retour callback sans code]
├─→ Détecter annulation (error=access_denied)
├─→ Message non-culpabilisant:
│   "Connexion annulée"
│   "Vous pouvez réessayer ou vous connecter par email"
├─→ Options:
│   ├─→ "Réessayer avec Google"
│   └─→ "Se connecter par email/mot de passe"
└─→ Pas d'erreur rouge (pas une erreur user)
```

---

### EC-S04: Email OAuth Non Vérifié

**Scénario**: Certain providers retournent email_verified=false

**Solution**:
```
[OAuth profile avec email_verified=false]
├─→ Option A - Rejeter:
│   "Veuillez vérifier votre email chez [Provider] d'abord"
│
├─→ Option B - Accepter avec flag:
│   ├─→ Créer compte quand même
│   ├─→ Marquer email_verified=false
│   └─→ Envoyer email verification propre
│
└─→ Recommandation: Option B (meilleure UX)
```

---

### EC-S05: Popup OAuth Bloqué

**Scénario**: Popup blocker empêche fenêtre OAuth

**Solution UX**:
```
[Détection popup bloqué]
├─→ Fallback automatique: Redirect pleine page
├─→ OU Message:
│   "Popup bloqué par votre navigateur"
│   "Autorisez les popups ou"
│   Bouton: "Utiliser redirection complète"
└─→ Sauvegarder état avant redirect (pour retour)
```

---

## Erreurs Réseau & Performance

### EC-N01: Timeout Requête API

**Scénario**: Requête login prend > 30 secondes

**Solution UX**:
```
[Timeout après 30s]
├─→ Annuler requête
├─→ Message: "La connexion prend trop de temps"
├─→ Diagnostic:
│   "Vérifiez votre connexion internet"
├─→ Options:
│   ├─→ "Réessayer"
│   └─→ "Aide à la connexion"
└─→ Backend: Logger timeout (monitoring)
```

---

### EC-N02: Erreur 500 Serveur

**Scénario**: Backend crash pendant auth

**Solution UX**:
```
[Erreur 500]
├─→ Message user-friendly:
│   "Oups ! Une erreur s'est produite"
│   "Nous travaillons à la résoudre"
├─→ Pas de détails techniques (sécurité)
├─→ Options:
│   ├─→ "Réessayer" (retry automatique 3x)
│   └─→ "Contacter le support" (si persiste)
├─→ Référence erreur: #ERR-XXXXX (pour support)
└─→ Backend: Alert Sentry/monitoring
```

---

### EC-N03: Connexion Intermittente

**Scénario**: WiFi instable pendant formulaire

**Solution**:
```
[Détection online/offline]
├─→ Event listener: window.addEventListener('offline')
├─→ Banner sticky: "Connexion perdue - Mode hors ligne"
├─→ Désactiver formulaires (éviter erreurs)
├─→ [Retour online]
│   ├─→ Banner: "Connexion rétablie"
│   ├─→ Auto-retry dernière action
│   └─→ Récupérer données localStorage
```

---

## Sécurité & Abus

### EC-SEC01: Détection Bot/Scraping

**Scénario**: Tentatives automatisées massives

**Solution**:
```
[Détection pattern suspect]
├─→ Triggers:
│   • > 10 tentatives / minute même IP
│   • User-agent suspect
│   • Pas d'interaction JavaScript
├─→ Réponse:
│   ├─→ Afficher reCAPTCHA invisible
│   ├─→ Si fail: reCAPTCHA v2 (checkbox)
│   └─→ Rate limit agressif
└─→ Backend: IP ban temporaire + log
```

---

### EC-SEC02: Credential Stuffing

**Scénario**: Attaquant teste listes email:password volées

**Solution**:
```
[Détection pattern]
├─→ Indicateurs:
│   • Même IP, multiples emails différents
│   • Échecs rapides successifs
│   • User-agents variés (spoofing)
├─→ Mitigation:
│   ├─→ Captcha après 3 échecs
│   ├─→ Delay progressif (1s, 2s, 4s...)
│   ├─→ Alert équipe sécurité
│   └─→ Notification users concernés (si réussi)
```

---

### EC-SEC03: SQL Injection Attempt

**Scénario**: Input malveillant: `' OR '1'='1`

**Solution**:
```
[Protection multi-couches]
├─→ Frontend: Sanitization basique
├─→ Backend: Prepared statements (obligatoire)
├─→ Si pattern détecté:
│   ├─→ Rejeter silencieusement
│   ├─→ Log + Alert sécurité
│   └─→ Pas de message user (révèlerait détection)
└─→ Réponse générique: "Données invalides"
```

---

## Gestion des Sessions

### EC-SESS01: Token Refresh Échoue

**Scénario**: Refresh token expiré/invalide

**Solution**:
```
[Échec refresh automatique]
├─→ Déconnecter user proprement
├─→ Clear storage (tokens, user data)
├─→ Toast non-intrusif:
│   "Votre session a expiré"
│   "Reconnectez-vous pour continuer"
├─→ Redirect /login avec query params:
│   ?redirect=[PAGE_ACTUELLE]&session_expired=true
└─→ Après nouveau login: retour page origine
```

---

### EC-SESS02: Concurrent Logins Différents Users

**Scénario**: User A connecté, User B login même navigateur

**Solution**:
```
[Détection nouveau login]
├─→ Déconnecter User A proprement
├─→ Clear storage User A
├─→ Login User B
└─→ Warning User B:
    "Précédente session déconnectée"
```

---

## Stratégies de Récupération

### Principes Généraux

1. **Fail Gracefully**: Jamais de page blanche
2. **Messages Clairs**: Pas de jargon technique
3. **Actions Proposées**: Toujours donner un chemin forward
4. **Logs Silencieux**: Erreurs loggées sans alarmer user
5. **Retry Logic**: Automatique avec backoff

### Template Message d'Erreur

```typescript
interface ErrorMessage {
  title: string         // Court, non-technique
  description: string   // Explique ce qui s'est passé
  cause?: string       // Cause probable (optionnel)
  actions: Action[]    // 1-3 actions possibles
  supportLink?: string // Lien aide/support
  errorCode?: string   // Pour support uniquement
}

// Exemple
{
  title: "Connexion impossible",
  description: "Nous n'avons pas pu vous connecter",
  cause: "Vérifiez votre email et mot de passe",
  actions: [
    { label: "Réessayer", type: "primary" },
    { label: "Mot de passe oublié ?", type: "secondary" }
  ],
  supportLink: "/help/login-issues",
  errorCode: "AUTH_001"
}
```

---

## Matrice de Priorisation

### Criticité des Edge Cases

| Edge Case | Fréquence | Impact User | Impact Business | Priorité | Phase |
|-----------|-----------|-------------|-----------------|----------|-------|
| EC-L01: Credentials incorrects | Haute | Moyen | Faible | P0 | MVP |
| EC-R01: Email déjà utilisé | Haute | Élevé | Moyen | P0 | MVP |
| EC-F03: Lien reset expiré | Moyenne | Moyen | Faible | P0 | MVP |
| EC-S01: Email OAuth conflit | Moyenne | Élevé | Moyen | P1 | Phase 2 |
| EC-N01: Timeout API | Faible | Élevé | Moyen | P1 | Phase 2 |
| EC-SEC01: Détection bot | Faible | Faible | Élevé | P1 | Phase 2 |
| EC-L08: Autofill incorrect | Faible | Moyen | Faible | P2 | Backlog |
| EC-R06: Age mineur | Très faible | Moyen | Faible | P3 | Future |

---

## Checklist Implémentation

### Phase MVP (P0)
- [ ] Gestion credentials incorrects avec rate limiting
- [ ] Détection email déjà utilisé
- [ ] Validation mot de passe faible
- [ ] Gestion liens reset expirés
- [ ] Messages d'erreur clairs et actionnables
- [ ] Retry automatique erreurs réseau
- [ ] Gestion session expirée
- [ ] Normalisation email (lowercase, trim)

### Phase 2 (P1)
- [ ] Liaison comptes OAuth/email
- [ ] Gestion multiples sessions
- [ ] Captcha anti-bot
- [ ] Détection emails jetables
- [ ] Offline mode avec localStorage
- [ ] Monitoring erreurs (Sentry)

### Phase 3 (P2+)
- [ ] Détection credential stuffing
- [ ] Analytics abandons formulaire
- [ ] A/B testing messages d'erreur
- [ ] Support multi-langues erreurs

---

**Dernière mise à jour**: 2025-11-23
**Version**: 1.0.0
**Références**: [User Flows](./02-user-flows.md) | [Personas](./01-personas.md)

---

## Gestion Better-auth des Cas Limites

### Comment Better-auth Simplifie la Gestion d'Erreurs

Better-auth fournit des mécanismes intégrés pour gérer la plupart des cas limites identifiés, réduisant significativement le code custom nécessaire.

---

### Cas Limites Login avec Better-auth

#### EC-L01: Credentials Incorrects - Géré par Better-auth

**Gestion automatique** :
```typescript
// Better-auth gère automatiquement:
// - Validation des credentials
// - Rate limiting (5 tentatives / 15 min par défaut)
// - Messages d'erreur standardisés

try {
  await authClient.signIn.email({ email, password });
} catch (error) {
  // Better-auth retourne des codes d'erreur structurés
  if (error.code === "INVALID_CREDENTIALS") {
    // Afficher message: "Email ou mot de passe incorrect"
    // Better-auth track automatiquement les tentatives
  }
}
```

**Configuration rate limiting** :
```typescript
// lib/auth.ts
export const auth = betterAuth({
  rateLimit: {
    enabled: true,
    window: 60, // 60 secondes
    max: 5, // 5 tentatives max
  }
});
```

**Référence**: [04-better-auth-integration.md](./04-better-auth-integration.md#rate-limiting)

---

#### EC-L02: Email Non Vérifié - Configuration Flexible

**Option Non-Bloquante (Recommandée)** :
```typescript
// lib/auth.ts
emailAndPassword: {
  requireEmailVerification: false, // Permet login sans vérification
}

// Frontend: Afficher bannière si non vérifié
const { data: session } = useSession();

if (session && !session.user.emailVerified) {
  // Afficher warning banner avec CTA "Vérifier email"
}
```

**Option Bloquante** :
```typescript
emailAndPassword: {
  requireEmailVerification: true, // Bloque login
}
// Better-auth rejette automatiquement avec erreur appropriée
```

---

#### EC-L04: Session Expirée - Refresh Automatique

**Better-auth gère automatiquement** :
```typescript
// Configuration
session: {
  expiresIn: 60 * 60 * 24 * 7, // 7 jours
  updateAge: 60 * 60 * 24, // Refresh quotidien auto
}

// Le client Better-auth refresh automatiquement les tokens
// Pas de code custom nécessaire
```

**Détection expiration côté client** :
```typescript
const { data: session, error } = useSession();

useEffect(() => {
  if (error?.code === "SESSION_EXPIRED") {
    // Afficher modal reconnexion
    // ou redirect /login
  }
}, [error]);
```

---

### Cas Limites Register avec Better-auth

#### EC-R01: Email Déjà Utilisé - Erreur Structurée

**Better-auth détecte automatiquement** :
```typescript
try {
  await authClient.signUp.email({
    email, password, name
  });
} catch (error) {
  if (error.code === "EMAIL_ALREADY_EXISTS") {
    // Afficher: "Cet email est déjà utilisé"
    // + Lien: "Se connecter?"
  }
}
```

**Validation temps réel (optionnelle)** :
```typescript
// Vérifier disponibilité email avant soumission
const checkEmailAvailability = async (email: string) => {
  // Utiliser endpoint custom ou attendre erreur signup
};
```

---

#### EC-R02: Mot de Passe Trop Faible - Validation Intégrée

**Configuration** :
```typescript
// lib/auth.ts
emailAndPassword: {
  minPasswordLength: 8,
  maxPasswordLength: 128,
}
```

**Better-auth valide automatiquement**. Pour validation avancée côté client :
```typescript
import { z } from "zod";

const passwordSchema = z.string()
  .min(8, "Minimum 8 caractères")
  .regex(/[A-Z]/, "Au moins 1 majuscule")
  .regex(/[0-9]/, "Au moins 1 chiffre")
  .regex(/[^A-Za-z0-9]/, "Au moins 1 caractère spécial");
```

---

#### EC-R05: Email Temporaire - Protection Custom

**Hook Better-auth pour bloquer emails jetables** :
```typescript
// lib/auth.ts
import { isDisposableEmail } from "disposable-email-checker";

export const auth = betterAuth({
  hooks: {
    before: [
      {
        matcher: (context) => context.path === "/sign-up/email",
        handler: async (context) => {
          const { email } = context.body;
          
          if (await isDisposableEmail(email)) {
            throw new Error("EMAIL_DISPOSABLE", {
              message: "Les emails temporaires ne sont pas acceptés"
            });
          }
        }
      }
    ]
  }
});
```

---

### Cas Limites Mot de Passe Oublié avec Better-auth

#### EC-F01: Email Inexistant - Réponse Sécurisée

**Better-auth gère la sécurité automatiquement** :
```typescript
await authClient.forgetPassword({ email });
// Toujours retourne succès (même si email n'existe pas)
// Message générique: "Si un compte existe, email envoyé"
```

**Backend** :
```typescript
// lib/auth.ts
emailAndPassword: {
  sendResetPassword: async ({ user, url }) => {
    // Appelé SEULEMENT si user existe
    await sendEmail({
      to: user.email,
      subject: "Réinitialisation mot de passe",
      html: `<a href="${url}">Réinitialiser</a>`
    });
  }
}
```

---

#### EC-F02: Multiples Demandes Reset - Rate Limiting Natif

**Better-auth limite automatiquement** :
```typescript
// Configuration
rateLimit: {
  enabled: true,
  window: 60,
  max: 3, // 3 demandes max / minute
}

// Si limite atteinte, Better-auth retourne erreur
try {
  await authClient.forgetPassword({ email });
} catch (error) {
  if (error.code === "RATE_LIMIT_EXCEEDED") {
    // Afficher: "Trop de tentatives. Réessayez dans X minutes"
  }
}
```

---

#### EC-F03: Lien Reset Expiré - Validation Automatique

**Better-auth valide les tokens** :
```typescript
// Configuration expiration
emailAndPassword: {
  resetPasswordTokenExpiresIn: 900, // 15 minutes
}

// Frontend
try {
  await authClient.resetPassword({ token, newPassword });
} catch (error) {
  if (error.code === "TOKEN_EXPIRED") {
    // Afficher: "Lien expiré" + formulaire renvoyer
  }
  if (error.code === "TOKEN_INVALID") {
    // Afficher: "Lien invalide"
  }
}
```

---

### Cas Limites OAuth avec Better-auth

#### EC-S01: Email OAuth Déjà Utilisé - Liaison Automatique

**Better-auth gère intelligemment** :

**Scénario 1: Même email, provider différent**
```typescript
// User inscrit avec email/password
// Essaye login Google avec même email
// Better-auth:
// 1. Détecte email existe
// 2. Crée lien OAuth automatiquement
// 3. Login user
// 4. Désormais peut login avec email/pass OU Google
```

**Scénario 2: Forcer validation password**
```typescript
// Hook custom pour sécurité renforcée
export const auth = betterAuth({
  hooks: {
    before: [
      {
        matcher: (context) => context.path === "/sign-in/social",
        handler: async (context) => {
          const existingUser = await findUserByEmail(context.email);
          
          if (existingUser && !existingUser.oauthLinked) {
            // Demander confirmation password avant liaison
            throw new Error("LINK_ACCOUNT_REQUIRED");
          }
        }
      }
    ]
  }
});
```

---

#### EC-S03: User Refuse Permissions OAuth - Gestion Callback

**Better-auth détecte annulation** :
```typescript
// Le callback OAuth retourne erreur si annulé
// Gérer côté client:

const handleGoogleLogin = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard"
    });
  } catch (error) {
    if (error.code === "OAUTH_CANCELLED") {
      // Message: "Connexion annulée"
      // Proposer alternatives
    }
  }
};
```

---

### Erreurs Réseau avec Better-auth

#### EC-N01: Timeout Requête - Retry Automatique

**Better-auth configuration** :
```typescript
// lib/auth-client.ts
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  fetchOptions: {
    onError: async (context) => {
      if (context.error.code === "NETWORK_ERROR") {
        // Retry automatique avec backoff
        await new Promise(r => setTimeout(r, 1000));
        return context.retry();
      }
    },
    timeout: 30000, // 30 secondes
  }
});
```

---

#### EC-N02: Erreur 500 Serveur - Gestion Gracieuse

**Logging et monitoring** :
```typescript
// lib/auth-client.ts
fetchOptions: {
  onError: (context) => {
    // Log vers Sentry/monitoring
    if (context.response?.status === 500) {
      logError({
        type: "AUTH_SERVER_ERROR",
        path: context.request.url,
        error: context.error
      });
    }
    
    // Afficher message user-friendly
    showToast({
      title: "Erreur serveur",
      description: "Réessayez dans quelques instants",
      variant: "destructive"
    });
  }
}
```

---

### Sécurité & Abus

#### EC-SEC01: Détection Bot - Rate Limiting Natif

**Better-auth inclut protection** :
```typescript
rateLimit: {
  enabled: true,
  window: 60,
  max: 5,
  // Bloque automatiquement IPs suspectes
}
```

**Protection avancée (optionnelle)** :
```typescript
// Ajouter Cloudflare Turnstile ou reCAPTCHA
import { turnstile } from "@better-auth/turnstile";

export const auth = betterAuth({
  plugins: [
    turnstile({
      siteKey: process.env.TURNSTILE_SITE_KEY!,
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
    })
  ]
});
```

---

#### EC-SEC02: Credential Stuffing - Détection Patterns

**Monitoring avec Better-auth hooks** :
```typescript
export const auth = betterAuth({
  hooks: {
    after: [
      {
        matcher: (context) => context.path === "/sign-in/email",
        handler: async (context) => {
          if (!context.returned.success) {
            // Track échecs par IP
            await trackFailedLogin({
              ip: context.request.ip,
              email: context.body.email,
              timestamp: Date.now()
            });
            
            // Alert si pattern suspect détecté
            const recentFailures = await getRecentFailures(context.request.ip);
            if (recentFailures > 10) {
              await alertSecurityTeam({
                ip: context.request.ip,
                type: "POTENTIAL_CREDENTIAL_STUFFING"
              });
            }
          }
        }
      }
    ]
  }
});
```

---

## Récapitulatif Better-auth pour Edge Cases

### ✅ Gérés Automatiquement par Better-auth

| Edge Case | Gestion Better-auth | Configuration Requise |
|-----------|---------------------|----------------------|
| Credentials incorrects | Rate limiting natif | `rateLimit` config |
| Email déjà utilisé | Erreur `EMAIL_ALREADY_EXISTS` | Aucune |
| Password faible | Validation `minPasswordLength` | `emailAndPassword` config |
| Token expiré | Validation auto + erreur | `resetPasswordTokenExpiresIn` |
| Session expirée | Refresh automatique | `session.updateAge` |
| OAuth annulé | Erreur callback | Aucune |
| Rate limiting | Protection native | `rateLimit` config |

### 🔧 Nécessitent Configuration Custom

| Edge Case | Solution | Implémentation |
|-----------|----------|----------------|
| Email temporaire | Hook validation | `hooks.before` |
| Liaison compte OAuth | Hook confirmation | `hooks.before` |
| 2FA (Phase 2) | Plugin | `@better-auth/two-factor` |
| Captcha anti-bot | Plugin | `@better-auth/turnstile` |
| Credential stuffing | Monitoring hooks | `hooks.after` |

### 📚 Documentation Complète

Pour implémentation détaillée de chaque cas limite avec Better-auth, consulter :
- **Configuration**: [04-better-auth-integration.md](./04-better-auth-integration.md)
- **Hooks système**: [Better-auth Hooks Docs](https://www.better-auth.com/docs/concepts/hooks)
- **Rate Limiting**: [Better-auth Security](https://www.better-auth.com/docs/concepts/security)

---

**Dernière mise à jour**: 2025-11-23  
**Version**: 1.1.0 (Intégration Better-auth)  
**Références**: [User Flows](./02-user-flows.md) | [Personas](./01-personas.md) | [Intégration](./04-better-auth-integration.md)
**Références**: [User Flows](./02-user-flows.md) | [Personas](./01-personas.md)