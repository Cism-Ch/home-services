import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCardProps {
    title: string
    icon: LucideIcon
    description: string
}

export function ServiceCard({ title, icon: Icon, description }: ServiceCardProps) {
    return (
        <Card className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative">
                <div className="mb-3 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <Icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
            </CardHeader>
            <CardContent className="relative">
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{description}</p>
            </CardContent>
        </Card>
    )
}
