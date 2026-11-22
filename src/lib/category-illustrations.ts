/**
 * Referentiel centralise des illustrations editoriales flat par categorie de metier.
 * Auto-selectionnees selon le slug ou le nom de la categorie.
 */

export const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  plomberie: "/images/services/plomberie.jpg",
  electricite: "/images/services/electricite.jpg",
  climatisation: "/images/services/climatisation.jpg",
  menage: "/images/services/menage.jpg",
  peinture: "/images/services/peinture.jpg",
  menuiserie: "/images/services/menuiserie.jpg",
  bricolage: "/images/services/menuiserie.jpg",
  meuble: "/images/services/menuiserie.jpg",
  meubles: "/images/services/menuiserie.jpg",
  demenagement: "/images/services/demenagement.jpg",
  securite: "/images/services/securite.jpg",
  serrurerie: "/images/services/serrurerie.jpg",
  serrure: "/images/services/serrurerie.jpg",
  maconnerie: "/images/services/maconnerie.jpg",
  jardinage: "/images/services/jardinage.jpg",
  electrotechnique: "/images/services/electrotechnique.svg",
  electronique: "/images/services/electronique.svg",
  electromenager: "/images/services/electronique.svg",
  domotique: "/images/services/domotique.svg",
  luminaires: "/images/services/luminaires.svg",
  luminaire: "/images/services/luminaires.svg",
  antennes: "/images/services/antennes.svg",
  antenne: "/images/services/antennes.svg",
  parabole: "/images/services/antennes.svg",
  "auto-moto": "/images/services/auto-moto.svg",
  auto: "/images/services/auto-moto.svg",
  moto: "/images/services/auto-moto.svg",
  assainissement: "/images/services/assainissement.svg",
  vidange: "/images/services/assainissement.svg",
  ferronnerie: "/images/services/ferronnerie.svg",
  ferronnier: "/images/services/ferronnerie.svg",
  soudure: "/images/services/ferronnerie.svg",
  "vitrerie-alu": "/images/services/vitrerie-alu.svg",
  vitrerie: "/images/services/vitrerie-alu.svg",
  aluminium: "/images/services/vitrerie-alu.svg",
}

const DEFAULT_ILLUSTRATION = "/images/services/electricite.jpg"

function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

/**
 * Retourne l'illustration metier locale correspondant au slug ou nom de categorie.
 */
export function getCategoryIllustration(categoryIdOrName?: string | null): string {
  if (!categoryIdOrName) return DEFAULT_ILLUSTRATION
  const normalized = normalizeSlug(categoryIdOrName)
  if (CATEGORY_ILLUSTRATIONS[normalized]) {
    return CATEGORY_ILLUSTRATIONS[normalized]
  }
  const firstToken = normalized.split(/[^a-z0-9-]+/)[0] || ""
  if (CATEGORY_ILLUSTRATIONS[firstToken]) {
    return CATEGORY_ILLUSTRATIONS[firstToken]
  }
  const simpleToken = normalized.split(/[^a-z0-9]+/)[0] || ""
  return CATEGORY_ILLUSTRATIONS[simpleToken] ?? DEFAULT_ILLUSTRATION
}
