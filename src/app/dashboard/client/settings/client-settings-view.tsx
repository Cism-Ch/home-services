"use client"

import { useEffect, useRef, useState } from "react"
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
import { formatFCFA } from "@/lib/formatters"
import type { SubscriptionPlanCode } from "@/lib/paystack"
import type { DashboardSubscriptionItem } from "@/lib/types/catalog"
import {
  startSubscriptionCheckoutAction,
  updateClientSettingsAction,
  verifyAndSyncSubscriptionAction,
} from "@/server/actions/subscription"
import { Award, Check, Sparkles, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

interface ClientSettingsViewProps {
  user: {
    id: string
    name: string
    email: string
    phoneNumber: string
  }
  subscriptions: DashboardSubscriptionItem[]
  initialIsGoldMember: boolean
  callbackRef?: string
  callbackPlan?: SubscriptionPlanCode
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length <= 1) {
    return { firstName: parts[0] || "", lastName: parts[0] || "" }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

export function ClientSettingsView({
  user,
  subscriptions,
  initialIsGoldMember,
  callbackRef,
  callbackPlan,
}: ClientSettingsViewProps) {
  const router = useRouter()
  const initialNames = splitFullName(user.name)
  const verifiedRefGuard = useRef<string | null>(null)

  const [firstName, setFirstName] = useState(initialNames.firstName)
  const [lastName, setLastName] = useState(initialNames.lastName)
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber)
  const [goldOverride, setGoldOverride] = useState<boolean | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const isGoldMember = goldOverride ?? initialIsGoldMember

  useEffect(() => {
    if (!callbackRef || verifiedRefGuard.current === callbackRef) return
    verifiedRefGuard.current = callbackRef

    const verifyPayment = async () => {
      const res = await verifyAndSyncSubscriptionAction(
        callbackRef,
        callbackPlan || "CLIENT_GOLD"
      )
      if (res.error) {
        toast.error(res.error)
      } else {
        setGoldOverride(true)
        toast.success("Abonnement Client Premium Or synchronisé via Paystack !")
        router.replace("/dashboard/client/settings")
        router.refresh()
      }
    }

    void verifyPayment()
  }, [callbackRef, callbackPlan, router])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      const res = await updateClientSettingsAction({
        firstName,
        lastName,
        phoneNumber,
      })
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.success("Coordonnées client mises à jour dans votre profil.")
      router.refresh()
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSubscribeClientGold = async () => {
    setIsSubscribing(true)
    try {
      const res = await startSubscriptionCheckoutAction(user.id, user.email, {
        plan: "CLIENT_GOLD",
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
        "CLIENT_GOLD"
      )
      if (syncRes.error) {
        toast.error(syncRes.error)
        return
      }
      setGoldOverride(true)
      toast.success(
        "Abonnement Client Premium Or (2 000 FCFA/mois) activé et enregistré !"
      )
      router.refresh()
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Paramètres Client</h1>
            {isGoldMember && (
              <Badge variant="warning" className="gap-1">
                <Award className="h-3.5 w-3.5" />
                Membre Or
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            Gérez vos coordonnées locales, votre abonnement Membre Or et la sécurité de votre compte.
          </p>
        </div>
      </div>

      <Tabs defaultValue={callbackRef ? "gold" : "profile"} className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1 sm:inline-flex sm:w-fit">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="gold">Badge Or (2 000 F)</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Ces coordonnées facilitent votre mise en relation rapide avec les artisans de votre commune.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email du compte</Label>
                      <Input id="email" type="email" value={user.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone & WhatsApp</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+225 07 08 09 10 11"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSavingProfile}>
                    {isSavingProfile
                      ? "Enregistrement..."
                      : "Enregistrer les modifications"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="gold" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Avantages Compte Client & Soutien au Projet
                </CardTitle>
                <CardDescription>
                  L&apos;usage de la plateforme est 100% libre et gratuit pour les clients. Vous pouvez optionnellement activer le statut Membre Or.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border p-5 flex flex-col justify-between bg-card">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base">Accès Standard</h3>
                      <Badge variant="outline">Gratuit</Badge>
                    </div>
                    <p className="text-2xl font-extrabold">0 FCFA</p>
                    <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Recherche illimitée par métier et commune
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Réservation de créneaux horaires sans frais
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Contact direct WhatsApp & Appels avec les artisans
                      </li>
                    </ul>
                  </div>
                  <Button variant="secondary" disabled className="mt-6 w-full">
                    Inclus par défaut
                  </Button>
                </div>

                <div className="rounded-xl border-2 border-amber-500/60 bg-amber-500/5 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-amber-500" />
                        Membre Premium Or
                      </h3>
                      <Badge variant="warning">Soutien &amp; Priorité</Badge>
                    </div>
                    <div>
                      <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                        {formatFCFA(2000)}
                      </span>
                      <span className="text-xs text-muted-foreground"> / mois</span>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-amber-500" />
                        Badge officiel &quot;Client Premium Or&quot; rassurant les artisans
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-amber-500" />
                        Positionnement prioritaire de vos demandes d&apos;intervention
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-amber-500" />
                        Soutien direct au développement de la plateforme locale
                      </li>
                    </ul>
                  </div>
                  <Button
                    className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white"
                    disabled={isSubscribing || isGoldMember}
                    onClick={handleSubscribeClientGold}
                  >
                    {isGoldMember
                      ? "Statut Membre Or Actif"
                      : isSubscribing
                      ? "Connexion Paystack..."
                      : "Activer pour 2 000 FCFA / mois"}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Paiement sécurisé via Paystack (Wave, Orange Money, MTN MoMo, Carte) — Résiliable à tout moment.
              </CardFooter>
            </Card>

            <BillingInvoices subscriptions={subscriptions} />
          </TabsContent>

          <TabsContent value="security">
            <PasswordSecurityCard />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
