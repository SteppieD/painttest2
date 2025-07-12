"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Zap,
  Award,
  RefreshCw,
  Calculator
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ExecutiveMetrics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    target: number;
    velocity: number; // days to convert quote to cash
  };
  operations: {
    totalQuotes: number;
    conversionRate: number;
    averageQuote: number;
    pendingQuotes: number;
    responseTime: number; // hours to respond to inquiries
    projectsActive: number;
  };
  customers: {
    totalCustomers: number;
    activeCustomers: number;
    satisfactionScore: number;
    retentionRate: number;
    lifetimeValue: number;
    churnRisk: number;
  };
  efficiency: {
    profitMargin: number;
    materialWaste: number;
    laborEfficiency: number;
    equipmentUtilization: number;
    scheduleOptimization: number;
    qualityScore: number;
  };
}

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function ExecutiveCommandCenter() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (Date.now() - company.loginTime > 24 * 60 * 60 * 1000) {
          localStorage.removeItem("paintquote_company");
          router.push("/access-code");
          return;
        }
        setCompanyInfo(company);
        loadExecutiveMetrics(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router, timeRange]);

  const loadExecutiveMetrics = async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Calculate metrics
      const calculatedMetrics = calculateExecutiveMetrics(quotes);
      setMetrics(calculatedMetrics);
      
      // Generate alerts based on metrics
      const generatedAlerts = generateAlerts(calculatedMetrics);
      setAlerts(generatedAlerts);

    } catch (error) {
      console.error("Error loading executive metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateExecutiveMetrics = (quotes: any[]): ExecutiveMetrics => {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Filter quotes by time period
    const thisMonthQuotes = quotes.filter(q => new Date(q.created_at) >= thisMonthStart);
    const lastMonthQuotes = quotes.filter(q => {
      const date = new Date(q.created_at);
      return date >= lastMonthStart && date <= lastMonthEnd;
    });

    // Revenue calculations
    const totalRevenue = quotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
    const thisMonthRevenue = thisMonthQuotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
    const lastMonthRevenue = lastMonthQuotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    // Operations calculations
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted').length;
    const conversionRate = quotes.length > 0 ? (acceptedQuotes / quotes.length) * 100 : 0;
    const averageQuote = quotes.length > 0 ? totalRevenue / quotes.length : 0;
    const pendingQuotes = quotes.filter(q => !q.status || q.status === 'pending').length;

    // Customer calculations
    const uniqueCustomers = new Set(quotes.map(q => q.customer_email || q.customer_name)).size;
    const activeCustomers = thisMonthQuotes.length;

    // Efficiency calculations (mock data for now - would come from actual tracking)
    const profitMargin = 35; // 35% average profit margin
    const materialWaste = 8; // 8% material waste
    const laborEfficiency = 92; // 92% efficiency rating

    return {
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: revenueGrowth,
        target: thisMonthRevenue * 1.15, // 15% growth target
        velocity: 12 // average days to convert quote to cash
      },
      operations: {
        totalQuotes: quotes.length,
        conversionRate,
        averageQuote,
        pendingQuotes,
        responseTime: 4.2, // average hours to respond
        projectsActive: acceptedQuotes
      },
      customers: {
        totalCustomers: uniqueCustomers,
        activeCustomers,
        satisfactionScore: 4.7, // out of 5
        retentionRate: 85, // 85% retention rate
        lifetimeValue: averageQuote * 2.3, // average customer lifetime value
        churnRisk: 12 // 12% at risk of churning
      },
      efficiency: {
        profitMargin,
        materialWaste,
        laborEfficiency,
        equipmentUtilization: 78, // 78% equipment utilization
        scheduleOptimization: 89, // 89% schedule efficiency
        qualityScore: 96 // 96% quality score
      }
    };
  };

  const generateAlerts = (metrics: ExecutiveMetrics): Alert[] => {
    const alerts: Alert[] = [];

    // Revenue alerts
    if (metrics.revenue.growth < -10) {
      alerts.push({
        id: 'revenue-decline',
        type: 'error',
        title: 'Revenue Decline Alert',
        message: `Revenue down ${Math.abs(metrics.revenue.growth).toFixed(1)}% from last month`,
        action: {
          label: 'View Revenue Analytics',
          onClick: () => router.push('/analytics/revenue')
        }
      });
    } else if (metrics.revenue.growth > 20) {
      alerts.push({
        id: 'revenue-growth',
        type: 'success',
        title: 'Strong Revenue Growth',
        message: `Revenue up ${metrics.revenue.growth.toFixed(1)}% from last month`,
      });
    }

    // Operations alerts
    if (metrics.operations.conversionRate < 20) {
      alerts.push({
        id: 'low-conversion',
        type: 'warning',
        title: 'Low Conversion Rate',
        message: `Only ${metrics.operations.conversionRate.toFixed(1)}% of quotes are converting`,
        action: {
          label: 'Analyze Projects',
          onClick: () => router.push('/analytics/projects')
        }
      });
    }

    if (metrics.operations.pendingQuotes > 10) {
      alerts.push({
        id: 'pending-quotes',
        type: 'warning',
        title: 'High Pending Quotes',
        message: `${metrics.operations.pendingQuotes} quotes awaiting response`,
        action: {
          label: 'View Quotes',
          onClick: () => router.push('/quotes')
        }
      });
    }

    // Efficiency alerts
    if (metrics.efficiency.materialWaste > 15) {
      alerts.push({
        id: 'material-waste',
        type: 'warning',
        title: 'High Material Waste',
        message: `${metrics.efficiency.materialWaste}% material waste detected`,
        action: {
          label: 'Cost Analysis',
          onClick: () => router.push('/analytics/costs')
        }
      });
    }

    return alerts;
  };

  const getMetricTrend = (current: number, previous: number) => {
    if (previous === 0) return { direction: 'flat', percentage: 0 };
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
      percentage: Math.abs(change)
    };
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading executive dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div>
        <p>Unable to load metrics</p>
      </div>
    );
  }

  const revenueGrowthTrend = getMetricTrend(metrics.revenue.thisMonth, metrics.revenue.lastMonth);

  return (
    <div>
      {/* Header with Time Range Selector */}
      <div>
        <div>
          <h1>Executive Command Center</h1>
          <p>Real-time business intelligence and insights</p>
        </div>
        
        <div>
          <div>
            {['today', 'week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
               `}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => loadExecutiveMetrics(companyInfo?.id)}
           
            title="Refresh data"
          >
            <RefreshCw />
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div>
          <h2>
            <Zap />
            Priority Alerts
          </h2>
          <div>
            {alerts.map((alert) => (
              <Card key={alert.id}`}>
                <CardContent>
                  <div>
                    <div>
                      {alert.type === 'error' && <AlertTriangle />}
                      {alert.type === 'warning' && <AlertTriangle />}
                      {alert.type === 'success' && <CheckCircle />}
                      <div>
                        <h3>{alert.title}</h3>
                        <p>{alert.message}</p>
                      </div>
                    </div>
                    {alert.action && (
                      <button
                        onClick={alert.action.onClick}
                       
                      >
                        {alert.action.label}
                        <ArrowRight />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Key Performance Indicators */}
      <div>
        {/* Revenue KPI */}
        <Card>
          <CardHeader>
            <CardTitle>
              <DollarSign />
              Revenue This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {formatCurrency(metrics.revenue.thisMonth)}
              </div>
              <div>
                {revenueGrowthTrend.direction === 'up' ? (
                  <ArrowUpRight />
                ) : revenueGrowthTrend.direction === 'down' ? (
                  <ArrowDownRight />
                ) : null}
                <span`}>
                  {revenueGrowthTrend.percentage.toFixed(1)}% vs last month
                </span>
              </div>
              <div>
                Target: {formatCurrency(metrics.revenue.target)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate KPI */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Target />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.operations.conversionRate.toFixed(1)}%
              </div>
              <div>
                {metrics.operations.totalQuotes} total quotes
              </div>
              <div>
                Industry avg: 25-35%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Quote KPI */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Calculator />
              Average Quote Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {formatCurrency(metrics.operations.averageQuote)}
              </div>
              <div>
                Per project
              </div>
              <div>
                Range: {formatCurrency(metrics.operations.averageQuote * 0.6)} - {formatCurrency(metrics.operations.averageQuote * 1.8)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction KPI */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Award />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.customers.satisfactionScore}/5
              </div>
              <div>
                {metrics.customers.retentionRate}% retention rate
              </div>
              <div>
                {metrics.customers.totalCustomers} total customers
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics Grid */}
      <div>
        {/* Operational Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Clock />
              Operational Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span>Response Time</span>
              <span>{metrics.operations.responseTime}h</span>
            </div>
            <div>
              <span>Active Projects</span>
              <span>{metrics.operations.projectsActive}</span>
            </div>
            <div>
              <span>Pending Quotes</span>
              <span>{metrics.operations.pendingQuotes}</span>
            </div>
            <button
              onClick={() => router.push('/analytics/operations')}
             
            >
              View Detailed Operations
              <ArrowRight />
            </button>
          </CardContent>
        </Card>

        {/* Customer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Users />
              Customer Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span>Lifetime Value</span>
              <span>{formatCurrency(metrics.customers.lifetimeValue)}</span>
            </div>
            <div>
              <span>Active Customers</span>
              <span>{metrics.customers.activeCustomers}</span>
            </div>
            <div>
              <span>Churn Risk</span>
              <span>{metrics.customers.churnRisk}%</span>
            </div>
            <button
              onClick={() => router.push('/analytics/customers')}
             
            >
              View Customer Analytics
              <ArrowRight />
            </button>
          </CardContent>
        </Card>

        {/* Efficiency Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp />
              Business Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span>Profit Margin</span>
              <span>{metrics.efficiency.profitMargin}%</span>
            </div>
            <div>
              <span>Labor Efficiency</span>
              <span>{metrics.efficiency.laborEfficiency}%</span>
            </div>
            <div>
              <span>Quality Score</span>
              <span>{metrics.efficiency.qualityScore}%</span>
            </div>
            <button
              onClick={() => router.push('/analytics/costs')}
             
            >
              View Cost Analysis
              <ArrowRight />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <button
              onClick={() => router.push('/analytics/revenue')}
             
            >
              <DollarSign />
              <div>
                <div>Revenue Deep Dive</div>
                <div>Analyze revenue patterns</div>
              </div>
            </button>
            
            <button
              onClick={() => router.push('/analytics/projects')}
             
            >
              <Calculator />
              <div>
                <div>Project Analysis</div>
                <div>Project profitability</div>
              </div>
            </button>
            
            <button
              onClick={() => router.push('/analytics/forecasting')}
             
            >
              <TrendingUp />
              <div>
                <div>Forecasting</div>
                <div>Predict future trends</div>
              </div>
            </button>
            
            <button
              onClick={() => router.push('/quotes')}
             
            >
              <FileText />
              <div>
                <div>Manage Quotes</div>
                <div>Review pending quotes</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}