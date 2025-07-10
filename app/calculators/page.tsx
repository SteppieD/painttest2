'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Building2, Briefcase, Palette, ArrowRight, Calculator } from 'lucide-react'

const calculators = [
  {
    id: 'interior',
    title: 'Interior Painting Calculator',
    description: 'Calculate costs for walls, ceilings, and trim in any room. Perfect for bedrooms, living rooms, and whole-house projects.',
    icon: Home,
    href: '/calculators/interior-painting',
    color: 'blue',
    features: ['Room dimensions', 'Multiple surfaces', 'Paint quality options', 'Labor estimates'],
    popularUse: 'Most Popular'
  },
  {
    id: 'exterior',
    title: 'Exterior Painting Calculator',
    description: 'Estimate house painting costs including siding, trim, soffits, and fascia. Weather-adjusted pricing included.',
    icon: Building2,
    href: '/calculators/exterior-painting',
    color: 'sky',
    features: ['House dimensions', 'Surface conditions', 'Multi-story options', 'Weather factors'],
    popularUse: 'Homeowners'
  },
  {
    id: 'commercial',
    title: 'Commercial Painting Calculator',
    description: 'Professional estimates for offices, warehouses, retail spaces, and large buildings with flexible scheduling.',
    icon: Briefcase,
    href: '/calculators/commercial-painting',
    color: 'slate',
    features: ['Building types', 'After-hours rates', 'Volume pricing', 'Floor coatings'],
    popularUse: 'Contractors'
  },
  {
    id: 'cabinet',
    title: 'Cabinet Painting Calculator',
    description: 'Transform kitchens and bathrooms with cabinet refinishing. Get quotes for professional cabinet painting.',
    icon: Palette,
    href: '/calculators/cabinet-painting',
    color: 'purple',
    features: ['Door/drawer count', 'Finish types', 'Primer options', 'Kitchen/bath specific'],
    popularUse: 'Renovations'
  }
]

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Calculator className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional Painting Calculators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get accurate painting estimates in 30 seconds. Choose your project type below 
            to calculate material costs, labor time, and total project pricing.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {calculators.map((calc) => {
            const Icon = calc.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
              sky: 'bg-sky-100 text-sky-600 hover:bg-sky-200',
              slate: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }
            const bgColor = colorClasses[calc.color as keyof typeof colorClasses]

            return (
              <Card key={calc.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                {calc.popularUse && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {calc.popularUse}
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg ${bgColor} flex items-center justify-center mb-4 transition-colors`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl">{calc.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Calculator Features:</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {calc.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={calc.href}>
                    <Button className="w-full group">
                      Open Calculator
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Section */}
        <section className="mb-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Use Our Painting Calculators?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get detailed estimates in 30 seconds, not hours of manual calculations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">95% Accuracy</h3>
              <p className="text-gray-600">
                Based on real contractor data and industry-standard formulas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Pricing</h3>
              <p className="text-gray-600">
                Includes materials, labor, supplies, and proper profit margins
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">
            Convert Estimates into Professional Quotes
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our calculators are free to use. Want to create beautiful, branded quotes 
            that win more jobs? Try ProPaint Quote free for 14 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.location.href = '/trial-signup'}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/demo'}
            >
              Watch Demo
            </Button>
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">About Our Painting Calculators</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                ProPaint Quote's professional painting calculators help contractors and homeowners 
                get accurate estimates for any painting project. Whether you're painting a single 
                room, an entire house exterior, a commercial building, or refinishing cabinets, 
                our calculators provide detailed cost breakdowns in seconds.
              </p>
              <p className="mb-4">
                Each calculator uses industry-standard formulas, real contractor pricing data, 
                and factors in all aspects of professional painting including surface preparation, 
                primer, multiple coats, and regional labor rates. Our calculators are updated 
                regularly to reflect current material costs and labor standards.
              </p>
              <p>
                Used by over 2,500 painting contractors nationwide, these calculators have helped 
                estimate more than $10 million in painting projects. Start with any calculator 
                above to get your free estimate, then upgrade to ProPaint Quote to create 
                professional proposals that win more jobs.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}