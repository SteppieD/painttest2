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
      const typedCustomerQuotes = customerQuotes as any[];
      const revenue = typedCustomerQuotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
      const avgQuote = revenue / typedCustomerQuotes.length;
      
      return {
        customer,
        revenue,
        count: typedCustomerQuotes.length,
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
      <div>
        <div>
          <div></div>
          <p>Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div>
        <p>Unable to load revenue data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div>
        <div>
          <h1>Revenue Analytics Laboratory</h1>
          <p>Deep revenue insights and forecasting</p>
        </div>
        
        <div>
          {/* View Mode Selector */}
          <div>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'trends', label: 'Trends' },
              { id: 'forecasting', label: 'Forecast' },
              { id: 'opportunities', label: 'Growth' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
               `}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div>
            {[
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
               `}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button>
            <Download />
            Export
          </button>
        </div>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <>
          {/* Key Revenue Metrics */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <DollarSign />
                  Current {timeRange} Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    {formatCurrency(metrics.currentPeriod.total)}
                  </div>
                  <div>
                    {metrics.currentPeriod.growth >= 0 ? (
                      <ArrowUpRight />
                    ) : (
                      <ArrowDownRight />
                    )}
                    <span`}>
                      {Math.abs(metrics.currentPeriod.growth).toFixed(1)}% vs last {timeRange}
                    </span>
                  </div>
                  <div>
                    Target: {formatCurrency(metrics.currentPeriod.target)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Target />
                  Projected Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    {formatCurrency(metrics.currentPeriod.projected)}
                  </div>
                  <div>
                    End of {timeRange}
                  </div>
                  <div>
                    {((metrics.currentPeriod.projected / metrics.currentPeriod.target) * 100).toFixed(0)}% of target
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingUp />
                  Next Month Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    {formatCurrency(metrics.forecasting.nextMonth)}
                  </div>
                  <div>
                    {metrics.forecasting.confidence}% confidence
                  </div>
                  <div>
                    Based on trends & pipeline
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Zap />
                  Growth Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    {formatCurrency(metrics.opportunities.reduce((sum, opp) => sum + (opp.potential * opp.probability / 100), 0))}
                  </div>
                  <div>
                    Weighted potential
                  </div>
                  <div>
                    {metrics.opportunities.length} opportunities
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div>
            {/* Project Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <PieChart />
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
                 
                  showLegend={true}
                  showLabels={true}
                  formatValue={formatChartCurrency}
                />
              </CardContent>
            </Card>

            {/* Customer Segments */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <BarChart3 />
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
                 
                  showLegend={false}
                  formatValue={formatChartCurrency}
                />
                
                {/* Customer Segment Details */}
                <div>
                  {customerSegments.map((segment, index) => (
                    <div key={index}>
                      <span>{segment.name}</span>
                      <div>
                        <span>+{segment.growth}%</span>
                        <span>({segment.count} customers)</span>
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
            <CardTitle>
              <Calendar />
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
             
              showLegend={true}
              formatValue={(value) => {
                return formatChartCurrency(value);
              }}
            />
            
            {/* Timeline Summary */}
            <div>
              <div>
                <div>
                  {formatCurrency(metrics.timeline.reduce((sum, p) => sum + p.revenue, 0))}
                </div>
                <div>Total Revenue</div>
              </div>
              <div>
                <div>
                  {metrics.timeline.reduce((sum, p) => sum + p.quotes, 0)}
                </div>
                <div>Total Quotes</div>
              </div>
              <div>
                <div>
                  {(metrics.timeline.reduce((sum, p) => sum + p.conversion, 0) / metrics.timeline.length).toFixed(1)}%
                </div>
                <div>Avg Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forecasting View */}
      {viewMode === 'forecasting' && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <TrendingUp />
                Revenue Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    {formatCurrency(metrics.forecasting.nextMonth)}
                  </div>
                  <div>Next Month Projection</div>
                  <div>{metrics.forecasting.confidence}% confidence level</div>
                </div>
                
                <div>
                  <h4>Key Factors:</h4>
                  {metrics.forecasting.factors.map((factor, index) => (
                    <div key={index}>
                      <CheckCircle />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Calendar />
                Seasonal Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.seasonal.map((month, index) => (
                  <div key={index}>
                    <div>
                      <span>{month.month}</span>
                      <div>
                        <div>{formatCurrency(month.current)}</div>
                        <div>vs {formatCurrency(month.average)} avg</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div 
                         
                         %` }}
                        ></div>
                      </div>
                      <div>
                        <div 
                         
                         %` }}
                        ></div>
                      </div>
                    </div>
                    <div>
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
            <CardTitle>
              <Zap />
              Revenue Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {metrics.opportunities.map((opportunity) => (
                <div key={opportunity.id}>
                  <div>
                    <div>
                      <h3>{opportunity.title}</h3>
                      <div>
                        <span>Timeline: {opportunity.timeline}</span>
                        <span>•</span>
                        <span>Probability: {opportunity.probability}%</span>
                      </div>
                    </div>
                    <div>
                      <div>
                        {formatCurrency(opportunity.potential)}
                      </div>
                      <div>
                        {formatCurrency(opportunity.potential * opportunity.probability / 100)} weighted
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div 
                       
                       %` }}
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