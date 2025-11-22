import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import { Professional, Service } from "@/lib/mock-data"

interface BookingSummaryProps {
    professional: Professional
    service: Service
    selectedDate?: Date
    selectedTime?: string
}

export function BookingSummary({ professional, service, selectedDate, selectedTime }: BookingSummaryProps) {
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="text-lg">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{professional.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {professional.location}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{service.title}</span>
                        <Badge variant="outline">{service.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>

                {selectedDate && (
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedDate.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>
                )}

                {selectedTime && (
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTime}</span>
                    </div>
                )}

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Prix estimé</span>
                        <span className="text-2xl font-bold text-primary">{service.price}€</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
