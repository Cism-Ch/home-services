"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Moon, RefreshCw } from "lucide-react"
import {
  setProAvailabilityAction,
  type ProAvailabilityType,
} from "@/server/actions/booking-status"
import { toast } from "sonner"

interface ProLiveStatusBannerProps {
  proId: string
  initialStatus?: ProAvailabilityType
  hasActiveMission?: boolean
  className?: string
}

export function ProLiveStatusBanner({
  proId,
  initialStatus = "AVAILABLE",
  hasActiveMission = false,
  className = "",
}: ProLiveStatusBannerProps) {
  const [currentStatus, setCurrentStatus] = React.useState<ProAvailabilityType>(initialStatus)
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
    <Card className={`border shadow-sm overflow-hidden ${className}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Votre statut en direct
              </span>
              {currentStatus === "AVAILABLE" && (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Disponible
                </Badge>
              )}
              {currentStatus === "BUSY_TODAY" && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 gap-1.5">
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
              {hasActiveMission
                ? "Vous avez une mission validée en cours de traitement. Vos créneaux restants du jour sont réservés."
                : "Indiquez aux clients si vous pouvez accepter des interventions d'urgence aujourd'hui."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={currentStatus === "AVAILABLE" ? "default" : "outline"}
              className={currentStatus === "AVAILABLE" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
              disabled={isUpdating}
              onClick={() => handleStatusChange("AVAILABLE")}
            >
              {isUpdating && currentStatus === "AVAILABLE" ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              )}
              Disponible
            </Button>

            <Button
              size="sm"
              variant={currentStatus === "BUSY_TODAY" ? "default" : "outline"}
              className={currentStatus === "BUSY_TODAY" ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
              disabled={isUpdating}
              onClick={() => handleStatusChange("BUSY_TODAY")}
            >
              {isUpdating && currentStatus === "BUSY_TODAY" ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              )}
              Occupé
            </Button>

            <Button
              size="sm"
              variant={currentStatus === "OFFLINE" ? "secondary" : "ghost"}
              disabled={isUpdating}
              onClick={() => handleStatusChange("OFFLINE")}
            >
              <Moon className="h-3.5 w-3.5 mr-1.5" />
              Pause
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
