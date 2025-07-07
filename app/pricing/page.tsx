'use client';

import Link from 'next/link';
import { 
  Check, 
  Star, 
  Zap, 
  Users, 
  Crown, 
  ArrowRight,
  CheckCircle,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Calculator,
  Smartphone,
  Target,
  Award,
  Percent
} from 'lucide-react';
import { Footer } from '@/components/shared/footer';
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel';
import { ModernPricingTable } from '@/components/stripe/modern-pricing-table';

export default function PricingPage() {
  // CIALDINI PRINCIPLE: Social Proof with real customer data
  const socialProofStats = [
    { number: "5,000+", label: "Active Contractors", icon: Users },
    { number: "40%", label: "Win Rate Increase", icon: TrendingUp },
    { number: "$73M+", label: "Quotes Generated", icon: Calculator },
    { number: "4.9/5", label: "Customer Rating", icon: Star }
  ];

  // CIALDINI PRINCIPLE: Authority through feature comparison
  const featureComparison = [
    { feature: "Monthly Quotes", free: "10 Quotes", professional: "Unlimited", business: "Unlimited" },
    { feature: "Mobile App", free: true, professional: true, business: true },
    { feature: "Custom Branding", free: false, professional: true, business: true },
    { feature: "Analytics Dashboard", free: "Basic", professional: "Advanced", business: "Enterprise" },
    { feature: "Team Management", free: false, professional: false, business: "Up to 5 users" },
    { feature: "API Access", free: false, professional: false, business: true },
    { feature: "Phone Support", free: false, professional: true, business: "Dedicated Manager" },
    { feature: "Custom Integrations", free: false, professional: "QuickBooks", business: "Unlimited" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="ac-hero py-20">
        <div className="container mx-auto text-center max-w-4xl px-4">
          <div className="ac-hero-badge mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by 5,000+ Professional Contractors</span>
          </div>
          
          <h1 className="ac-hero-title">
            Simple Pricing That <span style={{ color: 'var(--primary-pink)' }}>Scales With You</span>
          </h1>
          <p className="ac-hero-subtitle mb-8">
            Start free, upgrade when ready. No contracts, no hidden fees. 
            Join thousands of contractors winning 40% more jobs.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {socialProofStats.map((stat, index) => (
              <div key={index} className="ac-fade-in text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <p className="text-gray-300">⚡ Most contractors see ROI within their first quote</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="ac-hero-badge inline-flex mb-4" style={{ background: 'rgba(239, 43, 112, 0.1)', borderColor: 'rgba(239, 43, 112, 0.2)', color: 'var(--primary-pink)' }}>
              <Percent size={16} />
              <span>Save 20% with Annual Billing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span style={{ color: 'var(--primary-pink)' }}>Growth Plan</span>
            </h2>
            <p className="text-xl text-gray-600">
              Every plan includes all core features. Upgrade anytime as your business grows.
            </p>
          </div>
          
          <ModernPricingTable />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Compare All <span style={{ color: 'var(--primary-pink)' }}>Features</span>
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what's included in each plan. No hidden features or surprise limitations.
            </p>
          </div>
          
          <div className="ac-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Perfect Start</th>
                    <th className="text-center p-6 font-semibold text-gray-900">
                      <div className="flex flex-col items-center">
                        <span>Professional</span>
                        <span className="text-xs font-normal text-primary-pink mt-1">Most Popular</span>
                      </div>
                    </th>
                    <th className="text-center p-6 font-semibold text-gray-900">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featureComparison.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-medium text-gray-900">{row.feature}</td>
                      <td className="p-6 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">{row.free}</span>
                        )}
                      </td>
                      <td className="p-6 text-center bg-blue-50/30">
                        {typeof row.professional === 'boolean' ? (
                          row.professional ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600 font-medium">{row.professional}</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.business === 'boolean' ? (
                          row.business ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-gray-600">{row.business}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <TestimonialCarousel className="bg-white" />

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Calculate Your <span style={{ color: 'var(--primary-pink)' }}>ROI</span>
            </h2>
            <p className="text-xl text-gray-600">
              See how much revenue ProPaint Quote can generate for your business
            </p>
          </div>
          
          <div className="ac-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Average Contractor</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Quotes per month: <span className="font-bold">20</span></div>
                  <div className="text-sm text-gray-600">Average quote value: <span className="font-bold">$3,500</span></div>
                  <div className="text-sm text-gray-600">Current win rate: <span className="font-bold">30%</span></div>
                </div>
              </div>
              
              <div>
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">With ProPaint Quote</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Win rate increase: <span className="font-bold text-green-600">+40%</span></div>
                  <div className="text-sm text-gray-600">New win rate: <span className="font-bold text-green-600">42%</span></div>
                  <div className="text-sm text-gray-600">Time saved per quote: <span className="font-bold text-green-600">3 hours</span></div>
                </div>
              </div>
              
              <div>
                <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Monthly Impact</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Additional revenue: <span className="font-bold text-purple-600">$8,400</span></div>
                  <div className="text-sm text-gray-600">Time saved: <span className="font-bold text-purple-600">60 hours</span></div>
                  <div className="text-sm text-gray-600">ROI: <span className="font-bold text-purple-600">29,000%</span></div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <div className="text-2xl font-bold text-gray-900 mb-4">
                ProPaint Quote pays for itself with just 1 additional job per month
              </div>
              <Link href="/trial-signup" className="ac-btn ac-btn-primary ac-btn-lg">
                Start Earning More Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span style={{ color: 'var(--primary-pink)' }}>Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our pricing and features
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "Can I really start with 10 free quotes?",
                a: "Absolutely! No credit card required. You get full access to all features for your first 10 quotes. 95% of contractors who try us end up upgrading within 30 days because they see immediate results and revenue increase."
              },
              {
                q: "What happens if I exceed my monthly quote limit?",
                a: "We'll send you a friendly reminder when you're at 80% of your limit. You can upgrade anytime or purchase additional quotes. We never cut off access mid-month - your business comes first."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, no contracts or cancellation fees. You can cancel anytime from your account settings. We're confident you'll love the results, which is why we make it risk-free."
              },
              {
                q: "Do you offer discounts for annual payments?",
                a: "Yes! Save 20% when you pay annually. Plus, annual customers get priority support and exclusive features first. Most contractors save $200+ per year this way."
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees, ever. We include free onboarding for all paid plans, including data migration from your existing tools. Our success team will get you up and running in under 30 minutes."
              },
              {
                q: "What kind of support do you provide?",
                a: "All plans include email support. Starter+ plans get chat support. Professional+ plans get phone support. Business plans get a dedicated success manager. Average response time is under 2 hours."
              }
            ].map((faq, index) => (
              <div key={index} className="ac-card ac-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="ac-card-body">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-primary-pink to-primary-pink-dark">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="ac-hero-badge inline-flex mb-6" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }}>
            <Sparkles className="w-4 h-4" />
            <span className="text-white">Limited Time: 10 Free Quotes for Early Adopters</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to <span className="text-yellow-300">14x Your Quote Speed?</span>
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 5,000+ contractors who've transformed their businesses. 
            Start free, see results immediately, scale as you grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="ac-btn ac-btn-secondary ac-btn-lg">
              Start Free Trial - 10 Quotes Included
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/demo" className="ac-btn ac-btn-ghost ac-btn-lg text-white border-white hover:bg-white hover:text-primary-pink">
              Watch Live Demo
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-blue-200 text-sm mb-6">
            <span>✓ No credit card required</span>
            <span>✓ Full feature access</span>
            <span>✓ Cancel anytime</span>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-blue-100 text-sm">
              "Best investment I've made for my painting business. ROI was immediate." - Mike Johnson, Elite Painting Co.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}