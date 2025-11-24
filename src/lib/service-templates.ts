// Reference data for authorized platform services
export interface ServiceTemplate {
    id: string
    category: string
    title: string
    description: string
    typicalPrice: number
    priceRange: { min: number; max: number }
    duration: number
    icon?: string
}

export const serviceTemplates: ServiceTemplate[] = [
    // Plomberie
    {
        id: "plumbing-repair",
        category: "Plomberie",
        title: "Dépannage plomberie",
        description: "Intervention rapide pour fuites, robinetterie, canalisations",
        typicalPrice: 80,
        priceRange: { min: 60, max: 150 },
        duration: 60
    },
    {
        id: "plumbing-installation",
        category: "Plomberie",
        title: "Installation sanitaire",
        description: "Pose de lavabo, WC, douche, baignoire",
        typicalPrice: 200,
        priceRange: { min: 150, max: 400 },
        duration: 120
    },
    {
        id: "plumbing-bathroom",
        category: "Plomberie",
        title: "Rénovation salle de bain",
        description: "Rénovation complète de salle de bain",
        typicalPrice: 3500,
        priceRange: { min: 2000, max: 8000 },
        duration: 480
    },
    // Électricité
    {
        id: "electric-repair",
        category: "Électricité",
        title: "Dépannage électrique",
        description: "Réparation panne électrique, disjoncteur, prises",
        typicalPrice: 90,
        priceRange: { min: 70, max: 180 },
        duration: 60
    },
    {
        id: "electric-installation",
        category: "Électricité",
        title: "Installation électrique",
        description: "Pose de prises, interrupteurs, luminaires",
        typicalPrice: 120,
        priceRange: { min: 80, max: 250 },
        duration: 90
    },
    {
        id: "electric-renovation",
        category: "Électricité",
        title: "Mise aux normes électrique",
        description: "Rénovation tableau électrique, mise aux normes",
        typicalPrice: 1200,
        priceRange: { min: 800, max: 2500 },
        duration: 240
    },
    // Jardinage
    {
        id: "garden-maintenance",
        category: "Jardinage",
        title: "Entretien de jardin",
        description: "Tonte, taille, désherbage",
        typicalPrice: 50,
        priceRange: { min: 30, max: 100 },
        duration: 120
    },
    {
        id: "garden-landscaping",
        category: "Jardinage",
        title: "Aménagement paysager",
        description: "Création d'espaces verts, plantation",
        typicalPrice: 800,
        priceRange: { min: 500, max: 2000 },
        duration: 360
    },
    // Ménage
    {
        id: "cleaning-home",
        category: "Ménage",
        title: "Ménage à domicile",
        description: "Nettoyage complet de votre domicile",
        typicalPrice: 25,
        priceRange: { min: 20, max: 40 },
        duration: 60
    },
    {
        id: "cleaning-deep",
        category: "Ménage",
        title: "Grand ménage",
        description: "Nettoyage en profondeur, vitres, sols",
        typicalPrice: 120,
        priceRange: { min: 80, max: 200 },
        duration: 180
    },
    // Peinture
    {
        id: "painting-room",
        category: "Peinture",
        title: "Peinture d'une pièce",
        description: "Peinture murs et plafond d'une pièce",
        typicalPrice: 300,
        priceRange: { min: 200, max: 600 },
        duration: 240
    },
    {
        id: "painting-exterior",
        category: "Peinture",
        title: "Peinture extérieure",
        description: "Ravalement de façade, peinture extérieure",
        typicalPrice: 2500,
        priceRange: { min: 1500, max: 5000 },
        duration: 480
    },
    // Déménagement
    {
        id: "moving-small",
        category: "Déménagement",
        title: "Petit déménagement",
        description: "Déménagement studio/F2",
        typicalPrice: 300,
        priceRange: { min: 200, max: 500 },
        duration: 180
    },
    {
        id: "moving-large",
        category: "Déménagement",
        title: "Grand déménagement",
        description: "Déménagement maison/grand appartement",
        typicalPrice: 800,
        priceRange: { min: 500, max: 1500 },
        duration: 480
    },
    // Bricolage
    {
        id: "handyman-small",
        category: "Bricolage",
        title: "Petits travaux",
        description: "Montage meuble, fixation, petites réparations",
        typicalPrice: 60,
        priceRange: { min: 40, max: 100 },
        duration: 90
    },
    {
        id: "handyman-renovation",
        category: "Bricolage",
        title: "Travaux de rénovation",
        description: "Rénovation partielle, aménagement",
        typicalPrice: 500,
        priceRange: { min: 300, max: 1200 },
        duration: 360
    }
]

export const serviceCategories = [
    "Plomberie",
    "Électricité",
    "Jardinage",
    "Ménage",
    "Peinture",
    "Déménagement",
    "Bricolage"
]
