import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, Shield, Clock } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        À propos de HomeService
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Votre plateforme de confiance pour tous vos services à domicile
                    </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <p className="text-muted-foreground leading-relaxed">
                        HomeService est la plateforme qui met en relation les particuliers avec les meilleurs professionnels
                        de services à domicile. Que vous ayez besoin d'un plombier, d'un électricien, d'un peintre ou de tout
                        autre service, nous vous aidons à trouver le professionnel idéal près de chez vous.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Professionnels Vérifiés</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Tous nos professionnels sont soigneusement sélectionnés et vérifiés pour garantir
                                la qualité de leurs services.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Paiement Sécurisé</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Vos paiements sont sécurisés et vous bénéficiez d'une garantie sur tous les travaux effectués.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Intervention Rapide</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Réservez en quelques clics et bénéficiez d'une intervention rapide selon vos disponibilités.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Satisfaction Garantie</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Notre service client est à votre écoute pour garantir votre satisfaction à chaque étape.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-muted/50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Simplifier l'accès aux services à domicile en créant une plateforme de confiance où
                        professionnels qualifiés et particuliers peuvent se rencontrer facilement. Nous croyons
                        que chacun mérite un service de qualité, rapide et transparent.
                    </p>
                </div>
            </div>
        </div>
    )
}
