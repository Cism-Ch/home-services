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
    category: "Menuiserie",
    title: "Montage de meubles et menuiserie bois",
    description: "Assemblage de placards, fabrication sur mesure, réparation de portes et meubles bois.",
    typicalPrice: 15000,
    priceRange: { min: 10000, max: 45000 },
    duration: 90,
  },
  // Serrurerie
  {
    id: "locksmith-door",
    category: "Serrurerie",
    title: "Ouverture de porte et changement de serrure",
    description: "Intervention rapide pour porte claquée, remplacement de cylindre et pose de serrure haute sécurité.",
    typicalPrice: 15000,
    priceRange: { min: 10000, max: 35000 },
    duration: 60,
  },
  // Electrotechnique
  {
    id: "electrotech-generator",
    category: "Électrotechnique",
    title: "Pose et entretien de groupe électrogène",
    description: "Installation, raccordement d'inverseur automatique, vidange et dépannage de groupe électrogène.",
    typicalPrice: 35000,
    priceRange: { min: 20000, max: 90000 },
    duration: 120,
  },
  // Electronique
  {
    id: "electronics-repair",
    category: "Électronique",
    title: "Réparation TV, frigo et électroménager",
    description: "Diagnostic et réparation d'appareils électroniques et électroménagers (préciser marque et panne).",
    typicalPrice: 15000,
    priceRange: { min: 10000, max: 45000 },
    duration: 90,
  },
  // Domotique
  {
    id: "smarthome-setup",
    category: "Domotique",
    title: "Installation domotique et automatisation",
    description: "Configuration d'interrupteurs connectés, motorisation de portail, capteurs et contrôle smartphone.",
    typicalPrice: 40000,
    priceRange: { min: 25000, max: 120000 },
    duration: 150,
  },
  // Luminaires
  {
    id: "lighting-install",
    category: "Luminaires",
    title: "Pose de lustres, spots LED et appliques",
    description: "Installation sécurisée de luminaires intérieurs/extérieurs, bandeaux LED et variateurs.",
    typicalPrice: 15000,
    priceRange: { min: 10000, max: 40000 },
    duration: 60,
  },
  // Antennes & Paraboles
  {
    id: "satellite-dish",
    category: "Antennes",
    title: "Pose et réglage parabole (marque à préciser)",
    description: "Installation complète, pointage signal et dépannage parabole/TNT (préciser marque : Canal+, StarTimes, etc.).",
    typicalPrice: 12000,
    priceRange: { min: 8000, max: 25000 },
    duration: 60,
  },
  // Depannage Auto & Moto
  {
    id: "auto-moto-home",
    category: "Auto-Moto",
    title: "Dépannage auto ou moto à domicile",
    description: "Intervention sur place : batterie, crevaison, diagnostic panne ou vidange rapide (préciser modèle).",
    typicalPrice: 15000,
    priceRange: { min: 10000, max: 45000 },
    duration: 60,
  },
  // Vidange & Assainissement
  {
    id: "septic-cleaning",
    category: "Assainissement",
    title: "Vidange fosse septique et curage égouts",
    description: "Pompage par camion hydrocureur, débouchage canalisation principale et nettoyage complet des regards.",
    typicalPrice: 45000,
    priceRange: { min: 30000, max: 100000 },
    duration: 120,
  },
  // Ferronnerie
  {
    id: "ironwork-welding",
    category: "Ferronnerie",
    title: "Ferronnerie, grilles et soudure sur mesure",
    description: "Fabrication, pose ou réparation de portails métalliques, antivols fenêtres et rampes en fer forgé.",
    typicalPrice: 35000,
    priceRange: { min: 20000, max: 150000 },
    duration: 180,
  },
  // Vitrerie & Alu
  {
    id: "alu-glass-partition",
    category: "Vitrerie-Alu",
    title: "Pose porte, fenêtre ou cloison verre & alu",
    description: "Prise de mesures, fabrication et pose de menuiserie aluminium, baies vitrées et cloisons de bureau/maison.",
    typicalPrice: 50000,
    priceRange: { min: 30000, max: 180000 },
    duration: 180,
  },
]

export const serviceCategories = [
  "Plomberie",
  "Électricité",
  "Climatisation",
  "Peinture",
  "Ménage",
  "Déménagement",
  "Menuiserie",
  "Serrurerie",
  "Électrotechnique",
  "Électronique",
  "Domotique",
  "Luminaires",
  "Antennes",
  "Auto-Moto",
  "Assainissement",
  "Ferronnerie",
  "Vitrerie-Alu",
  "Jardinage",
]
