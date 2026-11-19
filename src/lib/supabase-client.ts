/**
 * Client navigateur Supabase singleton pour les souscriptions Realtime (Regle 8)
 * Retourne null proprement si les cles publiques NEXT_PUBLIC_SUPABASE_* sont absentes.
 */

"use client"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let cachedBrowserClient: SupabaseClient | null | undefined

/**
 * Retourne l'instance singleton navigateur Supabase ou null hors-ligne.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    return null
  }

  if (cachedBrowserClient !== undefined) {
    return cachedBrowserClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    cachedBrowserClient = null
    return null
  }

  cachedBrowserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return cachedBrowserClient
}
