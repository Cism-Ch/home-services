"use client"

import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import { Button, type buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileUploadButtonProps
  extends VariantProps<typeof buttonVariants> {
  accept?: string
  onFileSelect: (file: File) => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
  children: React.ReactNode
}

/**
 * Declencheur d'envoi de fichier fonde sur Button + Input shadcn/ui sans balise HTML brute dispersee.
 */
export function FileUploadButton({
  accept,
  onFileSelect,
  disabled = false,
  variant = "outline",
  size = "default",
  className,
  ariaLabel,
  children,
}: FileUploadButtonProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0]
          e.target.value = ""
          if (selected) {
            onFileSelect(selected)
          }
        }}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={disabled}
        aria-label={ariaLabel}
        className={className}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </Button>
    </>
  )
}
