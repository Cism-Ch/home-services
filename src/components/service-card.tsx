import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCardProps {
    title: string
    icon: LucideIcon
    description: string
}

export function ServiceCard({ title, icon: Icon, description }: ServiceCardProps) {
    return (
        <Card className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-elevated hover:-translate-y-2 hover:border-[hsl(var(--brand))]/30 bg-card/50 backdrop-blur-sm animate-appear opacity-0">
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/5 via-transparent to-[hsl(var(--brand-foreground))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand" />
            
            <CardHeader className="relative">
                <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[hsl(var(--brand))]/10 group-hover:bg-[hsl(var(--brand))]/20 transition-all duration-500 group-hover:scale-110 transform group-hover:rotate-3">
                    <Icon className="h-7 w-7 text-[hsl(var(--brand))] group-hover:text-[hsl(var(--brand-foreground))] transition-all duration-500 group-hover:scale-110" />
                </div>
                <CardTitle className="group-hover:text-[hsl(var(--brand))] transition-colors duration-300 font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">{description}</p>
            </CardContent>
            
            {/* Bottom border accent on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </Card>
    )
}
