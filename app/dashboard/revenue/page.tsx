"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Search,
  Download,
  BarChart3,
  PieChart,
  Target
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Quote {
  id: number;
  quote_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  quote_amount: number;
  notes: string;
  status?: string;
  created_at: string;
  company_id: number;
  project_type?: string;
  time_estimate?: string;
}

interface RevenueStats {
  totalRevenue: number;
  acceptedRevenue: number;
  completedRevenue: number;
  pendingRevenue: number;
  averageQuoteValue: number;
  highestQuote: number;
  lowestQuote: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
  conversionRate: number;
}

export default function RevenuePage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    acceptedRevenue: 0,
    completedRevenue: 0,
    pendingRevenue: 0,
    averageQuoteValue: 0,
    highestQuote: 0,
    lowestQuote: 0,
    monthlyGrowth: 0,
    yearlyGrowth: 0,
    conversionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState<{month: string; revenue: number}[]>([]);
  const [projectTypeRevenue, setProjectTypeRevenue] = useState<{type: string; revenue: number; count: number}[]>([]);

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
        loadQuotes(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router]);

  const loadQuotes = async (companyId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quotes?company_id=${companyId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setQuotes(data);
        calculateStats(data);
        calculateMonthlyRevenue(data);
        calculateProjectTypeRevenue(data);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (quotesData: Quote[]) => {
    const totalRevenue = quotesData.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);
    const acceptedQuotes = quotesData.filter(q => q.status === "accepted");
    const completedQuotes = quotesData.filter(q => q.status === "completed");
    const pendingQuotes = quotesData.filter(q => !q.status || q.status === "pending");
    
    const acceptedRevenue = acceptedQuotes.reduce((sum, quote) => sum + quote.quote_amount, 0);
    const completedRevenue = completedQuotes.reduce((sum, quote) => sum + quote.quote_amount, 0);
    const pendingRevenue = pendingQuotes.reduce((sum, quote) => sum + quote.quote_amount, 0);

    const quoteAmounts = quotesData.map(q => q.quote_amount).filter(a => a > 0);
    const highestQuote = quoteAmounts.length > 0 ? Math.max(...quoteAmounts) : 0;
    const lowestQuote = quoteAmounts.length > 0 ? Math.min(...quoteAmounts) : 0;
    const averageQuoteValue = quotesData.length > 0 ? totalRevenue / quotesData.length : 0;

    // Calculate monthly growth
    const now = new Date();
    const thisMonthRevenue = quotesData
      .filter(q => {
        const date = new Date(q.created_at);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, quote) => sum + quote.quote_amount, 0);

    const lastMonthRevenue = quotesData
      .filter(q => {
        const date = new Date(q.created_at);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return date.getMonth() === lastMonth.getMonth() && 
               date.getFullYear() === lastMonth.getFullYear();
      })
      .reduce((sum, quote) => sum + quote.quote_amount, 0);

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Calculate yearly growth
    const thisYearRevenue = quotesData
      .filter(q => new Date(q.created_at).getFullYear() === now.getFullYear())
      .reduce((sum, quote) => sum + quote.quote_amount, 0);

    const lastYearRevenue = quotesData
      .filter(q => new Date(q.created_at).getFullYear() === now.getFullYear() - 1)
      .reduce((sum, quote) => sum + quote.quote_amount, 0);

    const yearlyGrowth = lastYearRevenue > 0 
      ? ((thisYearRevenue - lastYearRevenue) / lastYearRevenue) * 100 
      : 0;

    // Calculate conversion rate (accepted + completed vs total)
    const conversionRate = quotesData.length > 0
      ? ((acceptedQuotes.length + completedQuotes.length) / quotesData.length) * 100
      : 0;

    setStats({
      totalRevenue,
      acceptedRevenue,
      completedRevenue,
      pendingRevenue,
      averageQuoteValue,
      highestQuote,
      lowestQuote,
      monthlyGrowth,
      yearlyGrowth,
      conversionRate,
    });
  };

  const calculateMonthlyRevenue = (quotesData: Quote[]) => {
    const monthRevenue: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthRevenue[monthKey] = 0;
    }

    quotesData.forEach(quote => {
      const date = new Date(quote.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthRevenue.hasOwnProperty(monthKey)) {
        monthRevenue[monthKey] += quote.quote_amount;
      }
    });

    const data = Object.entries(monthRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    setMonthlyRevenue(data);
  };

  const calculateProjectTypeRevenue = (quotesData: Quote[]) => {
    const typeRevenue: { [key: string]: { revenue: number; count: number } } = {};

    quotesData.forEach(quote => {
      const type = quote.project_type || 'General';
      if (!typeRevenue[type]) {
        typeRevenue[type] = { revenue: 0, count: 0 };
      }
      typeRevenue[type].revenue += quote.quote_amount;
      typeRevenue[type].count += 1;
    });

    const data = Object.entries(typeRevenue)
      .map(([type, data]) => ({
        type,
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    setProjectTypeRevenue(data);
  };

  const getFilteredQuotes = () => {
    let filtered = quotes;

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(quote => {
        const quoteDate = new Date(quote.created_at);
        switch (timeFilter) {
          case "today":
            return quoteDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return quoteDate >= weekAgo;
          case "month":
            return quoteDate.getMonth() === now.getMonth() && 
                   quoteDate.getFullYear() === now.getFullYear();
          case "year":
            return quoteDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(quote => 
        statusFilter === "pending" 
          ? !quote.status || quote.status === "pending"
          : quote.status === statusFilter
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(quote.quote_id || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by amount descending
    return filtered.sort((a, b) => b.quote_amount - a.quote_amount);
  };

  const exportData = () => {
    const filteredQuotes = getFilteredQuotes();
    const csv = [
      ["Quote ID", "Customer", "Address", "Amount", "Status", "Project Type", "Created Date"].join(","),
      ...filteredQuotes.map(q => [
        q.quote_id,
        q.customer_name,
        q.address,
        q.quote_amount,
        q.status || "pending",
        q.project_type || "General",
        new Date(q.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  const filteredQuotes = getFilteredQuotes();
  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue));
  const totalProjectRevenue = projectTypeRevenue.reduce((sum, type) => sum + type.revenue, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Revenue Analysis</h1>
            </div>
            <Button
              variant="outline"
              onClick={exportData}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
              <div className="flex items-center gap-2 mt-2">
                {stats.monthlyGrowth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${stats.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.monthlyGrowth).toFixed(1)}% monthly
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Quote Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.averageQuoteValue)}</div>
              <div className="text-sm text-gray-500 mt-2">
                per quote
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-500 mt-2">
                quotes accepted
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{formatCurrency(stats.pendingRevenue)}</div>
              <div className="text-sm text-gray-500 mt-2">
                awaiting decision
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Revenue by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <DollarSign className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-yellow-600">
                  {formatCurrency(stats.pendingRevenue)}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((stats.pendingRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <DollarSign className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(stats.acceptedRevenue)}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((stats.acceptedRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <DollarSign className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(stats.completedRevenue)}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((stats.completedRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs font-semibold mb-2">
                    {formatCurrency(data.revenue)}
                  </div>
                  <div 
                    className="w-full bg-green-600 rounded-t transition-all duration-300"
                    style={{ 
                      height: `${maxRevenue > 0 ? (data.revenue / maxRevenue) * 180 : 0}px`,
                      minHeight: data.revenue > 0 ? '20px' : '0'
                    }}
                  />
                  <div className="text-xs text-gray-600 mt-2 rotate-45 origin-left whitespace-nowrap">
                    {data.month}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Project Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Revenue by Project Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectTypeRevenue.map((type, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{type.type}</span>
                    <div className="text-right">
                      <span className="font-semibold">{formatCurrency(type.revenue)}</span>
                      <span className="text-sm text-gray-500 ml-2">({type.count} quotes)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-green-600 h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${(type.revenue / totalProjectRevenue) * 100}%` }}
                    >
                      <span className="text-xs text-white font-semibold">
                        {((type.revenue / totalProjectRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Quotes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Revenue Quotes</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Quote ID</th>
                    <th className="text-left py-2 px-4">Customer</th>
                    <th className="text-left py-2 px-4">Project Type</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.slice(0, 20).map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{quote.quote_id}</td>
                      <td className="py-2 px-4">{quote.customer_name}</td>
                      <td className="py-2 px-4">{quote.project_type || 'General'}</td>
                      <td className="py-2 px-4 font-semibold text-green-600">
                        {formatCurrency(quote.quote_amount)}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quote.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {quote.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-2 px-4">{formatDate(new Date(quote.created_at))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}