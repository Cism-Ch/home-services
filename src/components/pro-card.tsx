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
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30">
            {/* Gradient background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="relative flex flex-row items-center gap-4 pb-4">
                <div className="relative">
                    <Avatar className="h-16 w-16 ring-2 ring-background group-hover:ring-primary/20 transition-all duration-300 shadow-md">
                        <AvatarImage src={pro.avatar} alt={pro.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {pro.name.substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    {/* Verified badge indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-none tracking-tight group-hover:text-primary transition-colors duration-300 truncate">
                        {pro.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 font-medium">{pro.title}</p>
                </div>
            </CardHeader>

            <CardContent className="relative pt-0">
                <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors duration-300">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                        <span className="font-bold text-lg text-foreground">{pro.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                        <span className="text-foreground font-semibold">{pro.reviewsCount}</span> avis
                    </span>
                </div>
            </CardContent>

            <CardFooter className="relative">
                <Link href={`/pros/${pro.id}`} className="w-full">
                    <Button className="w-full group-hover:shadow-md transition-shadow duration-300 font-semibold">
                        Voir le profil
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
