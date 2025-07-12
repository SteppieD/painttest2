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
    <div>
      <div>
        <div>
          <div>
            <button
              onClick={() => router.push("/dashboard")}
             
            >
              <ArrowLeft />
            </button>
            <div>
              <h1>Average Quote Analytics</h1>
              <p>Pricing insights and trends</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Average Overview */}
        <div>
          <div>
            <div>
              <TrendingUp />
              <span>{formatCurrency(stats.averageQuote)}</span>
            </div>
            <p>Overall Average</p>
            <p>All quotes</p>
          </div>

          <div>
            <div>
              <Target />
              <span>{formatCurrency(stats.averageAccepted)}</span>
            </div>
            <p>Accepted Average</p>
            <p>Won projects</p>
          </div>

          <div>
            <div>
              <BarChart3 />
              <span>{formatCurrency(stats.median)}</span>
            </div>
            <p>Median Quote</p>
            <p>Middle value</p>
          </div>

          <div>
            <div>
              <DollarSign />
              <span>{formatCurrency(stats.highest)}</span>
            </div>
            <p>Highest Quote</p>
            <p>Maximum value</p>
          </div>
        </div>

        {/* Price Range Analysis */}
        <div>
          <div>
            <h2>Price Range Analysis</h2>
            <div>
              <div>
                <span>Highest Quote</span>
                <span>{formatCurrency(stats.highest)}</span>
              </div>
              <div>
                <span>Average Quote</span>
                <span>{formatCurrency(stats.averageQuote)}</span>
              </div>
              <div>
                <span>Median Quote</span>
                <span>{formatCurrency(stats.median)}</span>
              </div>
              <div>
                <span>Lowest Quote</span>
                <span>{formatCurrency(stats.lowest)}</span>
              </div>
            </div>
          </div>

          <div>
            <h2>Project Type Averages</h2>
            <div>
              <div>
                <div>
                  <span>Interior Projects</span>
                  <span>{formatCurrency(stats.interiorAvg)}</span>
                </div>
                <p>Average interior painting quote</p>
              </div>
              <div>
                <div>
                  <span>Exterior Projects</span>
                  <span>{formatCurrency(stats.exteriorAvg)}</span>
                </div>
                <p>Average exterior painting quote</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Distribution */}
        <div>
          <h2>Quote Distribution</h2>
          <div>
            <div>
              <p>Under $1,000</p>
              <p>
                {quotes.filter(q => (q.final_price || q.quote_amount || 0) < 1000).length}
              </p>
            </div>
            <div>
              <p>$1,000 - $5,000</p>
              <p>
                {quotes.filter(q => {
                  const amt = q.final_price || q.quote_amount || 0;
                  return amt >= 1000 && amt < 5000;
                }).length}
              </p>
            </div>
            <div>
              <p>$5,000 - $10,000</p>
              <p>
                {quotes.filter(q => {
                  const amt = q.final_price || q.quote_amount || 0;
                  return amt >= 5000 && amt < 10000;
                }).length}
              </p>
            </div>
            <div>
              <p>Over $10,000</p>
              <p>
                {quotes.filter(q => (q.final_price || q.quote_amount || 0) >= 10000).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}