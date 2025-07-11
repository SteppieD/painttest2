"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Quote {
  id: number;
  quote_id: string;
  customer_name: string;
  address: string;
  quote_amount: number;
  final_price?: number;
  status?: string;
  created_at: string;
  project_type?: string;
}

export default function QuotesAnalyticsPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    cancelled: 0,
    acceptanceRate: 0,
    totalValue: 0
  });

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (!companyData) {
      router.push("/access-code");
      return;
    }

    const company = JSON.parse(companyData);
    
    // Load quotes
    fetch(`/api/quotes?company_id=${company.id}`)
      .then(res => res.json())
      .then(data => {
        const quotesData = data.quotes || [];
        setQuotes(quotesData);
        
        // Calculate stats
        const total = quotesData.length;
        const accepted = quotesData.filter((q: Quote) => q.status === 'accepted').length;
        const pending = quotesData.filter((q: Quote) => !q.status || q.status === 'pending').length;
        const cancelled = quotesData.filter((q: Quote) => q.status === 'cancelled').length;
        const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
        const totalValue = quotesData.reduce((sum: number, q: Quote) => sum + (q.final_price || q.quote_amount || 0), 0);
        
        setStats({ total, accepted, pending, cancelled, acceptanceRate, totalValue });
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
              <h1>Quote Analytics</h1>
              <p>Detailed insights into your quotes</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Stats Overview */}
        <div>
          <div>
            <div>
              <FileText />
              <span>{stats.total}</span>
            </div>
            <p>Total Quotes</p>
            <p>All time</p>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>{stats.accepted}</span>
            </div>
            <p>Accepted</p>
            <p>{stats.acceptanceRate}% win rate</p>
          </div>

          <div>
            <div>
              <Clock />
              <span>{stats.pending}</span>
            </div>
            <p>Pending</p>
            <p>Awaiting response</p>
          </div>

          <div>
            <div>
              <TrendingUp />
              <span>{formatCurrency(stats.totalValue)}</span>
            </div>
            <p>Total Value</p>
            <p>All quotes</p>
          </div>
        </div>

        {/* Quotes by Status */}
        <div>
          <h2>Quotes by Status</h2>
          <div>
            <div>
              <div>
                <CheckCircle />
                <span>Accepted</span>
              </div>
              <span>{stats.accepted}</span>
            </div>
            <div>
              <div>
                <Clock />
                <span>Pending</span>
              </div>
              <span>{stats.pending}</span>
            </div>
            <div>
              <div>
                <XCircle />
                <span>Cancelled</span>
              </div>
              <span>{stats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Recent Quotes */}
        <div>
          <h2>Recent Quotes</h2>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {quotes.slice(0, 10).map((quote) => (
                  <tr key={quote.id}>
                    <td>
                      <div>
                        <p>{quote.customer_name}</p>
                        <p>{quote.address}</p>
                      </div>
                    </td>
                    <td>
                      {formatDate(new Date(quote.created_at))}
                    </td>
                    <td>
                      {formatCurrency(quote.final_price || quote.quote_amount || 0)}
                    </td>
                    <td>
                      <span`}>
                        {quote.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}