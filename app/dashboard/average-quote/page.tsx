"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown,
  ArrowLeft, 
  Calendar,
  Search,
  Download,
  BarChart3,
  Activity,
  Target,
  Zap
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

interface AverageStats {
  overallAverage: number;
  pendingAverage: number;
  acceptedAverage: number;
  completedAverage: number;
  medianQuote: number;
  standardDeviation: number;
  monthlyTrend: number;
  quarterlyTrend: number;
  topPercentileThreshold: number;
  bottomPercentileThreshold: number;
}

interface RangeDistribution {
  range: string;
  count: number;
  percentage: number;
  avgAmount: number;
}

export default function AverageQuotePage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<AverageStats>({
    overallAverage: 0,
    pendingAverage: 0,
    acceptedAverage: 0,
    completedAverage: 0,
    medianQuote: 0,
    standardDeviation: 0,
    monthlyTrend: 0,
    quarterlyTrend: 0,
    topPercentileThreshold: 0,
    bottomPercentileThreshold: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyAverages, setMonthlyAverages] = useState<{month: string; average: number; count: number}[]>([]);
  const [rangeDistribution, setRangeDistribution] = useState<RangeDistribution[]>([]);
  const [projectTypeAverages, setProjectTypeAverages] = useState<{type: string; average: number; count: number}[]>([]);

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
        calculateMonthlyAverages(data);
        calculateRangeDistribution(data);
        calculateProjectTypeAverages(data);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (quotesData: Quote[]) => {
    if (quotesData.length === 0) return;

    const amounts = quotesData.map(q => q.quote_amount).filter(a => a > 0);
    const overallAverage = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;

    // Calculate averages by status
    const pendingQuotes = quotesData.filter(q => !q.status || q.status === "pending");
    const acceptedQuotes = quotesData.filter(q => q.status === "accepted");
    const completedQuotes = quotesData.filter(q => q.status === "completed");

    const pendingAverage = pendingQuotes.length > 0
      ? pendingQuotes.reduce((sum, q) => sum + q.quote_amount, 0) / pendingQuotes.length
      : 0;

    const acceptedAverage = acceptedQuotes.length > 0
      ? acceptedQuotes.reduce((sum, q) => sum + q.quote_amount, 0) / acceptedQuotes.length
      : 0;

    const completedAverage = completedQuotes.length > 0
      ? completedQuotes.reduce((sum, q) => sum + q.quote_amount, 0) / completedQuotes.length
      : 0;

    // Calculate median
    const sortedAmounts = [...amounts].sort((a, b) => a - b);
    const medianQuote = sortedAmounts.length > 0
      ? sortedAmounts.length % 2 === 0
        ? (sortedAmounts[sortedAmounts.length / 2 - 1] + sortedAmounts[sortedAmounts.length / 2]) / 2
        : sortedAmounts[Math.floor(sortedAmounts.length / 2)]
      : 0;

    // Calculate standard deviation
    const mean = overallAverage;
    const squaredDifferences = amounts.map(amt => Math.pow(amt - mean, 2));
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);

    // Calculate monthly trend
    const now = new Date();
    const thisMonthQuotes = quotesData.filter(q => {
      const date = new Date(q.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const thisMonthAvg = thisMonthQuotes.length > 0
      ? thisMonthQuotes.reduce((sum, q) => sum + q.quote_amount, 0) / thisMonthQuotes.length
      : 0;

    const lastMonthQuotes = quotesData.filter(q => {
      const date = new Date(q.created_at);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    });
    const lastMonthAvg = lastMonthQuotes.length > 0
      ? lastMonthQuotes.reduce((sum, q) => sum + q.quote_amount, 0) / lastMonthQuotes.length
      : 0;

    const monthlyTrend = lastMonthAvg > 0 ? ((thisMonthAvg - lastMonthAvg) / lastMonthAvg) * 100 : 0;

    // Calculate quarterly trend
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const lastQuarterStart = new Date(quarterStart);
    lastQuarterStart.setMonth(lastQuarterStart.getMonth() - 3);

    const thisQuarterQuotes = quotesData.filter(q => {
      const date = new Date(q.created_at);
      return date >= quarterStart;
    });
    const thisQuarterAvg = thisQuarterQuotes.length > 0
      ? thisQuarterQuotes.reduce((sum, q) => sum + q.quote_amount, 0) / thisQuarterQuotes.length
      : 0;

    const lastQuarterQuotes = quotesData.filter(q => {
      const date = new Date(q.created_at);
      return date >= lastQuarterStart && date < quarterStart;
    });
    const lastQuarterAvg = lastQuarterQuotes.length > 0
      ? lastQuarterQuotes.reduce((sum, q) => sum + q.quote_amount, 0) / lastQuarterQuotes.length
      : 0;

    const quarterlyTrend = lastQuarterAvg > 0 ? ((thisQuarterAvg - lastQuarterAvg) / lastQuarterAvg) * 100 : 0;

    // Calculate percentiles
    const topPercentileIndex = Math.floor(sortedAmounts.length * 0.9);
    const bottomPercentileIndex = Math.floor(sortedAmounts.length * 0.1);
    const topPercentileThreshold = sortedAmounts[topPercentileIndex] || 0;
    const bottomPercentileThreshold = sortedAmounts[bottomPercentileIndex] || 0;

    setStats({
      overallAverage,
      pendingAverage,
      acceptedAverage,
      completedAverage,
      medianQuote,
      standardDeviation,
      monthlyTrend,
      quarterlyTrend,
      topPercentileThreshold,
      bottomPercentileThreshold,
    });
  };

  const calculateMonthlyAverages = (quotesData: Quote[]) => {
    const monthlyData: { [key: string]: { total: number; count: number } } = {};
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { total: 0, count: 0 };
    }

    quotesData.forEach(quote => {
      const date = new Date(quote.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey].total += quote.quote_amount;
        monthlyData[monthKey].count += 1;
      }
    });

    const data = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      average: data.count > 0 ? data.total / data.count : 0,
      count: data.count,
    }));

    setMonthlyAverages(data);
  };

  const calculateRangeDistribution = (quotesData: Quote[]) => {
    const ranges = [
      { min: 0, max: 1000, label: "$0 - $1K" },
      { min: 1000, max: 2500, label: "$1K - $2.5K" },
      { min: 2500, max: 5000, label: "$2.5K - $5K" },
      { min: 5000, max: 10000, label: "$5K - $10K" },
      { min: 10000, max: 25000, label: "$10K - $25K" },
      { min: 25000, max: Infinity, label: "$25K+" },
    ];

    const distribution = ranges.map(range => {
      const quotesInRange = quotesData.filter(q => 
        q.quote_amount >= range.min && q.quote_amount < range.max
      );
      const count = quotesInRange.length;
      const total = quotesInRange.reduce((sum, q) => sum + q.quote_amount, 0);
      
      return {
        range: range.label,
        count,
        percentage: quotesData.length > 0 ? (count / quotesData.length) * 100 : 0,
        avgAmount: count > 0 ? total / count : 0,
      };
    });

    setRangeDistribution(distribution);
  };

  const calculateProjectTypeAverages = (quotesData: Quote[]) => {
    const typeData: { [key: string]: { total: number; count: number } } = {};

    quotesData.forEach(quote => {
      const type = quote.project_type || 'General';
      if (!typeData[type]) {
        typeData[type] = { total: 0, count: 0 };
      }
      typeData[type].total += quote.quote_amount;
      typeData[type].count += 1;
    });

    const data = Object.entries(typeData)
      .map(([type, data]) => ({
        type,
        average: data.count > 0 ? data.total / data.count : 0,
        count: data.count,
      }))
      .sort((a, b) => b.average - a.average);

    setProjectTypeAverages(data);
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
    const csv = [
      ["Metric", "Value"],
      ["Overall Average", formatCurrency(stats.overallAverage)],
      ["Median Quote", formatCurrency(stats.medianQuote)],
      ["Standard Deviation", formatCurrency(stats.standardDeviation)],
      ["Pending Average", formatCurrency(stats.pendingAverage)],
      ["Accepted Average", formatCurrency(stats.acceptedAverage)],
      ["Completed Average", formatCurrency(stats.completedAverage)],
      ["Monthly Trend", `${stats.monthlyTrend.toFixed(1)}%`],
      ["Quarterly Trend", `${stats.quarterlyTrend.toFixed(1)}%`],
      ["90th Percentile", formatCurrency(stats.topPercentileThreshold)],
      ["10th Percentile", formatCurrency(stats.bottomPercentileThreshold)],
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `average-quote-analysis-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading average quote analytics...</p>
        </div>
      </div>
    );
  }

  const maxAverage = Math.max(...monthlyAverages.map(d => d.average));

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
              <h1 className="text-xl font-bold text-gray-900">Average Quote Analysis</h1>
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
                Average Quote Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(stats.overallAverage)}</div>
              <div className="flex items-center gap-2 mt-2">
                {stats.monthlyTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${stats.monthlyTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.monthlyTrend).toFixed(1)}% monthly
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Median Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.medianQuote)}</div>
              <div className="text-sm text-gray-500 mt-2">
                50th percentile
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Standard Deviation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(stats.standardDeviation)}</div>
              <div className="text-sm text-gray-500 mt-2">
                quote variance
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Top 10% Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.topPercentileThreshold)}</div>
              <div className="text-sm text-gray-500 mt-2">
                90th percentile
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Average by Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Average Quote by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Activity className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-yellow-600">
                  {formatCurrency(stats.pendingAverage)}
                </div>
                <div className="text-sm text-gray-600">Pending Average</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((stats.pendingAverage / stats.overallAverage - 1) * 100).toFixed(1)}% vs overall
                </div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Target className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(stats.acceptedAverage)}
                </div>
                <div className="text-sm text-gray-600">Accepted Average</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((stats.acceptedAverage / stats.overallAverage - 1) * 100).toFixed(1)}% vs overall
                </div>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Zap className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(stats.completedAverage)}
                </div>
                <div className="text-sm text-gray-600">Completed Average</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((stats.completedAverage / stats.overallAverage - 1) * 100).toFixed(1)}% vs overall
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Average Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Average Quote Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2">
              {monthlyAverages.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs font-semibold mb-2">
                    {formatCurrency(data.average)}
                  </div>
                  <div 
                    className="w-full bg-blue-600 rounded-t transition-all duration-300"
                    style={{ 
                      height: `${maxAverage > 0 ? (data.average / maxAverage) * 180 : 0}px`,
                      minHeight: data.average > 0 ? '20px' : '0'
                    }}
                  />
                  <div className="text-xs text-gray-600 mt-2 rotate-45 origin-left whitespace-nowrap">
                    {data.month}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({data.count})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quote Value Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quote Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rangeDistribution.map((range, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{range.range}</span>
                    <div className="text-right">
                      <span className="font-semibold">{range.count} quotes</span>
                      <span className="text-sm text-gray-500 ml-2">(avg: {formatCurrency(range.avgAmount)})</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-blue-600 h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                      style={{ width: `${range.percentage}%` }}
                    >
                      {range.percentage > 5 && (
                        <span className="text-xs text-white font-semibold">
                          {range.percentage.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average by Project Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Average Quote by Project Type</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Project Type</th>
                    <th className="text-left py-2 px-4">Average Quote</th>
                    <th className="text-left py-2 px-4">Number of Quotes</th>
                    <th className="text-left py-2 px-4">Variance from Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTypeAverages.map((type, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{type.type}</td>
                      <td className="py-2 px-4 font-semibold text-blue-600">
                        {formatCurrency(type.average)}
                      </td>
                      <td className="py-2 px-4">{type.count}</td>
                      <td className="py-2 px-4">
                        <span className={`font-medium ${
                          type.average > stats.overallAverage ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {type.average > stats.overallAverage ? '+' : ''}
                          {((type.average / stats.overallAverage - 1) * 100).toFixed(1)}%
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