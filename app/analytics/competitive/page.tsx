"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Filter,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Sword,
  Eye,
  Star,
  MapPin,
  Calendar,
  Briefcase,
  Globe
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CompetitiveMetrics {
  marketPosition: {
    marketShare: number;
    marketShareTrend: number;
    ranking: number;
    totalMarketSize: number;
    growthRate: number;
    positioning: string;
  };
  competitorAnalysis: {
    primaryCompetitors: Array<{
      name: string;
      marketShare: number;
      pricing: 'budget' | 'mid-range' | 'premium';
      avgQuoteValue: number;
      winRate: number;
      strengths: string[];
      weaknesses: string[];
      threatLevel: 'low' | 'medium' | 'high';
    }>;
    competitiveMap: Array<{
      competitor: string;
      quality: number;
      price: number;
      marketShare: number;
      quadrant: 'leaders' | 'challengers' | 'visionaries' | 'niche';
    }>;
  };
  winLossAnalysis: {
    overallWinRate: number;
    winRateTrend: number;
    lossReasons: Array<{
      reason: string;
      percentage: number;
      trend: number;
      impact: 'high' | 'medium' | 'low';
    }>;
    wonReasons: Array<{
      reason: string;
      percentage: number;
      trend: number;
    }>;
    competitorWins: Array<{
      competitor: string;
      winsAgainst: number;
      lossesToThem: number;
      netWinRate: number;
    }>;
  };
  pricingIntelligence: {
    pricePosition: 'budget' | 'mid-range' | 'premium';
    priceIndex: number; // vs market average
    pricingTrend: number;
    optimalPricing: {
      residential: { min: number; max: number; recommended: number };
      commercial: { min: number; max: number; recommended: number };
    };
    competitorPricing: Array<{
      competitor: string;
      avgPrice: number;
      priceRange: { min: number; max: number };
      valuePerception: number;
    }>;
  };
  marketIntelligence: {
    marketTrends: Array<{
      trend: string;
      impact: 'positive' | 'negative' | 'neutral';
      timeframe: string;
      description: string;
      actionRequired: boolean;
    }>;
    opportunities: Array<{
      id: string;
      title: string;
      description: string;
      marketSize: number;
      competitionLevel: 'low' | 'medium' | 'high';
      timeToCapture: string;
      probability: number;
    }>;
    threats: Array<{
      id: string;
      title: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      timeframe: string;
      mitigation: string;
    }>;
  };
  strategicInsights: {
    competitiveAdvantages: Array<{
      advantage: string;
      strength: 'strong' | 'moderate' | 'weak';
      sustainability: 'high' | 'medium' | 'low';
      description: string;
    }>;
    recommendations: Array<{
      priority: 'high' | 'medium' | 'low';
      category: 'positioning' | 'pricing' | 'service' | 'marketing';
      title: string;
      description: string;
      expectedImpact: string;
      timeline: string;
    }>;
    swotAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };
}

export default function CompetitiveIntelligencePlatform() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<CompetitiveMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [analysisType, setAnalysisType] = useState<'local' | 'regional' | 'national'>('local');
  const [viewMode, setViewMode] = useState<'overview' | 'competitors' | 'pricing' | 'strategic'>('overview');
  const [competitorFilter, setCompetitorFilter] = useState<string>('all');

  const loadCompetitiveData = useCallback(async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data for competitive analysis
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Calculate competitive metrics
      const calculatedMetrics = calculateCompetitiveMetrics(quotes);
      setMetrics(calculatedMetrics);

    } catch (error) {
      console.error("Error loading competitive data:", error);
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
        loadCompetitiveData(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router, analysisType, loadCompetitiveData]);

  const calculateCompetitiveMetrics = (quotes: any[]): CompetitiveMetrics => {
    const totalRevenue = quotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
    const avgQuoteValue = quotes.length > 0 ? totalRevenue / quotes.length : 0;

    // Market Position
    const marketPosition = {
      marketShare: 8.5, // Mock data - would come from market research
      marketShareTrend: 1.2,
      ranking: 3,
      totalMarketSize: 2500000, // Local market size
      growthRate: 12.8,
      positioning: "Premium Quality Provider"
    };

    // Competitor Analysis
    const competitorAnalysis = {
      primaryCompetitors: [
        {
          name: "Elite Painting Co",
          marketShare: 15.2,
          pricing: "premium" as const,
          avgQuoteValue: avgQuoteValue * 1.15,
          winRate: 68,
          strengths: ["Brand recognition", "Large team", "Commercial focus"],
          weaknesses: ["Higher prices", "Less personal service", "Slower response"],
          threatLevel: "high" as const
        },
        {
          name: "Budget Paint Pros",
          marketShare: 12.8,
          pricing: "budget" as const,
          avgQuoteValue: avgQuoteValue * 0.70,
          winRate: 45,
          strengths: ["Low prices", "Fast turnaround", "Volume capacity"],
          weaknesses: ["Quality issues", "Limited warranty", "High turnover"],
          threatLevel: "medium" as const
        },
        {
          name: "Quality Finishers",
          marketShare: 9.1,
          pricing: "mid-range" as const,
          avgQuoteValue: avgQuoteValue * 0.95,
          winRate: 52,
          strengths: ["Good reputation", "Consistent quality", "Fair pricing"],
          weaknesses: ["Limited innovation", "Basic marketing", "Small team"],
          threatLevel: "medium" as const
        },
        {
          name: "Franchise Paint Plus",
          marketShare: 11.5,
          pricing: "mid-range" as const,
          avgQuoteValue: avgQuoteValue * 1.05,
          winRate: 58,
          strengths: ["National brand", "Marketing support", "Systems"],
          weaknesses: ["Generic approach", "Franchise fees", "Less local focus"],
          threatLevel: "high" as const
        }
      ],
      competitiveMap: [
        { competitor: "Elite Painting Co", quality: 85, price: 90, marketShare: 15.2, quadrant: "leaders" as const },
        { competitor: "Budget Paint Pros", quality: 60, price: 40, marketShare: 12.8, quadrant: "challengers" as const },
        { competitor: "Quality Finishers", quality: 78, price: 65, marketShare: 9.1, quadrant: "niche" as const },
        { competitor: "Franchise Paint Plus", quality: 75, price: 70, marketShare: 11.5, quadrant: "challengers" as const },
        { competitor: "Your Company", quality: 88, price: 85, marketShare: 8.5, quadrant: "leaders" as const }
      ]
    };

    // Win/Loss Analysis
    const winLossAnalysis = {
      overallWinRate: 65,
      winRateTrend: 3.2,
      lossReasons: [
        { reason: "Price too high", percentage: 45, trend: 2.1, impact: "high" as const },
        { reason: "Timeline conflict", percentage: 25, trend: -1.5, impact: "medium" as const },
        { reason: "Not available", percentage: 15, trend: 0.8, impact: "medium" as const },
        { reason: "Went with referral", percentage: 10, trend: -0.5, impact: "low" as const },
        { reason: "Other factors", percentage: 5, trend: 0.2, impact: "low" as const }
      ],
      wonReasons: [
        { reason: "Superior quality reputation", percentage: 35, trend: 2.8 },
        { reason: "Competitive pricing", percentage: 25, trend: 1.5 },
        { reason: "Professional presentation", percentage: 20, trend: 3.1 },
        { reason: "Quick response time", percentage: 12, trend: 1.8 },
        { reason: "Customer referral", percentage: 8, trend: 0.5 }
      ],
      competitorWins: [
        { competitor: "Elite Painting Co", winsAgainst: 12, lossesToThem: 18, netWinRate: 40 },
        { competitor: "Budget Paint Pros", winsAgainst: 22, lossesToThem: 8, netWinRate: 73 },
        { competitor: "Quality Finishers", winsAgainst: 15, lossesToThem: 10, netWinRate: 60 },
        { competitor: "Franchise Paint Plus", winsAgainst: 14, lossesToThem: 12, netWinRate: 54 }
      ]
    };

    // Pricing Intelligence
    const pricingIntelligence = {
      pricePosition: "premium" as const,
      priceIndex: 108, // 8% above market average
      pricingTrend: 2.5,
      optimalPricing: {
        residential: { min: 4.50, max: 7.20, recommended: 5.85 },
        commercial: { min: 3.80, max: 6.50, recommended: 5.15 }
      },
      competitorPricing: [
        { competitor: "Elite Painting Co", avgPrice: 6.20, priceRange: { min: 5.50, max: 7.80 }, valuePerception: 82 },
        { competitor: "Budget Paint Pros", avgPrice: 3.95, priceRange: { min: 2.80, max: 5.20 }, valuePerception: 65 },
        { competitor: "Quality Finishers", avgPrice: 5.10, priceRange: { min: 4.20, max: 6.50 }, valuePerception: 75 },
        { competitor: "Franchise Paint Plus", avgPrice: 5.60, priceRange: { min: 4.80, max: 7.10 }, valuePerception: 78 }
      ]
    };

    // Market Intelligence
    const marketIntelligence = {
      marketTrends: [
        {
          trend: "Eco-friendly paint demand increasing",
          impact: "positive" as const,
          timeframe: "Current",
          description: "35% increase in requests for low-VOC and eco-friendly paints",
          actionRequired: true
        },
        {
          trend: "DIY market growth slowing",
          impact: "positive" as const,
          timeframe: "Next 12 months",
          description: "More homeowners returning to professional services",
          actionRequired: false
        },
        {
          trend: "Labor shortage continuing",
          impact: "negative" as const,
          timeframe: "Ongoing",
          description: "Skilled painter shortage affecting entire industry",
          actionRequired: true
        },
        {
          trend: "Smart home integration",
          impact: "neutral" as const,
          timeframe: "2-3 years",
          description: "Color-changing and smart paint technologies emerging",
          actionRequired: false
        }
      ],
      opportunities: [
        {
          id: "commercial-expansion",
          title: "Commercial Market Expansion",
          description: "Underserved commercial segment with higher margins",
          marketSize: 450000,
          competitionLevel: "medium" as const,
          timeToCapture: "6-12 months",
          probability: 75
        },
        {
          id: "eco-friendly-specialty",
          title: "Eco-Friendly Specialty Services",
          description: "Growing demand for sustainable painting solutions",
          marketSize: 125000,
          competitionLevel: "low" as const,
          timeToCapture: "3-6 months",
          probability: 85
        },
        {
          id: "digital-marketing",
          title: "Digital Marketing Leadership",
          description: "Most competitors have weak online presence",
          marketSize: 200000,
          competitionLevel: "low" as const,
          timeToCapture: "2-4 months",
          probability: 90
        }
      ],
      threats: [
        {
          id: "new-franchise",
          title: "New Franchise Entry",
          description: "Major national franchise considering local expansion",
          severity: "high" as const,
          timeframe: "6-12 months",
          mitigation: "Strengthen customer relationships and service differentiation"
        },
        {
          id: "price-pressure",
          title: "Increasing Price Pressure",
          description: "New low-cost competitors entering market",
          severity: "medium" as const,
          timeframe: "3-6 months",
          mitigation: "Focus on value proposition and quality differentiation"
        },
        {
          id: "economic-downturn",
          title: "Economic Uncertainty",
          description: "Potential recession impacting discretionary spending",
          severity: "medium" as const,
          timeframe: "6-18 months",
          mitigation: "Diversify into maintenance and essential services"
        }
      ]
    };

    // Strategic Insights
    const strategicInsights = {
      competitiveAdvantages: [
        {
          advantage: "Superior Quality Reputation",
          strength: "strong" as const,
          sustainability: "high" as const,
          description: "Consistent 5-star reviews and customer loyalty"
        },
        {
          advantage: "Personal Service Approach",
          strength: "strong" as const,
          sustainability: "high" as const,
          description: "Owner involvement and personalized customer experience"
        },
        {
          advantage: "Digital Marketing Excellence",
          strength: "moderate" as const,
          sustainability: "medium" as const,
          description: "Strong online presence and lead generation"
        },
        {
          advantage: "Flexible Scheduling",
          strength: "moderate" as const,
          sustainability: "medium" as const,
          description: "Ability to accommodate urgent and complex schedules"
        }
      ],
      recommendations: [
        {
          priority: "high" as const,
          category: "service" as const,
          title: "Develop Eco-Friendly Service Line",
          description: "Capitalize on growing eco-friendly demand before competitors",
          expectedImpact: "15-20% revenue increase",
          timeline: "3-6 months"
        },
        {
          priority: "high" as const,
          category: "pricing" as const,
          title: "Value-Based Pricing Strategy",
          description: "Better communicate value to justify premium pricing",
          expectedImpact: "Reduced price objections by 30%",
          timeline: "1-2 months"
        },
        {
          priority: "medium" as const,
          category: "marketing" as const,
          title: "Commercial Market Entry",
          description: "Systematically pursue commercial opportunities",
          expectedImpact: "25-30% market expansion",
          timeline: "6-12 months"
        },
        {
          priority: "medium" as const,
          category: "positioning" as const,
          title: "Technology Integration",
          description: "Leverage technology for competitive advantage",
          expectedImpact: "Operational efficiency gains",
          timeline: "4-8 months"
        }
      ],
      swotAnalysis: {
        strengths: [
          "Excellent quality reputation",
          "Strong customer relationships", 
          "Owner-operated personal service",
          "Competitive pricing within premium segment",
          "Digital marketing capabilities"
        ],
        weaknesses: [
          "Limited team size",
          "Dependence on owner",
          "Premium pricing limits market",
          "No commercial experience",
          "Limited geographic coverage"
        ],
        opportunities: [
          "Eco-friendly service demand",
          "Commercial market expansion",
          "Digital marketing leadership",
          "Technology integration",
          "Strategic partnerships"
        ],
        threats: [
          "New franchise competitors",
          "Price pressure from low-cost providers",
          "Economic downturn impact",
          "Labor shortage",
          "Material cost inflation"
        ]
      }
    };

    return {
      marketPosition,
      competitorAnalysis,
      winLossAnalysis,
      pricingIntelligence,
      marketIntelligence,
      strategicInsights
    };
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading competitive intelligence...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div>
        <p>Unable to load competitive data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div>
        <div>
          <h1>Competitive Intelligence Platform</h1>
          <p>Market positioning and competitive analysis insights</p>
        </div>
        
        <div>
          {/* View Mode Selector */}
          <div>
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'competitors', label: 'Competitors', icon: Users },
              { id: 'pricing', label: 'Pricing', icon: DollarSign },
              { id: 'strategic', label: 'Strategic', icon: Zap }
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

          {/* Analysis Scope Selector */}
          <div>
            {[
              { id: 'local', label: 'Local' },
              { id: 'regional', label: 'Regional' },
              { id: 'national', label: 'National' }
            ].map((scope) => (
              <button
                key={scope.id}
                onClick={() => setAnalysisType(scope.id as any)}
               `}
              >
                {scope.label}
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

      {/* Key Competitive Metrics */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Target />
              Market Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.marketPosition.marketShare.toFixed(1)}%
              </div>
              <div>
                <ArrowUpRight />
                <span>
                  +{metrics.marketPosition.marketShareTrend.toFixed(1)}% growth
                </span>
              </div>
              <div>
                Ranked #{metrics.marketPosition.ranking} locally
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Award />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.winLossAnalysis.overallWinRate}%
              </div>
              <div>
                <ArrowUpRight />
                <span>
                  +{metrics.winLossAnalysis.winRateTrend.toFixed(1)}% improvement
                </span>
              </div>
              <div>
                Above industry average
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <DollarSign />
              Price Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.pricingIntelligence.priceIndex}%
              </div>
              <div>
                vs market average
              </div>
              <div>
                {metrics.pricingIntelligence.pricePosition} positioning
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Zap />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.marketIntelligence.opportunities.length}
              </div>
              <div>
                Growth opportunities identified
              </div>
              <div>
                {formatCurrency(metrics.marketIntelligence.opportunities.reduce((sum, opp) => sum + opp.marketSize, 0))} potential
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div>
          {/* Market Position */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Target />
                Market Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    #{metrics.marketPosition.ranking}
                  </div>
                  <div>Market Ranking</div>
                  <div>{metrics.marketPosition.positioning}</div>
                </div>
                
                <div>
                  <div>
                    <div>{metrics.marketPosition.marketShare.toFixed(1)}%</div>
                    <div>Market Share</div>
                  </div>
                  <div>
                    <div>{metrics.marketPosition.growthRate.toFixed(1)}%</div>
                    <div>Market Growth</div>
                  </div>
                </div>

                <div>
                  <h4>Market Size:</h4>
                  <div>
                    {formatCurrency(metrics.marketPosition.totalMarketSize)}
                  </div>
                  <div>Total addressable market</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Win/Loss Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Award />
                Win/Loss Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>{metrics.winLossAnalysis.overallWinRate}%</div>
                  <div>Overall Win Rate</div>
                </div>

                <div>
                  <h4>Top Loss Reasons:</h4>
                  {metrics.winLossAnalysis.lossReasons.slice(0, 3).map((reason, index) => (
                    <div key={index}>
                      <span>{reason.reason}</span>
                      <div>
                        <div>{reason.percentage}%</div>
                        <div`}>
                          {reason.trend >= 0 ? '+' : ''}{reason.trend.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4>Top Win Reasons:</h4>
                  {metrics.winLossAnalysis.wonReasons.slice(0, 2).map((reason, index) => (
                    <div key={index}>
                      <span>{reason.reason}</span>
                      <div>{reason.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Competitors Mode */}
      {viewMode === 'competitors' && (
        <div>
          {metrics.competitorAnalysis.primaryCompetitors.map((competitor, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
                  <span>
                    <Users />
                    {competitor.name}
                  </span>
                  <span`}>
                    {competitor.threatLevel} threat
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <div>
                      <div>{competitor.marketShare.toFixed(1)}%</div>
                      <div>Market Share</div>
                    </div>
                    <div>
                      <div>{competitor.winRate}%</div>
                      <div>Win Rate</div>
                    </div>
                    <div>
                      <div>{formatCurrency(competitor.avgQuoteValue)}</div>
                      <div>Avg Quote</div>
                    </div>
                  </div>

                  <div>
                    <span`}>
                      {competitor.pricing} pricing
                    </span>
                  </div>

                  <div>
                    <h4>Strengths:</h4>
                    <ul>
                      {competitor.strengths.map((strength, idx) => (
                        <li key={idx}>• {strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4>Weaknesses:</h4>
                    <ul>
                      {competitor.weaknesses.map((weakness, idx) => (
                        <li key={idx}>• {weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pricing Mode */}
      {viewMode === 'pricing' && (
        <div>
          {/* Pricing Position */}
          <Card>
            <CardHeader>
              <CardTitle>
                <DollarSign />
                Pricing Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    {metrics.pricingIntelligence.priceIndex}%
                  </div>
                  <div>vs Market Average</div>
                  <div>{metrics.pricingIntelligence.pricePosition} positioning</div>
                </div>

                <div>
                  <h4>Optimal Pricing Ranges:</h4>
                  <div>
                    <div>
                      <div>Residential</div>
                      <div>
                        ${metrics.pricingIntelligence.optimalPricing.residential.min.toFixed(2)} - 
                        ${metrics.pricingIntelligence.optimalPricing.residential.max.toFixed(2)} /sq ft
                      </div>
                      <div>
                        Recommended: ${metrics.pricingIntelligence.optimalPricing.residential.recommended.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div>Commercial</div>
                      <div>
                        ${metrics.pricingIntelligence.optimalPricing.commercial.min.toFixed(2)} - 
                        ${metrics.pricingIntelligence.optimalPricing.commercial.max.toFixed(2)} /sq ft
                      </div>
                      <div>
                        Recommended: ${metrics.pricingIntelligence.optimalPricing.commercial.recommended.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>
                <BarChart3 />
                Competitor Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.pricingIntelligence.competitorPricing.map((comp, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{comp.competitor}</h3>
                        <div>
                          Range: ${comp.priceRange.min.toFixed(2)} - ${comp.priceRange.max.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div>${comp.avgPrice.toFixed(2)}</div>
                        <div>avg /sq ft</div>
                      </div>
                    </div>
                    <div>
                      <span>Value Perception:</span>
                      <div>
                        <div>
                          <div 
                           
                            style={{ width: `${comp.valuePerception}%` }}
                          ></div>
                        </div>
                        <span>{comp.valuePerception}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Strategic Mode */}
      {viewMode === 'strategic' && (
        <div>
          {/* Strategic Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Zap />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.strategicInsights.recommendations.map((rec, index) => (
                  <div key={index}`}>
                    <div>
                      <div>
                        <h3>{rec.title}</h3>
                        <p>{rec.description}</p>
                      </div>
                      <span`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div>
                      <span>{rec.timeline}</span>
                      <span>{rec.expectedImpact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SWOT Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Shield />
                SWOT Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <h4>Strengths</h4>
                  <ul>
                    {metrics.strategicInsights.swotAnalysis.strengths.slice(0, 3).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Weaknesses</h4>
                  <ul>
                    {metrics.strategicInsights.swotAnalysis.weaknesses.slice(0, 3).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Opportunities</h4>
                  <ul>
                    {metrics.strategicInsights.swotAnalysis.opportunities.slice(0, 3).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Threats</h4>
                  <ul>
                    {metrics.strategicInsights.swotAnalysis.threats.slice(0, 3).map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Globe />
            Market Intelligence & Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {/* Opportunities */}
            <div>
              <h4>Growth Opportunities</h4>
              <div>
                {metrics.marketIntelligence.opportunities.map((opp) => (
                  <div key={opp.id}>
                    <div>
                      <div>
                        <h3>{opp.title}</h3>
                        <p>{opp.description}</p>
                      </div>
                      <span>{opp.probability}%</span>
                    </div>
                    <div>
                      <span>{opp.timeToCapture}</span>
                      <span>{formatCurrency(opp.marketSize)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Threats */}
            <div>
              <h4>Market Threats</h4>
              <div>
                {metrics.marketIntelligence.threats.map((threat) => (
                  <div key={threat.id}>
                    <div>
                      <div>
                        <h3>{threat.title}</h3>
                        <p>{threat.description}</p>
                      </div>
                      <span`}>
                        {threat.severity}
                      </span>
                    </div>
                    <div>{threat.timeframe}</div>
                    <div>
                      Mitigation: {threat.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}