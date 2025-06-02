"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const getCompanyInfo = () => {
  if (typeof window !== "undefined") {
    const companyData = localStorage.getItem("paintquote_company");
    if (companyData) {
      try {
        return JSON.parse(companyData);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export default function CreateQuotePage() {
  const router = useRouter();
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    address: "",
    baseCost: 0,
    markupPercentage: 20,
    workType: "",
    roomDetails: "",
    roomCount: 0,
    totalSqft: 0,
    paintQuality: "",
  });

  useEffect(() => {
    const company = getCompanyInfo();
    if (company) {
      setCompanyInfo(company);
    } else {
      router.push("/access-code");
    }
  }, [router]);

  const saveQuote = async () => {
    if (!formData.customerName || !formData.baseCost || !companyInfo) {
      alert("Quote not complete yet!");
      return;
    }

    setIsSaving(true);

    try {
      const finalPrice =
        formData.baseCost * (1 + (formData.markupPercentage || 20) / 100);

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: formData.customerName,
          customer_email: "",
          customer_phone: "",
          address: formData.address,
          quote_amount: finalPrice,
          notes: `${formData.workType} - ${formData.roomDetails} - ${formData.roomCount} rooms, ${formData.totalSqft} sq ft, ${formData.paintQuality} paint quality`,
          company_id: companyInfo.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(
          `/success?quoteId=${result.id}&amount=${finalPrice.toFixed(2)}&company=${encodeURIComponent(companyInfo.name)}`,
        );
      } else {
        alert(`Error saving quote: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving quote:", error);
      alert("Failed to save quote. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#333",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          🎨 {companyInfo ? companyInfo.name : "Create New Quote"}
        </h1>
      </div>

      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <h2>Quick Quote Form</h2>

          <div style={{ marginBottom: "15px" }}>
            <label>Customer Name:</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Address:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Base Cost ($):</label>
            <input
              type="number"
              value={formData.baseCost}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  baseCost: Number(e.target.value),
                }))
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Markup (%):</label>
            <input
              type="number"
              value={formData.markupPercentage}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  markupPercentage: Number(e.target.value),
                }))
              }
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </div>

          {formData.baseCost > 0 && (
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              <h3>Quote Summary</h3>
              <p>Base Cost: ${formData.baseCost.toFixed(2)}</p>
              <p>Markup: {formData.markupPercentage}%</p>
              <p>
                <strong>
                  Final Price: $
                  {(
                    formData.baseCost *
                    (1 + formData.markupPercentage / 100)
                  ).toFixed(2)}
                </strong>
              </p>
            </div>
          )}

          <button
            onClick={saveQuote}
            disabled={isSaving || !formData.customerName || !formData.baseCost}
            style={{
              padding: "12px 24px",
              backgroundColor: isSaving ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {isSaving ? "Saving..." : "Save Quote"}
          </button>
        </div>
      </div>
    </div>
  );
}
