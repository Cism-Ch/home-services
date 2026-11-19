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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>()],

  fetchOptions: {
    onError(context) {
      console.error("[Auth] Erreur d'authentification:", {
        error: context.error,
        response: context.response,
      });
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
  const response = await fetch(`${BASE_URL}/api/auth/request-password-reset`, {
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
  const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
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
