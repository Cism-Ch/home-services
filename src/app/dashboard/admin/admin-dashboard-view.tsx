"use client"

import { useState } from "react"
import Link from "next/link"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  moderateReviewAction,
  createCategoryAction,
  deleteCategoryAction,
  createCityAction,
  deleteCityAction,
} from "@/server/actions/admin"
import {
  Activity,
  Download,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  CreditCard,
  Star,
  CheckCircle2,
  XCircle,
  MapPin,
  FileCheck,
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
  const [reviewOverrides, setReviewOverrides] = useState<
    Record<string, { isModerated: boolean; isReported: boolean }>
  >({})
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "PENDING" | "PUBLISHED">("ALL")
  const [confirmDeleteReviewId, setConfirmDeleteReviewId] = useState<string | null>(null)
  const [previewKycItem, setPreviewKycItem] = useState<AdminKycItem | null>(null)
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

  const allReviews = data.reviews
    .filter((r) => !removedReviewIds[r.id])
    .map((r) => {
      const patch = reviewOverrides[r.id]
      return patch ? { ...r, ...patch } : r
    })

  const pendingReviewsCount = allReviews.filter(
    (r) => !r.isModerated || r.isReported
  ).length
  const publishedReviewsCount = allReviews.filter(
    (r) => r.isModerated && !r.isReported
  ).length

  const filteredReviews = allReviews.filter((r) => {
    if (reviewFilter === "PENDING") return !r.isModerated || r.isReported
    if (reviewFilter === "PUBLISHED") return r.isModerated && !r.isReported
    return true
  })

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

      if (previewKycItem?.id === proId) {
        setPreviewKycItem(null)
      }

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

  const handleReviewDecision = async (
    reviewId: string,
    decision: "APPROVE" | "HIDE" | "REMOVE"
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
        setConfirmDeleteReviewId(null)
        toast.info("Avis supprimé définitivement et note du prestataire recalculée.")
      } else if (decision === "HIDE") {
        setReviewOverrides((prev) => ({
          ...prev,
          [reviewId]: { isModerated: false, isReported: false },
        }))
        toast.info("Avis masqué du profil public et note recalculée.")
      } else {
        setReviewOverrides((prev) => ({
          ...prev,
          [reviewId]: { isModerated: true, isReported: false },
        }))
        toast.success("Avis publié et pris en compte dans la note moyenne.")
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
        <div className="min-w-0 max-w-full">
          <p className="font-semibold text-foreground break-words">{item.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 break-words">{item.headline}</p>
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
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs"
              onClick={() => setPreviewKycItem(item)}
            >
              <Eye className="h-3.5 w-3.5 text-primary" />
              Visualiser
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="gap-1 text-xs px-2"
            >
              <a
                href={`/api/admin/kyc/${item.id}?download=1`}
                download
                aria-label={`Télécharger le justificatif de ${item.name}`}
              >
                <Download className="h-3.5 w-3.5" />
                Télécharger
              </a>
            </Button>
          </div>
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Portail d&apos;Administration &amp; Gouvernance
          </h1>
          <p className="text-muted-foreground mt-2">
            Supervisez la vérification KYC des artisans, la modération des avis mutuels, le référentiel GEO et les revenus Paystack en FCFA.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2 w-full sm:w-auto shrink-0">
          <Link href="/dashboard/admin/health">
            <Activity className="h-4 w-4 text-[hsl(var(--brand))]" />
            Santé &amp; Uptime Stack
          </Link>
        </Button>
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
            <div className="text-2xl font-bold">{allReviews.length} avis</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingReviewsCount} à modérer • {data.platformCounts.completedBookings} missions clôturées
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
            Modération Avis ({allReviews.length})
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
              <CardHeader className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Modération des Avis Mutuels</CardTitle>
                    <CardDescription className="mt-1">
                      Seuls les avis <strong>Publiés</strong> comptent dans la note moyenne publique d&apos;un prestataire. Masquez temporairement un avis douteux ou supprimez-le définitivement.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant={reviewFilter === "ALL" ? "default" : "outline"}
                      onClick={() => setReviewFilter("ALL")}
                    >
                      Tous ({allReviews.length})
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={reviewFilter === "PENDING" ? "default" : "outline"}
                      onClick={() => setReviewFilter("PENDING")}
                    >
                      À modérer ({pendingReviewsCount})
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={reviewFilter === "PUBLISHED" ? "default" : "outline"}
                      onClick={() => setReviewFilter("PUBLISHED")}
                    >
                      Publiés ({publishedReviewsCount})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
                    Aucun avis dans cette catégorie.
                  </p>
                ) : (
                  filteredReviews.map((rev) => {
                    const isPublished = rev.isModerated && !rev.isReported
                    return (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/60"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm">{rev.authorName}</span>
                            <span className="text-xs text-muted-foreground">
                              → {rev.targetName}
                            </span>
                            <Badge variant="outline" className="text-[11px]">
                              {rev.authorType === "PRO_TO_CLIENT"
                                ? "Pro → Client"
                                : "Client → Pro"}
                            </Badge>
                            <span className="text-xs text-amber-500 font-bold tabular-nums">
                              {rev.rating} / 5
                            </span>
                            {rev.isReported ? (
                              <Badge variant="destructive" className="text-[11px]">
                                Signalé
                              </Badge>
                            ) : isPublished ? (
                              <Badge variant="success" className="text-[11px]">
                                Publié
                              </Badge>
                            ) : (
                              <Badge variant="warning" className="text-[11px]">
                                En attente / Masqué
                              </Badge>
                            )}
                            <span className="text-[11px] text-muted-foreground tabular-nums">
                              {new Date(rev.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/85 leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {!isPublished ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={busyId === rev.id}
                              className="gap-1.5 text-emerald-600 hover:text-emerald-700"
                              onClick={() => void handleReviewDecision(rev.id, "APPROVE")}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Publier
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={busyId === rev.id}
                              className="gap-1.5"
                              onClick={() => void handleReviewDecision(rev.id, "HIDE")}
                            >
                              <EyeOff className="h-3.5 w-3.5" />
                              Masquer
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={busyId === rev.id}
                            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setConfirmDeleteReviewId(rev.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    )
                  })
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

      {/* Modale de previsualisation & telechargement du justificatif KYC */}
      <Dialog
        open={previewKycItem !== null}
        onOpenChange={(next) => {
          if (!next) setPreviewKycItem(null)
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Justificatif KYC — {previewKycItem?.name}
            </DialogTitle>
            <DialogDescription>
              {previewKycItem?.headline} • {previewKycItem?.city}
            </DialogDescription>
          </DialogHeader>

          {previewKycItem && (
            <div className="flex-1 min-h-[360px] rounded-xl border bg-muted/30 overflow-hidden">
              <iframe
                src={`/api/admin/kyc/${previewKycItem.id}`}
                title={`Justificatif KYC de ${previewKycItem.name}`}
                className="w-full h-[55vh] border-0 bg-white"
              />
            </div>
          )}

          <DialogFooter className="flex-wrap gap-2 sm:justify-between">
            {previewKycItem && (
              <Button asChild variant="outline" className="gap-2">
                <a
                  href={`/api/admin/kyc/${previewKycItem.id}?download=1`}
                  download
                >
                  <Download className="h-4 w-4" />
                  Télécharger le fichier
                </a>
              </Button>
            )}
            <div className="flex items-center gap-2">
              {previewKycItem && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busyId === previewKycItem.id}
                    className="gap-1.5 text-destructive"
                    onClick={() => void handleKycDecision(previewKycItem.id, "REJECT")}
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button
                    type="button"
                    disabled={busyId === previewKycItem.id}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => void handleKycDecision(previewKycItem.id, "APPROVE")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Valider KYC
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression definitive d'avis */}
      <AlertDialog
        open={confirmDeleteReviewId !== null}
        onOpenChange={(next) => {
          if (!next) setConfirmDeleteReviewId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer définitivement cet avis ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et recalculera immédiatement la note moyenne du prestataire. Si vous souhaitez conserver une trace, préférez l&apos;action &laquo; Masquer &raquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDeleteReviewId) {
                  void handleReviewDecision(confirmDeleteReviewId, "REMOVE")
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
