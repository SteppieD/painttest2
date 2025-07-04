'use client';

import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  FileText,
  BookOpen,
  Zap,
  DollarSign,
  BarChart3,
  Award,
  Check
} from 'lucide-react';
import { ContractorHeroSection } from '@/components/hero/ContractorHeroSection';
import { OptimizedSaaSLayoutWithImages } from '@/components/homepage/OptimizedSaaSLayoutWithImages';
import { Footer } from '@/components/shared/footer';
import { ROICalculator } from '@/components/marketing/roi-calculator';
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Optimized SaaS Homepage Layout with Professional Images */}
      <OptimizedSaaSLayoutWithImages />

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="ac-fade-in">
              <div className="text-3xl font-bold text-gray-900">5,000+</div>
              <div className="text-sm text-gray-600">Active Contractors</div>
            </div>
            <div className="ac-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold text-gray-900">$73M+</div>
              <div className="text-sm text-gray-600">Quotes Generated</div>
            </div>
            <div className="ac-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-gray-900">99%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div className="ac-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with AC Design */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="ac-hero-badge inline-flex mb-4">
              <Zap size={16} />
              <span>Professional Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-primary-pink">Win More Jobs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for painting contractors who want to dominate their market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calculator,
                title: "AI-Powered Calculator",
                description: "99% accurate estimates with smart material and labor calculations. Never lose money on underquotes.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Clock,
                title: "30-Second Quotes",
                description: "Create professional quotes in seconds, not hours. Close deals on-site before competitors respond.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                description: "Quote from anywhere - job sites, client meetings, or your truck. Works perfectly on any device.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: FileText,
                title: "Professional Templates",
                description: "Stunning quote templates that make you look like a million-dollar company. Customizable branding.",
                color: "from-pink-500 to-pink-600"
              },
              {
                icon: TrendingUp,
                title: "Win Rate Analytics",
                description: "Track which quotes win and why. Optimize your pricing for maximum profit and conversion.",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: Shield,
                title: "Digital Signatures",
                description: "Get quotes approved instantly with legally-binding e-signatures. No more chasing paperwork.",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => (
              <div key={index} className="ac-card group ac-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="ac-card-body">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-pink transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview with professional design */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Start free, upgrade when ready. No contracts, no hidden fees.
          </p>
          
          <div className="ac-pricing-grid">
            {/* Free Plan */}
            <div className="ac-pricing-card">
              <h3 className="text-2xl font-bold mb-2">Perfect Start</h3>
              <p className="text-gray-600 mb-6">For solo contractors</p>
              <div className="ac-pricing-price">
                $0<span className="ac-pricing-period">/month</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">10 quotes per month</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>All core features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Mobile app access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link href="/trial-signup" className="ac-btn ac-btn-secondary ac-btn-lg">
                Start Free
              </Link>
            </div>

            {/* Professional Plan */}
            <div className="ac-pricing-card featured">
              <div className="ac-pricing-badge">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">For growing businesses</p>
              <div className="ac-pricing-price">
                $79<span className="ac-pricing-period">/month</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">Unlimited quotes</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Custom branding</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <Link href="/trial-signup" className="ac-btn ac-btn-primary ac-btn-lg">
                Start 14-Day Trial
              </Link>
            </div>

            {/* Business Plan */}
            <div className="ac-pricing-card">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-gray-600 mb-6">For teams & enterprises</p>
              <div className="ac-pricing-price">
                $149<span className="ac-pricing-period">/month</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">Everything included</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Multi-user access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Dedicated manager</span>
                </li>
              </ul>
              <Link href="/contact" className="ac-btn ac-btn-secondary ac-btn-lg">
                Contact Sales
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/pricing" className="text-white hover:text-primary-pink transition-colors">
              View detailed pricing & features →
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Calculate Your <span className="text-primary-pink">ROI</span>
            </h2>
            <p className="text-xl text-gray-600">
              See how much revenue ProPaint Quote can generate for your business
            </p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel className="bg-white" />

      {/* Final CTA with AC Design */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-pink to-primary-pink-dark">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="ac-hero-badge inline-flex mb-6" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }}>
            <Award size={16} />
            <span className="text-white">Limited Time Offer</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to 14x Your Quote Speed?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 5,000+ contractors winning more jobs with professional quotes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="ac-btn ac-btn-secondary ac-btn-lg">
              Start Free Trial - 10 Quotes Included
              <ArrowRight size={20} />
            </Link>
            <Link href="/demo" className="ac-btn ac-btn-ghost ac-btn-lg text-white border-white hover:bg-white hover:text-primary-pink">
              Watch Demo
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-white/80 text-sm">
            <span>✓ No credit card required</span>
            <span>✓ Full feature access</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}