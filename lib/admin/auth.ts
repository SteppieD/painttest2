import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { dbGet } from '@/lib/database';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_key_development';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: number;
}

interface AuthResult {
  valid: boolean;
  user?: AdminUser;
  error?: string;
}

export async function verifyAdminAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('admin_session')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return { valid: false, error: 'No authentication token provided' };
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (jwtError) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    if (!decoded.adminId) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Check if session exists in database
    const session = dbGet(`
      SELECT s.*, u.id, u.email, u.full_name, u.role, u.is_active
      FROM admin_sessions s
      JOIN admin_users u ON s.admin_user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
    `, [token]);

    if (!session) {
      return { valid: false, error: 'Session not found or expired' };
    }

    const user: AdminUser = {
      id: session.id,
      email: session.email,
      full_name: session.full_name,
      role: session.role,
      is_active: session.is_active
    };

    return { valid: true, user };

  } catch (error) {
    console.error('Auth verification error:', error);
    return { valid: false, error: 'Authentication error' };
  }
}

export async function requireAdminAuth(request: NextRequest): Promise<AdminUser> {
  const authResult = await verifyAdminAuth(request);
  
  if (!authResult.valid || !authResult.user) {
    throw new Error('Unauthorized');
  }
  
  return authResult.user;
}