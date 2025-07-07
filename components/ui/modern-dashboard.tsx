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
import { cn } from "@/lib/utils";

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
      case 'accepted': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="design-container max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="design-heading-1">Dashboard</h1>
        <p className="design-body">Your painting business at a glance</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="design-heading-3 mb-4">Quick Actions</h2>
        <div className="design-grid design-grid-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card 
              key={action.id}
              className="design-card design-card-interactive cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="design-stack">
                  <div className="design-inline">
                    <div className={cn("p-3 rounded-lg", action.bgColor)}>
                      <action.icon className={cn("w-6 h-6", action.color)} />
                    </div>
                    {action.isPopular && (
                      <Badge className="bg-blue-600 text-white">Popular</Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8">
        <h2 className="design-heading-3 mb-4">Key Metrics</h2>
        <div className="design-grid design-grid-2 lg:grid-cols-4">
          {/* Revenue */}
          <Card className="design-card">
            <CardContent className="p-6">
              <div className="design-inline">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Revenue This Month</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${dashboardData.revenue.thisMonth.toLocaleString()}
                  </p>
                  <div className="design-inline mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      +{dashboardData.revenue.growth}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotes */}
          <Card className="design-card">
            <CardContent className="p-6">
              <div className="design-inline">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Active Quotes</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.quotes.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dashboardData.quotes.pending} pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customers */}
          <Card className="design-card">
            <CardContent className="p-6">
              <div className="design-inline">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.customers.total}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dashboardData.customers.new} new this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency */}
          <Card className="design-card">
            <CardContent className="p-6">
              <div className="design-inline">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-500">Avg Quote Time</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {dashboardData.efficiency.avgQuoteTime}m
                  </p>
                  <p className="text-sm text-gray-500">
                    {dashboardData.efficiency.completionRate}% completion rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="design-inline mb-4">
          <h2 className="design-heading-3">Recent Quotes</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onViewQuotes}
            className="design-button design-button-secondary design-button-small"
          >
            View All
          </Button>
        </div>

        <Card className="design-card">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="design-inline">
                    <div className="flex-1">
                      <div className="design-inline mb-2">
                        <h4 className="font-medium text-gray-900">{quote.customerName}</h4>
                        <Badge className={cn("ml-2", getStatusColor(quote.status))}>
                          <div className="design-inline">
                            {getStatusIcon(quote.status)}
                            <span className="ml-1 capitalize">{quote.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{quote.projectType}</p>
                      <p className="text-xs text-gray-400">{quote.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
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
      <div className="mb-8">
        <h2 className="design-heading-3 mb-4">Business Insights</h2>
        <div className="design-grid design-grid-2">
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="design-inline">
                  <span className="text-sm text-gray-500">This Month</span>
                  <span className="font-semibold">${dashboardData.revenue.thisMonth.toLocaleString()}</span>
                </div>
                <div className="design-inline">
                  <span className="text-sm text-gray-500">Last Month</span>
                  <span className="font-semibold">${dashboardData.revenue.lastMonth.toLocaleString()}</span>
                </div>
                <div className="design-inline">
                  <span className="text-sm text-gray-500">Growth Rate</span>
                  <span className="font-semibold text-green-600">+{dashboardData.revenue.growth}%</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewInsights}
                className="design-button design-button-secondary design-button-small w-full mt-4"
              >
                View Detailed Insights
              </Button>
            </CardContent>
          </Card>

          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="design-inline">
                  <span className="text-sm text-gray-500">Revenue per Hour</span>
                  <span className="font-semibold">${dashboardData.efficiency.revenue_per_hour}</span>
                </div>
                <div className="design-inline">
                  <span className="text-sm text-gray-500">Quote Acceptance</span>
                  <span className="font-semibold">{Math.round((dashboardData.quotes.accepted / dashboardData.quotes.total) * 100)}%</span>
                </div>
                <div className="design-inline">
                  <span className="text-sm text-gray-500">Avg Quote Time</span>
                  <span className="font-semibold">{dashboardData.efficiency.avgQuoteTime} min</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewInsights}
                className="design-button design-button-secondary design-button-small w-full mt-4"
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