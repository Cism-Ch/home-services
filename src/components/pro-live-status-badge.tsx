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
        <Badge variant="success" className="gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Disponible aujourd&apos;hui
        </Badge>
      )
    case "BUSY_TODAY":
      return (
        <Badge variant="warning" className="gap-1.5">
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
