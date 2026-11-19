/**
 * Helper serveur Supabase Realtime Broadcast (Regle 8)
 * Diffuse les mises a jour de statut de reservation sur des canaux prives par utilisateur
 * sans exposer la table bookings aux requetes anonymes PostgREST/Realtime.
 */

export interface BookingRealtimeEventPayload {
  bookingId: string
  status: string
  message?: string
}

/**
 * Envoie un evenement broadcast temps reel aux participants d'une reservation.
 * Echoue silencieusement si Realtime n'est pas joignable afin de ne jamais bloquer la Server Action.
 */
export async function broadcastBookingStatusEvent(
  userIds: string[],
  payload: BookingRealtimeEventPayload
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl || !serviceRoleKey) {
    return
  }

  const uniqueUserIds = Array.from(
    new Set(userIds.map((id) => id.trim()).filter(Boolean))
  )

  if (uniqueUserIds.length === 0) {
    return
  }

  try {
    const endpoint = `${supabaseUrl.replace(/\/$/, "")}/realtime/v1/api/broadcast`
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: uniqueUserIds.map((uid) => ({
          topic: `user-bookings:${uid}`,
          event: "booking_status_changed",
          payload,
        })),
      }),
    })

    if (!response.ok) {
      console.warn(
        `[supabase-realtime] Echec broadcast (${response.status})`
      )
    }
  } catch (err) {
    console.warn("[supabase-realtime] Broadcast indisponible:", err)
  }
}
