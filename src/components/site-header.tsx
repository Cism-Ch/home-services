import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm animate-slide-down">
            <div className="container mx-auto px-4 flex h-16 items-center">
                <div className="mr-8 hidden md:flex items-center">
                    <Link href="/" className="mr-8 flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 glow-brand">
                            <span className="text-white font-bold text-sm">HS</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block text-lg gradient-brand group-hover:scale-105 transition-transform duration-300">
                            HomeService
                        </span>
                    </Link>
                    <MainNav />
                </div>
                <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search placeholder */}
                    </div>
                    <nav className="flex items-center gap-3">
                        <Button variant="ghost" asChild className="text-base font-medium hover:text-[hsl(var(--brand))] transition-colors duration-300 hover:bg-[hsl(var(--brand))]/10">
                            <Link href="/login">Se connecter</Link>
                        </Button>
                        <Button asChild className="text-base px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] hover:scale-105 glow-brand">
                            <Link href="/register">S&apos;inscrire</Link>
                        </Button>
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}
