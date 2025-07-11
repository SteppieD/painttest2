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
      <div>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Loading business intelligence...</p>
        </div>
        
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div></div>
              <div></div>
              <div></div>
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
    <div>
      {/* Header */}
      <div>
        <h1>Admin Dashboard</h1>
        <p>Business intelligence and key performance metrics</p>
      </div>

      {/* Metric Cards */}
      <div>
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          const isPositiveTrend = typeof metric.trend === 'number' && metric.trend > 0;
          
          return (
            <div 
              key={index} 
             
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div>
                <div>
                  <p>{metric.title}</p>
                  <p>
                    {metric.value}
                  </p>
                  <p>
                    {metric.subtitle}
                  </p>
                </div>
                <div`}>
                  <Icon />
                </div>
              </div>
              
              {typeof metric.trend === 'number' && (
                <div>
                  {isPositiveTrend ? (
                    <TrendingUp />
                  ) : (
                    <TrendingDown />
                  )}
                  <span`}>
                    {metric.trend}{metric.trendLabel.includes('rate') ? '%' : ''}
                  </span>
                  <span>{metric.trendLabel}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <div>
          <div>
            <h3>
              <div>
                <Activity />
              </div>
              Quick Actions
            </h3>
          </div>
          <div>
            <button>
              <div>Create New Access Code</div>
              <div>Generate access codes for new customers</div>
            </button>
            <button>
              <div>View Customer Analytics</div>
              <div>Analyze customer behavior and usage</div>
            </button>
            <button>
              <div>Export Reports</div>
              <div>Download business intelligence reports</div>
            </button>
          </div>
        </div>

        <div>
          <div>
            <h3>
              <div>
                <Building />
              </div>
              Recent Activity
            </h3>
          </div>
          <div>
            <div>
              <div>
                <div>
                  <div>New customer signup</div>
                  <div>Elite Contractors joined</div>
                </div>
                <div>2 hours ago</div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div>Quote accepted</div>
                  <div>$3,932 project confirmed</div>
                </div>
                <div>4 hours ago</div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div>Access code created</div>
                  <div>5 new trial codes generated</div>
                </div>
                <div>1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div>
        <div>
          <h3>System Status</h3>
        </div>
        <div>
          <div>
            <div>
              <div></div>
            </div>
            <div>Database</div>
            <div>Operational</div>
          </div>
          <div>
            <div>
              <div></div>
            </div>
            <div>API Services</div>
            <div>Operational</div>
          </div>
          <div>
            <div>
              <div></div>
            </div>
            <div>Authentication</div>
            <div>Operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}