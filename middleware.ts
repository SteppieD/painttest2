import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers configuration
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
};

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/auth/': { maxRequests: 5, windowMs: 60000 }, // 5 auth attempts per minute
  '/api/quotes': { maxRequests: 100, windowMs: 60000 }, // 100 quote operations per minute
  '/api/': { maxRequests: 200, windowMs: 60000 }, // 200 API calls per minute (general)
  '/trial-signup': { maxRequests: 3, windowMs: 300000 }, // 3 signups per 5 minutes
};

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : (request.ip || 'unknown');
  return ip;
}

function checkRateLimit(request: NextRequest, pathname: string): boolean {
  // Find matching rate limit rule
  let rateLimit = null;
  for (const [path, limit] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path)) {
      rateLimit = limit;
      break;
    }
  }

  if (!rateLimit) return true; // No rate limit for this path

  const clientId = getClientId(request);
  const key = `${clientId}:${pathname}`;
  const now = Date.now();
  
  // Clean up expired entries
  for (const [mapKey, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(mapKey);
    }
  }

  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + rateLimit.windowMs
    });
    return true;
  }

  if (current.count >= rateLimit.maxRequests) {
    return false; // Rate limit exceeded
  }

  // Increment count
  current.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response with security headers
  const response = NextResponse.next();
  
  // Add security headers to all responses
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limiting check
  if (!checkRateLimit(request, pathname)) {
    return new Response('Rate limit exceeded', {
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
        ...SECURITY_HEADERS
      }
    });
  }

  // Allow access to homepage and marketing pages for everyone
  const publicPaths = ['/', '/about', '/contact', '/features', '/pricing', '/support', '/privacy', '/terms'];
  
  // Allow access to these paths without redirecting to dashboard
  if (publicPaths.includes(pathname)) {
    return response;
  }
  
  // For other paths, continue with normal flow
  return response;
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