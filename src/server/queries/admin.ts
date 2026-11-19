/**
 * Requetes serveur Prisma (RSC) pour le Portail d'Administration (/dashboard/admin)
 */

import { prisma } from "@/lib/prisma"
import { PAYSTACK_PLANS, type SubscriptionPlanCode } from "@/lib/paystack"

export interface AdminKycItem {
  id: string
  userId: string
  name: string
  email: string
  headline: string
  city: string
  phone: string
  kycStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED"
  hasDocument: boolean
  isVerified: boolean
  createdAt: string
}

export interface AdminSubscriptionRow {
  id: string
  subscriberName: string
  subscriberEmail: string
  role: "Prestataire" | "Client"
  planCode: string
  planName: string
  amountFCFA: number
  status: "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELLED"
  city: string
  currentPeriodEnd: string
}

export interface AdminReviewItem {
  id: string
  bookingId: string
  authorName: string
  targetName: string
  authorType: "CLIENT_TO_PRO" | "PRO_TO_CLIENT"
  rating: number
  comment: string
  isModerated: boolean
  isReported: boolean
  createdAt: string
}

export interface AdminCategoryItem {
  id: string
  name: string
  description: string | null
  icon: string
  servicesCount: number
}

export interface AdminCityItem {
  id: string
  name: string
  country: string
  currency: string
  prosCount: number
}

export interface AdminDashboardData {
  kycItems: AdminKycItem[]
  subscriptions: AdminSubscriptionRow[]
  totalMrrFCFA: number
  trialingCount: number
  pastDueCount: number
  reviews: AdminReviewItem[]
  categories: AdminCategoryItem[]
  cities: AdminCityItem[]
  platformCounts: {
    totalUsers: number
    totalBookings: number
    completedBookings: number
  }
}

const KYC_PRIORITY: Record<string, number> = {
  PENDING: 0,
  REJECTED: 1,
  NOT_SUBMITTED: 2,
  APPROVED: 3,
}

function normalizeKycStatus(raw: string): AdminKycItem["kycStatus"] {
  if (raw === "PENDING" || raw === "APPROVED" || raw === "REJECTED") {
    return raw
  }
  return "NOT_SUBMITTED"
}

function normalizeSubStatus(raw: string): AdminSubscriptionRow["status"] {
  if (raw === "TRIALING" || raw === "PAST_DUE" || raw === "CANCELLED") {
    return raw
  }
  return "ACTIVE"
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [
    proProfiles,
    subscriptions,
    reviews,
    categories,
    cities,
    totalUsers,
    totalBookings,
    completedBookings,
  ] = await Promise.all([
    prisma.proProfile.findMany({
      include: {
        user: { select: { name: true, email: true } },
        city: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscription.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            userType: true,
            proProfile: {
              select: {
                commune: true,
                city: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      include: {
        author: { select: { name: true } },
        target: { select: { name: true } },
      },
      orderBy: [{ isReported: "desc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { services: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.city.findMany({
      include: {
        _count: { select: { proProfiles: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
  ])

  const kycItems: AdminKycItem[] = [...proProfiles]
    .sort((a, b) => {
      const rankA = KYC_PRIORITY[a.kycStatus] ?? 9
      const rankB = KYC_PRIORITY[b.kycStatus] ?? 9
      if (rankA !== rankB) return rankA - rankB
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
    .map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.user.name,
      email: p.user.email,
      headline: p.headline,
      city: p.city?.name || p.commune || "Abidjan - Côte d'Ivoire",
      phone: p.phoneNumber,
      kycStatus: normalizeKycStatus(p.kycStatus),
      hasDocument: Boolean(p.kycDocumentUrl),
      isVerified: p.isVerified,
      createdAt: p.createdAt.toISOString(),
    }))

  const mappedSubscriptions: AdminSubscriptionRow[] = subscriptions.map((s) => {
    const planLabel =
      s.plan in PAYSTACK_PLANS
        ? PAYSTACK_PLANS[s.plan as SubscriptionPlanCode].name
        : s.plan

    return {
      id: s.id,
      subscriberName: s.user.name,
      subscriberEmail: s.user.email,
      role: s.user.userType === "pro" ? "Prestataire" : "Client",
      planCode: s.plan,
      planName: planLabel,
      amountFCFA: s.amount,
      status: normalizeSubStatus(s.status),
      city:
        s.user.proProfile?.city?.name ||
        s.user.proProfile?.commune ||
        "Côte d'Ivoire",
      currentPeriodEnd: s.currentPeriodEnd.toISOString(),
    }
  })

  const totalMrrFCFA = mappedSubscriptions
    .filter((s) => s.status === "ACTIVE")
    .reduce((sum, s) => sum + s.amountFCFA, 0)
  const trialingCount = mappedSubscriptions.filter(
    (s) => s.status === "TRIALING"
  ).length
  const pastDueCount = mappedSubscriptions.filter(
    (s) => s.status === "PAST_DUE"
  ).length

  const mappedReviews: AdminReviewItem[] = reviews.map((r) => ({
    id: r.id,
    bookingId: r.bookingId,
    authorName: r.author.name,
    targetName: r.target.name,
    authorType:
      r.authorType === "PRO_TO_CLIENT" ? "PRO_TO_CLIENT" : "CLIENT_TO_PRO",
    rating: r.rating,
    comment: r.comment,
    isModerated: r.isModerated,
    isReported: r.isReported,
    createdAt: r.createdAt.toISOString(),
  }))

  const mappedCategories: AdminCategoryItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    icon: c.icon,
    servicesCount: c._count.services,
  }))

  const mappedCities: AdminCityItem[] = cities.map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country,
    currency: city.currency,
    prosCount: city._count.proProfiles,
  }))

  return {
    kycItems,
    subscriptions: mappedSubscriptions,
    totalMrrFCFA,
    trialingCount,
    pastDueCount,
    reviews: mappedReviews,
    categories: mappedCategories,
    cities: mappedCities,
    platformCounts: {
      totalUsers,
      totalBookings,
      completedBookings,
    },
  }
}
