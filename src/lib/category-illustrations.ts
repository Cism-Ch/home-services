/**
 * Referentiel centralise des illustrations editoriales flat par categorie de metier.
 * Auto-selectionnees selon le slug categorie (ex: plomberie, electricite, climatisation).
 */

export const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  plomberie: "/images/services/plomberie.jpg",
  electricite: "/images/services/electricite.jpg",
  climatisation: "/images/services/climatisation.jpg",
  menage: "/images/services/menage.jpg",
  peinture: "/images/services/peinture.jpg",
  menuiserie: "/images/services/menuiserie.jpg",
  bricolage: "/images/services/menuiserie.jpg",
  demenagement: "/images/services/demenagement.jpg",
  securite: "/images/services/securite.jpg",
  maconnerie: "/images/services/maconnerie.jpg",
  jardinage: "/images/services/jardinage.jpg",
}

const DEFAULT_ILLUSTRATION = "/images/services/electricite.jpg"

function normalizeCategoryKey(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .split(/[^a-z0-9]+/)[0] || ""
}

/**
 * Retourne l'illustration metier locale correspondant au slug ou nom de categorie.
 */
export function getCategoryIllustration(categoryIdOrName?: string | null): string {
  if (!categoryIdOrName) return DEFAULT_ILLUSTRATION
  const key = normalizeCategoryKey(categoryIdOrName)
  return CATEGORY_ILLUSTRATIONS[key] ?? DEFAULT_ILLUSTRATION
}
