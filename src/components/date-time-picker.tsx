"use client"

import { Calendar } from "@/components/ui/calendar"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { EASE_OUT_EXPO } from "@/lib/motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarRange, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DURATION_UNIT_LABELS,
  DURATION_UNIT_LIMITS,
  computeAvailablePlaces,
  computeBookingEndDate,
  formatDurationLabel,
  formatOrganizationBadge,
  hasUnavailabilityOverlap,
  isMultiDayDuration,
  toIsoDayKey,
  type ActiveBookingSpan,
  type DurationUnit,
  type OrganizationType,
} from "@/lib/scheduling"
import type {
  AvailabilityStatusType,
  CatalogTimeSlot,
  CatalogUnavailability,
} from "@/lib/types/catalog"

interface DateTimePickerProps {
  selectedDate?: Date
  selectedTime?: string
  onDateChange: (date: Date | undefined) => void
  onTimeChange: (time: string) => void
  proTimeSlots?: CatalogTimeSlot[]
  unavailabilities?: CatalogUnavailability[]
  bookedSlots?: ActiveBookingSpan[]
  availabilityStatus?: AvailabilityStatusType
  organizationType?: OrganizationType
  maxConcurrentProjects?: number
  durationUnit: DurationUnit
  durationValue: number
  onDurationUnitChange?: (unit: DurationUnit) => void
  onDurationValueChange?: (value: number) => void
}

const DEFAULT_TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
]

const DURATION_UNITS: DurationUnit[] = [
  "MINUTES",
  "HOURS",
  "DAYS",
  "WEEKS",
  "MONTHS",
]

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  proTimeSlots = [],
  unavailabilities = [],
  bookedSlots = [],
  availabilityStatus = "AVAILABLE",
  organizationType = "INDIVIDUAL",
  maxConcurrentProjects = 1,
  durationUnit,
  durationValue,
  onDurationUnitChange,
  onDurationValueChange,
}: DateTimePickerProps) {
  const prefersReducedMotion = useReducedMotion()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = toIsoDayKey(today)

  const hasCustomSlots = proTimeSlots.length > 0
  const activeDaysOfWeek = new Set(
    proTimeSlots.filter((s) => s.isAvailable).map((s) => s.dayOfWeek)
  )

  const getSlotsForDayOfWeek = (dayOfWeek: number): string[] => {
    if (!hasCustomSlots) return DEFAULT_TIME_SLOTS
    const daySlots = proTimeSlots
      .filter((s) => s.dayOfWeek === dayOfWeek && s.isAvailable)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map((s) => `${s.startTime} - ${s.endTime}`)
    return daySlots.length > 0 ? daySlots : DEFAULT_TIME_SLOTS
  }

  const isDateDisabled = (date: Date) => {
    const dayKey = toIsoDayKey(date)
    if (!dayKey || dayKey < todayKey) return true
    if (availabilityStatus === "OFFLINE") return true
    if (availabilityStatus === "BUSY_TODAY" && dayKey === todayKey) {
      return true
    }

    if (hasCustomSlots) {
      if (!activeDaysOfWeek.has(date.getDay())) return true
    } else if (date.getDay() === 0) {
      return true
    }

    const rangeEnd = computeBookingEndDate(dayKey, durationValue, durationUnit)
    if (hasUnavailabilityOverlap(dayKey, rangeEnd, unavailabilities)) {
      return true
    }

    const slotsForDay = getSlotsForDayOfWeek(date.getDay())
    const allSlotsFull = slotsForDay.every(
      (slotLabel) =>
        computeAvailablePlaces({
          maxConcurrentProjects,
          startDate: dayKey,
          endDate: rangeEnd,
          timeSlot: slotLabel,
          durationUnit,
          durationValue,
          activeBookings: bookedSlots,
        }).isFull
    )

    return allSlotsFull
  }

  const selectedKey = selectedDate ? toIsoDayKey(selectedDate) : ""
  const computedEndDate = selectedKey
    ? computeBookingEndDate(selectedKey, durationValue, durationUnit)
    : undefined

  const slotsForSelectedDate = selectedDate
    ? getSlotsForDayOfWeek(selectedDate.getDay())
    : []

  const limits = DURATION_UNIT_LIMITS[durationUnit]
  const multiDay = isMultiDayDuration(durationValue, durationUnit)

  const formatFrDate = (d: Date | string) => {
    const key = toIsoDayKey(d)
    if (!key) return ""
    const [y, m, day] = key.split("-").map((n) => parseInt(n, 10))
    return new Date(Date.UTC(y, m - 1, day, 12, 0, 0)).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  }

  const handleUnitChange = (nextUnit: DurationUnit) => {
    onDurationUnitChange?.(nextUnit)
    const nextLimits = DURATION_UNIT_LIMITS[nextUnit]
    if (durationValue < nextLimits.min || durationValue > nextLimits.max) {
      onDurationValueChange?.(nextLimits.min)
    }
    onTimeChange("")
  }

  const handleValueChange = (raw: string) => {
    const parsed = parseInt(raw, 10)
    if (Number.isNaN(parsed)) return
    const clamped = Math.max(limits.min, Math.min(limits.max, parsed))
    onDurationValueChange?.(clamped)
    onTimeChange("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Durée du projet &amp; places disponibles
            </CardTitle>
            <Badge variant="secondary" className="gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              {formatOrganizationBadge(organizationType, maxConcurrentProjects)}
            </Badge>
          </div>
          <CardDescription>
            Ajustez si besoin la durée prévue (quelques heures, plusieurs jours, semaines ou mois). Les places disponibles se calculent sur toute la période.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-duration-value">Durée estimée</Label>
              <Input
                id="booking-duration-value"
                type="number"
                min={limits.min}
                max={limits.max}
                step={limits.step}
                value={durationValue}
                onChange={(e) => handleValueChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-duration-unit">Échelle de temps</Label>
              <Select
                value={durationUnit}
                onValueChange={(val) => handleUnitChange(val as DurationUnit)}
              >
                <SelectTrigger id="booking-duration-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_UNITS.map((unitKey) => (
                    <SelectItem key={unitKey} value={unitKey}>
                      {DURATION_UNIT_LABELS[unitKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 border px-3 py-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">
              Durée retenue :{" "}
              <strong className="text-foreground">
                {formatDurationLabel(durationValue, durationUnit)}
              </strong>
            </span>
            {selectedKey && computedEndDate && (
              <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                <CalendarRange className="h-3.5 w-3.5 shrink-0" />
                {multiDay
                  ? `Du ${formatFrDate(selectedKey)} au ${formatFrDate(computedEndDate)}`
                  : formatFrDate(selectedKey)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {multiDay ? "Choisissez la date de début" : "Choisissez une date"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center overflow-x-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(nextDate) => {
              onDateChange(nextDate)
              onTimeChange("")
            }}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <AnimatePresence initial={false}>
        {selectedDate && selectedKey && computedEndDate && (
          <m.div
            key={selectedKey}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {multiDay
                    ? "Choisissez l'heure de démarrage & vérifiez les places"
                    : "Choisissez un créneau horaire"}
                </CardTitle>
                <CardDescription>
                  {multiDay
                    ? `Disponibilités vérifiées sur toute la plage du ${formatFrDate(
                        selectedKey
                      )} au ${formatFrDate(computedEndDate)}.`
                    : `Places calculées pour le ${formatFrDate(selectedKey)}.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {slotsForSelectedDate.map((slotLabel) => {
                    const avail = computeAvailablePlaces({
                      maxConcurrentProjects,
                      startDate: selectedKey,
                      endDate: computedEndDate,
                      timeSlot: slotLabel,
                      durationUnit,
                      durationValue,
                      activeBookings: bookedSlots,
                    })
                    const isSelected = selectedTime === slotLabel

                    return (
                      <Button
                        key={slotLabel}
                        type="button"
                        disabled={avail.isFull}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "w-full h-auto min-h-12 py-2.5 px-3 flex flex-col items-center justify-center gap-1 whitespace-normal text-xs sm:text-sm",
                          isSelected && "ring-2 ring-primary ring-offset-2",
                          avail.isFull && "opacity-55"
                        )}
                        onClick={() => onTimeChange(slotLabel)}
                      >
                        <span className={cn("font-semibold", avail.isFull && "line-through")}>
                          {slotLabel}
                        </span>
                        <span
                          className={cn(
                            "text-[11px]",
                            isSelected
                              ? "text-primary-foreground/90"
                              : avail.isFull
                              ? "text-destructive"
                              : "text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {avail.isFull
                            ? `Complet (0/${avail.maxPlaces})`
                            : avail.maxPlaces > 1
                            ? `${avail.availablePlaces}/${avail.maxPlaces} places`
                            : "Libre (1/1)"}
                        </span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
