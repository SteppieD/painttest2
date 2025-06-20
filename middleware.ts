import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to homepage and marketing pages for everyone
  const publicPaths = ['/', '/about', '/contact', '/features', '/pricing', '/support', '/privacy', '/terms'];
  
  // Allow access to these paths without redirecting to dashboard
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // For other paths, continue with normal flow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};