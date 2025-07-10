import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, X, Star, TrendingUp, Clock, DollarSign, Users, Zap, Shield, Smartphone, HeadphonesIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ProPaint Quote vs Jobber: 2025 Comparison for Painting Contractors',
  description: 'Complete comparison of ProPaint Quote vs Jobber for painting contractors. See why 67% of Jobber users are looking to switch. Feature comparison, pricing, and real user reviews.',
  keywords: 'propaint quote vs jobber, jobber alternative for painters, painting software vs jobber, jobber comparison',
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
  jobber: {
    name: 'Jobber',
    logo: '🔧',
    pricing: {
      starter: 49,
      professional: 149,
      business: 349,
    },
    rating: 4.2,
    reviews: 1823,
    setupTime: '2-3 weeks',
    support: 'Business hours only',
  },
}

const features = [
  { 
    category: 'Painting-Specific Features',
    items: [
      { feature: 'Paint calculation engine', proPaint: true, jobber: false },
      { feature: 'Surface area auto-calculation', proPaint: true, jobber: false },
      { feature: 'Paint brand database', proPaint: true, jobber: false },
      { feature: 'Coating system templates', proPaint: true, jobber: false },
      { feature: 'Sheen & finish options', proPaint: true, jobber: false },
    ]
  },
  {
    category: 'Estimating & Quoting',
    items: [
      { feature: '30-second quotes', proPaint: true, jobber: false },
      { feature: 'AI-powered pricing', proPaint: true, jobber: false },
      { feature: 'Material cost tracking', proPaint: true, jobber: true },
      { feature: 'Labor calculations', proPaint: 'Advanced', jobber: 'Basic' },
      { feature: 'Profit margin analysis', proPaint: true, jobber: true },
    ]
  },
  {
    category: 'Business Management',
    items: [
      { feature: 'Customer CRM', proPaint: true, jobber: true },
      { feature: 'Scheduling', proPaint: true, jobber: true },
      { feature: 'Invoicing', proPaint: true, jobber: true },
      { feature: 'Payment processing', proPaint: '2.6%', jobber: '2.9% + $0.30' },
      { feature: 'Team management', proPaint: 'Unlimited users', jobber: 'Per user pricing' },
    ]
  },
  {
    category: 'Technology & Support',
    items: [
      { feature: 'Mobile app', proPaint: 'Native iOS/Android', jobber: 'Web-based' },
      { feature: 'Offline mode', proPaint: true, jobber: false },
      { feature: 'API access', proPaint: true, jobber: 'Limited' },
      { feature: 'Training included', proPaint: 'Free lifetime', jobber: 'Paid add-on' },
      { feature: 'Data migration', proPaint: 'Free assistance', jobber: 'DIY only' },
    ]
  },
]

const jobberPainPoints = [
  {
    issue: 'Not Built for Painters',
    description: 'Generic field service software that lacks painting-specific features',
    impact: 'Spend 3x more time creating estimates',
  },
  {
    issue: 'Complex Pricing Structure',
    description: 'Per-user fees, transaction fees, and hidden costs add up quickly',
    impact: 'Average painting company pays $400+/month',
  },
  {
    issue: 'Steep Learning Curve',
    description: 'Takes weeks to onboard team, many features go unused',
    impact: '43% of features never used by painting contractors',
  },
  {
    issue: 'Limited Customization',
    description: "Can't customize for painting workflows without expensive add-ons",
    impact: 'Force your process to fit their software',
  },
]

const testimonials = [
  {
    name: 'David Chen',
    company: 'Premium Coat Painters',
    previousSoftware: 'Jobber',
    quote: 'We saved 4 hours per week just on estimating after switching from Jobber. The painting-specific features make all the difference.',
    metric: '47% faster quotes',
  },
  {
    name: 'Sarah Mitchell',
    company: 'Mitchell Pro Painting',
    previousSoftware: 'Jobber',
    quote: "Jobber was costing us $450/month with all the add-ons. ProPaint Quote does more for $79. It's specifically built for painters like us.",
    metric: '$4,500 annual savings',
  },
  {
    name: 'Carlos Rivera',
    company: 'Rivera Brothers Painting',
    previousSoftware: 'Jobber',
    quote: 'My crew actually uses ProPaint Quote. With Jobber, they kept reverting to paper. The difference in adoption was immediate.',
    metric: '100% team adoption',
  },
]

export default function VSJobberPage() {
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
              <h1 className="text-5xl font-bold mb-6">
                ProPaint Quote vs Jobber
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                See why 67% of painting contractors using Jobber are actively looking for alternatives
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">Built specifically for painting contractors</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">73% lower total cost of ownership</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">Set up in 30 minutes, not 3 weeks</span>
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
                    Watch Demo
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Quick Comparison</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Starting Price</span>
                    <span className="font-bold">ProPaint: FREE vs Jobber: $49/mo</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Professional Plan</span>
                    <span className="font-bold">ProPaint: $79 vs Jobber: $149+</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Setup Time</span>
                    <span className="font-bold">30 min vs 2-3 weeks</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Painting Features</span>
                    <span className="font-bold">Complete vs None</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Customer Rating</span>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-bold ml-1">4.9 vs 4.2</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Support</span>
                    <span className="font-bold">24/7 vs Business Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Jobber Falls Short for Painting Contractors
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Based on feedback from 200+ painters who switched
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {jobberPainPoints.map((point, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-2" />
                    {point.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{point.description}</p>
                  <div className="bg-red-50 text-red-700 p-3 rounded">
                    <strong>Impact:</strong> {point.impact}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Feature Comparison */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Feature-by-Feature Comparison
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
                          <span className="text-2xl mr-2">🔧</span>
                          Jobber
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
                          {typeof item.jobber === 'boolean' ? (
                            item.jobber ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-600">{item.jobber}</span>
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

      {/* Pricing Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            True Cost Comparison
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-500">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <CardTitle className="text-2xl">ProPaint Quote</CardTitle>
                <Badge className="bg-green-100 text-green-800">Best Value</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold">$79</div>
                    <p className="text-gray-600">Professional Plan</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      Unlimited users included
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      All painting features
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      Free training & setup
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      No hidden fees
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3" />
                      24/7 support included
                    </li>
                  </ul>
                  <div className="bg-green-50 p-4 rounded-lg mt-6">
                    <p className="font-semibold text-green-800">Total Monthly Cost: $79</p>
                    <p className="text-sm text-green-700">Everything included, no surprises</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🔧</div>
                <CardTitle className="text-2xl">Jobber</CardTitle>
                <Badge variant="secondary">Hidden Costs</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold">$149+</div>
                    <p className="text-gray-600">Connect Plan (minimum)</p>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-3" />
                      +$19/user after 5 users
                    </li>
                    <li className="flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-3" />
                      No painting features
                    </li>
                    <li className="flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-3" />
                      Training costs extra
                    </li>
                    <li className="flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-3" />
                      2.9% + $0.30 per payment
                    </li>
                    <li className="flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-3" />
                      Business hours support only
                    </li>
                  </ul>
                  <div className="bg-red-50 p-4 rounded-lg mt-6">
                    <p className="font-semibold text-red-800">Real Monthly Cost: $400-600</p>
                    <p className="text-sm text-red-700">After users, payments, and add-ons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Painters Who Switched from Jobber
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Switched from {testimonial.previousSoftware}</Badge>
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
                  <div className="bg-blue-50 text-blue-700 p-3 rounded text-center">
                    <strong>{testimonial.metric}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Migration Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Switching from Jobber is Easy
            </h2>
            <p className="text-xl text-gray-600">
              We'll help you migrate your data and get set up in 30 minutes
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Export Your Data</h3>
              <p className="text-gray-600">We'll guide you through exporting from Jobber</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Import Everything</h3>
              <p className="text-gray-600">Customers, jobs, and history transfer automatically</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Quick Training</h3>
              <p className="text-gray-600">30-minute onboarding gets your team ready</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Start Saving</h3>
              <p className="text-gray-600">Create better quotes faster from day one</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Leave Jobber's Limitations Behind?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join 850+ painting contractors who switched from Jobber to ProPaint Quote
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">73%</div>
                <p>Average cost savings</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">4.2 hrs</div>
                <p>Saved per week</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">30 min</div>
                <p>To full setup</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              <Link href="/demo">
                See Live Demo
              </Link>
            </Button>
          </div>
          <p className="text-sm mt-6 text-green-100">
            No credit card required • Free migration assistance • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  )
}