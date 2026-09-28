import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSeoRedirect } from '@/lib/seo-redirects';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname matches any old SizeSnap URL pattern
  const destination = getSeoRedirect(pathname);
  if (destination) {
    const redirectUrl = new URL(destination, request.url);
    // Preserve any existing search params if not already specified
    request.nextUrl.searchParams.forEach((value, key) => {
      if (!redirectUrl.searchParams.has(key)) {
        redirectUrl.searchParams.set(key, value);
      }
    });

    return NextResponse.redirect(redirectUrl, {
      status: 301,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, etc.
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|icon\\.svg).*)',
  ],
};
