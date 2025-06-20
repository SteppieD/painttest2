"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function AccessCodePage() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableCodes, setAvailableCodes] = useState<any[]>([]);
  const [showDemoCodes, setShowDemoCodes] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode: accessCode.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store company info in localStorage for session management
        localStorage.setItem(
          "paintquote_company",
          JSON.stringify({
            id: data.company.id,
            accessCode: data.company.accessCode,
            name: data.company.name,
            phone: data.company.phone,
            email: data.company.email,
            logoUrl: data.company.logoUrl,
            loginTime: Date.now(),
            isNewCompany: data.isNewCompany || false,
          }),
        );

        // Check setup completion status
        const preferencesResponse = await fetch(`/api/companies/preferences?companyId=${data.company.id}`);
        const preferencesData = await preferencesResponse.json();
        const setupCompleted = preferencesData.preferences?.setup_completed;

        // Check if user came from homepage sign-in link (has redirect parameter)
        const redirectParam = new URLSearchParams(window.location.search).get('redirect');
        const redirectTo = redirectParam || '/dashboard'; // Default to dashboard for normal access code entry
        
        // Redirect based on setup completion and new company status
        if (data.isNewCompany || !setupCompleted) {
          // New companies or companies that haven't completed setup go to setup wizard
          router.push(`/setup?code=${data.company.accessCode}`);
        } else if (data.isNewCompany) {
          router.push(
            `/success?newCompany=true&companyName=${encodeURIComponent(data.company.name)}&redirect=${encodeURIComponent(redirectTo)}`,
          );
        } else {
          router.push(redirectTo);
        }
      } else {
        if (data.error && data.error.includes("not found")) {
          setError("Access code not found. Please check your code or create a new trial account.");
        } else if (data.error && data.error.includes("expired")) {
          setError("This access code has expired. Please contact support or create a new trial account.");
        } else {
          setError("Invalid access code. Please check your spelling and try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Connection problem. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoCodes = async () => {
    try {
      const response = await fetch("/api/verify-code");
      const data = await response.json();
      setAvailableCodes(data.companies || []);
      setShowDemoCodes(true);
    } catch (error) {
      console.error("Error loading demo codes:", error);
    }
  };

  const selectDemoCode = (code: string) => {
    setAccessCode(code);
    setShowDemoCodes(false);
  };

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
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#333", margin: "0 0 10px 0", fontSize: "24px" }}>
            🎨 Painting Quote Pro
          </h1>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Enter your company access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Enter access code (e.g., DEMO2024)"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "bold",
              }}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                color: "#c33",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "20px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !accessCode.trim()}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isLoading ? "#ccc" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginBottom: "15px",
            }}
          >
            {isLoading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={loadDemoCodes}
            style={{
              background: "none",
              border: "none",
              color: "#3498db",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "12px",
              marginBottom: "10px",
              display: "block",
              width: "100%",
            }}
          >
            View Demo Access Codes
          </button>
          
          <a
            href="/forgot-code"
            style={{
              color: "#3498db",
              textDecoration: "underline",
              fontSize: "12px",
              display: "inline-block",
            }}
          >
            Forgot your access code?
          </a>
        </div>

        {showDemoCodes && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
            }}
          >
            <h4
              style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#333" }}
            >
              Available Demo Codes:
            </h4>
            {availableCodes.map((company, index) => (
              <div
                key={index}
                onClick={() => selectDemoCode(company.access_code)}
                style={{
                  padding: "8px",
                  margin: "5px 0",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                <strong>{company.access_code}</strong> - {company.company_name}
                {company.phone && (
                  <div style={{ color: "#666" }}>{company.phone}</div>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            fontSize: "11px",
            color: "#999",
            textAlign: "center",
          }}
        >
          <p>New access codes auto-create companies</p>
          <p>Format: LETTERS + NUMBERS (e.g., PAINT2025)</p>
        </div>
      </div>
    </div>
  );
}
