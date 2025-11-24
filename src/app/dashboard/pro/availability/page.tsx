"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar, Trash2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const DAYS = [
    { id: "monday", label: "Lundi" },
    { id: "tuesday", label: "Mardi" },
    { id: "wednesday", label: "Mercredi" },
    { id: "thursday", label: "Jeudi" },
    { id: "friday", label: "Vendredi" },
    { id: "saturday", label: "Samedi" },
    { id: "sunday", label: "Dimanche" },
]

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return `${hour}:00`
})

interface UnavailabilityPeriod {
    id: string
    type: "vacation" | "sick" | "other"
    startDate: string
    endDate: string
    reason?: string
}

export default function ProAvailabilityPage() {
    const [unavailabilityPeriods, setUnavailabilityPeriods] = useState<UnavailabilityPeriod[]>([
        {
            id: "1",
            type: "vacation",
            startDate: "2024-12-20",
            endDate: "2024-12-31",
            reason: "Vacances de fin d'année"
        }
    ])
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [selectedType, setSelectedType] = useState<"vacation" | "sick" | "other">("vacation")
    const [customReason, setCustomReason] = useState("")

    const handleQuickAdd = (type: "vacation" | "sick" | "other") => {
        setSelectedType(type)
        // Auto-fill dates for quick actions
        const today = new Date()
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)

        setStartDate(today.toISOString().split('T')[0])
        setEndDate(nextWeek.toISOString().split('T')[0])
    }

    const handleAddPeriod = () => {
        if (!startDate || !endDate) return

        const newPeriod: UnavailabilityPeriod = {
            id: Date.now().toString(),
            type: selectedType,
            startDate,
            endDate,
            reason: customReason || getDefaultReason(selectedType)
        }

        setUnavailabilityPeriods([...unavailabilityPeriods, newPeriod])

        // Reset form
        setStartDate("")
        setEndDate("")
        setCustomReason("")
    }

    const handleDeletePeriod = (id: string) => {
        setUnavailabilityPeriods(unavailabilityPeriods.filter(p => p.id !== id))
    }

    const getDefaultReason = (type: "vacation" | "sick" | "other") => {
        switch (type) {
            case "vacation": return "Vacances"
            case "sick": return "Congé maladie"
            case "other": return "Indisponible"
        }
    }

    const getTypeLabel = (type: "vacation" | "sick" | "other") => {
        switch (type) {
            case "vacation": return "Vacances"
            case "sick": return "Maladie"
            case "other": return "Autre"
        }
    }

    const getTypeColor = (type: "vacation" | "sick" | "other") => {
        switch (type) {
            case "vacation": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            case "sick": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
            case "other": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
        }
    }

    return (
        <div className="space-y-8 animate-appear">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Disponibilités</h1>
                <p className="text-muted-foreground mt-2">
                    Définissez vos horaires d&apos;ouverture habituels et vos périodes d&apos;indisponibilité.
                </p>
            </div>

            {/* Unavailability Periods Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Périodes d&apos;indisponibilité</CardTitle>
                    <CardDescription>
                        Marquez-vous comme indisponible pour des périodes spécifiques. Votre profil public sera automatiquement mis à jour.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleQuickAdd("vacation")}
                            className="gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            Vacances
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleQuickAdd("sick")}
                            className="gap-2"
                        >
                            <AlertCircle className="h-4 w-4" />
                            Congé maladie
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleQuickAdd("other")}
                            className="gap-2"
                        >
                            Autre
                        </Button>
                    </div>

                    {/* Date Range Picker */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                        <div className="space-y-2">
                            <Label htmlFor="start-date">Date de début</Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date">Date de fin</Label>
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="reason">Raison (optionnel)</Label>
                            <Input
                                id="reason"
                                placeholder="Ex: Vacances d'été"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <Button onClick={handleAddPeriod} disabled={!startDate || !endDate}>
                                Ajouter la période
                            </Button>
                        </div>
                    </div>

                    {/* Active Periods List */}
                    <div className="space-y-3">
                        <Label className="text-base">Périodes actives</Label>
                        {unavailabilityPeriods.length > 0 ? (
                            <div className="space-y-2">
                                {unavailabilityPeriods.map((period) => (
                                    <div
                                        key={period.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={getTypeColor(period.type)}>
                                                    {getTypeLabel(period.type)}
                                                </Badge>
                                                <span className="font-medium">{period.reason}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Du {new Date(period.startDate).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })} au {new Date(period.endDate).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeletePeriod(period.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-dashed rounded-lg">
                                <p className="text-muted-foreground">Aucune période d&apos;indisponibilité définie</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card>
                <CardHeader>
                    <CardTitle>Horaires de la semaine</CardTitle>
                    <CardDescription>
                        Cochez les jours travaillés et indiquez vos créneaux horaires.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {DAYS.map((day) => (
                        <div key={day.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b last:border-0 last:pb-0">
                            <div className="flex items-center gap-4 min-w-[150px]">
                                <Switch id={`active-${day.id}`} defaultChecked={day.id !== "sunday"} />
                                <Label htmlFor={`active-${day.id}`} className="font-medium text-base cursor-pointer">
                                    {day.label}
                                </Label>
                            </div>

                            <div className="flex items-center gap-2 flex-1">
                                <Select defaultValue="09:00">
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Début" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HOURS.map(h => <SelectItem key={`start-${h}`} value={h}>{h}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground">-</span>
                                <Select defaultValue="18:00">
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Fin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HOURS.map(h => <SelectItem key={`end-${h}`} value={h}>{h}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="sm" className="ml-2 text-muted-foreground">
                                    + Ajouter une pause
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardContent className="border-t pt-6">
                    <div className="flex justify-end gap-4">
                        <Button variant="outline">Annuler</Button>
                        <Button>Enregistrer les horaires</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
