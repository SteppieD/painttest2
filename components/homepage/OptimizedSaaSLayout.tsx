'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Clock,
  Shield,
  TrendingUp,
  Users,
  Award,
  Zap,
  BarChart3,
  Calculator,
  Smartphone,
  FileText,
  DollarSign
} from 'lucide-react';

export function OptimizedSaaSLayout() {
  return (
    <div>
      {/* Section 1: Above the Fold - Hero with Clear Value Proposition */}
      <section>
        <div>
          <div>
            {/* Left: Messaging */}
            <div>
              {/* Trust Badge */}
              <div>
                <Award size={16} />
                <span>Trusted by 5,247+ Painting Contractors</span>
              </div>

              {/* Main Headline - Problem/Solution Fit */}
              <h1>
                Stop Losing Jobs to
                <span>Faster Competitors</span>
              </h1>

              {/* Sub-headline - Clear Value Prop */}
              <p>
                Create professional painting quotes in <strong>30 seconds</strong> instead of 3 days. 
                Win more jobs with instant, accurate estimates that impress customers.
              </p>

              {/* Social Proof Bar - Condensed for space */}
              <div>
                <div>
                  <div>
                    {[1,2,3,4,5].map(i => (
                      <img 
                        key={i}
                        src={`https://i.pravatar.cc/32?img=${i}`} 
                        alt="User" 
                       
                      />
                    ))}
                  </div>
                  <div>
                    <div>5,247+ Active</div>
                  </div>
                </div>
                <div>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} />
                  ))}
                  <span>4.9/5</span>
                </div>
              </div>

              {/* CTAs - Primary and Secondary */}
              <div>
                <Link 
                  href="/trial-signup" 
                 
                >
                  Start Free Trial
                  <ArrowRight size={18} />
                </Link>
                <Link 
                  href="/demo" 
                 
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                  Watch Demo
                </Link>
              </div>

              {/* Trust Indicators - More compact */}
              <div>
                <span>
                  <Check size={14} />
                  No credit card
                </span>
                <span>
                  <Shield size={14} />
                  30-day guarantee
                </span>
                <span>
                  <Clock size={14} />
                  2-min setup
                </span>
              </div>
            </div>

            {/* Right: Visual Demo - Higher priority on mobile */}
            <div>
              {/* Attention Arrow - Desktop only */}
              <div>
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                  <path d="M5 20H45M45 20L30 5M45 20L30 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Try it!</span>
              </div>
              
              {/* Main Product Screenshot - Larger and more prominent */}
              <div>
                <div>
                  <h3>Instant Quote Generator</h3>
                  <span>LIVE</span>
                </div>
                
                {/* Mock Quote Interface - Condensed */}
                <div>
                  <div>
                    <div>Customer</div>
                    <div>Johnson Residence</div>
                  </div>
                  
                  <div>
                    <div>
                      <div>Time</div>
                      <div>28 sec</div>
                    </div>
                    <div>
                      <div>Total</div>
                      <div>$4,850</div>
                    </div>
                  </div>

                  <button>
                    Send to Customer
                  </button>
                </div>
              </div>

              {/* Floating Stats - Hidden on mobile, positioned better on desktop */}
              <div>
                <div>
                  <div>
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div>+47%</div>
                    <div>More Jobs</div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div>32hrs</div>
                    <div>Saved/mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Logo Bar - Social Proof */}
      <section>
        <div>
          <p>
            TRUSTED BY LEADING PAINTING CONTRACTORS
          </p>
          <div>
            {['ProPainters Inc', 'Elite Coatings', 'ColorCraft Pro', 'Premium Finish Co', 'MasterStroke Painting'].map((name, i) => (
              <div key={i}>{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Problem Agitation - Why This Matters */}
      <section>
        <div>
          <div>
            <h2>
              Every Day You Delay Costs You <span>Real Money</span>
            </h2>
            <p>
              While you're calculating quotes manually, your competitors are winning your customers
            </p>
          </div>

          <div>
            <div>
              <div>72%</div>
              <p>Of Customers Choose</p>
              <p>The first contractor who responds with a professional quote</p>
            </div>
            <div>
              <div>$50K+</div>
              <p>Average Annual Loss</p>
              <p>From jobs lost to faster-responding competitors</p>
            </div>
            <div>
              <div>3 Days</div>
              <p>Average Quote Time</p>
              <p>For contractors still using spreadsheets and manual calculations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Solution - How It Works */}
      <section>
        <div>
          <div>
            <div>
              <Zap size={16} />
              <span>So Simple, You'll Master It in Minutes</span>
            </div>
            <h2>
              From Measurement to Professional Quote in <span>3 Simple Steps</span>
            </h2>
          </div>

          <div>
            <div>
              <div>
                <Smartphone size={32} />
              </div>
              <h3>1. Input Measurements</h3>
              <p>
                Enter room dimensions on your phone or tablet. Our AI fills in the rest based on your past quotes.
              </p>
              <div>
                ✓ Works offline at job sites
              </div>
            </div>

            <div>
              <div>
                <Calculator size={32} />
              </div>
              <h3>2. AI Calculates Everything</h3>
              <p>
                Materials, labor, prep work - all calculated instantly with 99.2% accuracy based on 50,000+ jobs.
              </p>
              <div>
                ✓ Includes your markup automatically
              </div>
            </div>

            <div>
              <div>
                <FileText size={32} />
              </div>
              <h3>3. Send Professional Quote</h3>
              <p>
                Beautiful, branded quotes sent instantly. Customers can approve and sign digitally.
              </p>
              <div>
                ✓ 3x higher acceptance rate
              </div>
            </div>
          </div>

          <div>
            <Link 
              href="/trial-signup" 
             
            >
              Try It Free - No Credit Card
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Features Grid - What You Get */}
      <section>
        <div>
          <div>
            <h2>
              Everything You Need to <span>Dominate Your Market</span>
            </h2>
            <p>
              Built by contractors, for contractors. Every feature designed to help you win more jobs.
            </p>
          </div>

          <div>
            {[
              {
                icon: <Clock />,
                title: "30-Second Quotes",
                description: "Create quotes faster than competitors can return phone calls"
              },
              {
                icon: <DollarSign />,
                title: "Smart Pricing AI",
                description: "Never underbid or overprice. AI learns your optimal pricing"
              },
              {
                icon: <Smartphone />,
                title: "Works Anywhere",
                description: "Quote from job sites, even without internet connection"
              },
              {
                icon: <FileText />,
                title: "Professional Templates",
                description: "Quotes that make you look like a million-dollar company"
              },
              {
                icon: <BarChart3 />,
                title: "Win Rate Analytics",
                description: "See which quotes win and optimize your pricing"
              },
              {
                icon: <Shield />,
                title: "Digital Signatures",
                description: "Get approvals instantly, no more chasing paperwork"
              }
            ].map((feature, i) => (
              <div key={i}>
                <div>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Testimonials/Case Studies */}
      <section>
        <div>
          <div>
            <h2>
              Contractors <span>Winning Big</span> with ProPaint Quote
            </h2>
          </div>

          <div>
            <div>
              <div>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} />
                ))}
              </div>
              <p>
                "Was losing 2-3 jobs a week to faster competitors. Now I send quotes before leaving the driveway. 
                <strong> Revenue up 47% in 3 months.</strong>"
              </p>
              <div>
                <img src="https://i.pravatar.cc/48?img=8" alt="Mike" />
                <div>
                  <div>Mike Johnson</div>
                  <div>Johnson Painting, TX</div>
                </div>
              </div>
            </div>

            <div>
              <div>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} />
                ))}
              </div>
              <p>
                "The setup wizard had me running in 2 minutes. Created my first quote in 30 seconds. 
                <strong> This pays for itself in one job.</strong>"
              </p>
              <div>
                <img src="https://i.pravatar.cc/48?img=5" alt="Sarah" />
                <div>
                  <div>Sarah Chen</div>
                  <div>Elite Coatings, CA</div>
                </div>
              </div>
            </div>

            <div>
              <div>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} />
                ))}
              </div>
              <p>
                "My close rate went from 20% to 65%. Professional quotes make all the difference. 
                <strong> Best investment I've made.</strong>"
              </p>
              <div>
                <img src="https://i.pravatar.cc/48?img=12" alt="Carlos" />
                <div>
                  <div>Carlos Rivera</div>
                  <div>ProFinish Co, FL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Pricing - Simple and Clear */}
      <section>
        <div>
          <div>
            <h2>
              Simple Pricing That <span>Pays for Itself</span>
            </h2>
            <p>
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </div>

          <div>
            {/* Free Plan */}
            <div>
              <h3>Starter</h3>
              <div>
                $0<span>/month</span>
              </div>
              <p>Perfect for trying it out</p>
              <ul>
                <li>
                  <Check size={20} />
                  <span>10 quotes per month</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>All core features</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>Email support</span>
                </li>
              </ul>
              <Link href="/trial-signup">
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Featured */}
            <div>
              <div>
                MOST POPULAR
              </div>
              <h3>Professional</h3>
              <div>
                $79<span>/month</span>
              </div>
              <p>Everything you need to grow</p>
              <ul>
                <li>
                  <Check size={20} />
                  <span><strong>Unlimited</strong> quotes</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>Smart pricing AI</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>Custom branding</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>Priority support</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <Link href="/trial-signup">
                Start 14-Day Trial
              </Link>
            </div>

            {/* Business Plan */}
            <div>
              <h3>Business</h3>
              <div>
                $149<span>/month</span>
              </div>
              <p>For growing teams</p>
              <ul>
                <li>
                  <Check size={20} />
                  <span>Everything in Pro</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>Multi-user access</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>API access</span>
                </li>
                <li>
                  <Check size={20} />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link href="/contact">
                Contact Sales
              </Link>
            </div>
          </div>

          <div>
            <p>
              <Shield size={20} />
              30-day money back guarantee • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section>
        <div>
          <h2>
            Your Competitors Are Already Using This
          </h2>
          <p>
            Every day you wait is money lost. Join 5,247+ contractors winning more jobs with instant quotes.
          </p>
          
          <div>
            <Link 
              href="/trial-signup" 
             
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/demo" 
             
            >
              Schedule Live Demo
            </Link>
          </div>

          <div>
            <span>
              <Check size={20} />
              Setup in 2 minutes
            </span>
            <span>
              <Check size={20} />
              No credit card required
            </span>
            <span>
              <Check size={20} />
              Full feature access
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}