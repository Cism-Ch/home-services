"use client"

import { useState } from "react"
import Image from "next/image"
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
import { Plus, Trash2, Clock, Pencil, ArchiveRestore } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  CreateServiceDialog,
  type ServiceFormPayload,
} from "@/components/dashboard/create-service-dialog"
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
  createProServiceAction,
  updateProServiceAction,
  deleteProServiceAction,
} from "@/server/actions/pro-catalog"
import { getCategoryIllustration } from "@/lib/category-illustrations"
import { formatFCFA } from "@/lib/formatters"
import { formatDurationLabel } from "@/lib/scheduling"
import { notify } from "@/lib/notifications"
import type { CatalogCategory, CatalogService } from "@/lib/types/catalog"

interface ProServicesViewProps {
  proProfileId: string
  providerName: string
  initialServices: CatalogService[]
  categories: CatalogCategory[]
}

export function ProServicesView({
  proProfileId,
  providerName,
  initialServices,
  categories,
}: ProServicesViewProps) {
  const router = useRouter()
  const [myServices, setMyServices] = useState<CatalogService[]>(initialServices)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<CatalogService | null>(null)
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const openCreateDialog = () => {
    setEditingService(null)
    setDialogOpen(true)
  }

  const openEditDialog = (service: CatalogService) => {
    setEditingService(service)
    setDialogOpen(true)
  }

  const handleSubmitService = async (
    payload: ServiceFormPayload
  ): Promise<boolean> => {
    if (editingService) {
      const res = await updateProServiceAction(editingService.id, {
        title: payload.title,
        description: payload.description,
        categoryId: payload.category,
        price: payload.price,
        duration: payload.duration,
        durationUnit: payload.durationUnit,
        durationValue: payload.durationValue,
        isActive: payload.isActive,
      })

      if (res.error || !res.data) {
        notify.error(res.error || "Impossible de modifier cette prestation.")
        return false
      }

      const catObj = categories.find((c) => c.id === payload.category)
      setMyServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                title: res.data!.title,
                description: res.data!.description,
                categoryId: res.data!.categoryId,
                categoryName: catObj?.name || res.data!.categoryId,
                price: res.data!.price,
                duration: res.data!.duration,
                durationUnit: res.data!.durationUnit,
                durationValue: res.data!.durationValue,
                isActive: res.data!.isActive,
                image:
                  s.image.startsWith("/images/services/")
                    ? getCategoryIllustration(res.data!.categoryId)
                    : s.image,
              }
            : s
        )
      )
      notify.success(`Prestation "${res.data.title}" mise à jour.`, {
        id: "pro-service-update",
      })
      router.refresh()
      return true
    }

    const res = await createProServiceAction(proProfileId, {
      title: payload.title,
      description: payload.description,
      categoryId: payload.category,
      price: payload.price,
      duration: payload.duration,
      durationUnit: payload.durationUnit,
      durationValue: payload.durationValue,
      isActive: true,
    })

    if (res.error || !res.data) {
      notify.error(res.error || "Impossible de créer cette prestation.")
      return false
    }

    const catObj = categories.find((c) => c.id === payload.category)
    const createdItem: CatalogService = {
      id: res.data.id,
      proProfileId,
      proUserId: proProfileId,
      title: payload.title,
      description: payload.description,
      categoryId: payload.category,
      categoryName: catObj?.name || payload.category,
      price: payload.price,
      duration: res.data.duration,
      durationUnit: res.data.durationUnit,
      durationValue: res.data.durationValue,
      rating: 5.0,
      reviewsCount: 0,
      providerName,
      location: "Côte d'Ivoire",
      image: getCategoryIllustration(payload.category),
      isActive: true,
    }
    setMyServices((prev) => [createdItem, ...prev])
    notify.success(`Prestation "${payload.title}" ajoutée en FCFA.`, {
      id: "pro-service-create",
    })
    router.refresh()
    return true
  }

  const handleDeleteService = async (serviceId: string) => {
    setIsDeleting(true)
    try {
      const res = await deleteProServiceAction(serviceId)
      if (res.error || !res.data) {
        notify.error(res.error || "Erreur lors de la suppression.")
        return
      }

      if (res.data.mode === "ARCHIVED") {
        setMyServices((prev) =>
          prev.map((s) =>
            s.id === serviceId ? { ...s, isActive: false } : s
          )
        )
        notify.info("Prestation archivée (retirée du catalogue public).", {
          id: "pro-service-archive",
          description: `${res.data.bookingsCount} réservation(s) historique(s) y sont liées ; vous pouvez la réactiver à tout moment.`,
        })
      } else {
        setMyServices((prev) => prev.filter((s) => s.id !== serviceId))
        notify.success("Prestation supprimée définitivement de votre catalogue.", {
          id: "pro-service-delete",
        })
      }
      setDeleteServiceId(null)
      router.refresh()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReactivateService = async (service: CatalogService) => {
    setRestoringId(service.id)
    try {
      const res = await updateProServiceAction(service.id, {
        title: service.title,
        description: service.description,
        categoryId: service.categoryId,
        price: service.price,
        duration: service.duration,
        durationUnit: service.durationUnit,
        durationValue: service.durationValue,
        isActive: true,
      })
      if (res.error) {
        notify.error(res.error)
        return
      }
      setMyServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: true } : s))
      )
      notify.success(`Prestation "${service.title}" réactivée dans le catalogue.`, {
        id: "pro-service-restore",
      })
      router.refresh()
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Mes Services &amp; Tarifs (FCFA)
          </h1>
          <p className="text-muted-foreground mt-2">
            Créez, modifiez ou archivez les prestations et tarifs indicatifs proposés aux clients de votre zone.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Ajouter une prestation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myServices.map((service) => (
          <Card
            key={service.id}
            className={`flex flex-col h-full py-0 gap-0 overflow-hidden transition-opacity ${
              service.isActive === false ? "opacity-75 border-dashed" : ""
            }`}
          >
            <div className="aspect-video w-full overflow-hidden relative shrink-0 bg-white">
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                className="object-cover transition-transform hover:scale-105"
              />
              <Badge className="absolute top-2 right-2 bg-background/90 text-foreground backdrop-blur-sm">
                {service.categoryName}
              </Badge>
              {service.isActive === false && (
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 bg-amber-500/90 text-white"
                >
                  Archivée
                </Badge>
              )}
            </div>
            <CardHeader className="pt-5 pb-2">
              <CardTitle className="line-clamp-1">{service.title}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 py-3">
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    {formatDurationLabel(service.durationValue, service.durationUnit)}
                  </span>
                </div>
                <div className="font-bold text-lg text-primary tabular-nums">
                  {formatFCFA(service.price)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto border-t py-3.5 flex flex-wrap items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => openEditDialog(service)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </Button>

              {service.isActive === false ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={restoringId === service.id}
                  className="gap-1.5"
                  onClick={() => void handleReactivateService(service)}
                >
                  <ArchiveRestore className="h-3.5 w-3.5" />
                  Réactiver
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                  onClick={() => setDeleteServiceId(service.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={openCreateDialog}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 h-full min-h-[300px] w-full hover:bg-accent/50 transition-colors group whitespace-normal"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <span className="text-lg font-semibold mb-1 text-foreground">
            Nouvelle prestation
          </span>
          <span className="text-sm font-normal text-muted-foreground text-center">
            Ajoutez un service avec tarif indicatif en FCFA
          </span>
        </Button>
      </div>

      <CreateServiceDialog
        key={editingService?.id ?? "create-service"}
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next)
          if (!next) setEditingService(null)
        }}
        categories={categories}
        editingService={editingService}
        onSubmitService={handleSubmitService}
      />

      <AlertDialog
        open={deleteServiceId !== null}
        onOpenChange={(next) => {
          if (!next && !isDeleting) setDeleteServiceId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette prestation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Si aucune réservation n&apos;est liée, la prestation sera supprimée définitivement. Si des réservations historiques existent, elle sera archivée et masquée du catalogue public pour préserver l&apos;historique client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                if (deleteServiceId) void handleDeleteService(deleteServiceId)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Traitement..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
