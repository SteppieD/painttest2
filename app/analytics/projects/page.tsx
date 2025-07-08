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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load project data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Performance Analyzer</h1>
          <p className="text-gray-600">Individual project profitability and efficiency insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'table', label: 'Table', icon: BarChart3 },
              { id: 'matrix', label: 'Matrix', icon: PieChart },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'insights', label: 'Insights', icon: Zap }
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

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Average Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">
                {analytics.summary.averageMargin.toFixed(1)}%
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{analytics.trends.marginTrend.toFixed(1)}% vs last period
                </span>
              </div>
              <div className="text-xs text-green-600">
                Range: {analytics.summary.worstMargin.toFixed(1)}% - {analytics.summary.bestMargin.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Average Project Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(analytics.summary.totalRevenue / analytics.summary.totalProjects)}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  +{analytics.trends.revenueTrend.toFixed(1)}% growth
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {analytics.summary.totalProjects} total projects
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">
                {analytics.summary.averageDuration.toFixed(0)} days
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  {analytics.efficiencyMetrics.onTimeCompletion}% on-time
                </span>
              </div>
              <div className="text-xs text-purple-600">
                {analytics.efficiencyMetrics.budgetVariance}% budget variance
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-800">
                {analytics.efficiencyMetrics.customerSatisfaction.toFixed(1)}/5
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">
                  {analytics.efficiencyMetrics.qualityScore}% quality score
                </span>
              </div>
              <div className="text-xs text-orange-600">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Project Performance Table
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Profit</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Margin</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">$/Sq Ft</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{project.customerName}</div>
                          <div className="text-sm text-gray-500">{formatDate(new Date(project.createdAt))}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {project.projectType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(project.revenue)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${project.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(project.profit)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${
                          project.margin >= 30 ? 'text-green-600' :
                          project.margin >= 15 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {project.margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600">
                        ${project.revenuePerSqft.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => router.push(`/quotes/${project.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
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
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Profitability Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analytics.profitabilityMatrix.map((matrix, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{matrix.count}</div>
                  <div className="text-sm font-medium text-gray-700 mb-3">{matrix.range}</div>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(matrix.revenue)}
                    </div>
                    <div className="text-sm text-gray-600">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* High Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Star className="w-5 h-5" />
                Top Performing Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.outliers.highPerformers.map((project) => (
                  <div key={project.id} className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.customerName}</h3>
                        <p className="text-sm text-gray-600 capitalize">{project.projectType}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{project.margin.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">{formatCurrency(project.revenue)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-700">
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
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="w-5 h-5" />
                Improvement Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.outliers.opportunities.map((project) => (
                  <div key={project.id} className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.customerName}</h3>
                        <p className="text-sm text-gray-600 capitalize">{project.projectType}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">{project.margin.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">{formatCurrency(project.revenue)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-orange-700">
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