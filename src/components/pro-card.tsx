import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Professional } from "@/lib/mock-data"
import Link from "next/link"

interface ProCardProps {
    pro: Professional
}

export function ProCard({ pro }: ProCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-2 bg-card/80 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand))]/40 animate-appear opacity-0">
            {/* Gradient background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand" />

            <CardHeader className="relative flex flex-row items-center gap-4 pb-4">
                <div className="relative">
                    <Avatar className="h-16 w-16 ring-2 ring-background group-hover:ring-[hsl(var(--brand))]/30 transition-all duration-500 shadow-md group-hover:scale-105">
                        <AvatarImage src={pro.avatar} alt={pro.name} className="object-cover" />
                        <AvatarFallback className="bg-[hsl(var(--brand))]/10 text-[hsl(var(--brand))] font-semibold text-lg">
                            {pro.name.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    {/* Verified badge indicator with brand colors */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] rounded-full border-2 border-background flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-none tracking-tight group-hover:text-[hsl(var(--brand))] transition-colors duration-300 truncate">
                        {pro.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 font-medium group-hover:text-foreground/80 transition-colors duration-300">{pro.title}</p>
                </div>
            </CardHeader>

            <CardContent className="relative pt-0">
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 group-hover:bg-[hsl(var(--brand))]/10 transition-all duration-500 border border-transparent group-hover:border-[hsl(var(--brand))]/20">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-5 w-5 fill-[hsl(var(--brand-foreground))] text-[hsl(var(--brand-foreground))] drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-bold text-lg text-foreground">{pro.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                        <span className="text-foreground font-semibold">{pro.reviewsCount}</span> avis
                    </span>
                </div>
            </CardContent>

            <CardFooter className="relative">
                <Link href={`/professionals/pros/${pro.id}`} className="w-full">
                    <Button className="w-full group-hover:shadow-lg transition-all duration-300 font-semibold bg-gradient-to-r hover:from-[hsl(var(--brand))] hover:to-[hsl(var(--brand-foreground))] group-hover:scale-[1.02]">
                        Voir le profil
                        <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Button>
                </Link>
            </CardFooter>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </Card>
    )
}
