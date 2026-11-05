"use client"

import { useState, useEffect } from "react"
import { professionals, services, formatFCFA } from "@/lib/mock-data"
import { BookingStepper } from "@/components/booking-stepper"
import { BookingSummary } from "@/components/booking-summary"
import { DateTimePicker } from "@/components/date-time-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notFound, useRouter } from "next/navigation"
import { CheckCircle2, ShieldCheck, Clock, MessageSquare, ArrowLeft, ArrowRight } from "lucide-react"
import { ProContactActions } from "@/components/pro-contact-actions"
import { createSlotBooking, type BookingResult } from "@/server/actions/booking"
import { toast } from "sonner"

interface BookingPageProps {
  params: Promise<{
    proId: string
    serviceId: string
  }>
}

const steps = ["Prestation", "Créneau horaire", "Coordonnées", "Mise en relation"]

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<BookingResult | null>(null)

  const [proId, setProId] = useState<string>("")
  const [serviceId, setServiceId] = useState<string>("")

  useEffect(() => {
    params.then(({ proId, serviceId }) => {
      setProId(proId)
      setServiceId(serviceId)
    })
  }, [params])

  if (!proId || !serviceId) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Chargement des informations du rendez-vous...
      </div>
    )
  }

  const professional = professionals.find((p) => p.id === proId)
  const service = services.find((s) => s.id === serviceId)

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

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Veuillez sélectionner une date et un créneau horaire.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await createSlotBooking({
        proId: professional.id,
        serviceId: service.id,
        bookingDate: selectedDate.toISOString(),
        timeSlot: selectedTime,
        clientName: formData.name,
        clientPhone: formData.phone,
        clientAddress: formData.address || professional.location,
        clientNotes: formData.message,
        indicativePrice: service.price,
      })

      if (res.error) {
        toast.error("Veuillez vérifier les informations saisies.")
        setIsSubmitting(false)
        return
      }

      if (res.data) {
        setCreatedBooking(res.data)
        setCurrentStep(4)
        toast.success("Rendez-vous créé avec succès ! Mise en relation en cours.")
      }
    } catch {
      toast.error("Une erreur est survenue lors de la réservation.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return Boolean(selectedDate && selectedTime)
      case 3:
        return Boolean(formData.name.trim().length >= 2 && formData.phone.trim().length >= 8)
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <BookingStepper currentStep={currentStep} steps={steps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            {/* Step 1: Presentation & Direct agreement disclaimer */}
            {currentStep === 1 && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Détails de la prestation & modalités</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                    <div className="rounded-lg bg-card p-4 border space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        Durée estimée
                      </div>
                      <p className="text-xs text-muted-foreground">{service.duration} minutes d&apos;intervention</p>
                    </div>

                    <div className="rounded-lg bg-card p-4 border space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-sm">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Tarif indicatif négociable
                      </div>
                      <p className="text-xs font-bold text-primary">{formatFCFA(service.price)}</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/60 p-4 border text-sm text-muted-foreground space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Comment fonctionne la réservation sur HomeServices ?
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>La réservation bloque un <strong>créneau horaire</strong> dans l&apos;agenda du professionnel.</li>
                      <li><strong>Aucun paiement par carte bancaire sur le site</strong> : vous réglez directement le prestataire après réalisation des travaux.</li>
                      <li>Dès confirmation du créneau, vous pouvez lui envoyer des photos ou notes vocales WhatsApp pour affiner le devis.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Time slot selection */}
            {currentStep === 2 && (
              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
              />
            )}

            {/* Step 3: Contact details */}
            {currentStep === 3 && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Vos coordonnées de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Votre nom ou prénom *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Jean-Marc Kouadio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone / WhatsApp *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: +225 07 08 09 10 11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ce numéro permettra au prestataire de vous joindre pour confirmer son arrivée.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Commune ou quartier d&apos;intervention</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Ex: Cocody Angré 8ème tranche"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Précisions sur votre besoin (optionnel)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Précisez le type de panne ou la localisation exacte..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirmation & Instant Contact */}
            {currentStep === 4 && (
              <Card className="border-2 border-primary/20 shadow-md">
                <CardContent className="space-y-6 pt-8 pb-8 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-4 border-b pb-6">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-foreground">
                        Créneau réservé avec succès !
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Votre demande est transmise à {professional.name}. Statut actuel : <strong>En négociation</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-lg p-5 border space-y-3">
                    <h3 className="font-bold text-base flex items-center gap-2 justify-center sm:justify-start">
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                      Contactez dès maintenant {professional.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Accélérez le traitement de votre demande en lui partageant des précisions par message ou note vocale.
                    </p>
                    <ProContactActions
                      proName={professional.name}
                      phoneNumber={professional.phoneNumber}
                      whatsappNumber={professional.whatsappNumber}
                      serviceTitle={service.title}
                      bookingRef={createdBooking?.id}
                      size="lg"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push("/dashboard/client")}
                    >
                      Voir mes demandes dans mon espace
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => router.push("/")}
                    >
                      Retour à l&apos;accueil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSubmitting}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
                <Button
                  onClick={currentStep === 3 ? handleSubmit : handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    "Validation en cours..."
                  ) : currentStep === 3 ? (
                    "Valider le créneau"
                  ) : (
                    <>
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
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
