"use client"

import { Button } from "@/components/ui/button"
import { Zap, Droplets, Paintbrush, Snowflake, ShieldCheck, Hammer } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CityCombobox } from "@/components/city-combobox"
import { RevealOnScroll } from "@/components/motion/reveal"
import { AnimatedCounter } from "@/components/motion/animated-counter"
import {
  ServiceAutocomplete,
  type CategorySuggestionItem,
  type ServiceSuggestionItem,
} from "@/components/service-autocomplete"
import type { LocationItem } from "@/lib/cities-data"

const categories = [
  { name: "Plomberie", icon: Droplets, slug: "plomberie" },
  { name: "Électricité", icon: Zap, slug: "electricite" },
  { name: "Climatisation", icon: Snowflake, slug: "climatisation" },
  { name: "Peinture", icon: Paintbrush, slug: "peinture" },
  { name: "Menuiserie", icon: Hammer, slug: "menuiserie" },
  { name: "Sécurité & Gardiennage", icon: ShieldCheck, slug: "securite" },
]

interface QuickSearchProps {
  services?: ServiceSuggestionItem[]
  categoriesList?: CategorySuggestionItem[]
}

export function QuickSearch({
  services = [],
  categoriesList = [],
}: QuickSearchProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null)

  const navigateToServices = (opts: { q?: string; category?: string | null }) => {
    const params = new URLSearchParams()
    if (opts.q?.trim()) params.set("q", opts.q.trim())
    if (selectedLocation) params.set("city", selectedLocation.city)
    if (selectedLocation?.commune) params.set("commune", selectedLocation.commune)
    if (opts.category) params.set("category", opts.category)

    const qs = params.toString()
    router.push(qs ? `/services?${qs}` : "/services")
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    navigateToServices({ q: searchQuery, category: selectedCategory })
  }

  const handleCategoryClick = (categorySlug: string) => {
    const nextCategory = selectedCategory === categorySlug ? null : categorySlug
    setSelectedCategory(nextCategory)
    navigateToServices({ q: searchQuery, category: nextCategory })
  }

  return (
    <section
      id="quick-search"
      className="w-full py-12 md:py-16 relative overflow-x-clip scroll-mt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--primary)/0.05)_0%,transparent_72%)]"
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="w-full max-w-6xl mx-auto">
        <RevealOnScroll className="text-center mb-8">
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
        </RevealOnScroll>

        <form onSubmit={handleSearch} className="relative z-30 mb-6">
          <div className="relative flex flex-col md:flex-row md:items-center gap-2 bg-card/95 backdrop-blur-md border-2 border-border hover:border-primary/50 focus-within:border-primary/60 focus-within:shadow-lg rounded-2xl p-2 sm:p-2.5 transition-[border-color,box-shadow] duration-200 shadow-md">
              <ServiceAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                services={services}
                categories={categoriesList}
                onSelectCategory={(cat) =>
                  navigateToServices({ category: cat.id })
                }
                onSelectService={(svc) =>
                  navigateToServices({ q: svc.title, category: svc.categoryId })
                }
              />

              <div className="w-full md:w-[260px] shrink-0 border-t md:border-t-0 md:border-l border-border/60 pt-2 md:pt-0 md:pl-2">
                <CityCombobox
                  value={selectedLocation?.id}
                  onChange={setSelectedLocation}
                  placeholder="Ville ou commune (ex: Cocody...)"
                  triggerClassName="h-11 border-0 bg-transparent hover:bg-muted/40 shadow-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto h-11 px-8 font-semibold shadow-md hover:shadow-lg shrink-0 rounded-xl"
              >
                Rechercher
              </Button>
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
              <AnimatedCounter value={0} suffix=" %" /> commission
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Sur le montant de vos interventions
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              <AnimatedCounter value={50} suffix="+" /> zones GEO
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Communes d&apos;Abidjan et villes de Côte d&apos;Ivoire
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1">
              <AnimatedCounter value={100} suffix=" %" /> direct
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
