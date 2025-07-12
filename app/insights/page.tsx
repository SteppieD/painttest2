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
      <div>
        <div></div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div>
        <Button onClick={() => router.back()} variant="ghost" size="sm">
          <ArrowLeft />
          Back
        </Button>
        <div>
          <p>No data available yet. Start creating quotes!</p>
        </div>
      </div>
    );
  }

  const revenueGrowth = getGrowthPercentage(metrics.revenueThisMonth, metrics.revenueLastMonth);
  const quotesGrowth = getGrowthPercentage(metrics.quotesThisMonth, metrics.quotesLastMonth);

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <Button onClick={() => router.back()} variant="ghost" size="sm">
                <ArrowLeft />
                Back
              </Button>
              <h1>Business Insights</h1>
            </div>
            
            {/* Timeframe selector */}
            <div>
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

      <div>
        {/* Key Metrics Grid */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Revenue This Month</CardTitle>
              <DollarSign />
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(metrics.revenueThisMonth)}</div>
              <div>
                {revenueGrowth >= 0 ? (
                  <TrendingUp />
                ) : (
                  <TrendingDown />
                )}
                <span>
                  {Math.abs(revenueGrowth)}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quotes This Month</CardTitle>
              <Calendar />
            </CardHeader>
            <CardContent>
              <div>{metrics.quotesThisMonth}</div>
              <div>
                {quotesGrowth >= 0 ? (
                  <TrendingUp />
                ) : (
                  <TrendingDown />
                )}
                <span>
                  {Math.abs(quotesGrowth)}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Win Rate</CardTitle>
              <Target />
            </CardHeader>
            <CardContent>
              <div>{metrics.winRate.toFixed(0)}%</div>
              <Progress value={metrics.winRate} />
              <p>
                {metrics.winRate >= 50 ? "Above average!" : "Room to improve"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avg Quote Value</CardTitle>
              <Award />
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(metrics.averageQuoteValue)}</div>
              <p>
                Avg margin: {metrics.averageMargin.toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Project Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Project Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  <span>Interior</span>
                  <span>{metrics.projectTypeBreakdown.interior}%</span>
                </div>
                <Progress value={metrics.projectTypeBreakdown.interior} />
              </div>
              <div>
                <div>
                  <span>Exterior</span>
                  <span>{metrics.projectTypeBreakdown.exterior}%</span>
                </div>
                <Progress value={metrics.projectTypeBreakdown.exterior} />
              </div>
              <div>
                <div>
                  <span>Both</span>
                  <span>{metrics.projectTypeBreakdown.both}%</span>
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
            <div>
              {metrics.topClients.map((client, index) => (
                <div key={index}>
                  <div>
                    <p>{client.name}</p>
                    <p>{client.jobCount} project{client.jobCount > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p>{formatCurrency(client.totalSpent)}</p>
                  </div>
                </div>
              ))}
              {metrics.topClients.length === 0 && (
                <p>No client data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}