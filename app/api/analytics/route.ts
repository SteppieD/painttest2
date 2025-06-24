import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbAll } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    const timeRange = searchParams.get('time_range') || 'month';
    const metric = searchParams.get('metric') || 'overview';

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    console.log(`🔍 Analytics API: Loading ${metric} data for company ${companyId}, timeRange: ${timeRange}`);

    // Calculate date ranges
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    
    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        previousStartDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        previousStartDate = new Date(startDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    }

    // Base query for quotes with enhanced company data
    const baseQuery = `
      SELECT 
        q.*,
        c.company_name,
        c.phone as company_phone,
        c.email as company_email,
        c.logo_url as company_logo_url,
        cp.company_address,
        cp.license_number,
        cp.insurance_info,
        cp.company_website,
        cp.quote_header_text,
        cp.quote_footer_text,
        cp.payment_terms as default_payment_terms
      FROM quotes q
      LEFT JOIN companies c ON q.company_id = c.id
      LEFT JOIN company_profiles cp ON cp.user_id = c.id
      WHERE q.company_id = ?
    `;

    switch (metric) {
      case 'revenue':
        return handleRevenueAnalytics(companyId, baseQuery, startDate, previousStartDate);
      
      case 'projects':
        return handleProjectAnalytics(companyId, baseQuery, startDate, previousStartDate);
      
      case 'customers':
        return handleCustomerAnalytics(companyId, baseQuery, startDate, previousStartDate);
      
      case 'operations':
        return handleOperationalAnalytics(companyId, baseQuery, startDate, previousStartDate);
      
      case 'forecasting':
        return handleForecastingAnalytics(companyId, baseQuery, startDate, previousStartDate);
      
      case 'costs':
        return handleCostAnalytics(companyId, baseQuery, startDate, previousStartDate);
      
      case 'competitive':
        return handleCompetitiveAnalytics(companyId, baseQuery, startDate, previousStartDate);
      
      default: // overview
        return handleOverviewAnalytics(companyId, baseQuery, startDate, previousStartDate);
    }

  } catch (error) {
    console.error("Error in analytics API:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

async function handleOverviewAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  // Get current period quotes
  const currentQuotes: any[] = await dbAll(`
    ${baseQuery} AND q.created_at >= ?
  `, [companyId, startDate.toISOString()]);

  // Get previous period quotes for comparison
  const previousQuotes: any[] = await dbAll(`
    ${baseQuery} AND q.created_at >= ? AND q.created_at < ?
  `, [companyId, previousStartDate.toISOString(), startDate.toISOString()]);

  // Get all quotes for lifetime metrics
  const allQuotes: any[] = await dbAll(baseQuery, [companyId]);

  const currentRevenue = currentQuotes.reduce((sum, q) => sum + (q.total_revenue || q.quote_amount || q.final_price || 0), 0);
  const previousRevenue = previousQuotes.reduce((sum, q) => sum + (q.total_revenue || q.quote_amount || q.final_price || 0), 0);
  const totalRevenue = allQuotes.reduce((sum, q) => sum + (q.total_revenue || q.quote_amount || q.final_price || 0), 0);

  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const acceptedQuotes = allQuotes.filter(q => q.status === 'accepted').length;
  const conversionRate = allQuotes.length > 0 ? (acceptedQuotes / allQuotes.length) * 100 : 0;
  const averageQuote = allQuotes.length > 0 ? totalRevenue / allQuotes.length : 0;
  const pendingQuotes = allQuotes.filter(q => !q.status || q.status === 'pending').length;

  // Customer metrics
  const uniqueCustomers = new Set(allQuotes.map(q => q.customer_email || q.customer_name)).size;
  const activeCustomers = currentQuotes.length;

  return NextResponse.json({
    revenue: {
      total: totalRevenue,
      current: currentRevenue,
      previous: previousRevenue,
      growth: revenueGrowth,
      target: currentRevenue * 1.15,
      velocity: 12 // mock data - days to convert
    },
    operations: {
      totalQuotes: allQuotes.length,
      conversionRate,
      averageQuote,
      pendingQuotes,
      responseTime: 4.2, // mock data
      projectsActive: acceptedQuotes
    },
    customers: {
      totalCustomers: uniqueCustomers,
      activeCustomers,
      satisfactionScore: 4.7, // mock data
      retentionRate: 85, // mock data
      lifetimeValue: averageQuote * 2.3,
      churnRisk: 12 // mock data
    },
    efficiency: {
      profitMargin: 35, // mock data
      materialWaste: 8, // mock data
      laborEfficiency: 92, // mock data
      equipmentUtilization: 78, // mock data
      scheduleOptimization: 89, // mock data
      qualityScore: 96 // mock data
    },
    alerts: generateAlerts(currentRevenue, previousRevenue, conversionRate, pendingQuotes)
  });
}

async function handleRevenueAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  const quotes: any[] = await dbAll(baseQuery, [companyId]);
  
  // Revenue breakdown by project type (mock data - would need project_type field)
  const totalRevenue = quotes.reduce((sum, q) => sum + (q.total_revenue || q.quote_amount || q.final_price || 0), 0);
  
  // Timeline data (last 6 months)
  const timeline = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthQuotes = quotes.filter(q => {
      const date = new Date(q.created_at);
      return date >= monthStart && date <= monthEnd;
    });

    const monthRevenue = monthQuotes.reduce((sum, q) => sum + (q.total_revenue || q.quote_amount || q.final_price || 0), 0);
    const accepted = monthQuotes.filter(q => q.status === 'accepted').length;
    const conversion = monthQuotes.length > 0 ? (accepted / monthQuotes.length) * 100 : 0;

    timeline.push({
      period: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: monthRevenue,
      quotes: monthQuotes.length,
      conversion
    });
  }

  return NextResponse.json({
    currentPeriod: {
      total: quotes.filter(q => new Date(q.created_at) >= startDate).reduce((sum, q) => sum + (q.total_revenue || q.quote_amount || q.final_price || 0), 0),
      growth: 12.5, // mock calculation
      target: totalRevenue * 1.2,
      projected: totalRevenue * 1.15
    },
    breakdown: {
      residential: totalRevenue * 0.7,
      commercial: totalRevenue * 0.2,
      maintenance: totalRevenue * 0.08,
      newConstruction: totalRevenue * 0.02
    },
    timeline,
    seasonal: generateSeasonalData(totalRevenue),
    forecasting: {
      nextMonth: totalRevenue * 0.15,
      nextQuarter: totalRevenue * 0.4,
      confidence: 85,
      factors: [
        "Spring seasonal uptick",
        "3 large commercial projects in pipeline",
        "Increased marketing spend",
        "Historical growth pattern"
      ]
    },
    opportunities: [
      {
        id: 'commercial-expansion',
        title: 'Commercial Market Expansion',
        potential: 45000,
        probability: 75,
        timeline: '3-6 months'
      },
      {
        id: 'premium-services',
        title: 'Premium Service Line',
        potential: 28000,
        probability: 60,
        timeline: '2-4 months'
      }
    ]
  });
}

async function handleProjectAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  const quotes: any[] = await dbAll(baseQuery, [companyId]);
  
  // Convert quotes to project performance data
  const projects = quotes.map((quote, index) => {
    const revenue = quote.total_revenue || quote.quote_amount || quote.final_price || 0;
    const sqft = (quote.walls_sqft || 0) + (quote.ceilings_sqft || 0) + (quote.trim_sqft || 0) || 1000;
    
    // Estimate costs based on industry standards
    const materials = revenue * 0.35;
    const labor = revenue * 0.30;
    const overhead = revenue * 0.15;
    const profit = revenue - materials - labor - overhead;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      id: quote.quote_id || `project-${index}`,
      customerName: quote.customer_name || 'Unknown Customer',
      projectType: quote.project_type || 'residential',
      revenue,
      costs: { materials, labor, overhead },
      profit,
      margin,
      duration: Math.floor(Math.random() * 14) + 3,
      efficiency: Math.floor(Math.random() * 30) + 70,
      status: quote.status === 'accepted' ? 'completed' : 'pending',
      createdAt: quote.created_at,
      sqft,
      revenuePerSqft: revenue / sqft,
      satisfaction: Math.floor(Math.random() * 2) + 4
    };
  });

  // Calculate analytics
  const totalProjects = projects.length;
  const averageMargin = projects.reduce((sum, p) => sum + p.margin, 0) / Math.max(1, totalProjects);
  const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);

  return NextResponse.json({
    projects,
    summary: {
      totalProjects,
      averageProfit: projects.reduce((sum, p) => sum + p.profit, 0) / Math.max(1, totalProjects),
      averageMargin,
      bestMargin: Math.max(...projects.map(p => p.margin), 0),
      worstMargin: Math.min(...projects.map(p => p.margin), 0),
      averageDuration: projects.reduce((sum, p) => sum + p.duration, 0) / Math.max(1, totalProjects),
      totalRevenue
    },
    profitabilityMatrix: [
      {
        range: 'High Margin (>30%)',
        count: projects.filter(p => p.margin > 30).length,
        revenue: projects.filter(p => p.margin > 30).reduce((sum, p) => sum + p.revenue, 0),
        avgMargin: projects.filter(p => p.margin > 30).reduce((sum, p) => sum + p.margin, 0) / Math.max(1, projects.filter(p => p.margin > 30).length)
      },
      {
        range: 'Medium Margin (15-30%)',
        count: projects.filter(p => p.margin >= 15 && p.margin <= 30).length,
        revenue: projects.filter(p => p.margin >= 15 && p.margin <= 30).reduce((sum, p) => sum + p.revenue, 0),
        avgMargin: projects.filter(p => p.margin >= 15 && p.margin <= 30).reduce((sum, p) => sum + p.margin, 0) / Math.max(1, projects.filter(p => p.margin >= 15 && p.margin <= 30).length)
      },
      {
        range: 'Low Margin (<15%)',
        count: projects.filter(p => p.margin < 15).length,
        revenue: projects.filter(p => p.margin < 15).reduce((sum, p) => sum + p.revenue, 0),
        avgMargin: projects.filter(p => p.margin < 15).reduce((sum, p) => sum + p.margin, 0) / Math.max(1, projects.filter(p => p.margin < 15).length)
      }
    ],
    trends: {
      marginTrend: 5.2,
      revenueTrend: 12.8,
      efficiencyTrend: 3.1
    }
  });
}

async function handleCustomerAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  const quotes: any[] = await dbAll(baseQuery, [companyId]);
  
  // Group by customer
  const customerGroups = quotes.reduce((groups, quote) => {
    const customer = quote.customer_email || quote.customer_name || 'Unknown';
    if (!groups[customer]) groups[customer] = [];
    groups[customer].push(quote);
    return groups;
  }, {} as Record<string, any[]>);

  const customerAnalytics = Object.entries(customerGroups).map(([customer, customerQuotes]) => {
    const revenue = customerQuotes.reduce((sum, q) => sum + (q.total_revenue || q.quote_amount || q.final_price || 0), 0);
    const avgQuote = revenue / customerQuotes.length;
    
    return {
      customer,
      revenue,
      count: customerQuotes.length,
      avgQuote,
      lastProject: customerQuotes[customerQuotes.length - 1].created_at,
      status: customerQuotes.some(q => q.status === 'accepted') ? 'active' : 'prospect'
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return NextResponse.json({
    customers: customerAnalytics,
    segments: [
      {
        name: 'High-Value Customers',
        customers: customerAnalytics.filter(c => c.revenue >= 15000),
        totalRevenue: customerAnalytics.filter(c => c.revenue >= 15000).reduce((sum, c) => sum + c.revenue, 0),
        avgRevenue: customerAnalytics.filter(c => c.revenue >= 15000).reduce((sum, c) => sum + c.revenue, 0) / Math.max(1, customerAnalytics.filter(c => c.revenue >= 15000).length)
      },
      {
        name: 'Medium-Value Customers',
        customers: customerAnalytics.filter(c => c.revenue >= 5000 && c.revenue < 15000),
        totalRevenue: customerAnalytics.filter(c => c.revenue >= 5000 && c.revenue < 15000).reduce((sum, c) => sum + c.revenue, 0),
        avgRevenue: customerAnalytics.filter(c => c.revenue >= 5000 && c.revenue < 15000).reduce((sum, c) => sum + c.revenue, 0) / Math.max(1, customerAnalytics.filter(c => c.revenue >= 5000 && c.revenue < 15000).length)
      },
      {
        name: 'Emerging Customers',
        customers: customerAnalytics.filter(c => c.revenue < 5000),
        totalRevenue: customerAnalytics.filter(c => c.revenue < 5000).reduce((sum, c) => sum + c.revenue, 0),
        avgRevenue: customerAnalytics.filter(c => c.revenue < 5000).reduce((sum, c) => sum + c.revenue, 0) / Math.max(1, customerAnalytics.filter(c => c.revenue < 5000).length)
      }
    ],
    retention: {
      rate: 85,
      churnRisk: customerAnalytics.filter(c => {
        const daysSinceLastProject = (Date.now() - new Date(c.lastProject).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceLastProject > 90;
      }).length
    }
  });
}

// Mock implementations for other analytics endpoints
async function handleOperationalAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  return NextResponse.json({
    responseTime: { avg: 4.2, trend: -0.8 },
    conversionRate: { current: 28.5, trend: 3.2 },
    projectDuration: { avg: 8.5, trend: -1.1 },
    resourceUtilization: { equipment: 78, labor: 92 },
    qualityMetrics: { score: 96, satisfaction: 4.7 }
  });
}

async function handleForecastingAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  return NextResponse.json({
    nextMonth: { revenue: 45000, confidence: 85 },
    nextQuarter: { revenue: 125000, confidence: 78 },
    seasonal: generateSeasonalData(100000),
    factors: ["Spring uptick", "Pipeline strength", "Market conditions"]
  });
}

async function handleCostAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  return NextResponse.json({
    materialCosts: { current: 35, trend: 2.1, waste: 8 },
    laborCosts: { current: 30, efficiency: 92, trend: 1.5 },
    overhead: { current: 15, optimization: 85 },
    profitMargin: { current: 20, target: 25, trend: 0.8 }
  });
}

async function handleCompetitiveAnalytics(companyId: string, baseQuery: string, startDate: Date, previousStartDate: Date) {
  return NextResponse.json({
    marketShare: { estimated: 12, trend: 1.8 },
    pricing: { competitive: true, premium: 8 },
    winRate: { current: 65, trend: 4.2 },
    lossReasons: [
      { reason: "Price too high", percentage: 45 },
      { reason: "Timeline", percentage: 25 },
      { reason: "Availability", percentage: 20 },
      { reason: "Other", percentage: 10 }
    ]
  });
}

function generateAlerts(currentRevenue: number, previousRevenue: number, conversionRate: number, pendingQuotes: number) {
  const alerts = [];
  
  const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  
  if (revenueGrowth < -10) {
    alerts.push({
      id: 'revenue-decline',
      type: 'error',
      title: 'Revenue Decline Alert',
      message: `Revenue down ${Math.abs(revenueGrowth).toFixed(1)}% from last period`
    });
  }
  
  if (conversionRate < 20) {
    alerts.push({
      id: 'low-conversion',
      type: 'warning',
      title: 'Low Conversion Rate',
      message: `Only ${conversionRate.toFixed(1)}% of quotes are converting`
    });
  }
  
  if (pendingQuotes > 10) {
    alerts.push({
      id: 'pending-quotes',
      type: 'warning',
      title: 'High Pending Quotes',
      message: `${pendingQuotes} quotes awaiting response`
    });
  }
  
  return alerts;
}

function generateSeasonalData(baseRevenue: number) {
  return [
    { month: 'Jan', current: baseRevenue * 0.06, previous: baseRevenue * 0.05, average: baseRevenue * 0.08 },
    { month: 'Feb', current: baseRevenue * 0.07, previous: baseRevenue * 0.06, average: baseRevenue * 0.07 },
    { month: 'Mar', current: baseRevenue * 0.09, previous: baseRevenue * 0.08, average: baseRevenue * 0.09 },
    { month: 'Apr', current: baseRevenue * 0.12, previous: baseRevenue * 0.11, average: baseRevenue * 0.11 },
    { month: 'May', current: baseRevenue * 0.13, previous: baseRevenue * 0.12, average: baseRevenue * 0.12 },
    { month: 'Jun', current: baseRevenue * 0.11, previous: baseRevenue * 0.10, average: baseRevenue * 0.10 }
  ];
}