"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
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

interface QuoteStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  cancelled: number;
  monthlyGrowth: number;
  acceptanceRate: number;
  averageTime: number;
}

export default function TotalQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<QuoteStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
    monthlyGrowth: 0,
    acceptanceRate: 0,
    averageTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyData, setMonthlyData] = useState<{month: string; count: number}[]>([]);

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
        calculateMonthlyData(data);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (quotesData: Quote[]) => {
    const total = quotesData.length;
    const pending = quotesData.filter(q => !q.status || q.status === "pending").length;
    const accepted = quotesData.filter(q => q.status === "accepted").length;
    const completed = quotesData.filter(q => q.status === "completed").length;
    const cancelled = quotesData.filter(q => q.status === "cancelled").length;

    // Calculate monthly growth
    const now = new Date();
    const thisMonth = quotesData.filter(q => {
      const date = new Date(q.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const lastMonth = quotesData.filter(q => {
      const date = new Date(q.created_at);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return date.getMonth() === lastMonthDate.getMonth() && 
             date.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    const monthlyGrowth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    // Calculate acceptance rate
    const decidedQuotes = accepted + completed + cancelled;
    const acceptanceRate = decidedQuotes > 0 ? ((accepted + completed) / decidedQuotes) * 100 : 0;

    // Calculate average time to decision (in days)
    const quotesWithDecision = quotesData.filter(q => q.status && q.status !== "pending");
    const averageTime = quotesWithDecision.length > 0 
      ? quotesWithDecision.reduce((sum, quote) => {
          const created = new Date(quote.created_at);
          const now = new Date();
          return sum + Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / quotesWithDecision.length
      : 0;

    setStats({
      total,
      pending,
      accepted,
      completed,
      cancelled,
      monthlyGrowth,
      acceptanceRate,
      averageTime: Math.round(averageTime),
    });
  };

  const calculateMonthlyData = (quotesData: Quote[]) => {
    const monthCounts: { [key: string]: number } = {};
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[monthKey] = 0;
    }

    quotesData.forEach(quote => {
      const date = new Date(quote.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthCounts.hasOwnProperty(monthKey)) {
        monthCounts[monthKey]++;
      }
    });

    const data = Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));

    setMonthlyData(data);
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

    return filtered;
  };

  const exportData = () => {
    const filteredQuotes = getFilteredQuotes();
    const csv = [
      ["Quote ID", "Customer", "Address", "Amount", "Status", "Created Date"].join(","),
      ...filteredQuotes.map(q => [
        q.quote_id,
        q.customer_name,
        q.address,
        q.quote_amount,
        q.status || "pending",
        new Date(q.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quotes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote analytics...</p>
        </div>
      </div>
    );
  }

  const filteredQuotes = getFilteredQuotes();
  const maxCount = Math.max(...monthlyData.map(d => d.count));

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
              <h1 className="text-xl font-bold text-gray-900">Total Quotes Analysis</h1>
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
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="flex items-center gap-2 mt-2">
                {stats.monthlyGrowth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${stats.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.monthlyGrowth).toFixed(1)}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Acceptance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.acceptanceRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-500 mt-2">
                {stats.accepted + stats.completed} accepted of {stats.accepted + stats.completed + stats.cancelled} decided
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500 mt-2">
                {((stats.pending / stats.total) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg. Decision Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.averageTime}</div>
              <div className="text-sm text-gray-500 mt-2">days</div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quote Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Quote Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-sm font-semibold mb-2">{data.count}</div>
                  <div 
                    className="w-full bg-blue-600 rounded-t transition-all duration-300"
                    style={{ 
                      height: `${maxCount > 0 ? (data.count / maxCount) * 200 : 0}px`,
                      minHeight: data.count > 0 ? '20px' : '0'
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

        {/* Filters and Quote List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quote Details ({filteredQuotes.length})</span>
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
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{quote.quote_id}</td>
                      <td className="py-2 px-4">{quote.customer_name}</td>
                      <td className="py-2 px-4 font-semibold">{formatCurrency(quote.quote_amount)}</td>
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