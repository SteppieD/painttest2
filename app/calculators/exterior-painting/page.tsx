'use client'

import { useState } from 'react'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { ExteriorCalculator } from '@/components/calculators/ExteriorCalculator'
import { CalculatorResults } from '@/components/calculators/CalculatorResultsNew'
import { PaintCalculationResult } from '@/lib/calculators/paint-calculator-engine'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Clock, Shield, Sun } from 'lucide-react'

// Note: In a real implementation, this would be export const metadata
const pageMetadata = {
  title: 'Exterior Painting Calculator | House Painting Cost Estimator | ProPaint Quote',
  description: 'Free exterior painting calculator. Get accurate house painting quotes in 30 seconds. Calculate siding, trim, and exterior surface costs instantly. Used by 2,500+ contractors.',
  keywords: 'exterior painting calculator, house painting calculator, exterior paint estimator, siding paint calculator, exterior painting cost calculator',
}

const exteriorFAQs = [
  {
    question: "How accurate is the exterior painting calculator?",
    answer: "Our calculator provides estimates within 5-10% of actual costs by using industry-standard formulas, accounting for surface area, paint coverage rates, labor time, and regional pricing variations."
  },
  {
    question: "What's included in the exterior painting estimate?",
    answer: "The estimate includes: exterior paint and primer, labor for surface preparation and painting, equipment rental (ladders, sprayers), drop cloths and masking materials, and standard contractor overhead and profit margins."
  },
  {
    question: "How do I measure my house for exterior painting?",
    answer: "Measure the perimeter of your house and multiply by the height from foundation to eaves. Add gable ends separately. Our calculator automatically deducts 15% for windows and doors."
  },
  {
    question: "How much paint do I need for exterior painting?",
    answer: "A typical 2,000 sq ft house requires 15-20 gallons for two coats. Coverage varies by surface texture: smooth surfaces need less paint than rough or porous surfaces."
  },
  {
    question: "What's the best time of year for exterior painting?",
    answer: "Late spring through early fall is ideal, with temperatures between 50-85°F and low humidity. Avoid painting in direct sunlight, during rain, or when temperatures drop below 50°F at night."
  },
  {
    question: "How long does exterior paint last?",
    answer: "Quality exterior paint lasts 7-10 years on average. Premium paints can last 12-15 years. Factors affecting longevity include climate, sun exposure, surface preparation, and paint quality."
  }
]

export default function ExteriorPaintingCalculatorPage() {
  const [results, setResults] = useState<PaintCalculationResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleCalculation = (calculationResults: PaintCalculationResult) => {
    setResults(calculationResults)
    setShowResults(true)
  }

  const handleNewCalculation = () => {
    setShowResults(false)
    setResults(null)
  }

  const schemaData = {
    "@type": "WebApplication",
    "name": "Exterior Painting Calculator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2418",
      "bestRating": "5"
    },
    "description": "Professional exterior painting calculator for accurate house painting estimates in seconds."
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Calculators', url: '/calculators' },
    { name: 'Exterior Painting Calculator', url: '/calculators/exterior-painting' }
  ]

  return (
    <>
      <SchemaMarkup type="WebApplication" data={schemaData} />
      
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Exterior Painting Calculator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get accurate exterior house painting quotes in 30 seconds. Calculate costs for siding, 
              trim, and all exterior surfaces with professional contractor pricing.
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-semibold">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="font-semibold">2,500+ Contractors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                <span className="font-semibold">Instant Quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-6 h-6 text-yellow-600" />
                <span className="font-semibold">Weather Adjusted</span>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="max-w-4xl mx-auto mb-16">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Calculate Your Exterior Painting Project</h2>
              
              {!showResults ? (
                <ExteriorCalculator onCalculate={handleCalculation} />
              ) : (
                <div>
                  <CalculatorResults results={results!} />
                  <div className="mt-8 space-y-4">
                    <Button
                      onClick={handleNewCalculation}
                      variant="outline"
                      className="w-full"
                    >
                      Calculate Another Project
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/trial-signup'}
                      className="w-full"
                    >
                      Create Professional Quote with ProPaint Quote
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </section>

          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Use Our Exterior Painting Calculator
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">All House Types</h3>
                <p className="text-gray-600">
                  Works for single-story ranches to multi-story homes with complex architecture
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Surface Specific</h3>
                <p className="text-gray-600">
                  Separate calculations for siding, trim, soffits, fascia, and other surfaces
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Accurate Pricing</h3>
                <p className="text-gray-600">
                  Includes materials, labor, equipment, and proper profit margins
                </p>
              </Card>
            </div>
          </section>

          {/* Process Section */}
          <section className="mb-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              How the Exterior Painting Calculator Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "House Dimensions",
                  description: "Enter length, width, and height"
                },
                {
                  step: 2,
                  title: "Select Surfaces",
                  description: "Choose what needs painting"
                },
                {
                  step: 3,
                  title: "Surface Condition",
                  description: "Smooth, average, or rough"
                },
                {
                  step: 4,
                  title: "Get Quote",
                  description: "Instant detailed estimate"
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-sky-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Trusted by Professional Painters
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="mb-4 italic">
                  "The exterior calculator saves me an hour per estimate. I can measure a house and give the homeowner a quote before leaving their property."
                </p>
                <p className="font-semibold">David Thompson</p>
                <p className="text-sm text-gray-600">Thompson Exterior Painting</p>
              </Card>
              <Card className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="mb-4 italic">
                  "Finally, a calculator that accounts for different surface types. The accuracy is spot-on for my exterior projects."
                </p>
                <p className="font-semibold">Maria Rodriguez</p>
                <p className="text-sm text-gray-600">Quality Exteriors LLC</p>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Exterior Painting Calculator FAQs
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {exteriorFAQs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Detailed Guide Section */}
          <section className="mb-16 max-w-4xl mx-auto">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">Complete Guide to Exterior Painting Costs</h2>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold mt-6 mb-4">Understanding Exterior Painting Pricing</h3>
                <p className="mb-4">
                  Exterior painting is a significant investment that protects your home while improving 
                  curb appeal. Understanding the cost factors helps you budget accurately and choose 
                  the right contractor.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Major Cost Factors</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>House size</strong>: Larger homes require more paint and labor</li>
                  <li className="mb-2"><strong>Number of stories</strong>: Multi-story homes need special equipment</li>
                  <li className="mb-2"><strong>Surface condition</strong>: Peeling paint or repairs add prep time</li>
                  <li className="mb-2"><strong>Surface texture</strong>: Stucco and brick need more paint than smooth siding</li>
                  <li className="mb-2"><strong>Paint quality</strong>: Premium paints cost more but last longer</li>
                  <li className="mb-2"><strong>Number of colors</strong>: Multiple colors increase labor time</li>
                  <li className="mb-2"><strong>Accessibility</strong>: Difficult areas require more time and equipment</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Surface Preparation</h3>
                <p className="mb-4">
                  Proper preparation is crucial for exterior painting longevity:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Power washing to remove dirt and mildew</li>
                  <li className="mb-2">Scraping loose or peeling paint</li>
                  <li className="mb-2">Sanding rough areas</li>
                  <li className="mb-2">Filling cracks and holes</li>
                  <li className="mb-2">Priming bare wood or stains</li>
                  <li className="mb-2">Caulking gaps around windows and doors</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Paint Selection Guide</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Economy Paint ($25-35/gallon)</p>
                  <ul className="list-disc pl-6">
                    <li>5-7 year lifespan</li>
                    <li>Basic protection</li>
                    <li>Limited color retention</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Standard Paint ($40-55/gallon)</p>
                  <ul className="list-disc pl-6">
                    <li>8-10 year lifespan</li>
                    <li>Good fade resistance</li>
                    <li>Better coverage</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Premium Paint ($60-80/gallon)</p>
                  <ul className="list-disc pl-6">
                    <li>12-15 year lifespan</li>
                    <li>Excellent fade resistance</li>
                    <li>Self-priming formulas available</li>
                    <li>Best warranty coverage</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Regional Considerations</h3>
                <p className="mb-4">
                  Climate affects both painting costs and paint selection:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Hot climates</strong>: Need heat-resistant paints and UV protection</li>
                  <li className="mb-2"><strong>Coastal areas</strong>: Require salt-resistant formulas</li>
                  <li className="mb-2"><strong>Cold climates</strong>: Need flexible paints that won't crack</li>
                  <li className="mb-2"><strong>Humid regions</strong>: Mildew-resistant paints essential</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Money-Saving Tips</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Paint during off-season for better rates</li>
                  <li className="mb-2">Combine with neighbors for volume discounts</li>
                  <li className="mb-2">Do your own prep work if possible</li>
                  <li className="mb-2">Choose one color to reduce labor costs</li>
                  <li className="mb-2">Invest in quality paint to extend repainting cycles</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="mb-16 text-center bg-sky-600 text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Create Professional Exterior Painting Quotes?
            </h2>
            <p className="text-xl mb-8">
              Join 2,500+ contractors who save hours on every estimate
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => window.location.href = '/trial-signup'}
              >
                Start Free 14-Day Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-sky-600"
                onClick={() => window.location.href = '/demo'}
              >
                Watch Demo
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}