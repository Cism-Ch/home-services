"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { serviceTemplates, serviceCategories } from "@/lib/service-templates"
import { formatFCFA } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface CreateServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateService: (service: {
    title: string
    description: string
    category: string
    price: number
    duration: number
  }) => void
}

export function CreateServiceDialog({
  open,
  onOpenChange,
  onCreateService,
}: CreateServiceDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [duration, setDuration] = useState("")

  const handleTemplateSelect = (templateId: string) => {
    const template = serviceTemplates.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setTitle(template.title)
      setDescription(template.description)
      setCategory(template.category)
      setPrice(template.typicalPrice.toString())
      setDuration(template.duration.toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateService({
      title,
      description,
      category,
      price: parseInt(price, 10) || 10000,
      duration: parseInt(duration, 10) || 60,
    })
    setSelectedTemplate("")
    setTitle("")
    setDescription("")
    setCategory("")
    setPrice("")
    setDuration("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle prestation</DialogTitle>
          <DialogDescription>
            Sélectionnez un modèle prêt à l&apos;emploi ou personnalisez votre prestation avec un tarif indicatif en FCFA.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Modèles de prestations rapides</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[210px] overflow-y-auto border rounded-lg p-3">
              {serviceTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{template.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFCFA(template.typicalPrice)} • {template.duration} min
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {template.category}
                    </Badge>
                  </div>
                </button>
              ))}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
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
                  <p className="text-xs text-muted-foreground">
                    Fourchette :{" "}
                    {formatFCFA(
                      serviceTemplates.find((t) => t.id === selectedTemplate)?.priceRange.min || 5000
                    )}{" "}
                    -{" "}
                    {formatFCFA(
                      serviceTemplates.find((t) => t.id === selectedTemplate)?.priceRange.max || 50000
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée estimée (min) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="60"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!title || !description || !category || !price || !duration}>
              Publier la prestation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
