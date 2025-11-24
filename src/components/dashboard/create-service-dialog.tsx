"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { serviceTemplates, serviceCategories } from "@/lib/service-templates"
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

export function CreateServiceDialog({ open, onOpenChange, onCreateService }: CreateServiceDialogProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string>("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [duration, setDuration] = useState("")

    const handleTemplateSelect = (templateId: string) => {
        const template = serviceTemplates.find(t => t.id === templateId)
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
            price: parseFloat(price),
            duration: parseInt(duration)
        })
        // Reset form
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
                    <DialogTitle>Créer un nouveau service</DialogTitle>
                    <DialogDescription>
                        Choisissez un modèle ou créez votre service personnalisé.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Template Selection */}
                    <div className="space-y-3">
                        <Label>Modèles de services</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                            {serviceTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => handleTemplateSelect(template.id)}
                                    className={`text-left p-3 rounded-lg border transition-colors ${selectedTemplate === template.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:bg-accent"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{template.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {template.typicalPrice} € • {template.duration} min
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
                            <Label htmlFor="title">Titre du service *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Dépannage plomberie"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Décrivez votre service en détail..."
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
                                <Label htmlFor="price">Prix (€) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="50"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Durée (min) *</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="60"
                                    min="15"
                                    step="15"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Créer le service</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
