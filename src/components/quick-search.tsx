"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Wrench, Zap, Droplets, Paintbrush, Shovel, Home } from "lucide-react"
import { useState } from "react"

const categories = [
  { name: "Plomberie", icon: Droplets },
  { name: "Électricité", icon: Zap },
  { name: "Nettoyage", icon: Paintbrush },
  { name: "Jardinage", icon: Shovel },
  { name: "Rénovation", icon: Home },
  { name: "Peinture", icon: Paintbrush },
]

export function QuickSearch() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="py-16 container mx-auto px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--brand))]/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8 animate-appear opacity-0">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand))] mb-3 bg-[hsl(var(--brand))]/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand))] animate-pulse"></div>
            RECHERCHE RAPIDE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight gradient-brand mb-2">
            Trouvez votre service
          </h2>
          <p className="text-muted-foreground text-lg">
            Recherchez parmi nos professionnels qualifiés
          </p>
        </div>

        {/* Search Box */}
        <div className="relative mb-6 animate-appear opacity-0 delay-100">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--brand))]/20 via-[hsl(var(--brand-foreground))]/20 to-[hsl(var(--brand))]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex gap-2 bg-background/80 backdrop-blur-sm border-2 border-border hover:border-[hsl(var(--brand))]/50 rounded-xl p-2 transition-all duration-300 shadow-elevated">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-muted-foreground group-hover:text-[hsl(var(--brand))] transition-colors" />
                <Input
                  type="text"
                  placeholder="Quel service recherchez-vous ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground"
                />
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 px-8 font-semibold"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="space-y-4 animate-appear opacity-0 delay-300">
          <p className="text-sm text-muted-foreground text-center">
            Ou parcourez par catégorie :
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.name
              return (
                <Badge
                  key={category.name}
                  variant={isSelected ? "default" : "outline"}
                  className={`
                    group cursor-pointer px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105
                    ${isSelected 
                      ? "bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white border-0 shadow-lg" 
                      : "hover:border-[hsl(var(--brand))]/50 hover:bg-[hsl(var(--brand))]/5"
                    }
                  `}
                  onClick={() => setSelectedCategory(isSelected ? null : category.name)}
                  style={{
                    animationDelay: `${400 + index * 50}ms`
                  }}
                >
                  <Icon className={`h-4 w-4 mr-2 inline-block ${isSelected ? "" : "group-hover:text-[hsl(var(--brand))]"} transition-colors`} />
                  {category.name}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 animate-appear opacity-0 delay-700">
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-bold gradient-brand mb-1 group-hover:scale-110 transition-transform duration-300">
              500+
            </div>
            <div className="text-sm text-muted-foreground">
              Professionnels
            </div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-bold gradient-brand mb-1 group-hover:scale-110 transition-transform duration-300">
              2,000+
            </div>
            <div className="text-sm text-muted-foreground">
              Services réalisés
            </div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-3xl font-bold gradient-brand mb-1 group-hover:scale-110 transition-transform duration-300">
              4.8/5
            </div>
            <div className="text-sm text-muted-foreground">
              Note moyenne
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}