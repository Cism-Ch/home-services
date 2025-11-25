"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Calendar,
    Settings,
    LogOut,
    Briefcase,
    User,
    Clock,
    Menu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"

export function DashboardSidebar() {
    const pathname = usePathname()
    const isPro = pathname.startsWith("/dashboard/pro")
    const [open, setOpen] = useState(false)

    const clientLinks = [
        {
            href: "/dashboard/client",
            label: "Vue d'ensemble",
            icon: LayoutDashboard,
            exact: true
        },
        {
            href: "/dashboard/client/bookings",
            label: "Mes réservations",
            icon: Calendar,
            exact: false
        },
        {
            href: "/dashboard/client/settings",
            label: "Paramètres",
            icon: Settings,
            exact: false
        }
    ]

    const proLinks = [
        {
            href: "/dashboard/pro",
            label: "Vue d'ensemble",
            icon: LayoutDashboard,
            exact: true
        },
        {
            href: "/dashboard/pro/schedule",
            label: "Agenda",
            icon: Calendar,
            exact: false
        },
        {
            href: "/dashboard/pro/services",
            label: "Mes services",
            icon: Briefcase,
            exact: false
        },
        {
            href: "/dashboard/pro/profile",
            label: "Mon profil",
            icon: User,
            exact: false
        },
        {
            href: "/dashboard/pro/availability",
            label: "Disponibilités",
            icon: Clock,
            exact: false
        },
        {
            href: "/dashboard/pro/settings",
            label: "Paramètres",
            icon: Settings,
            exact: false
        }
    ]

    const links = isPro ? proLinks : clientLinks
    const userType = isPro ? "Professionnel" : "Client"
    const userName = isPro ? "Sarah Martin" : "Jean Dupont" // Mock data

    const NavContent = () => (
        <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                        isPro ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-primary/10 text-primary"
                    )}>
                        {isPro ? "SM" : "JD"}
                    </div>
                    <div>
                        <p className="font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground">{userType}</p>
                    </div>
                </div>
                <nav className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = link.exact
                            ? pathname === link.href
                            : pathname.startsWith(link.href)

                        return (
                            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        isActive && "font-medium"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
                <div className="pt-4 mt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                    </Button>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden w-full mb-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2">
                            <Menu className="h-4 w-4" />
                            Menu Dashboard
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 pt-10">
                        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                        <div className="px-4">
                            <NavContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <NavContent />
                </div>
            </aside>
        </>
    )
}
