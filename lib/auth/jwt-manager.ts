import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { dbGet, dbRun } from '@/lib/database';

// Environment variables with fallbacks for development
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_in_production';

export interface JWTPayload {
  userId: number;
  companyId: number;
  email?: string;
  role: 'user' | 'admin';
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  sessionId: string;
  tokenVersion: number;
}

class JWTManager {
  private readonly ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
  private readonly SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  /**
   * Generate access token for authenticated user
   */
  generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: 'painting-quote-app',
      audience: 'painting-quote-users'
    });
  }

  /**
   * Generate refresh token for session management
   */
  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      issuer: 'painting-quote-app',
      audience: 'painting-quote-refresh'
    });
  }

  /**
   * Verify and decode access token
   */
  verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'painting-quote-app',
        audience: 'painting-quote-users'
      }) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  /**
   * Verify and decode refresh token
   */
  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        issuer: 'painting-quote-app',
        audience: 'painting-quote-refresh'
      }) as RefreshTokenPayload;
      return decoded;
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  /**
   * Create a new user session
   */
  async createSession(userId: number, companyId: number, email?: string, role: 'user' | 'admin' = 'user'): Promise<{
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }> {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + this.SESSION_EXPIRY);

    // Store session in database
    await dbRun(`
      INSERT INTO user_sessions (
        session_id, user_id, company_id, expires_at, created_at, last_accessed_at
      ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [sessionId, userId, companyId, expiresAt.toISOString()]);

    // Generate tokens
    const accessToken = this.generateAccessToken({
      userId,
      companyId,
      email,
      role,
      sessionId
    });

    const refreshToken = this.generateRefreshToken({
      userId,
      sessionId,
      tokenVersion: 1
    });

    return { accessToken, refreshToken, sessionId };
  }

  /**
   * Refresh an access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) return null;

    // Check if session exists and is valid
    const session = await dbGet(`
      SELECT s.*, u.email, u.role, u.company_id
      FROM user_sessions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.session_id = ? AND s.expires_at > CURRENT_TIMESTAMP
    `, [payload.sessionId]);

    if (!session) return null;

    // Update last accessed
    await dbRun(`
      UPDATE user_sessions 
      SET last_accessed_at = CURRENT_TIMESTAMP 
      WHERE session_id = ?
    `, [payload.sessionId]);

    // Generate new tokens
    const newAccessToken = this.generateAccessToken({
      userId: session.user_id,
      companyId: session.company_id,
      email: session.email,
      role: session.role || 'user',
      sessionId: payload.sessionId
    });

    const newRefreshToken = this.generateRefreshToken({
      userId: session.user_id,
      sessionId: payload.sessionId,
      tokenVersion: payload.tokenVersion + 1
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Validate session and return user data
   */
  async validateSession(sessionId: string): Promise<{
    userId: number;
    companyId: number;
    email?: string;
    role: string;
  } | null> {
    const session = await dbGet(`
      SELECT s.*, u.email, u.role, u.company_id
      FROM user_sessions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.session_id = ? AND s.expires_at > CURRENT_TIMESTAMP
    `, [sessionId]);

    if (!session) return null;

    return {
      userId: session.user_id,
      companyId: session.company_id,
      email: session.email,
      role: session.role || 'user'
    };
  }

  /**
   * Invalidate a session (logout)
   */
  async invalidateSession(sessionId: string): Promise<boolean> {
    const result = await dbRun(`
      DELETE FROM user_sessions WHERE session_id = ?
    `, [sessionId]);

    return result.changes > 0;
  }

  /**
   * Invalidate all sessions for a user (logout from all devices)
   */
  async invalidateAllUserSessions(userId: number): Promise<number> {
    const result = await dbRun(`
      DELETE FROM user_sessions WHERE user_id = ?
    `, [userId]);

    return result.changes;
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await dbRun(`
      DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP
    `, []);

    return result.changes;
  }

  /**
   * Extract token from request headers
   */
  extractTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Also check cookies as fallback
    const cookieToken = request.cookies.get('access_token')?.value;
    return cookieToken || null;
  }

  /**
   * Extract refresh token from request
   */
  extractRefreshTokenFromRequest(request: NextRequest): string | null {
    return request.cookies.get('refresh_token')?.value || null;
  }

  /**
   * Generate secure session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

export const jwtManager = new JWTManager();