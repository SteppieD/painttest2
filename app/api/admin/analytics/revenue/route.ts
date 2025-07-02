import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    
    const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
    const db = new Database(dbPath);

    // Calculate date range based on timeframe
    const now = new Date();
    const timeframeDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      'all': 3650 // 10 years as "all time"
    };
    
    const daysBack = timeframeDays[timeframe as keyof typeof timeframeDays] || 30;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get total revenue
    const totalRevenueQuery = db.prepare(`
      SELECT 
        COALESCE(SUM(CAST(total_price AS REAL)), 0) as total_revenue,
        COUNT(*) as total_quotes,
        COALESCE(AVG(CAST(total_price AS REAL)), 0) as avg_quote_value
      FROM quotes 
      WHERE created_at >= ?
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
    `);
    
    const totalRevenue = totalRevenueQuery.get(startDateStr) as any;

    // Get monthly, weekly, daily revenue
    const monthlyRevenueQuery = db.prepare(`
      SELECT COALESCE(SUM(CAST(total_price AS REAL)), 0) as monthly_revenue
      FROM quotes 
      WHERE created_at >= date('now', '-30 days')
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
    `);
    
    const weeklyRevenueQuery = db.prepare(`
      SELECT COALESCE(SUM(CAST(total_price AS REAL)), 0) as weekly_revenue
      FROM quotes 
      WHERE created_at >= date('now', '-7 days')
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
    `);
    
    const dailyRevenueQuery = db.prepare(`
      SELECT COALESCE(AVG(CAST(total_price AS REAL)), 0) as daily_revenue
      FROM quotes 
      WHERE created_at >= date('now', '-1 day')
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
    `);

    const monthlyRevenue = monthlyRevenueQuery.get() as any;
    const weeklyRevenue = weeklyRevenueQuery.get() as any;
    const dailyRevenue = dailyRevenueQuery.get() as any;

    // Get quote status breakdown
    const quoteStatusQuery = db.prepare(`
      SELECT 
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_quotes,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_quotes,
        COUNT(*) as total_quotes
      FROM quotes 
      WHERE created_at >= ?
    `);
    
    const quoteStatus = quoteStatusQuery.get(startDateStr) as any;
    const conversionRate = quoteStatus.total_quotes > 0 
      ? (quoteStatus.accepted_quotes / quoteStatus.total_quotes) * 100 
      : 0;

    // Get revenue growth (compare with previous period)
    const previousStartDate = new Date(startDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const previousStartDateStr = previousStartDate.toISOString().split('T')[0];
    const previousEndDateStr = startDate.toISOString().split('T')[0];
    
    const previousRevenueQuery = db.prepare(`
      SELECT COALESCE(SUM(CAST(total_price AS REAL)), 0) as previous_revenue
      FROM quotes 
      WHERE created_at >= ? AND created_at < ?
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
    `);
    
    const previousRevenue = previousRevenueQuery.get(previousStartDateStr, previousEndDateStr) as any;
    const monthlyGrowth = previousRevenue.previous_revenue > 0 
      ? ((totalRevenue.total_revenue - previousRevenue.previous_revenue) / previousRevenue.previous_revenue) * 100 
      : 0;

    // Get monthly breakdown
    const monthlyBreakdownQuery = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COALESCE(SUM(CAST(total_price AS REAL)), 0) as revenue,
        COUNT(*) as quotes,
        COALESCE(AVG(CAST(total_price AS REAL)), 0) as avg_value
      FROM quotes 
      WHERE created_at >= ?
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month DESC
      LIMIT 6
    `);
    
    const monthlyBreakdown = monthlyBreakdownQuery.all(startDateStr) as any[];

    // Get project type revenue
    const projectTypeQuery = db.prepare(`
      SELECT 
        project_type,
        COALESCE(SUM(CAST(total_price AS REAL)), 0) as revenue
      FROM quotes 
      WHERE created_at >= ?
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
      GROUP BY project_type
    `);
    
    const projectTypeData = projectTypeQuery.all(startDateStr) as any[];
    const projectTypeRevenue = {
      interior: 0,
      exterior: 0,
      both: 0
    };
    
    projectTypeData.forEach(item => {
      if (item.project_type in projectTypeRevenue) {
        projectTypeRevenue[item.project_type as keyof typeof projectTypeRevenue] = item.revenue;
      }
    });

    // Get top customers
    const topCustomersQuery = db.prepare(`
      SELECT 
        customer_name as company_name,
        COALESCE(SUM(CAST(total_price AS REAL)), 0) as revenue,
        COUNT(*) as quotes
      FROM quotes 
      WHERE created_at >= ?
      AND total_price IS NOT NULL 
      AND total_price != 'NaN'
      AND total_price != ''
      GROUP BY customer_name
      ORDER BY revenue DESC
      LIMIT 5
    `);
    
    const topCustomers = topCustomersQuery.all(startDateStr) as any[];

    const metrics = {
      totalRevenue: totalRevenue.total_revenue || 0,
      monthlyRevenue: monthlyRevenue.monthly_revenue || 0,
      weeklyRevenue: weeklyRevenue.weekly_revenue || 0,
      dailyRevenue: dailyRevenue.daily_revenue || 0,
      avgQuoteValue: totalRevenue.avg_quote_value || 0,
      totalQuotes: totalRevenue.total_quotes || 0,
      acceptedQuotes: quoteStatus.accepted_quotes || 0,
      pendingQuotes: quoteStatus.pending_quotes || 0,
      conversionRate: conversionRate,
      revenueGrowth: {
        monthly: monthlyGrowth,
        weekly: 0, // Could calculate if needed
        daily: 0   // Could calculate if needed
      },
      monthlyBreakdown: monthlyBreakdown.map(item => ({
        month: item.month,
        revenue: item.revenue,
        quotes: item.quotes,
        avgValue: item.avg_value
      })),
      projectTypeRevenue,
      topCustomers: topCustomers.map(customer => ({
        company_name: customer.company_name || 'Unknown',
        revenue: customer.revenue,
        quotes: customer.quotes
      }))
    };

    db.close();

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Error in revenue analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to load revenue analytics' },
      { status: 500 }
    );
  }
}