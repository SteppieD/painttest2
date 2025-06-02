"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const dynamic = 'force-dynamic';

interface BusinessMetrics {
  totalQuotes: number;
  totalRevenue: number;
  averageQuoteValue: number;
  winRate: number;
  quotesThisMonth: number;
  revenueThisMonth: number;
  quotesLastMonth: number;
  revenueLastMonth: number;
  topClients: Array<{
    name: string;
    totalSpent: number;
    jobCount: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    quotes: number;
  }>;
  averageMargin: number;
  projectTypeBreakdown: {
    interior: number;
    exterior: number;
    both: number;
  };
}

export default function InsightsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadMetrics();
  }, [timeframe]);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/insights?timeframe=${timeframe}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
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
          <p className="text-gray-600">No data available yet. Start creating quotes!</p>
        </div>
      </div>
    );
  }

  const revenueGrowth = getGrowthPercentage(metrics.revenueThisMonth, metrics.revenueLastMonth);
  const quotesGrowth = getGrowthPercentage(metrics.quotesThisMonth, metrics.quotesLastMonth);

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
              <h1 className="text-2xl font-bold">Business Insights</h1>
            </div>
            
            {/* Timeframe selector */}
            <div className="flex gap-2">
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
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.revenueThisMonth)}</div>
              <div className="flex items-center text-xs">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(revenueGrowth)}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quotes This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.quotesThisMonth}</div>
              <div className="flex items-center text-xs">
                {quotesGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={quotesGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(quotesGrowth)}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.winRate.toFixed(0)}%</div>
              <Progress value={metrics.winRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.winRate >= 50 ? "Above average!" : "Room to improve"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Quote Value</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.averageQuoteValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg margin: {metrics.averageMargin.toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Type Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Interior</span>
                  <span className="text-sm font-medium">{metrics.projectTypeBreakdown.interior}%</span>
                </div>
                <Progress value={metrics.projectTypeBreakdown.interior} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Exterior</span>
                  <span className="text-sm font-medium">{metrics.projectTypeBreakdown.exterior}%</span>
                </div>
                <Progress value={metrics.projectTypeBreakdown.exterior} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Both</span>
                  <span className="text-sm font-medium">{metrics.projectTypeBreakdown.both}%</span>
                </div>
                <Progress value={metrics.projectTypeBreakdown.both} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.jobCount} project{client.jobCount > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(client.totalSpent)}</p>
                  </div>
                </div>
              ))}
              {metrics.topClients.length === 0 && (
                <p className="text-gray-500 text-center py-4">No client data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}