"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TouchFriendlyInput } from "@/components/ui/touch-friendly-input";
import { AlertCircle, Check, Palette, Copy, Sparkles, ArrowRight, Shield, Zap, Award } from "lucide-react";
import { Footer } from "@/components/shared/footer";

export default function TrialSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    accessCode: "",
    contactName: "",
    email: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const generateSuggestedCode = (companyName: string = formData.companyName) => {
    const prefix = companyName
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 6)
      .toUpperCase();
    const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return prefix + suffix;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) {
      setError("Please enter your company name to continue.");
      return;
    }

    if (!formData.email) {
      setError("Please enter your email address to receive your access code.");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address (e.g., yourname@company.com).");
      return;
    }

    if (!formData.accessCode) {
      setError("Access code generation failed. Please try typing your company name again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trial-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error("Server error: Invalid response format. Please try again.");
      }

      const result = await response.json();
      console.log('API response:', result);

      if (!response.ok) {
        if (result.error && result.error.includes("already exists")) {
          throw new Error("This company name or access code is already taken. Please try a different one.");
        } else if (result.error && result.error.includes("email")) {
          throw new Error("Please enter a valid email address.");
        } else if (result.error && result.error.includes("validation")) {
          throw new Error("Please check your information and try again.");
        } else {
          throw new Error(result.error || "Account creation failed. Please try again or contact support.");
        }
      }

      setSuccess(true);
      
      // Store access code in localStorage for trial-success page
      localStorage.setItem('companyAccessCode', formData.accessCode);
      
      // Auto-redirect to trial-success page after 3 seconds
      setTimeout(() => {
        router.push('/trial-success');
      }, 3000);

    } catch (error: any) {
      console.error('Trial signup error:', error);
      if (error.message) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please check your internet connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate access code when company name changes
    if (field === "companyName" && value && value.length >= 3) {
      const newCode = generateSuggestedCode(value);
      setFormData(prev => ({ ...prev, accessCode: newCode }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="ac-card w-full max-w-md">
          <div className="ac-card-body p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Trial Account Created!</h2>
            <p className="text-gray-600 mb-6">
              Your free trial account is ready with 1 quote included.
            </p>
            
            <div className="ac-gradient-box p-6 mb-6">
              <p className="text-sm text-gray-600 mb-3">Your Access Code:</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-2xl font-bold text-primary-pink">{formData.accessCode}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(formData.accessCode);
                    alert('Access code copied to clipboard!');
                  }}
                  className="ac-btn ac-btn-sm ac-btn-secondary"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Click the copy button to save your access code
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">1 Free Quote Included</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Full Dashboard Access</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">AI-Powered Quote Generation</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-primary-pink">
              <Zap className="w-5 h-5 animate-pulse" />
              <p className="text-sm font-medium">Redirecting you to get started...</p>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="ac-hero py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="ac-hero-badge mb-6">
            <Sparkles size={16} />
            <span>Start Free in 30 Seconds</span>
          </div>
          
          <h1 className="ac-hero-title mb-6">
            Create Professional Quotes <span style={{ color: 'var(--primary-pink)' }}>14x Faster</span>
          </h1>
          
          <p className="ac-hero-subtitle">
            Join 5,000+ contractors winning more jobs with AI-powered quotes.
            No credit card required. Get your first quote free.
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-12 px-4 -mt-20 relative z-10">
        <div className="container mx-auto max-w-md">
          <div className="ac-card">
            <div className="ac-card-body p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h2>
                <p className="text-gray-600">
                  No credit card required • Instant access • 1 free quote included
                </p>
              </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="ac-form-group">
                <label htmlFor="companyName" className="ac-label">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  placeholder="e.g., Elite Painting Co."
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="ac-input"
                  required
                />
              </div>

              <div className="ac-form-group">
                <label htmlFor="email" className="ac-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g., mike@elitepainting.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="ac-input"
                  required
                />
                <p className="ac-form-helper">We'll email you your access code and account details</p>
              </div>

              {formData.accessCode && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg ac-fade-in">
                  <div className="text-sm font-medium text-purple-900 mb-2">Your Access Code</div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary-pink">{formData.accessCode}</p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(formData.accessCode);
                        alert('Access code copied to clipboard!');
                      }}
                      className="ac-btn ac-btn-sm ac-btn-ghost text-primary-pink hover:bg-purple-100"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-purple-700 mt-2">
                    Save this code - you'll use it to sign in after creating your account
                  </p>
                </div>
              )}

              {error && (
                <div className="ac-form-error flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="ac-gradient-box p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-pink" />
                  Your Free Trial Includes:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">1 Professional Quote (No credit card required)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">AI Quote Assistant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">Full Dashboard Access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-sm text-gray-700">Mobile & Desktop Compatible</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.companyName || !formData.email}
                className={`ac-btn ac-btn-primary ac-btn-lg w-full ${isLoading ? 'ac-btn-loading' : ''}`}
              >
                {isLoading ? '' : (
                  <>
                    Create Free Trial Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                No credit card required • Instant access • 1 free quote included
              </p>
            </form>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an access code?{" "}
              <a href="/access-code" className="text-primary-pink hover:text-primary-pink-dark font-medium transition-colors">
                Sign in here →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="ac-fade-in">
              <div className="text-3xl font-bold text-gray-900">5,000+</div>
              <div className="text-sm text-gray-600">Active Contractors</div>
            </div>
            <div className="ac-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-gray-900">99%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div className="ac-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-gray-900">30s</div>
              <div className="text-sm text-gray-600">Average Quote Time</div>
            </div>
            <div className="ac-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}