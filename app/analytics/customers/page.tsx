"use client";

import { useState, useEffect } from "react";
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
  }, [router]);

  const loadCustomerData = async (companyId: number) => {
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
  };

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
      const totalRevenue = customerQuotes.reduce((sum, q) => sum + (q.quote_amount || q.final_price || q.total_revenue || 0), 0);
      const projectCount = customerQuotes.length;
      const averageProject = totalRevenue / projectCount;
      
      // Sort quotes by date to get first and last
      const sortedQuotes = customerQuotes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const acquisitionDate = sortedQuotes[0].created_at;
      const lastProject = sortedQuotes[sortedQuotes.length - 1].created_at;
      
      // Calculate days since last project
      const daysSinceLastProject = Math.floor((Date.now() - new Date(lastProject).getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine status
      let status: CustomerData['status'] = 'prospect';
      if (customerQuotes.some(q => q.status === 'accepted' || q.status === 'completed')) {
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer intelligence...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load customer data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Intelligence Center</h1>
          <p className="text-gray-600">Customer behavior analysis and relationship insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* View Mode Selector */}
          <div className="flex bg-white rounded-lg border">
            {[
              { id: 'overview', label: 'Overview', icon: Users },
              { id: 'segments', label: 'Segments', icon: Target },
              { id: 'lifecycle', label: 'Lifecycle', icon: Calendar },
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

      {/* Key Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-800">
                {insights.totalCustomers}
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  +{insights.newCustomersThisMonth} this month
                </span>
              </div>
              <div className="text-xs text-blue-600">
                {insights.activeCustomers} active customers
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Avg Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-800">
                {formatCurrency(insights.averageLifetimeValue)}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{insights.customerGrowthRate.toFixed(1)}% growth
                </span>
              </div>
              <div className="text-xs text-green-600">
                Per customer value
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-800">
                {insights.retentionRate.toFixed(1)}%
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  {insights.churnRate.toFixed(1)}% churn rate
                </span>
              </div>
              <div className="text-xs text-purple-600">
                Customer loyalty
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Satisfaction Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-800">
                {insights.satisfactionScore.toFixed(1)}/5
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">
                  {insights.referralRate.toFixed(1)}% referral rate
                </span>
              </div>
              <div className="text-xs text-orange-600">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Customer Overview
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Segment Filter */}
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Customer Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* Customer Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.segment === 'high-value' ? 'bg-green-100 text-green-800' :
                              customer.segment === 'medium-value' ? 'bg-blue-100 text-blue-800' :
                              customer.segment === 'emerging' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {customer.segment.replace('-', ' ')}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.status === 'active' ? 'bg-green-100 text-green-800' :
                              customer.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                              customer.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {customer.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            {customer.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{customer.email}</span>
                              </div>
                            )}
                            {customer.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                            {customer.address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{customer.address}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Last: {formatDate(new Date(customer.lastProject))}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Metrics */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(customer.lifetimeValue)}
                          </div>
                          <div className="text-xs text-gray-500">Lifetime Value</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {customer.projectCount}
                          </div>
                          <div className="text-xs text-gray-500">Projects</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">
                            {customer.nextProjectProbability.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">Next Project</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-lg font-bold text-yellow-600">
                              {customer.satisfactionScore?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">Satisfaction</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => router.push(`/customers/${customer.id}`)}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No customers match your filters
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Segments View */}
      {viewMode === 'segments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.segments.map((segment, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-${segment.color}-700`}>
                  <Target className={`w-5 h-5 text-${segment.color}-600`} />
                  {segment.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{segment.count}</div>
                      <div className="text-sm text-gray-600">Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(segment.totalRevenue)}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Value:</span>
                      <span className="font-semibold">{formatCurrency(segment.averageValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Growth Rate:</span>
                      <span className={`font-semibold ${segment.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {segment.growthRate >= 0 ? '+' : ''}{segment.growthRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Retention:</span>
                      <span className="font-semibold">{segment.retentionRate}%</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Customer Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{risk.customer}</h3>
                        <p className="text-sm text-gray-600">{risk.risk}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{risk.probability.toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Risk Level</div>
                      </div>
                    </div>
                    <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
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
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Zap className="w-5 h-5" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{opportunity.customer}</h3>
                        <p className="text-sm text-gray-600">{opportunity.opportunity}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(opportunity.potential)}
                        </div>
                        <div className="text-xs text-gray-500">Potential</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
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