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
                className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md hover:bg-primary/5 group"
            >
                Accueil
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-8 transition-all duration-300" />
            </Link>
            <Link
                href="/services"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary rounded-md hover:bg-primary/5 group"
            >
                Services
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-8 transition-all duration-300" />
            </Link>
            <Link
                href="/professionals"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary rounded-md hover:bg-primary/5 group"
            >
                Professionnels
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-8 transition-all duration-300" />
            </Link>
            <Link
                href="/about"
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary rounded-md hover:bg-primary/5 group"
            >
                À propos
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-8 transition-all duration-300" />
            </Link>
        </nav>
    )
}
