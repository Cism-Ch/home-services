import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/server/auth-guard"
import { AvailabilityClient } from "./availability-client"
import {
  normalizeMaxConcurrent,
  normalizeOrganizationType,
  toIsoDayKey,
} from "@/lib/scheduling"
import type {
  AvailabilityStatusType,
  CatalogTimeSlot,
  CatalogUnavailability,
} from "@/lib/types/catalog"

export const dynamic = "force-dynamic"

export default async function ProAvailabilityPage() {
  const { user } = await requireRole(["pro", "admin"])

  const todayKey = toIsoDayKey(new Date())
  const todayStart = new Date(`${todayKey}T00:00:00.000Z`)
  const todayEnd = new Date(`${todayKey}T23:59:59.999Z`)

  const [proProfile, activeProjectsToday] = await Promise.all([
    prisma.proProfile.findUnique({
      where: { userId: user.id },
      include: {
        timeSlots: {
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        unavailabilities: {
          orderBy: { startDate: "asc" },
        },
      },
    }),
    prisma.booking.count({
      where: {
        proId: user.id,
        status: { in: ["NEGOTIATING", "IN_PROGRESS"] },
        bookingDate: { lte: todayEnd },
        endDate: { gte: todayStart },
      },
    }),
  ])

  if (!proProfile) {
    redirect("/dashboard/pro/profile")
  }

  const initialOrganizationType = normalizeOrganizationType(
    proProfile.organizationType
  )
  const initialMaxConcurrentProjects = normalizeMaxConcurrent(
    initialOrganizationType,
    proProfile.maxConcurrentProjects
  )

  const initialSlots: CatalogTimeSlot[] = proProfile.timeSlots.map((s) => ({
    id: s.id,
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime,
    endTime: s.endTime,
    isAvailable: s.isAvailable,
  }))

  const initialUnavailabilities: CatalogUnavailability[] =
    proProfile.unavailabilities.map((u) => ({
      id: u.id,
      type: u.type === "vacation" || u.type === "sick" ? u.type : "other",
      startDate: u.startDate.toISOString(),
      endDate: u.endDate.toISOString(),
      reason: u.reason,
    }))

  const initialStatus: AvailabilityStatusType =
    proProfile.availabilityStatus === "BUSY_TODAY"
      ? "BUSY_TODAY"
      : proProfile.availabilityStatus === "OFFLINE"
      ? "OFFLINE"
      : "AVAILABLE"

  return (
    <AvailabilityClient
      proProfileId={proProfile.id}
      initialStatus={initialStatus}
      initialOrganizationType={initialOrganizationType}
      initialMaxConcurrentProjects={initialMaxConcurrentProjects}
      activeProjectsToday={activeProjectsToday}
      initialSlots={initialSlots}
      initialUnavailabilities={initialUnavailabilities}
    />
  )
}
