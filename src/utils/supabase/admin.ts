import { createClient } from '@supabase/supabase-js'

/**
 * WARNING: This client uses the Service Role Key which bypasses Row Level Security.
 * ONLY use this on the server and never expose this key to the client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
