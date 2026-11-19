/**
 * Script d'initialisation idempotent (Seed) pour Supabase PostgreSQL
 * Injecte les categories metiers, le referentiel GEO (cities-data.ts), un compte Admin,
 * des artisans exemples et leurs prestations en FCFA (XOF/XAF).
 */

import "dotenv/config"
import { prisma } from "../src/lib/prisma"
import { locationsData } from "../src/lib/cities-data"

const SEED_CATEGORIES = [
  {
    id: "plomberie",
    name: "Plomberie",
    description: "Dépannage de fuites, installation sanitaire, débouchage et chauffe-eau.",
    icon: "Droplets",
  },
  {
    id: "electricite",
    name: "Électricité",
    description: "Tableaux électriques, dépannage court-circuit, prises et onduleurs solaires.",
    icon: "Zap",
  },
  {
    id: "climatisation",
    name: "Climatisation & Froid",
    description: "Entretien split, recharge gaz frigorifique, installation et réparation.",
    icon: "Snowflake",
  },
  {
    id: "menage",
    name: "Ménage & Entretien",
    description: "Nettoyage à domicile, fin de chantier et entretien régulier.",
    icon: "Sparkles",
  },
  {
    id: "peinture",
    name: "Peinture & Décoration",
    description: "Peinture intérieure/extérieure, enduits et rafraîchissement.",
    icon: "Paintbrush",
  },
  {
    id: "demenagement",
    name: "Déménagement & Manutention",
    description: "Transport de mobilier, emballage et logistique urbaine.",
    icon: "Truck",
  },
  {
    id: "securite",
    name: "Serrurerie & Sécurité",
    description: "Ouverture de porte, serrures haute sécurité, caméras et interphones.",
    icon: "ShieldCheck",
  },
  {
    id: "menuiserie",
    name: "Menuiserie & Ébénisterie",
    description: "Fabrication et réparation de portes, placards, meubles sur mesure.",
    icon: "Hammer",
  },
  {
    id: "maconnerie",
    name: "Maçonnerie & Carrelage",
    description: "Rénovation, pose de carreaux, étanchéité toiture et gros œuvre.",
    icon: "Wrench",
  },
  {
    id: "jardinage",
    name: "Jardinage & Espaces Verts",
    description: "Tonte, taille de haies, aménagement paysager et désherbage.",
    icon: "Trees",
  },
]

async function main() {
  console.log("[Seed] Synchronisation des categories...")
  for (const cat of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
      },
      create: cat,
    })
  }

  console.log(`[Seed] Synchronisation de ${locationsData.length} villes/communes GEO...`)
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

  console.log("[Seed] Synchronisation des comptes utilisateurs de base...")
  await prisma.user.upsert({
    where: { email: "admin@homeservices.ci" },
    update: {
      name: "Direction HomeServices",
      userType: "admin",
      emailVerified: true,
    },
    create: {
      id: "seed-admin-1",
      email: "admin@homeservices.ci",
      name: "Direction HomeServices",
      userType: "admin",
      emailVerified: true,
      phoneNumber: "+225 07 00 00 00 01",
    },
  })

  await prisma.user.upsert({
    where: { email: "client@homeservices.ci" },
    update: {
      name: "Jean-Marc Kouadio",
      userType: "client",
      emailVerified: true,
    },
    create: {
      id: "seed-client-1",
      email: "client@homeservices.ci",
      name: "Jean-Marc Kouadio",
      userType: "client",
      emailVerified: true,
      phoneNumber: "+225 05 06 07 08 09",
    },
  })

  const pro1User = await prisma.user.upsert({
    where: { email: "amadou.kouassi@homeservices.ci" },
    update: {
      name: "Amadou Kouassi",
      userType: "pro",
      emailVerified: true,
    },
    create: {
      id: "seed-pro-user-1",
      email: "amadou.kouassi@homeservices.ci",
      name: "Amadou Kouassi",
      userType: "pro",
      emailVerified: true,
      phoneNumber: "+225 07 08 09 10 11",
    },
  })

  const pro1Profile = await prisma.proProfile.upsert({
    where: { userId: pro1User.id },
    update: {
      headline: "Artisan Plombier & Climatiseur Certifié",
      cityId: "ci-abidjan-cocody",
      commune: "Cocody",
    },
    create: {
      id: "seed-pro-profile-1",
      userId: pro1User.id,
      headline: "Artisan Plombier & Climatiseur Certifié",
      bio: "Plombier et frigoriste qualifié avec plus de 12 ans d'expérience sur le Grand Abidjan.",
      phoneNumber: "+225 07 08 09 10 11",
      whatsappNumber: "+2250708091011",
      yearsOfExperience: 12,
      cityId: "ci-abidjan-cocody",
      commune: "Cocody",
      address: "Riviera 2, Cocody",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      rating: 4.9,
      reviewsCount: 142,
      completedTasks: 168,
      languages: ["Français", "Baoulé", "Dioula"],
    },
  })

  await prisma.service.upsert({
    where: { id: "seed-service-plomberie-1" },
    update: {
      title: "Dépannage plomberie et fuite d'eau",
      price: 15000,
    },
    create: {
      id: "seed-service-plomberie-1",
      proProfileId: pro1Profile.id,
      categoryId: "plomberie",
      title: "Dépannage plomberie et fuite d'eau",
      description:
        "Intervention rapide pour toute fuite d'eau, débouchage, robinetterie ou chauffe-eau sanitaire.",
      price: 15000,
      duration: 60,
      isActive: true,
    },
  })

  await prisma.service.upsert({
    where: { id: "seed-service-clim-1" },
    update: {
      title: "Entretien & recharge climatiseur Split",
      price: 20000,
    },
    create: {
      id: "seed-service-clim-1",
      proProfileId: pro1Profile.id,
      categoryId: "climatisation",
      title: "Entretien & recharge climatiseur Split",
      description:
        "Nettoyage complet haute pression, vérification des filtres et recharge gaz réfrigérant.",
      price: 20000,
      duration: 90,
      isActive: true,
    },
  })

  const pro2User = await prisma.user.upsert({
    where: { email: "moussa.diop@homeservices.ci" },
    update: {
      name: "Moussa Diop",
      userType: "pro",
      emailVerified: true,
    },
    create: {
      id: "seed-pro-user-2",
      email: "moussa.diop@homeservices.ci",
      name: "Moussa Diop",
      userType: "pro",
      emailVerified: true,
      phoneNumber: "+221 77 123 45 67",
    },
  })

  const pro2Profile = await prisma.proProfile.upsert({
    where: { userId: pro2User.id },
    update: {
      headline: "Maître Électricien & Énergie Solaire",
      cityId: "sn-dakar-almadies",
      commune: "Almadies",
    },
    create: {
      id: "seed-pro-profile-2",
      userId: pro2User.id,
      headline: "Maître Électricien & Énergie Solaire",
      bio: "Électricien certifié opérant sur Dakar et sa banlieue. Mise aux normes et onduleurs solaires.",
      phoneNumber: "+221 77 123 45 67",
      whatsappNumber: "+221771234567",
      yearsOfExperience: 10,
      cityId: "sn-dakar-almadies",
      commune: "Almadies",
      address: "Route des Almadies, Dakar",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      rating: 4.8,
      reviewsCount: 89,
      completedTasks: 104,
      languages: ["Français", "Wolof"],
    },
  })

  await prisma.service.upsert({
    where: { id: "seed-service-elec-1" },
    update: {
      title: "Diagnostic & mise aux normes tableau électrique",
      price: 25000,
    },
    create: {
      id: "seed-service-elec-1",
      proProfileId: pro2Profile.id,
      categoryId: "electricite",
      title: "Diagnostic & mise aux normes tableau électrique",
      description:
        "Vérification disjoncteurs différentiels, détection de court-circuit et raccordement sécurisé.",
      price: 25000,
      duration: 90,
      isActive: true,
    },
  })

  // Creneaux horaires hebdomadaires (Lundi=1 a Samedi=6) pour chaque Pro
  const defaultSlots = [
    { startTime: "08:00", endTime: "10:00" },
    { startTime: "10:00", endTime: "12:00" },
    { startTime: "14:00", endTime: "16:00" },
    { startTime: "16:00", endTime: "18:00" },
  ]

  for (const profileId of [pro1Profile.id, pro2Profile.id]) {
    for (let day = 1; day <= 6; day++) {
      for (let idx = 0; idx < defaultSlots.length; idx++) {
        const slot = defaultSlots[idx]
        const slotId = `seed-slot-${profileId}-d${day}-${idx}`
        await prisma.timeSlot.upsert({
          where: { id: slotId },
          update: {
            isAvailable: true,
          },
          create: {
            id: slotId,
            proProfileId: profileId,
            dayOfWeek: day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: true,
          },
        })
      }
    }
  }

  console.log("[Seed] Base Supabase initialisee avec succes.")
}

main()
  .catch((err) => {
    console.error("[Seed Error]", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
