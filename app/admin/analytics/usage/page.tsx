"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Activity, Users, MousePointer, Clock, Smartphone, Monitor, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

interface UsageMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  avgSessionDuration: number;
  totalSessions: number;
  quotesCreated: number;
  avgQuotesPerUser: number;
  featureUsage: {
    dashboard: number;
    quoteCreation: number;
    settings: number;
    insights: number;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browserBreakdown: {
    chrome: number;
    safari: number;
    firefox: number;
    edge: number;
    other: number;
  };
  userActivity: Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
    sessions: number;
    quotesCreated: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    avgTime: number;
  }>;
  userEngagement: {
    highlyActive: number;
    moderatelyActive: number;
    lowActivity: number;
    inactive: number;
  };
}

export default function UsageAnalyticsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const loadUsageMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/analytics/usage?timeframe=${timeframe}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error loading usage metrics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    loadUsageMetrics();
  }, [loadUsageMetrics]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatPercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
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
          <p className="text-gray-600">No usage data available yet.</p>
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
                <h1 className="text-2xl font-bold">Usage Analytics</h1>
                <p className="text-gray-600">Monitor user behavior and platform engagement</p>
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Key Usage Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.newUsers} new users this period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Avg: {formatDuration(metrics.avgSessionDuration)} per session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quotes Created</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.quotesCreated}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.avgQuotesPerUser.toFixed(1)} per user average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(metrics.avgSessionDuration)}</div>
              <p className="text-xs text-muted-foreground">
                User engagement metric
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Quote Creation</span>
                  <span className="text-sm font-medium">{metrics.featureUsage.quoteCreation} uses</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Dashboard</span>
                  <span className="text-sm font-medium">{metrics.featureUsage.dashboard} views</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Insights</span>
                  <span className="text-sm font-medium">{metrics.featureUsage.insights} views</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Settings</span>
                  <span className="text-sm font-medium">{metrics.featureUsage.settings} views</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metrics.deviceBreakdown.desktop}</span>
                    <span className="text-xs text-gray-500">
                      ({formatPercentage(metrics.deviceBreakdown.desktop, metrics.totalUsers)}%)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={parseFloat(formatPercentage(metrics.deviceBreakdown.desktop, metrics.totalUsers))} 
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Mobile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metrics.deviceBreakdown.mobile}</span>
                    <span className="text-xs text-gray-500">
                      ({formatPercentage(metrics.deviceBreakdown.mobile, metrics.totalUsers)}%)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={parseFloat(formatPercentage(metrics.deviceBreakdown.mobile, metrics.totalUsers))} 
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Tablet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metrics.deviceBreakdown.tablet}</span>
                    <span className="text-xs text-gray-500">
                      ({formatPercentage(metrics.deviceBreakdown.tablet, metrics.totalUsers)}%)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={parseFloat(formatPercentage(metrics.deviceBreakdown.tablet, metrics.totalUsers))} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Browser Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Browser Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(metrics.browserBreakdown).map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <span className="text-sm capitalize">{browser}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-gray-500">
                        ({formatPercentage(count, metrics.totalUsers)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Engagement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Engagement Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {metrics.userEngagement.highlyActive}
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Highly Active
                </Badge>
                <p className="text-xs text-gray-500 mt-1">5+ quotes/month</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {metrics.userEngagement.moderatelyActive}
                </div>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  Moderately Active
                </Badge>
                <p className="text-xs text-gray-500 mt-1">2-4 quotes/month</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {metrics.userEngagement.lowActivity}
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  Low Activity
                </Badge>
                <p className="text-xs text-gray-500 mt-1">1 quote/month</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {metrics.userEngagement.inactive}
                </div>
                <Badge className="bg-gray-100 text-gray-800 text-xs">
                  Inactive
                </Badge>
                <p className="text-xs text-gray-500 mt-1">No activity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.userActivity.slice(-7).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-sm text-gray-600">{day.sessions} sessions</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-blue-600">{day.activeUsers}</p>
                        <p className="text-xs text-gray-500">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">{day.newUsers}</p>
                        <p className="text-xs text-gray-500">New</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-purple-600">{day.quotesCreated}</p>
                        <p className="text-xs text-gray-500">Quotes</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {metrics.userActivity.length === 0 && (
                <p className="text-gray-500 text-center py-4">No activity data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}