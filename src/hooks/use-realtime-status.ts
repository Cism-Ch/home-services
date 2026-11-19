/**
 * Hooks clients Supabase Realtime (Regle 8)
 * - useProAvailabilityRealtime : souscription selective sur pro_profiles.availabilityStatus
 * - useBookingStatusRealtime : ecoute du canal broadcast prive user-bookings:<userId>
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import type { AvailabilityStatusType } from "@/lib/types/catalog"

function isAvailabilityStatus(val: unknown): val is AvailabilityStatusType {
  return val === "AVAILABLE" || val === "BUSY_TODAY" || val === "OFFLINE"
}

/**
 * Suit en temps reel le statut de disponibilite d'un prestataire tout en supportant
 * les mises a jour optimistes cote client (et le rollback en cas d'erreur).
 */
export function useProAvailabilityRealtime(
  proProfileId: string,
  initialStatus: AvailabilityStatusType
) {
  const [override, setOverride] = useState<{
    base: AvailabilityStatusType
    value: AvailabilityStatusType
  } | null>(null)

  const status =
    override && override.base === initialStatus ? override.value : initialStatus

  const setStatus = useCallback(
    (next: AvailabilityStatusType) => {
      setOverride({ base: initialStatus, value: next })
    },
    [initialStatus]
  )

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase || !proProfileId) {
      return
    }

    const channel = supabase
      .channel(`pro-status:${proProfileId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pro_profiles",
          filter: `id=eq.${proProfileId}`,
        },
        (payload) => {
          const nextValue = (payload.new as { availabilityStatus?: unknown } | null)
            ?.availabilityStatus
          if (isAvailabilityStatus(nextValue)) {
            setOverride({ base: initialStatus, value: nextValue })
          }
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [proProfileId, initialStatus])

  return { status, setStatus }
}

export interface BookingRealtimeNotification {
  bookingId: string
  status: string
  message?: string
}

/**
 * Ecoute les notifications temps reel broadcastees pour les reservations d'un utilisateur.
 */
export function useBookingStatusRealtime(
  userId: string,
  onEvent?: (event: BookingRealtimeNotification) => void
) {
  const onEventRef = useRef(onEvent)

  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase || !userId) {
      return
    }

    const channel = supabase
      .channel(`user-bookings:${userId}`)
      .on("broadcast", { event: "booking_status_changed" }, ({ payload }) => {
        if (!payload || typeof payload !== "object") return
        const evt = payload as Partial<BookingRealtimeNotification>
        if (typeof evt.bookingId === "string" && typeof evt.status === "string") {
          onEventRef.current?.({
            bookingId: evt.bookingId,
            status: evt.status,
            message: typeof evt.message === "string" ? evt.message : undefined,
          })
        }
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [userId])
}
