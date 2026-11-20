/**
 * Moteur pur de planification multi-durees (minutes, heures, jours, semaines, mois)
 * et de capacite d'accueil simultanee (1..N chantiers/projets par artisan, equipe ou PME).
 */

export type DurationUnit = "MINUTES" | "HOURS" | "DAYS" | "WEEKS" | "MONTHS"
export type OrganizationType = "INDIVIDUAL" | "TEAM" | "PME"

export interface ActiveBookingSpan {
  id?: string
  startDate: string
  endDate: string
  timeSlot: string
  durationUnit: DurationUnit
  durationValue: number
}

export interface UnavailabilitySpan {
  startDate: string
  endDate: string
}

export interface PlaceAvailabilityResult {
  maxPlaces: number
  occupiedPlaces: number
  availablePlaces: number
  isFull: boolean
}

export const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  MINUTES: "Minutes",
  HOURS: "Heures",
  DAYS: "Jours",
  WEEKS: "Semaines",
  MONTHS: "Mois",
}

export const DURATION_UNIT_LIMITS: Record<
  DurationUnit,
  { min: number; max: number; step: number }
> = {
  MINUTES: { min: 15, max: 1440, step: 15 },
  HOURS: { min: 1, max: 24, step: 1 },
  DAYS: { min: 1, max: 365, step: 1 },
  WEEKS: { min: 1, max: 52, step: 1 },
  MONTHS: { min: 1, max: 12, step: 1 },
}

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  INDIVIDUAL: "Artisan indépendant (1 chantier max)",
  TEAM: "Groupe d'artisans / Équipe",
  PME: "PME / Entreprise multi-équipes",
}

export function normalizeDurationUnit(raw?: string | null): DurationUnit {
  switch (raw) {
    case "HOURS":
    case "DAYS":
    case "WEEKS":
    case "MONTHS":
      return raw
    case "MINUTES":
    default:
      return "MINUTES"
  }
}

export function normalizeOrganizationType(
  raw?: string | null
): OrganizationType {
  if (raw === "TEAM") return "TEAM"
  if (raw === "PME") return "PME"
  return "INDIVIDUAL"
}

export function normalizeMaxConcurrent(
  orgType: OrganizationType,
  rawMax?: number | null
): number {
  const safe = typeof rawMax === "number" && Number.isFinite(rawMax) ? Math.floor(rawMax) : 1
  if (orgType === "INDIVIDUAL") return 1
  return Math.max(2, Math.min(50, safe))
}

/**
 * Convertit une Date locale de calendrier en ISO fixe a 12:00 UTC
 * pour eviter tout decalage J-1 lie aux fuseaux horaires.
 */
export function toStableMiddayIso(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  ).toISOString()
}

/**
 * Extrait une cle calendaire canonique YYYY-MM-DD depuis une Date ou chaine ISO.
 */
export function toIsoDayKey(input: Date | string): string {
  if (typeof input === "string") {
    const trimmed = input.trim()
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 10)
    }
    const parsed = new Date(trimmed)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10)
    }
    return ""
  }
  const y = input.getFullYear()
  const m = String(input.getMonth() + 1).padStart(2, "0")
  const d = String(input.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function parseIsoDayUtc(dayKey: string): Date {
  const [y, m, d] = dayKey.split("-").map((n) => parseInt(n, 10))
  return new Date(Date.UTC(y || 1970, (m || 1) - 1, d || 1, 12, 0, 0, 0))
}

export function addDaysToIsoKey(dayKey: string, deltaDays: number): string {
  const dt = parseIsoDayUtc(dayKey)
  dt.setUTCDate(dt.getUTCDate() + deltaDays)
  return dt.toISOString().slice(0, 10)
}

export function isMultiDayDuration(
  value: number,
  unit: DurationUnit
): boolean {
  if (unit === "DAYS" || unit === "WEEKS" || unit === "MONTHS") return true
  if (unit === "HOURS") return value >= 8
  return value >= 480
}

export function durationToApproxMinutes(
  value: number,
  unit: DurationUnit
): number {
  const safeVal = Math.max(1, Math.round(value || 1))
  switch (unit) {
    case "MINUTES":
      return Math.max(15, safeVal)
    case "HOURS":
      return safeVal * 60
    case "DAYS":
      return safeVal * 480
    case "WEEKS":
      return safeVal * 6 * 480
    case "MONTHS":
      return safeVal * 26 * 480
  }
}

/**
 * Calcule la date de fin inclusive d'une intervention a partir de sa date de debut et de sa duree.
 */
export function computeBookingEndDate(
  startInput: Date | string,
  durationValue: number,
  durationUnit: DurationUnit
): Date {
  const startKey = toIsoDayKey(startInput) || toIsoDayKey(new Date())
  const safeValue = Math.max(1, Math.floor(durationValue || 1))

  let endKey = startKey

  if (durationUnit === "DAYS") {
    endKey = addDaysToIsoKey(startKey, safeValue - 1)
  } else if (durationUnit === "WEEKS") {
    endKey = addDaysToIsoKey(startKey, safeValue * 7 - 1)
  } else if (durationUnit === "MONTHS") {
    const dt = parseIsoDayUtc(startKey)
    dt.setUTCMonth(dt.getUTCMonth() + safeValue)
    dt.setUTCDate(dt.getUTCDate() - 1)
    endKey = dt.toISOString().slice(0, 10)
  } else if (isMultiDayDuration(safeValue, durationUnit)) {
    const approxDays = Math.max(
      1,
      Math.ceil(durationToApproxMinutes(safeValue, durationUnit) / 480)
    )
    endKey = addDaysToIsoKey(startKey, approxDays - 1)
  }

  const [y, m, d] = endKey.split("-").map((n) => parseInt(n, 10))
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999))
}

export function hasUnavailabilityOverlap(
  startInput: Date | string,
  endInput: Date | string,
  unavailabilities: UnavailabilitySpan[]
): boolean {
  const startKey = toIsoDayKey(startInput)
  const endKey = toIsoDayKey(endInput) || startKey
  if (!startKey) return false

  return unavailabilities.some((u) => {
    const uStart = toIsoDayKey(u.startDate)
    const uEnd = toIsoDayKey(u.endDate)
    if (!uStart || !uEnd) return false
    return startKey <= uEnd && endKey >= uStart
  })
}

function parseTimeRangeMinutes(slot: string): [number, number] | null {
  const match = slot.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/)
  if (!match) return null
  const start = parseInt(match[1], 10) * 60 + parseInt(match[2], 10)
  const end = parseInt(match[3], 10) * 60 + parseInt(match[4], 10)
  if (end <= start) return null
  return [start, end]
}

export function timeSlotsOverlap(slotA: string, slotB: string): boolean {
  const a = parseTimeRangeMinutes(slotA)
  const b = parseTimeRangeMinutes(slotB)
  if (!a || !b) return slotA.trim() === slotB.trim()
  return a[0] < b[1] && b[0] < a[1]
}

function maxConcurrentShortBookings(slots: string[]): number {
  if (slots.length === 0) return 0
  if (slots.length === 1) return 1

  const events: Array<{ t: number; delta: number }> = []
  for (const s of slots) {
    const range = parseTimeRangeMinutes(s)
    if (!range) {
      return slots.length
    }
    events.push({ t: range[0], delta: 1 })
    events.push({ t: range[1], delta: -1 })
  }

  events.sort((a, b) => (a.t !== b.t ? a.t - b.t : a.delta - b.delta))

  let current = 0
  let peak = 0
  for (const evt of events) {
    current += evt.delta
    if (current > peak) peak = current
  }
  return peak
}

/**
 * Calcule le pic maximal d'occupation simultanee sur toute la plage candidate [startDate..endDate].
 * - Les chantiers multi-jours occupent chaque jour de leur plage.
 * - Les interventions courtes occupent uniquement leur creneau horaire (ou bloquent la concurrence sur la tranche).
 */
export function computePeakOccupancyForRange(params: {
  startDate: Date | string
  endDate: Date | string
  timeSlot?: string
  durationUnit: DurationUnit
  durationValue: number
  activeBookings: ActiveBookingSpan[]
}): number {
  const { activeBookings } = params
  if (activeBookings.length === 0) return 0

  const startKey = toIsoDayKey(params.startDate)
  const rawEndKey = toIsoDayKey(params.endDate) || startKey
  const endKey = rawEndKey >= startKey ? rawEndKey : startKey
  const candidateIsMulti = isMultiDayDuration(
    params.durationValue,
    params.durationUnit
  )

  const normalizedBookings = activeBookings
    .map((b) => {
      const bStart = toIsoDayKey(b.startDate)
      const bEndRaw = toIsoDayKey(b.endDate) || bStart
      return {
        bStart,
        bEnd: bEndRaw >= bStart ? bEndRaw : bStart,
        isMulti: isMultiDayDuration(b.durationValue, b.durationUnit),
        timeSlot: b.timeSlot,
      }
    })
    .filter((b) => b.bStart && b.bStart <= endKey && b.bEnd >= startKey)

  if (normalizedBookings.length === 0) return 0

  let peakOccupancy = 0
  let cursorKey = startKey
  let guard = 0

  while (cursorKey <= endKey && guard < 370) {
    let multiDayCountOnDay = 0
    const shortSlotsOnDay: string[] = []

    for (const b of normalizedBookings) {
      if (b.bStart <= cursorKey && b.bEnd >= cursorKey) {
        if (b.isMulti) {
          multiDayCountOnDay += 1
        } else {
          shortSlotsOnDay.push(b.timeSlot)
        }
      }
    }

    let dayOccupancy = multiDayCountOnDay
    if (candidateIsMulti) {
      dayOccupancy += maxConcurrentShortBookings(shortSlotsOnDay)
    } else if (params.timeSlot) {
      const slotOverlaps = shortSlotsOnDay.filter((s) =>
        timeSlotsOverlap(s, params.timeSlot!)
      ).length
      dayOccupancy += slotOverlaps
    } else {
      dayOccupancy += maxConcurrentShortBookings(shortSlotsOnDay)
    }

    if (dayOccupancy > peakOccupancy) {
      peakOccupancy = dayOccupancy
    }

    cursorKey = addDaysToIsoKey(cursorKey, 1)
    guard += 1
  }

  return peakOccupancy
}

export function computeAvailablePlaces(params: {
  maxConcurrentProjects: number
  startDate: Date | string
  endDate: Date | string
  timeSlot?: string
  durationUnit: DurationUnit
  durationValue: number
  activeBookings: ActiveBookingSpan[]
}): PlaceAvailabilityResult {
  const maxPlaces = Math.max(1, Math.floor(params.maxConcurrentProjects || 1))
  const occupiedPlaces = computePeakOccupancyForRange(params)
  const availablePlaces = Math.max(0, maxPlaces - occupiedPlaces)

  return {
    maxPlaces,
    occupiedPlaces,
    availablePlaces,
    isFull: availablePlaces === 0,
  }
}

export function formatDurationLabel(
  value: number,
  unit: DurationUnit
): string {
  const safeVal = Math.max(1, Math.round(value || 1))
  switch (unit) {
    case "MINUTES":
      return `${safeVal} min`
    case "HOURS":
      return `${safeVal} ${safeVal > 1 ? "heures" : "heure"}`
    case "DAYS":
      return `${safeVal} ${safeVal > 1 ? "jours" : "jour"}`
    case "WEEKS":
      return `${safeVal} ${safeVal > 1 ? "semaines" : "semaine"}`
    case "MONTHS":
      return `${safeVal} mois`
  }
}

export function formatBookingPeriodLabel(
  startIso: string,
  endIso: string | undefined,
  timeSlot: string,
  unit: DurationUnit,
  value: number
): string {
  const startKey = toIsoDayKey(startIso)
  const endKey = endIso ? toIsoDayKey(endIso) : startKey

  const fmt = (key: string) =>
    parseIsoDayUtc(key).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  if (isMultiDayDuration(value, unit) || endKey > startKey) {
    return `Du ${fmt(startKey)} au ${fmt(endKey)} • ${formatDurationLabel(value, unit)} (${timeSlot})`
  }
  return `${fmt(startKey)} • ${timeSlot} (${formatDurationLabel(value, unit)})`
}

export function formatOrganizationBadge(
  orgType: OrganizationType,
  maxConcurrent: number
): string {
  if (orgType === "INDIVIDUAL" || maxConcurrent <= 1) {
    return "Artisan solo • 1 chantier max"
  }
  const label = orgType === "PME" ? "PME" : "Équipe"
  return `${label} • ${maxConcurrent} places simultanées`
}
