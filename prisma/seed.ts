/**
 * Script d'initialisation idempotent (Seed) pour Supabase PostgreSQL (Sprint 08)
 *
 * Injecte les categories metiers, le referentiel GEO (cities-data.ts),
 * 1 Admin, 5 Clients et 20 Professionnels avec comptes Better-Auth fonctionnels
 * (`providerId: "credential"` + scrypt hash), services FCFA, creneaux horaires,
 * indisponibilites, abonnements Paystack, reservations et avis mutuels.
 */

import "./load-env"
import { hashPassword } from "better-auth/crypto"
import { locationsData } from "../src/lib/cities-data"
import { prisma } from "../src/lib/prisma"
import { invalidateCatalogCache } from "../src/lib/redis"
import {
  SEED_ADMIN,
  SEED_BOOKINGS,
  SEED_CATEGORIES,
  SEED_CLIENTS,
  SEED_PASSWORDS,
  SEED_PROS,
  SEED_REVIEWS,
  SEED_UNAVAILABILITIES,
  type SeedSubscriptionFixture,
  type SeedUserFixture,
} from "./seed-data"

const WEEKLY_SLOTS = [
  { startTime: "08:00", endTime: "10:00" },
  { startTime: "10:00", endTime: "12:00" },
  { startTime: "14:00", endTime: "16:00" },
  { startTime: "16:00", endTime: "18:00" },
] as const

function addDaysUtc(base: Date, offsetDays: number, hourUtc = 12): Date {
  const date = new Date(base)
  date.setUTCDate(date.getUTCDate() + offsetDays)
  date.setUTCHours(hourUtc, 0, 0, 0)
  return date
}

/**
 * Cree ou met a jour un utilisateur ainsi que son compte Better-Auth email/mot de passe.
 * Better-Auth exige `providerId === "credential"` et `accountId === user.id`.
 */
async function upsertUserWithCredentialAccount(
  userInput: SeedUserFixture,
  plainPassword: string
) {
  const normalizedEmail = userInput.email.toLowerCase().trim()

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      name: userInput.name,
      userType: userInput.userType,
      emailVerified: true,
      phoneNumber: userInput.phoneNumber,
      ...(userInput.image ? { image: userInput.image } : {}),
    },
    create: {
      id: userInput.id,
      email: normalizedEmail,
      name: userInput.name,
      userType: userInput.userType,
      emailVerified: true,
      phoneNumber: userInput.phoneNumber,
      ...(userInput.image ? { image: userInput.image } : {}),
    },
  })

  const hashedPassword = await hashPassword(plainPassword)

  await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: "credential",
        accountId: user.id,
      },
    },
    update: {
      userId: user.id,
      password: hashedPassword,
    },
    create: {
      id: `seed-acc-${user.id}`,
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashedPassword,
    },
  })

  return user
}

async function upsertSubscription(
  sub: SeedSubscriptionFixture,
  userId: string,
  now: Date
) {
  const currentPeriodEnd = addDaysUtc(now, sub.periodEndOffsetDays, 23)
  const currentPeriodStart = addDaysUtc(currentPeriodEnd, -30, 0)
  const trialStartDate = sub.trialDays
    ? addDaysUtc(currentPeriodEnd, -sub.trialDays, 0)
    : null
  const trialEndDate = sub.trialDays ? currentPeriodEnd : null

  await prisma.subscription.upsert({
    where: { id: sub.id },
    update: {
      userId,
      plan: sub.plan,
      amount: sub.amount,
      currency: "XOF",
      status: sub.status,
      trialStartDate,
      trialEndDate,
      currentPeriodStart,
      currentPeriodEnd,
    },
    create: {
      id: sub.id,
      userId,
      plan: sub.plan,
      amount: sub.amount,
      currency: "XOF",
      status: sub.status,
      trialStartDate,
      trialEndDate,
      currentPeriodStart,
      currentPeriodEnd,
    },
  })
}

async function main() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_TEST_SEED !== "true"
  ) {
    throw new Error(
      "[Seed] Refus d'injecter les comptes de test en production. Definir ALLOW_TEST_SEED=true pour forcer."
    )
  }

  const now = new Date()
  const userIdByKey = new Map<string, string>()
  const proProfileIdByKey = new Map<string, string>()
  const clientByKey = new Map(SEED_CLIENTS.map((c) => [c.id, c]))

  console.log("[Seed] 1/8 Synchronisation des 10 categories...")
  for (const cat of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
      },
      create: {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
      },
    })
  }

  console.log(
    `[Seed] 2/8 Synchronisation de ${locationsData.length} villes/communes GEO...`
  )
  for (const loc of locationsData) {
    const currency = loc.country === "Cameroun" ? "XAF" : "XOF"
    await prisma.city.upsert({
      where: { id: loc.id },
      update: {
        name: loc.label,
        country: loc.country,
        currency,
      },
      create: {
        id: loc.id,
        name: loc.label,
        country: loc.country,
        currency,
      },
    })
  }

  console.log("[Seed] 3/8 Synchronisation Admin + 5 Clients + comptes Better-Auth...")
  const adminUser = await upsertUserWithCredentialAccount(
    SEED_ADMIN,
    SEED_PASSWORDS.admin
  )
  userIdByKey.set(SEED_ADMIN.id, adminUser.id)

  for (const client of SEED_CLIENTS) {
    const createdClient = await upsertUserWithCredentialAccount(
      client,
      SEED_PASSWORDS.client
    )
    userIdByKey.set(client.id, createdClient.id)

    if (client.subscription) {
      await upsertSubscription(client.subscription, createdClient.id, now)
    }
  }

  console.log(
    "[Seed] 4/8 Synchronisation des 20 Professionnels, profils, services et abonnements..."
  )
  const slotsBatch: Array<{
    id: string
    proProfileId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isAvailable: boolean
  }> = []

  for (const pro of SEED_PROS) {
    const proUser = await upsertUserWithCredentialAccount(
      pro.user,
      SEED_PASSWORDS.pro
    )
    userIdByKey.set(pro.user.id, proUser.id)

    const profile = await prisma.proProfile.upsert({
      where: { userId: proUser.id },
      update: {
        headline: pro.profile.headline,
        bio: pro.profile.bio,
        phoneNumber: pro.profile.phoneNumber,
        whatsappNumber: pro.profile.whatsappNumber,
        yearsOfExperience: pro.profile.yearsOfExperience,
        cityId: pro.profile.cityId,
        commune: pro.profile.commune,
        address: pro.profile.address,
        availabilityStatus: pro.profile.availabilityStatus,
        isVerified: pro.profile.isVerified,
        kycStatus: pro.profile.kycStatus,
        kycDocumentUrl: null,
        portfolioImages: pro.profile.portfolioImages,
        languages: pro.profile.languages,
      },
      create: {
        id: pro.profile.id,
        userId: proUser.id,
        headline: pro.profile.headline,
        bio: pro.profile.bio,
        phoneNumber: pro.profile.phoneNumber,
        whatsappNumber: pro.profile.whatsappNumber,
        yearsOfExperience: pro.profile.yearsOfExperience,
        cityId: pro.profile.cityId,
        commune: pro.profile.commune,
        address: pro.profile.address,
        availabilityStatus: pro.profile.availabilityStatus,
        isVerified: pro.profile.isVerified,
        kycStatus: pro.profile.kycStatus,
        kycDocumentUrl: null,
        portfolioImages: pro.profile.portfolioImages,
        languages: pro.profile.languages,
      },
    })
    proProfileIdByKey.set(pro.profile.id, profile.id)

    for (const svc of pro.services) {
      await prisma.service.upsert({
        where: { id: svc.id },
        update: {
          proProfileId: profile.id,
          categoryId: svc.categoryId,
          title: svc.title,
          description: svc.description,
          price: svc.price,
          duration: svc.duration,
          isActive: true,
        },
        create: {
          id: svc.id,
          proProfileId: profile.id,
          categoryId: svc.categoryId,
          title: svc.title,
          description: svc.description,
          price: svc.price,
          duration: svc.duration,
          isActive: true,
        },
      })
    }

    if (pro.subscription) {
      await upsertSubscription(pro.subscription, proUser.id, now)
    }

    // Creneaux hebdomadaires du Lundi (1) au Samedi (6)
    for (let day = 1; day <= 6; day++) {
      for (let idx = 0; idx < WEEKLY_SLOTS.length; idx++) {
        const slot = WEEKLY_SLOTS[idx]
        slotsBatch.push({
          id: `seed-slot-${profile.id}-d${day}-${idx}`,
          proProfileId: profile.id,
          dayOfWeek: day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: true,
        })
      }
    }
  }

  console.log(
    `[Seed] 5/8 Injection de ${slotsBatch.length} creneaux horaires & ${SEED_UNAVAILABILITIES.length} indisponibilites...`
  )
  await prisma.timeSlot.createMany({
    data: slotsBatch,
    skipDuplicates: true,
  })

  for (const unavail of SEED_UNAVAILABILITIES) {
    const proProfileId = proProfileIdByKey.get(unavail.proProfileKey)
    if (!proProfileId) {
      throw new Error(`[Seed] Profil introuvable pour indisponibilite ${unavail.id}`)
    }

    const startDate = addDaysUtc(now, unavail.startOffsetDays, 0)
    const endDate = addDaysUtc(now, unavail.endOffsetDays, 23)

    await prisma.unavailabilityPeriod.upsert({
      where: { id: unavail.id },
      update: {
        proProfileId,
        type: unavail.type,
        startDate,
        endDate,
        reason: unavail.reason,
      },
      create: {
        id: unavail.id,
        proProfileId,
        type: unavail.type,
        startDate,
        endDate,
        reason: unavail.reason,
      },
    })
  }

  console.log(
    `[Seed] 6/8 Synchronisation des ${SEED_BOOKINGS.length} reservations & ${SEED_REVIEWS.length} avis mutuels...`
  )
  for (const booking of SEED_BOOKINGS) {
    const clientId = userIdByKey.get(booking.clientKey)
    const proId = userIdByKey.get(booking.proUserKey)
    const clientMeta = clientByKey.get(booking.clientKey)

    if (!clientId || !proId || !clientMeta) {
      throw new Error(`[Seed] Reference client/pro invalide pour ${booking.id}`)
    }

    const bookingDate = addDaysUtc(now, booking.dayOffset, 12)
    const completedAt =
      booking.status === "COMPLETED" ? addDaysUtc(now, booking.dayOffset, 18) : null

    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {
        serviceId: booking.serviceId,
        clientId,
        proId,
        status: booking.status,
        bookingDate,
        timeSlot: booking.timeSlot,
        clientNotes: booking.clientNotes,
        indicativePrice: booking.indicativePrice,
        clientName: clientMeta.name,
        clientPhone: clientMeta.phoneNumber,
        clientAddress: booking.clientAddress,
        completedAt,
      },
      create: {
        id: booking.id,
        serviceId: booking.serviceId,
        clientId,
        proId,
        status: booking.status,
        bookingDate,
        timeSlot: booking.timeSlot,
        clientNotes: booking.clientNotes,
        indicativePrice: booking.indicativePrice,
        clientName: clientMeta.name,
        clientPhone: clientMeta.phoneNumber,
        clientAddress: booking.clientAddress,
        completedAt,
      },
    })
  }

  for (const review of SEED_REVIEWS) {
    const authorId = userIdByKey.get(review.authorKey)
    const targetId = userIdByKey.get(review.targetKey)

    if (!authorId || !targetId) {
      throw new Error(`[Seed] Auteur/cible introuvable pour avis ${review.id}`)
    }

    await prisma.review.upsert({
      where: {
        bookingId_authorId: {
          bookingId: review.bookingId,
          authorId,
        },
      },
      update: {
        targetId,
        authorType: review.authorType,
        rating: review.rating,
        comment: review.comment,
        isModerated: review.isModerated,
        isReported: review.isReported,
      },
      create: {
        id: review.id,
        bookingId: review.bookingId,
        authorId,
        targetId,
        authorType: review.authorType,
        rating: review.rating,
        comment: review.comment,
        isModerated: review.isModerated,
        isReported: review.isReported,
      },
    })
  }

  console.log("[Seed] 7/8 Recalcul exact des notes, avis et missions terminees...")
  for (const pro of SEED_PROS) {
    const proUserId = userIdByKey.get(pro.user.id)
    const proProfileId = proProfileIdByKey.get(pro.profile.id)
    if (!proUserId || !proProfileId) continue

    const [reviewAgg, completedCount] = await Promise.all([
      prisma.review.aggregate({
        where: {
          targetId: proUserId,
          authorType: "CLIENT_TO_PRO",
          isModerated: false,
        },
        _avg: { rating: true },
        _count: { id: true },
      }),
      prisma.booking.count({
        where: {
          proId: proUserId,
          status: "COMPLETED",
        },
      }),
    ])

    const reviewsCount = reviewAgg._count.id
    const rating =
      reviewsCount > 0 && reviewAgg._avg.rating !== null
        ? Math.round(reviewAgg._avg.rating * 10) / 10
        : 5.0

    await prisma.proProfile.update({
      where: { id: proProfileId },
      data: {
        rating,
        reviewsCount,
        completedTasks: completedCount,
      },
    })
  }

  console.log("[Seed] 8/8 Invalidation du cache catalogue Upstash Redis...")
  await invalidateCatalogCache()

  const [
    totalUsers,
    totalClients,
    totalPros,
    totalProfiles,
    totalServices,
    totalSlots,
    totalSubs,
    totalBookings,
    totalReviews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { userType: "client" } }),
    prisma.user.count({ where: { userType: "pro" } }),
    prisma.proProfile.count(),
    prisma.service.count(),
    prisma.timeSlot.count(),
    prisma.subscription.count(),
    prisma.booking.count(),
    prisma.review.count(),
  ])

  console.log("[Seed] Base Supabase initialisee avec succes.")
  console.log(
    `[Seed Summary] Users=${totalUsers} (Admin=${totalUsers - totalClients - totalPros}, Clients=${totalClients}, Pros=${totalPros}) | Profiles=${totalProfiles} | Services=${totalServices} | TimeSlots=${totalSlots} | Subscriptions=${totalSubs} | Bookings=${totalBookings} | Reviews=${totalReviews}`
  )
}

main()
  .catch((err) => {
    console.error("[Seed Error]", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
