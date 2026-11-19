/**
 * Configuration Better-auth - Serveur
 *
 * Ce fichier configure l'authentification cote serveur avec:
 * - Base de donnees PostgreSQL via Prisma (Supabase)
 * - Champs metier additionnels (userType, phoneNumber)
 * - Hooks de creation (sanitisation role + provisioning ProProfile)
 * - Email/Password avec reset password asynchrone (QStash + Resend)
 * - OAuth Google
 * - Sessions securisees (7 jours)
 * - Rate limiting
 */

import crypto from "crypto";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { enqueueFollowUpNotification } from "@/lib/qstash";
import { sendPasswordResetEmailViaResend } from "@/lib/resend";

interface ResetPasswordEmailData {
  to: string;
  resetUrl: string;
  userName: string;
}

/**
 * Envoie l'email de reinitialisation via Upstash QStash + Resend
 */
async function sendPasswordResetEmail(data: ResetPasswordEmailData): Promise<void> {
  if (process.env.QSTASH_TOKEN) {
    await enqueueFollowUpNotification(
      {
        type: "PASSWORD_RESET_EMAIL",
        toEmail: data.to,
        userName: data.userName,
        resetUrl: data.resetUrl,
      },
      0
    );
    return;
  }

  // Fallback direct hors-QStash (dev local ou envoi direct Resend)
  if (process.env.NODE_ENV !== "production") {
    console.log("Email de reinitialisation pret pour:", data.to);
  }

  const digest = crypto
    .createHash("sha256")
    .update(data.resetUrl, "utf8")
    .digest("hex")
    .slice(0, 16);

  await sendPasswordResetEmailViaResend(
    data.to,
    {
      userName: data.userName,
      resetUrl: data.resetUrl,
    },
    `password-reset-fallback-${digest}`
  );
}

/**
 * Configuration Better-auth
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),

  user: {
    additionalFields: {
      userType: {
        type: "string",
        required: false,
        defaultValue: "client",
        input: true,
      },
      phoneNumber: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedType =
            typeof user.userType === "string" ? user.userType : "client";
          // Jamais d'auto-elevation en admin via l'inscription publique
          const sanitizedType = requestedType === "pro" ? "pro" : "client";

          return {
            data: {
              ...user,
              userType: sanitizedType,
            },
          };
        },
        after: async (user) => {
          if (user.userType === "pro") {
            const phone =
              typeof user.phoneNumber === "string" ? user.phoneNumber : "";
            const whatsappClean = phone.replace(/[^0-9+]/g, "");

            await prisma.proProfile.upsert({
              where: { userId: user.id },
              update: {},
              create: {
                userId: user.id,
                headline: "Prestataire HomeServices",
                bio: "Profil professionnel en cours de configuration.",
                phoneNumber: phone,
                whatsappNumber: whatsappClean || phone,
                availabilityStatus: "AVAILABLE",
                kycStatus: "NOT_SUBMITTED",
              },
            });
          }
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 900,

    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
        userName: user.name,
      });
    },
  },

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

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
