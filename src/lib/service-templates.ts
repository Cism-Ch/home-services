// Catalogue des modeles de prestations standards en FCFA (XOF) pour les professionnels
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
    title: "Dépannage plomberie et fuite d'eau",
    description: "Intervention rapide pour fuites d'eau, robinetterie, chasse d'eau et débouchage canalisation.",
    typicalPrice: 15000,
    priceRange: { min: 10000, max: 35000 },
    duration: 60,
  },
  {
    id: "plumbing-installation",
    category: "Plomberie",
    title: "Installation sanitaire et chauffe-eau",
    description: "Pose de lavabo, WC, colonne de douche, chauffe-eau ou surpresseur domestique.",
    typicalPrice: 30000,
    priceRange: { min: 20000, max: 65000 },
    duration: 120,
  },
  // Electricite
  {
    id: "electric-repair",
    category: "Électricité",
    title: "Dépannage électrique et court-circuit",
    description: "Recherche de panne, remplacement de disjoncteur, prises, interrupteurs et coffret.",
    typicalPrice: 15000,
    priceRange: { min: 10000, max: 40000 },
    duration: 60,
  },
  {
    id: "electric-installation",
    category: "Électricité",
    title: "Installation électrique et régulateur",
    description: "Pose de luminaires, brasseurs d'air, inverseur groupe électrogène ou stabilisateur.",
    typicalPrice: 25000,
    priceRange: { min: 15000, max: 60000 },
    duration: 90,
  },
  // Climatisation & Froid
  {
    id: "ac-maintenance",
    category: "Climatisation",
    title: "Entretien complet et recharge gaz split",
    description: "Nettoyage haute pression, désinfection antibactérienne et appoint de gaz réfrigérant.",
    typicalPrice: 20000,
    priceRange: { min: 12000, max: 35000 },
    duration: 90,
  },
  {
    id: "ac-installation",
    category: "Climatisation",
    title: "Pose et raccordement de climatiseur split",
    description: "Installation complète unité intérieure et moteur extérieur avec tirage au vide.",
    typicalPrice: 35000,
    priceRange: { min: 25000, max: 55000 },
    duration: 150,
  },
  // Peinture
  {
    id: "painting-room",
    category: "Peinture",
    title: "Peinture intérieure pièce ou salon",
    description: "Préparation des supports, enduit, ponçage et application de deux couches de peinture.",
    typicalPrice: 45000,
    priceRange: { min: 30000, max: 120000 },
    duration: 240,
  },
  // Menage & Nettoyage
  {
    id: "cleaning-home",
    category: "Ménage",
    title: "Grand nettoyage domicile ou fin de chantier",
    description: "Dépoussiérage intégral, lavage des sols, vitres, cuisine et désinfection des sanitaires.",
    typicalPrice: 20000,
    priceRange: { min: 10000, max: 50000 },
    duration: 180,
  },
  // Demenagement
  {
    id: "moving-local",
    category: "Déménagement",
    title: "Déménagement urbain avec manutention",
    description: "Transport sécurisé de mobilier et électroménager avec démontage et remontage inclus.",
    typicalPrice: 60000,
    priceRange: { min: 35000, max: 150000 },
    duration: 240,
  },
  // Bricolage & Menuiserie
  {
    id: "handyman-small",
    category: "Bricolage",
    title: "Montage de meubles et serrurerie",
    description: "Assemblage de placards, pose de tringles, changement de serrures et petits travaux.",
    typicalPrice: 12000,
    priceRange: { min: 8000, max: 30000 },
    duration: 90,
  },
]

export const serviceCategories = [
  "Plomberie",
  "Électricité",
  "Climatisation",
  "Peinture",
  "Ménage",
  "Déménagement",
  "Bricolage",
]
