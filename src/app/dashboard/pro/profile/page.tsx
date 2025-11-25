"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Upload, X } from "lucide-react"

export default function ProProfilePage() {
    return (
        <div className="space-y-8 animate-appear">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mon Profil Public</h1>
                <p className="text-muted-foreground mt-2">
                    C&apos;est ce que verront vos clients. Soignez votre présentation !
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar & Basic Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Photo de profil</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <Avatar className="h-24 w-24 md:h-32 md:w-32">
                                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" className="object-cover" />
                                <AvatarFallback>JP</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" className="w-full gap-2">
                                <Upload className="h-4 w-4" />
                                Changer la photo
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Visibilité</CardTitle>
                            <CardDescription>Votre profil est actuellement visible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="font-medium text-green-600">En ligne</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" className="w-full">Mettre hors ligne</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column - Details Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                            <CardDescription>
                                Décrivez votre activité et votre expérience.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom d&apos;affichage</Label>
                                    <Input id="name" defaultValue="Jean Plombier" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre professionnel</Label>
                                    <Input id="title" defaultValue="Plombier Expert" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biographie</Label>
                                <Textarea
                                    id="bio"
                                    className="min-h-[120px]"
                                    defaultValue="Plombier qualifié avec plus de 15 ans d&apos;expérience. Spécialisé dans les dépannages d&apos;urgence et les rénovations de salle de bain. Travail soigné et garanti."
                                />
                                <p className="text-xs text-muted-foreground text-right">0/500 caractères</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Années d&apos;expérience</Label>
                                    <Input id="experience" defaultValue="15 ans" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Zone d&apos;intervention</Label>
                                    <Input id="location" defaultValue="Paris 15ème" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Langues parlées</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge variant="secondary" className="gap-1 pr-1">
                                        Français
                                        <button className="hover:bg-muted rounded-full p-0.5"><X className="h-3 w-3" /></button>
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1 pr-1">
                                        Anglais
                                        <button className="hover:bg-muted rounded-full p-0.5"><X className="h-3 w-3" /></button>
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Ajouter une langue..." className="max-w-[200px]" />
                                    <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Portfolio</CardTitle>
                            <CardDescription>
                                Ajoutez des photos de vos réalisations pour convaincre vos clients.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="aspect-square rounded-lg overflow-hidden relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"
                                        alt="Portfolio 1"
                                        className="w-full h-full object-cover"
                                    />
                                    <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="aspect-square rounded-lg overflow-hidden relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80"
                                        alt="Portfolio 2"
                                        className="w-full h-full object-cover"
                                    />
                                    <button className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 cursor-pointer transition-colors">
                                    <Upload className="h-6 w-6 mb-2" />
                                    <span className="text-xs">Ajouter</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4">
                            <Button variant="outline">Annuler</Button>
                            <Button>Enregistrer les modifications</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

import { Plus } from "lucide-react"
