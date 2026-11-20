"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar, Trash2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProLiveStatusBanner } from "@/components/dashboard/pro-live-status-banner"
import {
  saveProTimeSlotsAction,
  addUnavailabilityPeriodAction,
  deleteUnavailabilityPeriodAction,
} from "@/server/actions/availability"
import type {
  AvailabilityStatusType,
  CatalogTimeSlot,
  CatalogUnavailability,
} from "@/lib/types/catalog"
import { toast } from "sonner"

const DAYS = [
  { dayOfWeek: 1, id: "monday", label: "Lundi" },
  { dayOfWeek: 2, id: "tuesday", label: "Mardi" },
  { dayOfWeek: 3, id: "wednesday", label: "Mercredi" },
  { dayOfWeek: 4, id: "thursday", label: "Jeudi" },
  { dayOfWeek: 5, id: "friday", label: "Vendredi" },
  { dayOfWeek: 6, id: "saturday", label: "Samedi" },
  { dayOfWeek: 0, id: "sunday", label: "Dimanche" },
]

const HOURS = Array.from({ length: 16 }, (_, i) => {
  const hour = (i + 6).toString().padStart(2, "0")
  return `${hour}:00`
})

interface DayScheduleState {
  dayOfWeek: number
  isActive: boolean
  startTime: string
  endTime: string
}

interface AvailabilityClientProps {
  proProfileId: string
  initialStatus: AvailabilityStatusType
  initialSlots: CatalogTimeSlot[]
  initialUnavailabilities: CatalogUnavailability[]
}

function buildInitialSchedule(slots: CatalogTimeSlot[]): DayScheduleState[] {
  return DAYS.map((day) => {
    const daySlots = slots.filter((s) => s.dayOfWeek === day.dayOfWeek && s.isAvailable)
    if (daySlots.length === 0) {
      return {
        dayOfWeek: day.dayOfWeek,
        isActive: day.dayOfWeek !== 0,
        startTime: "08:00",
        endTime: "18:00",
      }
    }
    const sorted = [...daySlots].sort((a, b) => a.startTime.localeCompare(b.startTime))
    return {
      dayOfWeek: day.dayOfWeek,
      isActive: true,
      startTime: sorted[0].startTime,
      endTime: sorted[sorted.length - 1].endTime,
    }
  })
}

export function AvailabilityClient({
  proProfileId,
  initialStatus,
  initialSlots,
  initialUnavailabilities,
}: AvailabilityClientProps) {
  const [unavailabilityPeriods, setUnavailabilityPeriods] = useState<CatalogUnavailability[]>(
    initialUnavailabilities
  )
  const [schedule, setSchedule] = useState<DayScheduleState[]>(() =>
    buildInitialSchedule(initialSlots)
  )
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedType, setSelectedType] = useState<"vacation" | "sick" | "other">("vacation")
  const [customReason, setCustomReason] = useState("")
  const [isSavingPeriod, setIsSavingPeriod] = useState(false)
  const [isSavingSchedule, setIsSavingSchedule] = useState(false)

  const handleQuickAdd = (type: "vacation" | "sick" | "other") => {
    setSelectedType(type)
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    setStartDate(today.toISOString().split("T")[0])
    setEndDate(nextWeek.toISOString().split("T")[0])
  }

  const getDefaultReason = (type: "vacation" | "sick" | "other") => {
    switch (type) {
      case "vacation":
        return "Vacances"
      case "sick":
        return "Congé maladie"
      case "other":
        return "Indisponible"
    }
  }

  const handleAddPeriod = async () => {
    if (!startDate || !endDate) return
    setIsSavingPeriod(true)
    try {
      const res = await addUnavailabilityPeriodAction({
        type: selectedType,
        startDate,
        endDate,
        reason: customReason || getDefaultReason(selectedType),
      })
      if (res.error || !res.data) {
        toast.error(res.error || "Impossible d'ajouter la période.")
        return
      }
      setUnavailabilityPeriods((prev) => [...prev, res.data!])
      setStartDate("")
      setEndDate("")
      setCustomReason("")
      toast.success("Période d'indisponibilité enregistrée.")
    } finally {
      setIsSavingPeriod(false)
    }
  }

  const handleDeletePeriod = async (id: string) => {
    const res = await deleteUnavailabilityPeriodAction(id)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setUnavailabilityPeriods((prev) => prev.filter((p) => p.id !== id))
    toast.success("Période supprimée.")
  }

  const handleSaveSchedule = async () => {
    setIsSavingSchedule(true)
    try {
      const slotsToPersist: Array<{
        dayOfWeek: number
        startTime: string
        endTime: string
        isAvailable: boolean
      }> = []

      for (const day of schedule) {
        if (!day.isActive) continue
        const startHour = parseInt(day.startTime.split(":")[0], 10)
        const endHour = parseInt(day.endTime.split(":")[0], 10)
        if (endHour <= startHour) {
          toast.error("L'heure de fin doit être supérieure à l'heure de début.")
          return
        }

        // Genere des creneaux de 2 heures sur la plage horaire active
        for (let h = startHour; h < endHour; h += 2) {
          const nextH = Math.min(h + 2, endHour)
          slotsToPersist.push({
            dayOfWeek: day.dayOfWeek,
            startTime: `${h.toString().padStart(2, "0")}:00`,
            endTime: `${nextH.toString().padStart(2, "0")}:00`,
            isAvailable: true,
          })
        }
      }

      const res = await saveProTimeSlotsAction(slotsToPersist)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success("Horaires hebdomadaires enregistrés avec succès.")
    } finally {
      setIsSavingSchedule(false)
    }
  }

  const updateDay = (dayOfWeek: number, patch: Partial<DayScheduleState>) => {
    setSchedule((prev) =>
      prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d))
    )
  }

  const getTypeLabel = (type: "vacation" | "sick" | "other") => {
    switch (type) {
      case "vacation":
        return "Vacances"
      case "sick":
        return "Maladie"
      case "other":
        return "Autre"
    }
  }

  const getTypeVariant = (
    type: "vacation" | "sick" | "other"
  ): "info" | "warning" | "secondary" => {
    switch (type) {
      case "vacation":
        return "info"
      case "sick":
        return "warning"
      case "other":
        return "secondary"
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Disponibilités</h1>
        <p className="text-muted-foreground mt-2">
          Définissez vos horaires d&apos;ouverture habituels et vos périodes d&apos;indisponibilité.
        </p>
      </div>

      <ProLiveStatusBanner proId={proProfileId} initialStatus={initialStatus} />

      {/* Unavailability Periods Section */}
      <Card>
        <CardHeader>
          <CardTitle>Périodes d&apos;indisponibilité</CardTitle>
          <CardDescription>
            Bloquez des journées entières (congés, maladie, déplacements) dans votre calendrier public.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickAdd("vacation")}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Vacances
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickAdd("sick")}
              className="gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Congé maladie
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleQuickAdd("other")}
              className="gap-2"
            >
              Autre
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reason">Raison (optionnel)</Label>
              <Input
                id="reason"
                placeholder="Ex: Déplacement hors d'Abidjan"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                type="button"
                onClick={handleAddPeriod}
                disabled={!startDate || !endDate || isSavingPeriod}
              >
                {isSavingPeriod ? "Enregistrement..." : "Ajouter la période"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Périodes actives</Label>
            {unavailabilityPeriods.length > 0 ? (
              <div className="space-y-2">
                {unavailabilityPeriods.map((period) => (
                  <div
                    key={period.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getTypeVariant(period.type)}>
                          {getTypeLabel(period.type)}
                        </Badge>
                        <span className="font-medium">
                          {period.reason || getDefaultReason(period.type)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Du{" "}
                        {new Date(period.startDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        au{" "}
                        {new Date(period.endDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Supprimer la période d'indisponibilité"
                      onClick={() => handleDeletePeriod(period.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  Aucune période d&apos;indisponibilité définie
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Horaires de la semaine</CardTitle>
          <CardDescription>
            Cochez les jours travaillés et définissez vos heures d&apos;ouverture (créneaux de 2h).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS.map((day) => {
            const state = schedule.find((s) => s.dayOfWeek === day.dayOfWeek)!
            return (
              <div
                key={day.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0 sm:min-w-[150px]">
                  <Switch
                    id={`active-${day.id}`}
                    checked={state.isActive}
                    onCheckedChange={(checked) =>
                      updateDay(day.dayOfWeek, { isActive: checked })
                    }
                  />
                  <Label
                    htmlFor={`active-${day.id}`}
                    className="font-medium text-base cursor-pointer"
                  >
                    {day.label}
                  </Label>
                </div>

                <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                  <Select
                    value={state.startTime}
                    disabled={!state.isActive}
                    onValueChange={(val) => updateDay(day.dayOfWeek, { startTime: val })}
                  >
                    <SelectTrigger className="w-full sm:w-[110px]">
                      <SelectValue placeholder="Début" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((h) => (
                        <SelectItem key={`start-${day.id}-${h}`} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground shrink-0">-</span>
                  <Select
                    value={state.endTime}
                    disabled={!state.isActive}
                    onValueChange={(val) => updateDay(day.dayOfWeek, { endTime: val })}
                  >
                    <SelectTrigger className="w-full sm:w-[110px]">
                      <SelectValue placeholder="Fin" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((h) => (
                        <SelectItem key={`end-${day.id}-${h}`} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )
          })}
        </CardContent>
        <CardContent className="border-t pt-6">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSchedule(buildInitialSchedule(initialSlots))}
              disabled={isSavingSchedule}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleSaveSchedule}
              disabled={isSavingSchedule}
            >
              {isSavingSchedule ? "Enregistrement..." : "Enregistrer les horaires"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
