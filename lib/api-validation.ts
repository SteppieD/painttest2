/**
 * Enhanced API Validation Middleware
 * 
 * Provides comprehensive validation for all API endpoints with:
 * - Zod schema validation
 * - Input sanitization
 * - Error handling
 * - Rate limiting protection
 * - Security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateInput, validatePartialInput } from './validation-schemas';
import { InputSanitizer } from './input-sanitization';

export interface ValidationOptions {
  schema?: z.ZodSchema;
  sanitize?: boolean;
  requireAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  allowedMethods?: string[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  errors?: ApiError[];
  message?: string;
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Main validation middleware
 */
export function withValidation(options: ValidationOptions = {}) {
  return async (
    request: NextRequest,
    handler: (req: NextRequest, validated?: any) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const requestId = generateRequestId();
    
    try {
      // Add security headers
      const response = new NextResponse();
      addSecurityHeaders(response);

      // Check allowed methods
      if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
        return createErrorResponse({
          code: 'METHOD_NOT_ALLOWED',
          message: `Method ${request.method} not allowed`
        }, 405, requestId);
      }

      // Rate limiting
      if (options.rateLimit) {
        const rateLimitResult = checkRateLimit(request, options.rateLimit);
        if (!rateLimitResult.allowed) {
          return createErrorResponse({
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            details: {
              retryAfter: rateLimitResult.retryAfter
            }
          }, 429, requestId);
        }
      }

      // Authentication check
      if (options.requireAuth) {
        const authResult = await checkAuthentication(request);
        if (!authResult.valid) {
          return createErrorResponse({
            code: 'UNAUTHORIZED',
            message: authResult.message || 'Authentication required'
          }, 401, requestId);
        }
      }

      // Validate and sanitize request data
      let validatedData: any = undefined;
      
      if (options.schema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const bodyResult = await validateRequestBody(request, options.schema, options.sanitize);
        if (!bodyResult.success) {
          return createErrorResponse({
            code: 'VALIDATION_FAILED',
            message: 'Request validation failed',
            details: bodyResult.errors
          }, 400, requestId);
        }
        validatedData = bodyResult.data;
      }

      // Validate query parameters
      if (options.schema && request.method === 'GET') {
        const queryResult = validateQueryParameters(request, options.schema);
        if (!queryResult.success) {
          return createErrorResponse({
            code: 'VALIDATION_FAILED',
            message: 'Query parameter validation failed',
            details: queryResult.errors
          }, 400, requestId);
        }
        validatedData = queryResult.data;
      }

      // Call the actual handler
      return await handler(request, validatedData);

    } catch (error) {
      console.error('API validation error:', error);
      return createErrorResponse({
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }, 500, requestId);
    }
  };
}

/**
 * Validate request body
 */
async function validateRequestBody(
  request: NextRequest,
  schema: z.ZodSchema,
  sanitize: boolean = true
): Promise<{
  success: boolean;
  data?: any;
  errors?: string[];
}> {
  try {
    const body = await request.json();
    
    // Sanitize input if requested
    const inputData = sanitize ? sanitizeObject(body) : body;
    
    // Validate with schema
    const validation = validateInput(schema, inputData);
    
    return validation;
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        errors: ['Invalid JSON format']
      };
    }
    
    return {
      success: false,
      errors: ['Failed to parse request body']
    };
  }
}

/**
 * Validate query parameters
 */
function validateQueryParameters(
  request: NextRequest,
  schema: z.ZodSchema
): {
  success: boolean;
  data?: any;
  errors?: string[];
} {
  try {
    const url = new URL(request.url);
    const queryObject: Record<string, any> = {};
    
    // Convert URLSearchParams to object
    for (const [key, value] of url.searchParams.entries()) {
      queryObject[key] = value;
    }
    
    // Sanitize query parameters
    const sanitizedQuery = sanitizeObject(queryObject);
    
    // Validate with schema
    return validateInput(schema, sanitizedQuery);
    
  } catch (error) {
    return {
      success: false,
      errors: ['Failed to validate query parameters']
    };
  }
}

/**
 * Check authentication
 */
async function checkAuthentication(request: NextRequest): Promise<{
  valid: boolean;
  message?: string;
  user?: any;
}> {
  try {
    // Check for API key in headers
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) {
      // Validate API key (implement your API key validation logic)
      return { valid: true };
    }

    // Check for Bearer token
    const authorization = request.headers.get('authorization');
    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.substring(7);
      // Validate JWT token (implement your JWT validation logic)
      return { valid: true };
    }

    // Check for session-based auth
    const sessionId = request.headers.get('x-session-id') || request.cookies.get('session')?.value;
    if (sessionId) {
      // Validate session (implement your session validation logic)
      return { valid: true };
    }

    return {
      valid: false,
      message: 'No valid authentication provided'
    };

  } catch (error) {
    return {
      valid: false,
      message: 'Authentication validation failed'
    };
  }
}

/**
 * Rate limiting check
 */
function checkRateLimit(
  request: NextRequest,
  options: { maxRequests: number; windowMs: number }
): {
  allowed: boolean;
  retryAfter?: number;
} {
  const clientId = getClientId(request);
  const now = Date.now();
  const windowStart = now - options.windowMs;

  // Clean up expired entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(clientId);
  
  if (!current || current.resetTime < now) {
    // New window
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + options.windowMs
    });
    return { allowed: true };
  }

  if (current.count >= options.maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    };
  }

  // Increment count
  current.count++;
  return { allowed: true };
}

/**
 * Get client identifier for rate limiting
 */
function getClientId(request: NextRequest): string {
  // In production, use a combination of IP, user agent, and other factors
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${userAgent.substring(0, 50)}`;
}

/**
 * Sanitize object recursively
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return InputSanitizer.sanitizeString(obj);
  }

  if (typeof obj === 'number') {
    return isNaN(obj) ? 0 : obj;
  }

  if (typeof obj === 'boolean') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = InputSanitizer.sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Add security headers
 */
function addSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

/**
 * Create standardized error response
 */
function createErrorResponse(
  error: ApiError,
  status: number = 400,
  requestId: string
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      version: '1.0.0'
    }
  };

  const nextResponse = NextResponse.json(response, { status });
  addSecurityHeaders(nextResponse);
  
  return nextResponse;
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  requestId?: string
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId || generateRequestId(),
      version: '1.0.0'
    }
  };

  const nextResponse = NextResponse.json(response);
  addSecurityHeaders(nextResponse);
  
  return nextResponse;
}

/**
 * Generate request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validation decorators for specific use cases
 */
export const ValidationRules = {
  // Company validation
  createCompany: withValidation({
    schema: z.object({
      access_code: z.string().min(4).max(20).regex(/^[A-Z0-9]+$/),
      company_name: z.string().min(2).max(255),
      phone: z.string().optional(),
      email: z.string().email().optional()
    }),
    sanitize: true,
    rateLimit: { maxRequests: 10, windowMs: 60000 } // 10 requests per minute
  }),

  // Quote validation
  createQuote: withValidation({
    schema: z.object({
      company_id: z.number().int().positive(),
      customer_name: z.string().min(2).max(255),
      customer_email: z.string().email().optional(),
      customer_phone: z.string().optional(),
      address: z.string().max(1000).optional(),
      walls_sqft: z.number().min(0).max(50000),
      ceilings_sqft: z.number().min(0).max(50000),
      trim_sqft: z.number().min(0).max(10000)
    }),
    sanitize: true,
    requireAuth: true,
    rateLimit: { maxRequests: 100, windowMs: 60000 } // 100 requests per minute
  }),

  // Customer validation
  createCustomer: withValidation({
    schema: z.object({
      company_id: z.number().int().positive(),
      name: z.string().min(2).max(255),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.string().max(1000).optional()
    }),
    sanitize: true,
    requireAuth: true,
    rateLimit: { maxRequests: 50, windowMs: 60000 } // 50 requests per minute
  }),

  // General read operations
  readOnly: withValidation({
    allowedMethods: ['GET'],
    rateLimit: { maxRequests: 500, windowMs: 60000 } // 500 requests per minute
  }),

  // Admin operations
  adminOnly: withValidation({
    requireAuth: true,
    rateLimit: { maxRequests: 200, windowMs: 60000 } // 200 requests per minute
  })
};

/**
 * Error handling utilities
 */
export class ApiErrorHandler {
  static handleDatabaseError(error: any, requestId: string): NextResponse {
    console.error('Database error:', error);
    
    if (error.code === 'SQLITE_CONSTRAINT') {
      return createErrorResponse({
        code: 'CONSTRAINT_VIOLATION',
        message: 'Data constraint violation'
      }, 409, requestId);
    }

    if (error.code === 'SQLITE_BUSY') {
      return createErrorResponse({
        code: 'DATABASE_BUSY',
        message: 'Database is busy, please try again'
      }, 503, requestId);
    }

    return createErrorResponse({
      code: 'DATABASE_ERROR',
      message: 'Database operation failed'
    }, 500, requestId);
  }

  static handleValidationError(errors: string[], requestId: string): NextResponse {
    return createErrorResponse({
      code: 'VALIDATION_ERROR',
      message: 'Input validation failed',
      details: errors
    }, 400, requestId);
  }

  static handleNotFoundError(entity: string, id: string | number, requestId: string): NextResponse {
    return createErrorResponse({
      code: 'NOT_FOUND',
      message: `${entity} not found`,
      details: { id }
    }, 404, requestId);
  }

  static handleUnauthorizedError(message: string = 'Unauthorized', requestId: string): NextResponse {
    return createErrorResponse({
      code: 'UNAUTHORIZED',
      message
    }, 401, requestId);
  }

  static handleForbiddenError(message: string = 'Forbidden', requestId: string): NextResponse {
    return createErrorResponse({
      code: 'FORBIDDEN',
      message
    }, 403, requestId);
  }
}

/**
 * Input validation helpers
 */
export class ValidationHelpers {
  static validatePagination(query: any): {
    page: number;
    limit: number;
    offset: number;
  } {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  static validateSortParams(query: any, allowedFields: string[]): {
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  } {
    const sortBy = allowedFields.includes(query.sort_by) ? query.sort_by : allowedFields[0];
    const sortOrder = query.sort_order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return { sortBy, sortOrder };
  }

  static validateDateRange(query: any): {
    startDate?: Date;
    endDate?: Date;
  } {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (query.start_date) {
      const parsed = new Date(query.start_date);
      if (!isNaN(parsed.getTime())) {
        startDate = parsed;
      }
    }

    if (query.end_date) {
      const parsed = new Date(query.end_date);
      if (!isNaN(parsed.getTime())) {
        endDate = parsed;
      }
    }

    return { startDate, endDate };
  }
}