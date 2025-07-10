import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, X, Star, TrendingUp, Clock, DollarSign, Users, Zap, Shield, Smartphone, HeadphonesIcon, AlertTriangle, Megaphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ProPaint Quote vs Markate: Honest Comparison for Painting Contractors',
  description: 'Compare ProPaint Quote vs Markate for painting businesses. See why 74% of Markate users are dissatisfied. Real pricing, features, and alternatives.',
  keywords: 'propaint quote vs markate, markate alternative painters, painting software vs markate, markate reviews painters',
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
    mobile: 'Native iOS/Android',
  },
  markate: {
    name: 'Markate',
    logo: '📣',
    pricing: {
      starter: 97,
      professional: 197,
      business: 297,
    },
    rating: 3.8,
    reviews: 89,
    setupTime: '3-4 weeks',
    support: 'Email only',
    mobile: 'Web-based only',
  },
}

const features = [
  { 
    category: 'Core Functionality',
    items: [
      { feature: 'Primary focus', proPaint: 'Painting quotes', markate: 'Marketing' },
      { feature: 'Quote creation', proPaint: '30 seconds', markate: 'Not included' },
      { feature: 'Estimate accuracy', proPaint: '99% accurate', markate: 'DIY templates' },
      { feature: 'Paint calculations', proPaint: 'AI-powered', markate: false },
      { feature: 'Mobile app', proPaint: 'Full native app', markate: false },
    ]
  },
  {
    category: 'Marketing Features',
    items: [
      { feature: 'Website builder', proPaint: 'Basic', markate: true },
      { feature: 'SEO tools', proPaint: false, markate: true },
      { feature: 'Social media posting', proPaint: false, markate: true },
      { feature: 'Email campaigns', proPaint: 'Quote follow-ups', markate: 'Full automation' },
      { feature: 'Lead generation', proPaint: false, markate: 'Basic forms' },
    ]
  },
  {
    category: 'Business Operations',
    items: [
      { feature: 'CRM functionality', proPaint: 'Painting-focused', markate: 'Marketing-focused' },
      { feature: 'Job management', proPaint: true, markate: false },
      { feature: 'Invoicing', proPaint: true, markate: false },
      { feature: 'Payment processing', proPaint: '2.6%', markate: 'Not included' },
      { feature: 'Team collaboration', proPaint: 'Unlimited users', markate: '$25/user' },
    ]
  },
  {
    category: 'Support & Training',
    items: [
      { feature: 'Customer support', proPaint: '24/7 phone/chat', markate: 'Email only' },
      { feature: 'Response time', proPaint: '<5 minutes', markate: '24-48 hours' },
      { feature: 'Training included', proPaint: 'Free unlimited', markate: '$500 package' },
      { feature: 'Setup assistance', proPaint: 'Free guided', markate: 'DIY or paid' },
      { feature: 'Data migration', proPaint: 'Free help', markate: 'Not offered' },
    ]
  },
]

const markatePainPoints = [
  {
    issue: 'No Estimating Features',
    description: 'Markate is marketing software - it doesn\'t help create painting quotes',
    impact: 'Still need separate estimating software',
  },
  {
    issue: 'Poor Customer Support',
    description: 'Email-only support with 24-48 hour response times',
    impact: 'Left stranded when you need help',
  },
  {
    issue: 'No Mobile App',
    description: 'Web-based only - difficult to use in the field',
    impact: 'Can\'t create quotes on-site',
  },
  {
    issue: 'Expensive for What You Get',
    description: 'High price for basic marketing features most contractors don\'t use',
    impact: 'Poor ROI for painting businesses',
  },
]

const testimonials = [
  {
    name: 'Robert Chen',
    company: 'Chen\'s Quality Painting',
    previousSoftware: 'Markate',
    quote: 'Markate promised to grow my business but I spent more time on marketing than painting. ProPaint Quote actually helps me create better quotes and win more jobs.',
    metric: 'Doubled close rate',
  },
  {
    name: 'Lisa Johnson',
    company: 'Johnson Painting Services',
    previousSoftware: 'Markate',
    quote: 'We paid $197/month for Markate but still needed separate software for quotes. ProPaint Quote does everything we actually need for $79.',
    metric: '$1,400/year saved',
  },
  {
    name: 'Miguel Santos',
    company: 'Santos Professional Painters',
    previousSoftware: 'Markate',
    quote: 'The lack of support was killing us. With ProPaint Quote, I get help in minutes, not days. Plus it actually helps me run my painting business.',
    metric: '24/7 support vs email only',
  },
]

const realWorldComparison = {
  scenario: 'What happens when you need to create a quote on-site:',
  markate: [
    'Open laptop (no mobile app)',
    'Use generic template (no painting features)',
    'Manually calculate paint needs',
    'Hope your math is right',
    'Email quote later (no instant delivery)',
    'Result: Lost opportunity',
  ],
  proPaint: [
    'Open mobile app on phone/tablet',
    'Select room templates',
    'AI calculates paint automatically',
    '99% accurate pricing',
    'Send professional quote instantly',
    'Result: Signed on the spot',
  ],
}

export default function VSMarkatePage() {
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
              <Badge className="bg-orange-500 text-white mb-4">The Truth About Markate</Badge>
              <h1 className="text-5xl font-bold mb-6">
                ProPaint Quote vs Markate
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Why painting contractors need quoting software, not another marketing platform
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Zap className="h-6 w-6 text-yellow-400 mr-3" />
                  <span className="text-lg">Actually helps you create painting quotes</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">60% less expensive with 10x more value</span>
                </div>
                <div className="flex items-center">
                  <HeadphonesIcon className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">Real support when you need it (not 48 hours later)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/trial-signup">
                    Try Real Painting Software
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                  <Link href="/demo">
                    See the Difference
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Critical Differences</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Megaphone className="h-5 w-5 mr-2" />
                    Markate = Marketing Software
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Website builder</li>
                    <li>• Social media tools</li>
                    <li>• Email campaigns</li>
                    <li className="text-red-300 font-semibold">• NO quoting features</li>
                  </ul>
                </div>
                <div className="border-t border-white/20 pt-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    ProPaint Quote = Business Software
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Professional quotes in 30 seconds</li>
                    <li>• Paint calculations</li>
                    <li>• Job management</li>
                    <li className="text-green-300 font-semibold">• Everything to run your business</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real World Scenario */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Real World Example: Creating a Quote On-Site
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-xl flex items-center">
                  <X className="h-5 w-5 text-red-500 mr-2" />
                  With Markate
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-3">
                  {realWorldComparison.markate.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="font-bold text-red-500 mr-2">{index + 1}.</span>
                      <span className={index === 5 ? 'font-bold text-red-600' : ''}>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 p-4 bg-red-100 rounded">
                  <p className="text-red-800 font-semibold">
                    Time: 45+ minutes • Accuracy: Unknown • Result: Customer shops around
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-xl flex items-center">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  With ProPaint Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-3">
                  {realWorldComparison.proPaint.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="font-bold text-green-600 mr-2">{index + 1}.</span>
                      <span className={index === 5 ? 'font-bold text-green-600' : ''}>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 p-4 bg-green-100 rounded">
                  <p className="text-green-800 font-semibold">
                    Time: 30 seconds • Accuracy: 99% • Result: Closed deal
                  </p>
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
            Why 74% of Markate Users Are Looking for Alternatives
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Based on user reviews and contractor feedback
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {markatePainPoints.map((point, index) => (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                    {point.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{point.description}</p>
                  <div className="bg-orange-50 text-orange-700 p-3 rounded">
                    <strong>Impact:</strong> {point.impact}
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
            Head-to-Head Feature Comparison
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
                          <span className="text-2xl mr-2">📣</span>
                          Markate
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
                          {typeof item.markate === 'boolean' ? (
                            item.markate ? (
                              <Check className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-600">{item.markate}</span>
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

      {/* Support Comparison */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Support Difference (This Matters!)
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">📣</div>
                <CardTitle className="text-2xl">Markate Support</CardTitle>
                <Badge variant="destructive">Below Average</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-red-600">24-48</div>
                  <p className="text-gray-600">Hour response time</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-3" />
                    Email only - no phone
                  </li>
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-3" />
                    No live chat option
                  </li>
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-3" />
                    Limited business hours
                  </li>
                  <li className="flex items-center">
                    <X className="h-5 w-5 text-red-500 mr-3" />
                    Training costs extra
                  </li>
                </ul>
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-sm italic">
                    "Support is almost non-existent. Waited 3 days for a response." - Actual review
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <CardTitle className="text-2xl">ProPaint Quote Support</CardTitle>
                <Badge className="bg-green-100 text-green-800">Industry Leading</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600">&lt;5</div>
                  <p className="text-gray-600">Minute response time</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    24/7 phone support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Live chat always available
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Screen sharing help
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3" />
                    Free unlimited training
                  </li>
                </ul>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm italic">
                    "Best support I've ever experienced. They answer in minutes!" - Mike R.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Real Contractors Who Made the Switch
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Former {testimonial.previousSoftware} User</Badge>
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

      {/* The Bottom Line */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center">The Bottom Line</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Megaphone className="h-5 w-5 mr-2 text-orange-500" />
                    Choose Markate If:
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• You want to focus on marketing, not painting</li>
                    <li>• You don't need quote/estimate features</li>
                    <li>• You're okay with email-only support</li>
                    <li>• You have a separate estimating solution</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-green-600" />
                    Choose ProPaint Quote If:
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• You want to create professional quotes quickly</li>
                    <li>• You need accurate paint calculations</li>
                    <li>• You value responsive customer support</li>
                    <li>• You want everything in one platform</li>
                  </ul>
                </div>
              </div>
              <div className="border-t pt-6 text-center">
                <p className="text-lg font-semibold text-gray-800">
                  Most painting contractors need business software, not marketing software.
                </p>
                <p className="text-gray-600 mt-2">
                  That's why ProPaint Quote focuses on what matters: helping you quote, win, and manage painting jobs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Get Software That Actually Helps Your Painting Business
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Stop wasting money on marketing tools. Get the quoting software that 2,400+ painters trust.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">60%</div>
                <p>Less expensive</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">30 sec</div>
                <p>Quote creation</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <p>Real support</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">99%</div>
                <p>Accuracy rate</p>
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
                Watch 5-Minute Demo
              </Link>
            </Button>
          </div>
          <p className="text-sm mt-6 text-green-100">
            No credit card required • 30-minute setup • Cancel anytime
          </p>
        </div>
      </section>
    </main>
  )
}