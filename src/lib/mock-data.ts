import { Wrench, Zap, Droplets, Paintbrush, Truck, Snowflake, ShieldCheck, type LucideIcon } from "lucide-react"

export interface City {
    id: string
    name: string
    country: string
    currency: string
    popularCommunes: string[]
}

export const cities: City[] = [
    {
        id: "abidjan",
        name: "Abidjan",
        country: "Côte d'Ivoire",
        currency: "XOF",
        popularCommunes: ["Cocody", "Yopougon", "Marcory", "Plateau", "Riviera", "Treichville"]
    },
    {
        id: "dakar",
        name: "Dakar",
        country: "Sénégal",
        currency: "XOF",
        popularCommunes: ["Almadies", "Plateau", "Mermoz", "Ngor", "Yoff", "Parcelles Assainies"]
    },
    {
        id: "douala",
        name: "Douala",
        country: "Cameroun",
        currency: "XAF",
        popularCommunes: ["Bonanjo", "Akwa", "Bonapriso", "Deido", "Makepe"]
    },
    {
        id: "yaounde",
        name: "Yaoundé",
        country: "Cameroun",
        currency: "XAF",
        popularCommunes: ["Bastos", "Omnisports", "Mimboman", "Mvan"]
    },
    {
        id: "cotonou",
        name: "Cotonou",
        country: "Bénin",
        currency: "XOF",
        popularCommunes: ["Haie Vive", "Cadjehoun", "Akpakpa", "Fidjrosse", "Ganhi"]
    },
    {
        id: "lome",
        name: "Lomé",
        country: "Togo",
        currency: "XOF",
        popularCommunes: ["Tokoin", "Nyekonakpoe", "Bè", "Hedzranawoe", "Agoè"]
    }
]

export interface Service {
    id: string
    title: string
    description: string
    category: string
    price: number // En FCFA (XOF)
    duration: number
    rating: number
    reviews: number
    providerName: string
    providerId: string
    providerAvatar?: string
    image: string
    location: string
}

export const services: Service[] = [
    {
        id: "service-plomberie-1",
        title: "Dépannage plomberie et fuite d'eau",
        description: "Intervention rapide pour toute fuite d'eau, débouchage, robinetterie ou chauffe-eau sanitaire.",
        category: "plomberie",
        price: 15000,
        duration: 60,
        rating: 4.8,
        reviews: 124,
        providerName: "Kouassi Plomberie",
        providerId: "pro-1",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
        location: "Abidjan - Cocody"
    },
    {
        id: "service-electricite-1",
        title: "Installation et dépannage électrique",
        description: "Mise aux normes du tableau électrique, installation disjoncteurs, dépannage court-circuit et prises.",
        category: "electricite",
        price: 25000,
        duration: 120,
        rating: 4.9,
        reviews: 89,
        providerName: "Diop Électricité Générale",
        providerId: "pro-2",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
        location: "Dakar - Almadies"
    },
    {
        id: "service-climatisation-1",
        title: "Entretien et recharge gaz climatiseur",
        description: "Nettoyage filtres, vérification étanchéité, traitement antibactérien et recharge gaz R22 / R410A.",
        category: "climatisation",
        price: 20000,
        duration: 90,
        rating: 4.9,
        reviews: 110,
        providerName: "Fofana Froid & Clim",
        providerId: "pro-1",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
        location: "Abidjan - Marcory"
    },
    {
        id: "service-peinture-1",
        title: "Peinture intérieure salon et chambres",
        description: "Peinture acrylique et satinée haute résistance aux intempéries, finitions soignées sans coulures.",
        category: "peinture",
        price: 45000,
        duration: 240,
        rating: 4.7,
        reviews: 56,
        providerName: "Kouassi Plomberie",
        providerId: "pro-1",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        location: "Abidjan - Riviera"
    },
    {
        id: "service-bricolage-1",
        title: "Montage meubles et serrurerie",
        description: "Assemblage rapide de placards, tringles à rideaux, changement de serrures et petits aménagements.",
        category: "bricolage",
        price: 10000,
        duration: 45,
        rating: 4.5,
        reviews: 210,
        providerName: "Diop Électricité Générale",
        providerId: "pro-2",
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
        location: "Dakar - Plateau"
    },
    {
        id: "service-demenagement-1",
        title: "Transport et déménagement sécurisé",
        description: "Transport de cartons et mobilier avec équipe de manutention précautionneuse.",
        category: "demenagement",
        price: 60000,
        duration: 180,
        rating: 4.6,
        reviews: 78,
        providerName: "Kouassi Plomberie",
        providerId: "pro-1",
        image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=80",
        location: "Abidjan - Yopougon"
    }
]

export interface Category {
    id: string
    name: string
    icon: LucideIcon
    count: number
}

export const categories: Category[] = [
    { id: "plomberie", name: "Plomberie", icon: Droplets, count: 45 },
    { id: "electricite", name: "Électricité", icon: Zap, count: 38 },
    { id: "climatisation", name: "Climatisation", icon: Snowflake, count: 42 },
    { id: "peinture", name: "Peinture", icon: Paintbrush, count: 29 },
    { id: "bricolage", name: "Bricolage", icon: Wrench, count: 52 },
    { id: "demenagement", name: "Déménagement", icon: Truck, count: 18 },
    { id: "gardiennage", name: "Sécurité & Entretien", icon: ShieldCheck, count: 34 }
]

export interface Review {
    id: string
    author: string
    rating: number
    date: string
    comment: string
    professionalId: string
    targetName?: string
    authorType?: "CLIENT_TO_PRO" | "PRO_TO_CLIENT"
}

export interface Professional {
    id: string
    name: string
    title: string
    avatar: string
    rating: number
    reviewsCount: number
    location: string
    commune: string
    city: string
    phoneNumber: string
    whatsappNumber: string
    availabilityStatus: "AVAILABLE" | "BUSY_TODAY" | "OFFLINE"
    isVerified: boolean
    bio: string
    languages: string[]
    experience: string
    services: Service[]
    reviews: Review[]
    portfolio: string[]
}

export const professionals: Professional[] = [
    {
        id: "pro-1",
        name: "Amadou Kouassi",
        title: "Artisan Plombier & Climatiseur Certifié",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        rating: 4.8,
        reviewsCount: 124,
        location: "Abidjan - Cocody",
        commune: "Cocody",
        city: "Abidjan",
        phoneNumber: "+225 07 08 09 10 11",
        whatsappNumber: "+2250708091011",
        availabilityStatus: "AVAILABLE",
        isVerified: true,
        bio: "Plombier et frigoriste qualifié avec plus de 12 ans d'expérience sur le Grand Abidjan. Dépannage rapide, installation sanitaire et recharge clim. Travail soigné avec devis clair avant intervention.",
        languages: ["Français", "Baoulé"],
        experience: "12 ans",
        services: [services[0], services[2]],
        reviews: [
            {
                id: "review-1",
                author: "Mireille Koné",
                rating: 5,
                date: "Il y a 2 jours",
                comment: "Intervention très propre et ponctuelle à la Riviera 2. Diagnostic clair et problème réglé en moins d'une heure.",
                professionalId: "pro-1",
                authorType: "CLIENT_TO_PRO"
            },
            {
                id: "review-2",
                author: "Bakary Traoré",
                rating: 5,
                date: "Il y a 1 semaine",
                comment: "Artisan disponible et réactif sur WhatsApp. Devis respecté et clim qui refroidit à merveille.",
                professionalId: "pro-1",
                authorType: "CLIENT_TO_PRO"
            }
        ],
        portfolio: [
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
            "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?w=800&q=80"
        ]
    },
    {
        id: "pro-2",
        name: "Moussa Diop",
        title: "Électricien Bâtiment & Industriel",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        rating: 4.9,
        reviewsCount: 89,
        location: "Dakar - Almadies",
        commune: "Almadies",
        city: "Dakar",
        phoneNumber: "+221 77 123 45 67",
        whatsappNumber: "+221771234567",
        availabilityStatus: "AVAILABLE",
        isVerified: true,
        bio: "Électricien certifié opérant sur Dakar et sa banlieue. Rénovation de coffrets électriques, pose d'onduleurs solaires, dépannage court-circuit 24h/7j.",
        languages: ["Français", "Wolof"],
        experience: "10 ans",
        services: [services[1]],
        reviews: [
            {
                id: "review-3",
                author: "Fatou Sow",
                rating: 5,
                date: "Il y a 3 jours",
                comment: "Moussa a remis aux normes tout le tableau de mon appartement aux Almadies. Travail exemplaire.",
                professionalId: "pro-2",
                authorType: "CLIENT_TO_PRO"
            }
        ],
        portfolio: [
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
        ]
    }
]

export interface Booking {
    id: string
    serviceId: string
    professionalId: string
    userId: string
    date: Date
    status: "negotiating" | "in_progress" | "upcoming" | "completed" | "cancelled"
    price: number // En FCFA (XOF)
    address: string
    time: string
    clientName?: string
    clientPhone?: string
}

export const bookings: Booking[] = [
    {
        id: "booking-1",
        serviceId: "service-plomberie-1",
        professionalId: "pro-1",
        userId: "user-1",
        date: new Date(Date.now() + 86400000 * 2),
        status: "negotiating",
        price: 15000,
        address: "Cocody Riviera Bonoumin, Abidjan",
        time: "10:00",
        clientName: "Jean-Eudes Kouassi",
        clientPhone: "+225 05 06 07 08 09"
    },
    {
        id: "booking-2",
        serviceId: "service-climatisation-1",
        professionalId: "pro-1",
        userId: "user-1",
        date: new Date(Date.now() - 86400000 * 3),
        status: "completed",
        price: 20000,
        address: "Marcory Zone 4, Abidjan",
        time: "14:30",
        clientName: "Jean-Eudes Kouassi",
        clientPhone: "+225 05 06 07 08 09"
    },
    {
        id: "booking-3",
        serviceId: "service-electricite-1",
        professionalId: "pro-2",
        userId: "user-1",
        date: new Date(Date.now() + 86400000 * 4),
        status: "in_progress",
        price: 25000,
        address: "Ngor Almadies, Dakar",
        time: "09:00",
        clientName: "Jean-Eudes Kouassi",
        clientPhone: "+225 05 06 07 08 09"
    }
]

// Formatage FCFA standardisé
export function formatFCFA(amount: number): string {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

// Avis globaux
export const reviews: Review[] = professionals.flatMap(pro => pro.reviews)
