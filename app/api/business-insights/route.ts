import { NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth-middleware';
import { SubscriptionManager } from '@/lib/subscription-manager';
import { getDatabase } from '@/lib/database/init';

export async function GET(request: Request) {
  try {
    // Get authenticated company
    const authContext = await getAuthContext(request);
    if (!authContext || !authContext.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptionManager = new SubscriptionManager();
    
    // Verify access
    const hasAccess = await subscriptionManager.hasFeatureAccess(
      authContext.companyId, 
      'business_insights'
    );

    const subscription = await subscriptionManager.getCompanySubscription(authContext.companyId);
    const isPaidPlan = subscription && 
      subscription.status === 'active' && 
      !subscription.is_trial &&
      subscription.plan_id !== 'plan_free';

    if (!hasAccess && !isPaidPlan) {
      return NextResponse.json({ error: 'Access denied. Business insights require a paid plan.' }, { status: 403 });
    }

    // Get time range from query params
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'month';
    
    const db = getDatabase();
    const companyId = authContext.companyId;
    
    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }

    // Fetch revenue data
    const revenueData = await db.prepare(`
      SELECT 
        SUM(total_amount) as total_revenue,
        COUNT(*) as quote_count,
        AVG(total_amount) as avg_quote_value,
        SUM(CASE WHEN status = 'accepted' THEN total_amount ELSE 0 END) as accepted_revenue,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_count
      FROM quotes 
      WHERE company_id = ? 
        AND created_at >= datetime(?)
        AND status IN ('sent', 'viewed', 'accepted', 'completed')
    `).get(companyId, startDate.toISOString()) as any;

    // Fetch revenue by service type
    const serviceRevenue = await db.prepare(`
      SELECT 
        SUM(CASE WHEN quote_data LIKE '%interior%' THEN total_amount ELSE 0 END) as interior,
        SUM(CASE WHEN quote_data LIKE '%exterior%' THEN total_amount ELSE 0 END) as exterior,
        SUM(CASE WHEN quote_data LIKE '%commercial%' THEN total_amount ELSE 0 END) as commercial
      FROM quotes 
      WHERE company_id = ? 
        AND created_at >= datetime(?)
        AND status IN ('accepted', 'completed')
    `).get(companyId, startDate.toISOString()) as any;

    // Fetch customer analytics
    const customerStats = await db.prepare(`
      SELECT 
        COUNT(DISTINCT customer_email) as unique_customers,
        COUNT(*) as total_quotes,
        AVG(total_amount) as avg_transaction
      FROM quotes 
      WHERE company_id = ? 
        AND created_at >= datetime(?)
        AND status IN ('accepted', 'completed')
    `).get(companyId, startDate.toISOString()) as any;

    // Fetch top customers
    const topCustomers = await db.all(`
      SELECT 
        customer_name as name,
        COUNT(*) as projects,
        SUM(total_amount) as revenue
      FROM quotes 
      WHERE company_id = ? 
        AND created_at >= datetime(?)
        AND status IN ('accepted', 'completed')
        AND customer_name IS NOT NULL
      GROUP BY customer_email
      ORDER BY revenue DESC
      LIMIT 5
    `, companyId, startDate.toISOString());

    // Calculate performance metrics
    const conversionRate = revenueData.quote_count > 0 
      ? Math.round((revenueData.accepted_count / revenueData.quote_count) * 100)
      : 0;

    // Generate seasonal trends (mock data for now - in production, this would be real historical data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = now.getMonth();
    const seasonalTrends = [];
    
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i + 12) % 12;
      seasonalTrends.push({
        month: months[monthIndex],
        revenue: Math.round(Math.random() * 50000 + 30000),
        projects: Math.round(Math.random() * 20 + 10)
      });
    }

    // Mock some additional metrics (in production, these would be calculated from real data)
    const insights = {
      revenue: {
        recurring: revenueData.total_revenue * 0.7 || 0,
        oneTime: revenueData.total_revenue * 0.3 || 0,
        projected: revenueData.total_revenue * 1.15 || 0,
        growth: Math.random() * 20 - 5, // -5% to +15%
        byService: {
          interior: serviceRevenue?.interior || 0,
          exterior: serviceRevenue?.exterior || 0,
          commercial: serviceRevenue?.commercial || 0
        }
      },
      profitability: {
        grossMargin: 65,
        netMargin: 22,
        laborCostRatio: 35,
        materialCostRatio: 20,
        overheadRatio: 23
      },
      customerAnalytics: {
        lifetime: 4500,
        acquisition: 250,
        churnRate: 12,
        topCustomers: topCustomers || []
      },
      performance: {
        leadConversion: 35,
        quoteToJobRatio: conversionRate,
        averageProjectSize: revenueData.avg_quote_value || 0,
        completionTime: 3.5,
        employeeUtilization: 78
      },
      forecasting: {
        nextQuarter: revenueData.total_revenue * 1.1 || 0,
        seasonalTrends,
        opportunityPipeline: revenueData.total_revenue * 0.8 || 0
      }
    };

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching business insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}