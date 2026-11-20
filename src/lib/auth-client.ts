/**
 * Configuration Better-auth - Client
 *
 * Ce fichier configure l'authentification cote client avec:
 * - Hooks React pour acces session avec types additionnels inferes
 * - Methodes d'authentification (signIn, signUp, signOut, reset password)
 * - Gestion des erreurs globale
 */

"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

/**
 * Resout l'URL de base meme-origine cote navigateur pour eviter les conflits CSRF/CORS
 * entre localhost, previews Vercel et production.
 */
function getAuthBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  plugins: [inferAdditionalFields<typeof auth>()],
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
  fetchOptions: {
    onError(context) {
      const status = context.response?.status ?? context.error?.status;
      // Les reponses 4xx (identifiants invalides, non authentifie, 429) sont gerees
      // par les formulaires appelants ; evite de declencher l'overlay Next.js en dev.
      if (typeof status === "number" && status >= 400 && status < 500) {
        if (status === 429 && process.env.NODE_ENV !== "production") {
          console.warn(
            "[Auth] Limite de requetes atteinte (429):",
            context.error?.message
          );
        }
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.warn("[Auth] Erreur reseau ou serveur d'authentification:", {
          status,
          message: context.error?.message,
        });
      }
    },
  },
});

export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;

/**
 * Demande la reinitialisation du mot de passe via Better-auth (/api/auth/request-password-reset)
 */
export async function forgetPassword(data: {
  email: string;
  redirectTo?: string;
}): Promise<void> {
  const response = await fetch(`${getAuthBaseUrl()}/api/auth/request-password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      redirectTo: data.redirectTo || "/reset-password",
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(error.message || "Echec de l'envoi de l'email de reinitialisation");
  }
}

/**
 * Reinitialise le mot de passe avec le token recu par email (/api/auth/reset-password)
 */
export async function resetPassword(data: {
  token: string;
  password: string;
}): Promise<void> {
  const response = await fetch(`${getAuthBaseUrl()}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: data.token,
      newPassword: data.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(error.message || "Echec de la reinitialisation du mot de passe");
  }
}
