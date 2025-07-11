import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Block suspicious user agents
  const userAgent = request.headers.get('user-agent') || ''
  const blockedAgents = ['sattaking', 'gambling', 'casino', 'HTTrack', 'WebCopier']
  
  if (blockedAgents.some(agent => userAgent.toLowerCase().includes(agent.toLowerCase()))) {
    return new Response('Access Denied', { status: 403 })
  }
  
  // Block suspicious referrers
  const referrer = request.headers.get('referer') || ''
  const blockedReferrers = ['sattaking', 'gambling', 'casino']
  
  if (blockedReferrers.some(ref => referrer.toLowerCase().includes(ref.toLowerCase()))) {
    return new Response('Access Denied', { status: 403 })
  }
  
  // Handle PDF template requests by serving HTML files
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/templates/') && pathname.endsWith('.pdf')) {
    const htmlPath = pathname.replace('.pdf', '.html')
    return NextResponse.rewrite(new URL(htmlPath, request.url))
  }
  
  // Redirect PNG icon requests to SVG versions
  if (pathname === '/icon-192x192.png') {
    return NextResponse.redirect(new URL('/icon-192x192.svg', request.url))
  }
  if (pathname === '/favicon.ico') {
    return NextResponse.redirect(new URL('/favicon.svg', request.url))
  }
  
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}