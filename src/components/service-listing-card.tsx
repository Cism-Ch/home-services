import { Star, MapPin, Sparkles } from "lucide-react"
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
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 group relative bg-card/50 backdrop-blur-sm border-border/50 shadow-md hover:shadow-2xl hover:border-[hsl(var(--brand))]/30 hover:-translate-y-2">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand pointer-events-none" />

            {/* Image Container */}
            <div className="relative h-52 w-full overflow-hidden">
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                
                <Badge className="absolute top-4 right-4 bg-white/95 text-gray-900 hover:bg-white backdrop-blur-md shadow-lg font-semibold px-3 py-1">
                    {service.category}
                </Badge>
            </div>

            <CardHeader className="p-6 pb-3 relative z-20">
                <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-[hsl(var(--brand))] transition-colors duration-300">
                        {service.title}
                    </h3>
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10 px-2.5 py-1.5 rounded-full shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <Star className="h-3.5 w-3.5 fill-[hsl(var(--brand))] text-[hsl(var(--brand))]" />
                        <span className="text-xs font-bold text-[hsl(var(--brand))]">{service.rating}</span>
                    </div>
                </div>
                <div className="flex items-center text-muted-foreground text-sm gap-1.5 group-hover:text-foreground transition-colors duration-300">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{service.location}</span>
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-3 flex-grow relative z-20">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {service.description}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50 group-hover:border-[hsl(var(--brand))]/20 transition-colors duration-300">
                    <Avatar className="h-9 w-9 ring-2 ring-border/50 group-hover:ring-[hsl(var(--brand))]/30 transition-all duration-300">
                        <AvatarImage src={service.providerAvatar} />
                        <AvatarFallback className="bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] font-semibold">
                            {service.providerName.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold group-hover:text-[hsl(var(--brand))] transition-colors duration-300">
                        {service.providerName}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex items-center justify-between relative z-20">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium mb-0.5">À partir de</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] bg-clip-text text-transparent">
                            {service.price}€
                        </span>
                    </div>
                </div>
                <Link href={`/book/${service.providerId}/${service.id}`}>
                    <Button className="bg-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/90 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 gap-2 font-semibold">
                        <Sparkles className="h-4 w-4" />
                        Réserver
                    </Button>
                </Link>
            </CardFooter>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--brand))] via-[hsl(var(--brand-foreground))] to-[hsl(var(--brand))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
        </Card>
    )
}
