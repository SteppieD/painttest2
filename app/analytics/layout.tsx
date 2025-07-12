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
      <div>
        <div>
          <div></div>
          <p>Loading analytics...</p>
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
              <button
                onClick={() => router.push("/dashboard")}
               
              >
                <ArrowLeft />
              </button>
              <div>
                <div>
                  <BarChart3 />
                </div>
                <div>
                  <h1>Business Intelligence</h1>
                  <p>{companyInfo?.company_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div>
        <div>
          <div>
            {navigationItems.map((item) => {
              const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                 `}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}