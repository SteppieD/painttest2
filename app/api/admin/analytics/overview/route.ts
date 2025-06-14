import { NextRequest, NextResponse } from "next/server";
import { dbGet } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    // Get total customers
    const customerStats: any = dbGet(`
      SELECT 
        COUNT(*) as total_customers,
        SUM(CASE WHEN created_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END) as active_customers
      FROM companies
    `);

    // Get quote statistics
    const quoteStats: any = dbGet(`
      SELECT 
        COUNT(*) as total_quotes,
        SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as quotes_today,
        COALESCE(SUM(total_revenue), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN DATE(created_at) >= DATE('now', 'start of month') THEN total_revenue ELSE 0 END), 0) as revenue_this_month
      FROM quotes
    `);

    console.log('Quote stats:', quoteStats);

    // Get access code statistics
    const accessCodeStats: any = dbGet(`
      SELECT 
        COUNT(*) as total_access_codes,
        SUM(CASE WHEN created_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END) as active_access_codes
      FROM companies
    `);

    // Combine all statistics
    const dashboardStats = {
      totalCustomers: customerStats?.total_customers || 0,
      activeCustomers: customerStats?.active_customers || 0,
      totalQuotes: quoteStats?.total_quotes || 0,
      quotesToday: quoteStats?.quotes_today || 0,
      totalRevenue: quoteStats?.total_revenue || 0,
      revenueThisMonth: quoteStats?.revenue_this_month || 0,
      totalAccessCodes: accessCodeStats?.total_access_codes || 0,
      activeAccessCodes: accessCodeStats?.active_access_codes || 0
    };

    return NextResponse.json(dashboardStats);

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}