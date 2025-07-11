"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Heart,
  Target,
  Award,
  Clock,
  Activity,
  Filter,
  Search,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  totalRevenue: number;
  projectCount: number;
  averageProject: number;
  lifetimeValue: number;
  acquisitionDate: string;
  lastProject: string;
  status: 'active' | 'inactive' | 'prospect' | 'at-risk';
  satisfactionScore?: number;
  referrals: number;
  paymentHistory: 'excellent' | 'good' | 'concerning';
  nextProjectProbability: number;
  segment: 'high-value' | 'medium-value' | 'emerging' | 'dormant';
}

interface CustomerSegment {
  name: string;
  count: number;
  totalRevenue: number;
  averageValue: number;
  growthRate: number;
  retentionRate: number;
  color: string;
}

interface CustomerInsights {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  customerGrowthRate: number;
  averageLifetimeValue: number;
  retentionRate: number;
  churnRate: number;
  satisfactionScore: number;
  referralRate: number;
  segments: CustomerSegment[];
  riskFactors: Array<{
    customer: string;
    risk: string;
    probability: number;
    action: string;
  }>;
  opportunities: Array<{
    customer: string;
    opportunity: string;
    potential: number;
    timeline: string;
  }>;
}

export default function CustomerIntelligenceCenter() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [insights, setInsights] = useState<CustomerInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("lifetime-value");
  const [viewMode, setViewMode] = useState<'overview' | 'segments' | 'lifecycle' | 'insights'>('overview');

  const loadCustomerData = useCallback(async (companyId: number) => {
    try {
      setIsLoading(true);
      
      // Load quotes data
      const quotesResponse = await fetch(`/api/quotes?company_id=${companyId}`);
      const quotesData = await quotesResponse.json();
      const quotes = quotesData.quotes || quotesData || [];

      // Transform quotes into customer data
      const customerAnalytics = transformQuotesToCustomerData(quotes);
      setCustomers(customerAnalytics.customers);
      
      // Calculate insights
      const calculatedInsights = calculateCustomerInsights(customerAnalytics.customers);
      setInsights(calculatedInsights);

    } catch (error) {
      console.error("Error loading customer data:", error);
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
        loadCustomerData(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router, loadCustomerData]);

  const transformQuotesToCustomerData = (quotes: any[]) => {
    // Group quotes by customer
    const customerGroups = quotes.reduce((groups, quote) => {
      const customerKey = quote.customer_email || quote.customer_name || 'Unknown';
      if (!groups[customerKey]) {
        groups[customerKey] = [];
      }
      groups[customerKey].push(quote);
      return groups;
    }, {} as Record<string, any[]>);

    // Transform to customer data
    const customers: CustomerData[] = Object.entries(customerGroups).map(([customerKey, customerQuotes], index) => {
      const typedCustomerQuotes = customerQuotes as any[];
      const totalRevenue = typedCustomerQuotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
      const projectCount = typedCustomerQuotes.length;
      const averageProject = totalRevenue / projectCount;
      
      // Sort quotes by date to get first and last
      const sortedQuotes = typedCustomerQuotes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const acquisitionDate = sortedQuotes[0].created_at;
      const lastProject = sortedQuotes[sortedQuotes.length - 1].created_at;
      
      // Calculate days since last project
      const daysSinceLastProject = Math.floor((Date.now() - new Date(lastProject).getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine status
      let status: CustomerData['status'] = 'prospect';
      if (typedCustomerQuotes.some(q => q.status === 'accepted' || q.status === 'completed')) {
        if (daysSinceLastProject <= 90) {
          status = 'active';
        } else if (daysSinceLastProject <= 365) {
          status = 'inactive';
        } else {
          status = 'at-risk';
        }
      }

      // Calculate segment
      let segment: CustomerData['segment'] = 'emerging';
      if (totalRevenue >= 20000) {
        segment = 'high-value';
      } else if (totalRevenue >= 8000) {
        segment = 'medium-value';
      } else if (daysSinceLastProject > 365) {
        segment = 'dormant';
      }

      // Mock additional data
      const satisfactionScore = Math.random() * 2 + 3; // 3-5 stars
      const referrals = Math.floor(Math.random() * 3);
      const paymentHistory = totalRevenue > 10000 ? 'excellent' : Math.random() > 0.7 ? 'good' : 'excellent';
      const nextProjectProbability = status === 'active' ? Math.random() * 40 + 60 : Math.random() * 30 + 20;

      return {
        id: `customer-${index}`,
        name: customerQuotes[0].customer_name || customerKey,
        email: customerQuotes[0].customer_email || '',
        phone: customerQuotes[0].customer_phone,
        address: customerQuotes[0].address,
        totalRevenue,
        projectCount,
        averageProject,
        lifetimeValue: totalRevenue * (projectCount > 1 ? 1.8 : 1.2), // Higher multiplier for repeat customers
        acquisitionDate,
        lastProject,
        status,
        satisfactionScore,
        referrals,
        paymentHistory: paymentHistory as CustomerData['paymentHistory'],
        nextProjectProbability,
        segment
      };
    });

    return { customers };
  };

  const calculateCustomerInsights = (customers: CustomerData[]): CustomerInsights => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    
    // New customers this month
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    const newCustomersThisMonth = customers.filter(c => new Date(c.acquisitionDate) >= thisMonthStart).length;
    
    // Growth rate (mock calculation)
    const customerGrowthRate = newCustomersThisMonth > 0 ? 15.2 : 8.5;
    
    // Lifetime value
    const averageLifetimeValue = customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / totalCustomers;
    
    // Retention and churn
    const retentionRate = (activeCustomers / totalCustomers) * 100;
    const churnRate = 100 - retentionRate;
    
    // Satisfaction
    const satisfactionScore = customers
      .filter(c => c.satisfactionScore)
      .reduce((sum, c) => sum + (c.satisfactionScore || 0), 0) / customers.filter(c => c.satisfactionScore).length;
    
    // Referral rate
    const totalReferrals = customers.reduce((sum, c) => sum + c.referrals, 0);
    const referralRate = totalReferrals > 0 ? (totalReferrals / totalCustomers) * 100 : 12.5;

    // Segments
    const segments: CustomerSegment[] = [
      {
        name: 'High-Value Customers',
        count: customers.filter(c => c.segment === 'high-value').length,
        totalRevenue: customers.filter(c => c.segment === 'high-value').reduce((sum, c) => sum + c.totalRevenue, 0),
        averageValue: customers.filter(c => c.segment === 'high-value').reduce((sum, c) => sum + c.lifetimeValue, 0) / Math.max(1, customers.filter(c => c.segment === 'high-value').length),
        growthRate: 18.5,
        retentionRate: 95,
        color: 'emerald'
      },
      {
        name: 'Medium-Value Customers',
        count: customers.filter(c => c.segment === 'medium-value').length,
        totalRevenue: customers.filter(c => c.segment === 'medium-value').reduce((sum, c) => sum + c.totalRevenue, 0),
        averageValue: customers.filter(c => c.segment === 'medium-value').reduce((sum, c) => sum + c.lifetimeValue, 0) / Math.max(1, customers.filter(c => c.segment === 'medium-value').length),
        growthRate: 12.3,
        retentionRate: 78,
        color: 'blue'
      },
      {
        name: 'Emerging Customers',
        count: customers.filter(c => c.segment === 'emerging').length,
        totalRevenue: customers.filter(c => c.segment === 'emerging').reduce((sum, c) => sum + c.totalRevenue, 0),
        averageValue: customers.filter(c => c.segment === 'emerging').reduce((sum, c) => sum + c.lifetimeValue, 0) / Math.max(1, customers.filter(c => c.segment === 'emerging').length),
        growthRate: 28.7,
        retentionRate: 65,
        color: 'purple'
      },
      {
        name: 'At-Risk Customers',
        count: customers.filter(c => c.segment === 'dormant' || c.status === 'at-risk').length,
        totalRevenue: customers.filter(c => c.segment === 'dormant' || c.status === 'at-risk').reduce((sum, c) => sum + c.totalRevenue, 0),
        averageValue: customers.filter(c => c.segment === 'dormant' || c.status === 'at-risk').reduce((sum, c) => sum + c.lifetimeValue, 0) / Math.max(1, customers.filter(c => c.segment === 'dormant' || c.status === 'at-risk').length),
        growthRate: -5.2,
        retentionRate: 25,
        color: 'red'
      }
    ];

    // Risk factors
    const riskFactors = customers
      .filter(c => c.status === 'at-risk' || c.nextProjectProbability < 30)
      .slice(0, 5)
      .map(c => ({
        customer: c.name,
        risk: c.status === 'at-risk' ? 'Long time since last project' : 'Low engagement',
        probability: 100 - c.nextProjectProbability,
        action: c.status === 'at-risk' ? 'Schedule check-in call' : 'Send targeted offer'
      }));

    // Opportunities
    const opportunities = customers
      .filter(c => c.nextProjectProbability > 70 && c.segment !== 'dormant')
      .sort((a, b) => b.nextProjectProbability - a.nextProjectProbability)
      .slice(0, 5)
      .map(c => ({
        customer: c.name,
        opportunity: c.projectCount > 1 ? 'Repeat business opportunity' : 'First follow-up project',
        potential: c.averageProject * 1.2,
        timeline: c.nextProjectProbability > 85 ? '1-2 months' : '2-4 months'
      }));

    return {
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      customerGrowthRate,
      averageLifetimeValue,
      retentionRate,
      churnRate,
      satisfactionScore,
      referralRate,
      segments,
      riskFactors,
      opportunities
    };
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      
      return matchesSearch && matchesSegment && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'lifetime-value':
          return b.lifetimeValue - a.lifetimeValue;
        case 'total-revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'project-count':
          return b.projectCount - a.projectCount;
        case 'last-project':
          return new Date(b.lastProject).getTime() - new Date(a.lastProject).getTime();
        case 'probability':
          return b.nextProjectProbability - a.nextProjectProbability;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading customer intelligence...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div>
        <p>Unable to load customer data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div>
        <div>
          <h1>Customer Intelligence Center</h1>
          <p>Customer behavior analysis and relationship insights</p>
        </div>
        
        <div>
          {/* View Mode Selector */}
          <div>
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'segments', label: 'Segments', icon: Target },
              { id: 'lifecycle', label: 'Lifecycle', icon: Calendar },
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

      {/* Key Customer Metrics */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Users />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {insights.totalCustomers}
              </div>
              <div>
                <ArrowUpRight />
                <span>
                  +{insights.newCustomersThisMonth} this month
                </span>
              </div>
              <div>
                {insights.activeCustomers} active customers
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <DollarSign />
              Avg Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {formatCurrency(insights.averageLifetimeValue)}
              </div>
              <div>
                <TrendingUp />
                <span>
                  +{insights.customerGrowthRate.toFixed(1)}% growth
                </span>
              </div>
              <div>
                Per customer value
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Heart />
              Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {insights.retentionRate.toFixed(1)}%
              </div>
              <div>
                <CheckCircle />
                <span>
                  {insights.churnRate.toFixed(1)}% churn rate
                </span>
              </div>
              <div>
                Customer loyalty
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Star />
              Satisfaction Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                {insights.satisfactionScore.toFixed(1)}/5
              </div>
              <div>
                <Award />
                <span>
                  {insights.referralRate.toFixed(1)}% referral rate
                </span>
              </div>
              <div>
                Customer happiness
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                <Users />
                Customer Overview
              </CardTitle>
              
              <div>
                {/* Search */}
                <div>
                  <Search />
                  <input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   
                  />
                </div>

                {/* Segment Filter */}
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                 
                >
                  <option value="all">All Segments</option>
                  <option value="high-value">High-Value</option>
                  <option value="medium-value">Medium-Value</option>
                  <option value="emerging">Emerging</option>
                  <option value="dormant">Dormant</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                 
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                  <option value="at-risk">At Risk</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                 
                >
                  <option value="lifetime-value">Sort by LTV</option>
                  <option value="total-revenue">Sort by Revenue</option>
                  <option value="project-count">Sort by Projects</option>
                  <option value="last-project">Sort by Last Project</option>
                  <option value="probability">Sort by Probability</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              {filteredCustomers.map((customer) => (
                <div key={customer.id}>
                  <div>
                    <div>
                      <div>
                        {/* Customer Avatar */}
                        <div>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* Customer Info */}
                        <div>
                          <div>
                            <h3>{customer.name}</h3>
                            <span`}>
                              {customer.segment.replace('-', ' ')}
                            </span>
                            <span`}>
                              {customer.status}
                            </span>
                          </div>
                          
                          <div>
                            {customer.email && (
                              <div>
                                <Mail />
                                <span>{customer.email}</span>
                              </div>
                            )}
                            {customer.phone && (
                              <div>
                                <Phone />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                            {customer.address && (
                              <div>
                                <MapPin />
                                <span>{customer.address}</span>
                              </div>
                            )}
                            <div>
                              <Calendar />
                              <span>Last: {formatDate(new Date(customer.lastProject))}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Metrics */}
                    <div>
                      <div>
                        <div>
                          <div>
                            {formatCurrency(customer.lifetimeValue)}
                          </div>
                          <div>Lifetime Value</div>
                        </div>
                        <div>
                          <div>
                            {customer.projectCount}
                          </div>
                          <div>Projects</div>
                        </div>
                        <div>
                          <div>
                            {customer.nextProjectProbability.toFixed(0)}%
                          </div>
                          <div>Next Project</div>
                        </div>
                        <div>
                          <div>
                            <Star />
                            <span>
                              {customer.satisfactionScore?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                          <div>Satisfaction</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => router.push(`/customers/${customer.id}`)}
                       
                      >
                        <Eye />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCustomers.length === 0 && (
                <div>
                  No customers match your filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Segments View */}
      {viewMode === 'segments' && (
        <div>
          {insights.segments.map((segment, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle-700`}>
                  <Target-600`} />
                  {segment.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <div>
                      <div>{segment.count}</div>
                      <div>Customers</div>
                    </div>
                    <div>
                      <div>
                        {formatCurrency(segment.totalRevenue)}
                      </div>
                      <div>Total Revenue</div>
                    </div>
                  </div>
                  
                  <div>
                    <div>
                      <span>Average Value:</span>
                      <span>{formatCurrency(segment.averageValue)}</span>
                    </div>
                    <div>
                      <span>Growth Rate:</span>
                      <span`}>
                        {segment.growthRate >= 0 ? '+' : ''}{segment.growthRate.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span>Retention:</span>
                      <span>{segment.retentionRate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insights View */}
      {viewMode === 'insights' && (
        <div>
          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle>
                <AlertTriangle />
                Customer Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {insights.riskFactors.map((risk, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{risk.customer}</h3>
                        <p>{risk.risk}</p>
                      </div>
                      <div>
                        <div>{risk.probability.toFixed(0)}%</div>
                        <div>Risk Level</div>
                      </div>
                    </div>
                    <div>
                      Action: {risk.action}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Zap />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {insights.opportunities.map((opportunity, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        <h3>{opportunity.customer}</h3>
                        <p>{opportunity.opportunity}</p>
                      </div>
                      <div>
                        <div>
                          {formatCurrency(opportunity.potential)}
                        </div>
                        <div>Potential</div>
                      </div>
                    </div>
                    <div>
                      Timeline: {opportunity.timeline}
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