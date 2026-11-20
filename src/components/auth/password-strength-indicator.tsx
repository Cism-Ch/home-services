/**
 * PasswordStrengthIndicator - Indicateur visuel de force du mot de passe
 *
 * Affiche une barre de progression shadcn/ui coloree et un message en francais
 * selon la force du mot de passe saisi.
 */

"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface PasswordStrengthIndicatorProps {
  /** Mot de passe a evaluer */
  password: string
  /** Classes CSS additionnelles */
  className?: string
}

type PasswordStrength = "weak" | "medium" | "strong" | "very-strong"

interface StrengthConfig {
  label: string
  color: string
  percent: number
}

const strengthConfig: Record<PasswordStrength, StrengthConfig> = {
  weak: {
    label: "Faible",
    color: "bg-destructive",
    percent: 25,
  },
  medium: {
    label: "Moyen",
    color: "bg-orange-500",
    percent: 50,
  },
  strong: {
    label: "Fort",
    color: "bg-amber-500",
    percent: 75,
  },
  "very-strong": {
    label: "Très fort",
    color: "bg-emerald-600",
    percent: 100,
  },
}

function calculatePasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) {
    return "weak"
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (
    password.length >= 12 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  ) {
    return "very-strong"
  }

  if (hasUpperCase && hasLowerCase && hasNumbers) {
    return "strong"
  }

  return "medium"
}

export function PasswordStrengthIndicator({
  password,
  className,
}: PasswordStrengthIndicatorProps) {
  if (password.length === 0) {
    return null
  }

  const strength = calculatePasswordStrength(password)
  const config = strengthConfig[strength]

  return (
    <div className={cn("space-y-2", className)}>
      <Progress
        value={config.percent}
        className="h-1.5"
        indicatorClassName={config.color}
        aria-label="Force du mot de passe"
      />
      <p className="text-sm text-muted-foreground">
        Force du mot de passe : <span className="font-medium">{config.label}</span>
      </p>
    </div>
  )
}
