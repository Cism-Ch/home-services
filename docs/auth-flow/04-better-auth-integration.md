# Intégration Better-auth - Guide Technique

## Vue d'Ensemble

Ce document décrit l'intégration de **Better-auth** comme solution d'authentification pour la plateforme de services à domicile. Better-auth est une librairie d'authentification framework-agnostic pour TypeScript qui offre une sécurité robuste, une flexibilité d'implémentation et un écosystème de plugins extensible.

### Pourquoi Better-auth ?

- **Sécurité out-of-the-box**: Gestion automatique des tokens, sessions sécurisées, protection CSRF
- **Framework-agnostic**: S'intègre parfaitement avec Next.js App Router
- **Réduction de complexité**: Évite la redondance de code pour OAuth, sessions, tokens
- **Écosystème de plugins**: 2FA, magic links, passkeys disponibles pour évolution future
- **TypeScript natif**: Type-safety complète sur client et serveur

---

## Configuration Serveur

### Installation des Dépendances

```bash
npm install better-auth @better-auth/prisma
npm install -D prisma @prisma/client
```

### Configuration Better-auth (`lib/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  // Base de données: Supabase PostgreSQL via Prisma
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),

  // Configuration email/password
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false, // Optionnel selon personas
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true, // Auto-login après inscription
    resetPasswordTokenExpiresIn: 900, // 15 minutes
    sendResetPassword: async ({ user, url, token }) => {
      // Fonction d'envoi email (à implémenter avec Resend/SendGrid)
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
        userName: user.name,
      });
    },
  },

  // Providers OAuth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ["email", "profile"],
    },
    // GitHub configuré pour Phase 2
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
  },

  // Configuration sessions
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // Update tous les jours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache 5 minutes
    },
  },

  // URLs de redirection
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Options avancées
  advanced: {
    generateId: () => {
      // Utiliser nanoid ou uuid pour IDs uniques
      return crypto.randomUUID();
    },
  },
});
```

### Schéma Prisma (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  accounts      Account[]
  
  // Champs métier spécifiques
  userType      String    @default("client") // "client" | "pro"
  phoneNumber   String?
  
  @@map("users")
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Account {
  id                String   @id @default(uuid())
  userId            String
  accountId         String
  providerId        String
  accessToken       String?
  refreshToken      String?
  idToken           String?
  expiresAt         DateTime?
  password          String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@map("accounts")
}

model Verification {
  id         String   @id @default(uuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, value])
  @@map("verifications")
}
```

### API Routes Next.js (`app/api/auth/[...all]/route.ts`)

```typescript
import { auth } from "@/lib/auth";

export const GET = auth.handler;
export const POST = auth.handler;
```

---

## Configuration Client

### Client Better-auth (`lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Options supplémentaires
  fetchOptions: {
    onError(error) {
      // Gestion globale des erreurs
      console.error("Auth error:", error);
    },
    onSuccess(response) {
      // Tracking succès (Analytics)
    },
  },
});

// Export des hooks pour utilisation dans composants
export { useSession } from "better-auth/client";
```

### Utilisation dans Composants React

#### Hook `useSession` - Accès Session

```typescript
"use client";

import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

export function UserProfile() {
  const { data: session, isPending, error } = useSession();

  if (isPending) {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return (
      <button onClick={() => authClient.signIn.social({ provider: "google" })}>
        Connexion avec Google
      </button>
    );
  }

  return (
    <div>
      <p>Bienvenue {session.user.name}</p>
      <button onClick={() => authClient.signOut()}>
        Déconnexion
      </button>
    </div>
  );
}
```

#### Login Email/Password

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await authClient.signIn.email({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        rememberMe: true,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      // Gestion erreur (toast notification)
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
```

#### Register Email/Password

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await authClient.signUp.email({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
        callbackURL: "/dashboard?welcome=true",
      });
      
      // Inscription réussie, autoSignIn active = déjà connecté
    } catch (error) {
      // Gestion erreur
      if (error.code === "EMAIL_ALREADY_EXISTS") {
        // Afficher message + lien vers login
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <input type="password" name="password" minLength={8} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
```

#### OAuth Google

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function SocialLogin() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <button onClick={handleGoogleLogin}>
      <GoogleIcon />
      Continuer avec Google
    </button>
  );
}
```

#### Mot de Passe Oublié

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await authClient.forgetPassword({
        email: formData.get("email") as string,
        redirectTo: "/reset-password",
      });
      
      // Afficher message succès (même si email n'existe pas - sécurité)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Formulaire */}</form>;
}
```

#### Reset Password

```typescript
"use client";

import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await authClient.resetPassword({
        token: token as string,
        newPassword: formData.get("password") as string,
      });
      
      // Rediriger vers login avec message succès
    } catch (error) {
      // Gérer token expiré/invalide
    }
  };

  return <form onSubmit={handleSubmit}>{/* Formulaire */}</form>;
}
```

---

## Server-Side Auth

### Validation Session (Server Component)

```typescript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Bienvenue {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### Validation Session (Server Action)

```typescript
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createBooking(data: BookingData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Logique création réservation
  const booking = await db.booking.create({
    data: {
      userId: session.user.id,
      ...data,
    },
  });

  return booking;
}
```

### Middleware Next.js (Protection Routes)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Redirection si déjà connecté
  if (sessionCookie && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protection routes dashboard
  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
```

---

## Personnalisation Design System

### Intégration avec Composants UI Existants

Better-auth ne fournit pas de composants UI. Vous devez utiliser vos composants existants du design system:

#### Bouton Login avec Design System

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export function StyledLoginForm() {
  return (
    <Card className="glow-brand">
      <form>
        <Input 
          type="email" 
          placeholder="email@exemple.com"
          className="focus-visible:ring-[hsl(29,86%,57%)]"
        />
        <Input 
          type="password" 
          placeholder="Mot de passe"
        />
        <Button 
          className="bg-gradient-to-r from-[hsl(27,96%,61%)] to-[hsl(31,97%,72%)]"
          type="submit"
        >
          Se connecter
        </Button>
      </form>
    </Card>
  );
}
```

### États de Chargement

```typescript
import { Loader2 } from "lucide-react";

{isLoading && (
  <Loader2 className="animate-spin h-4 w-4" />
)}
```

### Messages d'Erreur

Utiliser le système de toasts existant ou créer composants d'alerte personnalisés:

```typescript
import { Alert, AlertDescription } from "@/components/ui/alert";

{error && (
  <Alert variant="destructive">
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

---

## Gestion des Cas Limites

### Rate Limiting

Better-auth inclut du rate limiting natif, mais vous pouvez le personnaliser:

```typescript
export const auth = betterAuth({
  // ... config
  rateLimit: {
    enabled: true,
    window: 60, // 60 secondes
    max: 5, // 5 tentatives max
  },
});
```

### Email Déjà Existant

```typescript
try {
  await authClient.signUp.email({ ... });
} catch (error) {
  if (error.code === "EMAIL_ALREADY_EXISTS") {
    // Afficher message: "Compte existant. Se connecter?"
    // Lien vers /login avec email pré-rempli
  }
}
```

### Session Expirée

Better-auth refresh automatiquement les tokens. Pour gérer expiration:

```typescript
// Détection expiration dans composant
const { data: session, error } = useSession();

useEffect(() => {
  if (error?.code === "SESSION_EXPIRED") {
    // Afficher modal "Session expirée"
    // Proposer reconnexion rapide
  }
}, [error]);
```

### Conflit OAuth - Email Existant

```typescript
// Backend hook pour gérer liaison comptes
export const auth = betterAuth({
  // ... config
  hooks: {
    after: [
      {
        matcher: (context) => context.path === "/sign-in/social",
        handler: async (context) => {
          // Logique liaison compte si email existe
          const existingUser = await db.user.findUnique({
            where: { email: context.body.email },
          });
          
          if (existingUser && !existingUser.accounts.includes(context.provider)) {
            // Lier compte OAuth au compte existant
          }
        },
      },
    ],
  },
});
```

---

## Variables d'Environnement

```bash
# .env.local

# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend/SendGrid)
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="resend"
EMAIL_SERVER_PASSWORD="your-api-key"
EMAIL_FROM="noreply@votre-domaine.com"
```

---

## Migration & Déploiement

### Étapes de Migration

1. **Installation**: `npm install better-auth @better-auth/prisma`
2. **Configuration Prisma**: Copier schéma ci-dessus
3. **Migration DB**: `npx prisma migrate dev --name init-better-auth`
4. **Configuration serveur**: Créer `lib/auth.ts`
5. **Configuration client**: Créer `lib/auth-client.ts`
6. **API Routes**: Créer `app/api/auth/[...all]/route.ts`
7. **Mise à jour composants**: Remplacer logique auth custom par Better-auth
8. **Tests**: Valider tous les flows (login, register, OAuth, reset password)

### Checklist Pré-Production

- [ ] Variables d'environnement configurées
- [ ] Google OAuth credentials configurés
- [ ] HTTPS activé (requis pour OAuth)
- [ ] Emails transactionnels configurés
- [ ] Rate limiting testé
- [ ] Sessions sécurisées (httpOnly cookies)
- [ ] CSRF protection active
- [ ] Logs erreurs configurés (Sentry)
- [ ] Tests E2E auth passés

---

## Points d'Extension Future

### Phase 2 - Fonctionnalités Avancées

- **2FA/MFA**: Plugin `@better-auth/two-factor`
- **Magic Links**: Alternative passwordless
- **Passkeys**: WebAuthn pour auth biométrique
- **Email OTP**: Code à 6 chiffres
- **GitHub OAuth**: Ajouter provider

### Exemple Configuration 2FA (Future)

```typescript
import { twoFactor } from "@better-auth/two-factor";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      issuer: "Plateforme Services",
      otpOptions: {
        period: 30,
        digits: 6,
      },
    }),
  ],
});
```

---

## Ressources & Documentation

- **Better-auth Docs**: [https://www.better-auth.com](https://www.better-auth.com)
- **GitHub**: [https://github.com/better-auth/better-auth](https://github.com/better-auth/better-auth)
- **Next.js Integration**: [https://www.better-auth.com/docs/integrations/next](https://www.better-auth.com/docs/integrations/next)
- **Prisma Adapter**: [https://www.better-auth.com/docs/adapters/prisma](https://www.better-auth.com/docs/adapters/prisma)

---

## Support & Troubleshooting

### Problèmes Courants

**Erreur: "Session not found"**
- Vérifier que les cookies sont activés
- Vérifier CORS si API séparée
- Vérifier `baseURL` dans configuration client

**OAuth Redirect Error**
- Vérifier callback URL dans Google Console
- Format: `https://votre-domaine.com/api/auth/callback/google`

**Email Reset Password Non Reçu**
- Vérifier configuration SMTP
- Vérifier dossier spam
- Tester avec service email (Resend/SendGrid)

---

**Dernière mise à jour**: 2025-11-23  
**Version**: 1.0.0  
**Stack**: Better-auth + Next.js 16 + Prisma + Supabase PostgreSQL