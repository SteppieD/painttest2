"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, BarChart3, DollarSign, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Quote {
  id: number;
  customer_name: string;
  quote_amount: number;
  final_price?: number;
  status?: string;
  created_at: string;
  project_type?: string;
}

export default function AverageAnalyticsPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState({
    averageQuote: 0,
    averageAccepted: 0,
    averagePending: 0,
    highest: 0,
    lowest: 0,
    median: 0,
    interiorAvg: 0,
    exteriorAvg: 0
  });

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (!companyData) {
      router.push("/access-code");
      return;
    }

    const company = JSON.parse(companyData);
    
    fetch(`/api/quotes?company_id=${company.id}`)
      .then(res => res.json())
      .then(data => {
        const quotesData = data.quotes || [];
        setQuotes(quotesData);
        
        if (quotesData.length === 0) return;
        
        // Calculate averages
        const amounts = quotesData.map((q: Quote) => q.final_price || q.quote_amount || 0);
        const total = amounts.reduce((sum: number, amt: number) => sum + amt, 0);
        const averageQuote = total / quotesData.length;
        
        // Accepted average
        const acceptedQuotes = quotesData.filter((q: Quote) => q.status === 'accepted');
        const acceptedTotal = acceptedQuotes.reduce((sum: number, q: Quote) => 
          sum + (q.final_price || q.quote_amount || 0), 0
        );
        const averageAccepted = acceptedQuotes.length > 0 ? acceptedTotal / acceptedQuotes.length : 0;
        
        // Pending average
        const pendingQuotes = quotesData.filter((q: Quote) => !q.status || q.status === 'pending');
        const pendingTotal = pendingQuotes.reduce((sum: number, q: Quote) => 
          sum + (q.final_price || q.quote_amount || 0), 0
        );
        const averagePending = pendingQuotes.length > 0 ? pendingTotal / pendingQuotes.length : 0;
        
        // High/Low/Median
        const sortedAmounts = [...amounts].sort((a, b) => a - b);
        const highest = Math.max(...amounts);
        const lowest = Math.min(...amounts);
        const median = sortedAmounts[Math.floor(sortedAmounts.length / 2)];
        
        // Project type averages
        const interiorQuotes = quotesData.filter((q: Quote) => q.project_type === 'interior');
        const interiorTotal = interiorQuotes.reduce((sum: number, q: Quote) => 
          sum + (q.final_price || q.quote_amount || 0), 0
        );
        const interiorAvg = interiorQuotes.length > 0 ? interiorTotal / interiorQuotes.length : 0;
        
        const exteriorQuotes = quotesData.filter((q: Quote) => q.project_type === 'exterior');
        const exteriorTotal = exteriorQuotes.reduce((sum: number, q: Quote) => 
          sum + (q.final_price || q.quote_amount || 0), 0
        );
        const exteriorAvg = exteriorQuotes.length > 0 ? exteriorTotal / exteriorQuotes.length : 0;
        
        setStats({
          averageQuote,
          averageAccepted,
          averagePending,
          highest,
          lowest,
          median,
          interiorAvg,
          exteriorAvg
        });
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Average Quote Analytics</h1>
              <p className="text-gray-600">Pricing insights and trends</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Average Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold">{formatCurrency(stats.averageQuote)}</span>
            </div>
            <p className="text-gray-600 font-medium">Overall Average</p>
            <p className="text-sm text-gray-500">All quotes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold">{formatCurrency(stats.averageAccepted)}</span>
            </div>
            <p className="text-gray-600 font-medium">Accepted Average</p>
            <p className="text-sm text-green-600">Won projects</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold">{formatCurrency(stats.median)}</span>
            </div>
            <p className="text-gray-600 font-medium">Median Quote</p>
            <p className="text-sm text-gray-500">Middle value</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-orange-600" />
              <span className="text-xl font-bold">{formatCurrency(stats.highest)}</span>
            </div>
            <p className="text-gray-600 font-medium">Highest Quote</p>
            <p className="text-sm text-gray-500">Maximum value</p>
          </div>
        </div>

        {/* Price Range Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Price Range Analysis</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Highest Quote</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(stats.highest)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Average Quote</span>
                <span className="text-lg font-bold">{formatCurrency(stats.averageQuote)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Median Quote</span>
                <span className="text-lg font-bold">{formatCurrency(stats.median)}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Lowest Quote</span>
                <span className="text-lg font-bold text-orange-600">{formatCurrency(stats.lowest)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Project Type Averages</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Interior Projects</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(stats.interiorAvg)}</span>
                </div>
                <p className="text-sm text-gray-600">Average interior painting quote</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Exterior Projects</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(stats.exteriorAvg)}</span>
                </div>
                <p className="text-sm text-gray-600">Average exterior painting quote</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quote Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Under $1,000</p>
              <p className="text-2xl font-bold">
                {quotes.filter(q => (q.final_price || q.quote_amount || 0) < 1000).length}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">$1,000 - $5,000</p>
              <p className="text-2xl font-bold">
                {quotes.filter(q => {
                  const amt = q.final_price || q.quote_amount || 0;
                  return amt >= 1000 && amt < 5000;
                }).length}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">$5,000 - $10,000</p>
              <p className="text-2xl font-bold">
                {quotes.filter(q => {
                  const amt = q.final_price || q.quote_amount || 0;
                  return amt >= 5000 && amt < 10000;
                }).length}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Over $10,000</p>
              <p className="text-2xl font-bold">
                {quotes.filter(q => (q.final_price || q.quote_amount || 0) >= 10000).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}