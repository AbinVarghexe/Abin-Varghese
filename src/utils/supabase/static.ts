import { createClient } from '@supabase/supabase-js'

/**
 * A Supabase client for use in static generation or background tasks 
 * where cookies/headers are not available.
 * Uses the anonymous key and does not support user sessions.
 */
export function createStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing');
  }

  return createClient(url, key);
}
