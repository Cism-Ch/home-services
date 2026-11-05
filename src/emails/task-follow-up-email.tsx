/**
 * Template React Email type pour les notifications de suivi d'intervention
 * ("Vos taches ont-elles ete finalisees ? [Oui / En cours / Non]")
 */

import * as React from "react"

export interface TaskFollowUpEmailProps {
  clientName: string
  proName: string
  serviceTitle: string
  bookingId: string
  timeSlot: string
  indicativePriceFCFA: number
  dashboardUrl: string
}

export function TaskFollowUpEmailTemplate({
  clientName,
  proName,
  serviceTitle,
  bookingId,
  timeSlot,
  indicativePriceFCFA,
  dashboardUrl,
}: TaskFollowUpEmailProps) {
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
        Bonjour {clientName},
      </h2>
      <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6" }}>
        Votre intervention <strong>{serviceTitle}</strong> avec l&apos;artisan{" "}
        <strong>{proName}</strong> (créneau {timeSlot}, tarif indicatif{" "}
        {indicativePriceFCFA.toLocaleString("fr-FR")} FCFA) est actuellement marquée en cours de traitement.
      </p>

      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          margin: "20px 0",
          border: "1px solid #e5e7eb",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            color: "#111827",
            marginBottom: "12px",
            fontSize: "15px",
          }}
        >
          Vos tâches ont-elles été finalisées ?
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href={`${dashboardUrl}?booking=${bookingId}&answer=YES`}
            style={{
              backgroundColor: "#059669",
              color: "#ffffff",
              padding: "10px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Oui, c&apos;est finalisé
          </a>
          <a
            href={`${dashboardUrl}?booking=${bookingId}&answer=IN_PROGRESS`}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "10px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Toujours en cours
          </a>
          <a
            href={`${dashboardUrl}?booking=${bookingId}&answer=NO`}
            style={{
              backgroundColor: "#f3f4f6",
              color: "#374151",
              padding: "10px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Non, problème rencontré
          </a>
        </div>
      </div>

      <p style={{ color: "#6b7280", fontSize: "12px" }}>
        Votre confirmation permet d&apos;actualiser automatiquement la disponibilité de {proName} et de lui attribuer une note.
      </p>
    </div>
  )
}

/**
 * Genere le HTML complet a partir des proprietes typees pour l'API Resend
 */
export function renderTaskFollowUpEmailHtml(props: TaskFollowUpEmailProps): string {
  const formattedPrice = `${props.indicativePriceFCFA.toLocaleString("fr-FR")} FCFA`
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>Suivi de votre intervention</title></head>
<body style="font-family: system-ui, -apple-system, sans-serif; background-color: #f3f4f6; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
    <h2 style="color: #111827; margin-bottom: 8px;">Bonjour ${props.clientName},</h2>
    <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
      Votre intervention <strong>${props.serviceTitle}</strong> avec l'artisan <strong>${props.proName}</strong>
      (créneau ${props.timeSlot}, tarif indicatif ${formattedPrice}) est enregistrée en cours de traitement.
    </p>
    <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p style="font-weight: 700; color: #111827; margin-bottom: 12px; font-size: 15px;">
        Vos tâches ont-elles été finalisées ?
      </p>
      <p style="margin: 0;">
        <a href="${props.dashboardUrl}?booking=${props.bookingId}&answer=YES" style="background-color: #059669; color: #ffffff; padding: 10px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; margin-right: 8px;">Oui, c'est finalisé</a>
        <a href="${props.dashboardUrl}?booking=${props.bookingId}&answer=IN_PROGRESS" style="background-color: #2563eb; color: #ffffff; padding: 10px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; margin-right: 8px;">Toujours en cours</a>
        <a href="${props.dashboardUrl}?booking=${props.bookingId}&answer=NO" style="background-color: #e5e7eb; color: #374151; padding: 10px 14px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">Non, problème</a>
      </p>
    </div>
    <p style="color: #6b7280; font-size: 12px;">
      Référence de suivi : #${props.bookingId} — HomeServices Afrique
    </p>
  </div>
</body>
</html>`
}
