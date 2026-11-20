import type { Prisma } from "@prisma/client"
import {
  normalizeMaxConcurrent,
  normalizeOrganizationType,
  toIsoDayKey,
} from "@/lib/scheduling"
import type { AvailabilityStatusType } from "@/lib/types/catalog"

interface SyncProAvailabilityParams {
  proUserId: string
  proProfileId: string
  currentAvailabilityStatus: string
  organizationType: string
  maxConcurrentProjects: number
  excludeBookingId?: string
  markBusyWhenSaturated?: boolean
}

/**
 * Synchronise le statut disponible / occupe d'un profil prestataire en fonction
 * du nombre de chantiers actifs aujourd'hui face a sa capacite configuree (1..N places).
 */
export async function syncProAvailabilityFromCapacity(
  tx: Prisma.TransactionClient,
  params: SyncProAvailabilityParams
): Promise<AvailabilityStatusType> {
  const todayKey = toIsoDayKey(new Date())
  const todayStart = new Date(`${todayKey}T00:00:00.000Z`)
  const todayEnd = new Date(`${todayKey}T23:59:59.999Z`)

  const maxPlaces = normalizeMaxConcurrent(
    normalizeOrganizationType(params.organizationType),
    params.maxConcurrentProjects
  )

  const activeTodayCount = await tx.booking.count({
    where: {
      proId: params.proUserId,
      status: "IN_PROGRESS",
      bookingDate: { lte: todayEnd },
      endDate: { gte: todayStart },
      ...(params.excludeBookingId ? { id: { not: params.excludeBookingId } } : {}),
    },
  })

  if (params.currentAvailabilityStatus === "OFFLINE") {
    return "OFFLINE"
  }

  let nextStatus: AvailabilityStatusType =
    params.currentAvailabilityStatus === "BUSY_TODAY" ? "BUSY_TODAY" : "AVAILABLE"

  if (activeTodayCount >= maxPlaces) {
    nextStatus = params.markBusyWhenSaturated ? "BUSY_TODAY" : nextStatus
  } else if (activeTodayCount < maxPlaces && params.currentAvailabilityStatus === "BUSY_TODAY") {
    nextStatus = "AVAILABLE"
  }

  if (nextStatus !== params.currentAvailabilityStatus) {
    await tx.proProfile.update({
      where: { id: params.proProfileId },
      data: { availabilityStatus: nextStatus },
    })
  }

  return nextStatus
}
