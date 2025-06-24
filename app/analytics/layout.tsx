"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calculator,
  Target,
  PieChart,
  Calendar,
  ArrowLeft
} from "lucide-react";

interface AnalyticsLayoutProps {
  children: React.ReactNode;
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const router = useRouter();
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (Date.now() - company.loginTime > 24 * 60 * 60 * 1000) {
          localStorage.removeItem("paintquote_company");
          router.push("/access-code");
          return;
        }
        setCompanyInfo(company);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router]);

  const navigationItems = [
    {
      name: "Command Center",
      href: "/analytics",
      icon: BarChart3,
      description: "Executive dashboard with key metrics"
    },
    {
      name: "Revenue Analytics",
      href: "/analytics/revenue",
      icon: DollarSign,
      description: "Deep revenue analysis and forecasting"
    },
    {
      name: "Project Performance",
      href: "/analytics/projects",
      icon: Calculator,
      description: "Individual project profitability"
    },
    {
      name: "Customer Intelligence",
      href: "/analytics/customers",
      icon: Users,
      description: "Customer behavior and value analysis"
    },
    {
      name: "Operations",
      href: "/analytics/operations",
      icon: Target,
      description: "Process efficiency and optimization"
    },
    {
      name: "Forecasting",
      href: "/analytics/forecasting",
      icon: TrendingUp,
      description: "Predictive analytics and planning"
    },
    {
      name: "Cost Management",
      href: "/analytics/costs",
      icon: PieChart,
      description: "Cost control and profit optimization"
    },
    {
      name: "Competitive Intel",
      href: "/analytics/competitive",
      icon: Calendar,
      description: "Market positioning and analysis"
    }
  ];

  if (!companyInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Business Intelligence</h1>
                  <p className="text-sm text-gray-500">{companyInfo?.company_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((item) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}