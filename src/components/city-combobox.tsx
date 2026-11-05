"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin, X, ArrowDownAZ, Star, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { locationsData, getSortedLocations, type LocationItem, type SortStrategy } from "@/lib/cities-data"

interface CityComboboxProps {
  value?: string
  onChange?: (location: LocationItem | null) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
}

export function CityCombobox({
  value,
  onChange,
  placeholder = "Sélectionner une ville ou commune...",
  className,
  triggerClassName,
}: CityComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [sortBy, setSortBy] = React.useState<SortStrategy>("popular")

  const selectedLocation = React.useMemo(() => {
    if (!value) return null
    return (
      locationsData.find(
        (loc) => loc.id === value || loc.city.toLowerCase() === value.toLowerCase() || loc.label.toLowerCase() === value.toLowerCase()
      ) || null
    )
  }, [value])

  const filteredLocations = React.useMemo(() => {
    return getSortedLocations(search, sortBy)
  }, [search, sortBy])

  const handleSelect = (item: LocationItem) => {
    if (selectedLocation?.id === item.id) {
      onChange?.(null)
    } else {
      onChange?.(item)
    }
    setOpen(false)
    setSearch("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
    setSearch("")
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal h-11 bg-background text-left px-3.5",
              !selectedLocation && "text-muted-foreground",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">
                {selectedLocation ? selectedLocation.label : placeholder}
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              {selectedLocation && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleClear(e as unknown as React.MouseEvent)
                    }
                  }}
                  className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[340px] sm:w-[420px] p-0 shadow-lg border" align="start">
          <Command shouldFilter={false}>
            <div className="p-2 border-b space-y-2 bg-muted/20">
              <CommandInput
                placeholder="Rechercher (ex: Cocody, Bouaké, San-Pédro)..."
                value={search}
                onValueChange={setSearch}
                className="h-9"
              />

              {/* Sorting toolbar */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 px-1">
                <span className="font-medium">Trier par :</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant={sortBy === "popular" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-6 px-2 text-[11px] gap-1"
                    onClick={() => setSortBy("popular")}
                  >
                    <Star className="h-3 w-3" />
                    Populaires
                  </Button>
                  <Button
                    type="button"
                    variant={sortBy === "alpha" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-6 px-2 text-[11px] gap-1"
                    onClick={() => setSortBy("alpha")}
                  >
                    <ArrowDownAZ className="h-3 w-3" />
                    A-Z
                  </Button>
                  <Button
                    type="button"
                    variant={sortBy === "region" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-6 px-2 text-[11px] gap-1"
                    onClick={() => setSortBy("region")}
                  >
                    <Layers className="h-3 w-3" />
                    Région
                  </Button>
                </div>
              </div>
            </div>

            <CommandList className="max-h-[280px] overflow-y-auto">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                Aucune localité trouvée pour &quot;{search}&quot;.
              </CommandEmpty>

              <CommandGroup heading={`${filteredLocations.length} localité(s) disponible(s)`}>
                {filteredLocations.map((loc) => {
                  const isSelected = selectedLocation?.id === loc.id

                  return (
                    <CommandItem
                      key={loc.id}
                      value={loc.id}
                      onSelect={() => handleSelect(loc)}
                      className="flex items-center justify-between py-2 px-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0 text-primary",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col truncate">
                          <span className={cn("text-sm", isSelected && "font-semibold text-primary")}>
                            {loc.label}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {loc.region} &bull; {loc.country}
                          </span>
                        </div>
                      </div>

                      {loc.isPopular && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 shrink-0 bg-primary/5 text-primary border-primary/20">
                          Populaire
                        </Badge>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
