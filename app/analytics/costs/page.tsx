"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  Filter,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Users,
  Settings,
  Zap,
  Award,
  Clock,
  Wrench,
  Truck
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CostMetrics {
  overview: {
    totalCosts: number;
    costPerProject: number;
    profitMargin: number;
    costTrend: number;
    breakdown: {
      materials: number;
      labor: number;
      overhead: number;
      equipment: number;
    };
  };
  materialCosts: {
    totalSpend: number;
    avgCostPerGallon: number;
    wastePercentage: number;
    trend: number;
    categories: Array<{
      category: string;
      spend: number;
      percentage: number;
      trend: number;
      wasteRate: number;
    }>;
    vendors: Array<{
      vendor: string;
      spend: number;
      volumeDiscount: number;
      paymentTerms: string;
      rating: number;
    }>;
  };
  laborCosts: {
    totalSpend: number;
    avgHourlyRate: number;
    efficiency: number;
    overtime: number;
    breakdown: Array<{
      role: string;
      headcount: number;
      avgRate: number;
      totalCost: number;
      efficiency: number;
    }>;
    productivity: Array<{
      metric: string;
      current: number;
      target: number;
      trend: number;
    }>;
  };
  overheadCosts: {
    totalSpend: number;
    percentageOfRevenue: number;
    trend: number;
    categories: Array<{
      category: string;
      monthly: number;
      annual: number;
      percentage: number;
      trend: number;
      optimization: string;
    }>;
    benchmarks: {
      industry: number;
      target: number;
      current: number;
    };
  };
  variance: {
    materialVariance: number;
    laborVariance: number;
    overheadVariance: number;
    totalVariance: number;
    projects: Array<{
      projectId: string;
      customer: string;
      budgeted: number;
      actual: number;
      variance: number;
      variancePercent: number;
      category: string;
    }>;
  };
  optimization: {
    opportunities: Array<{
      id: string;
      title: string;
      category: 'materials' | 'labor' | 'overhead' | 'process';
      impact: number;
      effort: 'low' | 'medium' | 'high';
      timeframe: string;
      description: string;
    }>;
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      savings: number;
      implementation: string;
    }>;
  };
}

export default function CostManagementLaboratory() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<CostMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [viewMode, setViewMode] = useState<'overview' | 'materials' | 'labor' | 'optimization'>('overview');
  const [costCategory, setCostCategory] = useState<string>('all');

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
        loadCostData(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router, timeRange]);

  const loadCostData = async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data for cost analysis
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Calculate cost metrics
      const calculatedMetrics = calculateCostMetrics(quotes);
      setMetrics(calculatedMetrics);

    } catch (error) {
      console.error("Error loading cost data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCostMetrics = (quotes: any[]): CostMetrics => {
    const totalRevenue = quotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
    const projectCount = quotes.length;

    // Cost overview calculations
    const materialCostRate = 0.35; // 35% of revenue
    const laborCostRate = 0.30;    // 30% of revenue
    const overheadCostRate = 0.15;  // 15% of revenue
    const equipmentCostRate = 0.05; // 5% of revenue

    const materialCosts = totalRevenue * materialCostRate;
    const laborCosts = totalRevenue * laborCostRate;
    const overheadCosts = totalRevenue * overheadCostRate;
    const equipmentCosts = totalRevenue * equipmentCostRate;
    const totalCosts = materialCosts + laborCosts + overheadCosts + equipmentCosts;

    const overview = {
      totalCosts,
      costPerProject: projectCount > 0 ? totalCosts / projectCount : 0,
      profitMargin: totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0,
      costTrend: 2.8, // Mock trend data
      breakdown: {
        materials: materialCosts,
        labor: laborCosts,
        overhead: overheadCosts,
        equipment: equipmentCosts
      }
    };

    // Material cost analysis
    const materialCostData = {
      totalSpend: materialCosts,
      avgCostPerGallon: 52.50,
      wastePercentage: 8.2,
      trend: -1.5, // Decreasing costs
      categories: [
        {
          category: 'Interior Paint',
          spend: materialCosts * 0.45,
          percentage: 45,
          trend: -2.1,
          wasteRate: 6.5
        },
        {
          category: 'Exterior Paint',
          spend: materialCosts * 0.35,
          percentage: 35,
          trend: -0.8,
          wasteRate: 9.2
        },
        {
          category: 'Primer',
          spend: materialCosts * 0.12,
          percentage: 12,
          trend: 1.2,
          wasteRate: 7.8
        },
        {
          category: 'Supplies',
          spend: materialCosts * 0.08,
          percentage: 8,
          trend: 0.5,
          wasteRate: 12.1
        }
      ],
      vendors: [
        {
          vendor: 'Sherwin-Williams',
          spend: materialCosts * 0.40,
          volumeDiscount: 15,
          paymentTerms: 'Net 30',
          rating: 4.8
        },
        {
          vendor: 'Benjamin Moore',
          spend: materialCosts * 0.25,
          volumeDiscount: 12,
          paymentTerms: 'Net 30',
          rating: 4.6
        },
        {
          vendor: 'PPG',
          spend: materialCosts * 0.20,
          volumeDiscount: 18,
          paymentTerms: 'Net 15',
          rating: 4.4
        },
        {
          vendor: 'Local Suppliers',
          spend: materialCosts * 0.15,
          volumeDiscount: 8,
          paymentTerms: 'Net 15',
          rating: 4.2
        }
      ]
    };

    // Labor cost analysis
    const laborCostData = {
      totalSpend: laborCosts,
      avgHourlyRate: 28.50,
      efficiency: 89,
      overtime: 12.5, // percentage
      breakdown: [
        {
          role: 'Lead Painter',
          headcount: 4,
          avgRate: 35.00,
          totalCost: laborCosts * 0.40,
          efficiency: 92
        },
        {
          role: 'Painter',
          headcount: 6,
          avgRate: 25.00,
          totalCost: laborCosts * 0.45,
          efficiency: 87
        },
        {
          role: 'Apprentice',
          headcount: 3,
          avgRate: 18.00,
          totalCost: laborCosts * 0.15,
          efficiency: 82
        }
      ],
      productivity: [
        {
          metric: 'Sq Ft per Hour',
          current: 85,
          target: 95,
          trend: 3.2
        },
        {
          metric: 'Setup Time (min)',
          current: 45,
          target: 35,
          trend: -8.5
        },
        {
          metric: 'Cleanup Time (min)',
          current: 35,
          target: 25,
          trend: -12.1
        }
      ]
    };

    // Overhead cost analysis
    const overheadData = {
      totalSpend: overheadCosts,
      percentageOfRevenue: (overheadCosts / totalRevenue) * 100,
      trend: 1.8,
      categories: [
        {
          category: 'Insurance',
          monthly: overheadCosts * 0.25 / 12,
          annual: overheadCosts * 0.25,
          percentage: 25,
          trend: 3.2,
          optimization: 'Shop for competitive rates'
        },
        {
          category: 'Vehicle Costs',
          monthly: overheadCosts * 0.20 / 12,
          annual: overheadCosts * 0.20,
          percentage: 20,
          trend: 2.1,
          optimization: 'Optimize routes and maintenance'
        },
        {
          category: 'Office & Admin',
          monthly: overheadCosts * 0.18 / 12,
          annual: overheadCosts * 0.18,
          percentage: 18,
          trend: 0.8,
          optimization: 'Digital transformation opportunities'
        },
        {
          category: 'Marketing',
          monthly: overheadCosts * 0.15 / 12,
          annual: overheadCosts * 0.15,
          percentage: 15,
          trend: 5.2,
          optimization: 'Measure ROI on all channels'
        },
        {
          category: 'Equipment',
          monthly: overheadCosts * 0.12 / 12,
          annual: overheadCosts * 0.12,
          percentage: 12,
          trend: -1.5,
          optimization: 'Preventive maintenance program'
        },
        {
          category: 'Other',
          monthly: overheadCosts * 0.10 / 12,
          annual: overheadCosts * 0.10,
          percentage: 10,
          trend: 1.2,
          optimization: 'Review all miscellaneous expenses'
        }
      ],
      benchmarks: {
        industry: 18.5, // Industry average overhead percentage
        target: 15.0,   // Target overhead percentage
        current: (overheadCosts / totalRevenue) * 100
      }
    };

    // Variance analysis
    const variance = {
      materialVariance: -2.3, // Under budget
      laborVariance: 4.1,     // Over budget
      overheadVariance: 1.8,  // Over budget
      totalVariance: 3.6,     // Over budget
      projects: quotes.slice(0, 5).map((quote, index) => {
        const budgeted = (quote.quote_amount || quote.final_price || quote.total_revenue || 0) * 0.8;
        const actual = budgeted * (1 + (Math.random() * 0.3 - 0.15)); // ±15% variance
        return {
          projectId: quote.quote_id || `P${index + 1}`,
          customer: quote.customer_name || 'Customer',
          budgeted,
          actual,
          variance: actual - budgeted,
          variancePercent: ((actual - budgeted) / budgeted) * 100,
          category: Math.random() > 0.5 ? 'materials' : 'labor'
        };
      })
    };

    // Optimization opportunities
    const optimization = {
      opportunities: [
        {
          id: 'material-waste',
          title: 'Reduce Material Waste',
          category: 'materials' as const,
          impact: 8500,
          effort: 'medium' as const,
          timeframe: '2-3 months',
          description: 'Implement better paint estimation and waste tracking'
        },
        {
          id: 'bulk-purchasing',
          title: 'Bulk Purchasing Program',
          category: 'materials' as const,
          impact: 12000,
          effort: 'low' as const,
          timeframe: '1 month',
          description: 'Negotiate volume discounts with primary suppliers'
        },
        {
          id: 'labor-efficiency',
          title: 'Improve Labor Efficiency',
          category: 'labor' as const,
          impact: 15000,
          effort: 'high' as const,
          timeframe: '4-6 months',
          description: 'Training programs and process optimization'
        },
        {
          id: 'overhead-reduction',
          title: 'Overhead Cost Reduction',
          category: 'overhead' as const,
          impact: 6500,
          effort: 'medium' as const,
          timeframe: '3-4 months',
          description: 'Audit and optimize recurring expenses'
        }
      ],
      recommendations: [
        {
          priority: 'high' as const,
          title: 'Implement Digital Inventory Management',
          description: 'Track material usage in real-time to reduce waste and improve ordering',
          savings: 10000,
          implementation: 'Deploy inventory app and train team'
        },
        {
          priority: 'high' as const,
          title: 'Negotiate Better Payment Terms',
          description: 'Extend payment terms with suppliers to improve cash flow',
          savings: 5000,
          implementation: 'Review contracts with top 3 vendors'
        },
        {
          priority: 'medium' as const,
          title: 'Optimize Vehicle Routes',
          description: 'Use route optimization software to reduce fuel and time costs',
          savings: 8000,
          implementation: 'Install route planning software'
        },
        {
          priority: 'medium' as const,
          title: 'Preventive Equipment Maintenance',
          description: 'Reduce equipment downtime and repair costs',
          savings: 4500,
          implementation: 'Create maintenance schedule and tracking'
        }
      ]
    };

    return {
      overview,
      materialCosts: materialCostData,
      laborCosts: laborCostData,
      overheadCosts: overheadData,
      variance,
      optimization
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cost analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load cost data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cost Management Laboratory</h1>
          <p className="text-gray-600">Comprehensive cost analysis and optimization insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'materials', label: 'Materials', icon: Package },
              { id: 'labor', label: 'Labor', icon: Users },
              { id: 'optimization', label: 'Optimize', icon: Zap }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === mode.id
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <mode.icon className="w-4 h-4" />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  timeRange === range.id
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Cost Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-800">
                {formatCurrency(metrics.overview.totalCosts)}
              </div>
              <div className="flex items-center gap-2">
                {metrics.overview.costTrend >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-green-600" />
                )}
                <span className={`text-sm font-medium ${
                  metrics.overview.costTrend >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {Math.abs(metrics.overview.costTrend).toFixed(1)}% vs last {timeRange}
                </span>
              </div>
              <div className="text-xs text-red-600">
                {formatCurrency(metrics.overview.costPerProject)} per project
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">
                {metrics.overview.profitMargin.toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">
                Target: 25%
              </div>
              <div className="text-xs text-green-600">
                {metrics.overview.profitMargin >= 25 ? 'Above target' : 'Below target'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Material Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(metrics.materialCosts.totalSpend)}
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {Math.abs(metrics.materialCosts.trend).toFixed(1)}% reduction
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {metrics.materialCosts.wastePercentage}% waste rate
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Labor Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">
                {metrics.laborCosts.efficiency}%
              </div>
              <div className="text-sm text-purple-600">
                ${metrics.laborCosts.avgHourlyRate}/hour average
              </div>
              <div className="text-xs text-purple-600">
                {metrics.laborCosts.overtime}% overtime
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Materials', value: metrics.overview.breakdown.materials, color: 'bg-blue-500', percentage: (metrics.overview.breakdown.materials / metrics.overview.totalCosts) * 100 },
                  { name: 'Labor', value: metrics.overview.breakdown.labor, color: 'bg-green-500', percentage: (metrics.overview.breakdown.labor / metrics.overview.totalCosts) * 100 },
                  { name: 'Overhead', value: metrics.overview.breakdown.overhead, color: 'bg-yellow-500', percentage: (metrics.overview.breakdown.overhead / metrics.overview.totalCosts) * 100 },
                  { name: 'Equipment', value: metrics.overview.breakdown.equipment, color: 'bg-purple-500', percentage: (metrics.overview.breakdown.equipment / metrics.overview.totalCosts) * 100 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatCurrency(item.value)}</div>
                        <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost Variance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                Cost Variance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{metrics.variance.materialVariance.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Materials</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">+{metrics.variance.laborVariance.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Labor</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Recent Project Variances:</h4>
                  {metrics.variance.projects.slice(0, 3).map((project, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{project.customer}</div>
                        <div className="text-sm text-gray-600">{project.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          project.variance >= 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {project.variance >= 0 ? '+' : ''}{formatCurrency(project.variance)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.variancePercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Materials Mode */}
      {viewMode === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Material Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Material Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.materialCosts.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatCurrency(category.spend)}</div>
                        <div className={`text-xs ${
                          category.trend < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {category.trend >= 0 ? '+' : ''}{category.trend.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Waste rate: {category.wasteRate}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                Vendor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.materialCosts.vendors.map((vendor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{vendor.vendor}</h3>
                        <div className="text-sm text-gray-600">
                          {vendor.paymentTerms} • {vendor.volumeDiscount}% volume discount
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{formatCurrency(vendor.spend)}</div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{vendor.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(vendor.spend / metrics.materialCosts.totalSpend) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Labor Mode */}
      {viewMode === 'labor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Labor Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Labor Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.laborCosts.breakdown.map((role, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{role.role}</h3>
                        <div className="text-sm text-gray-600">
                          {role.headcount} employees • ${role.avgRate}/hour
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{formatCurrency(role.totalCost)}</div>
                        <div className="text-sm text-purple-600">{role.efficiency}% efficiency</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(role.totalCost / metrics.laborCosts.totalSpend) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Productivity Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Productivity Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.laborCosts.productivity.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{metric.current}</div>
                        <div className={`text-xs ${
                          metric.trend >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.trend >= 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(metric.current / metric.target) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">Target: {metric.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Optimization Mode */}
      {viewMode === 'optimization' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Optimization Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Cost Optimization Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.optimization.opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                        <p className="text-sm text-gray-600">{opportunity.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(opportunity.impact)}
                        </div>
                        <div className="text-xs text-gray-500">{opportunity.timeframe}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        opportunity.category === 'materials' ? 'bg-blue-100 text-blue-800' :
                        opportunity.category === 'labor' ? 'bg-purple-100 text-purple-800' :
                        opportunity.category === 'overhead' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {opportunity.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        opportunity.effort === 'low' ? 'bg-green-100 text-green-800' :
                        opportunity.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {opportunity.effort} effort
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Implementation Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Implementation Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.optimization.recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                    rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-green-500 bg-green-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{rec.implementation}</span>
                      <span className="font-semibold text-green-700">{formatCurrency(rec.savings)} savings</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}