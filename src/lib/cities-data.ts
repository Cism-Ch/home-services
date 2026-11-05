export interface LocationItem {
  id: string
  label: string
  city: string
  commune?: string
  region: string
  country: string
  isPopular?: boolean
}

// Référentiel exhaustif des localités (Villes et Communes clés) pour la stratégie GEO
export const locationsData: LocationItem[] = [
  // District Autonome d'Abidjan & ses 13 Communes
  { id: "ci-abidjan-cocody", label: "Abidjan - Cocody", city: "Abidjan", commune: "Cocody", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-yopougon", label: "Abidjan - Yopougon", city: "Abidjan", commune: "Yopougon", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-marcory", label: "Abidjan - Marcory (Zone 4 / Biétry)", city: "Abidjan", commune: "Marcory", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-plateau", label: "Abidjan - Plateau", city: "Abidjan", commune: "Plateau", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-riviera", label: "Abidjan - Riviera (Palmeraie / Bonoumin)", city: "Abidjan", commune: "Riviera", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-treichville", label: "Abidjan - Treichville", city: "Abidjan", commune: "Treichville", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-koumassi", label: "Abidjan - Koumassi", city: "Abidjan", commune: "Koumassi", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-port-bouet", label: "Abidjan - Port-Bouët (Vridi / Aéroport)", city: "Abidjan", commune: "Port-Bouët", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-abobo", label: "Abidjan - Abobo", city: "Abidjan", commune: "Abobo", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-adjame", label: "Abidjan - Adjamé", city: "Abidjan", commune: "Adjamé", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-attecoube", label: "Abidjan - Attécoubé", city: "Abidjan", commune: "Attécoubé", region: "Abidjan", country: "Côte d'Ivoire" },
  { id: "ci-abidjan-bingerville", label: "Abidjan - Bingerville", city: "Abidjan", commune: "Bingerville", region: "Abidjan", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-abidjan-songon", label: "Abidjan - Songon", city: "Abidjan", commune: "Songon", region: "Abidjan", country: "Côte d'Ivoire" },
  { id: "ci-abidjan-anyama", label: "Abidjan - Anyama", city: "Abidjan", commune: "Anyama", region: "Abidjan", country: "Côte d'Ivoire" },

  // Grandes Villes & Villes Régionales de Côte d'Ivoire
  { id: "ci-yamoussoukro", label: "Yamoussoukro", city: "Yamoussoukro", region: "District Autonome", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-bouake", label: "Bouaké", city: "Bouaké", region: "Gbêkê", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-san-pedro", label: "San-Pédro", city: "San-Pédro", region: "San-Pédro", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-korhogo", label: "Korhogo", city: "Korhogo", region: "Poro", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-daloa", label: "Daloa", city: "Daloa", region: "Haut-Sassandra", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-grand-bassam", label: "Grand-Bassam", city: "Grand-Bassam", region: "Sud-Comoé", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-assinie", label: "Assinie-Mafia", city: "Assinie", region: "Sud-Comoé", country: "Côte d'Ivoire", isPopular: true },
  { id: "ci-man", label: "Man", city: "Man", region: "Tonkpi", country: "Côte d'Ivoire" },
  { id: "ci-gagnoa", label: "Gagnoa", city: "Gagnoa", region: "Gôh", country: "Côte d'Ivoire" },
  { id: "ci-divo", label: "Divo", city: "Divo", region: "Lôh-Djiboua", country: "Côte d'Ivoire" },
  { id: "ci-soubre", label: "Soubré", city: "Soubré", region: "Nawa", country: "Côte d'Ivoire" },
  { id: "ci-dabou", label: "Dabou", city: "Dabou", region: "Grands-Ponts", country: "Côte d'Ivoire" },
  { id: "ci-jacqueville", label: "Jacqueville", city: "Jacqueville", region: "Grands-Ponts", country: "Côte d'Ivoire" },
  { id: "ci-abengourou", label: "Abengourou", city: "Abengourou", region: "Indénié-Djuablin", country: "Côte d'Ivoire" },
  { id: "ci-bondoukou", label: "Bondoukou", city: "Bondoukou", region: "Gontougo", country: "Côte d'Ivoire" },
  { id: "ci-ferkessedougou", label: "Ferkessédougou", city: "Ferkessédougou", region: "Tchologo", country: "Côte d'Ivoire" },
  { id: "ci-boundiali", label: "Boundiali", city: "Boundiali", region: "Bagoué", country: "Côte d'Ivoire" },
  { id: "ci-odienne", label: "Odienné", city: "Odienné", region: "Kabadougou", country: "Côte d'Ivoire" },
  { id: "ci-seguela", label: "Séguéla", city: "Séguéla", region: "Worodougou", country: "Côte d'Ivoire" },
  { id: "ci-daoukro", label: "Daoukro", city: "Daoukro", region: "Iffou", country: "Côte d'Ivoire" },
  { id: "ci-agboville", label: "Agboville", city: "Agboville", region: "Agnéby-Tiassa", country: "Côte d'Ivoire" },
  { id: "ci-tiassale", label: "Tiassalé", city: "Tiassalé", region: "Agnéby-Tiassa", country: "Côte d'Ivoire" },
  { id: "ci-aboisso", label: "Aboisso", city: "Aboisso", region: "Sud-Comoé", country: "Côte d'Ivoire" },
  { id: "ci-guiglo", label: "Guiglo", city: "Guiglo", region: "Cavally", country: "Côte d'Ivoire" },
  { id: "ci-duekoue", label: "Duékoué", city: "Duékoué", region: "Guémon", country: "Côte d'Ivoire" },
  { id: "ci-bouna", label: "Bouna", city: "Bouna", region: "Bounkani", country: "Côte d'Ivoire" },
  { id: "ci-katiola", label: "Katiola", city: "Katiola", region: "Hambol", country: "Côte d'Ivoire" },
  { id: "ci-toumodi", label: "Toumodi", city: "Toumodi", region: "Bélier", country: "Côte d'Ivoire" },
  { id: "ci-bouafle", label: "Bouaflé", city: "Bouaflé", region: "Marahoué", country: "Côte d'Ivoire" },
  { id: "ci-sinfra", label: "Sinfra", city: "Sinfra", region: "Marahoué", country: "Côte d'Ivoire" },
  { id: "ci-oume", label: "Oumé", city: "Oumé", region: "Gôh", country: "Côte d'Ivoire" },

  // Hubs Régionaux Sous-Régionaux Partenaires
  { id: "sn-dakar-almadies", label: "Dakar - Almadies", city: "Dakar", commune: "Almadies", region: "Dakar", country: "Sénégal", isPopular: true },
  { id: "sn-dakar-plateau", label: "Dakar - Plateau", city: "Dakar", commune: "Plateau", region: "Dakar", country: "Sénégal" },
  { id: "cm-douala-bonanjo", label: "Douala - Bonanjo / Akwa", city: "Douala", commune: "Bonanjo", region: "Littoral", country: "Cameroun", isPopular: true },
  { id: "cm-yaounde-bastos", label: "Yaoundé - Bastos", city: "Yaoundé", commune: "Bastos", region: "Centre", country: "Cameroun" },
  { id: "bj-cotonou-haie-vive", label: "Cotonou - Haie Vive", city: "Cotonou", commune: "Haie Vive", region: "Littoral", country: "Bénin" },
  { id: "tg-lome-tokoin", label: "Lomé - Tokoin", city: "Lomé", commune: "Tokoin", region: "Maritime", country: "Togo" }
]

export type SortStrategy = "popular" | "alpha" | "region"

export function getSortedLocations(
  query = "",
  sortBy: SortStrategy = "popular"
): LocationItem[] {
  const normalizedQuery = query.toLowerCase().trim()

  const filtered = locationsData.filter((loc) => {
    if (!normalizedQuery) return true
    return (
      loc.label.toLowerCase().includes(normalizedQuery) ||
      loc.city.toLowerCase().includes(normalizedQuery) ||
      (loc.commune && loc.commune.toLowerCase().includes(normalizedQuery)) ||
      loc.region.toLowerCase().includes(normalizedQuery)
    )
  })

  return filtered.sort((a, b) => {
    if (sortBy === "popular") {
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return a.label.localeCompare(b.label, "fr")
    }

    if (sortBy === "alpha") {
      return a.label.localeCompare(b.label, "fr")
    }

    if (sortBy === "region") {
      const regionCompare = a.region.localeCompare(b.region, "fr")
      if (regionCompare !== 0) return regionCompare
      return a.label.localeCompare(b.label, "fr")
    }

    return 0
  })
}
