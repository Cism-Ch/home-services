/**
 * Requetes serveur Prisma (RSC) pour les espaces Client et Prestataire
 */

import { prisma } from "@/lib/prisma"
import { PAYSTACK_PLANS, type SubscriptionPlanCode } from "@/lib/paystack"
import {
  normalizeDurationUnit,
  normalizeMaxConcurrent,
  normalizeOrganizationType,
  toIsoDayKey,
} from "@/lib/scheduling"
import { getServiceFallbackImage } from "@/server/queries/catalog"
import type {
  AvailabilityStatusType,
  CatalogCategory,
  CatalogService,
  DashboardBookingItem,
  DashboardSubscriptionItem,
} from "@/lib/types/catalog"

function normalizeBookingStatus(
  status: string
): DashboardBookingItem["status"] {
  if (status === "IN_PROGRESS") return "IN_PROGRESS"
  if (status === "COMPLETED") return "COMPLETED"
  if (status === "CANCELLED") return "CANCELLED"
  return "NEGOTIATING"
}

function normalizeAvailability(raw: string): AvailabilityStatusType {
  if (raw === "BUSY_TODAY") return "BUSY_TODAY"
  if (raw === "OFFLINE") return "OFFLINE"
  return "AVAILABLE"
}

export async function getClientDashboardData(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: { clientId: userId },
    include: {
      service: { include: { category: true } },
      pro: {
        select: {
          id: true,
          name: true,
          proProfile: {
            include: { city: true },
          },
        },
      },
      reviews: {
        select: { authorId: true, authorType: true },
      },
    },
    orderBy: { bookingDate: "asc" },
  })

  const items: DashboardBookingItem[] = bookings.map((b) => ({
    id: b.id,
    serviceId: b.serviceId,
    serviceTitle: b.service.title,
    categoryName: b.service.category.name,
    clientId: b.clientId,
    clientName: b.clientName,
    clientPhone: b.clientPhone,
    clientAddress: b.clientAddress,
    clientNotes: b.clientNotes,
    proUserId: b.proId,
    proProfileId: b.pro.proProfile?.id || b.proId,
    proName: b.pro.name,
    proPhone: b.pro.proProfile?.phoneNumber || "",
    proWhatsapp: b.pro.proProfile?.whatsappNumber || "",
    proLocation:
      b.pro.proProfile?.city?.name ||
      b.pro.proProfile?.commune ||
      "Abidjan - Côte d'Ivoire",
    status: normalizeBookingStatus(b.status),
    bookingDate: b.bookingDate.toISOString(),
    endDate: b.endDate.toISOString(),
    durationUnit: normalizeDurationUnit(b.durationUnit),
    durationValue: b.durationValue,
    timeSlot: b.timeSlot,
    indicativePrice: b.indicativePrice,
    createdAt: b.createdAt.toISOString(),
    hasClientReviewed: b.reviews.some(
      (r) => r.authorType === "CLIENT_TO_PRO" && r.authorId === userId
    ),
    hasProReviewed: b.reviews.some((r) => r.authorType === "PRO_TO_CLIENT"),
  }))

  const activeBookings = items.filter(
    (b) => b.status === "NEGOTIATING" || b.status === "IN_PROGRESS"
  )
  const negotiatingCount = items.filter(
    (b) => b.status === "NEGOTIATING"
  ).length
  const totalEstimatedFCFA = items
    .filter((b) => b.status !== "CANCELLED")
    .reduce((acc, cur) => acc + cur.indicativePrice, 0)

  return {
    bookings: items,
    activeBookings,
    inProgressBookings: items.filter((b) => b.status === "IN_PROGRESS"),
    stats: {
      activeCount: activeBookings.length,
      negotiatingCount,
      totalCount: items.length,
      totalEstimatedFCFA,
    },
  }
}

export async function getProDashboardData(userId: string) {
  const [proProfile, categories, bookings] = await Promise.all([
    prisma.proProfile.findUnique({
      where: { userId },
      include: {
        city: true,
        user: { select: { id: true, name: true, email: true, image: true } },
        services: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.booking.findMany({
      where: { proId: userId },
      include: {
        service: { include: { category: true } },
        client: { select: { id: true, name: true } },
        reviews: { select: { authorId: true, authorType: true } },
      },
      orderBy: { bookingDate: "asc" },
    }),
  ])

  if (!proProfile) {
    return null
  }

  const location =
    proProfile.city?.name || proProfile.commune || "Abidjan - Côte d'Ivoire"

  const mappedServices: CatalogService[] = proProfile.services.map((s) => ({
    id: s.id,
    proProfileId: proProfile.id,
    proUserId: proProfile.userId,
    title: s.title,
    description: s.description,
    categoryId: s.categoryId,
    categoryName: s.category.name,
    price: s.price,
    duration: s.duration,
    durationUnit: normalizeDurationUnit(s.durationUnit),
    durationValue: s.durationValue,
    rating: proProfile.rating,
    reviewsCount: proProfile.reviewsCount,
    providerName: proProfile.user.name,
    providerAvatar: proProfile.user.image,
    location,
    cityId: proProfile.cityId,
    image: getServiceFallbackImage(s.categoryId, proProfile.portfolioImages),
    isActive: s.isActive,
    availabilityStatus: normalizeAvailability(proProfile.availabilityStatus),
  }))

  const mappedBookings: DashboardBookingItem[] = bookings.map((b) => ({
    id: b.id,
    serviceId: b.serviceId,
    serviceTitle: b.service.title,
    categoryName: b.service.category.name,
    clientId: b.clientId,
    clientName: b.clientName || b.client.name,
    clientPhone: b.clientPhone,
    clientAddress: b.clientAddress,
    clientNotes: b.clientNotes,
    proUserId: b.proId,
    proProfileId: proProfile.id,
    proName: proProfile.user.name,
    proPhone: proProfile.phoneNumber,
    proWhatsapp: proProfile.whatsappNumber,
    proLocation: location,
    status: normalizeBookingStatus(b.status),
    bookingDate: b.bookingDate.toISOString(),
    endDate: b.endDate.toISOString(),
    durationUnit: normalizeDurationUnit(b.durationUnit),
    durationValue: b.durationValue,
    timeSlot: b.timeSlot,
    indicativePrice: b.indicativePrice,
    createdAt: b.createdAt.toISOString(),
    hasClientReviewed: b.reviews.some((r) => r.authorType === "CLIENT_TO_PRO"),
    hasProReviewed: b.reviews.some(
      (r) => r.authorType === "PRO_TO_CLIENT" && r.authorId === userId
    ),
  }))

  const activeBookings = mappedBookings.filter(
    (b) => b.status === "NEGOTIATING" || b.status === "IN_PROGRESS"
  )
  const negotiatedVolumeFCFA = mappedBookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((acc, cur) => acc + cur.indicativePrice, 0)

  const mappedCategories: CatalogCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    icon: c.icon,
  }))

  const orgType = normalizeOrganizationType(proProfile.organizationType)
  const maxConcurrent = normalizeMaxConcurrent(
    orgType,
    proProfile.maxConcurrentProjects
  )
  const todayKey = toIsoDayKey(new Date())
  const activeProjectsToday = activeBookings.filter((b) => {
    const startKey = toIsoDayKey(b.bookingDate)
    const endKey = toIsoDayKey(b.endDate)
    return startKey <= todayKey && endKey >= todayKey
  }).length
  const availablePlacesToday = Math.max(0, maxConcurrent - activeProjectsToday)

  return {
    proProfile: {
      id: proProfile.id,
      userId: proProfile.userId,
      userName: proProfile.user.name,
      userImage: proProfile.user.image,
      headline: proProfile.headline,
      bio: proProfile.bio,
      phoneNumber: proProfile.phoneNumber,
      whatsappNumber: proProfile.whatsappNumber,
      yearsOfExperience: proProfile.yearsOfExperience,
      cityId: proProfile.cityId || "",
      commune: proProfile.commune || "",
      address: proProfile.address || "",
      availabilityStatus: normalizeAvailability(proProfile.availabilityStatus),
      organizationType: orgType,
      maxConcurrentProjects: maxConcurrent,
      activeProjectsToday,
      availablePlacesToday,
      isVerified: proProfile.isVerified,
      kycStatus: proProfile.kycStatus,
      kycDocumentUrl: proProfile.kycDocumentUrl,
      rating: proProfile.rating,
      reviewsCount: proProfile.reviewsCount,
      completedTasks: proProfile.completedTasks,
      portfolioImages: proProfile.portfolioImages,
      languages:
        proProfile.languages.length > 0 ? proProfile.languages : ["Français"],
    },
    services: mappedServices,
    categories: mappedCategories,
    bookings: mappedBookings,
    activeBookings,
    stats: {
      negotiatedVolumeFCFA,
      activeBookingsCount: activeBookings.length,
      averageRating: proProfile.rating.toFixed(1),
      completedTasks: proProfile.completedTasks,
    },
  }
}

function normalizeSubscriptionStatus(
  raw: string
): DashboardSubscriptionItem["status"] {
  if (raw === "TRIALING") return "TRIALING"
  if (raw === "PAST_DUE") return "PAST_DUE"
  if (raw === "CANCELLED") return "CANCELLED"
  return "ACTIVE"
}

function resolvePlanLabel(planCode: string): string {
  if (planCode in PAYSTACK_PLANS) {
    return PAYSTACK_PLANS[planCode as SubscriptionPlanCode].name
  }
  return planCode
}

export async function getUserSubscriptions(
  userId: string
): Promise<DashboardSubscriptionItem[]> {
  const subs = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return subs.map((s) => ({
    id: s.id,
    plan: s.plan,
    planLabel: resolvePlanLabel(s.plan),
    amount: s.amount,
    currency: s.currency,
    status: normalizeSubscriptionStatus(s.status),
    referenceCode:
      s.paystackSubscriptionCode || `PSK-${s.id.slice(0, 8).toUpperCase()}`,
    currentPeriodStart: s.currentPeriodStart.toISOString(),
    currentPeriodEnd: s.currentPeriodEnd.toISOString(),
    trialEndDate: s.trialEndDate ? s.trialEndDate.toISOString() : null,
    createdAt: s.createdAt.toISOString(),
  }))
}

export async function getClientSettingsData(userId: string) {
  const [user, subscriptions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    }),
    getUserSubscriptions(userId),
  ])

  const isGoldMember = subscriptions.some(
    (s) =>
      s.plan === "CLIENT_GOLD" &&
      (s.status === "ACTIVE" || s.status === "TRIALING")
  )

  return {
    user,
    subscriptions,
    isGoldMember,
  }
}

export async function getProSettingsData(userId: string) {
  const [user, proProfile, subscriptions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    }),
    prisma.proProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        cityId: true,
        commune: true,
        address: true,
        phoneNumber: true,
        whatsappNumber: true,
        kycStatus: true,
        isVerified: true,
      },
    }),
    getUserSubscriptions(userId),
  ])

  const activeProSubscription =
    subscriptions.find(
      (s) =>
        s.plan.startsWith("PRO_") &&
        (s.status === "ACTIVE" || s.status === "TRIALING" || s.status === "PAST_DUE")
    ) || null

  return {
    user,
    proProfile,
    subscriptions,
    activeProSubscription,
  }
}
