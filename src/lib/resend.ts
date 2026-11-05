/**
 * Client Resend centralise pour l'envoi asynchrone d'emails transactionnels
 * Conforme a la Regle 7 : Utilisez React Email pour des templates types et QStash en intermediaire.
 */

import {
  renderTaskFollowUpEmailHtml,
  type TaskFollowUpEmailProps,
} from "@/emails/task-follow-up-email"

export interface SendEmailResult {
  id: string
  delivered: boolean
}

const RESEND_API_URL = "https://api.resend.com/emails"

/**
 * Envoie un email de suivi d'intervention via l'API Resend avec cle d'idempotence
 */
export async function sendFollowUpEmailViaResend(
  toEmail: string,
  props: TaskFollowUpEmailProps,
  idempotencyKey: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const fromAddress =
    process.env.EMAIL_FROM || "HomeServices Afrique <notifications@homeservices.ci>"
  const html = renderTaskFollowUpEmailHtml(props)

  if (!apiKey) {
    // Simulation locale lorsque RESEND_API_KEY n'est pas configuree
    return {
      id: `sim_email_${idempotencyKey}`,
      delivered: true,
    }
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toEmail],
      subject: `Suivi d'intervention : Vos tâches avec ${props.proName} ont-elles été finalisées ?`,
      html,
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend HTTP error ${response.status}`)
  }

  const data = (await response.json()) as { id?: string }
  return {
    id: data.id || idempotencyKey,
    delivered: true,
  }
}
