"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Pencil, Trash2, Clock } from "lucide-react"
import { services as initialServices, formatFCFA } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { CreateServiceDialog } from "@/components/dashboard/create-service-dialog"
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
  deleteProServiceAction,
} from "@/server/actions/pro-catalog"
import { toast } from "sonner"

export default function ProServicesPage() {
  const proId = "pro-1"
  const [myServices, setMyServices] = useState(
    initialServices.filter((s) => s.providerId === proId)
  )
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null)

  const handleCreateService = async (newService: {
    title: string
    description: string
    category: string
    price: number
    duration: number
  }) => {
    const res = await createProServiceAction(proId, {
      title: newService.title,
      description: newService.description,
      categoryId: newService.category.toLowerCase(),
      price: newService.price,
      duration: newService.duration,
      isActive: true,
    })

    if (res.error) {
      toast.error(res.error)
      return
    }

    const service = {
      id: res.data?.id || `service-${Date.now()}`,
      ...newService,
      providerId: proId,
      providerName: "Kouassi Plomberie",
      location: "Abidjan - Cocody",
      rating: 5.0,
      reviews: 1,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    }
    setMyServices([...myServices, service])
    toast.success(`Prestation "${newService.title}" ajoutée en FCFA.`)
  }

  const handleDeleteService = async (serviceId: string) => {
    const res = await deleteProServiceAction(serviceId)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setMyServices(myServices.filter((s) => s.id !== serviceId))
    setDeleteServiceId(null)
    toast.success("Prestation supprimée de votre catalogue.")
  }

  return (
    <div className="space-y-8 animate-appear">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Services & Tarifs (FCFA)</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les prestations et tarifs indicatifs proposés aux clients de votre zone.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une prestation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myServices.map((service) => (
          <Card key={service.id} className="flex flex-col overflow-hidden">
            <div className="aspect-video w-full overflow-hidden relative">
              <Image
                src={service.image}
                alt={service.title}
                fill
                unoptimized
                className="object-cover transition-transform hover:scale-105"
              />
              <Badge className="absolute top-2 right-2 bg-background/85 text-foreground backdrop-blur-sm">
                {service.category}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{service.title}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="font-bold text-lg text-primary">
                  {formatFCFA(service.price)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => toast.info("Modification rapide activée pour ce service.")}
              >
                <Pencil className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteServiceId(service.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Add New Service Card Placeholder */}
        <Card
          className="flex flex-col items-center justify-center border-dashed p-8 h-full min-h-[300px] cursor-pointer hover:bg-accent/50 transition-colors group"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Nouvelle prestation</h3>
          <p className="text-sm text-muted-foreground text-center">
            Ajoutez un service avec tarif indicatif en FCFA
          </p>
        </Card>
      </div>

      {/* Create Service Dialog */}
      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateService={handleCreateService}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteServiceId !== null}
        onOpenChange={() => setDeleteServiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette prestation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action retirera la prestation de votre catalogue public.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteServiceId && handleDeleteService(deleteServiceId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
