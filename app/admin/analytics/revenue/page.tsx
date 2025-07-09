"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Calendar, FileText, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  avgQuoteValue: number;
  totalQuotes: number;
  acceptedQuotes: number;
  pendingQuotes: number;
  conversionRate: number;
  revenueGrowth: {
    monthly: number;
    weekly: number;
    daily: number;
  };
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    quotes: number;
    avgValue: number;
  }>;
  projectTypeRevenue: {
    interior: number;
    exterior: number;
    both: number;
  };
  topCustomers: Array<{
    company_name: string;
    revenue: number;
    quotes: number;
  }>;
}

export default function RevenueAnalyticsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const loadRevenueMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/analytics/revenue?timeframe=${timeframe}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading revenue metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    loadRevenueMetrics();
  }, [loadRevenueMetrics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen p-6">
        <Button onClick={() => router.back()} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center mt-20">
          <p className="text-gray-600">No revenue data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => router.back()} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Revenue Analytics</h1>
                <p className="text-gray-600">Track revenue performance and growth trends</p>
              </div>
            </div>
            
            {/* Timeframe selector */}
            <div className="flex gap-2">
              <Button
                variant={timeframe === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('7d')}
              >
                7 Days
              </Button>
              <Button
                variant={timeframe === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('30d')}
              >
                30 Days
              </Button>
              <Button
                variant={timeframe === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('90d')}
              >
                90 Days
              </Button>
              <Button
                variant={timeframe === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('all')}
              >
                All Time
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <div className="flex items-center text-xs">
                {(() => {
                  const GrowthIcon = getGrowthIcon(metrics.revenueGrowth.monthly);
                  return (
                    <>
                      <GrowthIcon className={`h-4 w-4 mr-1 ${getGrowthColor(metrics.revenueGrowth.monthly)}`} />
                      <span className={getGrowthColor(metrics.revenueGrowth.monthly)}>
                        {formatPercentage(metrics.revenueGrowth.monthly)} vs last month
                      </span>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Quote Value</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.avgQuoteValue)}</div>
              <p className="text-xs text-muted-foreground">
                From {metrics.totalQuotes} total quotes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
              <Progress value={metrics.conversionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.acceptedQuotes} of {metrics.totalQuotes} quotes accepted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</div>
              <div className="flex items-center text-xs">
                {(() => {
                  const GrowthIcon = getGrowthIcon(metrics.revenueGrowth.monthly);
                  return (
                    <>
                      <GrowthIcon className={`h-4 w-4 mr-1 ${getGrowthColor(metrics.revenueGrowth.monthly)}`} />
                      <span className={getGrowthColor(metrics.revenueGrowth.monthly)}>
                        {formatPercentage(metrics.revenueGrowth.monthly)} growth
                      </span>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Project Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Revenue by Project Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Interior Projects</span>
                  <span className="text-sm font-medium">{formatCurrency(metrics.projectTypeRevenue.interior)}</span>
                </div>
                <Progress 
                  value={(metrics.projectTypeRevenue.interior / metrics.totalRevenue) * 100} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Exterior Projects</span>
                  <span className="text-sm font-medium">{formatCurrency(metrics.projectTypeRevenue.exterior)}</span>
                </div>
                <Progress 
                  value={(metrics.projectTypeRevenue.exterior / metrics.totalRevenue) * 100} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Interior + Exterior</span>
                  <span className="text-sm font-medium">{formatCurrency(metrics.projectTypeRevenue.both)}</span>
                </div>
                <Progress 
                  value={(metrics.projectTypeRevenue.both / metrics.totalRevenue) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.monthlyBreakdown.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{month.month}</p>
                      <p className="text-sm text-gray-600">{month.quotes} quotes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(month.revenue)}</p>
                      <p className="text-sm text-gray-600">Avg: {formatCurrency(month.avgValue)}</p>
                    </div>
                  </div>
                ))}
                {metrics.monthlyBreakdown.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No monthly data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Revenue Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{customer.company_name}</p>
                        <p className="text-sm text-gray-600">{customer.quotes} quotes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(customer.revenue)}</p>
                    </div>
                  </div>
                ))}
                {metrics.topCustomers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No customer data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Growth Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatPercentage(metrics.revenueGrowth.monthly)}
                </div>
                <p className="text-sm text-gray-600">Monthly Growth</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatCurrency(metrics.dailyRevenue)}
                </div>
                <p className="text-sm text-gray-600">Daily Average</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {metrics.pendingQuotes}
                </div>
                <p className="text-sm text-gray-600">Pending Quotes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}