"use client"

import * as React from "react"
import { Columns2, Grid3x3, LayoutGrid, Rows3 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { notify } from "@/lib/notifications"
import { cn } from "@/lib/utils"

export type CatalogLayoutMode = "row-3x1" | "grid-3x2" | "grid-3x3" | "grid-4x3"

export interface CatalogLayoutPreset {
  id: CatalogLayoutMode
  label: string
  shortLabel: string
  description: string
  itemsPerPage: number
  cardLayout: "row" | "grid"
  gridClass: string
}

export const CATALOG_LAYOUT_PRESETS: Record<CatalogLayoutMode, CatalogLayoutPreset> = {
  "row-3x1": {
    id: "row-3x1",
    label: "Liste (min 3×1)",
    shortLabel: "3×1",
    description: "Affichage en lignes (1 colonne, min 3 lignes par page)",
    itemsPerPage: 6,
    cardLayout: "row",
    gridClass: "grid-cols-1",
  },
  "grid-3x2": {
    id: "grid-3x2",
    label: "Large (3×2)",
    shortLabel: "3×2",
    description: "Grille aérée : 3 lignes × 2 colonnes (6 par page)",
    itemsPerPage: 6,
    cardLayout: "grid",
    gridClass: "grid-cols-1 md:grid-cols-2",
  },
  "grid-3x3": {
    id: "grid-3x3",
    label: "Standard (3×3)",
    shortLabel: "3×3",
    description: "Grille équilibrée : 3 lignes × 3 colonnes (9 par page)",
    itemsPerPage: 9,
    cardLayout: "grid",
    gridClass: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  },
  "grid-4x3": {
    id: "grid-4x3",
    label: "Étendu (4×3)",
    shortLabel: "4×3",
    description: "Grille étendue : 4 lignes × 3 colonnes (12 par page)",
    itemsPerPage: 12,
    cardLayout: "grid",
    gridClass: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  },
}

const VALID_MODES = new Set<CatalogLayoutMode>([
  "row-3x1",
  "grid-3x2",
  "grid-3x3",
  "grid-4x3",
])

const STORAGE_CHANGE_EVENT = "hs-catalog-layout-change"

function readStoredLayout(
  storageKey: string,
  defaultMode: CatalogLayoutMode
): CatalogLayoutMode {
  if (typeof window === "undefined") return defaultMode
  try {
    const saved = window.localStorage.getItem(storageKey) as CatalogLayoutMode | null
    if (saved && VALID_MODES.has(saved)) {
      return saved
    }
  } catch {
    // Ignore les environnements sans acces localStorage
  }
  return defaultMode
}

/**
 * Hook persistant la preference de disposition catalogue (grille / liste) dans localStorage
 * via useSyncExternalStore sans divergence d'hydratation SSR ni setState dans useEffect.
 */
export function useCatalogLayout(
  storageKey: string,
  defaultMode: CatalogLayoutMode = "grid-3x3"
) {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === storageKey) onStoreChange()
      }
      const handleCustom = (e: Event) => {
        const detail = (e as CustomEvent<string>).detail
        if (detail === storageKey) onStoreChange()
      }
      window.addEventListener("storage", handleStorage)
      window.addEventListener(STORAGE_CHANGE_EVENT, handleCustom)
      return () => {
        window.removeEventListener("storage", handleStorage)
        window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustom)
      }
    },
    [storageKey]
  )

  const getSnapshot = React.useCallback(
    () => readStoredLayout(storageKey, defaultMode),
    [storageKey, defaultMode]
  )
  const getServerSnapshot = React.useCallback(() => defaultMode, [defaultMode])

  const mode = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  const setMode = React.useCallback(
    (next: CatalogLayoutMode) => {
      if (!VALID_MODES.has(next)) return
      try {
        window.localStorage.setItem(storageKey, next)
        window.dispatchEvent(
          new CustomEvent<string>(STORAGE_CHANGE_EVENT, { detail: storageKey })
        )
      } catch {
        // Ignore
      }
      const preset = CATALOG_LAYOUT_PRESETS[next]
      notify.info(`Affichage : ${preset.label}`, {
        id: "catalog-layout-mode",
        description: preset.description,
        duration: 2400,
      })
    },
    [storageKey]
  )

  return {
    mode,
    preset: CATALOG_LAYOUT_PRESETS[mode],
    setMode,
  }
}

interface CatalogLayoutToolbarProps {
  mode: CatalogLayoutMode
  onModeChange: (mode: CatalogLayoutMode) => void
  totalCount: number
  itemLabel: string
  className?: string
}

const MODE_OPTIONS: Array<{
  id: CatalogLayoutMode
  icon: React.ComponentType<{ className?: string }>
}> = [
  { id: "row-3x1", icon: Rows3 },
  { id: "grid-3x2", icon: Columns2 },
  { id: "grid-3x3", icon: Grid3x3 },
  { id: "grid-4x3", icon: LayoutGrid },
]

/**
 * Barre d'outils d'affichage permettant de basculer entre 3x1 (liste), 3x2, 3x3 et 4x3.
 */
export function CatalogLayoutToolbar({
  mode,
  onModeChange,
  totalCount,
  itemLabel,
  className,
}: CatalogLayoutToolbarProps) {
  return (
    <div
      data-catalog-toolbar="true"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card/70 px-4 py-2.5 backdrop-blur-sm",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        <span className="font-bold text-foreground tabular-nums">{totalCount}</span>{" "}
        {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-xs font-medium text-muted-foreground">
          Affichage :
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={mode}
          onValueChange={(val) => {
            if (val && VALID_MODES.has(val as CatalogLayoutMode)) {
              onModeChange(val as CatalogLayoutMode)
            }
          }}
          aria-label="Choisir la disposition des cartes"
        >
          {MODE_OPTIONS.map(({ id, icon: Icon }) => {
            const preset = CATALOG_LAYOUT_PRESETS[id]
            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={id}
                    aria-label={preset.label}
                    data-layout-option={id}
                    className="gap-1.5 px-2.5 text-xs font-semibold data-[state=on]:bg-[hsl(var(--brand))] data-[state=on]:text-white data-[state=on]:border-[hsl(var(--brand))]"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{preset.shortLabel}</span>
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="bottom">{preset.description}</TooltipContent>
              </Tooltip>
            )
          })}
        </ToggleGroup>
      </div>
    </div>
  )
}
