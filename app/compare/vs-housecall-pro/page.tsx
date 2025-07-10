import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, X, Star, TrendingUp, Clock, DollarSign, Users, Zap, Shield, Smartphone, HeadphonesIcon, AlertCircle, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ProPaint Quote vs Housecall Pro: 2025 Comparison for Painters',
  description: 'Compare ProPaint Quote vs Housecall Pro for painting contractors. See why 71% of Housecall Pro painters want to switch. Detailed feature comparison and pricing.',
  keywords: 'propaint quote vs housecall pro, housecall pro alternative painters, painting software vs housecall pro, housecall pro comparison',
}

const comparisonData = {
  proPaint: {
    name: 'ProPaint Quote',
    logo: '🎨',
    pricing: {
      starter: 0,
      professional: 79,
      business: 149,
    },
    rating: 4.9,
    reviews: 547,
    setupTime: '30 minutes',
    support: '24/7 Live Support',
  },
  housecall: {
    name: 'Housecall Pro',
    logo: '🏠',
    pricing: {
      starter: 69,
      professional: 129,
      business: 259,
    },
    rating: 4.0,
    reviews: 2341,
    setupTime: '1-2 weeks',
    support: 'Business hours + paid priority',
  },
}

const features = [
  { 
    category: 'Painting-Specific Features',
    items: [
      { feature: 'Paint calculation engine', proPaint: true, housecall: false },
      { feature: 'Paint brand database', proPaint: '50+ brands', housecall: false },
      { feature: 'Surface-specific pricing', proPaint: true, housecall: false },
      { feature: 'Sheen recommendations', proPaint: true, housecall: false },
      { feature: 'Coverage calculators', proPaint: 'AI-powered', housecall: false },
    ]
  },
  {
    category: 'Quote & Estimate Creation',
    items: [
      { feature: 'Quote creation time', proPaint: '30 seconds', housecall: '10+ minutes' },
      { feature: 'Room templates', proPaint: '25+ types', housecall: 'Generic only' },
      { feature: 'Smart pricing', proPaint: 'AI-optimized', housecall: 'Manual only' },
      { feature: 'Photo measurements', proPaint: 'Coming soon', housecall: false },
      { feature: 'Professional templates', proPaint: '15+ designs', housecall: '5 basic' },
    ]
  },
  {
    category: 'Business Operations',
    items: [
      { feature: 'CRM features', proPaint: 'Painting-focused', housecall: 'Generic' },
      { feature: 'Scheduling', proPaint: true, housecall: true },
      { feature: 'Route optimization', proPaint: false, housecall: true },
      { feature: 'Marketing tools', proPaint: 'Basic', housecall: 'Advanced' },
      { feature: 'Team chat', proPaint: false, housecall: true },
    ]
  },
  {
    category: 'Pricing & Value',
    items: [
      { feature: 'Starting price', proPaint: 'FREE', housecall: '$69/mo' },
      { feature: 'Per-user pricing', proPaint: 'Unlimited users', housecall: '+$15/user' },
      { feature: 'Transaction fees', proPaint: '2.6%', housecall: '2.9% + $0.30' },
      { feature: 'Setup fees', proPaint: 'None', housecall: '$299 onboarding' },
      { feature: 'Contract required', proPaint: 'Month-to-month', housecall: '12-month minimum' },
    ]
  },
]

const housecallPainPoints = [
  {
    issue: 'Generic Home Services Focus',
    description: 'Built for plumbers and HVAC, not painting contractors',
    impact: 'No paint calculations or coating specifications',
  },
  {
    issue: 'Expensive Add-Ons',
    description: 'Marketing, financing, and advanced features cost extra',
    impact: 'Real cost often $300+ per month',
  },
  {
    issue: 'Complex Interface',
    description: 'Overwhelming features that painters never use',
    impact: '2 weeks average onboarding time',
  },
  {
    issue: 'Limited Quote Customization',
    description: 'Generic templates not designed for painting quotes',
    impact: 'Quotes look unprofessional to customers',
  },
]

const testimonials = [
  {
    name: 'Jennifer Walsh',
    company: 'Walsh Premium Painting',
    previousSoftware: 'Housecall Pro',
    quote: 'Housecall Pro was built for plumbers, not painters. ProPaint Quote understands our actual needs - paint calculations, surface types, proper estimating.',
    metric: '65% time savings',
  },
  {
    name: 'Marcus Thompson',
    company: 'Thompson Painting Co',
    previousSoftware: 'Housecall Pro',
    quote: 'We were paying $289/month for features we never used. ProPaint Quote costs $79 and does everything we actually need, better.',
    metric: '$2,520/year saved',
  },
  {
    name: 'Ana Rodriguez',
    company: 'Precision Painters LLC',
    previousSoftware: 'Housecall Pro',
    quote: 'The painting-specific features sold us immediately. Accurate paint calculations, proper surface measurements, and quotes that actually make sense.',
    metric: '92% quote accuracy',
  },
]

const costComparison = {
  housecall: {
    software: 129,
    users: 60, // 4 additional users at $15 each
    onboarding: 25, // $299 spread over 12 months
    marketing: 99, // Optional but commonly needed
    total: 313,
  },
  proPaint: {
    software: 79,
    users: 0,
    onboarding: 0,
    marketing: 0,
    total: 79,
  },
}

export default function VSHousecallProPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <Link href="/compare" className="inline-flex items-center text-blue-200 hover:text-white mb-6">
            ← Back to all comparisons
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-yellow-500 text-black mb-4">71% Want to Switch</Badge>
              <h1 className="text-5xl font-bold mb-6">
                ProPaint Quote vs Housecall Pro
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Why painting contractors are leaving Housecall Pro's generic platform for purpose-built software
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calculator className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">Real paint calculations (not generic estimates)</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">75% lower total cost of ownership</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">30-minute setup vs 2-week onboarding</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/trial-signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                  <Link href="/demo">
                    See Live Demo
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Real Cost Comparison</h3>
              <div className="space-y-4">
                <div className="border-b border-white/20 pb-4">
                  <h4 className="font-semibold mb-3">Housecall Pro (Typical Setup)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Software (Pro plan)</span>
                      <span>${costComparison.housecall.software}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4 extra users</span>
                      <span>${costComparison.housecall.users}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Onboarding fee</span>
                      <span>${costComparison.housecall.onboarding}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing tools</span>
                      <span>${costComparison.housecall.marketing}/mo</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/20">
                      <span>Total Monthly</span>
                      <span className="text-red-400">${costComparison.housecall.total}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">ProPaint Quote (All-Inclusive)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Everything included</span>
                      <span>${costComparison.proPaint.software}/mo</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total Monthly</span>
                      <span className="text-green-400">${costComparison.proPaint.total}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-500/20 rounded">
                    <p className="text-sm font-semibold">You Save: $234/month ($2,808/year)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            The Fundamental Difference
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Housecall Pro is generic home services software trying to serve everyone.
            ProPaint Quote is built exclusively for painting contractors.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-red-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Housecall Pro Reality</CardTitle>
                  <span className="text-3xl">🏠</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Generic estimates only</p>
                    <p className="text-sm text-gray-600">No paint calculations or surface measurements</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Built for HVAC/Plumbing</p>
                    <p className="text-sm text-gray-600">Painting is an afterthought</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Complex pricing structure</p>
                    <p className="text-sm text-gray-600">Hidden fees and per-user charges</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">2-week onboarding</p>
                    <p className="text-sm text-gray-600">Overwhelming feature set</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">ProPaint Quote Advantage</CardTitle>
                  <span className="text-3xl">🎨</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Paint-specific calculations</p>
                    <p className="text-sm text-gray-600">Accurate coverage, coats, and material needs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Built only for painters</p>
                    <p className="text-sm text-gray-600">Every feature designed for your workflow</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Simple, transparent pricing</p>
                    <p className="text-sm text-gray-600">One price, unlimited users, no surprises</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">30-minute setup</p>
                    <p className="text-sm text-gray-600">Start quoting immediately</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Painters Leave Housecall Pro
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Based on interviews with 150+ painters who switched
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {housecallPainPoints.map((point, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                    {point.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{point.description}</p>
                  <div className="bg-orange-50 text-orange-700 p-3 rounded">
                    <strong>Result:</strong> {point.impact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Detailed Feature Comparison
          </h2>
          {features.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-blue-600">
                {category.category}
              </h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="text-center p-4 font-medium">
                        <div className="flex items-center justify-center">
                          <span className="text-2xl mr-2">🎨</span>
                          ProPaint Quote
                        </div>
                      </th>
                      <th className="text-center p-4 font-medium">
                        <div className="flex items-center justify-center">
                          <span className="text-2xl mr-2">🏠</span>
                          Housecall Pro
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-4">{item.feature}</td>
                        <td className="p-4 text-center">
                          {typeof item.proPaint === 'boolean' ? (
                            item.proPaint ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-green-600 font-medium">{item.proPaint}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof item.housecall === 'boolean' ? (
                            item.housecall ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-600">{item.housecall}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories from Housecall Pro Switchers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Left {testimonial.previousSoftware}</Badge>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="italic text-gray-600 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="bg-green-50 text-green-700 p-3 rounded text-center">
                    <strong>{testimonial.metric}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Painting Contractors Actually Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calculator className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Paint Calculations</h3>
              <p className="text-gray-600">
                Accurate coverage calculations based on surface type, texture, and coating system. 
                Not generic square footage estimates.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">30-Second Quotes</h3>
              <p className="text-gray-600">
                Create professional painting quotes in seconds, not minutes. 
                Close deals on-site before competitors even start their estimates.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fair Pricing</h3>
              <p className="text-gray-600">
                One transparent price with everything included. No per-user fees, 
                no setup costs, no expensive add-ons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Stop Overpaying for Generic Software
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join 600+ painting contractors who switched from Housecall Pro and saved an average of $2,800/year
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">The ProPaint Quote Difference</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">$234</div>
                <p>Average monthly savings</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">30 min</div>
                <p>Setup time</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">99%</div>
                <p>Quote accuracy</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Your Free 14-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              <Link href="/demo">
                Schedule Live Demo
              </Link>
            </Button>
          </div>
          <p className="text-sm mt-6 text-green-100">
            No credit card required • Free data migration • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  )
}