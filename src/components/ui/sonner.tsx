"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toaster Sonner normalise avec parite complete light / dark / luxury,
 * bouton de fermeture et pile bornee.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()
  const sonnerTheme: ToasterProps["theme"] =
    resolvedTheme === "light" ? "light" : "dark"

  return (
    <Sonner
      theme={sonnerTheme}
      closeButton
      visibleToasts={4}
      duration={4000}
      className="toaster group font-sans"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans shadow-lg border border-border/70 backdrop-blur-md",
          title: "font-semibold text-sm",
          description: "text-xs text-muted-foreground",
          closeButton:
            "bg-background/90 border-border/70 text-foreground hover:bg-muted transition-colors",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
