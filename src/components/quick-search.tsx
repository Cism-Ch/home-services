"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Zap, Droplets, Paintbrush, Snowflake, ShieldCheck, Hammer } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CityCombobox } from "@/components/city-combobox"
import type { LocationItem } from "@/lib/cities-data"

const categories = [
  { name: "Plomberie", icon: Droplets, slug: "plomberie" },
  { name: "Électricité", icon: Zap, slug: "electricite" },
  { name: "Climatisation", icon: Snowflake, slug: "climatisation" },
  { name: "Peinture", icon: Paintbrush, slug: "peinture" },
  { name: "Menuiserie", icon: Hammer, slug: "menuiserie" },
  { name: "Sécurité & Gardiennage", icon: ShieldCheck, slug: "securite" },
]

export function QuickSearch() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null)

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set("q", searchQuery.trim())
    if (selectedLocation) params.set("city", selectedLocation.city)
    if (selectedLocation?.commune) params.set("commune", selectedLocation.commune)
    if (selectedCategory) params.set("category", selectedCategory)

    router.push(`/services?${params.toString()}`)
  }

  const handleCategoryClick = (categorySlug: string) => {
    const nextCategory = selectedCategory === categorySlug ? null : categorySlug
    setSelectedCategory(nextCategory)

    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set("q", searchQuery.trim())
    if (selectedLocation) params.set("city", selectedLocation.city)
    if (nextCategory) params.set("category", nextCategory)

    router.push(`/services?${params.toString()}`)
  }

  return (
    <section className="w-full py-12 md:py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-appear">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            RECHERCHE GÉOLOCALISÉE
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Trouvez un artisan qualifié près de chez vous
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Recherchez par métier et par localité (villes et communes)
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col md:flex-row gap-2 bg-card/90 backdrop-blur-md border-2 border-border hover:border-primary/50 rounded-2xl p-2.5 transition-all duration-300 shadow-md">
              <div className="flex-1 flex items-center gap-3 px-2 sm:px-3 min-w-0">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <Input
                  type="text"
                  placeholder="Quel métier ou service ? (ex: Plombier, Clim...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base placeholder:text-muted-foreground"
                />
              </div>

              <div className="w-full md:w-[260px] shrink-0 border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-2">
                <CityCombobox
                  value={selectedLocation?.id}
                  onChange={setSelectedLocation}
                  placeholder="Ville ou commune (ex: Cocody...)"
                  triggerClassName="border-0 bg-transparent hover:bg-muted/40 shadow-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto px-8 font-semibold shadow-md hover:shadow-lg shrink-0 rounded-xl"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Ou parcourez directement par métier :
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.slug

              return (
                <Button
                  key={category.slug}
                  type="button"
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="rounded-full gap-1.5 h-9 px-3.5"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{category.name}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10 pt-8 border-t">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              0 % commission
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Sur le montant de vos interventions
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              50+ zones GEO
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Communes d&apos;Abidjan et villes de Côte d&apos;Ivoire
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              100 % direct
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Rendez-vous par créneaux + contact WhatsApp
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
