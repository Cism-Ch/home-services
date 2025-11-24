import { Wrench, Zap, Droplets, Paintbrush, Hammer, Truck } from "lucide-react"

export interface Service {
    id: string
    title: string
    description: string
    category: string
    price: number
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
        title: "Réparation de fuite d'eau",
        description: "Intervention rapide pour toute fuite d'eau, robinetterie ou tuyauterie.",
        category: "plomberie",
        price: 80,
        duration: 60,
        rating: 4.8,
        reviews: 124,
        providerName: "Jean Plombier",
        providerId: "pro-1",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
        location: "Paris 15ème"
    },
    {
        id: "service-electricite-1",
        title: "Installation électrique complète",
        description: "Mise aux normes et installation de tableaux électriques.",
        category: "electricite",
        price: 150,
        duration: 120,
        rating: 4.9,
        reviews: 89,
        providerName: "Elec Pro",
        providerId: "pro-2",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
        location: "Lyon"
    },
    {
        id: "service-peinture-1",
        title: "Peinture salon et cuisine",
        description: "Peinture murs et plafonds, finitions soignées.",
        category: "peinture",
        price: 200,
        duration: 240,
        rating: 4.7,
        reviews: 56,
        providerName: "Deco Peint",
        providerId: "pro-1",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        location: "Marseille"
    },
    {
        id: "service-bricolage-1",
        title: "Montage de meubles",
        description: "Assemblage de tous types de meubles en kit.",
        category: "bricolage",
        price: 50,
        duration: 45,
        rating: 4.5,
        reviews: 210,
        providerName: "Brico Express",
        providerId: "pro-2",
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
        location: "Bordeaux"
    },
    {
        id: "service-demenagement-1",
        title: "Déménagement petit volume",
        description: "Transport de meubles et cartons pour petits déménagements.",
        category: "demenagement",
        price: 120,
        duration: 180,
        rating: 4.6,
        reviews: 78,
        providerName: "Move It",
        providerId: "pro-1",
        image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=80",
        location: "Lille"
    },
    {
        id: "service-jardinage-1",
        title: "Jardinage et entretien",
        description: "Tonte de pelouse, taille de haies et entretien général.",
        category: "jardinage",
        price: 60,
        duration: 90,
        rating: 4.9,
        reviews: 145,
        providerName: "Green Hands",
        providerId: "pro-2",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
        location: "Toulouse"
    }
]

export interface Category {
    id: string
    name: string
    icon: any
    count: number
}

export const categories: Category[] = [
    { id: "plomberie", name: "Plomberie", icon: Droplets, count: 45 },
    { id: "electricite", name: "Électricité", icon: Zap, count: 38 },
    { id: "peinture", name: "Peinture", icon: Paintbrush, count: 29 },
    { id: "bricolage", name: "Bricolage", icon: Wrench, count: 52 },
    { id: "demenagement", name: "Déménagement", icon: Truck, count: 18 },
    { id: "jardinage", name: "Jardinage", icon: Hammer, count: 34 }
]

export interface Review {
    id: string
    author: string
    rating: number
    date: string
    comment: string
    professionalId: string
}

export interface Professional {
    id: string
    name: string
    title: string
    avatar: string
    rating: number
    reviewsCount: number
    location: string
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
        name: "Jean Plombier",
        title: "Plombier Expert",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        rating: 4.8,
        reviewsCount: 124,
        location: "Paris 15ème",
        bio: "Plombier qualifié avec plus de 15 ans d'expérience. Spécialisé dans les dépannages d'urgence et les rénovations de salle de bain. Travail soigné et garanti.",
        languages: ["Français", "Anglais"],
        experience: "15 ans",
        services: [services[0]],
        reviews: [
            {
                id: "review-1",
                author: "Sophie M.",
                rating: 5,
                date: "Il y a 2 jours",
                comment: "Intervention rapide et efficace. Jean est très professionnel et sympathique. Je recommande !",
                professionalId: "pro-1"
            },
            {
                id: "review-2",
                author: "Pierre D.",
                rating: 4,
                date: "Il y a 1 semaine",
                comment: "Bon travail, prix correct. Un peu de retard mais prévenu à l'avance.",
                professionalId: "pro-1"
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
        name: "Elec Pro",
        title: "Électricien Certifié",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        rating: 4.9,
        reviewsCount: 89,
        location: "Lyon",
        bio: "Entreprise d'électricité générale. Mise aux normes, installation neuve et rénovation. Devis gratuit.",
        languages: ["Français"],
        experience: "10 ans",
        services: [services[1]],
        reviews: [],
        portfolio: []
    }
]

export interface Booking {
    id: string
    serviceId: string
    professionalId: string
    userId: string
    date: Date
    status: "upcoming" | "completed" | "cancelled"
    price: number
    address: string
    time: string
}

export const bookings: Booking[] = [
    {
        id: "booking-1",
        serviceId: "service-plomberie-1",
        professionalId: "pro-1",
        userId: "user-1",
        date: new Date(Date.now() + 86400000 * 2), // In 2 days
        status: "upcoming",
        price: 80,
        address: "12 Rue de la Paix, 75002 Paris",
        time: "14:00"
    },
    {
        id: "booking-2",
        serviceId: "service-peinture-1",
        professionalId: "pro-1",
        userId: "user-1",
        date: new Date(Date.now() - 86400000 * 5), // 5 days ago
        status: "completed",
        price: 200,
        address: "12 Rue de la Paix, 75002 Paris",
        time: "09:00"
    },
    {
        id: "booking-3",
        serviceId: "service-electricite-1",
        professionalId: "pro-2",
        userId: "user-1",
        date: new Date(Date.now() + 86400000 * 10), // In 10 days
        status: "upcoming",
        price: 150,
        address: "12 Rue de la Paix, 75002 Paris",
        time: "10:30"
    }
]

// Global reviews export - must be after professionals array
export const reviews: Review[] = professionals.flatMap(pro => pro.reviews)
