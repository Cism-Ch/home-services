/**
 * Types DTO serialisables partages entre les requetes Prisma serveur (RSC) et les composants clients
 */

import type { DurationUnit, OrganizationType } from "@/lib/scheduling"

export type AvailabilityStatusType = "AVAILABLE" | "BUSY_TODAY" | "OFFLINE"

export interface CatalogCategory {
  id: string
  name: string
  description: string | null
  icon: string
}

export interface CatalogService {
  id: string
  proProfileId: string
  proUserId: string
  title: string
  description: string
  categoryId: string
  categoryName: string
  price: number
  duration: number
  durationUnit: DurationUnit
  durationValue: number
  rating: number
  reviewsCount: number
  providerName: string
  providerAvatar?: string | null
  location: string
  cityId?: string | null
  image: string
  isActive: boolean
  availabilityStatus?: AvailabilityStatusType
}

export interface CatalogReview {
  id: string
  bookingId: string
  authorName: string
  rating: number
  dateLabel: string
  comment: string
  authorType: "CLIENT_TO_PRO" | "PRO_TO_CLIENT"
}

export interface CatalogTimeSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface CatalogUnavailability {
  id: string
  type: "vacation" | "sick" | "other"
  startDate: string
  endDate: string
  reason: string | null
}

export interface CatalogProfessional {
  id: string
  userId: string
  name: string
  title: string
  avatar?: string | null
  rating: number
  reviewsCount: number
  completedTasks: number
  location: string
  cityId?: string | null
  commune?: string | null
  phoneNumber: string
  whatsappNumber: string
  availabilityStatus: AvailabilityStatusType
  organizationType: OrganizationType
  maxConcurrentProjects: number
  activeProjectsToday?: number
  availablePlacesToday?: number
  isVerified: boolean
  bio: string
  languages: string[]
  yearsOfExperience: number
  experienceLabel: string
  portfolioImages: string[]
  isPremiumBoosted?: boolean
  services?: CatalogService[]
  reviews?: CatalogReview[]
}

export interface DashboardBookingItem {
  id: string
  serviceId: string
  serviceTitle: string
  categoryName: string
  clientId: string
  clientName: string
  clientPhone: string
  clientAddress: string
  clientNotes: string | null
  proUserId: string
  proProfileId: string
  proName: string
  proPhone: string
  proWhatsapp: string
  proLocation: string
  status: "NEGOTIATING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  bookingDate: string
  endDate: string
  durationUnit: DurationUnit
  durationValue: number
  timeSlot: string
  indicativePrice: number
  createdAt: string
  hasClientReviewed?: boolean
  hasProReviewed?: boolean
}

export interface DashboardSubscriptionItem {
  id: string
  plan: string
  planLabel: string
  amount: number
  currency: string
  status: "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELLED"
  referenceCode: string
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEndDate: string | null
  createdAt: string
}
