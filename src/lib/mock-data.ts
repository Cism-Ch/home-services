import { Wrench, Zap, Droplets, Paintbrush, Hammer, Truck } from "lucide-react"

export interface Service {
    id: string
    title: string
    description: string
    category: string
    price: number
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
        id: "1",
        title: "Réparation de fuite d'eau",
        description: "Intervention rapide pour toute fuite d'eau, robinetterie ou tuyauterie.",
        category: "Plomberie",
        price: 80,
        rating: 4.8,
        reviews: 124,
        providerName: "Jean Plombier",
        providerId: "1",
        image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
        location: "Paris 15ème"
    },
    {
        id: "2",
        title: "Installation électrique complète",
        description: "Mise aux normes et installation de tableaux électriques.",
        category: "Électricité",
        price: 150,
        rating: 4.9,
        reviews: 89,
        providerName: "Elec Pro",
        providerId: "2",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
        location: "Lyon"
    },
    {
        id: "3",
        title: "Peinture salon et cuisine",
        description: "Peinture murs et plafonds, finitions soignées.",
        category: "Peinture",
        price: 200,
        rating: 4.7,
        reviews: 56,
        providerName: "Deco Peint",
        providerId: "1",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
        location: "Marseille"
    },
    {
        id: "4",
        title: "Montage de meubles",
        description: "Assemblage de tous types de meubles en kit.",
        category: "Bricolage",
        price: 50,
        rating: 4.5,
        reviews: 210,
        providerName: "Brico Express",
        providerId: "2",
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
        location: "Bordeaux"
    },
    {
        id: "5",
        title: "Déménagement petit volume",
        description: "Transport de meubles et cartons pour petits déménagements.",
        category: "Déménagement",
        price: 120,
        rating: 4.6,
        reviews: 78,
        providerName: "Move It",
        providerId: "1",
        image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=80",
        location: "Lille"
    },
    {
        id: "6",
        title: "Jardinage et entretien",
        description: "Tonte de pelouse, taille de haies et entretien général.",
        category: "Jardinage",
        price: 60,
        rating: 4.9,
        reviews: 145,
        providerName: "Green Hands",
        providerId: "2",
        image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80",
        location: "Nantes"
    }
]

export const categories = [
    { id: "plomberie", label: "Plomberie", icon: Droplets },
    { id: "electricite", label: "Électricité", icon: Zap },
    { id: "peinture", label: "Peinture", icon: Paintbrush },
    { id: "bricolage", label: "Bricolage", icon: Hammer },
    { id: "demenagement", label: "Déménagement", icon: Truck },
    { id: "jardinage", label: "Jardinage", icon: Wrench },
]

export interface Review {
    id: string
    author: string
    rating: number
    date: string
    comment: string
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
        id: "1",
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
                id: "r1",
                author: "Sophie M.",
                rating: 5,
                date: "Il y a 2 jours",
                comment: "Intervention rapide et efficace. Jean est très professionnel et sympathique. Je recommande !"
            },
            {
                id: "r2",
                author: "Pierre D.",
                rating: 4,
                date: "Il y a 1 semaine",
                comment: "Bon travail, prix correct. Un peu de retard mais prévenu à l'avance."
            }
        ],
        portfolio: [
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
            "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?w=800&q=80"
        ]
    },
    {
        id: "2",
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
