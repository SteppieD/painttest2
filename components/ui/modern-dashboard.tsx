"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Clock, 
  Users, 
  Calculator, 
  Zap,
  ArrowRight,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
interface DashboardData {
  revenue: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  quotes: {
    total: number;
    pending: number;
    accepted: number;
    thisWeek: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
  efficiency: {
    avgQuoteTime: number; // in minutes
    completionRate: number; // percentage
    revenue_per_hour: number;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  color: string;
  bgColor: string;
  isPopular?: boolean;
}

interface RecentQuote {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  projectType: string;
}

interface ModernDashboardProps {
  onCreateQuote: () => void;
  onCreateExpressQuote: () => void;
  onViewQuotes: () => void;
  onViewInsights: () => void;
}

// Mock data - replace with real API calls
const MOCK_DASHBOARD_DATA: DashboardData = {
  revenue: {
    thisMonth: 28450,
    lastMonth: 22100,
    growth: 28.7
  },
  quotes: {
    total: 24,
    pending: 8,
    accepted: 14,
    thisWeek: 6
  },
  customers: {
    total: 18,
    new: 3,
    returning: 15
  },
  efficiency: {
    avgQuoteTime: 3.2,
    completionRate: 85,
    revenue_per_hour: 890
  }
};

const RECENT_QUOTES: RecentQuote[] = [
  {
    id: "Q-001",
    customerName: "Sarah Johnson",
    amount: 3450,
    status: 'pending',
    createdAt: '2 hours ago',
    projectType: 'Interior - 3 rooms'
  },
  {
    id: "Q-002", 
    customerName: "Mike Rodriguez",
    amount: 5200,
    status: 'accepted',
    createdAt: '1 day ago',
    projectType: 'Whole house interior'
  },
  {
    id: "Q-003",
    customerName: "Emily Chen", 
    amount: 1890,
    status: 'pending',
    createdAt: '2 days ago',
    projectType: 'Kitchen refresh'
  },
  {
    id: "Q-004",
    customerName: "David Smith",
    amount: 2750,
    status: 'accepted',
    createdAt: '3 days ago',
    projectType: 'Bathroom suite'
  }
];

export function ModernDashboard({ 
  onCreateQuote, 
  onCreateExpressQuote, 
  onViewQuotes, 
  onViewInsights 
}: ModernDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(MOCK_DASHBOARD_DATA);
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>(RECENT_QUOTES);

  const quickActions: QuickAction[] = [
    {
      id: 'express-quote',
      title: 'Express Quote',
      description: 'Create quotes in 30 seconds',
      icon: Zap,
      action: onCreateExpressQuote,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      isPopular: true
    },
    {
      id: 'full-quote',
      title: 'Custom Quote',
      description: 'Full guided quote creation',
      icon: Calculator,
      action: onCreateQuote,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'view-quotes',
      title: 'All Quotes',
      description: 'Manage existing quotes',
      icon: FileText,
      action: onViewQuotes,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'insights',
      title: 'Business Insights',
      description: 'Analytics and trends',
      icon: TrendingUp,
      action: onViewInsights,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 />;
      case 'pending': return <Clock />;
      case 'rejected': return <AlertCircle />;
      default: return <Clock />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p>Your painting business at a glance</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2>Quick Actions</h2>
        <div>
          {quickActions.map((action) => (
            <Card 
              key={action.id}
             
              onClick={action.action}
            >
              <CardContent>
                <div>
                  <div>
                    <div>
                      <action.icon />
                    </div>
                    {action.isPopular && (
                      <Badge>Popular</Badge>
                    )}
                  </div>
                  <div>
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                  <ArrowRight />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2>Key Metrics</h2>
        <div>
          {/* Revenue */}
          <Card>
            <CardContent>
              <div>
                <div>
                  <DollarSign />
                </div>
                <div>
                  <p>Revenue This Month</p>
                  <p>
                    ${dashboardData.revenue.thisMonth.toLocaleString()}
                  </p>
                  <div>
                    <TrendingUp />
                    <span>
                      +{dashboardData.revenue.growth}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card>
            <CardContent>
              <div>
                <div>
                  <FileText />
                </div>
                <div>
                  <p>Active Quotes</p>
                  <p>
                    {dashboardData.quotes.total}
                  </p>
                  <p>
                    {dashboardData.quotes.pending} pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customers */}
          <Card>
            <CardContent>
              <div>
                <div>
                  <Users />
                </div>
                <div>
                  <p>Total Customers</p>
                  <p>
                    {dashboardData.customers.total}
                  </p>
                  <p>
                    {dashboardData.customers.new} new this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency */}
          <Card>
            <CardContent>
              <div>
                <div>
                  <Target />
                </div>
                <div>
                  <p>Avg Quote Time</p>
                  <p>
                    {dashboardData.efficiency.avgQuoteTime}m
                  </p>
                  <p>
                    {dashboardData.efficiency.completionRate}% completion rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div>
          <h2>Recent Quotes</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewQuotes}
           
          >
            View All
          </Button>
        </div>

        <Card>
          <CardContent>
            <div>
              {recentQuotes.map((quote) => (
                <div key={quote.id}>
                  <div>
                    <div>
                      <div>
                        <h4>{quote.customerName}</h4>
                        <Badge>
                          <div>
                            {getStatusIcon(quote.status)}
                            <span>{quote.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p>{quote.projectType}</p>
                      <p>{quote.createdAt}</p>
                    </div>
                    <div>
                      <p>
                        ${quote.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Preview */}
      <div>
        <h2>Business Insights</h2>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <span>This Month</span>
                  <span>${dashboardData.revenue.thisMonth.toLocaleString()}</span>
                </div>
                <div>
                  <span>Last Month</span>
                  <span>${dashboardData.revenue.lastMonth.toLocaleString()}</span>
                </div>
                <div>
                  <span>Growth Rate</span>
                  <span>+{dashboardData.revenue.growth}%</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewInsights}
               
              >
                View Detailed Insights
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <span>Revenue per Hour</span>
                  <span>${dashboardData.efficiency.revenue_per_hour}</span>
                </div>
                <div>
                  <span>Quote Acceptance</span>
                  <span>{Math.round((dashboardData.quotes.accepted / dashboardData.quotes.total) * 100)}%</span>
                </div>
                <div>
                  <span>Avg Quote Time</span>
                  <span>{dashboardData.efficiency.avgQuoteTime} min</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewInsights}
               
              >
                Optimize Performance
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}