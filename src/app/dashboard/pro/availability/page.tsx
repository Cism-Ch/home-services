import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/server/auth-guard"
import { AvailabilityClient } from "./availability-client"
import type {
  AvailabilityStatusType,
  CatalogTimeSlot,
  CatalogUnavailability,
} from "@/lib/types/catalog"

export const dynamic = "force-dynamic"

export default async function ProAvailabilityPage() {
  const { user } = await requireRole(["pro", "admin"])

  const proProfile = await prisma.proProfile.findUnique({
    where: { userId: user.id },
    include: {
      timeSlots: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
      unavailabilities: {
        orderBy: { startDate: "asc" },
      },
    },
  })

  if (!proProfile) {
    redirect("/dashboard/pro/profile")
  }

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
      initialSlots={initialSlots}
      initialUnavailabilities={initialUnavailabilities}
    />
  )
}
