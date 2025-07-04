'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { professionalImages, getImageWithMetadata } from '@/lib/image-config';

export function OptimizedSaaSLayoutWithImages() {
  const featureImages = {
    quoteCreation: getImageWithMetadata(professionalImages.features.quoteCreation),
    customerMeeting: getImageWithMetadata(professionalImages.features.customerMeeting),
    projectPlanning: getImageWithMetadata(professionalImages.features.projectPlanning),
    teamWork: getImageWithMetadata(professionalImages.features.teamWork)
  };

  return (
    <div className="saas-optimized-layout">
      {/* Section 1: Above the Fold - Hero with Clear Value Proposition */}
      <section className="hero-optimized bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-120px)] py-2 lg:py-4">
            {/* Left: Messaging */}
            <div className="hero-content space-y-4 lg:space-y-6 order-1 lg:order-1">
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

              {/* Social Proof Bar */}
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

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  href="/trial-signup" 
                  className="inline-flex items-center justify-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg font-bold text-base lg:text-lg hover:bg-orange-800 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl border border-orange-800"
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

              {/* Trust Indicators */}
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

            {/* Right: Stats Dashboard Mockup */}
            <div className="hero-visual relative order-2 lg:order-2 mb-6 lg:mb-0">
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

      {/* Section 2: Feature Grid with Images */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-orange-600">Win More Jobs</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From instant quotes to customer management, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Feature 1: Quote Creation */}
            <div className="feature-card bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={featureImages.quoteCreation.src}
                  alt={featureImages.quoteCreation.alt}
                  title={featureImages.quoteCreation.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calculator className="text-orange-600" size={20} />
                </div>
                <h3 className="font-bold text-lg">Instant Quotes</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Create professional quotes in seconds with AI-powered calculations
              </p>
            </div>

            {/* Feature 2: Customer Meeting */}
            <div className="feature-card bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={featureImages.customerMeeting.src}
                  alt={featureImages.customerMeeting.alt}
                  title={featureImages.customerMeeting.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={20} />
                </div>
                <h3 className="font-bold text-lg">Customer Portal</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Let customers view, accept, and pay for quotes online
              </p>
            </div>

            {/* Feature 3: Project Planning */}
            <div className="feature-card bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={featureImages.projectPlanning.src}
                  alt={featureImages.projectPlanning.alt}
                  title={featureImages.projectPlanning.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-green-600" size={20} />
                </div>
                <h3 className="font-bold text-lg">Analytics</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Track revenue, conversion rates, and business growth
              </p>
            </div>

            {/* Feature 4: Team Work */}
            <div className="feature-card bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={featureImages.teamWork.src}
                  alt={featureImages.teamWork.alt}
                  title={featureImages.teamWork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="text-purple-600" size={20} />
                </div>
                <h3 className="font-bold text-lg">Mobile Ready</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Create quotes on-site with any device, online or offline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Social Proof with Case Study Images */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Real Results from <span className="text-orange-600">Real Contractors</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Mike's Painting Co.",
                location: "Denver, CO",
                result: "340% Revenue Increase",
                quote: "We went from $150K to $500K in just 18 months. The speed of quoting changed everything.",
                image: professionalImages.caseStudies.satisfaction
              },
              {
                name: "Professional Painters LLC",
                location: "Austin, TX",
                result: "85% Time Saved",
                quote: "What used to take me 3 hours now takes 30 seconds. I can bid on 10x more jobs.",
                image: professionalImages.caseStudies.planning
              },
              {
                name: "Elite Coatings",
                location: "Miami, FL",
                result: "60% Close Rate",
                quote: "Professional quotes impress customers. Our close rate doubled in 90 days.",
                image: professionalImages.caseStudies.completion
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} success story`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {testimonial.result}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/painting-contractor-software-case-study"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:underline"
            >
              Read Full Case Studies
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA with Image */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-600 to-orange-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={professionalImages.hero.tertiary}
            alt="Contractor success"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Painting Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 5,247+ contractors who are winning more jobs with less effort
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/trial-signup" 
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-xl"
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/pricing" 
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white hover:bg-white hover:text-orange-600 transition-all"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-80">
            No credit card required • 2-minute setup • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}