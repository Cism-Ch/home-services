"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResponsiveTable, type ColumnDef } from "@/components/data-display/responsive-table"
import { formatFCFA } from "@/lib/formatters"
import type {
  AdminCategoryItem,
  AdminDashboardData,
  AdminKycItem,
  AdminSubscriptionRow,
} from "@/server/queries/admin"
import {
  verifyProKycAction,
  getKycSignedDocumentUrlAction,
  moderateReviewAction,
  createCategoryAction,
  deleteCategoryAction,
  createCityAction,
  deleteCityAction,
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
  ExternalLink,
  Plus,
  Trash2,
  Wrench,
  Zap,
  Wind,
  Sparkles,
  Paintbrush,
  Truck,
  Shield,
  Hammer,
  HardHat,
  Trees,
} from "lucide-react"
import { toast } from "sonner"

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Zap,
  Wind,
  Sparkles,
  Paintbrush,
  Truck,
  Shield,
  Hammer,
  HardHat,
  Trees,
}

function getKycBadge(item: AdminKycItem) {
  if (item.isVerified || item.kycStatus === "APPROVED") {
    return <Badge variant="success">Vérifié</Badge>
  }
  if (item.kycStatus === "PENDING") {
    return <Badge variant="warning">En attente</Badge>
  }
  if (item.kycStatus === "REJECTED") {
    return <Badge variant="destructive">Refusé</Badge>
  }
  return <Badge variant="outline">Non soumis</Badge>
}

function getSubscriptionStatusBadge(status: AdminSubscriptionRow["status"]) {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="success">Actif</Badge>
    case "TRIALING":
      return <Badge variant="info">1er mois offert</Badge>
    case "PAST_DUE":
      return <Badge variant="destructive">Paiement en échec</Badge>
    case "CANCELLED":
      return <Badge variant="secondary">Résilié</Badge>
  }
}

export function AdminDashboardView({ data }: { data: AdminDashboardData }) {
  const router = useRouter()
  const [kycOverrides, setKycOverrides] = useState<
    Record<string, { isVerified: boolean; kycStatus: AdminKycItem["kycStatus"] }>
  >({})
  const [removedReviewIds, setRemovedReviewIds] = useState<Record<string, boolean>>({})
  const [approvedReviewIds, setApprovedReviewIds] = useState<Record<string, boolean>>({})
  const [openingDocProId, setOpeningDocProId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [newCitySlug, setNewCitySlug] = useState("")
  const [newCityName, setNewCityName] = useState("")
  const [newCityCountry, setNewCityCountry] = useState("Côte d'Ivoire")

  const [newCatSlug, setNewCatSlug] = useState("")
  const [newCatName, setNewCatName] = useState("")
  const [newCatDesc, setNewCatDesc] = useState("")
  const [newCatIcon, setNewCatIcon] = useState("Wrench")

  const kycItems = data.kycItems.map((item) => {
    const patch = kycOverrides[item.id]
    return patch ? { ...item, ...patch } : item
  })

  const moderatedReviews = data.reviews
    .filter((r) => !removedReviewIds[r.id])
    .map((r) =>
      approvedReviewIds[r.id]
        ? { ...r, isModerated: true, isReported: false }
        : r
    )

  const handleKycDecision = async (proId: string, decision: "APPROVE" | "REJECT") => {
    setBusyId(proId)
    try {
      const res = await verifyProKycAction(proId, decision)
      if (res.error || !res.data) {
        toast.error(res.error || "Erreur lors de la décision KYC.")
        return
      }

      setKycOverrides((prev) => ({
        ...prev,
        [proId]: {
          isVerified: res.data!.isVerified,
          kycStatus: res.data!.kycStatus,
        },
      }))

      toast.success(
        decision === "APPROVE"
          ? "Dossier KYC validé. Le badge Prestataire Vérifié est actif."
          : "Dossier KYC refusé. Le prestataire devra soumettre une nouvelle pièce."
      )
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  const handleOpenKycDocument = async (proId: string) => {
    setOpeningDocProId(proId)
    try {
      const res = await getKycSignedDocumentUrlAction(proId)
      if (res.error || !res.data) {
        toast.error(res.error || "Document KYC indisponible.")
        return
      }
      window.open(res.data.url, "_blank", "noopener,noreferrer")
    } finally {
      setOpeningDocProId(null)
    }
  }

  const handleReviewDecision = async (
    reviewId: string,
    decision: "APPROVE" | "REMOVE"
  ) => {
    setBusyId(reviewId)
    try {
      const res = await moderateReviewAction(reviewId, decision)
      if (res.error) {
        toast.error(res.error)
        return
      }

      if (decision === "REMOVE") {
        setRemovedReviewIds((prev) => ({ ...prev, [reviewId]: true }))
        toast.info("Avis retiré de la plateforme et note recalculée.")
      } else {
        setApprovedReviewIds((prev) => ({ ...prev, [reviewId]: true }))
        toast.success("Avis mutuel approuvé et maintenu en ligne.")
      }
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusyId("create-city")
    try {
      const res = await createCityAction({
        id: newCitySlug.toLowerCase(),
        name: newCityName,
        country: newCityCountry,
        currency: "XOF",
      })
      if (res.error) {
        toast.error(res.error)
        return
      }
      setNewCitySlug("")
      setNewCityName("")
      toast.success("Zone géographique ajoutée.")
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteCity = async (cityId: string) => {
    setBusyId(cityId)
    try {
      const res = await deleteCityAction(cityId)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.info("Zone géographique supprimée.")
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusyId("create-category")
    try {
      const res = await createCategoryAction({
        id: newCatSlug.toLowerCase(),
        name: newCatName,
        description: newCatDesc || undefined,
        icon: newCatIcon,
      })
      if (res.error) {
        toast.error(res.error)
        return
      }
      setNewCatSlug("")
      setNewCatName("")
      setNewCatDesc("")
      toast.success("Catégorie de métier créée.")
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    setBusyId(categoryId)
    try {
      const res = await deleteCategoryAction(categoryId)
      if (res.error) {
        toast.error(res.error)
        return
      }
      toast.info("Catégorie supprimée.")
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  const kycColumns: ColumnDef<AdminKycItem>[] = [
    {
      header: "Prestataire",
      cell: (item) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground truncate">{item.headline}</p>
        </div>
      ),
    },
    {
      header: "Localisation",
      accessorKey: "city",
    },
    {
      header: "Justificatif Tigris S3",
      cell: (item) =>
        item.hasDocument ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            disabled={openingDocProId === item.id}
            onClick={() => handleOpenKycDocument(item.id)}
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            {openingDocProId === item.id ? "Signature..." : "Voir justificatif"}
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileCheck className="h-3.5 w-3.5" />
            Aucun fichier
          </span>
        ),
    },
    {
      header: "Statut KYC",
      cell: (item) => getKycBadge(item),
    },
    {
      header: "Décision",
      cell: (item) => (
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={busyId === item.id}
            className="gap-1 text-emerald-600 hover:text-emerald-700"
            onClick={() => handleKycDecision(item.id, "APPROVE")}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Valider
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={busyId === item.id}
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

  const subscriptionColumns: ColumnDef<AdminSubscriptionRow>[] = [
    {
      header: "Abonné",
      cell: (item) => (
        <div>
          <p className="font-medium">{item.subscriberName}</p>
          <p className="text-xs text-muted-foreground">{item.subscriberEmail}</p>
        </div>
      ),
    },
    {
      header: "Profil",
      cell: (item) => (
        <Badge variant={item.role === "Client" ? "warning" : "outline"}>
          {item.role}
        </Badge>
      ),
    },
    {
      header: "Formule Paystack",
      accessorKey: "planName",
    },
    {
      header: "Zone",
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
      cell: (item) => getSubscriptionStatusBadge(item.status),
    },
  ]

  const renderCategoryIcon = (cat: AdminCategoryItem) => {
    const IconComp = CATEGORY_ICON_MAP[cat.icon] || Wrench
    return <IconComp className="h-4 w-4 text-primary shrink-0" />
  }

  return (
    <div className="space-y-8 animate-appear">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Portail d&apos;Administration & Gouvernance
        </h1>
        <p className="text-muted-foreground mt-2">
          Supervisez la vérification KYC des artisans, la modération des avis mutuels, le référentiel GEO et les revenus Paystack en FCFA.
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenu Actif (MRR)</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">
              {formatFCFA(data.totalMrrFCFA)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.trialingCount} essai(s) offert(s) • {data.pastDueCount} en retard
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
              {kycItems.filter((k) => k.kycStatus === "PENDING").length} dossier(s) en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avis & Missions</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moderatedReviews.length} avis</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.platformCounts.completedBookings} / {data.platformCounts.totalBookings} missions clôturées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Zones GEO & Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cities.length} zones</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.platformCounts.totalUsers} compte(s) inscrits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Governance Tabs */}
      <Tabs defaultValue="kyc" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1 lg:w-fit">
          <TabsTrigger value="kyc">Vérification KYC ({kycItems.length})</TabsTrigger>
          <TabsTrigger value="subscriptions">
            Abonnements Paystack ({data.subscriptions.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Modération Avis ({moderatedReviews.length})
          </TabsTrigger>
          <TabsTrigger value="geo">GEO & Métiers</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-6">
          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>File de validation KYC des Prestataires</CardTitle>
                <CardDescription>
                  Consultez les pièces d&apos;identité (CNI / RCCM) via URL signée temporaire Tigris S3 puis approuvez ou refusez le profil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable
                  data={kycItems}
                  columns={kycColumns}
                  keyExtractor={(item) => item.id}
                  emptyMessage="Aucun profil prestataire enregistré."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Suivi des Abonnements Paystack (FCFA)</CardTitle>
                <CardDescription>
                  Aucune commission sur les interventions. Revenus issus exclusivement des abonnements Pro (5k/10k/20k FCFA) et Client Or (2k FCFA).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveTable
                  data={data.subscriptions}
                  columns={subscriptionColumns}
                  keyExtractor={(item) => item.id}
                  emptyMessage="Aucun abonnement Paystack enregistré."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Modération des Avis Mutuels</CardTitle>
                <CardDescription>
                  Contrôlez les avis déposés entre clients et prestataires ; la suppression recalcule automatiquement la note moyenne du professionnel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {moderatedReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
                    Aucun avis publié pour le moment.
                  </p>
                ) : (
                  moderatedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-sm">{rev.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            vers {rev.targetName}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {rev.authorType === "PRO_TO_CLIENT"
                              ? "Pro -> Client"
                              : "Client -> Pro"}
                          </Badge>
                          <span className="text-xs text-amber-500 font-bold">
                            {rev.rating} / 5
                          </span>
                          {rev.isReported && (
                            <Badge variant="destructive" className="text-[10px]">
                              Signalé
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{rev.comment}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={busyId === rev.id}
                          onClick={() => handleReviewDecision(rev.id, "APPROVE")}
                        >
                          Approuver
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={busyId === rev.id}
                          className="text-destructive"
                          onClick={() => handleReviewDecision(rev.id, "REMOVE")}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geo">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Référentiel Géographique ({data.cities.length})
                  </CardTitle>
                  <CardDescription>
                    Ajoutez ou supprimez des villes et communes actives dans PostgreSQL.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleCreateCity} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="city-slug" className="sr-only">Slug</Label>
                      <Input
                        id="city-slug"
                        placeholder="abidjan-marcory"
                        value={newCitySlug}
                        onChange={(e) => setNewCitySlug(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city-name" className="sr-only">Nom</Label>
                      <Input
                        id="city-name"
                        placeholder="Abidjan - Marcory"
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Pays"
                        value={newCityCountry}
                        onChange={(e) => setNewCityCountry(e.target.value)}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={busyId === "create-city"}
                        aria-label="Ajouter zone GEO"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-lg text-xs">
                    {data.cities.map((city) => (
                      <div
                        key={city.id}
                        className="p-2 rounded bg-muted/40 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-medium truncate">{city.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {city.country} • {city.prosCount} pro(s)
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive shrink-0"
                          disabled={busyId === city.id}
                          onClick={() => handleDeleteCity(city.id)}
                          aria-label={`Supprimer ${city.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Catégories de Métiers ({data.categories.length})</CardTitle>
                  <CardDescription>
                    Métiers ouverts à la publication de services en FCFA.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleCreateCategory} className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        placeholder="slug (ex: vitrerie)"
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                      />
                      <Input
                        placeholder="Nom (ex: Vitrerie)"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                      />
                      <Select value={newCatIcon} onValueChange={setNewCatIcon}>
                        <SelectTrigger>
                          <SelectValue placeholder="Icône" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(CATEGORY_ICON_MAP).map((iconKey) => (
                            <SelectItem key={iconKey} value={iconKey}>
                              {iconKey}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Description courte (optionnel)"
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                      />
                      <Button type="submit" disabled={busyId === "create-category"}>
                        Ajouter
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {data.categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 rounded-lg border gap-2"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {renderCategoryIcon(cat)}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{cat.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {cat.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary">
                            {cat.servicesCount} services
                          </Badge>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            disabled={busyId === cat.id}
                            onClick={() => handleDeleteCategory(cat.id)}
                            aria-label={`Supprimer ${cat.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
