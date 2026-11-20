"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
  bookedSlots?: Array<{ date: string; timeSlot: string }>
  availabilityStatus?: AvailabilityStatusType
}

const DEFAULT_TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
]

function toIsoDay(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  proTimeSlots = [],
  unavailabilities = [],
  bookedSlots = [],
  availabilityStatus = "AVAILABLE",
}: DateTimePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = toIsoDay(today)

  const hasCustomSlots = proTimeSlots.length > 0
  const activeDaysOfWeek = new Set(
    proTimeSlots.filter((s) => s.isAvailable).map((s) => s.dayOfWeek)
  )

  const isDateDisabled = (date: Date) => {
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)

    if (dayStart < today) return true
    if (availabilityStatus === "OFFLINE") return true

    const dayIso = toIsoDay(dayStart)
    if (availabilityStatus === "BUSY_TODAY" && dayIso === todayIso) {
      return true
    }

    if (hasCustomSlots) {
      if (!activeDaysOfWeek.has(dayStart.getDay())) return true
    } else if (dayStart.getDay() === 0) {
      return true
    }

    for (const u of unavailabilities) {
      const start = u.startDate.split("T")[0]
      const end = u.endDate.split("T")[0]
      if (dayIso >= start && dayIso <= end) {
        return true
      }
    }

    return false
  }

  const slotsForSelectedDate = (() => {
    if (!selectedDate) return []
    if (!hasCustomSlots) return DEFAULT_TIME_SLOTS

    const daySlots = proTimeSlots
      .filter((s) => s.dayOfWeek === selectedDate.getDay() && s.isAvailable)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map((s) => `${s.startTime} - ${s.endTime}`)

    return daySlots.length > 0 ? daySlots : DEFAULT_TIME_SLOTS
  })()

  const selectedIso = selectedDate ? toIsoDay(selectedDate) : ""
  const reservedForDate = new Set(
    bookedSlots
      .filter((b) => b.date === selectedIso)
      .map((b) => b.timeSlot)
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choisissez une date</CardTitle>
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

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choisissez un créneau horaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {slotsForSelectedDate.map((slotLabel) => {
                const isBooked = reservedForDate.has(slotLabel)
                return (
                  <Button
                    key={slotLabel}
                    type="button"
                    disabled={isBooked}
                    variant={selectedTime === slotLabel ? "default" : "outline"}
                    className={cn(
                      "w-full h-auto min-h-10 py-2 whitespace-normal text-xs sm:text-sm",
                      selectedTime === slotLabel && "ring-2 ring-primary ring-offset-2",
                      isBooked && "opacity-50 line-through"
                    )}
                    onClick={() => onTimeChange(slotLabel)}
                  >
                    {isBooked ? `${slotLabel} (Réservé)` : slotLabel}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
