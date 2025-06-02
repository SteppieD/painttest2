"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quoteInfo, setQuoteInfo] = useState<{
    quoteId?: string;
    amount?: string;
    company?: string;
    newCompany?: string;
    companyName?: string;
  }>({});

  useEffect(() => {
    const quoteId = searchParams.get("quoteId");
    const amount = searchParams.get("amount");
    const company = searchParams.get("company");
    const newCompany = searchParams.get("newCompany");
    const companyName = searchParams.get("companyName");

    setQuoteInfo({ quoteId, amount, company, newCompany, companyName });
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        {quoteInfo.newCompany === "true" ? (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎉</div>
            <h1
              style={{ color: "#333", margin: "0 0 20px 0", fontSize: "24px" }}
            >
              Welcome!
            </h1>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              New company &quot;{quoteInfo.companyName}&quot; has been created
              successfully!
            </p>
            <p
              style={{ color: "#666", marginBottom: "30px", fontSize: "14px" }}
            >
              You can now start creating quotes for your company.
            </p>
          </>
        ) : quoteInfo.quoteId ? (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
            <h1
              style={{ color: "#333", margin: "0 0 20px 0", fontSize: "24px" }}
            >
              Quote Saved!
            </h1>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Quote ID:</strong> #{quoteInfo.quoteId}
              </p>
              <p style={{ margin: "5px 0", fontSize: "14px" }}>
                <strong>Amount:</strong> ${quoteInfo.amount}
              </p>
              {quoteInfo.company && (
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <strong>Company:</strong>{" "}
                  {decodeURIComponent(quoteInfo.company)}
                </p>
              )}
            </div>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Your quote has been saved successfully!
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>😊</div>
            <h1
              style={{ color: "#333", margin: "0 0 20px 0", fontSize: "24px" }}
            >
              Success!
            </h1>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Access code verified! You&apos;re logged in successfully.
            </p>
          </>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            📊 View Dashboard
          </button>

          <button
            onClick={() => router.push("/create-quote")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            + New Quote
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            🏠 Home
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#999", marginTop: "20px" }}>
          Company workspace active ✓
        </p>
      </div>
    </div>
  );
}
