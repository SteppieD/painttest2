"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Sparkles, ArrowRight, Shield, Star, TrendingUp, Users } from "lucide-react";
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export default function TrialSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Generate a simple access code based on email
      const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").substring(0, 6).toUpperCase();
      const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      const accessCode = emailPrefix + suffix;
      
      // Generate a temporary company name from email domain
      const domain = email.split("@")[1].split(".")[0];
      const companyName = domain.charAt(0).toUpperCase() + domain.slice(1) + " Painting";

      const response = await fetch("/api/trial-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          accessCode,
          companyName,
          contactName: email.split("@")[0],
          phone: ""
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Server error. Please try again.");
      }

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.includes("already exists")) {
          throw new Error("This email is already registered. Please sign in instead.");
        } else {
          throw new Error(result.error || "Something went wrong. Please try again.");
        }
      }

      // Store access code for the success page
      localStorage.setItem('companyAccessCode', accessCode);
      localStorage.setItem('trialEmail', email);
      
      // Redirect to success page
      router.push('/trial-success');

    } catch (error: any) {
      console.error('Trial signup error:', error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />
      {/* Split Hero Section with Form */}
      <section className="min-h-[80vh] flex items-center py-12 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Value Props */}
            <div className="space-y-8">
              <div>
                <div className="ac-hero-badge mb-6 inline-flex" style={{ background: 'rgba(239, 43, 112, 0.15)', borderColor: 'rgba(239, 43, 112, 0.3)' }}>
                  <Sparkles size={16} className="text-primary-pink" />
                  <span className="text-gray-800 font-medium">5,000+ contractors trust ProPaint Quote</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Start creating quotes in{" "}
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-primary-pink/10 rounded-lg -skew-x-12"></span>
                    <span className="relative text-primary-pink font-extrabold px-2">30 seconds</span>
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                  Join thousands of painting contractors who create professional quotes 14x faster with AI. 
                  No credit card required.
                </p>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">4.9/5</span> from 2,847 reviews
                  </p>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create quotes 14x faster</h3>
                    <p className="text-gray-600">AI-powered estimates in under 30 seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Win 40% more jobs</h3>
                    <p className="text-gray-600">Professional quotes that convert</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Save 10+ hours per week</h3>
                    <p className="text-gray-600">Automate quote creation and follow-ups</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right side - Signup Form */}
            <div className="lg:pl-12">
              <div className="ac-card shadow-xl border-2 max-w-md mx-auto">
                <div className="ac-card-body p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Start your free trial
                  </h2>
                  <p className="text-gray-600 mb-6">
                    No credit card required. 1 free quote included.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="ac-form-group">
                      <label htmlFor="email" className="ac-label">
                        Work email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="ac-input text-lg py-3"
                        autoFocus
                        required
                      />
                    </div>

                    {error && (
                      <div className="ac-form-error flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className={`ac-btn ac-btn-primary ac-btn-lg w-full ${isLoading ? 'ac-btn-loading' : ''}`}
                    >
                      {isLoading ? '' : (
                        <>
                          Get Started Free
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    <p className="text-center">
                      <span className="text-gray-600">Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => router.push('/access-code')}
                        className="text-primary-pink hover:text-primary-pink-dark font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                </div>
              </div>

              {/* Testimonial below form */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg max-w-md mx-auto">
                <p className="text-gray-700 italic mb-3">
                  "ProPaint Quote transformed our business. We're winning 40% more jobs and saving 
                  hours every day. Best investment we've made."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Mike Johnson</p>
                    <p className="text-sm text-gray-600">Elite Painting Co.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Stats Bar */}
      <section className="py-8 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold">5,000+</div>
              <div className="text-sm opacity-80">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$73M+</div>
              <div className="text-sm opacity-80">Quotes Generated</div>
            </div>
            <div>
              <div className="text-2xl font-bold">14x</div>
              <div className="text-sm opacity-80">Faster Quotes</div>
            </div>
            <div>
              <div className="text-2xl font-bold">40%</div>
              <div className="text-sm opacity-80">More Jobs Won</div>
            </div>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}