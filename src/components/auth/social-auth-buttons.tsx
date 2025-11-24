/**
 * SocialAuthButtons - Boutons d'authentification sociale (OAuth)
 * 
 * Boutons pour connexion via Google et GitHub
 * avec états de chargement individuels et gestion d'erreurs.
 */

"use client";

import * as React from "react";
import { Chrome } from "lucide-react";
import { LoadingButton } from "./loading-button";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface SocialAuthButtonsProps {
  /** URL de redirection après connexion réussie */
  callbackURL?: string;
  /** Classes CSS additionnelles */
  className?: string;
}

export function SocialAuthButtons({
  callbackURL = "/dashboard",
  className,
}: SocialAuthButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsGoogleLoading(true);
      
      await signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (err) {
      console.error("Erreur connexion Google:", err);
      setError("Erreur lors de la connexion avec Google. Veuillez réessayer.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-3", className)}>
      {/* Message d'erreur */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Bouton Google */}
      <LoadingButton
        type="button"
        variant="outline"
        loading={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="w-full"
      >
        <Chrome className="size-5" />
        Continuer avec Google
      </LoadingButton>

      {/* Note: GitHub sera ajouté en Phase 2 */}
      {/* <LoadingButton
        type="button"
        variant="outline"
        loading={isGithubLoading}
        onClick={handleGithubSignIn}
        className="w-full"
      >
        <Github className="size-5" />
        Continuer avec GitHub
      </LoadingButton> */}
    </div>
  );
}