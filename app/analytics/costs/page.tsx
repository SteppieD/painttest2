"use client";

import { useState, useEffect, useCallback } from "react";
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
  Truck,
  Star
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

  const loadCostData = useCallback(async (companyId: number) => {
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
  }, []);

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
  }, [router, timeRange, loadCostData]);

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
      <div>
        <div>
          <div></div>
          <p>Loading cost analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div>
        <p>Unable to load cost data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div>
        <div>
          <h1>Cost Management Laboratory</h1>
          <p>Comprehensive cost analysis and optimization insights</p>
        </div>
        
        <div>
          {/* View Mode Selector */}
          <div>
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'materials', label: 'Materials', icon: Package },
              { id: 'labor', label: 'Labor', icon: Users },
              { id: 'optimization', label: 'Optimize', icon: Zap }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
               `}
              >
                <mode.icon />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div>
            {[
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
               `}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button>
            <Download />
            Export
          </button>
        </div>
      </div>

      {/* Key Cost Metrics */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <DollarSign />
              Total Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {formatCurrency(metrics.overview.totalCosts)}
              </div>
              <div>
                {metrics.overview.costTrend >= 0 ? (
                  <ArrowUpRight />
                ) : (
                  <ArrowDownRight />
                )}
                <span`}>
                  {Math.abs(metrics.overview.costTrend).toFixed(1)}% vs last {timeRange}
                </span>
              </div>
              <div>
                {formatCurrency(metrics.overview.costPerProject)} per project
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Target />
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.overview.profitMargin.toFixed(1)}%
              </div>
              <div>
                Target: 25%
              </div>
              <div>
                {metrics.overview.profitMargin >= 25 ? 'Above target' : 'Below target'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Package />
              Material Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {formatCurrency(metrics.materialCosts.totalSpend)}
              </div>
              <div>
                <ArrowDownRight />
                <span>
                  {Math.abs(metrics.materialCosts.trend).toFixed(1)}% reduction
                </span>
              </div>
              <div>
                {metrics.materialCosts.wastePercentage}% waste rate
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Users />
              Labor Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.laborCosts.efficiency}%
              </div>
              <div>
                ${metrics.laborCosts.avgHourlyRate}/hour average
              </div>
              <div>
                {metrics.laborCosts.overtime}% overtime
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div>
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>
                <PieChart />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {[
                  { name: 'Materials', value: metrics.overview.breakdown.materials, color: 'bg-blue-500', percentage: (metrics.overview.breakdown.materials / metrics.overview.totalCosts) * 100 },
                  { name: 'Labor', value: metrics.overview.breakdown.labor, color: 'bg-green-500', percentage: (metrics.overview.breakdown.labor / metrics.overview.totalCosts) * 100 },
                  { name: 'Overhead', value: metrics.overview.breakdown.overhead, color: 'bg-yellow-500', percentage: (metrics.overview.breakdown.overhead / metrics.overview.totalCosts) * 100 },
                  { name: 'Equipment', value: metrics.overview.breakdown.equipment, color: 'bg-purple-500', percentage: (metrics.overview.breakdown.equipment / metrics.overview.totalCosts) * 100 }
                ].map((item, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <div`}></div>
                        <span>{item.name}</span>
                      </div>
                      <div>
                        <div>{formatCurrency(item.value)}</div>
                        <div>{item.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div>
                      <div 
                       `}
                       %` }}
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
              <CardTitle>
                <Activity />
                Cost Variance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    <div>{metrics.variance.materialVariance.toFixed(1)}%</div>
                    <div>Materials</div>
                  </div>
                  <div>
                    <div>+{metrics.variance.laborVariance.toFixed(1)}%</div>
                    <div>Labor</div>
                  </div>
                </div>

                <div>
                  <h4>Recent Project Variances:</h4>
                  {metrics.variance.projects.slice(0, 3).map((project, index) => (
                    <div key={index}>
                      <div>
                        <div>{project.customer}</div>
                        <div>{project.category}</div>
                      </div>
                      <div>
                        <div`}>
                          {project.variance >= 0 ? '+' : ''}{formatCurrency(project.variance)}
                        </div>
                        <div>
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
        <div>
          {/* Material Categories */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Package />
                Material Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.materialCosts.categories.map((category, index) => (
                  <div key={index}>
                    <div>
                      <span>{category.category}</span>
                      <div>
                        <div>{formatCurrency(category.spend)}</div>
                        <div`}>
                          {category.trend >= 0 ? '+' : ''}{category.trend.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <div 
                       
                       %` }}
                      ></div>
                    </div>
                    <div>
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
              <CardTitle>
                <Truck />
                Vendor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.materialCosts.vendors.map((vendor, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{vendor.vendor}</h3>
                        <div>
                          {vendor.paymentTerms} • {vendor.volumeDiscount}% volume discount
                        </div>
                      </div>
                      <div>
                        <div>{formatCurrency(vendor.spend)}</div>
                        <div>
                          <Star />
                          <span>{vendor.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div 
                       
                       %` }}
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
        <div>
          {/* Labor Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Users />
                Labor Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.laborCosts.breakdown.map((role, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{role.role}</h3>
                        <div>
                          {role.headcount} employees • ${role.avgRate}/hour
                        </div>
                      </div>
                      <div>
                        <div>{formatCurrency(role.totalCost)}</div>
                        <div>{role.efficiency}% efficiency</div>
                      </div>
                    </div>
                    <div>
                      <div 
                       
                       %` }}
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
              <CardTitle>
                <Activity />
                Productivity Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.laborCosts.productivity.map((metric, index) => (
                  <div key={index}>
                    <div>
                      <span>{metric.metric}</span>
                      <div>
                        <div>{metric.current}</div>
                        <div`}>
                          {metric.trend >= 0 ? '+' : ''}{metric.trend.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div 
                         
                         %` }}
                        ></div>
                      </div>
                      <span>Target: {metric.target}</span>
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
        <div>
          {/* Optimization Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Zap />
                Cost Optimization Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.optimization.opportunities.map((opportunity) => (
                  <div key={opportunity.id}>
                    <div>
                      <div>
                        <h3>{opportunity.title}</h3>
                        <p>{opportunity.description}</p>
                      </div>
                      <div>
                        <div>
                          {formatCurrency(opportunity.impact)}
                        </div>
                        <div>{opportunity.timeframe}</div>
                      </div>
                    </div>
                    <div>
                      <span`}>
                        {opportunity.category}
                      </span>
                      <span`}>
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
              <CardTitle>
                <Award />
                Implementation Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.optimization.recommendations.map((rec, index) => (
                  <div key={index}`}>
                    <div>
                      <div>
                        <h3>{rec.title}</h3>
                        <p>{rec.description}</p>
                      </div>
                      <span`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <div>
                      <span>{rec.implementation}</span>
                      <span>{formatCurrency(rec.savings)} savings</span>
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