import { NextRequest, NextResponse } from 'next/server';
import { jwtManager, JWTPayload } from './jwt-manager';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Authentication middleware for API routes
 */
export async function authenticate(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  user?: JWTPayload;
  response?: NextResponse;
}> {
  try {
    const token = jwtManager.extractTokenFromRequest(request);
    
    if (!token) {
      return {
        isAuthenticated: false,
        response: NextResponse.json(
          { error: 'Authentication required', code: 'AUTH_REQUIRED' },
          { status: 401 }
        )
      };
    }

    const payload = jwtManager.verifyAccessToken(token);
    
    if (!payload) {
      return {
        isAuthenticated: false,
        response: NextResponse.json(
          { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
          { status: 401 }
        )
      };
    }

    // Validate session still exists
    const session = await jwtManager.validateSession(payload.sessionId);
    
    if (!session) {
      return {
        isAuthenticated: false,
        response: NextResponse.json(
          { error: 'Session expired', code: 'SESSION_EXPIRED' },
          { status: 401 }
        )
      };
    }

    return {
      isAuthenticated: true,
      user: payload
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      isAuthenticated: false,
      response: NextResponse.json(
        { error: 'Authentication failed', code: 'AUTH_ERROR' },
        { status: 500 }
      )
    };
  }
}

/**
 * Authorization middleware - check if user has required role
 */
export function authorize(requiredRole: 'user' | 'admin' = 'user') {
  return (user: JWTPayload): boolean => {
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return false;
    }
    return true;
  };
}

/**
 * Company scope authorization - ensure user can only access their company's data
 */
export function authorizeCompanyAccess(user: JWTPayload, requestedCompanyId: number): boolean {
  // Admin users can access any company
  if (user.role === 'admin') {
    return true;
  }

  // Regular users can only access their own company
  return user.companyId === requestedCompanyId;
}

/**
 * Higher-order function to wrap API handlers with authentication
 */
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  options: {
    requiredRole?: 'user' | 'admin';
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Authenticate user
    const authResult = await authenticate(request);
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return authResult.response!;
    }

    // Check role authorization
    if (options.requiredRole && !authorize(options.requiredRole)(authResult.user)) {
      return NextResponse.json(
        { error: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' },
        { status: 403 }
      );
    }

    // Call the original handler with authenticated user
    try {
      return await handler(request, authResult.user);
    } catch (error) {
      console.error('Handler error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Higher-order function to wrap API handlers with company scope validation
 */
export function withCompanyAuth(
  handler: (request: NextRequest, user: JWTPayload, companyId: number) => Promise<NextResponse>,
  getCompanyIdFromRequest: (request: NextRequest) => number | null
) {
  return withAuth(async (request: NextRequest, user: JWTPayload) => {
    const requestedCompanyId = getCompanyIdFromRequest(request);
    
    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID required', code: 'COMPANY_ID_REQUIRED' },
        { status: 400 }
      );
    }

    if (!authorizeCompanyAccess(user, requestedCompanyId)) {
      return NextResponse.json(
        { error: 'Access denied to company data', code: 'COMPANY_ACCESS_DENIED' },
        { status: 403 }
      );
    }

    return handler(request, user, requestedCompanyId);
  });
}

/**
 * Refresh token endpoint handler
 */
export async function handleTokenRefresh(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = jwtManager.extractRefreshTokenFromRequest(request);
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 401 }
      );
    }

    const tokens = await jwtManager.refreshAccessToken(refreshToken);
    
    if (!tokens) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      accessToken: tokens.accessToken
    });

    // Set new tokens in cookies
    response.cookies.set('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 // 15 minutes
    });

    response.cookies.set('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    );
  }
}