"use client"

import { useState, useEffect } from "react"
import { professionals, services } from "@/lib/mock-data"
import { BookingStepper } from "@/components/booking-stepper"
import { BookingSummary } from "@/components/booking-summary"
import { DateTimePicker } from "@/components/date-time-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notFound, useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

interface BookingPageProps {
    params: Promise<{
        proId: string
        serviceId: string
    }>
}

const steps = ["Service", "Date & Heure", "Coordonnées", "Confirmation"]

export default function BookingPage({ params }: BookingPageProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<string>()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    })

    const [proId, setProId] = useState<string>("")
    const [serviceId, setServiceId] = useState<string>("")

    // Use effect to unwrap params
    useEffect(() => {
        params.then(({ proId, serviceId }) => {
            setProId(proId)
            setServiceId(serviceId)
        })
    }, [params])

    if (!proId || !serviceId) {
        return <div className="container mx-auto px-4 py-8">Chargement...</div>
    }

    const professional = professionals.find(p => p.id === proId)
    const service = services.find(s => s.id === serviceId)

    if (!professional || !service) {
        notFound()
    }

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        // In a real app, this would submit to backend
        console.log("Booking submitted:", { professional, service, selectedDate, selectedTime, formData })
        setCurrentStep(4)
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return true
            case 2:
                return selectedDate && selectedTime
            case 3:
                return formData.name && formData.email && formData.phone
            default:
                return false
        }
    }

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container mx-auto px-4">
                <BookingStepper currentStep={currentStep} steps={steps} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2">
                        {currentStep === 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Détails du service</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                                        <p className="text-muted-foreground">{service.description}</p>
                                    </div>
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-2">Ce qui est inclus :</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                            <li>Devis gratuit</li>
                                            <li>Intervention rapide</li>
                                            <li>Garantie du travail effectué</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {currentStep === 2 && (
                            <DateTimePicker
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                onDateChange={setSelectedDate}
                                onTimeChange={setSelectedTime}
                            />
                        )}

                        {currentStep === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vos coordonnées</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom complet *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Jean Dupont"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="jean.dupont@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="06 12 34 56 78"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message (optionnel)</Label>
                                        <Textarea
                                            id="message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Décrivez votre besoin..."
                                            rows={4}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {currentStep === 4 && (
                            <Card className="text-center py-12">
                                <CardContent className="space-y-6">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
                                        <p className="text-muted-foreground">
                                            Vous recevrez un email de confirmation à {formData.email}
                                        </p>
                                    </div>
                                    <div className="pt-4">
                                        <Button onClick={() => router.push("/")}>
                                            Retour à l'accueil
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {currentStep < 4 && (
                            <div className="flex justify-between mt-6">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                >
                                    Retour
                                </Button>
                                <Button
                                    onClick={currentStep === 3 ? handleSubmit : handleNext}
                                    disabled={!canProceed()}
                                >
                                    {currentStep === 3 ? "Confirmer" : "Continuer"}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <BookingSummary
                            professional={professional}
                            service={service}
                            selectedDate={selectedDate}
                            selectedTime={selectedTime}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
