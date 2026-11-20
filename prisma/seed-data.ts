/**
 * Donnees de test structurees pour l'initialisation Supabase (Sprint 08 / Sprint 12)
 *
 * Contient uniquement des comptes fictifs destines aux environnements
 * developpement et staging : 1 Admin, 5 Clients et 20 Professionnels.
 */

import type { DurationUnit, OrganizationType } from "../src/lib/scheduling"

export const SEED_PASSWORDS = {
  admin: process.env.SEED_ADMIN_PASSWORD || "AdminServ2026!",
  client: process.env.SEED_CLIENT_PASSWORD || "ClientServ2026!",
  pro: process.env.SEED_PRO_PASSWORD || "ProServ2026!",
} as const

export const SEED_CATEGORIES = [
  {
    id: "plomberie",
    name: "Plomberie",
    description:
      "Dépannage de fuites, installation sanitaire, débouchage et chauffe-eau.",
    icon: "Droplets",
  },
  {
    id: "electricite",
    name: "Électricité",
    description:
      "Tableaux électriques, dépannage court-circuit, prises et onduleurs solaires.",
    icon: "Zap",
  },
  {
    id: "climatisation",
    name: "Climatisation & Froid",
    description:
      "Entretien split, recharge gaz frigorifique, installation et réparation.",
    icon: "Snowflake",
  },
  {
    id: "menage",
    name: "Ménage & Entretien",
    description:
      "Nettoyage à domicile, fin de chantier et entretien régulier.",
    icon: "Sparkles",
  },
  {
    id: "peinture",
    name: "Peinture & Décoration",
    description:
      "Peinture intérieure/extérieure, enduits et rafraîchissement.",
    icon: "Paintbrush",
  },
  {
    id: "demenagement",
    name: "Déménagement & Manutention",
    description:
      "Transport de mobilier, emballage et logistique urbaine.",
    icon: "Truck",
  },
  {
    id: "securite",
    name: "Serrurerie & Sécurité",
    description:
      "Ouverture de porte, serrures haute sécurité, caméras et interphones.",
    icon: "ShieldCheck",
  },
  {
    id: "menuiserie",
    name: "Menuiserie & Ébénisterie",
    description:
      "Fabrication et réparation de portes, placards, meubles sur mesure.",
    icon: "Hammer",
  },
  {
    id: "maconnerie",
    name: "Maçonnerie & Carrelage",
    description:
      "Rénovation, pose de carreaux, étanchéité toiture et gros œuvre.",
    icon: "Wrench",
  },
  {
    id: "jardinage",
    name: "Jardinage & Espaces Verts",
    description:
      "Tonte, taille de haies, aménagement paysager et désherbage.",
    icon: "Trees",
  },
] as const

export const CATEGORY_PORTFOLIO_IMAGES: Record<string, string[]> = {
  plomberie: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
  ],
  electricite: [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
  ],
  climatisation: [
    "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    "https://images.unsplash.com/photo-1631545806609-e101c1348ce4?w=800&q=80",
  ],
  menage: [
    "https://images.unsplash.com/photo-1581578731117-104f2a41272c?w=800&q=80",
    "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80",
  ],
  peinture: [
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80",
  ],
  demenagement: [
    "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  ],
  securite: [
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80",
  ],
  menuiserie: [
    "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
  ],
  maconnerie: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  ],
  jardinage: [
    "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80",
    "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80",
  ],
}

export interface SeedUserFixture {
  id: string
  email: string
  name: string
  phoneNumber: string
  userType: "admin" | "client" | "pro"
  image?: string
}

export interface SeedSubscriptionFixture {
  id: string
  plan: "PRO_STANDARD" | "PRO_PREMIUM" | "PRO_ENTERPRISE" | "CLIENT_GOLD"
  amount: number
  status: "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELLED"
  periodEndOffsetDays: number
  trialDays?: number
}

export interface SeedClientFixture extends SeedUserFixture {
  userType: "client"
  defaultAddress: string
  subscription?: SeedSubscriptionFixture
}

export interface SeedServiceFixture {
  id: string
  categoryId: string
  title: string
  description: string
  price: number
  duration: number
  durationUnit?: DurationUnit
  durationValue?: number
}

export interface SeedProFixture {
  user: SeedUserFixture & { userType: "pro" }
  profile: {
    id: string
    headline: string
    bio: string
    phoneNumber: string
    whatsappNumber: string
    yearsOfExperience: number
    cityId: string
    commune: string
    address: string
    availabilityStatus: "AVAILABLE" | "BUSY_TODAY" | "OFFLINE"
    organizationType?: OrganizationType
    maxConcurrentProjects?: number
    isVerified: boolean
    kycStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED"
    portfolioImages: string[]
    languages: string[]
  }
  primaryCategoryId: string
  services: SeedServiceFixture[]
  subscription?: SeedSubscriptionFixture
}

export interface SeedUnavailabilityFixture {
  id: string
  proProfileKey: string
  type: "vacation" | "sick" | "other"
  startOffsetDays: number
  endOffsetDays: number
  reason: string
}

export interface SeedBookingFixture {
  id: string
  serviceId: string
  clientKey: string
  proUserKey: string
  status: "NEGOTIATING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  dayOffset: number
  timeSlot: string
  durationUnit?: DurationUnit
  durationValue?: number
  clientNotes: string
  indicativePrice: number
  clientAddress: string
}

export interface SeedReviewFixture {
  id: string
  bookingId: string
  authorKey: string
  targetKey: string
  authorType: "CLIENT_TO_PRO" | "PRO_TO_CLIENT"
  rating: number
  comment: string
  isModerated: boolean
  isReported: boolean
}

export const SEED_ADMIN: SeedUserFixture = {
  id: "seed-admin-1",
  email: "admin@homeservices.ci",
  name: "Direction HomeServices",
  phoneNumber: "+225 07 00 00 00 01",
  userType: "admin",
}

export const SEED_CLIENTS: SeedClientFixture[] = [
  {
    id: "seed-client-1",
    email: "client@homeservices.ci",
    name: "Jean-Marc Kouadio",
    phoneNumber: "+225 05 06 07 08 09",
    userType: "client",
    defaultAddress: "Cocody Angre 8eme Tranche, Residence Les Palmiers",
    subscription: {
      id: "seed-sub-client-1",
      plan: "CLIENT_GOLD",
      amount: 2000,
      status: "ACTIVE",
      periodEndOffsetDays: 22,
    },
  },
  {
    id: "seed-client-2",
    email: "fatou.bamba@test.homeservices.ci",
    name: "Fatou Bamba",
    phoneNumber: "+225 07 45 21 30 12",
    userType: "client",
    defaultAddress: "Marcory Zone 4, Rue Pierre et Marie Curie",
    subscription: {
      id: "seed-sub-client-2",
      plan: "CLIENT_GOLD",
      amount: 2000,
      status: "ACTIVE",
      periodEndOffsetDays: 18,
    },
  },
  {
    id: "seed-client-3",
    email: "yves.nzi@test.homeservices.ci",
    name: "Yves N'Zi",
    phoneNumber: "+225 01 41 88 22 04",
    userType: "client",
    defaultAddress: "Riviera Palmeraie, Rue Ministere",
  },
  {
    id: "seed-client-4",
    email: "aminata.toure@test.homeservices.ci",
    name: "Aminata Touré",
    phoneNumber: "+225 07 89 14 56 33",
    userType: "client",
    defaultAddress: "Plateau Avenue Chardy, Immeuble Horizon",
    subscription: {
      id: "seed-sub-client-4",
      plan: "CLIENT_GOLD",
      amount: 2000,
      status: "PAST_DUE",
      periodEndOffsetDays: -3,
    },
  },
  {
    id: "seed-client-5",
    email: "cedric.brou@test.homeservices.ci",
    name: "Cédric Brou",
    phoneNumber: "+225 05 72 19 44 80",
    userType: "client",
    defaultAddress: "Yopougon Niangon Sud, Carrefour Lokoa",
  },
]

export const SEED_PROS: SeedProFixture[] = [
  // 1 & 3: Plomberie
  {
    user: {
      id: "seed-pro-user-1",
      email: "amadou.kouassi@homeservices.ci",
      name: "Amadou Kouassi",
      phoneNumber: "+225 07 08 09 10 11",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-1",
      headline: "Artisan Plombier & Climatiseur Certifié",
      bio: "Plombier et frigoriste qualifié avec plus de 12 ans d'expérience sur le Grand Abidjan. Intervention propre avec garantie pièces et main d'œuvre.",
      phoneNumber: "+225 07 08 09 10 11",
      whatsappNumber: "+2250708091011",
      yearsOfExperience: 12,
      cityId: "ci-abidjan-cocody",
      commune: "Cocody",
      address: "Riviera 2, Cocody",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.plomberie,
      languages: ["Français", "Baoulé", "Dioula"],
    },
    primaryCategoryId: "plomberie",
    services: [
      {
        id: "seed-service-plomberie-1",
        categoryId: "plomberie",
        title: "Dépannage plomberie et fuite d'eau",
        description:
          "Intervention rapide pour toute fuite d'eau, débouchage, robinetterie ou chasse d'eau sanitaire.",
        price: 15000,
        duration: 60,
      },
      {
        id: "seed-service-clim-1",
        categoryId: "climatisation",
        title: "Entretien & recharge climatiseur Split",
        description:
          "Nettoyage complet haute pression, vérification des filtres et recharge gaz réfrigérant.",
        price: 20000,
        duration: 90,
      },
      {
        id: "seed-service-plomberie-1b",
        categoryId: "plomberie",
        title: "Installation chauffe-eau électrique & surpresseur",
        description:
          "Pose sécurisée de ballon d'eau chaude, raccordement cuivre/PPR et groupe de sécurité.",
        price: 35000,
        duration: 120,
      },
    ],
    subscription: {
      id: "seed-sub-pro-1",
      plan: "PRO_ENTERPRISE",
      amount: 20000,
      status: "ACTIVE",
      periodEndOffsetDays: 25,
    },
  },
  // 2 & 4: Electricite
  {
    user: {
      id: "seed-pro-user-2",
      email: "moussa.diop@homeservices.ci",
      name: "Moussa Diop",
      phoneNumber: "+221 77 123 45 67",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-2",
      headline: "Maître Électricien & Énergie Solaire",
      bio: "Électricien certifié opérant sur Dakar et sa banlieue. Mise aux normes tableaux, recherche de pannes et dimensionnement solaire.",
      phoneNumber: "+221 77 123 45 67",
      whatsappNumber: "+221771234567",
      yearsOfExperience: 10,
      cityId: "sn-dakar-almadies",
      commune: "Almadies",
      address: "Route des Almadies, Dakar",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.electricite,
      languages: ["Français", "Wolof"],
    },
    primaryCategoryId: "electricite",
    services: [
      {
        id: "seed-service-elec-1",
        categoryId: "electricite",
        title: "Diagnostic & mise aux normes tableau électrique",
        description:
          "Vérification disjoncteurs différentiels, détection de court-circuit et raccordement sécurisé.",
        price: 25000,
        duration: 90,
      },
      {
        id: "seed-service-elec-2b",
        categoryId: "electricite",
        title: "Installation onduleur hybride & batteries solaires",
        description:
          "Câblage complet kit secours anti-délestage pour résidence ou bureau professionnel.",
        price: 75000,
        duration: 180,
      },
    ],
    subscription: {
      id: "seed-sub-pro-2",
      plan: "PRO_ENTERPRISE",
      amount: 20000,
      status: "ACTIVE",
      periodEndOffsetDays: 20,
    },
  },
  {
    user: {
      id: "seed-pro-user-3",
      email: "ibrahim.kone@test.homeservices.ci",
      name: "Ibrahim Koné",
      phoneNumber: "+225 07 14 28 39 50",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-3",
      headline: "Plombier Déboucheur Express Yopougon",
      bio: "Spécialiste du débouchage haute pression, réfection tuyauterie PVC/PPR et détection d'infiltration à Yopougon et Adjamé.",
      phoneNumber: "+225 07 14 28 39 50",
      whatsappNumber: "+2250714283950",
      yearsOfExperience: 7,
      cityId: "ci-abidjan-yopougon",
      commune: "Yopougon",
      address: "Yopougon Maroc, Carrefour Toit Rouge",
      availabilityStatus: "BUSY_TODAY",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.plomberie,
      languages: ["Français", "Dioula"],
    },
    primaryCategoryId: "plomberie",
    services: [
      {
        id: "seed-service-pro3-1",
        categoryId: "plomberie",
        title: "Débouchage canalisation & regard d'évacuation",
        description:
          "Débouchage mécanique et furet haute pression pour évier, douche et colonne principale.",
        price: 18000,
        duration: 90,
      },
      {
        id: "seed-service-pro3-2",
        categoryId: "plomberie",
        title: "Pose complète sanitaire WC & lavabo",
        description:
          "Remplacement ou pose neuve de cuvette WC, siphon, mitigeur et joints d'étanchéité.",
        price: 22000,
        duration: 120,
      },
    ],
    subscription: {
      id: "seed-sub-pro-3",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "ACTIVE",
      periodEndOffsetDays: 14,
    },
  },
  {
    user: {
      id: "seed-pro-user-4",
      email: "serge.aka@test.homeservices.ci",
      name: "Serge Aka",
      phoneNumber: "+225 05 32 48 61 77",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-4",
      headline: "Électricien Bâtiment & Domotique Zone 4",
      bio: "Dépannage urgence électrique, installation luminaires LED, variateurs et protection parafoudre sur Marcory et Biétry.",
      phoneNumber: "+225 05 32 48 61 77",
      whatsappNumber: "+2250532486177",
      yearsOfExperience: 9,
      cityId: "ci-abidjan-marcory",
      commune: "Marcory",
      address: "Rue du Canal, Biétry",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.electricite,
      languages: ["Français", "Agni"],
    },
    primaryCategoryId: "electricite",
    services: [
      {
        id: "seed-service-pro4-1",
        categoryId: "electricite",
        title: "Recherche de panne électrique & court-circuit",
        description:
          "Isolement de ligne défectueuse, remplacement prise fondue ou disjoncteur qui saute.",
        price: 15000,
        duration: 60,
      },
      {
        id: "seed-service-pro4-2",
        categoryId: "electricite",
        title: "Pose régulateur de tension & prise terre",
        description:
          "Installation complète de piquet de terre et parafoudre pour protéger votre électroménager.",
        price: 30000,
        duration: 120,
      },
    ],
    subscription: {
      id: "seed-sub-pro-4",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "ACTIVE",
      periodEndOffsetDays: 19,
    },
  },
  // 5 & 6: Climatisation
  {
    user: {
      id: "seed-pro-user-5",
      email: "drissa.ouattara@test.homeservices.ci",
      name: "Drissa Ouattara",
      phoneNumber: "+225 07 55 19 82 14",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-5",
      headline: "Expert Froid Industriel & Split Inverter",
      bio: "Technicien supérieur en froid et climatisation depuis 11 ans. Intervention rapide sur la Riviera, Cocody et Bingerville.",
      phoneNumber: "+225 07 55 19 82 14",
      whatsappNumber: "+2250755198214",
      yearsOfExperience: 11,
      cityId: "ci-abidjan-riviera",
      commune: "Riviera",
      address: "Riviera Bonoumin, Carrefour Abidjan Mall",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.climatisation,
      languages: ["Français", "Dioula", "Sénoufo"],
    },
    primaryCategoryId: "climatisation",
    services: [
      {
        id: "seed-service-pro5-1",
        categoryId: "climatisation",
        title: "Installation neuve climatiseur Split Inverter",
        description:
          "Fixation unité intérieure/extérieure, tirage au vide et mise en service certifiée.",
        price: 40000,
        duration: 150,
      },
      {
        id: "seed-service-pro5-2",
        categoryId: "climatisation",
        title: "Entretien complet + recharge gaz R410A / R32",
        description:
          "Nettoyage turbine et condenseur à la bâche de protection plus complément gaz.",
        price: 25000,
        duration: 90,
      },
      {
        id: "seed-service-pro5-3",
        categoryId: "climatisation",
        title: "Forfait entretien annuel 3 climatiseurs",
        description:
          "Pack économique villa/bureau incluant désinfection antibactérienne des splits.",
        price: 45000,
        duration: 180,
      },
    ],
    subscription: {
      id: "seed-sub-pro-5",
      plan: "PRO_ENTERPRISE",
      amount: 20000,
      status: "ACTIVE",
      periodEndOffsetDays: 27,
    },
  },
  {
    user: {
      id: "seed-pro-user-6",
      email: "fabrice.yao@test.homeservices.ci",
      name: "Fabrice Yao",
      phoneNumber: "+225 01 66 23 90 18",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-6",
      headline: "Technicien Maintenance Climatisation & Armoires",
      bio: "Maintenance préventive de climatiseurs split, cassettes de plafond et réfrigérateurs domestiques au Plateau et Adjamé.",
      phoneNumber: "+225 01 66 23 90 18",
      whatsappNumber: "+2250166239018",
      yearsOfExperience: 5,
      cityId: "ci-abidjan-plateau",
      commune: "Plateau",
      address: "Avenue Franchet d'Esperey, Plateau",
      availabilityStatus: "AVAILABLE",
      isVerified: false,
      kycStatus: "PENDING",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.climatisation,
      languages: ["Français", "Baoulé"],
    },
    primaryCategoryId: "climatisation",
    services: [
      {
        id: "seed-service-pro6-1",
        categoryId: "climatisation",
        title: "Nettoyage simple climatiseur Split",
        description:
          "Dépoussiérage complet unité, débouchage tuyau d'évacuation condensats et test froid.",
        price: 12000,
        duration: 60,
      },
      {
        id: "seed-service-pro6-2",
        categoryId: "climatisation",
        title: "Dépannage carte électronique & condensateur",
        description:
          "Remplacement condensateur compresseur et capteur sonde sur tout modèle Split.",
        price: 22000,
        duration: 90,
      },
    ],
    subscription: {
      id: "seed-sub-pro-6",
      plan: "PRO_STANDARD",
      amount: 5000,
      status: "TRIALING",
      periodEndOffsetDays: 24,
      trialDays: 30,
    },
  },
  // 7 & 8: Menage
  {
    user: {
      id: "seed-pro-user-7",
      email: "nadia.koffi@test.homeservices.ci",
      name: "Nadia Koffi",
      phoneNumber: "+225 07 71 42 58 03",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-7",
      headline: "Gouvernante & Nettoyage Prestige Villas",
      bio: "Équipe formée aux standards hôteliers pour nettoyage complet d'appartements, villas meublées, vitreries et fin de chantier.",
      phoneNumber: "+225 07 71 42 58 03",
      whatsappNumber: "+2250771425803",
      yearsOfExperience: 8,
      cityId: "ci-abidjan-cocody",
      commune: "Cocody",
      address: "Cocody Vallon, Rue des Jardins",
      availabilityStatus: "AVAILABLE",
      organizationType: "PME",
      maxConcurrentProjects: 4,
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.menage,
      languages: ["Français", "Anglais", "Baoulé"],
    },
    primaryCategoryId: "menage",
    services: [
      {
        id: "seed-service-pro7-1",
        categoryId: "menage",
        title: "Grand ménage appartement 3-4 pièces",
        description:
          "Dépoussiérage complet, dégraissage cuisine, désinfection salles d'eau et sols.",
        price: 20000,
        duration: 180,
        durationUnit: "HOURS",
        durationValue: 3,
      },
      {
        id: "seed-service-pro7-2",
        categoryId: "menage",
        title: "Nettoyage approfondi fin de chantier villa",
        description:
          "Élimination traces de peinture/ciment, lavage baies vitrées et remise à neuf complète.",
        price: 55000,
        duration: 1440,
        durationUnit: "DAYS",
        durationValue: 3,
      },
      {
        id: "seed-service-pro7-3",
        categoryId: "menage",
        title: "Shampouinage canapé & matelas à domicile",
        description:
          "Injection-extraction anti-acariens et détachage textile sur place.",
        price: 25000,
        duration: 90,
      },
    ],
    subscription: {
      id: "seed-sub-pro-7",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "ACTIVE",
      periodEndOffsetDays: 16,
    },
  },
  {
    user: {
      id: "seed-pro-user-8",
      email: "mariam.diallo@test.homeservices.ci",
      name: "Mariam Diallo",
      phoneNumber: "+225 05 88 31 09 44",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-8",
      headline: "Entretien Domestique & Bureaux Zone 4",
      bio: "Prestations soignées d'entretien régulier pour particuliers et PME à Marcory, Koumassi et Treichville.",
      phoneNumber: "+225 05 88 31 09 44",
      whatsappNumber: "+2250588310944",
      yearsOfExperience: 6,
      cityId: "ci-abidjan-marcory",
      commune: "Marcory",
      address: "Marcory Résidentiel",
      availabilityStatus: "BUSY_TODAY",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.menage,
      languages: ["Français", "Peul", "Dioula"],
    },
    primaryCategoryId: "menage",
    services: [
      {
        id: "seed-service-pro8-1",
        categoryId: "menage",
        title: "Ménage standard studio / 2 pièces",
        description:
          "Nettoyage complet sols, sanitaires, cuisine et rangement soigné.",
        price: 12000,
        duration: 120,
      },
      {
        id: "seed-service-pro8-2",
        categoryId: "menage",
        title: "Entretien hebdomadaire bureaux jusqu'à 100 m2",
        description:
          "Aspiration, désinfection postes de travail, sanitaires et vitres intérieures.",
        price: 25000,
        duration: 150,
      },
    ],
    subscription: {
      id: "seed-sub-pro-8",
      plan: "PRO_STANDARD",
      amount: 5000,
      status: "ACTIVE",
      periodEndOffsetDays: 12,
    },
  },
  // 9 & 10: Peinture
  {
    user: {
      id: "seed-pro-user-9",
      email: "pascal.gnagne@test.homeservices.ci",
      name: "Pascal Gnagne",
      phoneNumber: "+225 07 19 64 33 21",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-9",
      headline: "Peintre Décorateur & Enduit Lissé",
      bio: "Finition soignée intérieure et extérieure, peinture satinée, stuc décoratif et traitement anti-humidité sur Abidjan.",
      phoneNumber: "+225 07 19 64 33 21",
      whatsappNumber: "+2250719643321",
      yearsOfExperience: 14,
      cityId: "ci-abidjan-riviera",
      commune: "Riviera",
      address: "Riviera Faya, Abidjan",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.peinture,
      languages: ["Français", "Adioukrou"],
    },
    primaryCategoryId: "peinture",
    services: [
      {
        id: "seed-service-pro9-1",
        categoryId: "peinture",
        title: "Rafraîchissement peinture séjour ou chambre (main d'œuvre)",
        description:
          "Protection mobilier, rebouchage fissures, ponçage et application 2 couches.",
        price: 35000,
        duration: 240,
      },
      {
        id: "seed-service-pro9-2",
        categoryId: "peinture",
        title: "Traitement anti-humidité & enduit mural",
        description:
          "Grattage cloquage, application primaire hydrofuge et enduit de finition.",
        price: 45000,
        duration: 240,
      },
    ],
    subscription: {
      id: "seed-sub-pro-9",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "ACTIVE",
      periodEndOffsetDays: 21,
    },
  },
  {
    user: {
      id: "seed-pro-user-10",
      email: "christian.ahou@test.homeservices.ci",
      name: "Christian Ahou",
      phoneNumber: "+225 05 44 77 12 08",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-10",
      headline: "Peintre Bâtiment & Ravalement Façades",
      bio: "Interventions sur Yamoussoukro et environs pour maisons individuelles, clôtures et locaux commerciaux.",
      phoneNumber: "+225 05 44 77 12 08",
      whatsappNumber: "+2250544771208",
      yearsOfExperience: 6,
      cityId: "ci-yamoussoukro",
      commune: "Yamoussoukro Centre",
      address: "Quartier Habitat, Yamoussoukro",
      availabilityStatus: "OFFLINE",
      isVerified: false,
      kycStatus: "PENDING",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.peinture,
      languages: ["Français", "Baoulé"],
    },
    primaryCategoryId: "peinture",
    services: [
      {
        id: "seed-service-pro10-1",
        categoryId: "peinture",
        title: "Peinture façade extérieure villa",
        description:
          "Lavage haute pression, rebouchage et peinture façade résistante aux intempéries.",
        price: 65000,
        duration: 300,
      },
      {
        id: "seed-service-pro10-2",
        categoryId: "peinture",
        title: "Vernis & peinture grilles métalliques / portails",
        description:
          "Ponçage anti-rouille et laquage pistolet ou brosse sur ferronnerie.",
        price: 25000,
        duration: 180,
      },
    ],
    subscription: {
      id: "seed-sub-pro-10",
      plan: "PRO_STANDARD",
      amount: 5000,
      status: "TRIALING",
      periodEndOffsetDays: 26,
      trialDays: 30,
    },
  },
  // 11 & 12: Demenagement
  {
    user: {
      id: "seed-pro-user-11",
      email: "souleymane.traore@test.homeservices.ci",
      name: "Souleymane Traoré",
      phoneNumber: "+225 07 20 85 94 12",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-11",
      headline: "Logistique Déménagement Clé en Main (Camion + Porteurs)",
      bio: "Flotte de fourgons capitonnés avec 3 déménageurs professionnels. Démontage, emballage couvertures et remontage sur tout Abidjan.",
      phoneNumber: "+225 07 20 85 94 12",
      whatsappNumber: "+2250720859412",
      yearsOfExperience: 10,
      cityId: "ci-abidjan-treichville",
      commune: "Treichville",
      address: "Boulevard VGE, Treichville",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.demenagement,
      languages: ["Français", "Dioula"],
    },
    primaryCategoryId: "demenagement",
    services: [
      {
        id: "seed-service-pro11-1",
        categoryId: "demenagement",
        title: "Déménagement appartement 2-3 pièces (Abidjan intra-muros)",
        description:
          "Camion 20m3 + 3 manutentionnaires + couvertures de protection mobilier.",
        price: 65000,
        duration: 240,
      },
      {
        id: "seed-service-pro11-2",
        categoryId: "demenagement",
        title: "Transport meuble lourd / électroménager ponctuel",
        description:
          "Livraison sécurisée réfrigérateur, salon ou coffre-fort avec sangles d'arrimage.",
        price: 25000,
        duration: 90,
      },
      {
        id: "seed-service-pro11-3",
        categoryId: "demenagement",
        title: "Déménagement complet villa 4+ pièces",
        description:
          "Équipe renforcée (5 porteurs), fourniture cartons et démontage/remontage lits et armoires.",
        price: 120000,
        duration: 360,
      },
    ],
    subscription: {
      id: "seed-sub-pro-11",
      plan: "PRO_ENTERPRISE",
      amount: 20000,
      status: "ACTIVE",
      periodEndOffsetDays: 29,
    },
  },
  {
    user: {
      id: "seed-pro-user-12",
      email: "eric.ble@test.homeservices.ci",
      name: "Éric Blé",
      phoneNumber: "+225 01 92 15 47 60",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-12",
      headline: "Transport Express & Manutention Koumassi",
      bio: "Transport utilitaire léger et manutention de bureaux ou petits logements dans les communes sud d'Abidjan.",
      phoneNumber: "+225 01 92 15 47 60",
      whatsappNumber: "+2250192154760",
      yearsOfExperience: 4,
      cityId: "ci-abidjan-koumassi",
      commune: "Koumassi",
      address: "Koumassi Remblais",
      availabilityStatus: "AVAILABLE",
      isVerified: false,
      kycStatus: "REJECTED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.demenagement,
      languages: ["Français", "Bété"],
    },
    primaryCategoryId: "demenagement",
    services: [
      {
        id: "seed-service-pro12-1",
        categoryId: "demenagement",
        title: "Petit déménagement studio avec utilitaire",
        description:
          "Fourgon léger + chauffeur-porteur pour transport cartons et mobilier léger.",
        price: 35000,
        duration: 150,
      },
      {
        id: "seed-service-pro12-2",
        categoryId: "demenagement",
        title: "Évacuation encombrants & débarras cave/garage",
        description:
          "Chargement et mise en décharge agréée de vieux meubles ou gravats ensachés.",
        price: 25000,
        duration: 120,
      },
    ],
    subscription: {
      id: "seed-sub-pro-12",
      plan: "PRO_STANDARD",
      amount: 5000,
      status: "PAST_DUE",
      periodEndOffsetDays: -5,
    },
  },
  // 13 & 14: Securite
  {
    user: {
      id: "seed-pro-user-13",
      email: "karim.sanogo@test.homeservices.ci",
      name: "Karim Sanogo",
      phoneNumber: "+225 07 38 91 20 55",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-13",
      headline: "Serrurier Haute Sécurité & Vidéosurveillance IP",
      bio: "Ouverture de porte sans casse, pose de serrures multipoints, digicodes et caméras connectées HD avec vision mobile.",
      phoneNumber: "+225 07 38 91 20 55",
      whatsappNumber: "+2250738912055",
      yearsOfExperience: 9,
      cityId: "ci-abidjan-plateau",
      commune: "Plateau",
      address: "Rue du Commerce, Plateau",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.securite,
      languages: ["Français", "Dioula", "Anglais"],
    },
    primaryCategoryId: "securite",
    services: [
      {
        id: "seed-service-pro13-1",
        categoryId: "securite",
        title: "Ouverture d'urgence porte claquée ou bloquée",
        description:
          "Intervention rapide sans dégradation de la porte sur cylindre standard ou blindé.",
        price: 20000,
        duration: 45,
      },
      {
        id: "seed-service-pro13-2",
        categoryId: "securite",
        title: "Pose serrure 3 points / cylindre haute sûreté",
        description:
          "Installation mécanique renforcée avec jeu de 4 clés sécurisées fournies.",
        price: 45000,
        duration: 90,
      },
      {
        id: "seed-service-pro13-3",
        categoryId: "securite",
        title: "Installation pack 4 caméras IP + enregistreur",
        description:
          "Câblage propre, configuration application smartphone et formation utilisateur.",
        price: 95000,
        duration: 240,
      },
    ],
    subscription: {
      id: "seed-sub-pro-13",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "ACTIVE",
      periodEndOffsetDays: 17,
    },
  },
  {
    user: {
      id: "seed-pro-user-14",
      email: "alain.doh@test.homeservices.ci",
      name: "Alain Doh",
      phoneNumber: "+225 05 11 73 84 29",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-14",
      headline: "Technicien Interphonie, Alarme & Motorisation Portail",
      bio: "Pose et dépannage de visiophones, alarmes périmétriques et automatismes de portail à Port-Bouët et Grand-Bassam.",
      phoneNumber: "+225 05 11 73 84 29",
      whatsappNumber: "+2250511738429",
      yearsOfExperience: 7,
      cityId: "ci-abidjan-port-bouet",
      commune: "Port-Bouët",
      address: "Zone Aéroport / Vridi, Port-Bouët",
      availabilityStatus: "BUSY_TODAY",
      isVerified: false,
      kycStatus: "PENDING",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.securite,
      languages: ["Français", "Guéré"],
    },
    primaryCategoryId: "securite",
    services: [
      {
        id: "seed-service-pro14-1",
        categoryId: "securite",
        title: "Installation visiophone couleur / gâche électrique",
        description:
          "Pose platine de rue étanche, moniteur intérieur et déverrouillage portillon.",
        price: 40000,
        duration: 120,
      },
      {
        id: "seed-service-pro14-2",
        categoryId: "securite",
        title: "Réparation moteur portail coulissant",
        description:
          "Diagnostic carte de commande, réglage fins de course et programmation télécommandes.",
        price: 35000,
        duration: 120,
      },
    ],
    subscription: {
      id: "seed-sub-pro-14",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "TRIALING",
      periodEndOffsetDays: 23,
      trialDays: 30,
    },
  },
  // 15 & 16: Menuiserie
  {
    user: {
      id: "seed-pro-user-15",
      email: "jeanluc.assoumou@test.homeservices.ci",
      name: "Jean-Luc Assoumou",
      phoneNumber: "+225 07 62 49 11 85",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-15",
      headline: "Maître Menuisier Ébéniste & Agencement Sur Mesure",
      bio: "Conception et pose de placards, dressings, cuisines bois massif Iroko/Framiré et réparation portes à Bingerville et Cocody.",
      phoneNumber: "+225 07 62 49 11 85",
      whatsappNumber: "+2250762491185",
      yearsOfExperience: 15,
      cityId: "ci-abidjan-bingerville",
      commune: "Bingerville",
      address: "Carrefour Feh Kessé, Bingerville",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.menuiserie,
      languages: ["Français", "Ébrié"],
    },
    primaryCategoryId: "menuiserie",
    services: [
      {
        id: "seed-service-pro15-1",
        categoryId: "menuiserie",
        title: "Réparation porte bois / ajustement paumelles",
        description:
          "Rabotage porte qui frotte, remplacement charnières et réglage bâti.",
        price: 15000,
        duration: 60,
      },
      {
        id: "seed-service-pro15-2",
        categoryId: "menuiserie",
        title: "Conception & pose placard dressing sur mesure",
        description:
          "Prise de cotes, panneaux mélaminés ou bois massif, portes coulissantes.",
        price: 85000,
        duration: 300,
      },
      {
        id: "seed-service-pro15-3",
        categoryId: "menuiserie",
        title: "Montage mobilier complet & cuisines en kit",
        description:
          "Assemblage précis, découpe plan de travail et fixation murale sécurisée.",
        price: 30000,
        duration: 180,
      },
    ],
    subscription: {
      id: "seed-sub-pro-15",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "ACTIVE",
      periodEndOffsetDays: 15,
    },
  },
  {
    user: {
      id: "seed-pro-user-16",
      email: "franck.kacou@test.homeservices.ci",
      name: "Franck Kacou",
      phoneNumber: "+225 05 27 83 64 10",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-16",
      headline: "Menuisier Bois & Aluminium Grand-Bassam",
      bio: "Pose de baies vitrées aluminium, moustiquaires coulissantes et restauration boiseries côtières à Grand-Bassam et Assinie.",
      phoneNumber: "+225 05 27 83 64 10",
      whatsappNumber: "+2250527836410",
      yearsOfExperience: 5,
      cityId: "ci-grand-bassam",
      commune: "Grand-Bassam",
      address: "Quartier France, Grand-Bassam",
      availabilityStatus: "AVAILABLE",
      isVerified: false,
      kycStatus: "NOT_SUBMITTED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.menuiserie,
      languages: ["Français", "Abouré"],
    },
    primaryCategoryId: "menuiserie",
    services: [
      {
        id: "seed-service-pro16-1",
        categoryId: "menuiserie",
        title: "Réparation baie vitrée aluminium & roulettes",
        description:
          "Remplacement galets usés, joints brosse et crémone de verrouillage.",
        price: 20000,
        duration: 90,
      },
      {
        id: "seed-service-pro16-2",
        categoryId: "menuiserie",
        title: "Pose moustiquaires enroulables sur fenêtres",
        description:
          "Fabrication sur mesure cadre aluminium anti-corrosion.",
        price: 28000,
        duration: 120,
      },
    ],
  },
  // 17 & 18: Maconnerie
  {
    user: {
      id: "seed-pro-user-17",
      email: "aboubacar.cisse@test.homeservices.ci",
      name: "Aboubacar Cissé",
      phoneNumber: "+225 07 94 12 36 78",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-17",
      headline: "Maçon Carreleur & Étanchéité Toiture",
      bio: "Pose de grès cérame grand format, reprise de dalles fissurées et étanchéité bitumineuse ou résine des toits-terrasses.",
      phoneNumber: "+225 07 94 12 36 78",
      whatsappNumber: "+2250794123678",
      yearsOfExperience: 13,
      cityId: "ci-abidjan-abobo",
      commune: "Abobo",
      address: "Abobo Baoulé, Abidjan",
      availabilityStatus: "AVAILABLE",
      organizationType: "TEAM",
      maxConcurrentProjects: 3,
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.maconnerie,
      languages: ["Français", "Dioula"],
    },
    primaryCategoryId: "maconnerie",
    services: [
      {
        id: "seed-service-pro17-1",
        categoryId: "maconnerie",
        title: "Pose carrelage sol / faïence murale (forfait pièce)",
        description:
          "Ragréage support, pose au peigne cranté et jointoiement étanche.",
        price: 45000,
        duration: 2400,
        durationUnit: "DAYS",
        durationValue: 5,
      },
      {
        id: "seed-service-pro17-2",
        categoryId: "maconnerie",
        title: "Étanchéité terrasse & réparation fuite dalle",
        description:
          "Nettoyage support, primaire d'accrochage et membrane d'étanchéité anti-infiltration.",
        price: 60000,
        duration: 5760,
        durationUnit: "WEEKS",
        durationValue: 2,
      },
    ],
    subscription: {
      id: "seed-sub-pro-17",
      plan: "PRO_STANDARD",
      amount: 5000,
      status: "ACTIVE",
      periodEndOffsetDays: 11,
    },
  },
  {
    user: {
      id: "seed-pro-user-18",
      email: "wilfried.zadi@test.homeservices.ci",
      name: "Wilfried Zadi",
      phoneNumber: "+225 01 53 69 24 02",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-18",
      headline: "Artisan Maçon Rénovation Générale Bouaké",
      bio: "Montage de cloisons briques, crépissage façades, construction murets et petites réparations maçonnerie à Bouaké.",
      phoneNumber: "+225 01 53 69 24 02",
      whatsappNumber: "+2250153692402",
      yearsOfExperience: 8,
      cityId: "ci-bouake",
      commune: "Commerce / Air France",
      address: "Quartier Air France 1, Bouaké",
      availabilityStatus: "OFFLINE",
      isVerified: false,
      kycStatus: "PENDING",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.maconnerie,
      languages: ["Français", "Bété", "Baoulé"],
    },
    primaryCategoryId: "maconnerie",
    services: [
      {
        id: "seed-service-pro18-1",
        categoryId: "maconnerie",
        title: "Reprise enduit mur fissuré & crépissage",
        description:
          "Sondage support, ouverture fissure, mortier fibré et finition talochée.",
        price: 30000,
        duration: 180,
      },
      {
        id: "seed-service-pro18-2",
        categoryId: "maconnerie",
        title: "Montage cloison parpaing ou pavage cour",
        description:
          "Maçonnerie soignée au niveau laser pour extension ou aménagement extérieur.",
        price: 55000,
        duration: 300,
      },
    ],
    subscription: {
      id: "seed-sub-pro-18",
      plan: "PRO_STANDARD",
      amount: 5000,
      status: "PAST_DUE",
      periodEndOffsetDays: -2,
    },
  },
  // 19 & 20: Jardinage
  {
    user: {
      id: "seed-pro-user-19",
      email: "claire.adjoua@test.homeservices.ci",
      name: "Claire Adjoua",
      phoneNumber: "+225 07 49 82 15 63",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-19",
      headline: "Paysagiste & Entretien Jardins Tropicaux",
      bio: "Création de jardins tropicaux, taille ornementale, pose gazon en plaques et arrosage automatique sur Cocody et Riviera.",
      phoneNumber: "+225 07 49 82 15 63",
      whatsappNumber: "+2250749821563",
      yearsOfExperience: 9,
      cityId: "ci-abidjan-cocody",
      commune: "Cocody",
      address: "Cocody Deux Plateaux, Rue J41",
      availabilityStatus: "AVAILABLE",
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.jardinage,
      languages: ["Français", "Baoulé"],
    },
    primaryCategoryId: "jardinage",
    services: [
      {
        id: "seed-service-pro19-1",
        categoryId: "jardinage",
        title: "Tonte gazon, taille haies & évacuation déchets verts",
        description:
          "Entretien complet jardin jusqu'à 250 m2 avec ramassage et nettoyage allées.",
        price: 20000,
        duration: 120,
      },
      {
        id: "seed-service-pro19-2",
        categoryId: "jardinage",
        title: "Aménagement massif floral & engazonnement",
        description:
          "Préparation terreau enrichi, plantation espèces locales et paillage.",
        price: 50000,
        duration: 240,
      },
    ],
    subscription: {
      id: "seed-sub-pro-19",
      plan: "PRO_PREMIUM",
      amount: 10000,
      status: "ACTIVE",
      periodEndOffsetDays: 20,
    },
  },
  {
    user: {
      id: "seed-pro-user-20",
      email: "paul.mbarga@test.homeservices.ci",
      name: "Paul Mbarga",
      phoneNumber: "+237 699 42 18 75",
      userType: "pro",
    },
    profile: {
      id: "seed-pro-profile-20",
      headline: "Jardinier Élageur & Espaces Verts Douala",
      bio: "Entretien de pelouses, élagage sécurisé de palmiers et cocotiers, traitement phytosanitaire sur Bonanjo, Akwa et Bonapriso.",
      phoneNumber: "+237 699 42 18 75",
      whatsappNumber: "+237699421875",
      yearsOfExperience: 7,
      cityId: "cm-douala-bonanjo",
      commune: "Bonanjo",
      address: "Quartier Bonanjo, Douala",
      availabilityStatus: "AVAILABLE",
      organizationType: "TEAM",
      maxConcurrentProjects: 2,
      isVerified: true,
      kycStatus: "APPROVED",
      portfolioImages: CATEGORY_PORTFOLIO_IMAGES.jardinage,
      languages: ["Français", "Anglais", "Ewondo"],
    },
    primaryCategoryId: "jardinage",
    services: [
      {
        id: "seed-service-pro20-1",
        categoryId: "jardinage",
        title: "Débroussaillage terrain & nettoyage cour",
        description:
          "Coupe herbes hautes à la débroussailleuse thermique et ratissage complet.",
        price: 18000,
        duration: 120,
      },
      {
        id: "seed-service-pro20-2",
        categoryId: "jardinage",
        title: "Élagage sécurisé arbres fruitiers & palmiers",
        description:
          "Taille sanitaire en hauteur avec évacuation complète des palmes coupées.",
        price: 35000,
        duration: 180,
      },
    ],
    subscription: {
      id: "seed-sub-pro-20",
      plan: "PRO_STANDARD",
      amount: 5000,
      status: "ACTIVE",
      periodEndOffsetDays: 13,
    },
  },
]

export const SEED_UNAVAILABILITIES: SeedUnavailabilityFixture[] = [
  {
    id: "seed-unavail-1",
    proProfileKey: "seed-pro-profile-3",
    type: "other",
    startOffsetDays: 12,
    endOffsetDays: 13,
    reason: "Chantier sanitaire urgent hors zone",
  },
  {
    id: "seed-unavail-2",
    proProfileKey: "seed-pro-profile-5",
    type: "vacation",
    startOffsetDays: 18,
    endOffsetDays: 21,
    reason: "Congés familiaux planifiés",
  },
  {
    id: "seed-unavail-3",
    proProfileKey: "seed-pro-profile-9",
    type: "other",
    startOffsetDays: 10,
    endOffsetDays: 11,
    reason: "Livraison chantier professionnel Zone 4",
  },
  {
    id: "seed-unavail-4",
    proProfileKey: "seed-pro-profile-15",
    type: "vacation",
    startOffsetDays: 22,
    endOffsetDays: 25,
    reason: "Fermeture annuelle atelier menuiserie",
  },
]

export const SEED_BOOKINGS: SeedBookingFixture[] = [
  // 12 COMPLETED (jours -30 a -3)
  {
    id: "seed-booking-01",
    serviceId: "seed-service-plomberie-1",
    clientKey: "seed-client-1",
    proUserKey: "seed-pro-user-1",
    status: "COMPLETED",
    dayOffset: -28,
    timeSlot: "08:00 - 10:00",
    clientNotes: "Fuite sous l'évier de la cuisine, robinet d'arrêt grippé.",
    indicativePrice: 15000,
    clientAddress: "Cocody Angre 8eme Tranche, Residence Les Palmiers",
  },
  {
    id: "seed-booking-02",
    serviceId: "seed-service-clim-1",
    clientKey: "seed-client-2",
    proUserKey: "seed-pro-user-1",
    status: "COMPLETED",
    dayOffset: -24,
    timeSlot: "10:00 - 12:00",
    clientNotes: "Split 1.5 CV ne refroidit plus dans la chambre principale.",
    indicativePrice: 20000,
    clientAddress: "Marcory Zone 4, Rue Pierre et Marie Curie",
  },
  {
    id: "seed-booking-03",
    serviceId: "seed-service-elec-1",
    clientKey: "seed-client-1",
    proUserKey: "seed-pro-user-2",
    status: "COMPLETED",
    dayOffset: -22,
    timeSlot: "14:00 - 16:00",
    clientNotes: "Disjoncteur principal déclenche lors de la mise en route climatisation.",
    indicativePrice: 25000,
    clientAddress: "Cocody Angre 8eme Tranche, Residence Les Palmiers",
  },
  {
    id: "seed-booking-04",
    serviceId: "seed-service-pro5-2",
    clientKey: "seed-client-3",
    proUserKey: "seed-pro-user-5",
    status: "COMPLETED",
    dayOffset: -19,
    timeSlot: "08:00 - 10:00",
    clientNotes: "Entretien semestriel et vérification pression gaz.",
    indicativePrice: 25000,
    clientAddress: "Riviera Palmeraie, Rue Ministere",
  },
  {
    id: "seed-booking-05",
    serviceId: "seed-service-pro7-1",
    clientKey: "seed-client-2",
    proUserKey: "seed-pro-user-7",
    status: "COMPLETED",
    dayOffset: -17,
    timeSlot: "10:00 - 12:00",
    clientNotes: "Nettoyage complet avant réception famille.",
    indicativePrice: 20000,
    clientAddress: "Marcory Zone 4, Rue Pierre et Marie Curie",
  },
  {
    id: "seed-booking-06",
    serviceId: "seed-service-pro4-1",
    clientKey: "seed-client-4",
    proUserKey: "seed-pro-user-4",
    status: "COMPLETED",
    dayOffset: -15,
    timeSlot: "16:00 - 18:00",
    clientNotes: "Prise cuisine sans courant suite à surtension.",
    indicativePrice: 15000,
    clientAddress: "Plateau Avenue Chardy, Immeuble Horizon",
  },
  {
    id: "seed-booking-07",
    serviceId: "seed-service-pro9-1",
    clientKey: "seed-client-1",
    proUserKey: "seed-pro-user-9",
    status: "COMPLETED",
    dayOffset: -14,
    timeSlot: "08:00 - 10:00",
    clientNotes: "Salon blanc satiné, deux murs à reprendre.",
    indicativePrice: 35000,
    clientAddress: "Cocody Angre 8eme Tranche, Residence Les Palmiers",
  },
  {
    id: "seed-booking-08",
    serviceId: "seed-service-pro11-2",
    clientKey: "seed-client-3",
    proUserKey: "seed-pro-user-11",
    status: "COMPLETED",
    dayOffset: -11,
    timeSlot: "14:00 - 16:00",
    clientNotes: "Transport armoire et table salle à manger vers Marcory.",
    indicativePrice: 25000,
    clientAddress: "Riviera Palmeraie, Rue Ministere",
  },
  {
    id: "seed-booking-09",
    serviceId: "seed-service-pro13-2",
    clientKey: "seed-client-4",
    proUserKey: "seed-pro-user-13",
    status: "COMPLETED",
    dayOffset: -9,
    timeSlot: "10:00 - 12:00",
    clientNotes: "Changement serrure porte d'entrée suite perte de clés.",
    indicativePrice: 45000,
    clientAddress: "Plateau Avenue Chardy, Immeuble Horizon",
  },
  {
    id: "seed-booking-10",
    serviceId: "seed-service-pro3-1",
    clientKey: "seed-client-3",
    proUserKey: "seed-pro-user-3",
    status: "COMPLETED",
    dayOffset: -7,
    timeSlot: "14:00 - 16:00",
    clientNotes: "Évacuation douche très lente depuis 4 jours.",
    indicativePrice: 18000,
    clientAddress: "Riviera Palmeraie, Rue Ministere",
  },
  {
    id: "seed-booking-11",
    serviceId: "seed-service-pro19-1",
    clientKey: "seed-client-1",
    proUserKey: "seed-pro-user-19",
    status: "COMPLETED",
    dayOffset: -5,
    timeSlot: "08:00 - 10:00",
    clientNotes: "Taille haies bougainvilliers et tonte pelouse.",
    indicativePrice: 20000,
    clientAddress: "Cocody Angre 8eme Tranche, Residence Les Palmiers",
  },
  {
    id: "seed-booking-12",
    serviceId: "seed-service-pro15-1",
    clientKey: "seed-client-2",
    proUserKey: "seed-pro-user-15",
    status: "COMPLETED",
    dayOffset: -3,
    timeSlot: "16:00 - 18:00",
    clientNotes: "Porte de chambre frotte sur le carrelage.",
    indicativePrice: 15000,
    clientAddress: "Marcory Zone 4, Rue Pierre et Marie Curie",
  },
  // 4 IN_PROGRESS (jours +0 a +3)
  {
    id: "seed-booking-13",
    serviceId: "seed-service-plomberie-1b",
    clientKey: "seed-client-1",
    proUserKey: "seed-pro-user-1",
    status: "IN_PROGRESS",
    dayOffset: 1,
    timeSlot: "08:00 - 10:00",
    clientNotes: "Remplacement ancien chauffe-eau 80L par neuf déjà acheté.",
    indicativePrice: 35000,
    clientAddress: "Cocody Angre 8eme Tranche, Residence Les Palmiers",
  },
  {
    id: "seed-booking-14",
    serviceId: "seed-service-pro5-3",
    clientKey: "seed-client-2",
    proUserKey: "seed-pro-user-5",
    status: "IN_PROGRESS",
    dayOffset: 1,
    timeSlot: "14:00 - 16:00",
    clientNotes: "3 splits à nettoyer avant saison chaude.",
    indicativePrice: 45000,
    clientAddress: "Marcory Zone 4, Rue Pierre et Marie Curie",
  },
  {
    id: "seed-booking-15",
    serviceId: "seed-service-pro7-2",
    clientKey: "seed-client-3",
    proUserKey: "seed-pro-user-7",
    status: "IN_PROGRESS",
    dayOffset: 0,
    timeSlot: "10:00 - 12:00",
    durationUnit: "DAYS",
    durationValue: 3,
    clientNotes: "Nettoyage fin de chantier villa 5 pièces sur 3 jours.",
    indicativePrice: 55000,
    clientAddress: "Riviera Palmeraie, Rue Ministere",
  },
  {
    id: "seed-booking-16",
    serviceId: "seed-service-pro13-3",
    clientKey: "seed-client-4",
    proUserKey: "seed-pro-user-13",
    status: "IN_PROGRESS",
    dayOffset: 3,
    timeSlot: "08:00 - 10:00",
    clientNotes: "Installation 4 caméras pour entrée bureau.",
    indicativePrice: 95000,
    clientAddress: "Plateau Avenue Chardy, Immeuble Horizon",
  },
  // 3 NEGOTIATING (jours +4 a +9)
  {
    id: "seed-booking-17",
    serviceId: "seed-service-pro17-1",
    clientKey: "seed-client-1",
    proUserKey: "seed-pro-user-17",
    status: "NEGOTIATING",
    dayOffset: 4,
    timeSlot: "10:00 - 12:00",
    durationUnit: "DAYS",
    durationValue: 5,
    clientNotes: "Carrelage terrasse 18 m2, carreaux 60x60 déjà sur place.",
    indicativePrice: 45000,
    clientAddress: "Cocody Angre 8eme Tranche, Residence Les Palmiers",
  },
  {
    id: "seed-booking-18",
    serviceId: "seed-service-pro8-1",
    clientKey: "seed-client-2",
    proUserKey: "seed-pro-user-8",
    status: "NEGOTIATING",
    dayOffset: 6,
    timeSlot: "14:00 - 16:00",
    clientNotes: "Nettoyage complet studio invité.",
    indicativePrice: 12000,
    clientAddress: "Marcory Zone 4, Rue Pierre et Marie Curie",
  },
  {
    id: "seed-booking-19",
    serviceId: "seed-service-pro19-2",
    clientKey: "seed-client-3",
    proUserKey: "seed-pro-user-19",
    status: "NEGOTIATING",
    dayOffset: 8,
    timeSlot: "08:00 - 10:00",
    clientNotes: "Réaménagement massif entrée villa + palmiers nains.",
    indicativePrice: 50000,
    clientAddress: "Riviera Palmeraie, Rue Ministere",
  },
  // 1 CANCELLED
  {
    id: "seed-booking-20",
    serviceId: "seed-service-pro12-1",
    clientKey: "seed-client-4",
    proUserKey: "seed-pro-user-12",
    status: "CANCELLED",
    dayOffset: -12,
    timeSlot: "16:00 - 18:00",
    clientNotes: "Annulé par le client suite report remise des clés.",
    indicativePrice: 35000,
    clientAddress: "Plateau Avenue Chardy, Immeuble Horizon",
  },
]

export const SEED_REVIEWS: SeedReviewFixture[] = [
  // 11 avis CLIENT_TO_PRO (notes 4 et 5 publies + 1 avis controverse signale)
  {
    id: "seed-review-01",
    bookingId: "seed-booking-01",
    authorKey: "seed-client-1",
    targetKey: "seed-pro-user-1",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Intervention ponctuelle à 8h précises. Fuite réparée proprement en moins d'une heure.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-02",
    bookingId: "seed-booking-02",
    authorKey: "seed-client-2",
    targetKey: "seed-pro-user-1",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Très professionnel, bâche de protection utilisée pendant le nettoyage du split.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-03",
    bookingId: "seed-booking-03",
    authorKey: "seed-client-1",
    targetKey: "seed-pro-user-2",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Diagnostic précis du tableau électrique et équilibrage des phases impeccable.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-04",
    bookingId: "seed-booking-04",
    authorKey: "seed-client-3",
    targetKey: "seed-pro-user-5",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Climatisation remise à neuf, le souffle froid est revenu immédiatement.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-05",
    bookingId: "seed-booking-05",
    authorKey: "seed-client-2",
    targetKey: "seed-pro-user-7",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Équipe discrète, rapide et très minutieuse sur la cuisine et les baies vitrées.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-06",
    bookingId: "seed-booking-06",
    authorKey: "seed-client-4",
    targetKey: "seed-pro-user-4",
    authorType: "CLIENT_TO_PRO",
    rating: 4,
    comment:
      "Panne résolue efficacement, léger retard de 15 minutes dû au trafic mais prévenu sur WhatsApp.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-07",
    bookingId: "seed-booking-07",
    authorKey: "seed-client-1",
    targetKey: "seed-pro-user-9",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Finition parfaite sans aucune trace au sol, rendu satiné exactement conforme au nuancier.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-08",
    bookingId: "seed-booking-08",
    authorKey: "seed-client-3",
    targetKey: "seed-pro-user-11",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Armoire protégée sous couvertures et livrée sans la moindre rayure.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-09",
    bookingId: "seed-booking-09",
    authorKey: "seed-client-4",
    targetKey: "seed-pro-user-13",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Travail très sérieux sur la serrure multipoints, explications claires sur l'entretien.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-10",
    bookingId: "seed-booking-10",
    authorKey: "seed-client-3",
    targetKey: "seed-pro-user-3",
    authorType: "CLIENT_TO_PRO",
    rating: 2,
    comment:
      "Prestation terminée mais supplément demandé sur place pour un raccord non mentionné au départ.",
    isModerated: false,
    isReported: true,
  },
  {
    id: "seed-review-11",
    bookingId: "seed-booking-11",
    authorKey: "seed-client-1",
    targetKey: "seed-pro-user-19",
    authorType: "CLIENT_TO_PRO",
    rating: 5,
    comment:
      "Jardin métamorphosé en une matinée, déchets verts entièrement évacués.",
    isModerated: true,
    isReported: false,
  },
  // 5 avis PRO_TO_CLIENT (incluant 1 avis signale pour moderation Admin)
  {
    id: "seed-review-12",
    bookingId: "seed-booking-01",
    authorKey: "seed-pro-user-1",
    targetKey: "seed-client-1",
    authorType: "PRO_TO_CLIENT",
    rating: 5,
    comment:
      "Client très accueillant, accès facile et règlement immédiat sur place.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-13",
    bookingId: "seed-booking-02",
    authorKey: "seed-pro-user-1",
    targetKey: "seed-client-2",
    authorType: "PRO_TO_CLIENT",
    rating: 5,
    comment: "Disponibilité exacte au créneau réservé, excellente communication.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-14",
    bookingId: "seed-booking-03",
    authorKey: "seed-pro-user-2",
    targetKey: "seed-client-1",
    authorType: "PRO_TO_CLIENT",
    rating: 5,
    comment: "Description claire de la panne avant notre arrivée.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-15",
    bookingId: "seed-booking-05",
    authorKey: "seed-pro-user-7",
    targetKey: "seed-client-2",
    authorType: "PRO_TO_CLIENT",
    rating: 5,
    comment: "Très bonne organisation et consignes précises.",
    isModerated: true,
    isReported: false,
  },
  {
    id: "seed-review-16",
    bookingId: "seed-booking-07",
    authorKey: "seed-pro-user-9",
    targetKey: "seed-client-1",
    authorType: "PRO_TO_CLIENT",
    rating: 4,
    comment:
      "Chantier fluide mais accès ascenseur retardé le matin (signalé pour vérification modération).",
    isModerated: false,
    isReported: true,
  },
]
