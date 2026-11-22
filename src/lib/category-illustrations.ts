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
  electrotechnique: "/images/services/electrotechnique.jpg",
  electronique: "/images/services/electronique.jpg",
  electromenager: "/images/services/electronique.jpg",
  domotique: "/images/services/domotique.jpg",
  luminaires: "/images/services/luminaires.jpg",
  luminaire: "/images/services/luminaires.jpg",
  antennes: "/images/services/antennes.jpg",
  antenne: "/images/services/antennes.jpg",
  parabole: "/images/services/antennes.jpg",
  "auto-moto": "/images/services/auto-moto.jpg",
  auto: "/images/services/auto-moto.jpg",
  moto: "/images/services/auto-moto.jpg",
  assainissement: "/images/services/assainissement.jpg",
  vidange: "/images/services/assainissement.jpg",
  ferronnerie: "/images/services/ferronnerie.jpg",
  ferronnier: "/images/services/ferronnerie.jpg",
  soudure: "/images/services/ferronnerie.jpg",
  "vitrerie-alu": "/images/services/vitrerie-alu.jpg",
  vitrerie: "/images/services/vitrerie-alu.jpg",
  aluminium: "/images/services/vitrerie-alu.jpg",
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
