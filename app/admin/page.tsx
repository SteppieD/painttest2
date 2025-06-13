"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Building, 
  FileText, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Key,
  Activity
} from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalQuotes: number;
  quotesToday: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeAccessCodes: number;
  totalAccessCodes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/analytics/overview');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Admin portal overview and key metrics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      subtitle: `${stats?.activeCustomers || 0} active`,
      icon: Users,
      trend: stats?.activeCustomers && stats?.totalCustomers ? 
        Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0,
      trendLabel: "active rate",
      color: "text-blue-600"
    },
    {
      title: "Total Quotes",
      value: stats?.totalQuotes || 0,
      subtitle: `${stats?.quotesToday || 0} today`,
      icon: FileText,
      trend: stats?.quotesToday || 0,
      trendLabel: "today",
      color: "text-green-600"
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      subtitle: `${formatCurrency(stats?.revenueThisMonth || 0)} this month`,
      icon: DollarSign,
      trend: stats?.revenueThisMonth || 0,
      trendLabel: "this month",
      color: "text-purple-600"
    },
    {
      title: "Access Codes",
      value: stats?.totalAccessCodes || 0,
      subtitle: `${stats?.activeAccessCodes || 0} active`,
      icon: Key,
      trend: stats?.activeAccessCodes && stats?.totalAccessCodes ?
        Math.round((stats.activeAccessCodes / stats.totalAccessCodes) * 100) : 0,
      trendLabel: "active rate",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Admin portal overview and key metrics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const isPositiveTrend = typeof metric.trend === 'number' && metric.trend > 0;
          
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {metric.subtitle}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                
                {typeof metric.trend === 'number' && (
                  <div className="flex items-center mt-4">
                    {isPositiveTrend ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-gray-400 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      isPositiveTrend ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {metric.trend}{metric.trendLabel.includes('rate') ? '%' : ''}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">{metric.trendLabel}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Create New Access Code</div>
              <div className="text-sm text-gray-500">Generate access codes for new customers</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">View Customer Analytics</div>
              <div className="text-sm text-gray-500">Analyze customer behavior and usage</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="font-medium">Export Reports</div>
              <div className="text-sm text-gray-500">Download business intelligence reports</div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New customer signup</div>
                  <div className="text-sm text-gray-500">Elite Contractors joined</div>
                </div>
                <div className="text-sm text-gray-400">2 hours ago</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Quote accepted</div>
                  <div className="text-sm text-gray-500">$3,932 project confirmed</div>
                </div>
                <div className="text-sm text-gray-400">4 hours ago</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Access code created</div>
                  <div className="text-sm text-gray-500">5 new trial codes generated</div>
                </div>
                <div className="text-sm text-gray-400">1 day ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="font-medium">Database</div>
              <div className="text-sm text-gray-500">Operational</div>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="font-medium">API Services</div>
              <div className="text-sm text-gray-500">Operational</div>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="font-medium">Authentication</div>
              <div className="text-sm text-gray-500">Operational</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}