"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Lock, AlertCircle } from "lucide-react";
import { trackAccessCodeUsed, trackPageView } from "@/lib/analytics/tracking";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function AccessCodePage() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    trackPageView('/access-code', 'Login');
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
            company_name: data.company.name,
            access_code: data.company.accessCode,
          })
        );

        // Check if user needs onboarding
        if (data.company.needsOnboarding) {
          router.push("/setup");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Detailed error messages
        if (data.error === "Invalid access code") {
          setError("Invalid access code. Please check your code and try again.");
        } else if (data.error === "Access code expired") {
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

  // Check for admin parameter (hidden feature)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    if (adminParam === 'true') {
      // Could set admin state here if needed
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Website
            </Link>
            <div className="flex items-center gap-2">
              <img 
                src="/paint-quote-logo.png" 
                alt="Paint Quote App" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">Paint Quote App</span>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your company access code to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="access-code" className="text-sm font-medium">
                  Access Code
                </label>
                <Input
                  id="access-code"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Enter your access code"
                  className="text-center text-lg font-mono tracking-wider"
                  disabled={isLoading}
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 text-center">
                  Example: DEMO2024, PAINTER001
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !accessCode.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Need help?</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Link
                  href="/forgot-code"
                  className="text-sm text-center text-blue-600 hover:text-blue-800"
                >
                  Forgot your access code?
                </Link>
                <Link
                  href="/trial-signup"
                  className="text-sm text-center text-blue-600 hover:text-blue-800"
                >
                  Don't have an account? Start free trial
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-4">
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Paint Quote App. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-700">Terms of Service</Link>
            <Link href="/contact" className="hover:text-gray-700">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}