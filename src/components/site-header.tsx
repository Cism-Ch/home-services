import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container mx-auto px-4 flex h-16 items-center">
                <div className="mr-8 hidden md:flex items-center">
                    <Link href="/" className="mr-8 flex items-center space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            <span className="text-white font-bold text-sm">HS</span>
                        </div>
                        <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">
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
                        <Button variant="ghost" asChild className="text-base font-medium hover:text-primary transition-colors">
                            <Link href="/login">Se connecter</Link>
                        </Button>
                        <Button asChild className="text-base px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                            <Link href="/register">S&apos;inscrire</Link>
                        </Button>
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}
