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
      console.log('Loading dashboard stats...');
      const response = await fetch('/api/admin/analytics/overview');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data:', data);
        setStats(data);
      } else {
        console.error('Response not ok:', response.status, response.statusText);
        // Set default stats if API fails
        setStats({
          totalCustomers: 0,
          activeCustomers: 0,
          totalQuotes: 0,
          quotesToday: 0,
          totalRevenue: 0,
          revenueThisMonth: 0,
          activeAccessCodes: 0,
          totalAccessCodes: 0
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Set default stats if fetch fails
      setStats({
        totalCustomers: 0,
        activeCustomers: 0,
        totalQuotes: 0,
        quotesToday: 0,
        totalRevenue: 0,
        revenueThisMonth: 0,
        activeAccessCodes: 0,
        totalAccessCodes: 0
      });
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
        <div className="neomorphism-card-accessible">
          <h1 className="text-3xl font-bold text-gray-900 neomorphism-text">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading business intelligence...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="neomorphism-skeleton p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
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
      <div className="neomorphism-card-accessible animate-neomorphism-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 neomorphism-text">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Business intelligence and key performance metrics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const isPositiveTrend = typeof metric.trend === 'number' && metric.trend > 0;
          
          return (
            <div 
              key={index} 
              className="neomorphism-metric-card animate-neomorphism-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 neomorphism-text">
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {metric.subtitle}
                  </p>
                </div>
                <div className={`neomorphism-accessible-subtle p-3 rounded-full ${metric.color}`}>
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
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neomorphism-card-accessible animate-neomorphism-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 neomorphism-text">
              <div className="neomorphism-accessible-subtle p-2 rounded-xl">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              Quick Actions
            </h3>
          </div>
          <div className="space-y-3">
            <button className="neomorphism-button-enhanced w-full text-left p-4">
              <div className="font-medium">Create New Access Code</div>
              <div className="text-sm text-gray-500 mt-1">Generate access codes for new customers</div>
            </button>
            <button className="neomorphism-button-enhanced w-full text-left p-4">
              <div className="font-medium">View Customer Analytics</div>
              <div className="text-sm text-gray-500 mt-1">Analyze customer behavior and usage</div>
            </button>
            <button className="neomorphism-button-enhanced w-full text-left p-4">
              <div className="font-medium">Export Reports</div>
              <div className="text-sm text-gray-500 mt-1">Download business intelligence reports</div>
            </button>
          </div>
        </div>

        <div className="neomorphism-card-accessible animate-neomorphism-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 neomorphism-text">
              <div className="neomorphism-accessible-subtle p-2 rounded-xl">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              Recent Activity
            </h3>
          </div>
          <div className="space-y-4">
            <div className="neomorphism-accessible-subtle p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New customer signup</div>
                  <div className="text-sm text-gray-500">Elite Contractors joined</div>
                </div>
                <div className="neomorphism-badge-enhanced text-xs">2 hours ago</div>
              </div>
            </div>
            <div className="neomorphism-accessible-subtle p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Quote accepted</div>
                  <div className="text-sm text-gray-500">$3,932 project confirmed</div>
                </div>
                <div className="neomorphism-badge-enhanced text-xs">4 hours ago</div>
              </div>
            </div>
            <div className="neomorphism-accessible-subtle p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Access code created</div>
                  <div className="text-sm text-gray-500">5 new trial codes generated</div>
                </div>
                <div className="neomorphism-badge-enhanced text-xs">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="neomorphism-card-accessible animate-neomorphism-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 neomorphism-text">System Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center neomorphism-accessible-subtle p-4 rounded-xl">
            <div className="neomorphism-accessible-subtle w-4 h-4 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="font-medium">Database</div>
            <div className="text-sm text-gray-500">Operational</div>
          </div>
          <div className="text-center neomorphism-accessible-subtle p-4 rounded-xl">
            <div className="neomorphism-accessible-subtle w-4 h-4 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="font-medium">API Services</div>
            <div className="text-sm text-gray-500">Operational</div>
          </div>
          <div className="text-center neomorphism-accessible-subtle p-4 rounded-xl">
            <div className="neomorphism-accessible-subtle w-4 h-4 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div className="font-medium">Authentication</div>
            <div className="text-sm text-gray-500">Operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}