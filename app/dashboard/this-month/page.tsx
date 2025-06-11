"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  Clock,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3
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

interface MonthStats {
  totalQuotes: number;
  totalRevenue: number;
  averageQuote: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  completedQuotes: number;
  cancelledQuotes: number;
  conversionRate: number;
  dailyAverage: number;
  projectedMonthTotal: number;
  bestDay: { date: string; count: number; revenue: number };
  weekComparison: { week: number; quotes: number; revenue: number }[];
}

interface DailyData {
  date: string;
  quotes: number;
  revenue: number;
}

export default function ThisMonthPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [monthQuotes, setMonthQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<MonthStats>({
    totalQuotes: 0,
    totalRevenue: 0,
    averageQuote: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    completedQuotes: 0,
    cancelledQuotes: 0,
    conversionRate: 0,
    dailyAverage: 0,
    projectedMonthTotal: 0,
    bestDay: { date: '', count: 0, revenue: 0 },
    weekComparison: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [projectTypeBreakdown, setProjectTypeBreakdown] = useState<{type: string; count: number; revenue: number}[]>([]);

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
        
        // Filter for this month
        const now = new Date();
        const thisMonthQuotes = data.filter((quote: Quote) => {
          const quoteDate = new Date(quote.created_at);
          return quoteDate.getMonth() === now.getMonth() && 
                 quoteDate.getFullYear() === now.getFullYear();
        });
        
        setMonthQuotes(thisMonthQuotes);
        calculateStats(thisMonthQuotes, data);
        calculateDailyData(thisMonthQuotes);
        calculateProjectTypeBreakdown(thisMonthQuotes);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (monthQuotesData: Quote[], allQuotes: Quote[]) => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    
    const totalQuotes = monthQuotesData.length;
    const totalRevenue = monthQuotesData.reduce((sum, quote) => sum + quote.quote_amount, 0);
    const averageQuote = totalQuotes > 0 ? totalRevenue / totalQuotes : 0;

    // Status breakdown
    const pendingQuotes = monthQuotesData.filter(q => !q.status || q.status === "pending").length;
    const acceptedQuotes = monthQuotesData.filter(q => q.status === "accepted").length;
    const completedQuotes = monthQuotesData.filter(q => q.status === "completed").length;
    const cancelledQuotes = monthQuotesData.filter(q => q.status === "cancelled").length;

    // Conversion rate
    const decidedQuotes = acceptedQuotes + completedQuotes + cancelledQuotes;
    const conversionRate = decidedQuotes > 0 
      ? ((acceptedQuotes + completedQuotes) / decidedQuotes) * 100 
      : 0;

    // Daily average and projection
    const dailyAverage = totalRevenue / daysPassed;
    const projectedMonthTotal = dailyAverage * daysInMonth;

    // Find best day
    const dailyMap: { [key: string]: { count: number; revenue: number } } = {};
    monthQuotesData.forEach(quote => {
      const dateKey = new Date(quote.created_at).toLocaleDateString();
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = { count: 0, revenue: 0 };
      }
      dailyMap[dateKey].count++;
      dailyMap[dateKey].revenue += quote.quote_amount;
    });

    let bestDay = { date: '', count: 0, revenue: 0 };
    Object.entries(dailyMap).forEach(([date, data]) => {
      if (data.revenue > bestDay.revenue) {
        bestDay = { date, count: data.count, revenue: data.revenue };
      }
    });

    // Week comparison
    const weekData: { [key: number]: { quotes: number; revenue: number } } = {
      1: { quotes: 0, revenue: 0 },
      2: { quotes: 0, revenue: 0 },
      3: { quotes: 0, revenue: 0 },
      4: { quotes: 0, revenue: 0 },
      5: { quotes: 0, revenue: 0 },
    };

    monthQuotesData.forEach(quote => {
      const date = new Date(quote.created_at);
      const weekNumber = Math.ceil(date.getDate() / 7);
      if (weekData[weekNumber]) {
        weekData[weekNumber].quotes++;
        weekData[weekNumber].revenue += quote.quote_amount;
      }
    });

    const weekComparison = Object.entries(weekData).map(([week, data]) => ({
      week: parseInt(week),
      quotes: data.quotes,
      revenue: data.revenue,
    }));

    setStats({
      totalQuotes,
      totalRevenue,
      averageQuote,
      pendingQuotes,
      acceptedQuotes,
      completedQuotes,
      cancelledQuotes,
      conversionRate,
      dailyAverage,
      projectedMonthTotal,
      bestDay,
      weekComparison,
    });
  };

  const calculateDailyData = (monthQuotesData: Quote[]) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Initialize all days
    const dailyMap: { [key: string]: { quotes: number; revenue: number } } = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[dateKey] = { quotes: 0, revenue: 0 };
    }

    // Populate with actual data
    monthQuotesData.forEach(quote => {
      const date = new Date(quote.created_at);
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyMap[dateKey]) {
        dailyMap[dateKey].quotes++;
        dailyMap[dateKey].revenue += quote.quote_amount;
      }
    });

    const data = Object.entries(dailyMap).map(([date, data]) => ({
      date,
      quotes: data.quotes,
      revenue: data.revenue,
    }));

    setDailyData(data);
  };

  const calculateProjectTypeBreakdown = (monthQuotesData: Quote[]) => {
    const typeMap: { [key: string]: { count: number; revenue: number } } = {};

    monthQuotesData.forEach(quote => {
      const type = quote.project_type || 'General';
      if (!typeMap[type]) {
        typeMap[type] = { count: 0, revenue: 0 };
      }
      typeMap[type].count++;
      typeMap[type].revenue += quote.quote_amount;
    });

    const data = Object.entries(typeMap)
      .map(([type, data]) => ({
        type,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    setProjectTypeBreakdown(data);
  };

  const getFilteredQuotes = () => {
    let filtered = monthQuotes;

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

    // Sort by date descending
    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  const exportData = () => {
    const filteredQuotes = getFilteredQuotes();
    const csv = [
      ["This Month Summary"],
      ["Total Quotes", stats.totalQuotes],
      ["Total Revenue", formatCurrency(stats.totalRevenue)],
      ["Average Quote", formatCurrency(stats.averageQuote)],
      ["Daily Average", formatCurrency(stats.dailyAverage)],
      ["Projected Month Total", formatCurrency(stats.projectedMonthTotal)],
      [""],
      ["Quote Details"],
      ["Quote ID", "Customer", "Address", "Amount", "Status", "Date"].join(","),
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
    a.download = `this-month-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading this month's data...</p>
        </div>
      </div>
    );
  }

  const filteredQuotes = getFilteredQuotes();
  const maxDailyRevenue = Math.max(...dailyData.map(d => d.revenue));
  const currentDate = new Date();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
              <h1 className="text-xl font-bold text-gray-900">{monthName} Performance</h1>
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
              <div className="text-3xl font-bold">{stats.totalQuotes}</div>
              <div className="text-sm text-gray-500 mt-2">
                {(stats.totalQuotes / currentDate.getDate()).toFixed(1)} per day
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Month Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-gray-500 mt-2">
                {formatCurrency(stats.averageQuote)} avg
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Daily Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(stats.dailyAverage)}</div>
              <div className="text-sm text-gray-500 mt-2">
                revenue per day
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projected Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{formatCurrency(stats.projectedMonthTotal)}</div>
              <div className="text-sm text-gray-500 mt-2">
                end of month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quote Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingQuotes}</div>
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalQuotes > 0 ? ((stats.pendingQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{stats.acceptedQuotes}</div>
                <div className="text-sm text-gray-600">Accepted</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalQuotes > 0 ? ((stats.acceptedQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{stats.completedQuotes}</div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalQuotes > 0 ? ((stats.completedQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{stats.cancelledQuotes}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalQuotes > 0 ? ((stats.cancelledQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Revenue Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daily Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-1 overflow-x-auto">
              {dailyData.map((data, index) => (
                <div key={index} className="flex-1 min-w-[30px] flex flex-col items-center">
                  {data.revenue > 0 && (
                    <div className="text-xs font-semibold mb-1">
                      {formatCurrency(data.revenue)}
                    </div>
                  )}
                  <div 
                    className="w-full bg-purple-600 rounded-t transition-all duration-300"
                    style={{ 
                      height: `${maxDailyRevenue > 0 ? (data.revenue / maxDailyRevenue) * 180 : 0}px`,
                      minHeight: data.revenue > 0 ? '20px' : '0'
                    }}
                  />
                  <div className="text-xs text-gray-600 mt-1 whitespace-nowrap">
                    {data.date.split(' ')[1]}
                  </div>
                  {data.quotes > 0 && (
                    <div className="text-xs text-gray-500">
                      ({data.quotes})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Week Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.weekComparison.map((week) => (
                  <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Week {week.week}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(week.revenue)}</div>
                      <div className="text-sm text-gray-500">{week.quotes} quotes</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projectTypeBreakdown.slice(0, 5).map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{type.type}</span>
                    <div className="text-right">
                      <span className="font-semibold">{formatCurrency(type.revenue)}</span>
                      <span className="text-sm text-gray-500 ml-2">({type.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Day Highlight */}
        {stats.bestDay.revenue > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Best Day This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{stats.bestDay.date}</p>
                  <p className="text-sm text-gray-600">{stats.bestDay.count} quotes generated</p>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {formatCurrency(stats.bestDay.revenue)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quote List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>This Month's Quotes ({filteredQuotes.length})</span>
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
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Quote ID</th>
                    <th className="text-left py-2 px-4">Customer</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        {new Date(quote.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
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