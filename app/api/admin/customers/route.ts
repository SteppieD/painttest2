import { NextRequest, NextResponse } from "next/server";
import { dbAll } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Get all customers with their quote statistics
    const customers = dbAll(`
      SELECT 
        c.id,
        c.company_name as name,
        c.access_code,
        c.email,
        c.created_at,
        'active' as status,
        COUNT(DISTINCT q.id) as quote_count,
        COALESCE(SUM(q.total_revenue), 0) as total_revenue,
        MAX(q.created_at) as last_activity
      FROM companies c
      LEFT JOIN quotes q ON c.id = q.company_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json(customers);

  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}