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

      if (data.quotes && Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
        calculateStats(data.quotes);
        calculateMonthlyAverages(data.quotes);
        calculateRangeDistribution(data.quotes);
        calculateProjectTypeAverages(data.quotes);
      } else if (Array.isArray(data)) {
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

    const amounts = quotesData.map(q => q.quote_amount || 0).filter(a => a > 0);
    if (amounts.length === 0) {
      // No valid amounts, set all stats to 0
      setStats({
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
      return;
    }
    
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
      <div>
        <div>
          <div></div>
          <p>Loading average quote analytics...</p>
        </div>
      </div>
    );
  }

  const maxAverage = Math.max(...monthlyAverages.map(d => d.average));

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
              <h1>Average Quote Analysis</h1>
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
                Average Quote Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.overallAverage)}</div>
              <div>
                {stats.monthlyTrend > 0 ? (
                  <TrendingUp />
                ) : (
                  <TrendingDown />
                )}
                <span`}>
                  {Math.abs(stats.monthlyTrend).toFixed(1)}% monthly
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Median Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.medianQuote)}</div>
              <div>
                50th percentile
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Standard Deviation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.standardDeviation)}</div>
              <div>
                quote variance
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Top 10% Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.topPercentileThreshold)}</div>
              <div>
                90th percentile
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Average by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Average Quote by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <Activity />
                <div>
                  {formatCurrency(stats.pendingAverage)}
                </div>
                <div>Pending Average</div>
                <div>
                  {((stats.pendingAverage / stats.overallAverage - 1) * 100).toFixed(1)}% vs overall
                </div>
              </div>
              <div>
                <Target />
                <div>
                  {formatCurrency(stats.acceptedAverage)}
                </div>
                <div>Accepted Average</div>
                <div>
                  {((stats.acceptedAverage / stats.overallAverage - 1) * 100).toFixed(1)}% vs overall
                </div>
              </div>
              <div>
                <Zap />
                <div>
                  {formatCurrency(stats.completedAverage)}
                </div>
                <div>Completed Average</div>
                <div>
                  {((stats.completedAverage / stats.overallAverage - 1) * 100).toFixed(1)}% vs overall
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Average Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Average Quote Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {monthlyAverages.map((data, index) => (
                <div key={index}>
                  <div>
                    {formatCurrency(data.average)}
                  </div>
                  <div 
                   
                   px`,
                      minHeight: data.average > 0 ? '20px' : '0'
                    }}
                  />
                  <div>
                    {data.month}
                  </div>
                  <div>
                    ({data.count})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quote Value Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {rangeDistribution.map((range, index) => (
                <div key={index}>
                  <div>
                    <span>{range.range}</span>
                    <div>
                      <span>{range.count} quotes</span>
                      <span>(avg: {formatCurrency(range.avgAmount)})</span>
                    </div>
                  </div>
                  <div>
                    <div 
                     
                     %` }}
                    >
                      {range.percentage > 5 && (
                        <span>
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
            <CardTitle>
              <span>Average Quote by Project Type</span>
              <div>
                <div>
                  <Search />
                  <Input
                    placeholder="Search types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Project Type</th>
                    <th>Average Quote</th>
                    <th>Number of Quotes</th>
                    <th>Variance from Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTypeAverages.map((type, index) => (
                    <tr key={index}>
                      <td>{type.type}</td>
                      <td>
                        {formatCurrency(type.average)}
                      </td>
                      <td>{type.count}</td>
                      <td>
                        <span`}>
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