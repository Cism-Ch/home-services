"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { invalidateCatalogCache } from "@/lib/redis"
import {
  normalizeMaxConcurrent,
  normalizeOrganizationType,
  type OrganizationType,
} from "@/lib/scheduling"
import {
  updateProCapacitySchema,
  type UpdateProCapacityInput,
} from "@/lib/validations/pro-profile"
import { requireProProfile } from "@/server/auth-guard"
import { syncProAvailabilityFromCapacity } from "@/server/helpers/availability-sync"
import type { CatalogTimeSlot, CatalogUnavailability } from "@/lib/types/catalog"

export interface ServerActionResponse<T> {
  data: T | null
  error: string | null
}

const periodIdSchema = z.string().trim().min(1, "Identifiant de période invalide").max(120)

const timeSlotItemSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format heure invalide (HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format heure invalide (HH:MM)"),
  isAvailable: z.boolean(),
})

const saveScheduleSchema = z.array(timeSlotItemSchema).max(60)

const unavailabilitySchema = z
  .object({
    type: z.enum(["vacation", "sick", "other"]),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    reason: z.string().trim().max(200).optional(),
  })
  .refine(
    (data) => new Date(data.endDate).getTime() >= new Date(data.startDate).getTime(),
    { message: "La date de fin doit être postérieure ou égale à la date de début." }
  )

/**
 * Enregistre la grille hebdomadaire de creneaux horaires du prestataire dans Prisma
 */
export async function saveProTimeSlotsAction(
  slots: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
    isAvailable: boolean
  }>
): Promise<ServerActionResponse<CatalogTimeSlot[]>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = saveScheduleSchema.safeParse(slots)
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message || "Créneaux horaires invalides",
    }
  }

  try {
    const proProfileId = authRes.proProfile.id
    const createdSlots = await prisma.$transaction(async (tx) => {
      await tx.timeSlot.deleteMany({
        where: { proProfileId },
      })

      if (parsed.data.length > 0) {
        await tx.timeSlot.createMany({
          data: parsed.data.map((slot) => ({
            proProfileId,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.isAvailable,
          })),
        })
      }

      return tx.timeSlot.findMany({
        where: { proProfileId },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      })
    })

    revalidatePath("/dashboard/pro/availability")
    revalidatePath(`/professionals/pros/${proProfileId}`)

    return {
      data: createdSlots.map((s) => ({
        id: s.id,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable,
      })),
      error: null,
    }
  } catch (err) {
    console.error("[availability] saveProTimeSlots error:", err)
    return {
      data: null,
      error: "Erreur lors de l'enregistrement des créneaux.",
    }
  }
}

/**
 * Ajoute une periode d'indisponibilite exceptionnelle (conge, maladie, autre)
 */
export async function addUnavailabilityPeriodAction(input: {
  type: "vacation" | "sick" | "other"
  startDate: string
  endDate: string
  reason?: string
}): Promise<ServerActionResponse<CatalogUnavailability>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = unavailabilitySchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error: parsed.error.issues[0]?.message || "Période d'indisponibilité invalide",
    }
  }

  try {
    const created = await prisma.unavailabilityPeriod.create({
      data: {
        proProfileId: authRes.proProfile.id,
        type: parsed.data.type,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        reason: parsed.data.reason || null,
      },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/availability")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)
    return {
      data: {
        id: created.id,
        type: parsed.data.type,
        startDate: created.startDate.toISOString(),
        endDate: created.endDate.toISOString(),
        reason: created.reason,
      },
      error: null,
    }
  } catch (err) {
    console.error("[availability] addUnavailabilityPeriod error:", err)
    return {
      data: null,
      error: "Erreur lors de l'ajout de l'indisponibilité.",
    }
  }
}

/**
 * Supprime une periode d'indisponibilite apres verification de propriete
 */
export async function deleteUnavailabilityPeriodAction(
  periodId: string
): Promise<ServerActionResponse<{ id: string }>> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsedId = periodIdSchema.safeParse(periodId)
  if (!parsedId.success) {
    return { data: null, error: "Identifiant d'indisponibilité invalide." }
  }

  try {
    const existing = await prisma.unavailabilityPeriod.findUnique({
      where: { id: parsedId.data },
      select: { proProfileId: true },
    })

    if (!existing) {
      return { data: null, error: "Période d'indisponibilité introuvable." }
    }

    if (
      existing.proProfileId !== authRes.proProfile.id &&
      authRes.user.userType !== "admin"
    ) {
      return { data: null, error: "Accès refusé pour supprimer cette période." }
    }

    await prisma.unavailabilityPeriod.delete({
      where: { id: parsedId.data },
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro/availability")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)
    return { data: { id: parsedId.data }, error: null }
  } catch (err) {
    console.error("[availability] deleteUnavailabilityPeriod error:", err)
    return {
      data: null,
      error: "Erreur lors de la suppression de l'indisponibilité.",
    }
  }
}

/**
 * Configure le type d'organisation (Artisan solo / Equipe / PME) et la capacite simultanee (1..N places)
 */
export async function updateProCapacityAction(
  input: UpdateProCapacityInput
): Promise<
  ServerActionResponse<{
    organizationType: OrganizationType
    maxConcurrentProjects: number
  }>
> {
  const authRes = await requireProProfile()
  if (authRes.error !== null) {
    return { data: null, error: authRes.error }
  }

  const parsed = updateProCapacitySchema.safeParse(input)
  if (!parsed.success) {
    return {
      data: null,
      error:
        parsed.error.issues[0]?.message ||
        "Paramètres de capacité simultanée invalides.",
    }
  }

  try {
    const orgType = normalizeOrganizationType(parsed.data.organizationType)
    const maxPlaces = normalizeMaxConcurrent(
      orgType,
      parsed.data.maxConcurrentProjects
    )

    await prisma.$transaction(async (tx) => {
      const updated = await tx.proProfile.update({
        where: { id: authRes.proProfile.id },
        data: {
          organizationType: orgType,
          maxConcurrentProjects: maxPlaces,
        },
        select: {
          id: true,
          userId: true,
          availabilityStatus: true,
          organizationType: true,
          maxConcurrentProjects: true,
        },
      })

      await syncProAvailabilityFromCapacity(tx, {
        proUserId: updated.userId,
        proProfileId: updated.id,
        currentAvailabilityStatus: updated.availabilityStatus,
        organizationType: updated.organizationType,
        maxConcurrentProjects: updated.maxConcurrentProjects,
      })
    })

    await invalidateCatalogCache()
    revalidatePath("/dashboard/pro")
    revalidatePath("/dashboard/pro/availability")
    revalidatePath("/dashboard/pro/schedule")
    revalidatePath("/professionals")
    revalidatePath(`/professionals/pros/${authRes.proProfile.id}`)

    return {
      data: {
        organizationType: orgType,
        maxConcurrentProjects: maxPlaces,
      },
      error: null,
    }
  } catch (err) {
    console.error("[availability] updateProCapacity error:", err)
    return {
      data: null,
      error: "Erreur lors de la mise à jour de la capacité simultanée.",
    }
  }
}
