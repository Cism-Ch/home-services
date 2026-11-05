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
import { CityCombobox } from "@/components/city-combobox"
import { formatFCFA } from "@/lib/mock-data"
import { startSubscriptionCheckoutAction } from "@/server/actions/subscription"
import { Award, Check, Sparkles, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export default function ClientSettingsPage() {
  const [firstName, setFirstName] = useState("Jean-Marc")
  const [lastName, setLastName] = useState("Kouadio")
  const [email, setEmail] = useState("jm.kouadio@example.ci")
  const [phone, setPhone] = useState("+225 05 04 03 02 01")
  const [cityId, setCityId] = useState("abidjan-cocody")
  const [isGoldMember, setIsGoldMember] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribeClientGold = async () => {
    setIsSubscribing(true)
    try {
      const res = await startSubscriptionCheckoutAction("user-1", email, {
        plan: "CLIENT_GOLD",
      })
      if (res.error) {
        toast.error(res.error)
        return
      }
      setIsGoldMember(true)
      toast.success(
        "Abonnement Client Premium Or (2 000 FCFA/mois) activé via Paystack !"
      )
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="space-y-8 animate-appear">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Paramètres Client</h1>
            {isGoldMember && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1">
                <Award className="h-3.5 w-3.5" />
                Membre Or
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            Gérez vos coordonnées locales, vos alertes de suivi et votre statut Membre Or.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[540px]">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="gold">Badge Or (2 000 F)</TabsTrigger>
          <TabsTrigger value="notifications">Suivi & Alertes</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles & Localisation</CardTitle>
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone & WhatsApp</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ville / Commune de résidence</Label>
                  <CityCombobox
                    value={cityId}
                    onChange={(loc) => loc && setCityId(loc.id)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success("Coordonnées client mises à jour.")}>
                  Enregistrer les modifications
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="gold">
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
                      <Badge className="bg-amber-500 text-white">Soutien & Priorité</Badge>
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
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de suivi des prestations</CardTitle>
                <CardDescription>
                  Recevez des demandes de confirmation (&quot;Vos tâches ont-elles été finalisées ?&quot;) pour clôturer vos rendez-vous.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications de suivi d&apos;intervention</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification interactive pour confirmer si la tâche est terminée ou toujours en cours.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label className="text-base">Rappels de créneaux horaires</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un rappel avant l&apos;arrivée prévue du prestataire.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success("Préférences de suivi enregistrées.")}>
                  Enregistrer
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                <CardDescription>
                  Modifiez votre mot de passe pour sécuriser votre compte.
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
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success("Mot de passe mis à jour.")}>
                  Mettre à jour le mot de passe
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
