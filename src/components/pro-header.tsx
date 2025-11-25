import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Professional } from "@/lib/mock-data"
import { MapPin, Star, Globe, Clock } from "lucide-react"
import Link from "next/link"

interface ProHeaderProps {
    professional: Professional
}

export function ProHeader({ professional }: ProHeaderProps) {
    // Get the first service ID for the booking link
    const firstServiceId = professional.services[0]?.id || ""

    return (
        <div className="relative mb-8">
            {/* Cover Image Placeholder - could be added to data later */}
            <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl mb-16 md:mb-0"></div>

            <div className="container mx-auto px-4">
                <div className="relative -top-12 md:-top-16 flex flex-col md:flex-row items-start md:items-end gap-6">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                        <AvatarImage src={professional.avatar} alt={professional.name} className="object-cover" />
                        <AvatarFallback className="text-xl md:text-2xl">{professional.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 pt-2 md:pt-0 md:pb-4 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <h1 className="text-3xl font-bold">{professional.name}</h1>
                            <Badge variant="secondary" className="w-fit text-sm px-3 py-1">
                                {professional.title}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {professional.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="font-bold text-foreground">{professional.rating}</span>
                                <span>({professional.reviewsCount} avis)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {professional.experience} d&apos;expérience
                            </div>
                            <div className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                {professional.languages.join(", ")}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto md:pb-4">
                        <Link href={`/book/${professional.id}/${firstServiceId}`} className="flex-1 md:flex-none">
                            <Button className="w-full shadow-lg">Réserver</Button>
                        </Link>
                        <Button variant="outline" className="flex-1 md:flex-none">Contacter</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
