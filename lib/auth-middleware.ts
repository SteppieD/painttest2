/**
 * Authentication and Authorization Middleware
 * 
 * Ensures proper access control for all quote and company operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface AuthContext {
  companyId: number;
  accessCode: string;
  sessionId: string;
  isAuthenticated: boolean;
}

export interface AuthError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'SESSION_EXPIRED' | 'INVALID_COMPANY';
  message: string;
}

/**
 * Verify and extract authentication context from request
 */
export async function getAuthContext(request: NextRequest): Promise<{
  success: boolean;
  context?: AuthContext;
  error?: AuthError;
}> {
  try {
    // Check for session cookie
    const sessionCookie = request.cookies.get('paint-session')?.value;
    const companyHeader = request.headers.get('x-company-id');
    
    if (!sessionCookie) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No session found'
        }
      };
    }

    // Verify JWT session
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    let sessionData: any;
    
    try {
      sessionData = jwt.verify(sessionCookie, secret);
    } catch (jwtError) {
      return {
        success: false,
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Invalid or expired session'
        }
      };
    }

    // Validate session data structure
    if (!sessionData.companyId || !sessionData.accessCode) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid session data'
        }
      };
    }

    // If company ID is provided in header, ensure it matches session
    if (companyHeader && parseInt(companyHeader) !== sessionData.companyId) {
      return {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Company ID mismatch'
        }
      };
    }

    return {
      success: true,
      context: {
        companyId: sessionData.companyId,
        accessCode: sessionData.accessCode,
        sessionId: sessionData.sessionId || `session-${Date.now()}`,
        isAuthenticated: true
      }
    };

  } catch (error) {
    console.error('Auth context error:', error);
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed'
      }
    };
  }
}

/**
 * Middleware to require authentication for API routes
 */
export function requireAuth() {
  return async (request: NextRequest, handler: (req: NextRequest, auth: AuthContext) => Promise<NextResponse>) => {
    const authResult = await getAuthContext(request);
    
    if (!authResult.success || !authResult.context) {
      return NextResponse.json({
        success: false,
        error: authResult.error
      }, { status: 401 });
    }

    return handler(request, authResult.context);
  };
}

/**
 * Middleware to ensure quote belongs to authenticated company
 */
export async function validateQuoteAccess(
  quoteId: number,
  companyId: number,
  db: any
): Promise<{
  hasAccess: boolean;
  quote?: any;
  error?: string;
}> {
  try {
    const quote = await db.get(
      'SELECT * FROM quotes WHERE id = ? AND company_id = ?',
      [quoteId, companyId]
    );

    if (!quote) {
      return {
        hasAccess: false,
        error: 'Quote not found or access denied'
      };
    }

    return {
      hasAccess: true,
      quote
    };

  } catch (error) {
    console.error('Quote access validation error:', error);
    return {
      hasAccess: false,
      error: 'Failed to validate quote access'
    };
  }
}

/**
 * Middleware to ensure customer belongs to authenticated company
 */
export async function validateCustomerAccess(
  customerId: number,
  companyId: number,
  db: any
): Promise<{
  hasAccess: boolean;
  customer?: any;
  error?: string;
}> {
  try {
    const customer = await db.get(
      'SELECT * FROM customers WHERE id = ? AND company_id = ?',
      [customerId, companyId]
    );

    if (!customer) {
      return {
        hasAccess: false,
        error: 'Customer not found or access denied'
      };
    }

    return {
      hasAccess: true,
      customer
    };

  } catch (error) {
    console.error('Customer access validation error:', error);
    return {
      hasAccess: false,
      error: 'Failed to validate customer access'
    };
  }
}

/**
 * Create secure session cookie
 */
export function createSessionCookie(companyId: number, accessCode: string): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  const sessionData = {
    companyId,
    accessCode,
    sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  return jwt.sign(sessionData, secret);
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(): string {
  return jwt.sign({}, process.env.JWT_SECRET || 'fallback-secret-change-in-production', {
    expiresIn: '1s'
  });
}

/**
 * Rate limiting store (move to Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting for authentication attempts
 */
export function checkAuthRateLimit(identifier: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const key = `auth:${identifier}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // Clean expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime < now) {
      rateLimitStore.delete(k);
    }
  }

  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true };
  }

  if (current.count >= maxAttempts) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    };
  }

  current.count++;
  return { allowed: true };
}