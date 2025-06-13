import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";
import jwt from "jsonwebtoken";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_key_development';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (sessionToken) {
      // Get admin user ID for logging
      let adminUserId = 'unknown';
      try {
        const decoded: any = jwt.verify(sessionToken, JWT_SECRET);
        adminUserId = decoded.adminId;
      } catch (error) {
        // Token may be invalid, but we still want to clean up
      }

      // Remove session from database
      dbRun(`
        DELETE FROM admin_sessions 
        WHERE session_token = ?
      `, [sessionToken]);

      // Log logout
      dbRun(`
        INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
        VALUES (?, 'logout', ?, ?)
      `, [
        adminUserId,
        JSON.stringify({ success: true }),
        request.headers.get('x-forwarded-for') || 'unknown'
      ]);
    }

    // Clear cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expire immediately
    });

    return response;

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}