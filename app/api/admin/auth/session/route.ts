import { NextRequest, NextResponse } from "next/server";
import { dbGet } from "@/lib/database";
import jwt from "jsonwebtoken";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_key_development';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(sessionToken, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Check if session exists in database and is not expired
    const session: any = dbGet(`
      SELECT s.*, u.email, u.full_name, u.role, u.is_active
      FROM admin_sessions s
      JOIN admin_users u ON s.admin_user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
    `, [sessionToken]);

    if (!session) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: session.admin_user_id,
        email: session.email,
        full_name: session.full_name,
        role: session.role
      }
    });

  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}