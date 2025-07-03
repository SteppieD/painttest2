import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Get JWT secret with build-time vs runtime detection
function getJWTSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  
  if (secret) {
    return secret;
  }
  
  // Allow development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'dev_admin_secret_change_in_production';
  }
  
  // In production, only throw error at runtime, not build time
  // Check if we're in a build context by looking for typical build-time conditions
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                     process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  
  if (!isBuildTime) {
    throw new Error('ADMIN_JWT_SECRET environment variable is required in production');
  }
  
  // Return a placeholder during build - this route won't actually execute during build
  return 'build_time_placeholder';
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find admin user
    const adminUser: any = dbGet(`
      SELECT id, email, password_hash, role, full_name, is_active
      FROM admin_users 
      WHERE email = ? AND is_active = 1
    `, [email]);

    if (!adminUser) {
      // Log failed login attempt
      dbRun(`
        INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
        VALUES (?, 'failed_login', ?, ?)
      `, [
        'unknown',
        JSON.stringify({ email, reason: 'user_not_found' }),
        request.headers.get('x-forwarded-for') || 'unknown'
      ]);

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Validate password using bcrypt hash
    const isValidPassword = adminUser.password_hash && 
      await bcrypt.compare(password, adminUser.password_hash);

    if (!isValidPassword) {
      // Log failed login attempt
      dbRun(`
        INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
        VALUES (?, 'failed_login', ?, ?)
      `, [
        adminUser.id,
        JSON.stringify({ reason: 'invalid_password' }),
        request.headers.get('x-forwarded-for') || 'unknown'
      ]);

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = jwt.sign(
      { 
        adminId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      },
      getJWTSecret(),
      { expiresIn: '24h' }
    );

    // Store session in database
    dbRun(`
      INSERT INTO admin_sessions (admin_user_id, session_token, expires_at)
      VALUES (?, ?, datetime('now', '+24 hours'))
    `, [adminUser.id, sessionToken]);

    // Update last login
    dbRun(`
      UPDATE admin_users 
      SET last_login_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [adminUser.id]);

    // Log successful login
    dbRun(`
      INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
      VALUES (?, 'login', ?, ?)
    `, [
      adminUser.id,
      JSON.stringify({ success: true }),
      request.headers.get('x-forwarded-for') || 'unknown'
    ]);

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role
      }
    });

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return response;

  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}