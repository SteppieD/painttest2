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
    <div>
      <KofiHeader />
      {/* Split Hero Section with Form */}
      <section>
        <div>
          <div>
            
            {/* Left side - Value Props */}
            <div>
              <div>
                <div>
                  <Sparkles size={16} />
                  <span>5,000+ contractors trust ProPaint Quote</span>
                </div>
                
                <h1>
                  Start creating quotes in{" "}
                  <span>
                    <span></span>
                    <span>30 seconds</span>
                  </span>
                </h1>
                
                <p>
                  Join thousands of painting contractors who create professional quotes 14x faster with AI. 
                  No credit card required.
                </p>
              </div>

              {/* Social Proof */}
              <div>
                <div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} />
                  ))}
                </div>
                <div>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p>
                    <span>4.9/5</span> from 2,847 reviews
                  </p>
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                <div>
                  <div>
                    <Check />
                  </div>
                  <div>
                    <h3>Create quotes 14x faster</h3>
                    <p>AI-powered estimates in under 30 seconds</p>
                  </div>
                </div>
                <div>
                  <div>
                    <Check />
                  </div>
                  <div>
                    <h3>Win 40% more jobs</h3>
                    <p>Professional quotes that convert</p>
                  </div>
                </div>
                <div>
                  <div>
                    <Check />
                  </div>
                  <div>
                    <h3>Save 10+ hours per week</h3>
                    <p>Automate quote creation and follow-ups</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div>
                <div>
                  <Shield />
                  <span>SOC 2 Compliant</span>
                </div>
                <div>
                  <TrendingUp />
                  <span>99.9% Uptime</span>
                </div>
                <div>
                  <Users />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Right side - Signup Form */}
            <div>
              <div>
                <div>
                  <h2>
                    Start your free trial
                  </h2>
                  <p>
                    No credit card required. 1 free quote included.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email">
                        Work email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                       
                        autoFocus
                        required
                      />
                    </div>

                    {error && (
                      <div>
                        <AlertCircle />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                     `}
                    >
                      {isLoading ? '' : (
                        <>
                          Get Started Free
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>

                    <div>
                      <div>
                        <div></div>
                      </div>
                      <div>
                        <span>or</span>
                      </div>
                    </div>

                    <p>
                      <span>Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => router.push('/access-code')}
                       
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                </div>
              </div>

              {/* Testimonial below form */}
              <div>
                <p>
                  "ProPaint Quote transformed our business. We're winning 40% more jobs and saving 
                  hours every day. Best investment we've made."
                </p>
                <div>
                  <div></div>
                  <div>
                    <p>Mike Johnson</p>
                    <p>Elite Painting Co.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Stats Bar */}
      <section>
        <div>
          <div>
            <div>
              <div>5,000+</div>
              <div>Active Users</div>
            </div>
            <div>
              <div>$73M+</div>
              <div>Quotes Generated</div>
            </div>
            <div>
              <div>14x</div>
              <div>Faster Quotes</div>
            </div>
            <div>
              <div>40%</div>
              <div>More Jobs Won</div>
            </div>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}