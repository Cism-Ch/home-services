/**
 * Configuration Better-auth - Client
 * 
 * Ce fichier configure l'authentification côté client avec:
 * - Hooks React pour accès session
 * - Méthodes d'authentification (signIn, signUp, signOut, etc.)
 * - Gestion des erreurs globale
 */

"use client";

import { createAuthClient } from "better-auth/react";

// Base URL pour les requêtes API
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  
  // Options supplémentaires pour gestion d'erreurs et tracking
  fetchOptions: {
    onError(context) {
      // Gestion globale des erreurs d'authentification
      console.error("❌ Erreur d'authentification:", {
        error: context.error,
        response: context.response,
      });
      
      // Ici, vous pouvez ajouter un toast ou autre notification
      // toast.error("Erreur d'authentification. Veuillez réessayer.");
    },
    onSuccess(context) {
      // Tracking succès (optionnel - Analytics)
      console.log("✅ Opération d'authentification réussie:", context.response.url);
      
      // Exemple: tracking analytics
      // analytics.track('auth_success', { action: context.response.url });
    },
  },
});

// Export des hooks et méthodes pour utilisation dans les composants React
export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;

/**
 * Fonction pour demander la réinitialisation du mot de passe
 * Envoie un email avec un lien de réinitialisation
 */
export async function forgetPassword(data: {
  email: string;
  redirectTo?: string;
}): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/auth/forget-password`, {
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
    throw new Error(error.message || "Échec de l'envoi de l'email de réinitialisation");
  }
}

/**
 * Fonction pour réinitialiser le mot de passe avec un token
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
      password: data.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(error.message || "Échec de la réinitialisation du mot de passe");
  }
}