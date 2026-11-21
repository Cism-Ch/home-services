"use client"

import { toast } from "sonner"

export interface NotifyOptions {
  description?: string
  id?: string
  duration?: number
}

/**
 * Helper centralise de notifications (Sonner) assurant des durees normalisees,
 * une deduplication par identifiant (anti-spam sur clics rapides) et une coherence UI.
 */
export const notify = {
  success(title: string, options?: NotifyOptions) {
    return toast.success(title, {
      id: options?.id,
      description: options?.description,
      duration: options?.duration ?? 3500,
    })
  },
  info(title: string, options?: NotifyOptions) {
    return toast.info(title, {
      id: options?.id,
      description: options?.description,
      duration: options?.duration ?? 3000,
    })
  },
  warning(title: string, options?: NotifyOptions) {
    return toast.warning(title, {
      id: options?.id,
      description: options?.description,
      duration: options?.duration ?? 4500,
    })
  },
  error(title: string, options?: NotifyOptions) {
    return toast.error(title, {
      id: options?.id,
      description: options?.description,
      duration: options?.duration ?? 5000,
    })
  },
}
