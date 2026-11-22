"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCategoryIllustration } from "@/lib/category-illustrations"
import { serviceTemplates, serviceCategories } from "@/lib/service-templates"
import { formatFCFA } from "@/lib/formatters"
import {
  DURATION_UNIT_LABELS,
  DURATION_UNIT_LIMITS,
  durationToApproxMinutes,
  type DurationUnit,
} from "@/lib/scheduling"
import type { CatalogCategory, CatalogService } from "@/lib/types/catalog"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Cpu,
  Droplets,
  Flame,
  Hammer,
  KeyRound,
  Lightbulb,
  Loader2,
  Paintbrush,
  PanelsTopLeft,
  SatelliteDish,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Trees,
  Truck,
  Tv,
  Waves,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react"

export interface ServiceFormPayload {
  title: string
  description: string
  category: string
  price: number
  duration: number
  durationUnit: DurationUnit
  durationValue: number
  isActive: boolean
}

interface CreateServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories?: CatalogCategory[]
  editingService?: CatalogService | null
  onSubmitService: (service: ServiceFormPayload) => Promise<boolean>
}

const CATEGORY_ICON_BY_SLUG: Record<string, LucideIcon> = {
  plomberie: Droplets,
  electricite: Zap,
  climatisation: Snowflake,
  menage: Sparkles,
  peinture: Paintbrush,
  demenagement: Truck,
  securite: ShieldCheck,
  serrurerie: KeyRound,
  menuiserie: Hammer,
  maconnerie: Wrench,
  jardinage: Trees,
  electrotechnique: Cpu,
  electronique: Tv,
  domotique: Wifi,
  luminaires: Lightbulb,
  antennes: SatelliteDish,
  "auto-moto": Car,
  assainissement: Waves,
  ferronnerie: Flame,
  "vitrerie-alu": PanelsTopLeft,
}

function normalizeSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "plomberie"
  )
}

function CategoryWatermarkIcon({
  categoryId,
  className,
}: {
  categoryId?: string | null
  className?: string
}) {
  const Icon = categoryId
    ? CATEGORY_ICON_BY_SLUG[normalizeSlug(categoryId)] ?? Wrench
    : Wrench
  return <Icon aria-hidden="true" className={className} />
}

/**
 * Formulaire modal paysage (grand ecran) & responsive de creation / modification d'une prestation FCFA.
 * - Choix de categorie en premier lieu filtrant les modeles rapides.
 * - Marges uniformes sur les 4 cotes, barres de defilement masquees (.no-scrollbar).
 * - Filigrane d'icone par categorie dans chaque carte modele + grand filigrane & lueurs orangees en fond.
 */
export function CreateServiceDialog({
  open,
  onOpenChange,
  categories,
  editingService = null,
  onSubmitService,
}: CreateServiceDialogProps) {
  const isEditing = Boolean(editingService)
  const [category, setCategory] = useState(
    editingService?.categoryId ?? categories?.[0]?.id ?? "plomberie"
  )
  const [showAllTemplates, setShowAllTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [title, setTitle] = useState(editingService?.title ?? "")
  const [description, setDescription] = useState(editingService?.description ?? "")
  const [price, setPrice] = useState(
    editingService ? String(editingService.price) : ""
  )
  const [durationUnit, setDurationUnit] = useState<DurationUnit>(
    editingService?.durationUnit ?? "MINUTES"
  )
  const [durationValue, setDurationValue] = useState(
    editingService ? String(editingService.durationValue) : "60"
  )
  const [isActive, setIsActive] = useState(editingService?.isActive ?? true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredTemplates = useMemo(() => {
    if (showAllTemplates || !category) return serviceTemplates
    const matched = serviceTemplates.filter((t) => t.categoryId === category)
    return matched.length > 0 ? matched : serviceTemplates
  }, [category, showAllTemplates])

  const selectedCategoryLabel = useMemo(() => {
    const found = categories?.find((c) => c.id === category)
    if (found) return found.name
    return category
  }, [categories, category])

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory)
    setShowAllTemplates(false)
    if (selectedTemplate) {
      const currentTpl = serviceTemplates.find((t) => t.id === selectedTemplate)
      if (currentTpl && currentTpl.categoryId !== nextCategory) {
        setSelectedTemplate("")
      }
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = serviceTemplates.find((t) => t.id === templateId)
    if (!template) return
    setSelectedTemplate(templateId)
    setTitle(template.title)
    setDescription(template.description)
    const matchedDbCat = categories?.find((c) => c.id === template.categoryId)
    setCategory(
      matchedDbCat ? matchedDbCat.id : template.categoryId
    )
    setPrice(template.typicalPrice.toString())
    if (template.duration >= 120 && template.duration % 60 === 0) {
      setDurationUnit("HOURS")
      setDurationValue(String(Math.round(template.duration / 60)))
    } else {
      setDurationUnit("MINUTES")
      setDurationValue(template.duration.toString())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    const limits = DURATION_UNIT_LIMITS[durationUnit]
    const parsedVal = Math.max(
      limits.min,
      Math.min(limits.max, parseInt(durationValue, 10) || limits.min)
    )
    const normalizedMinutes = durationToApproxMinutes(parsedVal, durationUnit)

    setIsSubmitting(true)
    try {
      const ok = await onSubmitService({
        title: title.trim(),
        description: description.trim(),
        category,
        price: parseInt(price, 10) || 10000,
        duration: normalizedMinutes,
        durationUnit,
        durationValue: parsedVal,
        isActive,
      })
      if (ok) {
        onOpenChange(false)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const previewIllustration = getCategoryIllustration(category)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative w-[calc(100vw-2rem)] sm:max-w-2xl lg:max-w-5xl max-h-[90dvh] p-5 sm:p-6 overflow-hidden flex flex-col gap-5 rounded-2xl border-border/70">
        {/* Lueurs orangees radiales GPU + Grand filigrane categorie en arriere-plan */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_92%_96%,hsla(var(--brand)/0.18)_0%,transparent_72%),radial-gradient(ellipse_48%_40%_at_8%_4%,hsla(var(--brand-foreground)/0.13)_0%,transparent_70%)]"
        />
        <CategoryWatermarkIcon
          categoryId={category}
          className="pointer-events-none absolute -bottom-10 -right-8 -z-10 h-60 w-60 sm:h-72 sm:w-72 text-[hsl(var(--brand))]/[0.06] -rotate-12 transition-all duration-500"
        />

        <DialogHeader className="shrink-0 space-y-1 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-extrabold tracking-tight gradient-brand">
            {isEditing ? "Modifier la prestation" : "Créer une nouvelle prestation"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEditing
              ? "Ajustez la catégorie, le tarif indicatif en FCFA, la durée ou la visibilité de cette prestation."
              : "Choisissez d'abord votre métier pour filtrer les modèles prêts à l'emploi et prévisualiser l'illustration."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 min-h-0 flex flex-col gap-5 overflow-hidden"
        >
          {/* Corps scrollable sans barre visible (paysage 2 colonnes sur >= lg) */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
              {/* Colonne Gauche : 1. Categorie -> 2. Illustration agrandie -> 3. Modeles rapides filtres */}
              <div className="lg:col-span-5 space-y-4 min-w-0">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-bold">
                    1. Catégorie de métier *
                  </Label>
                  <Select
                    value={category}
                    onValueChange={handleCategoryChange}
                    required
                  >
                    <SelectTrigger
                      id="category"
                      className="h-11 bg-background/85 backdrop-blur-sm border-border/70"
                    >
                      <SelectValue placeholder="Choisir un métier..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {categories && categories.length > 0
                        ? categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))
                        : serviceCategories.map((cat) => (
                            <SelectItem key={cat} value={normalizeSlug(cat)}>
                              {cat}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Apercu agrandi de l'illustration metier auto-selectionnee */}
                <div className="rounded-2xl border border-[hsl(var(--brand))]/25 bg-card/80 p-3 shadow-xs space-y-2.5">
                  <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-xl border border-border/50 bg-white">
                    <Image
                      src={previewIllustration}
                      alt={`Illustration ${selectedCategoryLabel}`}
                      fill
                      unoptimized
                      className="object-contain p-1.5"
                    />
                    <Badge className="absolute top-2.5 left-2.5 bg-background/90 text-foreground backdrop-blur-sm border border-border/60 text-xs font-semibold">
                      {selectedCategoryLabel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug px-0.5">
                    Illustration métier auto-sélectionnée (remplacée automatiquement si vous ajoutez des photos à votre portfolio).
                  </p>
                </div>

                {/* Modeles rapides filtres par categorie */}
                {!isEditing && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <Label className="text-sm font-bold">
                        Modèles rapides ({filteredTemplates.length})
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllTemplates((prev) => !prev)}
                        className="h-7 px-2 text-xs text-[hsl(var(--brand))] hover:text-[hsl(var(--brand))]"
                      >
                        {showAllTemplates ? "Filtrer par métier" : "Voir tous (25)"}
                      </Button>
                    </div>

                    <div className="max-h-[210px] lg:max-h-[230px] overflow-y-auto no-scrollbar rounded-xl border border-border/60 bg-background/55 p-2">
                      <RadioGroup
                        value={selectedTemplate}
                        onValueChange={handleTemplateSelect}
                        aria-label="Choisir un modèle de prestation"
                        className="grid grid-cols-1 gap-2"
                      >
                        {filteredTemplates.map((template) => {
                          const isSelected = selectedTemplate === template.id
                          const itemId = `tpl-${template.id}`

                          return (
                            <Label
                              key={template.id}
                              htmlFor={itemId}
                              className={cn(
                                "group relative overflow-hidden flex cursor-pointer items-start justify-between gap-2 rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow] duration-200 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                                isSelected
                                  ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/[0.08] shadow-xs"
                                  : "border-border/60 bg-card/75 hover:border-[hsl(var(--brand))]/40 hover:bg-card"
                              )}
                            >
                              <CategoryWatermarkIcon
                                categoryId={template.categoryId}
                                className="pointer-events-none absolute -bottom-2.5 -right-2 h-14 w-14 text-[hsl(var(--brand))]/[0.09] -rotate-12 transition-transform duration-300 group-hover:scale-110"
                              />
                              <RadioGroupItem
                                id={itemId}
                                value={template.id}
                                className="sr-only"
                              />
                              <div className="relative z-10 flex-1 min-w-0">
                                <p className="font-semibold text-sm leading-snug line-clamp-1">
                                  {template.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                                  {formatFCFA(template.typicalPrice)} •{" "}
                                  {template.duration} min
                                </p>
                              </div>
                              <Badge
                                variant={isSelected ? "default" : "outline"}
                                className="relative z-10 text-[11px] shrink-0"
                              >
                                {template.category}
                              </Badge>
                            </Label>
                          )
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>

              {/* Colonne Droite : Details de la prestation */}
              <div className="lg:col-span-7 space-y-4 min-w-0 rounded-2xl border border-border/60 bg-card/75 backdrop-blur-sm p-4 sm:p-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-bold">
                    2. Intitulé de la prestation *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Dépannage plomberie et fuite d'eau"
                    className="h-11 bg-background/85"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold">
                    Description détaillée *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Précisez ce qui est inclus dans votre intervention, les marques prises en charge, etc."
                    className="min-h-[120px] lg:min-h-[145px] bg-background/85 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-bold">
                      Tarif (FCFA) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="1000"
                      step="500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="15000"
                      className="h-11 bg-background/85 tabular-nums"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationValue" className="text-sm font-bold">
                      Durée estimée *
                    </Label>
                    <Input
                      id="durationValue"
                      type="number"
                      min={DURATION_UNIT_LIMITS[durationUnit].min}
                      max={DURATION_UNIT_LIMITS[durationUnit].max}
                      step={DURATION_UNIT_LIMITS[durationUnit].step}
                      value={durationValue}
                      onChange={(e) => setDurationValue(e.target.value)}
                      placeholder="60"
                      className="h-11 bg-background/85 tabular-nums"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationUnit" className="text-sm font-bold">
                      Échelle *
                    </Label>
                    <Select
                      value={durationUnit}
                      onValueChange={(val) => {
                        const nextUnit = val as DurationUnit
                        setDurationUnit(nextUnit)
                        setDurationValue(String(DURATION_UNIT_LIMITS[nextUnit].min))
                      }}
                    >
                      <SelectTrigger id="durationUnit" className="h-11 bg-background/85">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(DURATION_UNIT_LABELS) as DurationUnit[]).map(
                          (u) => (
                            <SelectItem key={u} value={u}>
                              {DURATION_UNIT_LABELS[u]}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedTemplate && (
                  <p className="text-xs text-muted-foreground tabular-nums rounded-lg bg-[hsl(var(--brand))]/[0.07] border border-[hsl(var(--brand))]/20 px-3 py-2">
                    Fourchette indicative habituelle :{" "}
                    <span className="font-bold text-foreground">
                      {formatFCFA(
                        serviceTemplates.find((t) => t.id === selectedTemplate)
                          ?.priceRange.min || 5000
                      )}{" "}
                      –{" "}
                      {formatFCFA(
                        serviceTemplates.find((t) => t.id === selectedTemplate)
                          ?.priceRange.max || 50000
                      )}
                    </span>
                  </p>
                )}

                {isEditing && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3.5 bg-background/70">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="svc-active"
                        className="text-sm font-semibold cursor-pointer"
                      >
                        Visible dans le catalogue public
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Désactivez pour archiver temporairement la prestation sans perdre l&apos;historique.
                      </p>
                    </div>
                    <Switch
                      id="svc-active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 pt-3 border-t border-border/50 gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !title.trim() ||
                !description.trim() ||
                !category ||
                !price ||
                !durationValue
              }
              className="gap-2 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] text-white font-bold shadow-md hover:shadow-lg"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Enregistrer les modifications" : "Publier la prestation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
