"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Clock, DollarSign } from "lucide-react"
import { services as initialServices } from "@/lib/mock-data"
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

export default function ProServicesPage() {
    const proId = "pro-1"
    const [myServices, setMyServices] = useState(initialServices.filter(s => s.providerId === proId))
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null)

    const handleCreateService = (newService: {
        title: string
        description: string
        category: string
        price: number
        duration: number
    }) => {
        const service = {
            id: `service-${Date.now()}`,
            ...newService,
            providerId: proId,
            providerName: "Jean Plombier",
            location: "Paris 15ème",
            rating: 0,
            reviews: 0,
            image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
        }
        setMyServices([...myServices, service])
    }

    const handleDeleteService = (serviceId: string) => {
        setMyServices(myServices.filter(s => s.id !== serviceId))
        setDeleteServiceId(null)
    }

    return (
        <div className="space-y-8 animate-appear">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Services</h1>
                    <p className="text-muted-foreground mt-2">
                        Gérez les prestations que vous proposez à vos clients.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map((service) => (
                    <Card key={service.id} className="flex flex-col">
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                            <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm hover:bg-background/90">
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
                                <div className="flex items-center gap-1 font-semibold text-lg">
                                    <span>{service.price}</span>
                                    <DollarSign className="h-4 w-4" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t p-4 gap-2">
                            <Button variant="outline" className="flex-1 gap-2">
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
                    <h3 className="text-lg font-semibold mb-1">Nouveau service</h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Créez une nouvelle prestation pour vos clients
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
            <AlertDialog open={deleteServiceId !== null} onOpenChange={() => setDeleteServiceId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le service sera définitivement supprimé de votre liste.
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
