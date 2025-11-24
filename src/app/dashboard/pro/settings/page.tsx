"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { BillingInvoices } from "@/components/dashboard/billing-invoices"

export default function ProSettingsPage() {
    return (
        <div className="space-y-8 animate-appear">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du compte</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez les informations de votre entreprise et vos préférences.
                </p>
            </div>

            <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="business">Entreprise</TabsTrigger>
                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                    <TabsTrigger value="billing">Facturation</TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-6">
                    <TabsContent value="business">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de l&apos;entreprise</CardTitle>
                                <CardDescription>
                                    Ces informations apparaissent sur vos factures.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company-name">Nom de l&apos;entreprise</Label>
                                    <Input id="company-name" defaultValue="Plomberie Dupont SARL" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="siret">Numéro SIRET</Label>
                                    <Input id="siret" defaultValue="123 456 789 00012" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Adresse du siège</Label>
                                    <Input id="address" defaultValue="12 Rue des Artisans, 75015 Paris" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-pro">Email professionnel</Label>
                                        <Input id="email-pro" type="email" defaultValue="contact@plomberie-dupont.fr" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone-pro">Téléphone professionnel</Label>
                                        <Input id="phone-pro" type="tel" defaultValue="+33 1 23 45 67 89" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Enregistrer</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sécurité du compte</CardTitle>
                                <CardDescription>
                                    Gérez votre mot de passe et l'authentification.
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
                                <div className="flex items-center justify-between pt-4">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Authentification à deux facteurs</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Ajouter une couche de sécurité supplémentaire.
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Mettre à jour</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Abonnement et Paiement</CardTitle>
                                <CardDescription>
                                    Gérez votre abonnement HomeServices Pro.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Plan Professionnel</p>
                                        <p className="text-sm text-muted-foreground">29,99 € / mois</p>
                                    </div>
                                    <Badge>Actif</Badge>
                                </div>
                                <div className="space-y-2">
                                    <Label>Moyen de paiement</Label>
                                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                                        <div className="h-8 w-12 bg-gray-200 rounded"></div>
                                        <div className="flex-1">
                                            <p className="font-medium">Visa terminant par 4242</p>
                                            <p className="text-sm text-muted-foreground">Expire le 12/25</p>
                                        </div>
                                        <Button variant="ghost" size="sm">Modifier</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="link" className="text-destructive p-0 h-auto">Résilier l&apos;abonnement</Button>
                            </CardFooter>
                        </Card>

                        <BillingInvoices />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
