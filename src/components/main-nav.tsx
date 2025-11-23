import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-1 lg:space-x-2", className)}
            {...props}
        >
            <Link
                href="/"
                className="relative px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-[hsl(var(--brand))] rounded-md hover:bg-[hsl(var(--brand))]/10 group"
            >
                Accueil
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] group-hover:w-8 transition-all duration-300" />
            </Link>
            <Link
                href="/services"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-[hsl(var(--brand))] rounded-md hover:bg-[hsl(var(--brand))]/10 group"
            >
                Services
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] group-hover:w-8 transition-all duration-300" />
            </Link>
            <Link
                href="/professionals"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-[hsl(var(--brand))] rounded-md hover:bg-[hsl(var(--brand))]/10 group"
            >
                Professionnels
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] group-hover:w-8 transition-all duration-300" />
            </Link>
            <Link
                href="/about"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-[hsl(var(--brand))] rounded-md hover:bg-[hsl(var(--brand))]/10 group"
            >
                À propos
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] group-hover:w-8 transition-all duration-300" />
            </Link>
        </nav>
    )
}
