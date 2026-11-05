"use client"

import * as React from "react"
import { Phone, MessageSquare, Mic, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProContactActionsProps {
  proName: string
  phoneNumber?: string
  whatsappNumber?: string
  serviceTitle?: string
  bookingRef?: string
  size?: "default" | "sm" | "lg"
  variant?: "horizontal" | "vertical" | "compact"
  className?: string
}

export function ProContactActions({
  proName,
  phoneNumber,
  whatsappNumber,
  serviceTitle,
  bookingRef,
  size = "default",
  variant = "horizontal",
  className = "",
}: ProContactActionsProps) {
  // Nettoyage du numero pour lien wa.me (retrait des espaces, +, etc.)
  const rawWa = whatsappNumber || phoneNumber || ""
  const cleanWaNumber = rawWa.replace(/[^0-9]/g, "")

  // Message prerempli poli et contextualise
  const waMessage = React.useMemo(() => {
    let msg = `Bonjour ${proName}, je vous contacte depuis HomeServices`
    if (bookingRef) {
      msg += ` suite a ma reservation ref #${bookingRef}`
    }
    if (serviceTitle) {
      msg += ` pour le service "${serviceTitle}"`
    }
    msg += ". Pouvons-nous echanger par message ou note vocale sur les details de l'intervention ?"
    return encodeURIComponent(msg)
  }, [proName, bookingRef, serviceTitle])

  const waUrl = cleanWaNumber ? `https://wa.me/${cleanWaNumber}?text=${waMessage}` : undefined
  const telUrl = phoneNumber ? `tel:${phoneNumber.replace(/\s+/g, "")}` : undefined

  if (!cleanWaNumber && !phoneNumber) {
    return null
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {waUrl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                asChild
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer" aria-label="Contacter sur WhatsApp">
                  <MessageSquare className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Discuter sur WhatsApp</TooltipContent>
          </Tooltip>
        )}
        {telUrl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-primary/40 text-primary hover:bg-primary/10"
                asChild
              >
                <a href={telUrl} aria-label="Appeler directement">
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Appel telephonique direct</TooltipContent>
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <div
      className={`flex ${
        variant === "vertical" ? "flex-col" : "flex-wrap"
      } gap-3 ${className}`}
    >
      {waUrl && (
        <Button
          size={size}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all duration-200 gap-2 flex-1 min-w-[170px]"
          asChild
        >
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span>Discuter / Note vocale</span>
            <Mic className="h-3.5 w-3.5 opacity-80 shrink-0" />
          </a>
        </Button>
      )}

      {telUrl && (
        <Button
          variant="outline"
          size={size}
          className="border-input hover:bg-accent hover:text-accent-foreground font-medium transition-all duration-200 gap-2 flex-1 min-w-[150px]"
          asChild
        >
          <a href={telUrl}>
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <span>Appeler le pro</span>
            <ExternalLink className="h-3 w-3 opacity-60 ml-auto shrink-0" />
          </a>
        </Button>
      )}
    </div>
  )
}
