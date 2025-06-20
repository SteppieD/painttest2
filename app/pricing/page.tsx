import { Metadata } from 'next';
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
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Pricing Plans - Start Free, Grow Your Painting Business | ProPaint Quote',
  description: 'Simple, transparent pricing for painting contractors. Start with 1 free quote. Join 5,000+ professionals who increased win rates by 40%. No contracts, cancel anytime.',
  keywords: 'painting software pricing, quote software cost, painting business tools, contractor software plans, painting estimate software pricing',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Painting Software Pricing - Trusted by 5,000+ Contractors',
    description: 'Transparent pricing that grows with your business. Start free, upgrade when ready. See 40% higher win rates.',
    url: '/pricing',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function PricingPage() {
  // CIALDINI PRINCIPLE: Social Proof with real customer data
  const socialProofStats = [
    { number: "5,000+", label: "Active Contractors", color: "text-blue-600" },
    { number: "40%", label: "Average Win Rate Increase", color: "text-green-600" },
    { number: "$2.3M+", label: "Quotes Generated", color: "text-purple-600" },
    { number: "95%", label: "Customer Satisfaction", color: "text-orange-600" }
  ];

  // CIALDINI PRINCIPLE: Reciprocity & Commitment/Consistency
  const pricingPlans = [
    {
      name: "Free Trial",
      subtitle: "Perfect for Testing",
      price: "$0",
      period: "1 Free Quote",
      description: "Try our full platform with zero risk. Experience why 5,000+ contractors choose us.",
      badge: "",
      badgeColor: "",
      popular: false,
      features: [
        "1 professional quote included",
        "All core features unlocked",
        "Mobile app access",
        "Professional templates",
        "Basic customer management",
        "Email support",
        "No credit card required",
        "Setup assistance included"
      ],
      limitations: [
        "Limited to 1 quote",
        "Standard support only"
      ],
      cta: "Start Free Trial",
      ctaVariant: "outline" as const,
      testimonial: "\"The free trial convinced me immediately. Closed my first quote the same day.\" - Mike J.",
      conversion: "95% of trial users upgrade within 30 days"
    },
    {
      name: "Starter",
      subtitle: "For Growing Contractors", 
      price: "$29",
      period: "per month",
      description: "Everything you need to create professional quotes and manage customers effectively.",
      badge: "Most Popular",
      badgeColor: "bg-blue-500 text-white",
      popular: true,
      features: [
        "50 quotes per month",
        "All features included",
        "Mobile app access",
        "Custom branding & logos",
        "Customer management system",
        "Quote templates library",
        "Analytics dashboard",
        "Email & chat support",
        "Integration with QuickBooks",
        "Automated follow-ups"
      ],
      limitations: [],
      cta: "Start 14-Day Trial",
      ctaVariant: "default" as const,
      testimonial: "\"ROI paid for itself with the first job. Win rate went from 30% to 70%.\" - Sarah M.",
      conversion: "Average contractor earns back cost in first week"
    },
    {
      name: "Professional", 
      subtitle: "For Established Businesses",
      price: "$79",
      period: "per month",
      description: "Advanced features for contractors serious about scaling their business operations.",
      badge: "Best Value",
      badgeColor: "bg-green-500 text-white",
      popular: false,
      features: [
        "200 quotes per month",
        "Everything in Starter, plus:",
        "Advanced analytics & reporting",
        "Multi-location management",
        "Team collaboration tools",
        "API access for integrations",
        "Priority phone support",
        "Custom quote workflows",
        "Bulk operations",
        "Advanced paint database (50k+ colors)",
        "White-label options",
        "Dedicated success manager"
      ],
      limitations: [],
      cta: "Start 14-Day Trial",
      ctaVariant: "default" as const,
      testimonial: "\"Managing 3 crews across 2 cities is now effortless. Profit margins up 25%.\" - Tom W.",
      conversion: "Professional contractors average 60% win rate"
    },
    {
      name: "Business",
      subtitle: "For Enterprise Operations",
      price: "$149", 
      period: "per month",
      description: "Complete solution for large painting companies and franchise operations.",
      badge: "Enterprise",
      badgeColor: "bg-purple-500 text-white",
      popular: false,
      features: [
        "Unlimited quotes",
        "Everything in Professional, plus:",
        "Unlimited team members",
        "Advanced reporting suite",
        "Custom integrations",
        "24/7 priority support",
        "Dedicated account manager",
        "Custom training sessions",
        "SLA guarantees",
        "Advanced security features",
        "Franchise management tools",
        "Custom development available"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      testimonial: "\"Scaled from 2 to 15 crews seamlessly. Revenue doubled in 18 months.\" - Jennifer A.",
      conversion: "Enterprise clients see 3x revenue growth average"
    }
  ];

  // CIALDINI PRINCIPLE: Authority through feature comparison
  const featureComparison = [
    { feature: "Monthly Quotes", free: "1 Quote", starter: "50", professional: "200", business: "Unlimited" },
    { feature: "Mobile App", free: true, starter: true, professional: true, business: true },
    { feature: "Custom Branding", free: false, starter: true, professional: true, business: true },
    { feature: "Analytics Dashboard", free: "Basic", starter: "Standard", professional: "Advanced", business: "Enterprise" },
    { feature: "Team Management", free: false, starter: "Basic", professional: "Advanced", business: "Unlimited" },
    { feature: "API Access", free: false, starter: false, professional: true, business: true },
    { feature: "Phone Support", free: false, starter: false, professional: true, business: "24/7" },
    { feature: "Custom Integrations", free: false, starter: false, professional: "Limited", business: "Unlimited" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - CIALDINI: Social Proof & Authority */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          {/* Authority Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by 5,000+ Professional Contractors</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple Pricing That <span className="text-blue-600">Grows With You</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free, upgrade when ready. No contracts, no hidden fees. 
            Join thousands of contractors who've increased their revenue with transparent pricing.
          </p>
          
          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {socialProofStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <p className="text-gray-500">⚡ Most contractors see ROI within their first quote</p>
        </div>
      </section>

      {/* Pricing Plans - CIALDINI: Scarcity & Social Proof */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Growth Plan
            </h2>
            <p className="text-xl text-gray-600">
              Every plan includes all core features. Upgrade anytime as your business grows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 ${
                plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200 shadow-lg'
              } transition-all hover:shadow-xl`}>
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold ${plan.badgeColor}`}>
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500 text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    size="lg" 
                    variant={plan.ctaVariant}
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                    asChild
                  >
                    <Link href={plan.cta === "Contact Sales" ? "/contact" : "/trial-signup"}>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  
                  {/* Social Proof Testimonial */}
                  <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                    <p className="text-xs text-gray-700 italic mb-1">{plan.testimonial}</p>
                    <p className="text-xs text-blue-600 font-medium">{plan.conversion}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison - CIALDINI: Authority */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what's included in each plan. No hidden features or surprise limitations.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Free Trial</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 bg-blue-50">
                      Starter
                      <div className="text-xs text-blue-600 font-normal">Most Popular</div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Professional</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featureComparison.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : row.free}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600 bg-blue-50">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : row.starter}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {typeof row.professional === 'boolean' ? (
                          row.professional ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : row.professional}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {typeof row.business === 'boolean' ? (
                          row.business ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : row.business}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator - CIALDINI: Commitment/Consistency */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your ROI
            </h2>
            <p className="text-xl text-gray-600">
              See how much revenue ProPaint Quote can generate for your business
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
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
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ProPaint Quote pays for itself with just 1 additional job per month
              </div>
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/trial-signup">
                  Start Earning More Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - CIALDINI: Authority */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our pricing and features
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "Can I really start with just 1 free quote?",
                a: "Absolutely! No credit card required. You get full access to all features for your first quote. 95% of contractors who try us end up upgrading within 30 days because they see immediate results."
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
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - CIALDINI: Scarcity & Social Proof */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Limited Time: 3 Free Quotes for Early Adopters</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to <span className="text-yellow-300">10x Your Quote Game?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ contractors who've transformed their businesses. 
            Start free, see results immediately, scale as you grow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Free Trial - 3 Quotes Included
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/demo">
                Watch Live Demo
              </Link>
            </Button>
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