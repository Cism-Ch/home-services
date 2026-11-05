"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveTable, type ColumnDef } from "@/components/ui/responsive-table"
import { CityCombobox } from "@/components/city-combobox"
import {
  professionals as initialPros,
  reviews as initialReviews,
  categories,
  formatFCFA,
} from "@/lib/mock-data"
import { locationsData } from "@/lib/cities-data"
import {
  verifyProKycAction,
  moderateReviewAction,
} from "@/server/actions/admin"
import {
  ShieldCheck,
  Users,
  CreditCard,
  Star,
  CheckCircle2,
  XCircle,
  MapPin,
  FileCheck,
} from "lucide-react"
import { toast } from "sonner"

interface KycQueueItem {
  id: string
  name: string
  title: string
  city: string
  phone: string
  documentType: string
  isVerified: boolean
}

interface SubscriptionRow {
  id: string
  subscriberName: string
  role: "Prestataire" | "Client Or"
  planName: string
  amountFCFA: number
  status: "ACTIVE" | "TRIALING"
  city: string
}

const INITIAL_SUBSCRIPTIONS: SubscriptionRow[] = [
  {
    id: "sub-1",
    subscriberName: "Amadou Kouassi",
    role: "Prestataire",
    planName: "PRO_PREMIUM (10 000 F)",
    amountFCFA: 10000,
    status: "ACTIVE",
    city: "Abidjan - Cocody",
  },
  {
    id: "sub-2",
    subscriberName: "Moussa Diop",
    role: "Prestataire",
    planName: "PRO_ENTERPRISE (20 000 F)",
    amountFCFA: 20000,
    status: "ACTIVE",
    city: "Dakar - Almadies",
  },
  {
    id: "sub-3",
    subscriberName: "Awa Konaté",
    role: "Prestataire",
    planName: "PRO_STANDARD (1er mois offert)",
    amountFCFA: 5000,
    status: "TRIALING",
    city: "Abidjan - Marcory",
  },
  {
    id: "sub-4",
    subscriberName: "Jean-Marc Kouadio",
    role: "Client Or",
    planName: "CLIENT_GOLD (Badge Or)",
    amountFCFA: 2000,
    status: "ACTIVE",
    city: "Abidjan - Riviera",
  },
]

export default function AdminDashboardPage() {
  const [kycItems, setKycItems] = useState<KycQueueItem[]>(() =>
    initialPros.map((pro, idx) => ({
      id: pro.id,
      name: pro.name,
      title: pro.title,
      city: pro.location,
      phone: pro.phoneNumber,
      documentType: idx % 2 === 0 ? "CNI + Registre RCCM (Tigris S3)" : "CNI Nationale Ivoirienne (Tigris S3)",
      isVerified: pro.isVerified,
    }))
  )

  const [moderatedReviews, setModeratedReviews] = useState(initialReviews)
  const [selectedGeoFilter, setSelectedGeoFilter] = useState("")

  const handleKycDecision = async (proId: string, decision: "APPROVE" | "REJECT") => {
    const res = await verifyProKycAction(proId, decision)
    if (res.error) {
      toast.error(res.error)
      return
    }

    setKycItems((prev) =>
      prev.map((item) =>
        item.id === proId
          ? { ...item, isVerified: decision === "APPROVE" }
          : item
      )
    )

    toast.success(
      decision === "APPROVE"
        ? "Dossier KYC validé. Le badge Prestataire Vérifié est actif."
        : "Dossier KYC mis en attente de pièce complémentaire."
    )
  }

  const handleReviewDecision = async (
    reviewId: string,
    decision: "APPROVE" | "REMOVE"
  ) => {
    const res = await moderateReviewAction(reviewId, decision)
    if (res.error) {
      toast.error(res.error)
      return
    }

    if (decision === "REMOVE") {
      setModeratedReviews((prev) => prev.filter((r) => r.id !== reviewId))
      toast.info("Avis retiré de la plateforme.")
    } else {
      toast.success("Avis mutuel approuvé et maintenu en ligne.")
    }
  }

  const totalMrrFCFA = INITIAL_SUBSCRIPTIONS.reduce(
    (sum, sub) => sum + sub.amountFCFA,
    0
  )

  const kycColumns: ColumnDef<KycQueueItem>[] = [
    {
      header: "Prestataire",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.title}</p>
        </div>
      ),
    },
    {
      header: "Localisation",
      accessorKey: "city",
    },
    {
      header: "Justificatif Tigris S3",
      cell: (item) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileCheck className="h-3.5 w-3.5 text-primary" />
          {item.documentType}
        </span>
      ),
    },
    {
      header: "Statut KYC",
      cell: (item) =>
        item.isVerified ? (
          <Badge className="bg-emerald-600 text-white">Vérifié</Badge>
        ) : (
          <Badge variant="secondary">En attente</Badge>
        ),
    },
    {
      header: "Décision",
      cell: (item) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            className="gap-1 text-emerald-600 hover:text-emerald-700"
            onClick={() => handleKycDecision(item.id, "APPROVE")}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Valider
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 text-destructive"
            onClick={() => handleKycDecision(item.id, "REJECT")}
          >
            <XCircle className="h-3.5 w-3.5" />
            Rejeter
          </Button>
        </div>
      ),
    },
  ]

  const subscriptionColumns: ColumnDef<SubscriptionRow>[] = [
    {
      header: "Abonné",
      accessorKey: "subscriberName",
    },
    {
      header: "Profil",
      cell: (item) => (
        <Badge
          variant={item.role === "Client Or" ? "secondary" : "outline"}
          className={
            item.role === "Client Or" ? "bg-amber-500/15 text-amber-600 border-amber-400" : ""
          }
        >
          {item.role}
        </Badge>
      ),
    },
    {
      header: "Formule Paystack",
      accessorKey: "planName",
    },
    {
      header: "Ville",
      accessorKey: "city",
    },
    {
      header: "Montant mensuel",
      cell: (item) => (
        <span className="font-bold text-primary">
          {formatFCFA(item.amountFCFA)}
        </span>
      ),
    },
    {
      header: "État",
      cell: (item) =>
        item.status === "ACTIVE" ? (
          <Badge className="bg-emerald-600 text-white">Actif</Badge>
        ) : (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            1er mois offert
          </Badge>
        ),
    },
  ]

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Portail d&apos;Administration & Gouvernance
        </h1>
        <p className="text-muted-foreground mt-2">
          Supervisez la vérification KYC des artisans, la modération des avis mutuels, la couverture GEO Côte d&apos;Ivoire et les revenus Paystack en FCFA.
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu Abonnements (MRR)</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">
              {formatFCFA(totalMrrFCFA)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Paystack XOF (Pro 5k/10k/20k + Client Or 2k)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prestataires Vérifiés</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kycItems.filter((k) => k.isVerified).length} / {kycItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dossiers CNI / RCCM sur Tigris S3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avis Mutuels Publiés</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatedReviews.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Client ↔ Prestataire après mission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Couverture GEO Active</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationsData.length} zones</div>
            <p className="text-xs text-muted-foreground mt-1">
              Communes d&apos;Abidjan, villes CI & hubs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Governance Tabs */}
      <Tabs defaultValue="kyc" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-[680px]">
          <TabsTrigger value="kyc">Vérification KYC ({kycItems.length})</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements Paystack</TabsTrigger>
          <TabsTrigger value="reviews">Modération Avis ({moderatedReviews.length})</TabsTrigger>
          <TabsTrigger value="geo">Stratégie GEO & Métiers</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          {/* Tab 1: KYC Verification Queue */}
          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>File de validation KYC des Prestataires</CardTitle>
                <CardDescription>
                  Vérifiez les pièces d&apos;identité (CNI) et registres de commerce (RCCM) téléversés via URLs signées Tigris S3.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable
                  data={kycItems}
                  columns={kycColumns}
                  keyExtractor={(item) => item.id}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Paystack Subscriptions */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Suivi des Abonnements Paystack (FCFA)</CardTitle>
                <CardDescription>
                  Rappel : La plateforme ne perçoit aucune commission sur les prestations. Les revenus proviennent exclusivement des abonnements Pro (5k, 10k, 20k FCFA avec 1 mois offert) et Client Or (2k FCFA).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable
                  data={INITIAL_SUBSCRIPTIONS}
                  columns={subscriptionColumns}
                  keyExtractor={(item) => item.id}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Mutual Reviews Moderation */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Modération des Avis Mutuels (Client ↔ Prestataire)</CardTitle>
                <CardDescription>
                  Contrôlez les évaluations réciproques déposées à l&apos;issue des prestations terminées (`COMPLETED`).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {moderatedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{rev.author}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {rev.authorType === "PRO_TO_CLIENT"
                            ? "Prestataire -> Client"
                            : "Client -> Prestataire"}
                        </Badge>
                        <span className="text-xs text-amber-500 font-bold">
                          {rev.rating} / 5
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rev.comment}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewDecision(rev.id, "APPROVE")}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleReviewDecision(rev.id, "REMOVE")}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: GEO Cities & Service Categories */}
          <TabsContent value="geo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Référentiel Géographique (Côte d&apos;Ivoire & Hubs)
                  </CardTitle>
                  <CardDescription>
                    Testez et inspectez le sélecteur déroulant avec tri (Populaire, A-Z, Région) utilisé pour la stratégie GEO.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CityCombobox
                    value={selectedGeoFilter}
                    onChange={(loc) => setSelectedGeoFilter(loc?.id || "")}
                    placeholder="Rechercher ou trier parmi toutes les villes et communes..."
                  />
                  <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto p-2 border rounded-lg text-xs">
                    {locationsData.map((loc) => (
                      <div
                        key={loc.id}
                        className="p-2 rounded bg-muted/40 flex items-center justify-between"
                      >
                        <span className="font-medium truncate">{loc.label}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {loc.region}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Catégories de Métiers Actives</CardTitle>
                  <CardDescription>
                    Catégories de services ouvertes à la réservation de créneaux horaires.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <cat.icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{cat.name}</span>
                        </div>
                        <Badge variant="secondary">{cat.count} pros</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
