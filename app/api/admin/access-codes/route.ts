export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbAll, dbRun } from "@/lib/database";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_key_development';

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;
    if (!sessionToken) {
      return null;
    }

    // Verify JWT token
    const decoded: any = jwt.verify(sessionToken, JWT_SECRET);
    
    // Check if session exists in database
    const session: any = dbGet(`
      SELECT s.*, u.email, u.full_name, u.role, u.is_active
      FROM admin_sessions s
      JOIN admin_users u ON s.admin_user_id = u.id
      WHERE s.session_token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
    `, [sessionToken]);

    return session;
  } catch (error) {
    return null;
  }
}

// GET - List all access codes/companies
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all companies with their statistics
    const companies = dbAll(`
      SELECT 
        c.*,
        COUNT(q.id) as quote_count,
        COALESCE(SUM(q.final_price), 0) as total_revenue,
        MAX(q.created_at) as last_quote_date,
        COUNT(CASE WHEN q.status = 'pending' THEN 1 END) as pending_quotes,
        COUNT(CASE WHEN q.status = 'accepted' THEN 1 END) as accepted_quotes
      FROM companies c
      LEFT JOIN quotes q ON c.id = q.company_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json({ companies });

  } catch (error) {
    console.error("Error fetching access codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch access codes" },
      { status: 500 }
    );
  }
}

// POST - Create new access code/company
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accessCode, companyName, phone, email } = await request.json();

    // Validate input
    if (!accessCode || !companyName) {
      return NextResponse.json(
        { error: "Access code and company name are required" },
        { status: 400 }
      );
    }

    // Check if access code already exists
    const existingCompany = await dbGet(`
      SELECT id FROM companies WHERE access_code = ?
    `, [accessCode.toUpperCase()]);

    if (existingCompany) {
      return NextResponse.json(
        { error: "Access code already exists" },
        { status: 409 }
      );
    }

    // Create new company
    const result = await dbRun(`
      INSERT INTO companies (access_code, company_name, phone, email, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [accessCode.toUpperCase(), companyName, phone || null, email || null]);

    // Log admin activity
    await dbRun(`
      INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
      VALUES (?, 'create_access_code', ?, ?)
    `, [
      admin.admin_user_id,
      JSON.stringify({ accessCode: accessCode.toUpperCase(), companyName }),
      request.headers.get('x-forwarded-for') || 'unknown'
    ]);

    return NextResponse.json({
      success: true,
      company: {
        id: result.lastID,
        access_code: accessCode.toUpperCase(),
        company_name: companyName,
        phone,
        email
      }
    });

  } catch (error) {
    console.error("Error creating access code:", error);
    return NextResponse.json(
      { error: "Failed to create access code" },
      { status: 500 }
    );
  }
}

// DELETE - Remove access code/company
export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('id');

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Get company info before deletion for logging
    const company: any = dbGet(`
      SELECT access_code, company_name FROM companies WHERE id = ?
    `, [companyId]);

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Delete associated quotes first (due to foreign key constraint)
    dbRun(`DELETE FROM quotes WHERE company_id = ?`, [companyId]);
    
    // Delete the company
    dbRun(`DELETE FROM companies WHERE id = ?`, [companyId]);

    // Log admin activity
    dbRun(`
      INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
      VALUES (?, 'delete_access_code', ?, ?)
    `, [
      admin.admin_user_id,
      JSON.stringify({ companyId, accessCode: company.access_code, companyName: company.company_name }),
      request.headers.get('x-forwarded-for') || 'unknown'
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting access code:", error);
    return NextResponse.json(
      { error: "Failed to delete access code" },
      { status: 500 }
    );
  }
}