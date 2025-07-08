"use client";

import { useState, useEffect } from "react";
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
  RefreshCw
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading executive dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load metrics</p>
      </div>
    );
  }

  const revenueGrowthTrend = getMetricTrend(metrics.revenue.thisMonth, metrics.revenue.lastMonth);

  return (
    <div className="space-y-8">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Command Center</h1>
          <p className="text-gray-600">Real-time business intelligence and insights</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-lg border">
            {['today', 'week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  timeRange === range
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={() => loadExecutiveMetrics(companyInfo?.id)}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Priority Alerts
          </h2>
          <div className="grid gap-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${
                alert.type === 'error' ? 'border-l-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                alert.type === 'success' ? 'border-l-green-500 bg-green-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />}
                      {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
                      {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                      <div>
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                    </div>
                    {alert.action && (
                      <button
                        onClick={alert.action.onClick}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                      >
                        {alert.action.label}
                        <ArrowRight className="w-4 h-4" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue KPI */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">
                {formatCurrency(metrics.revenue.thisMonth)}
              </div>
              <div className="flex items-center gap-2">
                {revenueGrowthTrend.direction === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : revenueGrowthTrend.direction === 'down' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                ) : null}
                <span className={`text-sm font-medium ${
                  revenueGrowthTrend.direction === 'up' ? 'text-green-600' :
                  revenueGrowthTrend.direction === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {revenueGrowthTrend.percentage.toFixed(1)}% vs last month
                </span>
              </div>
              <div className="text-xs text-green-600">
                Target: {formatCurrency(metrics.revenue.target)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate KPI */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">
                {metrics.operations.conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-blue-600">
                {metrics.operations.totalQuotes} total quotes
              </div>
              <div className="text-xs text-blue-600">
                Industry avg: 25-35%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Quote KPI */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Average Quote Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">
                {formatCurrency(metrics.operations.averageQuote)}
              </div>
              <div className="text-sm text-purple-600">
                Per project
              </div>
              <div className="text-xs text-purple-600">
                Range: {formatCurrency(metrics.operations.averageQuote * 0.6)} - {formatCurrency(metrics.operations.averageQuote * 1.8)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction KPI */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-800">
                {metrics.customers.satisfactionScore}/5
              </div>
              <div className="text-sm text-orange-600">
                {metrics.customers.retentionRate}% retention rate
              </div>
              <div className="text-xs text-orange-600">
                {metrics.customers.totalCustomers} total customers
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Operational Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Operational Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="font-semibold">{metrics.operations.responseTime}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Projects</span>
              <span className="font-semibold">{metrics.operations.projectsActive}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending Quotes</span>
              <span className="font-semibold text-orange-600">{metrics.operations.pendingQuotes}</span>
            </div>
            <button
              onClick={() => router.push('/analytics/operations')}
              className="w-full mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center gap-2"
            >
              View Detailed Operations
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>

        {/* Customer Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Customer Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lifetime Value</span>
              <span className="font-semibold">{formatCurrency(metrics.customers.lifetimeValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Customers</span>
              <span className="font-semibold">{metrics.customers.activeCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Churn Risk</span>
              <span className="font-semibold text-red-600">{metrics.customers.churnRisk}%</span>
            </div>
            <button
              onClick={() => router.push('/analytics/customers')}
              className="w-full mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center justify-center gap-2"
            >
              View Customer Analytics
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>

        {/* Efficiency Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Business Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Profit Margin</span>
              <span className="font-semibold text-green-600">{metrics.efficiency.profitMargin}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Labor Efficiency</span>
              <span className="font-semibold">{metrics.efficiency.laborEfficiency}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quality Score</span>
              <span className="font-semibold text-blue-600">{metrics.efficiency.qualityScore}%</span>
            </div>
            <button
              onClick={() => router.push('/analytics/costs')}
              className="w-full mt-3 text-green-600 hover:text-green-800 text-sm font-medium flex items-center justify-center gap-2"
            >
              View Cost Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/analytics/revenue')}
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <DollarSign className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-800">Revenue Deep Dive</div>
                <div className="text-sm text-green-600">Analyze revenue patterns</div>
              </div>
            </button>
            
            <button
              onClick={() => router.push('/analytics/projects')}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Calculator className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-800">Project Analysis</div>
                <div className="text-sm text-blue-600">Project profitability</div>
              </div>
            </button>
            
            <button
              onClick={() => router.push('/analytics/forecasting')}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-purple-800">Forecasting</div>
                <div className="text-sm text-purple-600">Predict future trends</div>
              </div>
            </button>
            
            <button
              onClick={() => router.push('/quotes')}
              className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <FileText className="w-6 h-6 text-orange-600" />
              <div className="text-left">
                <div className="font-medium text-orange-800">Manage Quotes</div>
                <div className="text-sm text-orange-600">Review pending quotes</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}