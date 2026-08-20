import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const response = NextResponse.next()

  // If the host is a staging/random domain (not sizesnap.in and not www.sizesnap.in),
  // add X-Robots-Tag to tell search engines not to index these duplicate pages.
  if (host && !host.includes('localhost') && host !== 'sizesnap.in' && host !== 'www.sizesnap.in') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    
    // Also point search engines to the canonical URL on the main domain
    const canonicalUrl = `https://www.sizesnap.in${request.nextUrl.pathname}`
    response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
  }

  return response
}

export const config = {
  // Apply middleware to all routes except API, static files, and images
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
