"use client"

import { Badge } from "@/components/ui/badge"
import { useProAvailabilityRealtime } from "@/hooks/use-realtime-status"
import type { AvailabilityStatusType } from "@/lib/types/catalog"

interface ProLiveStatusBadgeProps {
  proProfileId: string
  initialStatus: AvailabilityStatusType
}

/**
 * Badge temps reel de disponibilite sur la fiche publique prestataire (Supabase Realtime)
 */
export function ProLiveStatusBadge({
  proProfileId,
  initialStatus,
}: ProLiveStatusBadgeProps) {
  const { status } = useProAvailabilityRealtime(proProfileId, initialStatus)

  switch (status) {
    case "AVAILABLE":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Disponible aujourd&apos;hui
        </Badge>
      )
    case "BUSY_TODAY":
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 gap-1.5 border-amber-300"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Occupé aujourd&apos;hui
        </Badge>
      )
    case "OFFLINE":
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          Hors ligne
        </Badge>
      )
  }
}
