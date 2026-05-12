import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Only run Supabase session refresh on routes that need auth/session.
    '/admin/:path*',
    '/auth/:path*',
    '/api/admin/:path*',
  ],
}
