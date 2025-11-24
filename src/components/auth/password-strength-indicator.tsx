/**
 * PasswordStrengthIndicator - Indicateur visuel de force du mot de passe
 * 
 * Affiche une barre de progression colorée et un message en français
 * selon la force du mot de passe saisi.
 * 
 * Critères de force:
 * - Faible: < 8 caractères
 * - Moyen: 8+ caractères
 * - Fort: 8+ caractères + majuscules + minuscules + chiffres
 * - Très fort: 12+ caractères + majuscules + minuscules + chiffres + caractères spéciaux
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  /** Mot de passe à évaluer */
  password: string;
  /** Classes CSS additionnelles */
  className?: string;
}

type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

interface StrengthConfig {
  label: string;
  color: string;
  bgColor: string;
  width: string;
}

const strengthConfig: Record<PasswordStrength, StrengthConfig> = {
  weak: {
    label: "Faible",
    color: "bg-destructive",
    bgColor: "bg-destructive/20",
    width: "w-1/4",
  },
  medium: {
    label: "Moyen",
    color: "bg-orange-500",
    bgColor: "bg-orange-500/20",
    width: "w-1/2",
  },
  strong: {
    label: "Fort",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-500/20",
    width: "w-3/4",
  },
  "very-strong": {
    label: "Très fort",
    color: "bg-green-500",
    bgColor: "bg-green-500/20",
    width: "w-full",
  },
};

/**
 * Calcule la force du mot de passe
 */
function calculatePasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) {
    return "weak";
  }

  if (password.length < 8) {
    return "weak";
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Très fort: 12+ caractères avec tous les types
  if (
    password.length >= 12 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  ) {
    return "very-strong";
  }

  // Fort: 8+ caractères avec maj, min, chiffres
  if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers) {
    return "strong";
  }

  // Moyen: 8+ caractères
  if (password.length >= 8) {
    return "medium";
  }

  return "weak";
}

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  const strength = calculatePasswordStrength(password);
  const config = strengthConfig[strength];

  // N'affiche rien si le champ est vide
  if (password.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Barre de progression */}
      <div className={cn("h-2 w-full rounded-full", config.bgColor)}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            config.color,
            config.width
          )}
        />
      </div>

      {/* Message de force */}
      <p className="text-sm text-muted-foreground">
        Force du mot de passe: <span className="font-medium">{config.label}</span>
      </p>
    </div>
  );
}