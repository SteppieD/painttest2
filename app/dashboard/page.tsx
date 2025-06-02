"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Quote {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  quote_amount: number;
  notes: string;
  status?: string;
  created_at: string;
  company_id: number;
  company_name?: string;
}

interface Analytics {
  totalQuotes: number;
  totalRevenue: number;
  averageQuote: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  thisMonthQuotes: number;
  thisMonthRevenue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalQuotes: 0,
    totalRevenue: 0,
    averageQuote: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    thisMonthQuotes: 0,
    thisMonthRevenue: 0,
  });
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Get company info from localStorage
  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        setCompanyInfo(company);
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
        calculateAnalytics(data);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (quotesData: Quote[]) => {
    const total = quotesData.length;
    const revenue = quotesData.reduce(
      (sum, quote) => sum + quote.quote_amount,
      0,
    );
    const average = total > 0 ? revenue / total : 0;

    const pending = quotesData.filter(
      (q) => !q.status || q.status === "pending",
    ).length;
    const accepted = quotesData.filter((q) => q.status === "accepted").length;

    // This month calculations
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthQuotes = quotesData.filter((quote) => {
      const quoteDate = new Date(quote.created_at);
      return quoteDate >= thisMonthStart;
    });

    setAnalytics({
      totalQuotes: total,
      totalRevenue: revenue,
      averageQuote: average,
      pendingQuotes: pending,
      acceptedQuotes: accepted,
      thisMonthQuotes: thisMonthQuotes.length,
      thisMonthRevenue: thisMonthQuotes.reduce(
        (sum, quote) => sum + quote.quote_amount,
        0,
      ),
    });
  };

  // Filter and sort quotes
  useEffect(() => {
    let filtered = quotes.filter((quote) => {
      const matchesSearch =
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quote_amount.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" &&
          (!quote.status || quote.status === "pending")) ||
        (statusFilter !== "pending" && quote.status === statusFilter);

      return matchesSearch && matchesStatus;
    });

    // Sort quotes
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Quote];
      let bValue: any = b[sortBy as keyof Quote];

      if (sortBy === "quote_amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, statusFilter, sortBy, sortOrder]);

  const updateQuoteStatus = async (quoteId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/quotes/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setQuotes((prev) =>
          prev.map((quote) =>
            quote.id === quoteId ? { ...quote, status: newStatus } : quote,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating quote status:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "accepted":
        return "#28a745";
      case "completed":
        return "#17a2b8";
      case "cancelled":
        return "#dc3545";
      default:
        return "#ffc107";
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p style={{ color: "#666" }}>Loading dashboard...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderBottom: "1px solid #ddd",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{ margin: "0 0 5px 0", fontSize: "24px", color: "#333" }}
            >
              📊 {companyInfo?.name || "Dashboard"}
            </h1>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              {companyInfo?.accessCode} • Manage your painting quotes
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => router.push("/create-quote")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + New Quote
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("paintquote_company");
                router.push("/access-code");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Analytics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}
            >
              Total Quotes
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {analytics.totalQuotes}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}
            >
              Total Revenue
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#28a745",
              }}
            >
              {formatCurrency(analytics.totalRevenue)}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}
            >
              Average Quote
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#3498db",
              }}
            >
              {formatCurrency(analytics.averageQuote)}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}
            >
              This Month
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {analytics.thisMonthQuotes} quotes
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              {formatCurrency(analytics.thisMonthRevenue)}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Search Quotes
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Customer name, address, or amount..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Sort By
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="quote_amount-desc">Highest Amount</option>
                <option value="quote_amount-asc">Lowest Amount</option>
                <option value="customer_name-asc">Customer A-Z</option>
                <option value="customer_name-desc">Customer Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quotes List */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px", color: "#333" }}>
              Recent Quotes ({filteredQuotes.length})
            </h2>
          </div>

          {filteredQuotes.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#666",
              }}
            >
              <p style={{ fontSize: "16px", margin: "0 0 10px 0" }}>
                {quotes.length === 0
                  ? "No quotes yet"
                  : "No quotes match your filters"}
              </p>
              <p style={{ fontSize: "14px", margin: 0 }}>
                {quotes.length === 0 && (
                  <button
                    onClick={() => router.push("/create-quote")}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Create your first quote
                  </button>
                )}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Customer
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Address
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "12px" }}>
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                            {quote.customer_name}
                          </div>
                          {quote.customer_phone && (
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              {quote.customer_phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px", fontSize: "14px" }}>
                        {quote.address}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        {formatCurrency(quote.quote_amount)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <select
                          value={quote.status || "pending"}
                          onChange={(e) =>
                            updateQuoteStatus(quote.id, e.target.value)
                          }
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                            backgroundColor: getStatusColor(quote.status),
                            color: "white",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          fontSize: "14px",
                        }}
                      >
                        {formatDate(quote.created_at)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() =>
                            alert(
                              `Quote ID: ${quote.id}\nNotes: ${quote.notes}`,
                            )
                          }
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#3498db",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
