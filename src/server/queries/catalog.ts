/**
 * Requetes serveur Prisma (RSC) pour le catalogue public, la recherche GEO et la fiche prestataire
 */

import { prisma } from "@/lib/prisma"
import type {
  AvailabilityStatusType,
  CatalogCategory,
  CatalogProfessional,
  CatalogReview,
  CatalogService,
  CatalogTimeSlot,
  CatalogUnavailability,
} from "@/lib/types/catalog"

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  plomberie: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
  electricite: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
  climatisation: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
  menage: "https://images.unsplash.com/photo-1581578731117-104f2a41272c?w=800&q=80",
  peinture: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
  demenagement: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=80",
  securite: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
  menuiserie: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
  maconnerie: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  jardinage: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80",
}

export function getServiceFallbackImage(
  categoryId: string,
  portfolioImages?: string[]
): string {
  if (portfolioImages && portfolioImages.length > 0) {
    return portfolioImages[0]
  }
  return (
    CATEGORY_FALLBACK_IMAGES[categoryId] ||
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
  )
}

function getSubscriptionPriorityRank(
  subscriptions: Array<{ plan: string; status: string }>
): number {
  let rank = 0
  for (const sub of subscriptions) {
    if (sub.status !== "ACTIVE" && sub.status !== "TRIALING") continue
    if (sub.plan === "PRO_ENTERPRISE") rank = Math.max(rank, 3)
    else if (sub.plan === "PRO_PREMIUM") rank = Math.max(rank, 2)
    else if (sub.plan === "PRO_STANDARD") rank = Math.max(rank, 1)
  }
  return rank
}

function normalizeAvailability(raw: string): AvailabilityStatusType {
  if (raw === "BUSY_TODAY") return "BUSY_TODAY"
  if (raw === "OFFLINE") return "OFFLINE"
  return "AVAILABLE"
}

function formatLocationLabel(
  cityName?: string | null,
  commune?: string | null
): string {
  if (cityName) return cityName
  if (commune) return commune
  return "Abidjan - Côte d'Ivoire"
}

function formatRelativeDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export async function getPublicCategories(): Promise<CatalogCategory[]> {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  })
}

export async function getPublicServices(): Promise<CatalogService[]> {
  const rows = await prisma.service.findMany({
    where: { isActive: true },
    include: {
      category: true,
      proProfile: {
        include: {
          city: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              subscriptions: {
                where: { status: { in: ["ACTIVE", "TRIALING"] } },
                select: { plan: true, status: true },
              },
            },
          },
        },
      },
    },
  })

  const sorted = [...rows].sort((a, b) => {
    const rankA = getSubscriptionPriorityRank(a.proProfile.user.subscriptions)
    const rankB = getSubscriptionPriorityRank(b.proProfile.user.subscriptions)
    if (rankA !== rankB) return rankB - rankA
    if (a.proProfile.isVerified !== b.proProfile.isVerified) {
      return a.proProfile.isVerified ? -1 : 1
    }
    return b.proProfile.rating - a.proProfile.rating
  })

  return sorted.map((row) => ({
    id: row.id,
    proProfileId: row.proProfile.id,
    proUserId: row.proProfile.userId,
    title: row.title,
    description: row.description,
    categoryId: row.categoryId,
    categoryName: row.category.name,
    price: row.price,
    duration: row.duration,
    rating: row.proProfile.rating,
    reviewsCount: row.proProfile.reviewsCount,
    providerName: row.proProfile.user.name,
    providerAvatar: row.proProfile.user.image,
    location: formatLocationLabel(row.proProfile.city?.name, row.proProfile.commune),
    cityId: row.proProfile.cityId,
    image: getServiceFallbackImage(row.categoryId, row.proProfile.portfolioImages),
    isActive: row.isActive,
    availabilityStatus: normalizeAvailability(row.proProfile.availabilityStatus),
  }))
}

export async function getPublicProfessionals(): Promise<CatalogProfessional[]> {
  const profiles = await prisma.proProfile.findMany({
    include: {
      city: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          subscriptions: {
            where: { status: { in: ["ACTIVE", "TRIALING"] } },
            select: { plan: true, status: true },
          },
        },
      },
      services: {
        where: { isActive: true },
        include: { category: true },
      },
    },
  })

  const sorted = [...profiles].sort((a, b) => {
    const rankA = getSubscriptionPriorityRank(a.user.subscriptions)
    const rankB = getSubscriptionPriorityRank(b.user.subscriptions)
    if (rankA !== rankB) return rankB - rankA
    if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1
    return b.rating - a.rating
  })

  return sorted.map((p) => {
    const rank = getSubscriptionPriorityRank(p.user.subscriptions)
    const location = formatLocationLabel(p.city?.name, p.commune)

    return {
      id: p.id,
      userId: p.userId,
      name: p.user.name,
      title: p.headline,
      avatar: p.user.image,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      completedTasks: p.completedTasks,
      location,
      cityId: p.cityId,
      commune: p.commune,
      phoneNumber: p.phoneNumber,
      whatsappNumber: p.whatsappNumber,
      availabilityStatus: normalizeAvailability(p.availabilityStatus),
      isVerified: p.isVerified,
      bio: p.bio,
      languages: p.languages.length > 0 ? p.languages : ["Français"],
      yearsOfExperience: p.yearsOfExperience,
      experienceLabel: `${p.yearsOfExperience} ans`,
      portfolioImages: p.portfolioImages,
      isPremiumBoosted: rank >= 2,
      services: p.services.map((s) => ({
        id: s.id,
        proProfileId: p.id,
        proUserId: p.userId,
        title: s.title,
        description: s.description,
        categoryId: s.categoryId,
        categoryName: s.category.name,
        price: s.price,
        duration: s.duration,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        providerName: p.user.name,
        providerAvatar: p.user.image,
        location,
        cityId: p.cityId,
        image: getServiceFallbackImage(s.categoryId, p.portfolioImages),
        isActive: s.isActive,
        availabilityStatus: normalizeAvailability(p.availabilityStatus),
      })),
    }
  })
}

export async function getProfessionalDetail(
  proIdOrUserId: string
): Promise<{
  professional: CatalogProfessional
  services: CatalogService[]
  reviews: CatalogReview[]
  timeSlots: CatalogTimeSlot[]
  unavailabilities: CatalogUnavailability[]
} | null> {
  const profile = await prisma.proProfile.findFirst({
    where: {
      OR: [{ id: proIdOrUserId }, { userId: proIdOrUserId }],
    },
    include: {
      city: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          reviewsReceived: {
            where: { isModerated: true, isReported: false },
            include: {
              author: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
          },
          subscriptions: {
            where: { status: { in: ["ACTIVE", "TRIALING"] } },
            select: { plan: true, status: true },
          },
        },
      },
      services: {
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      },
      timeSlots: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
      unavailabilities: {
        orderBy: { startDate: "asc" },
      },
    },
  })

  if (!profile) {
    return null
  }

  const location = formatLocationLabel(profile.city?.name, profile.commune)

  const mappedServices: CatalogService[] = profile.services.map((s) => ({
    id: s.id,
    proProfileId: profile.id,
    proUserId: profile.userId,
    title: s.title,
    description: s.description,
    categoryId: s.categoryId,
    categoryName: s.category.name,
    price: s.price,
    duration: s.duration,
    rating: profile.rating,
    reviewsCount: profile.reviewsCount,
    providerName: profile.user.name,
    providerAvatar: profile.user.image,
    location,
    cityId: profile.cityId,
    image: getServiceFallbackImage(s.categoryId, profile.portfolioImages),
    isActive: s.isActive,
    availabilityStatus: normalizeAvailability(profile.availabilityStatus),
  }))

  const mappedReviews: CatalogReview[] = profile.user.reviewsReceived.map((r) => ({
    id: r.id,
    bookingId: r.bookingId,
    authorName: r.author.name,
    rating: r.rating,
    dateLabel: formatRelativeDate(r.createdAt),
    comment: r.comment,
    authorType:
      r.authorType === "PRO_TO_CLIENT" ? "PRO_TO_CLIENT" : "CLIENT_TO_PRO",
  }))

  const mappedSlots: CatalogTimeSlot[] = profile.timeSlots.map((slot) => ({
    id: slot.id,
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isAvailable: slot.isAvailable,
  }))

  const mappedUnavailabilities: CatalogUnavailability[] =
    profile.unavailabilities.map((u) => ({
      id: u.id,
      type:
        u.type === "vacation" || u.type === "sick" ? u.type : "other",
      startDate: u.startDate.toISOString(),
      endDate: u.endDate.toISOString(),
      reason: u.reason,
    }))

  const professional: CatalogProfessional = {
    id: profile.id,
    userId: profile.userId,
    name: profile.user.name,
    title: profile.headline,
    avatar: profile.user.image,
    rating: profile.rating,
    reviewsCount: profile.reviewsCount,
    completedTasks: profile.completedTasks,
    location,
    cityId: profile.cityId,
    commune: profile.commune,
    phoneNumber: profile.phoneNumber,
    whatsappNumber: profile.whatsappNumber,
    availabilityStatus: normalizeAvailability(profile.availabilityStatus),
    isVerified: profile.isVerified,
    bio: profile.bio,
    languages: profile.languages.length > 0 ? profile.languages : ["Français"],
    yearsOfExperience: profile.yearsOfExperience,
    experienceLabel: `${profile.yearsOfExperience} ans`,
    portfolioImages: profile.portfolioImages,
    isPremiumBoosted:
      getSubscriptionPriorityRank(profile.user.subscriptions) >= 2,
    services: mappedServices,
    reviews: mappedReviews,
  }

  return {
    professional,
    services: mappedServices,
    reviews: mappedReviews,
    timeSlots: mappedSlots,
    unavailabilities: mappedUnavailabilities,
  }
}

export async function getBookingContext(
  proIdOrUserId: string,
  serviceId: string
): Promise<{
  professional: CatalogProfessional
  service: CatalogService
  timeSlots: CatalogTimeSlot[]
  unavailabilities: CatalogUnavailability[]
  bookedSlots: Array<{ date: string; timeSlot: string }>
} | null> {
  const detail = await getProfessionalDetail(proIdOrUserId)
  if (!detail) return null

  const service = detail.services.find((s) => s.id === serviceId)
  if (!service) return null

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const activeBookings = await prisma.booking.findMany({
    where: {
      proId: detail.professional.userId,
      status: { in: ["NEGOTIATING", "IN_PROGRESS"] },
      bookingDate: { gte: startOfToday },
    },
    select: {
      bookingDate: true,
      timeSlot: true,
    },
  })

  return {
    professional: detail.professional,
    service,
    timeSlots: detail.timeSlots,
    unavailabilities: detail.unavailabilities,
    bookedSlots: activeBookings.map((b) => ({
      date: b.bookingDate.toISOString().split("T")[0],
      timeSlot: b.timeSlot,
    })),
  }
}
