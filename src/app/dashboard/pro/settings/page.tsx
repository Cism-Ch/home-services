"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { BillingInvoices } from "@/components/dashboard/billing-invoices"
import { CityCombobox } from "@/components/city-combobox"
import { formatFCFA } from "@/lib/mock-data"
import { startSubscriptionCheckoutAction } from "@/server/actions/subscription"
import type { SubscriptionPlanCode } from "@/lib/paystack"
import { Check, Sparkles, ShieldCheck, Smartphone } from "lucide-react"
import { toast } from "sonner"

const PRO_PLANS = [
  {
    id: "PRO_STANDARD",
    name: "Standard Pro",
    price: 5000,
    trial: "1 mois offert",
    features: [
      "Profil public vérifié & visible dans votre ville",
      "Jusqu'à 5 prestations publiées en FCFA",
      "Contact direct WhatsApp & Appels illimités",
      "Gestion de l'agenda et statut temps réel",
    ],
  },
  {
    id: "PRO_PREMIUM",
    name: "Premium Pro",
    price: 10000,
    trial: "1 mois offert",
    popular: true,
    features: [
      "Positionnement prioritaire dans les recherches",
      "Prestations illimitées & galerie portfolio HD",
      "Badge Artisan Recommandé",
      "Notifications automatiques de suivi client",
    ],
  },
  {
    id: "PRO_ENTERPRISE",
    name: "Entreprise",
    price: 20000,
    trial: "1 mois offert",
    features: [
      "Multi-villes & couverture régionale complète",
      "Mise en avant en tête de catégorie",
      "Support dédié & accompagnement prioritaire",
      "Statistiques avancées de visibilité",
    ],
  },
]

export default function ProSettingsPage() {
  const [companyName, setCompanyName] = useState("Kouassi Plomberie & Froid SARL")
  const [rccm, setRccm] = useState("CI-ABJ-03-2021-B12-00489")
  const [ncc, setNcc] = useState("2145890-M")
  const [cityId, setCityId] = useState("abidjan-cocody")
  const [address, setAddress] = useState("Cocody Riviera 2, Carrefour Duncan, Abidjan")
  const [emailPro, setEmailPro] = useState("contact@kouassi-plomberie.ci")
  const [phonePro, setPhonePro] = useState("+225 07 08 09 10 11")
  const [whatsappPro, setWhatsappPro] = useState("+225 07 08 09 10 11")
  const [selectedPlan, setSelectedPlan] = useState("PRO_PREMIUM")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSaveBusiness = () => {
    toast.success("Informations d'entreprise (RCCM / NCC) et coordonnées enregistrées.")
  }

  const handlePaystackSubscribe = async (planId: string, amountFCFA: number) => {
    setIsSubscribing(true)
    try {
      const res = await startSubscriptionCheckoutAction("pro-1", emailPro, {
        plan: planId as SubscriptionPlanCode,
      })
      if (res.error) {
        toast.error(res.error)
        return
      }
      setSelectedPlan(planId)
      toast.success(
        `Souscription Paystack initialisée (${formatFCFA(amountFCFA)}/mois - 1er mois offert).`
      )
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres & Abonnement Pro</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations légales (RCCM / NCC), votre sécurité et votre formule d&apos;abonnement Paystack en FCFA.
        </p>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[440px]">
          <TabsTrigger value="business">Entreprise & RCCM</TabsTrigger>
          <TabsTrigger value="billing">Abonnement Paystack</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Informations légales & coordonnées professionnelles</CardTitle>
                <CardDescription>
                  Ces informations renforcent la confiance des clients et figurent sur vos reçus d&apos;abonnement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Raison sociale / Nom d&apos;artisan</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville ou commune d&apos;établissement</Label>
                    <CityCombobox
                      value={cityId}
                      onChange={(loc) => loc && setCityId(loc.id)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rccm">Numéro RCCM ou Registre des Métiers</Label>
                    <Input
                      id="rccm"
                      value={rccm}
                      onChange={(e) => setRccm(e.target.value)}
                      placeholder="Ex: CI-ABJ-03-2021-B12-00489"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ncc">Compte Contribuable (NCC / IFU) ou CNI</Label>
                    <Input
                      id="ncc"
                      value={ncc}
                      onChange={(e) => setNcc(e.target.value)}
                      placeholder="Ex: 2145890-M"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse géographique précise</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-pro">Email professionnel</Label>
                    <Input
                      id="email-pro"
                      type="email"
                      value={emailPro}
                      onChange={(e) => setEmailPro(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-pro">Téléphone Appels (Indicatif)</Label>
                    <Input
                      id="phone-pro"
                      type="tel"
                      value={phonePro}
                      onChange={(e) => setPhonePro(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-pro">Numéro WhatsApp Business</Label>
                    <Input
                      id="whatsapp-pro"
                      type="tel"
                      value={whatsappPro}
                      onChange={(e) => setWhatsappPro(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveBusiness}>Enregistrer les informations</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Formules d&apos;Abonnement Prestataire (Paystack XOF)
                    </CardTitle>
                    <CardDescription>
                      1 mois d&apos;essai gratuit sur toutes les formules. Aucune commission n&apos;est prélevée sur vos prestations.
                    </CardDescription>
                  </div>
                  <Badge className="w-fit bg-emerald-600 text-white">1er mois offert</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PRO_PLANS.map((plan) => {
                    const isCurrent = selectedPlan === plan.id
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                          isCurrent
                            ? "border-2 border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base">{plan.name}</h3>
                            {plan.popular && (
                              <Badge variant="secondary" className="text-xs">
                                Populaire
                              </Badge>
                            )}
                          </div>
                          <div>
                            <span className="text-2xl font-extrabold text-primary">
                              {formatFCFA(plan.price)}
                            </span>
                            <span className="text-xs text-muted-foreground"> / mois</span>
                            <p className="text-xs text-emerald-600 font-medium mt-1">
                              {plan.trial}
                            </p>
                          </div>
                          <ul className="space-y-2 text-xs text-muted-foreground">
                            {plan.features.map((feat) => (
                              <li key={feat} className="flex items-start gap-2">
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          className="w-full mt-6"
                          variant={isCurrent ? "default" : "outline"}
                          disabled={isSubscribing}
                          onClick={() => handlePaystackSubscribe(plan.id, plan.price)}
                        >
                          {isCurrent ? "Formule active" : "Choisir via Paystack"}
                        </Button>
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-lg border p-4 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">
                        Moyens de paiement supportés par Paystack
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Wave, Orange Money, MTN MoMo, Moov Money et Cartes Bancaires (Visa / Mastercard) en Franc CFA (XOF).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                    Paiement sécurisé Paystack
                  </div>
                </div>
              </CardContent>
            </Card>

            <BillingInvoices />
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez votre mot de passe et la double authentification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Protéger votre compte prestataire avec une vérification supplémentaire.
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success("Paramètres de sécurité mis à jour.")}>
                  Mettre à jour
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
