"use client"

import { useState } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Loader2 } from "lucide-react"

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

function normalizeSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/)[0] || "plomberie"
  )
}

/**
 * Formulaire modal de creation et de modification d'une prestation en FCFA.
 * Affiche en direct l'illustration editorial flat auto-selectionnee selon la categorie.
 */
export function CreateServiceDialog({
  open,
  onOpenChange,
  categories,
  editingService = null,
  onSubmitService,
}: CreateServiceDialogProps) {
  const isEditing = Boolean(editingService)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [title, setTitle] = useState(editingService?.title ?? "")
  const [description, setDescription] = useState(editingService?.description ?? "")
  const [category, setCategory] = useState(
    editingService?.categoryId ?? categories?.[0]?.id ?? ""
  )
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

  const handleTemplateSelect = (templateId: string) => {
    const template = serviceTemplates.find((t) => t.id === templateId)
    if (!template) return
    setSelectedTemplate(templateId)
    setTitle(template.title)
    setDescription(template.description)
    const slug = normalizeSlug(template.category)
    const matchedDbCat = categories?.find((c) => c.id === slug)
    setCategory(
      matchedDbCat
        ? matchedDbCat.id
        : categories
        ? categories[0]?.id || slug
        : template.category
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la prestation" : "Créer une nouvelle prestation"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Ajustez le titre, la catégorie, le tarif indicatif en FCFA ou la visibilité de cette prestation."
              : "Sélectionnez un modèle prêt à l'emploi ou personnalisez votre prestation avec un tarif indicatif en FCFA."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection (creation mode only) */}
          {!isEditing && (
            <div className="space-y-3">
              <Label>Modèles de prestations rapides</Label>
              <ScrollArea className="h-[200px] rounded-lg border p-3">
                <RadioGroup
                  value={selectedTemplate}
                  onValueChange={handleTemplateSelect}
                  aria-label="Choisir un modèle de prestation"
                  className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  {serviceTemplates.map((template) => {
                    const isSelected = selectedTemplate === template.id
                    const itemId = `tpl-${template.id}`
                    return (
                      <Label
                        key={template.id}
                        htmlFor={itemId}
                        className={cn(
                          "flex cursor-pointer items-start justify-between gap-2 rounded-lg border p-3 text-left transition-colors has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-accent"
                        )}
                      >
                        <RadioGroupItem
                          id={itemId}
                          value={template.id}
                          className="sr-only"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {template.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                            {formatFCFA(template.typicalPrice)} •{" "}
                            {template.duration} min
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {template.category}
                        </Badge>
                      </Label>
                    )
                  })}
                </RadioGroup>
              </ScrollArea>
            </div>
          )}

          {/* Apercu auto-selectionne de l'illustration metier */}
          <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border bg-white">
              <Image
                src={previewIllustration}
                alt="Illustration du métier sélectionné"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">
                Illustration métier auto-sélectionnée
              </p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                Cette illustration s&apos;adapte automatiquement à la catégorie choisie (sauf si vous ajoutez des photos dans votre portfolio).
              </p>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Intitulé de la prestation *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Dépannage plomberie et fuite d'eau"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Précisez ce qui est inclus dans votre intervention..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent>
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

              <div className="space-y-2">
                <Label htmlFor="price">Tarif indicatif (FCFA) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="1000"
                  step="500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="15000"
                  required
                />
                {selectedTemplate && (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    Fourchette :{" "}
                    {formatFCFA(
                      serviceTemplates.find((t) => t.id === selectedTemplate)
                        ?.priceRange.min || 5000
                    )}{" "}
                    -{" "}
                    {formatFCFA(
                      serviceTemplates.find((t) => t.id === selectedTemplate)
                        ?.priceRange.max || 50000
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationValue">Durée estimée *</Label>
                <Input
                  id="durationValue"
                  type="number"
                  min={DURATION_UNIT_LIMITS[durationUnit].min}
                  max={DURATION_UNIT_LIMITS[durationUnit].max}
                  step={DURATION_UNIT_LIMITS[durationUnit].step}
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  placeholder="60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationUnit">Échelle de durée *</Label>
                <Select
                  value={durationUnit}
                  onValueChange={(val) => {
                    const nextUnit = val as DurationUnit
                    setDurationUnit(nextUnit)
                    setDurationValue(String(DURATION_UNIT_LIMITS[nextUnit].min))
                  }}
                >
                  <SelectTrigger id="durationUnit">
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

            {isEditing && (
              <div className="flex items-center justify-between gap-3 rounded-xl border p-3.5 bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="svc-active" className="text-sm font-semibold cursor-pointer">
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

          <DialogFooter>
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
              className="gap-2"
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
