/**
 * Template React Email type pour la reinitialisation du mot de passe
 */

import * as React from "react"

export interface ResetPasswordEmailProps {
  userName: string
  resetUrl: string
}

/**
 * Echappe les caracteres HTML speciaux pour prevenir toute injection XSS dans les emails.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * N'autorise que les liens http:// et https:// dans les balises href des emails.
 */
export function sanitizeHttpUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim()
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed
  }
  return "#"
}

export function ResetPasswordEmailTemplate({
  userName,
  resetUrl,
}: ResetPasswordEmailProps) {
  const safeResetUrl = sanitizeHttpUrl(resetUrl)
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ color: "#111827", marginBottom: "8px" }}>
        Bonjour {userName},
      </h2>
      <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6" }}>
        Vous avez demandé la réinitialisation de votre mot de passe sur{" "}
        <strong>HomeServices</strong>. Ce lien est valable pendant 15 minutes.
      </p>
      <div style={{ margin: "24px 0" }}>
        <a
          href={safeResetUrl}
          style={{
            backgroundColor: "#111827",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          Réinitialiser mon mot de passe
        </a>
      </div>
      <p style={{ color: "#6b7280", fontSize: "12px", lineHeight: "1.5" }}>
        Si vous n&apos;êtes pas à l&apos;origine de cette demande, vous pouvez
        ignorer cet email en toute sécurité.
      </p>
    </div>
  )
}

/**
 * Genere le HTML complet a partir des proprietes typees pour l'API Resend
 */
export function renderResetPasswordEmailHtml(props: ResetPasswordEmailProps): string {
  const safeUserName = escapeHtml(props.userName)
  const safeResetUrl = escapeHtml(sanitizeHttpUrl(props.resetUrl))

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>Réinitialisation de votre mot de passe</title></head>
<body style="font-family: system-ui, -apple-system, sans-serif; background-color: #f3f4f6; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
    <h2 style="color: #111827; margin-bottom: 8px;">Bonjour ${safeUserName},</h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Vous avez demandé la réinitialisation de votre mot de passe sur <strong>HomeServices</strong>.
      Ce lien sécurisé expire dans 15 minutes.
    </p>
    <p style="margin: 24px 0;">
      <a href="${safeResetUrl}" style="background-color: #111827; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
        Réinitialiser mon mot de passe
      </a>
    </p>
    <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
      Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
    </p>
  </div>
</body>
</html>`
}
