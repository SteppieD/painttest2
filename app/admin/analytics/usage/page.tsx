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
      case 'mobile': return <Smartphone />;
      case 'tablet': return <Monitor />;
      default: return <Monitor />;
    }
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
          <p>No usage data available yet.</p>
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
                <h1>Usage Analytics</h1>
                <p>Monitor user behavior and platform engagement</p>
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
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Key Usage Metrics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <Users />
            </CardHeader>
            <CardContent>
              <div>{metrics.activeUsers}</div>
              <p>
                {metrics.newUsers} new users this period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Sessions</CardTitle>
              <Activity />
            </CardHeader>
            <CardContent>
              <div>{metrics.totalSessions}</div>
              <p>
                Avg: {formatDuration(metrics.avgSessionDuration)} per session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quotes Created</CardTitle>
              <MousePointer />
            </CardHeader>
            <CardContent>
              <div>{metrics.quotesCreated}</div>
              <p>
                {metrics.avgQuotesPerUser.toFixed(1)} per user average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avg Session Time</CardTitle>
              <Clock />
            </CardHeader>
            <CardContent>
              <div>{formatDuration(metrics.avgSessionDuration)}</div>
              <p>
                User engagement metric
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  <span>Quote Creation</span>
                  <span>{metrics.featureUsage.quoteCreation} uses</span>
                </div>
                <Progress value={85} />
              </div>
              <div>
                <div>
                  <span>Dashboard</span>
                  <span>{metrics.featureUsage.dashboard} views</span>
                </div>
                <Progress value={95} />
              </div>
              <div>
                <div>
                  <span>Insights</span>
                  <span>{metrics.featureUsage.insights} views</span>
                </div>
                <Progress value={45} />
              </div>
              <div>
                <div>
                  <span>Settings</span>
                  <span>{metrics.featureUsage.settings} views</span>
                </div>
                <Progress value={30} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    <Monitor />
                    <span>Desktop</span>
                  </div>
                  <div>
                    <span>{metrics.deviceBreakdown.desktop}</span>
                    <span>
                      ({formatPercentage(metrics.deviceBreakdown.desktop, metrics.totalUsers)}%)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={parseFloat(formatPercentage(metrics.deviceBreakdown.desktop, metrics.totalUsers))} 
                 
                />

                <div>
                  <div>
                    <Smartphone />
                    <span>Mobile</span>
                  </div>
                  <div>
                    <span>{metrics.deviceBreakdown.mobile}</span>
                    <span>
                      ({formatPercentage(metrics.deviceBreakdown.mobile, metrics.totalUsers)}%)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={parseFloat(formatPercentage(metrics.deviceBreakdown.mobile, metrics.totalUsers))} 
                 
                />

                <div>
                  <div>
                    <Monitor />
                    <span>Tablet</span>
                  </div>
                  <div>
                    <span>{metrics.deviceBreakdown.tablet}</span>
                    <span>
                      ({formatPercentage(metrics.deviceBreakdown.tablet, metrics.totalUsers)}%)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={parseFloat(formatPercentage(metrics.deviceBreakdown.tablet, metrics.totalUsers))} 
                 
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
              <div>
                {Object.entries(metrics.browserBreakdown).map(([browser, count]) => (
                  <div key={browser}>
                    <div>
                      <Globe />
                      <span>{browser}</span>
                    </div>
                    <div>
                      <span>{count}</span>
                      <span>
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
        <Card>
          <CardHeader>
            <CardTitle>User Engagement Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  {metrics.userEngagement.highlyActive}
                </div>
                <Badge>
                  Highly Active
                </Badge>
                <p>5+ quotes/month</p>
              </div>
              <div>
                <div>
                  {metrics.userEngagement.moderatelyActive}
                </div>
                <Badge>
                  Moderately Active
                </Badge>
                <p>2-4 quotes/month</p>
              </div>
              <div>
                <div>
                  {metrics.userEngagement.lowActivity}
                </div>
                <Badge>
                  Low Activity
                </Badge>
                <p>1 quote/month</p>
              </div>
              <div>
                <div>
                  {metrics.userEngagement.inactive}
                </div>
                <Badge>
                  Inactive
                </Badge>
                <p>No activity</p>
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
            <div>
              {metrics.userActivity.slice(-7).map((day, index) => (
                <div key={index}>
                  <div>
                    <p>{day.date}</p>
                    <p>{day.sessions} sessions</p>
                  </div>
                  <div>
                    <div>
                      <div>
                        <p>{day.activeUsers}</p>
                        <p>Active</p>
                      </div>
                      <div>
                        <p>{day.newUsers}</p>
                        <p>New</p>
                      </div>
                      <div>
                        <p>{day.quotesCreated}</p>
                        <p>Quotes</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {metrics.userActivity.length === 0 && (
                <p>No activity data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}