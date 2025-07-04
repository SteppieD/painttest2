"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { trackAccessCodeUsed, trackPageView } from "@/lib/analytics/tracking";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, Lock, Zap } from "lucide-react";
import { Footer } from "@/components/shared/footer";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function AccessCodePage() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableCodes, setAvailableCodes] = useState<any[]>([]);
  const [showDemoCodes, setShowDemoCodes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    trackPageView('/access-code');
  }, []);

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
        // Track access code usage
        trackAccessCodeUsed(accessCode.trim());
        
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
          // Check if user wants modern interface
          const modernInterface = new URLSearchParams(window.location.search).get('modern');
          if (modernInterface === 'true') {
            router.push('/dashboard-modern');
          } else {
            router.push(redirectTo);
          }
        }
      } else {
        setError(data.message || "Invalid access code. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoCodes = async () => {
    setShowDemoCodes(true);
    try {
      // Using the correct endpoint
      const response = await fetch("/api/admin/access-codes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Filter for active demo codes only
        const demoCodes = data.accessCodes?.filter((code: any) => 
          code.status === 'active' && 
          (code.code.startsWith('DEMO') || code.companyName?.includes('Demo'))
        ) || [];
        setAvailableCodes(demoCodes);
      }
    } catch (error) {
      console.error("Failed to load demo codes:", error);
    }
  };

  const useDemoCode = (code: string) => {
    setAccessCode(code);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="ac-hero py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="ac-hero-badge mb-6">
            <Lock size={16} />
            <span>Secure Access Portal</span>
          </div>
          
          <h1 className="ac-hero-title mb-6">
            Welcome Back to <span style={{ color: 'var(--primary-pink)' }}>ProPaint Quote</span>
          </h1>
          
          <p className="ac-hero-subtitle">
            Enter your company access code to continue creating professional painting quotes
          </p>
        </div>
      </section>

      {/* Access Code Form */}
      <section className="py-12 px-4 -mt-20 relative z-10">
        <div className="container mx-auto max-w-md">
          <div className="ac-card">
            <div className="ac-card-body p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="ac-form-group">
                  <label htmlFor="accessCode" className="ac-label">
                    Company Access Code
                  </label>
                  <input
                    type="text"
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="Enter your access code"
                    className={`ac-input ${error ? 'ac-input-error' : ''}`}
                    disabled={isLoading}
                    autoFocus
                  />
                  {error && (
                    <p className="ac-form-error">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !accessCode.trim()}
                  className={`ac-btn ac-btn-primary ac-btn-lg w-full ${isLoading ? 'ac-btn-loading' : ''}`}
                >
                  {isLoading ? '' : (
                    <>
                      Access Dashboard
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Don't have an access code?
                </p>
                <Link 
                  href="/trial-signup" 
                  className="text-primary-pink hover:text-primary-pink-dark font-medium transition-colors"
                >
                  Start your free trial →
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={loadDemoCodes}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showDemoCodes ? "Hide demo codes" : "Try with demo code"}
                </button>

                {showDemoCodes && (
                  <div className="mt-4 space-y-2">
                    {availableCodes.length > 0 ? (
                      availableCodes.map((code) => (
                        <button
                          key={code.id}
                          onClick={() => useDemoCode(code.code)}
                          className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors ac-fade-in"
                        >
                          <div className="font-mono font-semibold text-primary-pink">
                            {code.code}
                          </div>
                          <div className="text-xs text-gray-600">
                            {code.companyName}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-2">
                        Loading demo codes...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center ac-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-3">
                <Zap className="w-6 h-6 text-primary-pink" />
              </div>
              <p className="text-sm text-gray-600">30-second quotes</p>
            </div>
            <div className="text-center ac-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-3">
                <Users className="w-6 h-6 text-primary-pink" />
              </div>
              <p className="text-sm text-gray-600">5,000+ contractors</p>
            </div>
            <div className="text-center ac-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-3">
                <Sparkles className="w-6 h-6 text-primary-pink" />
              </div>
              <p className="text-sm text-gray-600">99% accuracy</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}