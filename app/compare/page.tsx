import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, X, Zap, Users, DollarSign, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Compare ProPaint Quote vs Other Painting Software | 2025 Comparison',
  description: 'Compare ProPaint Quote with Jobber, Housecall Pro, Markate, and other painting contractor software. See feature comparisons, pricing, and why contractors are switching.',
  keywords: 'painting software comparison, propaint quote vs jobber, painting estimate software comparison, contractor software comparison',
}

const competitors = [
  {
    name: 'Jobber',
    slug: 'jobber',
    description: 'General field service software adapted for painting',
    monthlyPrice: '$149',
    rating: '4.2',
    prosCount: 5,
    consCount: 3,
    switchingRate: '67%',
    mainIssues: ['Not painting-specific', 'Complex pricing', 'Limited painting features'],
  },
  {
    name: 'Housecall Pro',
    slug: 'housecall-pro',
    description: 'Home service software with basic painting features',
    monthlyPrice: '$129',
    rating: '4.0',
    prosCount: 4,
    consCount: 4,
    switchingRate: '71%',
    mainIssues: ['Generic templates', 'No paint calculations', 'Expensive add-ons'],
  },
  {
    name: 'Markate',
    slug: 'markate',
    description: 'Marketing-focused contractor software',
    monthlyPrice: '$97',
    rating: '3.8',
    prosCount: 3,
    consCount: 5,
    switchingRate: '74%',
    mainIssues: ['Weak estimating', 'No mobile app', 'Limited support'],
  },
  {
    name: 'PaintScout',
    slug: 'paintscout',
    description: 'Basic painting estimate software',
    monthlyPrice: '$89',
    rating: '3.5',
    prosCount: 2,
    consCount: 6,
    switchingRate: '82%',
    mainIssues: ['Outdated interface', 'No CRM features', 'Desktop only'],
  },
]

const keyDifferentiators = [
  {
    icon: Zap,
    title: 'Built Exclusively for Painters',
    description: 'Not adapted from generic software - every feature designed for painting contractors',
  },
  {
    icon: DollarSign,
    title: '47% Lower Total Cost',
    description: 'No hidden fees, no per-user charges, no setup costs. Just simple, fair pricing.',
  },
  {
    icon: Users,
    title: '3x Faster Adoption',
    description: 'Your crew will actually use it. Average onboarding time: 30 minutes.',
  },
  {
    icon: Shield,
    title: '99% Accurate Estimates',
    description: 'AI-powered calculations eliminate costly mistakes and protect your profits.',
  },
]

export default function CompareHubPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Compare ProPaint Quote to Other Software
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              See why 2,400+ painting contractors switched to ProPaint Quote in 2024
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
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
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">67-82%</div>
              <p className="text-sm text-gray-600 mt-1">Competitors' customers looking to switch</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">$2,847</div>
              <p className="text-sm text-gray-600 mt-1">Average monthly savings</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">30 min</div>
              <p className="text-sm text-gray-600 mt-1">Setup time vs 2-3 weeks</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">4.9/5</div>
              <p className="text-sm text-gray-600 mt-1">Customer satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why ProPaint Quote Wins Every Comparison
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyDifferentiators.map((diff, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <diff.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{diff.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{diff.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison Cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Detailed Software Comparisons
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {competitors.map((competitor) => (
              <Card key={competitor.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">
                        ProPaint Quote vs {competitor.name}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {competitor.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Their price</div>
                      <div className="text-2xl font-bold text-red-600">{competitor.monthlyPrice}/mo</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <span className="font-semibold">{competitor.rating}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customers Want to Switch</span>
                    <span className="font-semibold text-red-600">{competitor.switchingRate}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Main Complaints:</p>
                    <ul className="text-sm space-y-1">
                      {competitor.mainIssues.map((issue, idx) => (
                        <li key={idx} className="flex items-start">
                          <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        <span className="font-medium">{competitor.prosCount} Pros</span>
                      </span>
                      <span className="flex items-center">
                        <X className="h-4 w-4 text-red-500 mr-1" />
                        <span className="font-medium">{competitor.consCount} Cons</span>
                      </span>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/compare/vs-${competitor.slug}`}>
                        Full Comparison
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Quick Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">ProPaint Quote</th>
                  <th className="text-center p-4">Jobber</th>
                  <th className="text-center p-4">Housecall Pro</th>
                  <th className="text-center p-4">Others</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Paint-Specific Calculators', true, false, false, false],
                  ['30-Second Quotes', true, false, false, false],
                  ['AI Accuracy Engine', true, false, false, false],
                  ['No Per-User Fees', true, false, false, true],
                  ['Mobile-First Design', true, true, true, false],
                  ['Instant Setup', true, false, false, false],
                  ['24/7 Support', true, false, true, false],
                  ['Free Training', true, false, false, false],
                ].map(([feature, ...values], idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-4 font-medium">{feature}</td>
                    {values.map((value, vIdx) => (
                      <td key={vIdx} className="p-4 text-center">
                        {value ? (
                          <Check className="h-5 w-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container mx-auto max-w-4xl text-center">
          <blockquote className="text-xl italic text-gray-700 mb-4">
            "We tried Jobber, Housecall Pro, and two others before finding ProPaint Quote. 
            The difference is night and day. Finally, software that understands painting!"
          </blockquote>
          <cite className="text-gray-600">
            - Mike Rodriguez, MR Painting Services (150+ projects/year)
          </cite>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join 2,400+ Contractors Who Made the Switch
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Free 14-day trial. No credit card required. Full data import from your current software.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-green-700 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              <Link href="/demo">
                Schedule Demo
              </Link>
            </Button>
          </div>
          <p className="text-sm mt-6 text-green-100">
            Average setup time: 30 minutes • Free migration assistance included
          </p>
        </div>
      </section>
    </main>
  )
}