"use client"

import * as React from "react"
import { AnimatePresence, m, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Layers, Search, Wrench, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatFCFA } from "@/lib/formatters"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { cn } from "@/lib/utils"

export interface ServiceSuggestionItem {
  id: string
  title: string
  categoryId: string
  categoryName: string
  price: number
  providerName: string
}

export interface CategorySuggestionItem {
  id: string
  name: string
}

interface ServiceAutocompleteProps {
  value: string
  onChange: (value: string) => void
  services: ServiceSuggestionItem[]
  categories: CategorySuggestionItem[]
  onSelectCategory?: (category: CategorySuggestionItem) => void
  onSelectService?: (service: ServiceSuggestionItem) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

type FlattenedOption =
  | { kind: "category"; item: CategorySuggestionItem }
  | { kind: "service"; item: ServiceSuggestionItem }

/**
 * Champ de recherche avec auto-completion en direct des metiers et prestations disponibles.
 * Supporte la navigation clavier (Fleches Haut/Bas, Entree, Echap) et les transitions GPU.
 */
export function ServiceAutocomplete({
  value,
  onChange,
  services,
  categories,
  onSelectCategory,
  onSelectService,
  placeholder = "Quel métier ou service ? (ex: Plombier, Clim...)",
  className,
  inputClassName,
}: ServiceAutocompleteProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const prefersReducedMotion = useReducedMotion()

  const normalizedQuery = value.trim().toLowerCase()

  const matchedCategories = React.useMemo(() => {
    if (!normalizedQuery) return categories.slice(0, 4)
    return categories
      .filter((c) => c.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 4)
  }, [categories, normalizedQuery])

  const matchedServices = React.useMemo(() => {
    if (!normalizedQuery) return services.slice(0, 5)
    return services
      .filter((s) => {
        const hay = `${s.title} ${s.categoryName} ${s.providerName}`.toLowerCase()
        return hay.includes(normalizedQuery)
      })
      .slice(0, 6)
  }, [services, normalizedQuery])

  const options = React.useMemo<FlattenedOption[]>(() => {
    return [
      ...matchedCategories.map((item) => ({ kind: "category" as const, item })),
      ...matchedServices.map((item) => ({ kind: "service" as const, item })),
    ]
  }, [matchedCategories, matchedServices])

  React.useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  const selectOption = (opt: FlattenedOption) => {
    setOpen(false)
    setActiveIndex(-1)
    if (opt.kind === "category") {
      onChange(opt.item.name)
      onSelectCategory?.(opt.item)
    } else {
      onChange(opt.item.title)
      onSelectService?.(opt.item)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true)
      return
    }
    if (!open) return

    if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (options.length === 0 ? -1 : (prev + 1) % options.length))
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) =>
        options.length === 0 ? -1 : prev <= 0 ? options.length - 1 : prev - 1
      )
      return
    }
    if (e.key === "Enter" && activeIndex >= 0 && options[activeIndex]) {
      e.preventDefault()
      selectOption(options[activeIndex])
    }
  }

  const hasResults = options.length > 0

  return (
    <div
      ref={containerRef}
      data-service-autocomplete="true"
      className={cn("relative w-full flex-1 min-w-0 text-left", className)}
    >
      <div className="relative flex items-center w-full">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0"
          aria-hidden="true"
        />
        <Input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-label="Rechercher un service ou un métier"
          placeholder={placeholder}
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-11 w-full border-0 bg-transparent pl-10 pr-9 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base sm:text-sm md:text-base placeholder:text-muted-foreground",
            inputClassName
          )}
        />
        <AnimatePresence>
          {value.length > 0 && (
            <m.div
              key="clear-search"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15, ease: EASE_OUT_EXPO }}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Effacer la recherche"
                onClick={() => {
                  onChange("")
                  setActiveIndex(-1)
                }}
                className="size-6 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (services.length > 0 || categories.length > 0) && (
          <m.div
            key="autocomplete-dropdown"
            data-autocomplete-dropdown="true"
            role="listbox"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 max-h-[min(55vh,320px)] overflow-y-auto overscroll-contain rounded-2xl border border-border/70 bg-popover p-2 text-left text-popover-foreground shadow-2xl"
          >
            {!hasResults ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                Aucune prestation trouvée pour &laquo; {value} &raquo;. Appuyez sur
                Rechercher pour élargir.
              </div>
            ) : (
              <div className="space-y-2">
                {matchedCategories.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Layers className="h-3.5 w-3.5 text-[hsl(var(--brand))]" />
                      Métiers disponibles
                    </div>
                    <div className="space-y-0.5">
                      {matchedCategories.map((cat, idx) => {
                        const isHighlighted = activeIndex === idx
                        return (
                          <Button
                            key={cat.id}
                            type="button"
                            variant="ghost"
                            role="option"
                            aria-selected={isHighlighted}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                              selectOption({ kind: "category", item: cat })
                            }
                            className={cn(
                              "w-full justify-between h-auto py-2 px-2.5 text-left font-medium rounded-xl",
                              isHighlighted && "bg-accent/15 text-foreground"
                            )}
                          >
                            <span className="truncate text-sm">{cat.name}</span>
                            <Badge variant="secondary" className="text-[11px] shrink-0">
                              Catégorie
                            </Badge>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {matchedServices.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Wrench className="h-3.5 w-3.5 text-[hsl(var(--brand))]" />
                      Prestations disponibles
                    </div>
                    <div className="space-y-0.5">
                      {matchedServices.map((svc, sIdx) => {
                        const flatIdx = matchedCategories.length + sIdx
                        const isHighlighted = activeIndex === flatIdx
                        return (
                          <Button
                            key={svc.id}
                            type="button"
                            variant="ghost"
                            role="option"
                            aria-selected={isHighlighted}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                              selectOption({ kind: "service", item: svc })
                            }
                            className={cn(
                              "w-full justify-between gap-2.5 h-auto py-2 px-2.5 text-left rounded-xl",
                              isHighlighted && "bg-accent/15 text-foreground"
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {svc.title}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {svc.categoryName} &bull; {svc.providerName}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xs font-bold text-[hsl(var(--brand))] tabular-nums whitespace-nowrap">
                                {formatFCFA(svc.price)}
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
