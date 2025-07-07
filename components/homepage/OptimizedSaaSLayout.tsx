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
    <div className="saas-optimized-layout">
      {/* Section 1: Above the Fold - Hero with Clear Value Proposition */}
      <section className="hero-optimized">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-120px)] py-8 lg:py-12">
            {/* Left: Messaging */}
            <div className="hero-content space-y-4 lg:space-y-6 order-2 lg:order-1">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm font-semibold">
                <Award size={16} />
                <span>Trusted by 5,247+ Painting Contractors</span>
              </div>

              {/* Main Headline - Problem/Solution Fit */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Stop Losing Jobs to
                <span className="text-orange-600 block">Faster Competitors</span>
              </h1>

              {/* Sub-headline - Clear Value Prop */}
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                Create professional painting quotes in <strong>30 seconds</strong> instead of 3 days. 
                Win more jobs with instant, accurate estimates that impress customers.
              </p>

              {/* Social Proof Bar - Condensed for space */}
              <div className="flex flex-wrap gap-4 lg:gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map(i => (
                      <img 
                        key={i}
                        src={`https://i.pravatar.cc/32?img=${i}`} 
                        alt="User" 
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">5,247+ Active</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-sm font-semibold">4.9/5</span>
                </div>
              </div>

              {/* CTAs - Primary and Secondary */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/trial-signup" 
                  className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-bold text-base lg:text-lg hover:bg-orange-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight size={18} />
                </Link>
                <Link 
                  href="/demo" 
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-bold text-base lg:text-lg border-2 border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                  Watch Demo
                </Link>
              </div>

              {/* Trust Indicators - More compact */}
              <div className="flex flex-wrap gap-4 text-xs lg:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Check className="text-green-600" size={14} />
                  No credit card
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="text-green-600" size={14} />
                  30-day guarantee
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="text-green-600" size={14} />
                  2-min setup
                </span>
              </div>
            </div>

            {/* Right: Visual Demo - Higher priority on mobile */}
            <div className="hero-visual relative order-1 lg:order-2 mb-6 lg:mb-0 flex items-center justify-center">
              {/* Attention Arrow - Desktop only */}
              <div className="hidden lg:block absolute -left-16 top-1/2 -translate-y-1/2 text-orange-600 animate-bounce-horizontal">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                  <path d="M5 20H45M45 20L30 5M45 20L30 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="block text-sm font-bold mt-2">Try it!</span>
              </div>
              
              {/* Main Product Screenshot - Larger and more prominent */}
              <div className="relative z-10 bg-white rounded-xl lg:rounded-2xl shadow-2xl p-4 sm:p-5 lg:p-6 transform lg:rotate-1 hover:rotate-0 transition-all duration-300 max-w-sm sm:max-w-md mx-auto lg:max-w-none lg:scale-110 hover:scale-115 ring-4 ring-orange-600/20 hover:ring-orange-600/40">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-base lg:text-lg">Instant Quote Generator</h3>
                  <span className="text-green-600 font-semibold text-sm">LIVE</span>
                </div>
                
                {/* Mock Quote Interface - Condensed */}
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs lg:text-sm text-gray-600">Customer</div>
                    <div className="font-semibold text-sm lg:text-base">Johnson Residence</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="text-xs text-gray-600">Time</div>
                      <div className="text-xl lg:text-2xl font-bold text-orange-600">28 sec</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="text-xs text-gray-600">Total</div>
                      <div className="text-xl lg:text-2xl font-bold text-green-600">$4,850</div>
                    </div>
                  </div>

                  <button className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-semibold text-sm lg:text-base hover:bg-orange-700 transition-colors">
                    Send to Customer
                  </button>
                </div>
              </div>

              {/* Floating Stats - Hidden on mobile, positioned better on desktop */}
              <div className="hidden lg:block absolute -top-2 -left-2 bg-white rounded-lg shadow-lg p-3 transform -rotate-6">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">+47%</div>
                    <div className="text-xs text-gray-600">More Jobs</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -bottom-2 -right-2 bg-white rounded-lg shadow-lg p-3 transform rotate-6">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">32hrs</div>
                    <div className="text-xs text-gray-600">Saved/mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Logo Bar - Social Proof */}
      <section className="logo-bar py-12 bg-gray-50 border-y">
        <div className="container mx-auto max-w-7xl px-4">
          <p className="text-center text-gray-600 mb-8 font-semibold">
            TRUSTED BY LEADING PAINTING CONTRACTORS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {['ProPainters Inc', 'Elite Coatings', 'ColorCraft Pro', 'Premium Finish Co', 'MasterStroke Painting'].map((name, i) => (
              <div key={i} className="text-xl font-bold text-gray-700">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Problem Agitation - Why This Matters */}
      <section className="problem-agitation py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Every Day You Delay Costs You <span className="text-red-600">Real Money</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While you're calculating quotes manually, your competitors are winning your customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <div className="text-4xl font-bold text-red-600 mb-2">72%</div>
              <p className="text-gray-700 font-semibold mb-2">Of Customers Choose</p>
              <p className="text-gray-600">The first contractor who responds with a professional quote</p>
            </div>
            <div className="text-center p-8 bg-orange-50 rounded-xl">
              <div className="text-4xl font-bold text-orange-600 mb-2">$50K+</div>
              <p className="text-gray-700 font-semibold mb-2">Average Annual Loss</p>
              <p className="text-gray-600">From jobs lost to faster-responding competitors</p>
            </div>
            <div className="text-center p-8 bg-yellow-50 rounded-xl">
              <div className="text-4xl font-bold text-yellow-600 mb-2">3 Days</div>
              <p className="text-gray-700 font-semibold mb-2">Average Quote Time</p>
              <p className="text-gray-600">For contractors still using spreadsheets and manual calculations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Solution - How It Works */}
      <section className="how-it-works py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap size={16} />
              <span>So Simple, You'll Master It in Minutes</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              From Measurement to Professional Quote in <span className="text-orange-600">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Smartphone className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Input Measurements</h3>
              <p className="text-gray-600 mb-4">
                Enter room dimensions on your phone or tablet. Our AI fills in the rest based on your past quotes.
              </p>
              <div className="text-sm text-green-600 font-semibold">
                ✓ Works offline at job sites
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Calculator className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. AI Calculates Everything</h3>
              <p className="text-gray-600 mb-4">
                Materials, labor, prep work - all calculated instantly with 99.2% accuracy based on 50,000+ jobs.
              </p>
              <div className="text-sm text-green-600 font-semibold">
                ✓ Includes your markup automatically
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-orange-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Send Professional Quote</h3>
              <p className="text-gray-600 mb-4">
                Beautiful, branded quotes sent instantly. Customers can approve and sign digitally.
              </p>
              <div className="text-sm text-green-600 font-semibold">
                ✓ 3x higher acceptance rate
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/trial-signup" 
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Try It Free - No Credit Card
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Features Grid - What You Get */}
      <section className="features-grid py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to <span className="text-orange-600">Dominate Your Market</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by contractors, for contractors. Every feature designed to help you win more jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div key={i} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-orange-600 transition-colors">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 text-orange-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Testimonials/Case Studies */}
      <section className="testimonials py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Contractors <span className="text-orange-600">Winning Big</span> with ProPaint Quote
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Was losing 2-3 jobs a week to faster competitors. Now I send quotes before leaving the driveway. 
                <strong> Revenue up 47% in 3 months.</strong>"
              </p>
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/48?img=8" alt="Mike" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold">Mike Johnson</div>
                  <div className="text-sm text-gray-600">Johnson Painting, TX</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "The setup wizard had me running in 2 minutes. Created my first quote in 30 seconds. 
                <strong> This pays for itself in one job.</strong>"
              </p>
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/48?img=5" alt="Sarah" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold">Sarah Chen</div>
                  <div className="text-sm text-gray-600">Elite Coatings, CA</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "My close rate went from 20% to 65%. Professional quotes make all the difference. 
                <strong> Best investment I've made.</strong>"
              </p>
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/48?img=12" alt="Carlos" className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold">Carlos Rivera</div>
                  <div className="text-sm text-gray-600">ProFinish Co, FL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Pricing - Simple and Clear */}
      <section className="pricing-simple py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Simple Pricing That <span className="text-orange-600">Pays for Itself</span>
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you're ready. Cancel anytime.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-4">
                $0<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for trying it out</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>10 quotes per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>All core features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Email support</span>
                </li>
              </ul>
              <Link href="/trial-signup" className="block text-center py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-orange-600 hover:text-orange-600 transition-colors">
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Featured */}
            <div className="bg-orange-50 p-8 rounded-xl border-2 border-orange-600 transform scale-105 shadow-xl">
              <div className="bg-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="text-4xl font-bold mb-4">
                $79<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Everything you need to grow</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span><strong>Unlimited</strong> quotes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Smart pricing AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <Link href="/trial-signup" className="block text-center py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Start 14-Day Trial
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <div className="text-4xl font-bold mb-4">
                $149<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">For growing teams</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Multi-user access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-600 mt-0.5" size={20} />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link href="/contact" className="block text-center py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-orange-600 hover:text-orange-600 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              <Shield className="inline mr-2" size={20} />
              30-day money back guarantee • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="final-cta py-20 bg-gradient-to-br from-orange-600 to-red-600 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Competitors Are Already Using This
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Every day you wait is money lost. Join 5,247+ contractors winning more jobs with instant quotes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/trial-signup" 
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/demo" 
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-all"
            >
              Schedule Live Demo
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <span className="flex items-center gap-2">
              <Check size={20} />
              Setup in 2 minutes
            </span>
            <span className="flex items-center gap-2">
              <Check size={20} />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check size={20} />
              Full feature access
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}