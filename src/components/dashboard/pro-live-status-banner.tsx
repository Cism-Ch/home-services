"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CheckCircle2, AlertTriangle, Moon, RefreshCw } from "lucide-react"
import { useProAvailabilityRealtime } from "@/hooks/use-realtime-status"
import {
  setProAvailabilityAction,
  type ProAvailabilityType,
} from "@/server/actions/booking-status"
import { toast } from "sonner"

interface ProLiveStatusBannerProps {
  proId: string
  initialStatus?: ProAvailabilityType
  hasActiveMission?: boolean
  activeProjectsToday?: number
  maxConcurrentProjects?: number
  className?: string
}

/**
 * Bandeau interactif temps reel de gestion du statut de disponibilite prestataire.
 */
export function ProLiveStatusBanner({
  proId,
  initialStatus = "AVAILABLE",
  hasActiveMission = false,
  activeProjectsToday = hasActiveMission ? 1 : 0,
  maxConcurrentProjects = 1,
  className = "",
}: ProLiveStatusBannerProps) {
  const { status: currentStatus, setStatus: setCurrentStatus } =
    useProAvailabilityRealtime(proId, initialStatus)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const handleStatusChange = async (newStatus: ProAvailabilityType) => {
    if (newStatus === currentStatus) return

    setIsUpdating(true)
    const prev = currentStatus
    setCurrentStatus(newStatus)

    try {
      const res = await setProAvailabilityAction(proId, newStatus)
      if (res.error) {
        setCurrentStatus(prev)
        toast.error("Impossible d'actualiser votre statut.")
      } else {
        toast.success(`Statut mis à jour : ${getStatusLabel(newStatus)}`)
      }
    } catch {
      setCurrentStatus(prev)
      toast.error("Une erreur réseau est survenue.")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusLabel = (status: ProAvailabilityType) => {
    switch (status) {
      case "AVAILABLE":
        return "Disponible aujourd'hui"
      case "BUSY_TODAY":
        return "Occupé aujourd'hui (Offre en traitement)"
      case "OFFLINE":
        return "Hors ligne / Indisponible"
    }
  }

  return (
    <Card className={`py-0 border shadow-sm overflow-hidden ${className}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Votre statut en direct
              </span>
              {currentStatus === "AVAILABLE" && (
                <Badge variant="success" className="gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Disponible
                </Badge>
              )}
              {currentStatus === "BUSY_TODAY" && (
                <Badge variant="warning" className="gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Occupé aujourd&apos;hui
                </Badge>
              )}
              {currentStatus === "OFFLINE" && (
                <Badge variant="outline" className="text-muted-foreground gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Hors ligne
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {maxConcurrentProjects > 1
                ? `${activeProjectsToday} / ${maxConcurrentProjects} place(s) active(s) aujourd'hui (${Math.max(
                    0,
                    maxConcurrentProjects - activeProjectsToday
                  )} libre(s)).`
                : hasActiveMission
                ? "Vous avez une mission validée en cours de traitement. Votre créneau est réservé."
                : "Indiquez aux clients si vous pouvez accepter des interventions d'urgence aujourd'hui."}
            </p>
          </div>

          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={currentStatus}
            disabled={isUpdating}
            aria-label="Changer votre statut de disponibilité"
            onValueChange={(val) => {
              if (val) {
                void handleStatusChange(val as ProAvailabilityType)
              }
            }}
            className="flex-wrap justify-start"
          >
            <ToggleGroupItem
              value="AVAILABLE"
              aria-label="Disponible"
              className="gap-1.5 data-[state=on]:bg-emerald-600 data-[state=on]:text-white data-[state=on]:border-emerald-600"
            >
              {isUpdating && currentStatus === "AVAILABLE" ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Disponible
            </ToggleGroupItem>

            <ToggleGroupItem
              value="BUSY_TODAY"
              aria-label="Occupé"
              className="gap-1.5 data-[state=on]:bg-amber-600 data-[state=on]:text-white data-[state=on]:border-amber-600"
            >
              {isUpdating && currentStatus === "BUSY_TODAY" ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              Occupé
            </ToggleGroupItem>

            <ToggleGroupItem
              value="OFFLINE"
              aria-label="Pause"
              className="gap-1.5 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
            >
              <Moon className="h-3.5 w-3.5" />
              Pause
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  )
}
