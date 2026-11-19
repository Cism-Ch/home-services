"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { Badge } from "@/components/ui/badge"
import { BillingInvoices } from "@/components/dashboard/billing-invoices"
import { PasswordSecurityCard } from "@/components/dashboard/password-security-card"
import { CityCombobox } from "@/components/city-combobox"
import { formatFCFA } from "@/lib/formatters"
import type { SubscriptionPlanCode } from "@/lib/paystack"
import type { DashboardSubscriptionItem } from "@/lib/types/catalog"
import {
  startSubscriptionCheckoutAction,
  updateProBusinessAction,
  verifyAndSyncSubscriptionAction,
} from "@/server/actions/subscription"
import {
  AlertTriangle,
  Check,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from "lucide-react"
import { toast } from "sonner"

const PRO_PLANS: Array<{
  id: SubscriptionPlanCode
  name: string
  price: number
  trial: string
  popular?: boolean
  features: string[]
}> = [
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

interface ProSettingsViewProps {
  user: {
    id: string
    name: string
    email: string
  }
  proProfile: {
    id: string
    cityId: string
    commune: string
    address: string
    phoneNumber: string
    whatsappNumber: string
    kycStatus: string
    isVerified: boolean
  }
  subscriptions: DashboardSubscriptionItem[]
  activeSubscription: DashboardSubscriptionItem | null
  callbackRef?: string
  callbackPlan?: SubscriptionPlanCode
}

export function ProSettingsView({
  user,
  proProfile,
  subscriptions,
  activeSubscription,
  callbackRef,
  callbackPlan,
}: ProSettingsViewProps) {
  const router = useRouter()
  const verifiedRefGuard = useRef<string | null>(null)

  const [companyName, setCompanyName] = useState(user.name)
  const [cityId, setCityId] = useState(proProfile.cityId)
  const [commune, setCommune] = useState(proProfile.commune)
  const [address, setAddress] = useState(proProfile.address)
  const [phonePro, setPhonePro] = useState(proProfile.phoneNumber)
  const [whatsappPro, setWhatsappPro] = useState(proProfile.whatsappNumber)
  const [syncedPlanOverride, setSyncedPlanOverride] = useState<{
    basePlan: string | null
    nextPlan: string
  } | null>(null)
  const [isSavingBusiness, setIsSavingBusiness] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const serverPlan = activeSubscription?.plan || null
  const selectedPlan =
    syncedPlanOverride && syncedPlanOverride.basePlan === serverPlan
      ? syncedPlanOverride.nextPlan
      : serverPlan

  useEffect(() => {
    if (!callbackRef || verifiedRefGuard.current === callbackRef) return
    verifiedRefGuard.current = callbackRef

    const syncPayment = async () => {
      const res = await verifyAndSyncSubscriptionAction(callbackRef, callbackPlan)
      if (res.error || !res.data) {
        toast.error(res.error || "Erreur de vérification Paystack.")
        return
      }
      setSyncedPlanOverride({
        basePlan: serverPlan,
        nextPlan: res.data.plan,
      })
      toast.success("Abonnement Paystack confirmé et activé !")
      router.replace("/dashboard/pro/settings")
      router.refresh()
    }

    void syncPayment()
  }, [callbackRef, callbackPlan, router, serverPlan])

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingBusiness(true)
    try {
      const res = await updateProBusinessAction({
        companyName,
        cityId,
        commune,
        address,
        phoneNumber: phonePro,
        whatsappNumber: whatsappPro,
      })

      if (res.error) {
        toast.error(res.error)
        return
      }

      toast.success("Informations d'établissement et coordonnées enregistrées.")
      router.refresh()
    } finally {
      setIsSavingBusiness(false)
    }
  }

  const handlePaystackSubscribe = async (
    planId: SubscriptionPlanCode,
    amountFCFA: number
  ) => {
    setIsSubscribing(true)
    try {
      const res = await startSubscriptionCheckoutAction(user.id, user.email, {
        plan: planId,
      })
      if (res.error || !res.data) {
        toast.error(res.error || "Impossible d'initialiser le paiement Paystack.")
        return
      }

      if (!res.data.isSimulated) {
        window.location.assign(res.data.authorizationUrl)
        return
      }

      const syncRes = await verifyAndSyncSubscriptionAction(
        res.data.reference,
        planId
      )
      if (syncRes.error) {
        toast.error(syncRes.error)
        return
      }

      setSyncedPlanOverride({
        basePlan: serverPlan,
        nextPlan: planId,
      })
      toast.success(
        `Souscription Paystack activée (${formatFCFA(amountFCFA)}/mois - 1er mois offert).`
      )
      router.refresh()
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Paramètres & Abonnement Pro
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos coordonnées d&apos;établissement, votre sécurité et votre formule d&apos;abonnement Paystack en FCFA.
        </p>
      </div>

      <Tabs defaultValue={callbackRef ? "billing" : "business"} className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1 sm:inline-flex sm:w-fit">
          <TabsTrigger value="business">Établissement</TabsTrigger>
          <TabsTrigger value="billing">Abonnement Paystack</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="business">
            <Card>
              <form onSubmit={handleSaveBusiness}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <CardTitle>Coordonnées professionnelles & zone</CardTitle>
                      <CardDescription>
                        Ces informations sont utilisées sur vos fiches publiques et justificatifs Paystack.
                      </CardDescription>
                    </div>
                    <Badge variant={proProfile.isVerified ? "default" : "secondary"}>
                      KYC : {proProfile.kycStatus}
                    </Badge>
                  </div>
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
                        onChange={(loc) => {
                          if (loc) {
                            setCityId(loc.id)
                            setCommune(loc.commune || loc.city)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commune-pro">Quartier / Commune</Label>
                      <Input
                        id="commune-pro"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        placeholder="Ex: Cocody Riviera 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse géographique précise</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ex: Carrefour Duncan, Abidjan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-pro">Email du compte</Label>
                      <Input id="email-pro" type="email" value={user.email} disabled />
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
                <CardFooter className="flex flex-wrap justify-between gap-3">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard/pro/profile">
                      Gérer CNI / RCCM (KYC)
                    </Link>
                  </Button>
                  <Button type="submit" disabled={isSavingBusiness}>
                    {isSavingBusiness
                      ? "Enregistrement..."
                      : "Enregistrer les informations"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            {activeSubscription?.status === "PAST_DUE" && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-center gap-3 text-sm text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <span>
                  Votre dernier renouvellement Paystack a échoué. Choisissez une formule ci-dessous pour régulariser votre abonnement et conserver votre visibilité prioritaire.
                </span>
              </div>
            )}

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
                  <Badge className="w-fit bg-emerald-600 text-white">
                    1er mois offert
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PRO_PLANS.map((plan) => {
                    const isCurrent =
                      selectedPlan === plan.id &&
                      activeSubscription?.status !== "PAST_DUE" &&
                      activeSubscription?.status !== "CANCELLED"
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
                          disabled={isSubscribing || isCurrent}
                          onClick={() => handlePaystackSubscribe(plan.id, plan.price)}
                        >
                          {isCurrent
                            ? activeSubscription?.status === "TRIALING"
                              ? "Formule en cours (Essai gratuit)"
                              : "Formule active"
                            : isSubscribing
                            ? "Connexion Paystack..."
                            : "Choisir via Paystack"}
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

            <BillingInvoices subscriptions={subscriptions} />
          </TabsContent>

          <TabsContent value="security">
            <PasswordSecurityCard
              title="Sécurité du compte prestataire"
              description="Modifiez votre mot de passe pour protéger votre espace artisan."
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
