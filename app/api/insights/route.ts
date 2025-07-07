import { NextRequest, NextResponse } from 'next/server';
import { dbAll, dbGet } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || '30d';
    const userId = searchParams.get('userId');
    
    // Calculate date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    // Build parameterized query for security
    let whereConditions: string[] = [];
    let params: any[] = [];
    
    // Validate and sanitize timeframe
    const allowedTimeframes = ['30d', '90d', 'all'];
    const sanitizedTimeframe = allowedTimeframes.includes(timeframe) ? timeframe : '30d';
    
    switch (sanitizedTimeframe) {
      case '30d':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        whereConditions.push('q.created_at >= ?');
        params.push(thirtyDaysAgo.toISOString());
        break;
      case '90d':
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        whereConditions.push('q.created_at >= ?');
        params.push(ninetyDaysAgo.toISOString());
        break;
      case 'all':
      default:
        // No date filter
        break;
    }
    
    // Validate and sanitize userId
    if (userId) {
      const sanitizedUserId = parseInt(userId);
      if (isNaN(sanitizedUserId) || sanitizedUserId <= 0) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      whereConditions.push('q.company_id = ?');
      params.push(sanitizedUserId);
    }
    
    // Build safe WHERE clause
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    // Get all quotes with parameterized query
    const allQuotes = dbAll(`
      SELECT 
        q.*,
        q.customer_name as client_name,
        q.address as property_address,
        q.company_id as user_id
      FROM quotes q
      ${whereClause}
      ORDER BY q.created_at DESC
    `, params) as any[];
    
    // Calculate metrics
    const totalQuotes = allQuotes.length;
    const acceptedQuotes = allQuotes.filter(q => q.status === 'accepted');
    const winRate = totalQuotes > 0 ? (acceptedQuotes.length / totalQuotes) * 100 : 0;
    
    const totalRevenue = allQuotes.reduce((sum, q) => sum + (q.total_revenue || 0), 0);
    const averageQuoteValue = totalQuotes > 0 ? totalRevenue / totalQuotes : 0;
    
    // This month's metrics
    const thisMonthQuotes = allQuotes.filter(q => 
      new Date(q.created_at) >= startOfMonth
    );
    const quotesThisMonth = thisMonthQuotes.length;
    const revenueThisMonth = thisMonthQuotes.reduce((sum, q) => sum + (q.total_revenue || 0), 0);
    
    // Last month's metrics
    const lastMonthQuotes = allQuotes.filter(q => {
      const quoteDate = new Date(q.created_at);
      return quoteDate >= startOfLastMonth && quoteDate <= endOfLastMonth;
    });
    const quotesLastMonth = lastMonthQuotes.length;
    const revenueLastMonth = lastMonthQuotes.reduce((sum, q) => sum + (q.total_revenue || 0), 0);
    
    // Calculate average margin
    const quotesWithMargin = allQuotes.filter(q => q.markup_percentage != null);
    const averageMargin = quotesWithMargin.length > 0
      ? quotesWithMargin.reduce((sum, q) => sum + (q.markup_percentage || 0), 0) / quotesWithMargin.length
      : 25;
    
    // Top clients
    const clientStats = allQuotes.reduce((acc: any, quote) => {
      const key = quote.client_name;
      if (!acc[key]) {
        acc[key] = { name: key, totalSpent: 0, jobCount: 0 };
      }
      acc[key].totalSpent += quote.total_revenue || 0;
      acc[key].jobCount += 1;
      return acc;
    }, {});
    
    const topClients = Object.values(clientStats)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
    
    // Project type breakdown with safe JSON parsing
    const projectTypes = allQuotes.reduce((acc: any, quote) => {
      let details = {};
      try {
        details = JSON.parse(quote.details || '{}');
      } catch (e) {
        console.warn('Failed to parse quote details:', e);
      }
      const type = (details as any)?.project_type || quote.project_type || 'interior';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const totalProjects = Object.values(projectTypes).reduce((a: any, b: any) => a + b, 0) as number;
    const projectTypeBreakdown = {
      interior: Math.round(((projectTypes.interior || 0) / totalProjects) * 100) || 0,
      exterior: Math.round(((projectTypes.exterior || 0) / totalProjects) * 100) || 0,
      both: Math.round(((projectTypes.both || 0) / totalProjects) * 100) || 0
    };
    
    // Monthly trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthQuotes = allQuotes.filter(q => {
        const quoteDate = new Date(q.created_at);
        return quoteDate >= monthStart && quoteDate <= monthEnd;
      });
      
      monthlyTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthQuotes.reduce((sum, q) => sum + (q.total_revenue || 0), 0),
        quotes: monthQuotes.length
      });
    }
    
    return NextResponse.json({
      totalQuotes,
      totalRevenue,
      averageQuoteValue,
      winRate,
      quotesThisMonth,
      revenueThisMonth,
      quotesLastMonth,
      revenueLastMonth,
      topClients,
      monthlyTrend,
      averageMargin,
      projectTypeBreakdown
    });
    
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json(
      { error: 'Failed to load business metrics' },
      { status: 500 }
    );
  }
}