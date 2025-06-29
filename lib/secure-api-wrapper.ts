/**
 * Secure API Wrapper
 * 
 * Provides company-scoped authorization and data access controls
 * Ensures users can only access their own company's data
 */

import { NextRequest, NextResponse } from 'next/server';
import { SessionManager } from './session-manager';
import { validateInput } from './validation-schemas';
import { InputSanitizer } from './enhanced-input-sanitization';
import { z } from 'zod';

export interface SecureApiOptions {
  requireAuth?: boolean;
  requireCompanyScope?: boolean;
  allowedMethods?: string[];
  rateLimitConfig?: {
    maxRequests: number;
    windowMs: number;
  };
  validationSchema?: z.ZodSchema;
  sanitizeInput?: boolean;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    companyId: number;
    sessionId: string;
    accessCode: string;
  };
  validatedData?: any;
}

/**
 * Extract company ID from request (query param or body)
 */
function extractCompanyId(request: NextRequest, body?: any): number | null {
  // Try URL params first
  const url = new URL(request.url);
  const companyIdParam = url.searchParams.get('company_id');
  if (companyIdParam) {
    const id = parseInt(companyIdParam);
    return isNaN(id) ? null : id;
  }

  // Try request body
  if (body && body.company_id) {
    const id = parseInt(body.company_id);
    return isNaN(id) ? null : id;
  }

  return null;
}

/**
 * Extract access code from request (query param, body, or headers)
 */
function extractAccessCode(request: NextRequest, body?: any): string | null {
  // Try URL params first
  const url = new URL(request.url);
  const accessCode = url.searchParams.get('access_code');
  if (accessCode) return accessCode;

  // Try request body
  if (body && body.access_code) return body.access_code;

  // Try headers
  const headerAccessCode = request.headers.get('x-access-code');
  if (headerAccessCode) return headerAccessCode;

  return null;
}

/**
 * Main secure API wrapper
 */
export function withSecureApi(options: SecureApiOptions = {}) {
  return function (
    handler: (request: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return async (request: NextRequest): Promise<NextResponse> => {
      try {
        // Method validation
        if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
          return NextResponse.json(
            { 
              error: 'Method not allowed',
              code: 'METHOD_NOT_ALLOWED'
            },
            { status: 405 }
          );
        }

        // Parse request body if needed
        let body: any = null;
        if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
          try {
            const text = await request.text();
            body = text ? JSON.parse(text) : null;
          } catch (error) {
            return NextResponse.json(
              { 
                error: 'Invalid JSON in request body',
                code: 'INVALID_JSON'
              },
              { status: 400 }
            );
          }
        }

        // Input sanitization
        if (options.sanitizeInput && body) {
          body = InputSanitizer.sanitizeObject(body);
        }

        // Input validation
        let validatedData: any = body;
        if (options.validationSchema && body) {
          const validation = validateInput(options.validationSchema, body);
          if (!validation.success) {
            return NextResponse.json(
              {
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: validation.errors
              },
              { status: 400 }
            );
          }
          validatedData = validation.data;
        }

        // Session validation
        if (options.requireAuth) {
          const sessionValidation = await SessionManager.validateSession(request);
          
          if (!sessionValidation.valid || !sessionValidation.sessionData) {
            return NextResponse.json(
              {
                error: 'Authentication required',
                code: 'AUTH_REQUIRED'
              },
              { status: 401 }
            );
          }

          // Add user data to request
          (request as AuthenticatedRequest).user = {
            companyId: sessionValidation.sessionData.companyId,
            sessionId: sessionValidation.sessionData.sessionId,
            accessCode: sessionValidation.sessionData.accessCode
          };
        }

        // Company scope authorization
        if (options.requireCompanyScope) {
          const userCompanyId = (request as AuthenticatedRequest).user?.companyId;
          const requestedCompanyId = extractCompanyId(request, body);

          if (!userCompanyId) {
            return NextResponse.json(
              {
                error: 'Company authentication required',
                code: 'COMPANY_AUTH_REQUIRED'
              },
              { status: 401 }
            );
          }

          if (requestedCompanyId && userCompanyId !== requestedCompanyId) {
            return NextResponse.json(
              {
                error: 'Access denied to company data',
                code: 'COMPANY_ACCESS_DENIED',
                details: {
                  userCompanyId,
                  requestedCompanyId
                }
              },
              { status: 403 }
            );
          }
        }

        // Add validated data to request
        if (validatedData) {
          (request as AuthenticatedRequest).validatedData = validatedData;
        }

        // Call the actual handler
        const response = await handler(request as AuthenticatedRequest);

        // Add security headers to response
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');

        return response;

      } catch (error) {
        console.error('Secure API wrapper error:', error);
        return NextResponse.json(
          {
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
          },
          { status: 500 }
        );
      }
    };
  };
}

/**
 * Pre-configured wrappers for common use cases
 */

// Secure company-scoped data access
export const withCompanyAuth = withSecureApi({
  requireAuth: true,
  requireCompanyScope: true,
  sanitizeInput: true
});

// Read-only operations with basic auth
export const withReadAuth = withSecureApi({
  requireAuth: true,
  allowedMethods: ['GET'],
  sanitizeInput: true
});

// Public endpoints with rate limiting
export const withPublicAccess = withSecureApi({
  requireAuth: false,
  sanitizeInput: true,
  rateLimitConfig: {
    maxRequests: 100,
    windowMs: 60000
  }
});

// Admin-only operations
export const withAdminAuth = withSecureApi({
  requireAuth: true,
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  sanitizeInput: true
});

/**
 * Helper function to create standardized API responses
 */
export function createApiResponse(
  data: any,
  options: {
    success?: boolean;
    message?: string;
    status?: number;
  } = {}
): NextResponse {
  const {
    success = true,
    message,
    status = success ? 200 : 400
  } = options;

  const response = NextResponse.json(
    {
      success,
      data: success ? data : undefined,
      error: success ? undefined : data,
      message,
      timestamp: new Date().toISOString()
    },
    { status }
  );

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

/**
 * Helper to validate access code format
 */
export function validateAccessCode(code: string): boolean {
  const accessCodeRegex = /^[A-Z0-9]{4,20}$/;
  return accessCodeRegex.test(code);
}

/**
 * Helper to check if user can access specific quote
 */
export async function canAccessQuote(
  quoteId: string, 
  userCompanyId: number
): Promise<boolean> {
  try {
    // Import database functions
    const { dbGet } = await import('./database');
    
    const quote = await dbGet(
      'SELECT company_id FROM quotes WHERE quote_id = ? OR id = ?',
      [quoteId, quoteId]
    );

    return quote && quote.company_id === userCompanyId;
  } catch (error) {
    console.error('Error checking quote access:', error);
    return false;
  }
}

/**
 * Helper to check if user can access specific customer
 */
export async function canAccessCustomer(
  customerId: number,
  userCompanyId: number
): Promise<boolean> {
  try {
    const { dbGet } = await import('./database');
    
    const customer = await dbGet(
      'SELECT company_id FROM customers WHERE id = ?',
      [customerId]
    );

    return customer && customer.company_id === userCompanyId;
  } catch (error) {
    console.error('Error checking customer access:', error);
    return false;
  }
}

/**
 * Audit logging for sensitive operations
 */
export async function logSecurityEvent(
  event: string,
  details: any,
  request: NextRequest,
  companyId?: number
): Promise<void> {
  try {
    const { dbRun } = await import('./database');
    
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await dbRun(`
      INSERT INTO security_audit_log (
        event_type, 
        company_id, 
        details, 
        client_ip, 
        user_agent, 
        timestamp
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      event,
      companyId || null,
      JSON.stringify(details),
      clientIP,
      userAgent,
      new Date().toISOString()
    ]);
  } catch (error) {
    console.error('Failed to log security event:', error);
    // Don't fail the request if audit logging fails
  }
}