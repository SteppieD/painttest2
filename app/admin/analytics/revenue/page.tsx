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
          <p>No revenue data available yet.</p>
        </div>
      </div>
    );
  }

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
              <div>
                <h1>Revenue Analytics</h1>
                <p>Track revenue performance and growth trends</p>
              </div>
            </div>
            
            {/* Timeframe selector */}
            <div>
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

      <div>
        {/* Key Revenue Metrics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <DollarSign />
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(metrics.totalRevenue)}</div>
              <div>
                {(() => {
                  const GrowthIcon = getGrowthIcon(metrics.revenueGrowth.monthly);
                  return (
                    <>
                      <GrowthIcon`} />
                      <span>
                        {formatPercentage(metrics.revenueGrowth.monthly)} vs last month
                      </span>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avg Quote Value</CardTitle>
              <Target />
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(metrics.avgQuoteValue)}</div>
              <p>
                From {metrics.totalQuotes} total quotes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <TrendingUp />
            </CardHeader>
            <CardContent>
              <div>{metrics.conversionRate.toFixed(1)}%</div>
              <Progress value={metrics.conversionRate} />
              <p>
                {metrics.acceptedQuotes} of {metrics.totalQuotes} quotes accepted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <Calendar />
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(metrics.monthlyRevenue)}</div>
              <div>
                {(() => {
                  const GrowthIcon = getGrowthIcon(metrics.revenueGrowth.monthly);
                  return (
                    <>
                      <GrowthIcon`} />
                      <span>
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
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Project Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  <span>Interior Projects</span>
                  <span>{formatCurrency(metrics.projectTypeRevenue.interior)}</span>
                </div>
                <Progress 
                  value={(metrics.projectTypeRevenue.interior / metrics.totalRevenue) * 100} 
                 
                />
              </div>
              <div>
                <div>
                  <span>Exterior Projects</span>
                  <span>{formatCurrency(metrics.projectTypeRevenue.exterior)}</span>
                </div>
                <Progress 
                  value={(metrics.projectTypeRevenue.exterior / metrics.totalRevenue) * 100} 
                 
                />
              </div>
              <div>
                <div>
                  <span>Interior + Exterior</span>
                  <span>{formatCurrency(metrics.projectTypeRevenue.both)}</span>
                </div>
                <Progress 
                  value={(metrics.projectTypeRevenue.both / metrics.totalRevenue) * 100} 
                 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          {/* Monthly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.monthlyBreakdown.map((month, index) => (
                  <div key={index}>
                    <div>
                      <p>{month.month}</p>
                      <p>{month.quotes} quotes</p>
                    </div>
                    <div>
                      <p>{formatCurrency(month.revenue)}</p>
                      <p>Avg: {formatCurrency(month.avgValue)}</p>
                    </div>
                  </div>
                ))}
                {metrics.monthlyBreakdown.length === 0 && (
                  <p>No monthly data available</p>
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
              <div>
                {metrics.topCustomers.map((customer, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <span>#{index + 1}</span>
                      </div>
                      <div>
                        <p>{customer.company_name}</p>
                        <p>{customer.quotes} quotes</p>
                      </div>
                    </div>
                    <div>
                      <p>{formatCurrency(customer.revenue)}</p>
                    </div>
                  </div>
                ))}
                {metrics.topCustomers.length === 0 && (
                  <p>No customer data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  {formatPercentage(metrics.revenueGrowth.monthly)}
                </div>
                <p>Monthly Growth</p>
              </div>
              <div>
                <div>
                  {formatCurrency(metrics.dailyRevenue)}
                </div>
                <p>Daily Average</p>
              </div>
              <div>
                <div>
                  {metrics.pendingQuotes}
                </div>
                <p>Pending Quotes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}