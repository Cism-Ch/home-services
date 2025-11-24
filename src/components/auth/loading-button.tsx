/**
 * LoadingButton - Bouton avec état de chargement
 * 
 * Étend le composant Button du design system avec:
 * - Spinner de chargement
 * - Désactivation automatique pendant le chargement
 * - Conservation des styles brand (gradients, glow)
 */

"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  /** État de chargement - affiche le spinner et désactive le bouton */
  loading?: boolean;
  /** Texte à afficher pendant le chargement (optionnel) */
  loadingText?: string;
}

export function LoadingButton({
  children,
  loading = false,
  loadingText,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}