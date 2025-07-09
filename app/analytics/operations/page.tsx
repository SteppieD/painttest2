"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock,
  Users,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Zap,
  Filter,
  Search,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Award,
  Wrench
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface OperationalMetrics {
  responseTime: {
    average: number;
    target: number;
    trend: number;
    distribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  conversionRate: {
    current: number;
    target: number;
    trend: number;
    byStage: Array<{
      stage: string;
      rate: number;
      volume: number;
    }>;
  };
  resourceUtilization: {
    equipment: number;
    labor: number;
    capacity: number;
    efficiency: number;
    bottlenecks: Array<{
      resource: string;
      utilization: number;
      impact: string;
    }>;
  };
  qualityMetrics: {
    satisfaction: number;
    defectRate: number;
    reworkRate: number;
    completionRate: number;
    timeline: Array<{
      period: string;
      satisfaction: number;
      defects: number;
      onTime: number;
    }>;
  };
  workflow: {
    avgProjectDuration: number;
    onTimeCompletion: number;
    scheduleOptimization: number;
    processEfficiency: number;
    stages: Array<{
      stage: string;
      avgDuration: number;
      variability: number;
      bottleneck: boolean;
    }>;
  };
  productivity: {
    quotesPerDay: number;
    revenuePerHour: number;
    capacityUtilization: number;
    teamEfficiency: number;
    trends: Array<{
      metric: string;
      current: number;
      previous: number;
      change: number;
    }>;
  };
}

interface AlertItem {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

export default function OperationalExcellenceDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [viewMode, setViewMode] = useState<'overview' | 'efficiency' | 'quality' | 'workflow'>('overview');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

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
        loadOperationalData(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router, timeRange]);

  const loadOperationalData = async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data for operational analysis
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Calculate operational metrics
      const calculatedMetrics = calculateOperationalMetrics(quotes);
      setMetrics(calculatedMetrics);
      
      // Generate operational alerts
      const operationalAlerts = generateOperationalAlerts(calculatedMetrics);
      setAlerts(operationalAlerts);

    } catch (error) {
      console.error("Error loading operational data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOperationalMetrics = (quotes: any[]): OperationalMetrics => {
    // Mock operational data - in production would come from real operational tracking
    
    // Response time analysis
    const responseTime = {
      average: 4.2, // hours
      target: 6.0,
      trend: -0.8, // improving
      distribution: [
        { range: '< 2 hours', count: 12, percentage: 15 },
        { range: '2-6 hours', count: 45, percentage: 56 },
        { range: '6-24 hours', count: 18, percentage: 23 },
        { range: '> 24 hours', count: 5, percentage: 6 }
      ]
    };

    // Conversion rate by stage
    const conversionRate = {
      current: 28.5,
      target: 35.0,
      trend: 3.2,
      byStage: [
        { stage: 'Initial Contact', rate: 92, volume: quotes.length },
        { stage: 'Site Visit', rate: 78, volume: Math.floor(quotes.length * 0.92) },
        { stage: 'Quote Provided', rate: 85, volume: Math.floor(quotes.length * 0.78) },
        { stage: 'Quote Accepted', rate: 35, volume: Math.floor(quotes.length * 0.85) }
      ]
    };

    // Resource utilization
    const resourceUtilization = {
      equipment: 78,
      labor: 92,
      capacity: 85,
      efficiency: 89,
      bottlenecks: [
        { resource: 'Spray Equipment', utilization: 95, impact: 'High - limiting project capacity' },
        { resource: 'Lead Painters', utilization: 88, impact: 'Medium - occasional delays' },
        { resource: 'Scaffolding', utilization: 72, impact: 'Low - adequate availability' }
      ]
    };

    // Quality metrics
    const qualityMetrics = {
      satisfaction: 4.7, // out of 5
      defectRate: 2.1, // percentage
      reworkRate: 1.8,
      completionRate: 96.2,
      timeline: [
        { period: 'Jan', satisfaction: 4.6, defects: 2.8, onTime: 94 },
        { period: 'Feb', satisfaction: 4.5, defects: 3.1, onTime: 92 },
        { period: 'Mar', satisfaction: 4.7, defects: 2.2, onTime: 95 },
        { period: 'Apr', satisfaction: 4.8, defects: 1.9, onTime: 97 },
        { period: 'May', satisfaction: 4.7, defects: 2.1, onTime: 96 },
        { period: 'Jun', satisfaction: 4.8, defects: 1.7, onTime: 98 }
      ]
    };

    // Workflow efficiency
    const workflow = {
      avgProjectDuration: 8.5, // days
      onTimeCompletion: 89,
      scheduleOptimization: 92,
      processEfficiency: 87,
      stages: [
        { stage: 'Prep Work', avgDuration: 1.5, variability: 0.3, bottleneck: false },
        { stage: 'Primer Application', avgDuration: 1.0, variability: 0.2, bottleneck: false },
        { stage: 'Painting', avgDuration: 4.5, variability: 1.2, bottleneck: true },
        { stage: 'Touch-ups', avgDuration: 0.8, variability: 0.4, bottleneck: false },
        { stage: 'Cleanup', avgDuration: 0.7, variability: 0.1, bottleneck: false }
      ]
    };

    // Team productivity
    const productivity = {
      quotesPerDay: 3.2,
      revenuePerHour: 125,
      capacityUtilization: 85,
      teamEfficiency: 92,
      trends: [
        { metric: 'Quotes/Day', current: 3.2, previous: 2.8, change: 14.3 },
        { metric: 'Revenue/Hour', current: 125, previous: 118, change: 5.9 },
        { metric: 'Capacity %', current: 85, previous: 82, change: 3.7 },
        { metric: 'Team Efficiency', current: 92, previous: 89, change: 3.4 }
      ]
    };

    return {
      responseTime,
      conversionRate,
      resourceUtilization,
      qualityMetrics,
      workflow,
      productivity
    };
  };

  const generateOperationalAlerts = (metrics: OperationalMetrics): AlertItem[] => {
    const alerts: AlertItem[] = [];

    // Response time alerts
    if (metrics.responseTime.average > metrics.responseTime.target) {
      alerts.push({
        id: 'response-time-high',
        type: 'warning',
        title: 'Response Time Above Target',
        description: `Average response time is ${metrics.responseTime.average}h vs ${metrics.responseTime.target}h target`,
        priority: 'medium',
        action: 'Review quote workflow and staffing'
      });
    }

    // Conversion rate alerts
    if (metrics.conversionRate.current < metrics.conversionRate.target) {
      alerts.push({
        id: 'conversion-low',
        type: 'warning',
        title: 'Conversion Rate Below Target',
        description: `Current rate ${metrics.conversionRate.current}% vs ${metrics.conversionRate.target}% target`,
        priority: 'high',
        action: 'Analyze quote pricing and presentation'
      });
    }

    // Resource utilization alerts
    metrics.resourceUtilization.bottlenecks.forEach(bottleneck => {
      if (bottleneck.utilization > 90) {
        alerts.push({
          id: `bottleneck-${bottleneck.resource.toLowerCase().replace(' ', '-')}`,
          type: 'error',
          title: 'Resource Bottleneck Detected',
          description: `${bottleneck.resource} at ${bottleneck.utilization}% utilization`,
          priority: 'high',
          action: 'Consider additional capacity or scheduling optimization'
        });
      }
    });

    // Quality alerts
    if (metrics.qualityMetrics.defectRate > 3.0) {
      alerts.push({
        id: 'quality-defects',
        type: 'warning',
        title: 'Quality Issues Detected',
        description: `Defect rate at ${metrics.qualityMetrics.defectRate}% - above 3% threshold`,
        priority: 'medium',
        action: 'Review quality control processes'
      });
    }

    return alerts;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading operational analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load operational data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operational Excellence Dashboard</h1>
          <p className="text-gray-600">Workflow efficiency and resource optimization insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'efficiency', label: 'Efficiency', icon: Zap },
              { id: 'quality', label: 'Quality', icon: Award },
              { id: 'workflow', label: 'Workflow', icon: Activity }
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
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' }
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

      {/* Operational Alerts */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {alerts.slice(0, 4).map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.type === 'error' ? 'border-l-red-500 bg-red-50' :
              alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {alert.type === 'error' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <p className="text-xs text-gray-500 italic">{alert.action}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Key Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">
                {metrics.responseTime.average.toFixed(1)}h
              </div>
              <div className="flex items-center gap-2">
                {metrics.responseTime.trend < 0 ? (
                  <ArrowDownRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  metrics.responseTime.trend < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(metrics.responseTime.trend).toFixed(1)}h vs last period
                </span>
              </div>
              <div className="text-xs text-blue-600">
                Target: {metrics.responseTime.target}h
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">
                {metrics.conversionRate.current.toFixed(1)}%
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{metrics.conversionRate.trend.toFixed(1)}% improvement
                </span>
              </div>
              <div className="text-xs text-green-600">
                Target: {metrics.conversionRate.target}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Resource Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">
                {metrics.resourceUtilization.efficiency}%
              </div>
              <div className="text-sm text-purple-600">
                Labor: {metrics.resourceUtilization.labor}% • Equipment: {metrics.resourceUtilization.equipment}%
              </div>
              <div className="text-xs text-purple-600">
                Overall capacity utilization
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-800">
                {metrics.qualityMetrics.satisfaction.toFixed(1)}/5
              </div>
              <div className="text-sm text-orange-600">
                {metrics.qualityMetrics.completionRate}% on-time completion
              </div>
              <div className="text-xs text-orange-600">
                {metrics.qualityMetrics.defectRate}% defect rate
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Response Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.responseTime.distribution.map((range, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{range.range}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold">{range.count} quotes</span>
                        <span className="text-xs text-gray-500 ml-2">({range.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${range.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.conversionRate.byStage.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold">{stage.rate}%</span>
                        <span className="text-xs text-gray-500 ml-2">({stage.volume} leads)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          stage.rate >= 80 ? 'bg-green-500' :
                          stage.rate >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${stage.rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Efficiency Mode */}
      {viewMode === 'efficiency' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Resource Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-800">{metrics.resourceUtilization.labor}%</div>
                    <div className="text-sm text-gray-600">Labor</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-800">{metrics.resourceUtilization.equipment}%</div>
                    <div className="text-sm text-gray-600">Equipment</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Resource Bottlenecks:</h4>
                  {metrics.resourceUtilization.bottlenecks.map((bottleneck, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{bottleneck.resource}</span>
                        <span className={`font-bold ${
                          bottleneck.utilization >= 90 ? 'text-red-600' :
                          bottleneck.utilization >= 80 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {bottleneck.utilization}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{bottleneck.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Productivity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.productivity.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{trend.metric}</div>
                      <div className="text-lg font-bold text-gray-800">
                        {trend.metric.includes('Revenue') ? formatCurrency(trend.current) : trend.current.toFixed(1)}
                        {trend.metric.includes('%') || trend.metric.includes('Capacity') ? '%' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        trend.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.change >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {Math.abs(trend.change).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">vs last period</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quality Mode */}
      {viewMode === 'quality' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Quality Metrics Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.qualityMetrics.timeline.map((period, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{period.period}</div>
                    <div className="text-sm text-gray-600">Period</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{period.satisfaction.toFixed(1)}/5</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{period.defects.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Defect Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{period.onTime}%</div>
                    <div className="text-sm text-gray-600">On-Time</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Mode */}
      {viewMode === 'workflow' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Workflow Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Project Workflow Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.workflow.stages.map((stage, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    stage.bottleneck ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{stage.stage}</h3>
                        {stage.bottleneck && (
                          <span className="text-xs text-red-600 font-medium">BOTTLENECK DETECTED</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{stage.avgDuration.toFixed(1)} days</div>
                        <div className="text-sm text-gray-600">±{stage.variability.toFixed(1)} days</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stage.bottleneck ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${(stage.avgDuration / Math.max(...metrics.workflow.stages.map(s => s.avgDuration))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workflow Efficiency Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-600" />
                Workflow Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-800">{metrics.workflow.avgProjectDuration.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Avg Duration (days)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-800">{metrics.workflow.onTimeCompletion}%</div>
                    <div className="text-sm text-gray-600">On-Time Completion</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Schedule Optimization:</span>
                    <span className="font-semibold">{metrics.workflow.scheduleOptimization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${metrics.workflow.scheduleOptimization}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Process Efficiency:</span>
                    <span className="font-semibold">{metrics.workflow.processEfficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${metrics.workflow.processEfficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Optimization Recommendations:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Automate material ordering for prep work</li>
                    <li>• Implement advanced scheduling for painting stage</li>
                    <li>• Standardize touch-up processes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}