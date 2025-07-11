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
    <div>
      {/* Header with back button */}
      <div>
        <div>
          <div>
            <Link href="/">
              <ArrowLeft />
              Back to Website
            </Link>
            <div>
              <img 
                src="/paint-logo-transparent.png" 
                alt="Paint Quote App - Access Code Login" 
               
                width="32"
                height="32"
              />
              <span>Paint Quote App</span>
            </div>
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div>
        <Card>
          <CardHeader>
            <div>
              <div>
                <Lock />
              </div>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your company access code to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="access-code">
                  Access Code
                </label>
                <Input
                  id="access-code"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Enter your access code"
                 
                  disabled={isLoading}
                  required
                  autoFocus
                />
                <p>
                  Example: DEMO2024, PAINTER001
                </p>
              </div>

              {error && (
                <div>
                  <AlertCircle />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
               
                disabled={isLoading || !accessCode.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 />
                    Logging in...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>

            <div>
              <div>
                <div>
                  <span />
                </div>
                <div>
                  <span>Need help?</span>
                </div>
              </div>

              <div>
                <Link
                  href="/forgot-code"
                 
                >
                  Forgot your access code?
                </Link>
                <Link
                  href="/trial-signup"
                 
                >
                  Don't have an account? Start free trial
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div>
        <div>
          <p>© 2025 Paint Quote App. All rights reserved.</p>
          <div>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}