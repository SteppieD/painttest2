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
      <div>
        <div>
          <div></div>
          <p>Loading operational analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div>
        <p>Unable to load operational data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div>
        <div>
          <h1>Operational Excellence Dashboard</h1>
          <p>Workflow efficiency and resource optimization insights</p>
        </div>
        
        <div>
          {/* View Mode Selector */}
          <div>
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'efficiency', label: 'Efficiency', icon: Zap },
              { id: 'quality', label: 'Quality', icon: Award },
              { id: 'workflow', label: 'Workflow', icon: Activity }
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
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'quarter', label: 'Quarter' }
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

      {/* Operational Alerts */}
      {alerts.length > 0 && (
        <div>
          {alerts.slice(0, 4).map((alert) => (
            <Card key={alert.id}`}>
              <CardContent>
                <div>
                  {alert.type === 'error' ? (
                    <AlertTriangle />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle />
                  ) : (
                    <CheckCircle />
                  )}
                  <div>
                    <h3>{alert.title}</h3>
                    <p>{alert.description}</p>
                    <p>{alert.action}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Key Operational Metrics */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Clock />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.responseTime.average.toFixed(1)}h
              </div>
              <div>
                {metrics.responseTime.trend < 0 ? (
                  <ArrowDownRight />
                ) : (
                  <ArrowUpRight />
                )}
                <span`}>
                  {Math.abs(metrics.responseTime.trend).toFixed(1)}h vs last period
                </span>
              </div>
              <div>
                Target: {metrics.responseTime.target}h
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Target />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.conversionRate.current.toFixed(1)}%
              </div>
              <div>
                <ArrowUpRight />
                <span>
                  +{metrics.conversionRate.trend.toFixed(1)}% improvement
                </span>
              </div>
              <div>
                Target: {metrics.conversionRate.target}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Users />
              Resource Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.resourceUtilization.efficiency}%
              </div>
              <div>
                Labor: {metrics.resourceUtilization.labor}% • Equipment: {metrics.resourceUtilization.equipment}%
              </div>
              <div>
                Overall capacity utilization
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Award />
              Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {metrics.qualityMetrics.satisfaction.toFixed(1)}/5
              </div>
              <div>
                {metrics.qualityMetrics.completionRate}% on-time completion
              </div>
              <div>
                {metrics.qualityMetrics.defectRate}% defect rate
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <div>
          {/* Response Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Clock />
                Response Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.responseTime.distribution.map((range, index) => (
                  <div key={index}>
                    <div>
                      <span>{range.range}</span>
                      <div>
                        <span>{range.count} quotes</span>
                        <span>({range.percentage}%)</span>
                      </div>
                    </div>
                    <div>
                      <div 
                       
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
              <CardTitle>
                <Target />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.conversionRate.byStage.map((stage, index) => (
                  <div key={index}>
                    <div>
                      <span>{stage.stage}</span>
                      <div>
                        <span>{stage.rate}%</span>
                        <span>({stage.volume} leads)</span>
                      </div>
                    </div>
                    <div>
                      <div 
                       `}
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
        <div>
          {/* Resource Utilization */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Users />
                Resource Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    <div>{metrics.resourceUtilization.labor}%</div>
                    <div>Labor</div>
                  </div>
                  <div>
                    <div>{metrics.resourceUtilization.equipment}%</div>
                    <div>Equipment</div>
                  </div>
                </div>
                
                <div>
                  <h4>Resource Bottlenecks:</h4>
                  {metrics.resourceUtilization.bottlenecks.map((bottleneck, index) => (
                    <div key={index}>
                      <div>
                        <span>{bottleneck.resource}</span>
                        <span`}>
                          {bottleneck.utilization}%
                        </span>
                      </div>
                      <p>{bottleneck.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Trends */}
          <Card>
            <CardHeader>
              <CardTitle>
                <TrendingUp />
                Productivity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.productivity.trends.map((trend, index) => (
                  <div key={index}>
                    <div>
                      <div>{trend.metric}</div>
                      <div>
                        {trend.metric.includes('Revenue') ? formatCurrency(trend.current) : trend.current.toFixed(1)}
                        {trend.metric.includes('%') || trend.metric.includes('Capacity') ? '%' : ''}
                      </div>
                    </div>
                    <div>
                      <div`}>
                        {trend.change >= 0 ? (
                          <ArrowUpRight />
                        ) : (
                          <ArrowDownRight />
                        )}
                        {Math.abs(trend.change).toFixed(1)}%
                      </div>
                      <div>vs last period</div>
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
            <CardTitle>
              <Award />
              Quality Metrics Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {metrics.qualityMetrics.timeline.map((period, index) => (
                <div key={index}>
                  <div>
                    <div>{period.period}</div>
                    <div>Period</div>
                  </div>
                  <div>
                    <div>{period.satisfaction.toFixed(1)}/5</div>
                    <div>Satisfaction</div>
                  </div>
                  <div>
                    <div>{period.defects.toFixed(1)}%</div>
                    <div>Defect Rate</div>
                  </div>
                  <div>
                    <div>{period.onTime}%</div>
                    <div>On-Time</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow Mode */}
      {viewMode === 'workflow' && (
        <div>
          {/* Project Workflow Stages */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Activity />
                Project Workflow Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {metrics.workflow.stages.map((stage, index) => (
                  <div key={index}`}>
                    <div>
                      <div>
                        <h3>{stage.stage}</h3>
                        {stage.bottleneck && (
                          <span>BOTTLENECK DETECTED</span>
                        )}
                      </div>
                      <div>
                        <div>{stage.avgDuration.toFixed(1)} days</div>
                        <div>±{stage.variability.toFixed(1)} days</div>
                      </div>
                    </div>
                    <div>
                      <div 
                       `}
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
              <CardTitle>
                <Settings />
                Workflow Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    <div>{metrics.workflow.avgProjectDuration.toFixed(1)}</div>
                    <div>Avg Duration (days)</div>
                  </div>
                  <div>
                    <div>{metrics.workflow.onTimeCompletion}%</div>
                    <div>On-Time Completion</div>
                  </div>
                </div>

                <div>
                  <div>
                    <span>Schedule Optimization:</span>
                    <span>{metrics.workflow.scheduleOptimization}%</span>
                  </div>
                  <div>
                    <div 
                     
                      style={{ width: `${metrics.workflow.scheduleOptimization}%` }}
                    ></div>
                  </div>

                  <div>
                    <span>Process Efficiency:</span>
                    <span>{metrics.workflow.processEfficiency}%</span>
                  </div>
                  <div>
                    <div 
                     
                      style={{ width: `${metrics.workflow.processEfficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4>Optimization Recommendations:</h4>
                  <ul>
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