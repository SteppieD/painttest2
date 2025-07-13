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

      // Handle both direct array and wrapped response
      const quotesArray = Array.isArray(data) ? data : (data.quotes || []);
      if (quotesArray.length >= 0) {
        setQuotes(quotesArray);
        
        // Filter for this month
        const now = new Date();
        const thisMonthQuotes = quotesArray.filter((quote: Quote) => {
          const quoteDate = new Date(quote.created_at);
          return quoteDate.getMonth() === now.getMonth() && 
                 quoteDate.getFullYear() === now.getFullYear();
        });
        
        setMonthQuotes(thisMonthQuotes);
        calculateStats(thisMonthQuotes, quotesArray);
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
    const totalRevenue = monthQuotesData.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);
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
      dailyMap[dateKey].revenue += quote.quote_amount || 0;
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
        weekData[weekNumber].revenue += quote.quote_amount || 0;
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
        dailyMap[dateKey].revenue += quote.quote_amount || 0;
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
      typeMap[type].revenue += quote.quote_amount || 0;
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
        q.quote_amount || 0,
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
      <div>
        <div>
          <div></div>
          <p>Loading this month's data...</p>
        </div>
      </div>
    );
  }

  const filteredQuotes = getFilteredQuotes();
  const maxDailyRevenue = Math.max(...dailyData.map(d => d.revenue));
  const currentDate = new Date();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
             
            >
              <ArrowLeft />
              Back to Dashboard
            </Button>
            <div>
              <h1>{monthName} Performance</h1>
            </div>
            <Button
              variant="outline"
              onClick={exportData}
             
            >
              <Download />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div>
        {/* Overview Stats */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{stats.totalQuotes}</div>
              <div>
                {(stats.totalQuotes / currentDate.getDate()).toFixed(1)} per day
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Month Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.totalRevenue)}</div>
              <div>
                {formatCurrency(stats.averageQuote)} avg
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Daily Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.dailyAverage)}</div>
              <div>
                revenue per day
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Projected Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.projectedMonthTotal)}</div>
              <div>
                end of month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <AlertCircle />
                <div>{stats.pendingQuotes}</div>
                <div>Pending</div>
                <div>
                  {stats.totalQuotes > 0 ? ((stats.pendingQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div>
                <CheckCircle />
                <div>{stats.acceptedQuotes}</div>
                <div>Accepted</div>
                <div>
                  {stats.totalQuotes > 0 ? ((stats.acceptedQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div>
                <CheckCircle />
                <div>{stats.completedQuotes}</div>
                <div>Completed</div>
                <div>
                  {stats.totalQuotes > 0 ? ((stats.completedQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div>
                <XCircle />
                <div>{stats.cancelledQuotes}</div>
                <div>Cancelled</div>
                <div>
                  {stats.totalQuotes > 0 ? ((stats.cancelledQuotes / stats.totalQuotes) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {dailyData.map((data, index) => (
                <div key={index}>
                  {data.revenue > 0 && (
                    <div>
                      {formatCurrency(data.revenue)}
                    </div>
                  )}
                  <div 
                    style={{
                      height: `${(data.revenue / maxDailyRevenue) * 150}px`,
                      minHeight: data.revenue > 0 ? '20px' : '0'
                    }}
                  />
                  <div>
                    {data.date.split(' ')[1]}
                  </div>
                  {data.quotes > 0 && (
                    <div>
                      ({data.quotes})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Week Comparison */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {stats.weekComparison.map((week) => (
                  <div key={week.week}>
                    <div>
                      <Calendar />
                      <span>Week {week.week}</span>
                    </div>
                    <div>
                      <div>{formatCurrency(week.revenue)}</div>
                      <div>{week.quotes} quotes</div>
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
              <div>
                {projectTypeBreakdown.slice(0, 5).map((type, index) => (
                  <div key={index}>
                    <span>{type.type}</span>
                    <div>
                      <span>{formatCurrency(type.revenue)}</span>
                      <span>({type.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Day Highlight */}
        {stats.bestDay.revenue > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <TrendingUp />
                Best Day This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <p>{stats.bestDay.date}</p>
                  <p>{stats.bestDay.count} quotes generated</p>
                </div>
                <div>
                  {formatCurrency(stats.bestDay.revenue)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quote List */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span>This Month's Quotes ({filteredQuotes.length})</span>
              <div>
                <div>
                  <Search />
                  <Input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                 
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
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Quote ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id}>
                      <td>
                        {new Date(quote.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td>{quote.quote_id}</td>
                      <td>{quote.customer_name}</td>
                      <td>{formatCurrency(quote.quote_amount)}</td>
                      <td>
                        <span>
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