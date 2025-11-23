import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Mail } from "lucide-react"

export default function RegisterPage() {
    return (
        <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 min-h-[calc(100vh-4rem)]">
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
                            <CardDescription className="text-center">
                                Entrez vos informations pour créer votre compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-6">
                                <Button variant="outline">
                                    <Github className="mr-2 h-4 w-4" />
                                    Github
                                </Button>
                                <Button variant="outline">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Ou continuer avec
                                    </span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input id="name" placeholder="Jean Dupont" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input id="password" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full">S'inscrire</Button>
                            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                <p>
                                    Déjà un compte ?{" "}
                                    <Link href="/login" className="hover:text-primary underline underline-offset-4">
                                        Se connecter
                                    </Link>
                                </p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
