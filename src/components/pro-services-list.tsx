import { services as allServices } from "@/lib/mock-data"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface ProServicesListProps {
    proId: string
}

export function ProServicesList({ proId }: ProServicesListProps) {
    const services = allServices.filter(s => s.providerId === proId)

    if (!services || services.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="text-muted-foreground">Aucun service disponible pour le moment.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
                <Card key={service.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <Badge variant="outline">{service.category}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Devis gratuit</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Intervention rapide</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-6">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Tarif indicatif</span>
                            <span className="text-xl font-bold text-primary">{service.price}€</span>
                        </div>
                        <Link href={`/book/${proId}/${service.id}`}>
                            <Button size="sm">Choisir</Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
