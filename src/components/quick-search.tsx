"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Zap, Droplets, Paintbrush, Snowflake, ShieldCheck, Wrench } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CityCombobox } from "@/components/city-combobox"
import type { LocationItem } from "@/lib/cities-data"

const categories = [
  { name: "Plomberie", icon: Droplets, slug: "plomberie" },
  { name: "Électricité", icon: Zap, slug: "electricite" },
  { name: "Climatisation", icon: Snowflake, slug: "climatisation" },
  { name: "Peinture", icon: Paintbrush, slug: "peinture" },
  { name: "Bricolage", icon: Wrench, slug: "bricolage" },
  { name: "Sécurité & Entretien", icon: ShieldCheck, slug: "gardiennage" },
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
    <section className="py-16 container mx-auto px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-appear">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3 bg-primary/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            RECHERCHE GÉOLOCALISÉE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Trouvez un artisan qualifié près de chez vous
          </h2>
          <p className="text-muted-foreground text-lg">
            Recherchez par métier et par localité (villes et communes)
          </p>
        </div>

        {/* Dual Search Box (Service + City Combobox) */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex flex-col md:flex-row gap-2 bg-card/90 backdrop-blur-md border-2 border-border hover:border-primary/50 rounded-2xl p-2.5 transition-all duration-300 shadow-md">
              {/* Service Input */}
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <Input
                  type="text"
                  placeholder="Quel métier ou service ? (ex: Plombier, Clim...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground"
                />
              </div>

              {/* City Combobox with sorting and filtering */}
              <div className="w-full md:w-[280px] shrink-0 border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-2">
                <CityCombobox
                  value={selectedLocation?.id}
                  onChange={setSelectedLocation}
                  placeholder="Ville ou commune (ex: Cocody, Bouaké...)"
                  triggerClassName="border-0 bg-transparent hover:bg-muted/40 shadow-none"
                />
              </div>

              {/* Submit Button */}
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

        {/* Category Filters */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Ou parcourez directement par métier :
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.slug

              return (
                <Badge
                  key={category.slug}
                  variant={isSelected ? "default" : "outline"}
                  className={`
                    cursor-pointer px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 select-none
                    ${isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:border-primary/50 hover:bg-primary/5"
                    }
                  `}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <Icon className="h-4 w-4 mr-2 inline-block shrink-0" />
                  {category.name}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              500+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Artisans disponibles
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              30+
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Villes & communes couvertes
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              4.8 / 5
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Satisfaction clients
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
