"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/professionals", label: "Professionnels" },
  { href: "/about", label: "À propos" },
] as const

/**
 * Barre de navigation principale avec detection de route active et aria-current.
 */
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigation principale"
      className={cn("flex items-center space-x-1 lg:space-x-2", className)}
      {...props}
    >
      {NAV_ITEMS.map(({ href, label }) => {
        const isActive =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-all duration-300 hover:text-[hsl(var(--brand))] rounded-md hover:bg-[hsl(var(--brand))]/10 group",
              isActive
                ? "text-[hsl(var(--brand))] bg-[hsl(var(--brand))]/10 font-semibold"
                : "text-muted-foreground"
            )}
          >
            {label}
            <span
              className={cn(
                "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-foreground))] transition-all duration-300",
                isActive ? "w-8" : "w-0 group-hover:w-8"
              )}
            />
          </Link>
        )
      })}
    </nav>
  )
}
