/**
 * Configuration Better-auth - Serveur
 * 
 * Ce fichier configure l'authentification côté serveur avec:
 * - Base de données PostgreSQL via Prisma (Supabase)
 * - Email/Password avec reset password
 * - OAuth Google
 * - Sessions sécurisées (7 jours)
 * - Rate limiting
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// Interface pour les données de l'email de reset password
interface ResetPasswordEmailData {
  to: string;
  resetUrl: string;
  userName: string;
}

/**
 * Fonction d'envoi d'email pour reset password
 * À implémenter avec un service email (Resend, SendGrid, etc.)
 */
async function sendPasswordResetEmail(data: ResetPasswordEmailData): Promise<void> {
  // En environnement de développement, journaliser sans exposer le token sensible en clair
  if (process.env.NODE_ENV !== "production") {
    console.log("Email de reinitialisation pret pour:", data.to);
  }
  
  // En production, integrer avec le service d'emailing (Resend via QStash)
  // await resend.emails.send({
  //   from: process.env.EMAIL_FROM!,
  //   to: data.to,
  //   subject: "Reinitialisation de votre mot de passe",
  //   html: `<p>Bonjour ${data.userName},</p>...`
  // });
}

/**
 * Configuration Better-auth
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  // Base de données: Supabase PostgreSQL via Prisma
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),

  // Configuration email/password
  emailAndPassword: {
    enabled: true,
    disableSignUp: false, // Autoriser les inscriptions
    requireEmailVerification: false, // Phase MVP: pas de vérification email requise
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true, // Auto-connexion après inscription
    resetPasswordTokenExpiresIn: 900, // 15 minutes (en secondes)
    
    // Fonction d'envoi email pour reset password
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
        userName: user.name,
      });
    },
  },

  // Providers OAuth (actives dynamiquement selon les variables d'environnement)
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            scope: ["email", "profile"],
          },
        }
      : {}),
  },

  // Configuration sessions
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours (en secondes)
    updateAge: 60 * 60 * 24, // Update tous les jours (en secondes)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache 5 minutes (en secondes)
    },
  },

  // URLs de base
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Rate limiting pour protection contre brute force
  rateLimit: {
    enabled: true,
    window: 60, // 60 secondes
    max: 10, // 10 tentatives max par fenêtre
  },
});

// Types exportés pour utilisation dans l'application
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;