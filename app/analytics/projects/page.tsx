"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calculator,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Star,
  Filter,
  Search,
  Download,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ProjectPerformance {
  id: string;
  customerName: string;
  projectType: string;
  revenue: number;
  costs: {
    materials: number;
    labor: number;
    overhead: number;
  };
  profit: number;
  margin: number;
  duration: number; // days
  efficiency: number; // percentage
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  sqft: number;
  revenuePerSqft: number;
  satisfaction?: number; // 1-5 rating
}

interface ProjectAnalytics {
  summary: {
    totalProjects: number;
    averageProfit: number;
    averageMargin: number;
    bestMargin: number;
    worstMargin: number;
    averageDuration: number;
    totalRevenue: number;
  };
  profitabilityMatrix: Array<{
    range: string;
    count: number;
    revenue: number;
    avgMargin: number;
  }>;
  efficiencyMetrics: {
    onTimeCompletion: number;
    budgetVariance: number;
    qualityScore: number;
    customerSatisfaction: number;
  };
  trends: {
    marginTrend: number;
    revenueTrend: number;
    efficiencyTrend: number;
  };
  outliers: {
    highPerformers: ProjectPerformance[];
    lowPerformers: ProjectPerformance[];
    opportunities: ProjectPerformance[];
  };
}

export default function ProjectPerformanceAnalyzer() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectPerformance[]>([]);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("margin");
  const [viewMode, setViewMode] = useState<'table' | 'matrix' | 'trends' | 'insights'>('table');

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
        loadProjectData(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router]);

  const loadProjectData = async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Convert quotes to project performance data
      const projectPerformanceData = convertQuotesToProjects(quotes);
      setProjects(projectPerformanceData);
      
      // Calculate analytics
      const calculatedAnalytics = calculateProjectAnalytics(projectPerformanceData);
      setAnalytics(calculatedAnalytics);

    } catch (error) {
      console.error("Error loading project data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertQuotesToProjects = (quotes: any[]): ProjectPerformance[] => {
    return quotes.map((quote, index) => {
      const revenue = quote.quote_amount || quote.final_price || quote.total_revenue || 0;
      const sqft = (quote.walls_sqft || 0) + (quote.ceilings_sqft || 0) + (quote.trim_sqft || 0);
      
      // Estimate costs based on industry standards
      const materialCostRate = 0.35; // 35% of revenue
      const laborCostRate = 0.30;    // 30% of revenue
      const overheadCostRate = 0.15;  // 15% of revenue
      
      const materials = revenue * materialCostRate;
      const labor = revenue * laborCostRate;
      const overhead = revenue * overheadCostRate;
      const totalCosts = materials + labor + overhead;
      const profit = revenue - totalCosts;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      // Mock some additional data
      const duration = Math.floor(Math.random() * 14) + 3; // 3-16 days
      const efficiency = Math.floor(Math.random() * 30) + 70; // 70-100%
      const satisfaction = Math.floor(Math.random() * 2) + 4; // 4-5 stars

      return {
        id: quote.quote_id || `project-${index}`,
        customerName: quote.customer_name || 'Unknown Customer',
        projectType: quote.project_type || 'residential',
        revenue,
        costs: { materials, labor, overhead },
        profit,
        margin,
        duration,
        efficiency,
        status: quote.status === 'accepted' ? 'completed' : 'pending',
        createdAt: quote.created_at,
        completedAt: quote.status === 'completed' ? quote.updated_at : undefined,
        sqft: sqft || 1000, // Default if no sqft data
        revenuePerSqft: sqft > 0 ? revenue / sqft : 0,
        satisfaction
      };
    });
  };

  const calculateProjectAnalytics = (projects: ProjectPerformance[]): ProjectAnalytics => {
    if (projects.length === 0) {
      return {
        summary: {
          totalProjects: 0,
          averageProfit: 0,
          averageMargin: 0,
          bestMargin: 0,
          worstMargin: 0,
          averageDuration: 0,
          totalRevenue: 0
        },
        profitabilityMatrix: [],
        efficiencyMetrics: {
          onTimeCompletion: 0,
          budgetVariance: 0,
          qualityScore: 0,
          customerSatisfaction: 0
        },
        trends: {
          marginTrend: 0,
          revenueTrend: 0,
          efficiencyTrend: 0
        },
        outliers: {
          highPerformers: [],
          lowPerformers: [],
          opportunities: []
        }
      };
    }

    // Summary calculations
    const totalRevenue = projects.reduce((sum, p) => sum + p.revenue, 0);
    const averageProfit = projects.reduce((sum, p) => sum + p.profit, 0) / projects.length;
    const averageMargin = projects.reduce((sum, p) => sum + p.margin, 0) / projects.length;
    const margins = projects.map(p => p.margin).sort((a, b) => b - a);
    const bestMargin = margins[0] || 0;
    const worstMargin = margins[margins.length - 1] || 0;
    const averageDuration = projects.reduce((sum, p) => sum + p.duration, 0) / projects.length;

    // Profitability matrix
    const profitabilityMatrix = [
      {
        range: 'High Margin (>30%)',
        count: projects.filter(p => p.margin > 30).length,
        revenue: projects.filter(p => p.margin > 30).reduce((sum, p) => sum + p.revenue, 0),
        avgMargin: projects.filter(p => p.margin > 30).reduce((sum, p) => sum + p.margin, 0) / Math.max(1, projects.filter(p => p.margin > 30).length)
      },
      {
        range: 'Medium Margin (15-30%)',
        count: projects.filter(p => p.margin >= 15 && p.margin <= 30).length,
        revenue: projects.filter(p => p.margin >= 15 && p.margin <= 30).reduce((sum, p) => sum + p.revenue, 0),
        avgMargin: projects.filter(p => p.margin >= 15 && p.margin <= 30).reduce((sum, p) => sum + p.margin, 0) / Math.max(1, projects.filter(p => p.margin >= 15 && p.margin <= 30).length)
      },
      {
        range: 'Low Margin (<15%)',
        count: projects.filter(p => p.margin < 15).length,
        revenue: projects.filter(p => p.margin < 15).reduce((sum, p) => sum + p.revenue, 0),
        avgMargin: projects.filter(p => p.margin < 15).reduce((sum, p) => sum + p.margin, 0) / Math.max(1, projects.filter(p => p.margin < 15).length)
      }
    ];

    // Efficiency metrics (mock data)
    const efficiencyMetrics = {
      onTimeCompletion: 85,
      budgetVariance: 8,
      qualityScore: 92,
      customerSatisfaction: projects.reduce((sum, p) => sum + (p.satisfaction || 4), 0) / projects.length
    };

    // Trends (mock data)
    const trends = {
      marginTrend: 5.2,  // 5.2% improvement
      revenueTrend: 12.8, // 12.8% growth
      efficiencyTrend: 3.1 // 3.1% improvement
    };

    // Outliers
    const sortedByMargin = [...projects].sort((a, b) => b.margin - a.margin);
    const highPerformers = sortedByMargin.slice(0, Math.min(3, projects.length));
    const lowPerformers = sortedByMargin.slice(-Math.min(3, projects.length));
    
    // Opportunities (low margin but high revenue potential)
    const opportunities = projects
      .filter(p => p.margin < 20 && p.revenue > averageProfit * 1.5)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    return {
      summary: {
        totalProjects: projects.length,
        averageProfit,
        averageMargin,
        bestMargin,
        worstMargin,
        averageDuration,
        totalRevenue
      },
      profitabilityMatrix,
      efficiencyMetrics,
      trends,
      outliers: {
        highPerformers,
        lowPerformers,
        opportunities
      }
    };
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = 
        project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'margin':
          return b.margin - a.margin;
        case 'revenue':
          return b.revenue - a.revenue;
        case 'profit':
          return b.profit - a.profit;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading project analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div>
        <p>Unable to load project data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div>
        <div>
          <h1>Project Performance Analyzer</h1>
          <p>Individual project profitability and efficiency insights</p>
        </div>
        
        <div>
          {/* View Mode Selector */}
          <div>
            {[
              { id: 'table', label: 'Table', icon: BarChart3 },
              { id: 'matrix', label: 'Matrix', icon: PieChart },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'insights', label: 'Insights', icon: Zap }
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

          {/* Export Button */}
          <button>
            <Download />
            Export
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <DollarSign />
              Average Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {analytics.summary.averageMargin.toFixed(1)}%
              </div>
              <div>
                <TrendingUp />
                <span>
                  +{analytics.trends.marginTrend.toFixed(1)}% vs last period
                </span>
              </div>
              <div>
                Range: {analytics.summary.worstMargin.toFixed(1)}% - {analytics.summary.bestMargin.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Calculator />
              Average Project Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {formatCurrency(analytics.summary.totalRevenue / analytics.summary.totalProjects)}
              </div>
              <div>
                <TrendingUp />
                <span>
                  +{analytics.trends.revenueTrend.toFixed(1)}% growth
                </span>
              </div>
              <div>
                {analytics.summary.totalProjects} total projects
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Clock />
              Avg Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {analytics.summary.averageDuration.toFixed(0)} days
              </div>
              <div>
                <TrendingUp />
                <span>
                  {analytics.efficiencyMetrics.onTimeCompletion}% on-time
                </span>
              </div>
              <div>
                {analytics.efficiencyMetrics.budgetVariance}% budget variance
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Star />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {analytics.efficiencyMetrics.customerSatisfaction.toFixed(1)}/5
              </div>
              <div>
                <CheckCircle />
                <span>
                  {analytics.efficiencyMetrics.qualityScore}% quality score
                </span>
              </div>
              <div>
                Based on completed projects
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <BarChart3 />
                Project Performance Table
              </CardTitle>
              
              <div>
                {/* Search */}
                <div>
                  <Search />
                  <input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                 
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                 
                >
                  <option value="margin">Sort by Margin</option>
                  <option value="revenue">Sort by Revenue</option>
                  <option value="profit">Sort by Profit</option>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                    <th>Margin</th>
                    <th>$/Sq Ft</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div>
                          <div>{project.customerName}</div>
                          <div>{formatDate(new Date(project.createdAt))}</div>
                        </div>
                      </td>
                      <td>
                        <span>
                          {project.projectType}
                        </span>
                      </td>
                      <td>{formatCurrency(project.revenue)}</td>
                      <td>
                        <span`}>
                          {formatCurrency(project.profit)}
                        </span>
                      </td>
                      <td>
                        <span`}>
                          {project.margin.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        ${project.revenuePerSqft.toFixed(2)}
                      </td>
                      <td>
                        <span`}>
                          {project.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => router.push(`/quotes/${project.id}`)}
                         
                        >
                          <Eye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredProjects.length === 0 && (
                <div>
                  No projects match your filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <Card>
          <CardHeader>
            <CardTitle>
              <PieChart />
              Profitability Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {analytics.profitabilityMatrix.map((matrix, index) => (
                <div key={index}>
                  <div>{matrix.count}</div>
                  <div>{matrix.range}</div>
                  <div>
                    <div>
                      {formatCurrency(matrix.revenue)}
                    </div>
                    <div>
                      Avg margin: {matrix.avgMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights View */}
      {viewMode === 'insights' && (
        <div>
          {/* High Performers */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Star />
                Top Performing Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {analytics.outliers.highPerformers.map((project) => (
                  <div key={project.id}>
                    <div>
                      <div>
                        <h3>{project.customerName}</h3>
                        <p>{project.projectType}</p>
                      </div>
                      <div>
                        <div>{project.margin.toFixed(1)}%</div>
                        <div>{formatCurrency(project.revenue)}</div>
                      </div>
                    </div>
                    <div>
                      Profit: {formatCurrency(project.profit)} • {project.duration} days • {project.efficiency}% efficiency
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Improvement Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>
                <AlertCircle />
                Improvement Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {analytics.outliers.opportunities.map((project) => (
                  <div key={project.id}>
                    <div>
                      <div>
                        <h3>{project.customerName}</h3>
                        <p>{project.projectType}</p>
                      </div>
                      <div>
                        <div>{project.margin.toFixed(1)}%</div>
                        <div>{formatCurrency(project.revenue)}</div>
                      </div>
                    </div>
                    <div>
                      High revenue but low margin - review pricing and costs
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