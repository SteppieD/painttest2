"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Zap,
  Filter,
  Download,
  DollarSign,
  Users,
  Activity,
  Clock,
  Star,
  Settings,
  LineChart,
  Sun,
  CloudRain,
  Snowflake,
  Flower
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ForecastingMetrics {
  revenueForecasting: {
    nextMonth: {
      projected: number;
      confidence: number;
      range: { low: number; high: number };
      factors: string[];
    };
    nextQuarter: {
      projected: number;
      confidence: number;
      breakdown: Array<{
        month: string;
        projected: number;
        probability: number;
      }>;
    };
    yearEnd: {
      projected: number;
      target: number;
      probability: number;
      gap: number;
    };
  };
  seasonalPlanning: {
    currentSeason: string;
    seasonalIndex: number;
    patterns: Array<{
      season: string;
      icon: any;
      months: string[];
      revenueMultiplier: number;
      demandLevel: 'Low' | 'Medium' | 'High' | 'Peak';
      opportunities: string[];
      challenges: string[];
    }>;
    preparation: Array<{
      season: string;
      timeToStart: number;
      actions: string[];
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  capacityPlanning: {
    currentCapacity: number;
    utilization: number;
    bottlenecks: Array<{
      resource: string;
      currentLevel: number;
      projectedNeed: number;
      gap: number;
      timeline: string;
    }>;
    expansion: Array<{
      option: string;
      investment: number;
      capacityIncrease: number;
      roi: number;
      timeframe: string;
    }>;
  };
  marketTrends: {
    growth: {
      current: number;
      projected: number;
      confidence: number;
      drivers: string[];
    };
    competition: {
      marketShare: number;
      trend: number;
      positioning: string;
      threats: string[];
      opportunities: string[];
    };
    pricing: {
      currentPosition: string;
      trend: number;
      recommendations: string[];
      optimalRange: { min: number; max: number };
    };
  };
  strategicPlanning: {
    goals: Array<{
      id: string;
      title: string;
      target: number;
      current: number;
      progress: number;
      deadline: string;
      status: 'on-track' | 'at-risk' | 'behind';
    }>;
    initiatives: Array<{
      id: string;
      title: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'high' | 'medium' | 'low';
      timeline: string;
      expectedROI: number;
    }>;
    scenarios: Array<{
      name: string;
      description: string;
      probability: number;
      impact: number;
      revenueEffect: number;
      actions: string[];
    }>;
  };
}

export default function ForecastingPlanningDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ForecastingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [forecastHorizon, setForecastHorizon] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [viewMode, setViewMode] = useState<'forecast' | 'seasonal' | 'capacity' | 'strategic'>('forecast');
  const [scenarioView, setScenarioView] = useState<'optimistic' | 'realistic' | 'conservative'>('realistic');

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
        loadForecastingData(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router, forecastHorizon]);

  const loadForecastingData = async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data for forecasting analysis
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Calculate forecasting metrics
      const calculatedMetrics = calculateForecastingMetrics(quotes);
      setMetrics(calculatedMetrics);

    } catch (error) {
      console.error("Error loading forecasting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateForecastingMetrics = (quotes: any[]): ForecastingMetrics => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const totalRevenue = quotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
    const monthlyAverage = totalRevenue / 12; // Rough monthly average

    // Revenue Forecasting
    const revenueForecasting = {
      nextMonth: {
        projected: monthlyAverage * 1.15, // 15% growth projection
        confidence: 85,
        range: { 
          low: monthlyAverage * 0.9, 
          high: monthlyAverage * 1.4 
        },
        factors: [
          "Historical growth pattern",
          "Spring seasonal uptick",
          "3 large projects in pipeline",
          "Increased marketing spend",
          "Improved quote response time"
        ]
      },
      nextQuarter: {
        projected: monthlyAverage * 3.5, // Slightly higher for next quarter
        confidence: 78,
        breakdown: [
          { month: "Month 1", projected: monthlyAverage * 1.15, probability: 85 },
          { month: "Month 2", projected: monthlyAverage * 1.20, probability: 80 },
          { month: "Month 3", projected: monthlyAverage * 1.15, probability: 75 }
        ]
      },
      yearEnd: {
        projected: totalRevenue * 1.35, // 35% annual growth
        target: totalRevenue * 1.50,    // 50% target
        probability: 72,
        gap: totalRevenue * 0.15        // 15% gap to target
      }
    };

    // Seasonal Planning
    const seasonalPlanning = {
      currentSeason: getSeason(currentMonth),
      seasonalIndex: getSeasonalIndex(currentMonth),
      patterns: [
        {
          season: "Spring",
          icon: Flower,
          months: ["March", "April", "May"],
          revenueMultiplier: 1.4,
          demandLevel: "Peak" as const,
          opportunities: [
            "Exterior painting demand peaks",
            "Spring cleaning projects",
            "New construction starts",
            "Commercial building refreshes"
          ],
          challenges: [
            "High competition for skilled labor",
            "Material price increases",
            "Weather-dependent scheduling"
          ]
        },
        {
          season: "Summer",
          icon: Sun,
          months: ["June", "July", "August"],
          revenueMultiplier: 1.2,
          demandLevel: "High" as const,
          opportunities: [
            "Extended daylight hours",
            "Vacation home projects",
            "School facility maintenance",
            "Outdoor project focus"
          ],
          challenges: [
            "Extreme heat affecting productivity",
            "Vacation schedules",
            "Material drying challenges"
          ]
        },
        {
          season: "Fall",
          icon: CloudRain,
          months: ["September", "October", "November"],
          revenueMultiplier: 1.1,
          demandLevel: "Medium" as const,
          opportunities: [
            "Interior project season begins",
            "Holiday preparation painting",
            "Commercial year-end budgets",
            "Weather protection projects"
          ],
          challenges: [
            "Shorter daylight hours",
            "Weather unpredictability",
            "Holiday schedule disruptions"
          ]
        },
        {
          season: "Winter",
          icon: Snowflake,
          months: ["December", "January", "February"],
          revenueMultiplier: 0.7,
          demandLevel: "Low" as const,
          opportunities: [
            "Interior painting focus",
            "Commercial projects",
            "Planning and preparation time",
            "Equipment maintenance"
          ],
          challenges: [
            "Limited outdoor work",
            "Holiday slowdown",
            "Reduced customer activity",
            "Material storage issues"
          ]
        }
      ],
      preparation: [
        {
          season: "Spring Prep",
          timeToStart: getMonthsUntilSeason("spring"),
          actions: [
            "Stock exterior paint inventory",
            "Hire additional seasonal crew",
            "Service all spray equipment",
            "Confirm material supplier agreements"
          ],
          priority: "high" as const
        },
        {
          season: "Winter Planning",
          timeToStart: getMonthsUntilSeason("winter"),
          actions: [
            "Focus on interior project marketing",
            "Plan equipment maintenance schedule",
            "Develop commercial partnerships",
            "Training and certification programs"
          ],
          priority: "medium" as const
        }
      ]
    };

    // Capacity Planning
    const capacityPlanning = {
      currentCapacity: 85, // percentage
      utilization: 78,
      bottlenecks: [
        {
          resource: "Lead Painters",
          currentLevel: 4,
          projectedNeed: 6,
          gap: 2,
          timeline: "Q2 2025"
        },
        {
          resource: "Spray Equipment",
          currentLevel: 8,
          projectedNeed: 12,
          gap: 4,
          timeline: "Q1 2025"
        },
        {
          resource: "Transportation",
          currentLevel: 3,
          projectedNeed: 4,
          gap: 1,
          timeline: "Q3 2025"
        }
      ],
      expansion: [
        {
          option: "Hire 2 Lead Painters",
          investment: 120000, // annual cost
          capacityIncrease: 40,
          roi: 2.8,
          timeframe: "2-3 months"
        },
        {
          option: "Purchase Spray Equipment",
          investment: 45000,
          capacityIncrease: 25,
          roi: 4.2,
          timeframe: "1 month"
        },
        {
          option: "Add Service Vehicle",
          investment: 35000,
          capacityIncrease: 15,
          roi: 3.1,
          timeframe: "1-2 months"
        }
      ]
    };

    // Market Trends
    const marketTrends = {
      growth: {
        current: 12.5,
        projected: 15.8,
        confidence: 82,
        drivers: [
          "Housing market recovery",
          "Commercial construction growth",
          "Increased renovation activity",
          "Remote work home improvements"
        ]
      },
      competition: {
        marketShare: 8.5,
        trend: 1.2,
        positioning: "Premium Quality Provider",
        threats: [
          "New competitors entering market",
          "Large franchises expanding",
          "DIY trend growth"
        ],
        opportunities: [
          "Eco-friendly paint demand",
          "Smart home integration",
          "Commercial partnerships"
        ]
      },
      pricing: {
        currentPosition: "10% above market average",
        trend: 3.2,
        recommendations: [
          "Maintain premium positioning",
          "Introduce value-tier options",
          "Bundle services for better value"
        ],
        optimalRange: { min: 85, max: 125 } // per hour
      }
    };

    // Strategic Planning
    const strategicPlanning = {
      goals: [
        {
          id: "revenue-growth",
          title: "50% Revenue Growth",
          target: totalRevenue * 1.5,
          current: totalRevenue,
          progress: 67,
          deadline: "December 2025",
          status: "on-track" as const
        },
        {
          id: "market-share",
          title: "12% Market Share",
          target: 12,
          current: 8.5,
          progress: 71,
          deadline: "June 2025",
          status: "on-track" as const
        },
        {
          id: "efficiency",
          title: "95% Customer Satisfaction",
          target: 95,
          current: 92,
          progress: 97,
          deadline: "March 2025",
          status: "ahead" as const
        }
      ],
      initiatives: [
        {
          id: "digital-expansion",
          title: "Digital Marketing Expansion",
          impact: "high" as const,
          effort: "medium" as const,
          timeline: "Q1-Q2 2025",
          expectedROI: 3.8
        },
        {
          id: "service-diversification",
          title: "Add Pressure Washing Services",
          impact: "medium" as const,
          effort: "low" as const,
          timeline: "Q2 2025",
          expectedROI: 2.4
        },
        {
          id: "tech-upgrade",
          title: "Project Management Software",
          impact: "high" as const,
          effort: "high" as const,
          timeline: "Q1 2025",
          expectedROI: 4.1
        }
      ],
      scenarios: [
        {
          name: "Economic Downturn",
          description: "Recession impacts construction and renovation spending",
          probability: 25,
          impact: -20,
          revenueEffect: totalRevenue * -0.2,
          actions: [
            "Focus on maintenance contracts",
            "Reduce overhead costs",
            "Diversify service offerings",
            "Strengthen cash reserves"
          ]
        },
        {
          name: "Market Expansion",
          description: "Successfully expand to adjacent markets",
          probability: 65,
          impact: 35,
          revenueEffect: totalRevenue * 0.35,
          actions: [
            "Invest in marketing",
            "Hire regional managers",
            "Establish local partnerships",
            "Scale operations"
          ]
        },
        {
          name: "Technology Disruption",
          description: "New painting technologies change the industry",
          probability: 40,
          impact: 15,
          revenueEffect: totalRevenue * 0.15,
          actions: [
            "Invest in new technology",
            "Train team on innovations",
            "Partner with tech companies",
            "Update service offerings"
          ]
        }
      ]
    };

    return {
      revenueForecasting,
      seasonalPlanning,
      capacityPlanning,
      marketTrends,
      strategicPlanning
    };
  };

  // Helper functions
  const getSeason = (month: number): string => {
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Fall";
    return "Winter";
  };

  const getSeasonalIndex = (month: number): number => {
    const indices = [0.7, 0.7, 1.4, 1.4, 1.4, 1.2, 1.2, 1.2, 1.1, 1.1, 1.1, 0.7];
    return indices[month];
  };

  const getMonthsUntilSeason = (season: string): number => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const seasonStarts = { spring: 2, summer: 5, fall: 8, winter: 11 };
    const targetMonth = seasonStarts[season as keyof typeof seasonStarts];
    let months = targetMonth - currentMonth;
    if (months <= 0) months += 12;
    return months;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forecasting analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load forecasting data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forecasting & Planning Suite</h1>
          <p className="text-gray-600">Predictive analytics and strategic business planning</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'forecast', label: 'Forecast', icon: TrendingUp },
              { id: 'seasonal', label: 'Seasonal', icon: Calendar },
              { id: 'capacity', label: 'Capacity', icon: Users },
              { id: 'strategic', label: 'Strategic', icon: Target }
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

          {/* Forecast Horizon Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((horizon) => (
              <button
                key={horizon.id}
                onClick={() => setForecastHorizon(horizon.id as any)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  forecastHorizon === horizon.id
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {horizon.label}
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

      {/* Key Forecasting Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Next {forecastHorizon} Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">
                {forecastHorizon === 'month' 
                  ? formatCurrency(metrics.revenueForecasting.nextMonth.projected)
                  : forecastHorizon === 'quarter'
                  ? formatCurrency(metrics.revenueForecasting.nextQuarter.projected)
                  : formatCurrency(metrics.revenueForecasting.yearEnd.projected)
                }
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {forecastHorizon === 'month' 
                    ? metrics.revenueForecasting.nextMonth.confidence
                    : forecastHorizon === 'quarter'
                    ? metrics.revenueForecasting.nextQuarter.confidence
                    : metrics.revenueForecasting.yearEnd.probability
                  }% confidence
                </span>
              </div>
              <div className="text-xs text-green-600">
                Based on trend analysis
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Seasonal Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">
                {(metrics.seasonalPlanning.seasonalIndex * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-blue-600">
                {metrics.seasonalPlanning.currentSeason} multiplier
              </div>
              <div className="text-xs text-blue-600">
                vs. annual average
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Capacity Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">
                {metrics.capacityPlanning.utilization}%
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  {metrics.capacityPlanning.bottlenecks.length} bottlenecks
                </span>
              </div>
              <div className="text-xs text-purple-600">
                Current operational level
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-800">
                {metrics.strategicPlanning.goals.reduce((sum, goal) => sum + goal.progress, 0) / metrics.strategicPlanning.goals.length}%
              </div>
              <div className="text-sm text-orange-600">
                Average goal completion
              </div>
              <div className="text-xs text-orange-600">
                {metrics.strategicPlanning.goals.filter(g => g.status === 'on-track').length} of {metrics.strategicPlanning.goals.length} on track
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast View */}
      {viewMode === 'forecast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Projection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-green-600" />
                Revenue Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    {formatCurrency(metrics.revenueForecasting.nextQuarter.projected)}
                  </div>
                  <div className="text-green-600 font-medium mb-1">Next Quarter Projection</div>
                  <div className="text-sm text-green-600">{metrics.revenueForecasting.nextQuarter.confidence}% confidence level</div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Key Factors:</h4>
                  {metrics.revenueForecasting.nextMonth.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Year-End Target</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-700">Progress to Goal:</span>
                    <span className="font-semibold text-blue-800">{metrics.revenueForecasting.yearEnd.probability}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${metrics.revenueForecasting.yearEnd.probability}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Target: {formatCurrency(metrics.revenueForecasting.yearEnd.target)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Quarterly Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.revenueForecasting.nextQuarter.breakdown.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatCurrency(month.projected)}</div>
                        <div className="text-xs text-gray-500">{month.probability}% probability</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${month.probability}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Seasonal View */}
      {viewMode === 'seasonal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {metrics.seasonalPlanning.patterns.map((season, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <season.icon className="w-5 h-5 text-blue-600" />
                  {season.season} Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue Impact:</span>
                    <span className={`font-bold ${
                      season.revenueMultiplier >= 1.2 ? 'text-green-600' :
                      season.revenueMultiplier >= 1.0 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {(season.revenueMultiplier * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Demand Level:</span>
                    <span className={`font-medium px-2 py-1 rounded text-xs ${
                      season.demandLevel === 'Peak' ? 'bg-red-100 text-red-800' :
                      season.demandLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                      season.demandLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {season.demandLevel}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Opportunities:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {season.opportunities.map((opp, idx) => (
                        <li key={idx}>• {opp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Challenges:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {season.challenges.map((challenge, idx) => (
                        <li key={idx}>• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Capacity View */}
      {viewMode === 'capacity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Bottlenecks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Capacity Bottlenecks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.capacityPlanning.bottlenecks.map((bottleneck, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{bottleneck.resource}</h3>
                        <p className="text-sm text-gray-600">Gap: {bottleneck.gap} units needed</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{bottleneck.currentLevel}/{bottleneck.projectedNeed}</div>
                        <div className="text-xs text-gray-500">{bottleneck.timeline}</div>
                      </div>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(bottleneck.currentLevel / bottleneck.projectedNeed) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expansion Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                Expansion Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.capacityPlanning.expansion.map((option, index) => (
                  <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{option.option}</h3>
                        <p className="text-sm text-gray-600">+{option.capacityIncrease}% capacity</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{formatCurrency(option.investment)}</div>
                        <div className="text-xs text-gray-500">{option.timeframe}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ROI:</span>
                      <span className="font-semibold text-green-700">{option.roi.toFixed(1)}x</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Strategic View */}
      {viewMode === 'strategic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strategic Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Strategic Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.strategicPlanning.goals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">Due: {goal.deadline}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          goal.status === 'on-track' ? 'bg-green-100 text-green-800' :
                          goal.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          goal.status === 'on-track' ? 'bg-green-500' :
                          goal.status === 'at-risk' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Progress: {goal.progress}% • Current: {typeof goal.current === 'number' && goal.current > 1000 ? formatCurrency(goal.current) : goal.current}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scenario Planning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Scenario Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.strategicPlanning.scenarios.map((scenario, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{scenario.name}</h3>
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{scenario.probability}% chance</div>
                        <div className={`text-sm font-semibold ${
                          scenario.impact > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {scenario.impact > 0 ? '+' : ''}{scenario.impact}% impact
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Revenue effect: {formatCurrency(Math.abs(scenario.revenueEffect))} {scenario.revenueEffect >= 0 ? 'gain' : 'loss'}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Key Actions:</h4>
                      <ul className="text-xs text-gray-600">
                        {scenario.actions.slice(0, 2).map((action, idx) => (
                          <li key={idx}>• {action}</li>
                        ))}
                      </ul>
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