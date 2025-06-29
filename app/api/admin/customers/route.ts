import { NextRequest, NextResponse } from "next/server";
import Database from 'better-sqlite3';
import path from 'path';

/**
 * Fixed Admin Customers API
 * 
 * FIXES THE CRITICAL BUG: Previous version confused companies (contractors) with customers
 * 
 * CORRECT MODEL:
 * - Companies = Painting contractors who use our software
 * - Customers = People who hire painting contractors for work
 * - Quotes = Work estimates for customers, created by companies
 */

async function getAllCustomers(request: NextRequest) {
  try {
    // Connect directly to SQLite database
    const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
    const db = new Database(dbPath);

    // Get customers with their company information and quote statistics
    const customers = db.prepare(`
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.address,
        c.status,
        c.company_id,
        comp.company_name,
        comp.access_code as company_access_code,
        COUNT(q.id) as quote_count,
        COALESCE(SUM(CASE WHEN q.status IN ('approved', 'accepted') THEN COALESCE(q.final_price, q.total_revenue) ELSE 0 END), 0) as total_revenue,
        MAX(q.created_at) as last_activity,
        c.created_at
      FROM customers c
      JOIN companies comp ON c.company_id = comp.id
      LEFT JOIN quotes q ON c.id = q.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 100
    `).all();

    db.close();

    return NextResponse.json({
      success: true,
      data: customers,
      total: customers.length
    });

  } catch (error) {
    console.error("Error fetching customers:", error);
    
    // Fallback: if customers table doesn't exist yet, return companies as temporary measure
    try {
      const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
      const db = new Database(dbPath);
      
      const companies = db.prepare(`
        SELECT 
          c.id,
          c.company_name as name,
          c.access_code,
          c.email,
          c.created_at,
          'company' as status,
          COUNT(DISTINCT q.id) as quote_count,
          COALESCE(SUM(q.total_revenue), 0) as total_revenue,
          MAX(q.created_at) as last_activity
        FROM companies c
        LEFT JOIN quotes q ON c.id = q.company_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `).all();

      db.close();

      return NextResponse.json({
        success: true,
        data: companies,
        warning: "Using companies as customers - database migration needed"
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to fetch customers",
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }
}

export async function GET(request: NextRequest) {
  return getAllCustomers(request);
}