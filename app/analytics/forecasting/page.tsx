"use client";

import { useState, useEffect, useCallback } from "react";
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
          status: "on-track" as const
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
      <div>
        <div>
          <div></div>
          <p>Loading forecasting analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div>
        <p>Unable to load forecasting data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div>
        <div>
          <h1>Forecasting & Planning Suite</h1>
          <p>Predictive analytics and strategic business planning</p>
        </div>
        
        <div>
          {/* View Mode Selector */}
          <div>
            {[
              { id: 'forecast', label: 'Forecast', icon: TrendingUp },
              { id: 'seasonal', label: 'Seasonal', icon: Calendar },
              { id: 'capacity', label: 'Capacity', icon: Users },
              { id: 'strategic', label: 'Strategic', icon: Target }
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

          {/* Forecast Horizon Selector */}
          <div>
            {[
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' },
              { id: 'year', label: 'Year' }
            ].map((horizon) => (
              <button
                key={horizon.id}
                onClick={() => setForecastHorizon(horizon.id as any)}
               `}
              >
                {horizon.label}
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

      {/* Key Forecasting Metrics */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp />
              Next {forecastHorizon} Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {forecastHorizon === 'month' 
                  ? formatCurrency(metrics.revenueForecasting.nextMonth.projected)
                  : forecastHorizon === 'quarter'
                  ? formatCurrency(metrics.revenueForecasting.nextQuarter.projected)
                  : formatCurrency(metrics.revenueForecasting.yearEnd.projected)
                }
              </div>
              <div>
                <CheckCircle />
                <span>
                  {forecastHorizon === 'month' 
                    ? metrics.revenueForecasting.nextMonth.confidence
                    : forecastHorizon === 'quarter'
                    ? metrics.revenueForecasting.nextQuarter.confidence
                    : metrics.revenueForecasting.yearEnd.probability
                  }% confidence
                </span>
              </div>
              <div>
                Based on trend analysis
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Calendar />
              Seasonal Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {(metrics.seasonalPlanning.seasonalIndex * 100).toFixed(0)}%
              </div>
              <div>
                {metrics.seasonalPlanning.currentSeason} multiplier
              </div>
              <div>
                vs. annual average
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Users />
              Capacity Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.capacityPlanning.utilization}%
              </div>
              <div>
                <ArrowUpRight />
                <span>
                  {metrics.capacityPlanning.bottlenecks.length} bottlenecks
                </span>
              </div>
              <div>
                Current operational level
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Target />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.strategicPlanning.goals.reduce((sum, goal) => sum + goal.progress, 0) / metrics.strategicPlanning.goals.length}%
              </div>
              <div>
                Average goal completion
              </div>
              <div>
                {metrics.strategicPlanning.goals.filter(g => g.status === 'on-track').length} of {metrics.strategicPlanning.goals.length} on track
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast View */}
      {viewMode === 'forecast' && (
        <div>
          {/* Revenue Projection */}
          <Card>
            <CardHeader>
              <CardTitle>
                <LineChart />
                Revenue Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    {formatCurrency(metrics.revenueForecasting.nextQuarter.projected)}
                  </div>
                  <div>Next Quarter Projection</div>
                  <div>{metrics.revenueForecasting.nextQuarter.confidence}% confidence level</div>
                </div>
                
                <div>
                  <h4>Key Factors:</h4>
                  {metrics.revenueForecasting.nextMonth.factors.map((factor, index) => (
                    <div key={index}>
                      <CheckCircle />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h4>Year-End Target</h4>
                  <div>
                    <span>Progress to Goal:</span>
                    <span>{metrics.revenueForecasting.yearEnd.probability}%</span>
                  </div>
                  <div>
                    <div 
                     
                     %` }}
                    ></div>
                  </div>
                  <div>
                    Target: {formatCurrency(metrics.revenueForecasting.yearEnd.target)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>
                <BarChart3 />
                Quarterly Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.revenueForecasting.nextQuarter.breakdown.map((month, index) => (
                  <div key={index}>
                    <div>
                      <span>{month.month}</span>
                      <div>
                        <div>{formatCurrency(month.projected)}</div>
                        <div>{month.probability}% probability</div>
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

      {/* Seasonal View */}
      {viewMode === 'seasonal' && (
        <div>
          {metrics.seasonalPlanning.patterns.map((season, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <season.icon />
                  {season.season} Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <span>Revenue Impact:</span>
                    <span`}>
                      {(season.revenueMultiplier * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span>Demand Level:</span>
                    <span`}>
                      {season.demandLevel}
                    </span>
                  </div>

                  <div>
                    <h4>Opportunities:</h4>
                    <ul>
                      {season.opportunities.map((opp, idx) => (
                        <li key={idx}>• {opp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4>Challenges:</h4>
                    <ul>
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
        <div>
          {/* Current Bottlenecks */}
          <Card>
            <CardHeader>
              <CardTitle>
                <AlertCircle />
                Capacity Bottlenecks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.capacityPlanning.bottlenecks.map((bottleneck, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{bottleneck.resource}</h3>
                        <p>Gap: {bottleneck.gap} units needed</p>
                      </div>
                      <div>
                        <div>{bottleneck.currentLevel}/{bottleneck.projectedNeed}</div>
                        <div>{bottleneck.timeline}</div>
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

          {/* Expansion Options */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Zap />
                Expansion Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.capacityPlanning.expansion.map((option, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{option.option}</h3>
                        <p>+{option.capacityIncrease}% capacity</p>
                      </div>
                      <div>
                        <div>{formatCurrency(option.investment)}</div>
                        <div>{option.timeframe}</div>
                      </div>
                    </div>
                    <div>
                      <span>ROI:</span>
                      <span>{option.roi.toFixed(1)}x</span>
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
        <div>
          {/* Strategic Goals */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Target />
                Strategic Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.strategicPlanning.goals.map((goal) => (
                  <div key={goal.id}>
                    <div>
                      <div>
                        <h3>{goal.title}</h3>
                        <p>Due: {goal.deadline}</p>
                      </div>
                      <div>
                        <span`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div 
                       `}
                       %` }}
                      ></div>
                    </div>
                    <div>
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
              <CardTitle>
                <Activity />
                Scenario Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.strategicPlanning.scenarios.map((scenario, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{scenario.name}</h3>
                        <p>{scenario.description}</p>
                      </div>
                      <div>
                        <div>{scenario.probability}% chance</div>
                        <div`}>
                          {scenario.impact > 0 ? '+' : ''}{scenario.impact}% impact
                        </div>
                      </div>
                    </div>
                    <div>
                      Revenue effect: {formatCurrency(Math.abs(scenario.revenueEffect))} {scenario.revenueEffect >= 0 ? 'gain' : 'loss'}
                    </div>
                    <div>
                      <h4>Key Actions:</h4>
                      <ul>
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