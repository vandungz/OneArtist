import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

/**
 * Supabase Client cho Client Components (Browser)
 * Sử dụng trong các component có directive 'use client'
 * Ví dụ: Audio Player, Form handlers, Interactive elements
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )
}
