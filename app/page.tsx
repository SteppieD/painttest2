"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid company session
    const companyData = localStorage.getItem("paintquote_company");

    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        // Check if session is still valid (24 hours)
        if (Date.now() - company.loginTime < 24 * 60 * 60 * 1000) {
          router.push("/dashboard");
          return;
        } else {
          // Session expired, clear it
          localStorage.removeItem("paintquote_company");
        }
      } catch (e) {
        // Invalid session data, clear it
        localStorage.removeItem("paintquote_company");
      }
    }

    // No valid session, redirect to access code page
    router.push("/access-code");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading ProPaint Quote Assistant...</p>
      </div>
    </div>
  );
}