"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { notify } from "@/lib/notifications"

const THEME_LABELS: Record<string, string> = {
  light: "Clair",
  dark: "Sombre",
  system: "Système",
  luxury: "Luxe",
}

export function ModeToggle() {
  const { setTheme } = useTheme()

  const handleSelectTheme = (nextTheme: string) => {
    setTheme(nextTheme)
    notify.info(`Thème ${THEME_LABELS[nextTheme] ?? nextTheme} activé`, {
      id: "theme-mode",
      duration: 2200,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Changer le thème">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <DropdownMenuItem onClick={() => handleSelectTheme("light")}>
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelectTheme("dark")}>
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelectTheme("system")}>
          Système
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelectTheme("luxury")}>
          Luxe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
