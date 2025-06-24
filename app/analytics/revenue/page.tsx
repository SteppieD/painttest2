"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BarChart3,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  Zap
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import CustomLineChart from "@/components/ui/line-chart";
import CustomBarChart from "@/components/ui/bar-chart";
import CustomPieChart from "@/components/ui/pie-chart";
import { formatCurrency as formatChartCurrency, formatPercentage, CHART_COLORS } from "@/lib/chart-utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface RevenueMetrics {
  currentPeriod: {
    total: number;
    growth: number;
    target: number;
    projected: number;
  };
  breakdown: {
    residential: number;
    commercial: number;
    maintenance: number;
    newConstruction: number;
  };
  timeline: Array<{
    period: string;
    revenue: number;
    quotes: number;
    conversion: number;
  }>;
  seasonal: Array<{
    month: string;
    current: number;
    previous: number;
    average: number;
  }>;
  forecasting: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
    factors: string[];
  };
  opportunities: Array<{
    id: string;
    title: string;
    potential: number;
    probability: number;
    timeline: string;
  }>;
}

interface CustomerSegment {
  name: string;
  revenue: number;
  percentage: number;
  growth: number;
  avgQuote: number;
  count: number;
}

export default function RevenueAnalytics() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [viewMode, setViewMode] = useState<'overview' | 'trends' | 'forecasting' | 'opportunities'>('overview');

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
        loadRevenueMetrics(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router, timeRange]);

  const loadRevenueMetrics = async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Calculate revenue metrics
      const calculatedMetrics = calculateRevenueMetrics(quotes);
      setMetrics(calculatedMetrics);
      
      // Calculate customer segments
      const segments = calculateCustomerSegments(quotes);
      setCustomerSegments(segments);

    } catch (error) {
      console.error("Error loading revenue metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRevenueMetrics = (quotes: any[]): RevenueMetrics => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current period revenue
    const currentRevenue = quotes
      .filter(q => new Date(q.created_at) >= currentMonthStart)
      .reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);

    const lastRevenue = quotes
      .filter(q => {
        const date = new Date(q.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      })
      .reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);

    const growth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;

    // Project type breakdown (mock data - would be enhanced with actual project type tracking)
    const totalRevenue = quotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
    const breakdown = {
      residential: totalRevenue * 0.7, // 70% residential
      commercial: totalRevenue * 0.2,  // 20% commercial  
      maintenance: totalRevenue * 0.08, // 8% maintenance
      newConstruction: totalRevenue * 0.02 // 2% new construction
    };

    // Timeline data (last 6 months)
    const timeline = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthQuotes = quotes.filter(q => {
        const date = new Date(q.created_at);
        return date >= monthStart && date <= monthEnd;
      });

      const monthRevenue = monthQuotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
      const accepted = monthQuotes.filter(q => q.status === 'accepted').length;
      const conversion = monthQuotes.length > 0 ? (accepted / monthQuotes.length) * 100 : 0;

      timeline.push({
        period: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        quotes: monthQuotes.length,
        conversion
      });
    }

    // Seasonal analysis (mock data)
    const seasonal = [
      { month: 'Jan', current: currentRevenue * 0.6, previous: lastRevenue * 0.6, average: totalRevenue * 0.08 },
      { month: 'Feb', current: currentRevenue * 0.7, previous: lastRevenue * 0.7, average: totalRevenue * 0.07 },
      { month: 'Mar', current: currentRevenue * 0.9, previous: lastRevenue * 0.9, average: totalRevenue * 0.09 },
      { month: 'Apr', current: currentRevenue * 1.2, previous: lastRevenue * 1.2, average: totalRevenue * 0.11 },
      { month: 'May', current: currentRevenue * 1.3, previous: lastRevenue * 1.3, average: totalRevenue * 0.12 },
      { month: 'Jun', current: currentRevenue, previous: lastRevenue, average: totalRevenue * 0.10 }
    ];

    // Forecasting
    const forecasting = {
      nextMonth: currentRevenue * 1.15,
      nextQuarter: currentRevenue * 3.2,
      confidence: 85,
      factors: [
        "Spring seasonal uptick",
        "3 large commercial projects in pipeline", 
        "Increased marketing spend",
        "Historical growth pattern"
      ]
    };

    // Revenue opportunities
    const opportunities = [
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
      },
      {
        id: 'maintenance-contracts',
        title: 'Maintenance Contracts',
        potential: 35000,
        probability: 80,
        timeline: '1-3 months'
      }
    ];

    return {
      currentPeriod: {
        total: currentRevenue,
        growth,
        target: currentRevenue * 1.20, // 20% growth target
        projected: currentRevenue * 1.15
      },
      breakdown,
      timeline,
      seasonal,
      forecasting,
      opportunities
    };
  };

  const calculateCustomerSegments = (quotes: any[]): CustomerSegment[] => {
    // Group quotes by customer
    const customerGroups = quotes.reduce((groups, quote) => {
      const customer = quote.customer_email || quote.customer_name || 'Unknown';
      if (!groups[customer]) {
        groups[customer] = [];
      }
      groups[customer].push(quote);
      return groups;
    }, {} as Record<string, any[]>);

    // Calculate segments
    const segments = Object.entries(customerGroups).map(([customer, customerQuotes]) => {
      const revenue = customerQuotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
      const avgQuote = revenue / customerQuotes.length;
      
      return {
        customer,
        revenue,
        count: customerQuotes.length,
        avgQuote
      };
    });

    // Categorize by value
    const totalRevenue = segments.reduce((sum, s) => sum + s.revenue, 0);
    
    const highValue = segments.filter(s => s.revenue >= 15000);
    const mediumValue = segments.filter(s => s.revenue >= 5000 && s.revenue < 15000);
    const lowValue = segments.filter(s => s.revenue < 5000);

    return [
      {
        name: 'High-Value Customers',
        revenue: highValue.reduce((sum, s) => sum + s.revenue, 0),
        percentage: (highValue.reduce((sum, s) => sum + s.revenue, 0) / totalRevenue) * 100,
        growth: 12, // Mock growth data
        avgQuote: highValue.length > 0 ? highValue.reduce((sum, s) => sum + s.avgQuote, 0) / highValue.length : 0,
        count: highValue.length
      },
      {
        name: 'Medium-Value Customers',
        revenue: mediumValue.reduce((sum, s) => sum + s.revenue, 0),
        percentage: (mediumValue.reduce((sum, s) => sum + s.revenue, 0) / totalRevenue) * 100,
        growth: 8,
        avgQuote: mediumValue.length > 0 ? mediumValue.reduce((sum, s) => sum + s.avgQuote, 0) / mediumValue.length : 0,
        count: mediumValue.length
      },
      {
        name: 'Emerging Customers',
        revenue: lowValue.reduce((sum, s) => sum + s.revenue, 0),
        percentage: (lowValue.reduce((sum, s) => sum + s.revenue, 0) / totalRevenue) * 100,
        growth: 25,
        avgQuote: lowValue.length > 0 ? lowValue.reduce((sum, s) => sum + s.avgQuote, 0) / lowValue.length : 0,
        count: lowValue.length
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load revenue data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics Laboratory</h1>
          <p className="text-gray-600">Deep revenue insights and forecasting</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'trends', label: 'Trends' },
              { id: 'forecasting', label: 'Forecast' },
              { id: 'opportunities', label: 'Growth' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === mode.id
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  timeRange === range.id
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <>
          {/* Key Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Current {timeRange} Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-800">
                    {formatCurrency(metrics.currentPeriod.total)}
                  </div>
                  <div className="flex items-center gap-2">
                    {metrics.currentPeriod.growth >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      metrics.currentPeriod.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(metrics.currentPeriod.growth).toFixed(1)}% vs last {timeRange}
                    </span>
                  </div>
                  <div className="text-xs text-green-600">
                    Target: {formatCurrency(metrics.currentPeriod.target)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Projected Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-800">
                    {formatCurrency(metrics.currentPeriod.projected)}
                  </div>
                  <div className="text-sm text-blue-600">
                    End of {timeRange}
                  </div>
                  <div className="text-xs text-blue-600">
                    {((metrics.currentPeriod.projected / metrics.currentPeriod.target) * 100).toFixed(0)}% of target
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Next Month Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-800">
                    {formatCurrency(metrics.forecasting.nextMonth)}
                  </div>
                  <div className="text-sm text-purple-600">
                    {metrics.forecasting.confidence}% confidence
                  </div>
                  <div className="text-xs text-purple-600">
                    Based on trends & pipeline
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Growth Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-800">
                    {formatCurrency(metrics.opportunities.reduce((sum, opp) => sum + (opp.potential * opp.probability / 100), 0))}
                  </div>
                  <div className="text-sm text-orange-600">
                    Weighted potential
                  </div>
                  <div className="text-xs text-orange-600">
                    {metrics.opportunities.length} opportunities
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  Revenue by Project Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart
                  data={[
                    { name: 'Residential', value: metrics.breakdown.residential, color: CHART_COLORS.primary[0] },
                    { name: 'Commercial', value: metrics.breakdown.commercial, color: CHART_COLORS.success[0] },
                    { name: 'Maintenance', value: metrics.breakdown.maintenance, color: CHART_COLORS.warning[0] },
                    { name: 'New Construction', value: metrics.breakdown.newConstruction, color: CHART_COLORS.purple[0] }
                  ]}
                  height={320}
                  showLegend={true}
                  showLabels={true}
                  formatValue={formatChartCurrency}
                />
              </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomBarChart
                  data={customerSegments.map(segment => ({
                    name: segment.name,
                    revenue: segment.revenue,
                    customers: segment.count
                  }))}
                  bars={[
                    { key: 'revenue', color: CHART_COLORS.purple[0], label: 'Revenue' }
                  ]}
                  height={320}
                  showLegend={false}
                  formatValue={formatChartCurrency}
                />
                
                {/* Customer Segment Details */}
                <div className="mt-4 space-y-2">
                  {customerSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{segment.name}</span>
                      <div className="text-right">
                        <span className="text-green-600">+{segment.growth}%</span>
                        <span className="text-gray-500 ml-2">({segment.count} customers)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Revenue Timeline */}
      {(viewMode === 'overview' || viewMode === 'trends') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Revenue Timeline (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart
              data={metrics.timeline.map(period => ({
                name: period.period,
                revenue: period.revenue,
                quotes: period.quotes,
                conversion: period.conversion
              }))}
              lines={[
                { key: 'revenue', color: CHART_COLORS.success[0], label: 'Revenue' },
                { key: 'quotes', color: CHART_COLORS.primary[0], label: 'Quotes (x100)' }
              ]}
              height={350}
              showLegend={true}
              formatValue={(value, key) => {
                if (key === 'quotes') return (value * 100).toString(); // Scale quotes for visibility
                return formatChartCurrency(value);
              }}
            />
            
            {/* Timeline Summary */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(metrics.timeline.reduce((sum, p) => sum + p.revenue, 0))}
                </div>
                <div className="text-sm text-green-600">Total Revenue</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-800">
                  {metrics.timeline.reduce((sum, p) => sum + p.quotes, 0)}
                </div>
                <div className="text-sm text-blue-600">Total Quotes</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-800">
                  {(metrics.timeline.reduce((sum, p) => sum + p.conversion, 0) / metrics.timeline.length).toFixed(1)}%
                </div>
                <div className="text-sm text-purple-600">Avg Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forecasting View */}
      {viewMode === 'forecasting' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Revenue Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    {formatCurrency(metrics.forecasting.nextMonth)}
                  </div>
                  <div className="text-blue-600 font-medium mb-1">Next Month Projection</div>
                  <div className="text-sm text-blue-600">{metrics.forecasting.confidence}% confidence level</div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Key Factors:</h4>
                  {metrics.forecasting.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Seasonal Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.seasonal.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatCurrency(month.current)}</div>
                        <div className="text-xs text-gray-500">vs {formatCurrency(month.average)} avg</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 bg-gray-200 rounded h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded"
                          style={{ width: `${Math.min((month.current / month.average) * 50, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded h-2">
                        <div 
                          className="bg-green-500 h-2 rounded"
                          style={{ width: `${Math.min((month.previous / month.average) * 50, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Current</span>
                      <span>Previous Year</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Growth Opportunities */}
      {viewMode === 'opportunities' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Revenue Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.opportunities.map((opportunity) => (
                <div key={opportunity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{opportunity.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Timeline: {opportunity.timeline}</span>
                        <span>•</span>
                        <span>Probability: {opportunity.probability}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(opportunity.potential)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(opportunity.potential * opportunity.probability / 100)} weighted
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${opportunity.probability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}