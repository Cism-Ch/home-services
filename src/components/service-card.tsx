import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCardProps {
    title: string
    icon: LucideIcon
    description: string
}

export function ServiceCard({ title, icon: Icon, description }: ServiceCardProps) {
    return (
        <Card className="group relative overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:border-[hsl(var(--brand))]/40 bg-card/50 backdrop-blur-sm animate-appear opacity-0 border-border/50">
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand))]/8 via-transparent to-[hsl(var(--brand-foreground))]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-brand pointer-events-none" />
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[hsl(var(--brand))]/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[hsl(var(--brand-foreground))]/5 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative z-10 pb-4">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--brand-foreground))]/10 group-hover:from-[hsl(var(--brand))]/20 group-hover:to-[hsl(var(--brand-foreground))]/20 transition-all duration-500 group-hover:scale-110 transform group-hover:rotate-6 ring-2 ring-[hsl(var(--brand))]/0 group-hover:ring-[hsl(var(--brand))]/20">
                    <Icon className="h-8 w-8 text-[hsl(var(--brand))] group-hover:text-[hsl(var(--brand-foreground))] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                </div>
                <CardTitle className="group-hover:text-[hsl(var(--brand))] transition-colors duration-300 font-bold text-xl leading-tight">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed">
                    {description}
                </p>
            </CardContent>
            
            {/* Bottom border accent on hover with gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--brand))] via-[hsl(var(--brand-foreground))] to-[hsl(var(--brand))] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
            </div>
        </Card>
    )
}
