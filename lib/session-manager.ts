/**
 * Secure Session Management
 * 
 * Handles session creation, validation, and cleanup with security best practices
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';

export interface SessionData {
  sessionId: string;
  companyId: number;
  accessCode: string;
  userAgent: string;
  ipAddress: string;
  createdAt: number;
  lastActivity: number;
  expiresAt: number;
}

export interface SessionOptions {
  maxAge?: number; // Session duration in seconds
  secure?: boolean; // HTTPS only
  httpOnly?: boolean; // No JavaScript access
  sameSite?: 'strict' | 'lax' | 'none';
}

export class SessionManager {
  private static readonly SESSION_COOKIE_NAME = 'paint-session';
  private static readonly MAX_SESSIONS_PER_COMPANY = 5;
  private static readonly SESSION_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

  // In-memory session store (use Redis in production)
  private static sessions = new Map<string, SessionData>();
  private static cleanupInterval: NodeJS.Timeout;

  static {
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, this.SESSION_CLEANUP_INTERVAL);
  }

  /**
   * Create a new session
   */
  static async createSession(
    companyId: number,
    accessCode: string,
    request: NextRequest,
    options: SessionOptions = {}
  ): Promise<{
    success: boolean;
    sessionId?: string;
    cookie?: string;
    error?: string;
  }> {
    try {
      const {
        maxAge = 24 * 60 * 60, // 24 hours
        secure = process.env.NODE_ENV === 'production',
        httpOnly = true,
        sameSite = 'strict'
      } = options;

      // Generate secure session ID
      const sessionId = this.generateSessionId();
      
      // Get client info
      const userAgent = request.headers.get('user-agent') || '';
      const ipAddress = this.getClientIP(request);

      // Check session limits per company
      const existingSessions = Array.from(this.sessions.values())
        .filter(s => s.companyId === companyId && s.expiresAt > Date.now());

      if (existingSessions.length >= this.MAX_SESSIONS_PER_COMPANY) {
        // Remove oldest session
        const oldestSession = existingSessions.sort((a, b) => a.createdAt - b.createdAt)[0];
        this.sessions.delete(oldestSession.sessionId);
      }

      // Create session data
      const now = Date.now();
      const sessionData: SessionData = {
        sessionId,
        companyId,
        accessCode,
        userAgent: this.hashUserAgent(userAgent),
        ipAddress: this.hashIP(ipAddress),
        createdAt: now,
        lastActivity: now,
        expiresAt: now + (maxAge * 1000)
      };

      // Store session
      this.sessions.set(sessionId, sessionData);

      // Create JWT token
      const token = jwt.sign(
        {
          sessionId,
          companyId,
          accessCode,
          iat: Math.floor(now / 1000),
          exp: Math.floor(sessionData.expiresAt / 1000)
        },
        this.getJWTSecret()
      );

      // Create cookie string
      const cookieOptions = [
        `${this.SESSION_COOKIE_NAME}=${token}`,
        `Max-Age=${maxAge}`,
        `Path=/`,
        httpOnly ? 'HttpOnly' : '',
        secure ? 'Secure' : '',
        `SameSite=${sameSite}`
      ].filter(Boolean).join('; ');

      return {
        success: true,
        sessionId,
        cookie: cookieOptions
      };

    } catch (error) {
      console.error('Session creation error:', error);
      return {
        success: false,
        error: 'Failed to create session'
      };
    }
  }

  /**
   * Validate and refresh session
   */
  static async validateSession(request: NextRequest): Promise<{
    valid: boolean;
    sessionData?: SessionData;
    error?: string;
    shouldRefresh?: boolean;
  }> {
    try {
      const sessionCookie = request.cookies.get(this.SESSION_COOKIE_NAME)?.value;
      
      if (!sessionCookie) {
        return {
          valid: false,
          error: 'No session cookie found'
        };
      }

      // Verify JWT
      let tokenData: any;
      try {
        tokenData = jwt.verify(sessionCookie, this.getJWTSecret());
      } catch (jwtError) {
        return {
          valid: false,
          error: 'Invalid session token'
        };
      }

      const sessionId = tokenData.sessionId;
      const sessionData = this.sessions.get(sessionId);

      if (!sessionData) {
        return {
          valid: false,
          error: 'Session not found'
        };
      }

      // Check expiration
      if (sessionData.expiresAt <= Date.now()) {
        this.sessions.delete(sessionId);
        return {
          valid: false,
          error: 'Session expired'
        };
      }

      // Validate client info for security
      const currentUserAgent = this.hashUserAgent(request.headers.get('user-agent') || '');
      const currentIP = this.hashIP(this.getClientIP(request));

      if (sessionData.userAgent !== currentUserAgent) {
        this.sessions.delete(sessionId);
        return {
          valid: false,
          error: 'Session security validation failed'
        };
      }

      // Check if session should be refreshed (if less than 25% time remaining)
      const timeRemaining = sessionData.expiresAt - Date.now();
      const totalDuration = sessionData.expiresAt - sessionData.createdAt;
      const shouldRefresh = timeRemaining < (totalDuration * 0.25);

      // Update last activity
      sessionData.lastActivity = Date.now();
      this.sessions.set(sessionId, sessionData);

      return {
        valid: true,
        sessionData,
        shouldRefresh
      };

    } catch (error) {
      console.error('Session validation error:', error);
      return {
        valid: false,
        error: 'Session validation failed'
      };
    }
  }

  /**
   * Refresh session expiration
   */
  static async refreshSession(
    sessionId: string,
    options: SessionOptions = {}
  ): Promise<{
    success: boolean;
    cookie?: string;
    error?: string;
  }> {
    try {
      const sessionData = this.sessions.get(sessionId);
      
      if (!sessionData) {
        return {
          success: false,
          error: 'Session not found'
        };
      }

      const { maxAge = 24 * 60 * 60 } = options;
      const now = Date.now();

      // Update expiration
      sessionData.expiresAt = now + (maxAge * 1000);
      sessionData.lastActivity = now;
      this.sessions.set(sessionId, sessionData);

      // Create new JWT
      const token = jwt.sign(
        {
          sessionId: sessionData.sessionId,
          companyId: sessionData.companyId,
          accessCode: sessionData.accessCode,
          iat: Math.floor(now / 1000),
          exp: Math.floor(sessionData.expiresAt / 1000)
        },
        this.getJWTSecret()
      );

      // Create cookie
      const cookieOptions = [
        `${this.SESSION_COOKIE_NAME}=${token}`,
        `Max-Age=${maxAge}`,
        `Path=/`,
        'HttpOnly',
        process.env.NODE_ENV === 'production' ? 'Secure' : '',
        'SameSite=strict'
      ].filter(Boolean).join('; ');

      return {
        success: true,
        cookie: cookieOptions
      };

    } catch (error) {
      console.error('Session refresh error:', error);
      return {
        success: false,
        error: 'Failed to refresh session'
      };
    }
  }

  /**
   * Destroy session
   */
  static async destroySession(sessionId: string): Promise<{
    success: boolean;
    cookie?: string;
    error?: string;
  }> {
    try {
      this.sessions.delete(sessionId);

      // Create expired cookie
      const expiredCookie = [
        `${this.SESSION_COOKIE_NAME}=`,
        'Max-Age=0',
        'Path=/',
        'HttpOnly',
        process.env.NODE_ENV === 'production' ? 'Secure' : '',
        'SameSite=strict'
      ].filter(Boolean).join('; ');

      return {
        success: true,
        cookie: expiredCookie
      };

    } catch (error) {
      console.error('Session destruction error:', error);
      return {
        success: false,
        error: 'Failed to destroy session'
      };
    }
  }

  /**
   * Destroy all sessions for a company
   */
  static async destroyCompanySessions(companyId: number): Promise<number> {
    let destroyedCount = 0;

    for (const [sessionId, sessionData] of this.sessions.entries()) {
      if (sessionData.companyId === companyId) {
        this.sessions.delete(sessionId);
        destroyedCount++;
      }
    }

    return destroyedCount;
  }

  /**
   * Get active sessions for a company
   */
  static getActiveSessionsForCompany(companyId: number): SessionData[] {
    const now = Date.now();
    return Array.from(this.sessions.values())
      .filter(s => s.companyId === companyId && s.expiresAt > now)
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }

  /**
   * Get session statistics
   */
  static getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    sessionsByCompany: Record<number, number>;
  } {
    const now = Date.now();
    const sessions = Array.from(this.sessions.values());
    const activeSessions = sessions.filter(s => s.expiresAt > now);
    const expiredSessions = sessions.filter(s => s.expiresAt <= now);

    const sessionsByCompany: Record<number, number> = {};
    for (const session of activeSessions) {
      sessionsByCompany[session.companyId] = (sessionsByCompany[session.companyId] || 0) + 1;
    }

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      expiredSessions: expiredSessions.length,
      sessionsByCompany
    };
  }

  /**
   * Cleanup expired sessions
   */
  private static cleanupExpiredSessions(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [sessionId, sessionData] of this.sessions.entries()) {
      if (sessionData.expiresAt <= now) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  /**
   * Generate secure session ID
   */
  private static generateSessionId(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Get JWT secret from environment
   */
  private static getJWTSecret(): string {
    return process.env.JWT_SECRET || 'fallback-secret-change-in-production';
  }

  /**
   * Get client IP address
   */
  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }

    return request.ip || 'unknown';
  }

  /**
   * Hash user agent for security comparison
   */
  private static hashUserAgent(userAgent: string): string {
    return createHash('sha256').update(userAgent).digest('hex');
  }

  /**
   * Hash IP address for security comparison
   */
  private static hashIP(ip: string): string {
    return createHash('sha256').update(ip).digest('hex');
  }

  /**
   * Middleware for Next.js API routes
   */
  static middleware() {
    return async (request: NextRequest) => {
      const validation = await this.validateSession(request);
      
      if (!validation.valid) {
        return NextResponse.json({
          success: false,
          error: validation.error
        }, { status: 401 });
      }

      // Add session data to request headers for API routes
      const response = NextResponse.next();
      response.headers.set('x-session-company-id', validation.sessionData!.companyId.toString());
      response.headers.set('x-session-id', validation.sessionData!.sessionId);

      // Refresh session if needed
      if (validation.shouldRefresh) {
        const refreshResult = await this.refreshSession(validation.sessionData!.sessionId);
        if (refreshResult.success && refreshResult.cookie) {
          response.headers.set('Set-Cookie', refreshResult.cookie);
        }
      }

      return response;
    };
  }

  /**
   * Cleanup on shutdown
   */
  static destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.sessions.clear();
  }
}