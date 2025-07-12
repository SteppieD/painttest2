"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  AlertCircle,
  ChevronRight,
  Building2,
  Briefcase,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Crown,
  Sparkles
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';

interface BusinessInsights {
  revenue: {
    recurring: number;
    oneTime: number;
    projected: number;
    growth: number;
    byService: {
      interior: number;
      exterior: number;
      commercial: number;
    };
  };
  profitability: {
    grossMargin: number;
    netMargin: number;
    laborCostRatio: number;
    materialCostRatio: number;
    overheadRatio: number;
  };
  customerAnalytics: {
    lifetime: number;
    acquisition: number;
    churnRate: number;
    topCustomers: Array<{
      name: string;
      revenue: number;
      projects: number;
    }>;
  };
  performance: {
    leadConversion: number;
    quoteToJobRatio: number;
    averageProjectSize: number;
    completionTime: number;
    employeeUtilization: number;
  };
  forecasting: {
    nextQuarter: number;
    seasonalTrends: Array<{
      month: string;
      revenue: number;
      projects: number;
    }>;
    opportunityPipeline: number;
  };
}

export default function BusinessInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [insights, setInsights] = useState<BusinessInsights | null>(null);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const router = useRouter();

  useEffect(() => {
    checkAccessAndLoadData();
  }, [timeRange]);

  const checkAccessAndLoadData = async () => {
    try {
      // Check if user has access to business insights
      const accessResponse = await fetch('/api/business-insights/check-access');
      const accessData = await accessResponse.json();

      if (!accessData.hasAccess) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      setHasAccess(true);

      // Load business insights data
      const insightsResponse = await fetch(`/api/business-insights?timeRange=${timeRange}`);
      const insightsData = await insightsResponse.json();
      
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading business insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Business Insights</h1>
            <p className="text-xl text-gray-600 mb-8">
              Unlock powerful business analytics and insights with a paid plan
            </p>
          </div>

          <Card className="p-8 mb-8 border-2 border-purple-200 bg-purple-50">
            <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Premium Features Include:</h2>
            <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
              <li className="flex items-start">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Revenue analytics and profitability tracking</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Customer lifetime value and acquisition metrics</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Performance benchmarking and KPIs</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Seasonal forecasting and trend analysis</span>
              </li>
              <li className="flex items-start">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Employee utilization and efficiency metrics</span>
              </li>
            </ul>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push('/pricing')}
            >
              Upgrade to Unlock Insights
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 pointer-events-none">
            <Card className="blur-sm">
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$XX,XXX</div>
                <p className="text-sm text-gray-600">Monthly recurring revenue</p>
              </CardContent>
            </Card>
            <Card className="blur-sm">
              <CardHeader>
                <CardTitle>Profit Margins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">XX%</div>
                <p className="text-sm text-gray-600">Gross margin</p>
              </CardContent>
            </Card>
            <Card className="blur-sm">
              <CardHeader>
                <CardTitle>Customer Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$X,XXX</div>
                <p className="text-sm text-gray-600">Average lifetime value</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const revenueData = insights.forecasting.seasonalTrends.map(trend => ({
    name: trend.month,
    revenue: trend.revenue,
    projects: trend.projects
  }));

  const profitBreakdown = [
    { name: 'Labor', value: insights.profitability.laborCostRatio, color: '#8884d8' },
    { name: 'Materials', value: insights.profitability.materialCostRatio, color: '#82ca9d' },
    { name: 'Overhead', value: insights.profitability.overheadRatio, color: '#ffc658' },
    { name: 'Profit', value: insights.profitability.netMargin, color: '#ff7c7c' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Insights</h1>
          <p className="text-gray-600">Advanced analytics for your painting business</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Month
          </Button>
          <Button
            variant={timeRange === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('quarter')}
          >
            Quarter
          </Button>
          <Button
            variant={timeRange === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.revenue.growth > 0 ? '+' : ''}{insights.revenue.growth.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {insights.revenue.growth > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
              )}
              vs previous period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.profitability.grossMargin}%</div>
            <p className="text-xs text-muted-foreground">
              Net margin: {insights.profitability.netMargin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(insights.customerAnalytics.lifetime)}
            </div>
            <p className="text-xs text-muted-foreground">
              Acquisition: {formatCurrency(insights.customerAnalytics.acquisition)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(insights.forecasting.opportunityPipeline)}
            </div>
            <p className="text-xs text-muted-foreground">
              Next quarter: {formatCurrency(insights.forecasting.nextQuarter)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and project volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="projects"
                        stroke="#82ca9d"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>Breakdown of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Interior Painting</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(insights.revenue.byService.interior)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(insights.revenue.byService.interior / 
                            (insights.revenue.byService.interior + 
                             insights.revenue.byService.exterior + 
                             insights.revenue.byService.commercial)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Exterior Painting</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(insights.revenue.byService.exterior)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(insights.revenue.byService.exterior / 
                            (insights.revenue.byService.interior + 
                             insights.revenue.byService.exterior + 
                             insights.revenue.byService.commercial)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Commercial Projects</span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(insights.revenue.byService.commercial)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(insights.revenue.byService.commercial / 
                            (insights.revenue.byService.interior + 
                             insights.revenue.byService.exterior + 
                             insights.revenue.byService.commercial)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Where your revenue goes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profitBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value">
                        {profitBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Margin Analysis</CardTitle>
                <CardDescription>Key profitability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Gross Margin</span>
                      <span className="text-2xl font-bold">{insights.profitability.grossMargin}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Revenue after direct costs
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Net Margin</span>
                      <span className="text-2xl font-bold">{insights.profitability.netMargin}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Profit after all expenses
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Cost Ratios</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Labor</span>
                        <span>{insights.profitability.laborCostRatio}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Materials</span>
                        <span>{insights.profitability.materialCostRatio}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Overhead</span>
                        <span>{insights.profitability.overheadRatio}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
                <CardDescription>Key customer analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Lifetime Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(insights.customerAnalytics.lifetime)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Acquisition Cost</p>
                      <p className="text-2xl font-bold">{formatCurrency(insights.customerAnalytics.acquisition)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">LTV:CAC Ratio</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">
                        {(insights.customerAnalytics.lifetime / insights.customerAnalytics.acquisition).toFixed(1)}:1
                      </span>
                      <Badge variant={
                        (insights.customerAnalytics.lifetime / insights.customerAnalytics.acquisition) >= 3 
                          ? "default" 
                          : "secondary"
                      }>
                        {(insights.customerAnalytics.lifetime / insights.customerAnalytics.acquisition) >= 3 
                          ? "Healthy" 
                          : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                    <p className="text-xl font-bold">{insights.customerAnalytics.churnRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Your most valuable clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.customerAnalytics.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.projects} projects
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(customer.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion</CardTitle>
                <CardDescription>Quote to customer rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {insights.performance.leadConversion}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${insights.performance.leadConversion}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quote Success Rate</CardTitle>
                <CardDescription>Quotes that become jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {insights.performance.quoteToJobRatio}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${insights.performance.quoteToJobRatio}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Utilization</CardTitle>
                <CardDescription>Productive hours ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {insights.performance.employeeUtilization}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${insights.performance.employeeUtilization}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Project Size</CardTitle>
                <CardDescription>Revenue per project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(insights.performance.averageProjectSize)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Per completed project
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Time</CardTitle>
                <CardDescription>Average project duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {insights.performance.completionTime}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Days per project
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Score</CardTitle>
                <CardDescription>Overall performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold">A-</div>
                  <Badge variant="default">Above Average</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on industry benchmarks
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}