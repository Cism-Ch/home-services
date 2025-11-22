import { Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Service } from "@/lib/mock-data"
import Image from "next/image"
import Link from "next/link"

interface ServiceListingCardProps {
    service: Service
}

export function ServiceListingCard({ service }: ServiceListingCardProps) {
    return (
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white/100 backdrop-blur-sm">
                    {service.category}
                </Badge>
            </div>

            <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{service.title}</h3>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-xs font-bold text-primary">{service.rating}</span>
                    </div>
                </div>
                <div className="flex items-center text-muted-foreground text-sm gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{service.location}</span>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {service.description}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={service.providerAvatar} />
                        <AvatarFallback>{service.providerName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{service.providerName}</span>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">À partir de</span>
                    <span className="text-lg font-bold text-primary">{service.price}€</span>
                </div>
                <Link href={`/book/${service.providerId}/${service.id}`}>
                    <Button>Réserver</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
