import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl
  const code = searchParams.get('code')

  // If Supabase redirected to root or any page with '?code=', forward to /auth/callback
  if (code && !pathname.startsWith('/auth/callback')) {
    const callbackUrl = new URL('/auth/callback', request.url)
    callbackUrl.searchParams.set('code', code)
    callbackUrl.searchParams.set('next', searchParams.get('next') || '/admin')
    return NextResponse.redirect(callbackUrl)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/auth/:path*',
    '/api/admin/:path*',
  ],
}
