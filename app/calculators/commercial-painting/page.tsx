'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { CommercialCalculator } from '@/components/calculators/CommercialCalculator'
import { CalculatorResults } from '@/components/calculators/CalculatorResultsNew'
import { PaintCalculationResult } from '@/lib/calculators/paint-calculator-engine'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Building2, Shield, Clock } from 'lucide-react'

// Note: In a real implementation, this would be export const metadata
const pageMetadata = {
  title: 'Commercial Painting Calculator | Building & Office Painting Estimator | ProPaint Quote',
  description: 'Free commercial painting calculator for offices, warehouses, retail spaces. Get accurate quotes for large-scale painting projects in seconds. Trusted by commercial contractors.',
  keywords: 'commercial painting calculator, office painting calculator, warehouse painting estimator, commercial paint cost calculator, building painting calculator',
}

const commercialFAQs = [
  {
    question: "How does commercial painting pricing differ from residential?",
    answer: "Commercial painting typically costs less per square foot due to larger, simpler surfaces and economies of scale. However, projects often require specialized equipment, insurance, evening/weekend work, and compliance with commercial building codes."
  },
  {
    question: "What's included in commercial painting estimates?",
    answer: "Commercial estimates include: industrial-grade paints, labor for large-scale application, equipment rental (lifts, sprayers), safety equipment and compliance, minimal disruption scheduling, and commercial insurance/bonding costs."
  },
  {
    question: "How do you calculate paint for large commercial buildings?",
    answer: "Measure the perimeter and multiply by building height for exterior walls. For interiors, calculate each floor's wall area separately. Our calculator automatically handles multi-story buildings and accounts for commercial paint coverage rates."
  },
  {
    question: "What type of paint is best for commercial buildings?",
    answer: "Commercial projects typically use durable acrylic or epoxy paints with semi-gloss or gloss finishes for easy cleaning. Specific requirements depend on the facility type - offices need low-VOC paints, warehouses need industrial coatings, and medical facilities require antimicrobial options."
  },
  {
    question: "How long does commercial painting take?",
    answer: "Timeline depends on building size and scheduling constraints. A 10,000 sq ft office might take 3-5 days with a crew, while a 50,000 sq ft warehouse could take 2-3 weeks. After-hours work may extend the timeline but minimizes business disruption."
  },
  {
    question: "Do commercial painting projects require special insurance?",
    answer: "Yes, commercial painting requires higher liability limits (typically $1-5 million), workers' compensation, and often performance bonds. Many facilities also require contractors to be added to their insurance as additional insured parties."
  }
]

export default function CommercialPaintingCalculatorPage() {
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
    "name": "Commercial Painting Calculator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1832",
      "bestRating": "5"
    },
    "description": "Professional commercial painting calculator for accurate building painting estimates in seconds."
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/calculators' },
    { label: 'Commercial Painting Calculator', href: '/calculators/commercial-painting' }
  ]

  return (
    <>
      <SchemaMarkup type="WebApplication" data={schemaData} />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Commercial Painting Calculator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional estimator for offices, warehouses, retail spaces, and large buildings. 
              Get accurate commercial painting quotes with after-hours scheduling options.
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="font-semibold">50M+ Sq Ft Quoted</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <span className="font-semibold">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                <span className="font-semibold">24/7 Scheduling</span>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="max-w-4xl mx-auto mb-16">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Calculate Your Commercial Painting Project</h2>
              
              {!showResults ? (
                <CommercialCalculator onCalculate={handleCalculation} />
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
              Built for Commercial Painting Contractors
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">All Building Types</h3>
                <p className="text-gray-600">
                  Offices, warehouses, retail, medical facilities, schools, and industrial buildings
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Calculate rates for business hours, after-hours, and weekend work
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Volume Pricing</h3>
                <p className="text-gray-600">
                  Automatic adjustments for large-scale projects and multi-building contracts
                </p>
              </Card>
            </div>
          </section>

          {/* Process Section */}
          <section className="mb-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              How Commercial Painting Estimation Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Building Details",
                  description: "Type, size, and floors"
                },
                {
                  step: 2,
                  title: "Surface Selection",
                  description: "Walls, ceilings, floors"
                },
                {
                  step: 3,
                  title: "Work Schedule",
                  description: "Business hours or after"
                },
                {
                  step: 4,
                  title: "Get Quote",
                  description: "Detailed commercial estimate"
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-slate-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Case Studies */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Recent Commercial Projects
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold mb-2">Corporate Office Complex</h3>
                <p className="text-gray-600 mb-4">
                  50,000 sq ft, 3 buildings, completed in 10 days with zero business disruption
                </p>
                <div className="text-sm text-gray-500">
                  <p>Paint: Premium low-VOC</p>
                  <p>Schedule: After-hours</p>
                  <p className="font-semibold text-gray-700 mt-2">Total: $125,000</p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-4xl mb-4">🏭</div>
                <h3 className="text-xl font-semibold mb-2">Distribution Warehouse</h3>
                <p className="text-gray-600 mb-4">
                  100,000 sq ft warehouse with epoxy floor coating, completed in 2 weeks
                </p>
                <div className="text-sm text-gray-500">
                  <p>Paint: Industrial epoxy</p>
                  <p>Schedule: Weekend work</p>
                  <p className="font-semibold text-gray-700 mt-2">Total: $180,000</p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold mb-2">Medical Facility</h3>
                <p className="text-gray-600 mb-4">
                  30,000 sq ft healthcare center with antimicrobial coatings
                </p>
                <div className="text-sm text-gray-500">
                  <p>Paint: Antimicrobial</p>
                  <p>Schedule: Phased approach</p>
                  <p className="font-semibold text-gray-700 mt-2">Total: $95,000</p>
                </div>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Commercial Painting Calculator FAQs
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {commercialFAQs.map((faq, index) => (
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
              <h2 className="text-3xl font-bold mb-6">Complete Guide to Commercial Painting Estimation</h2>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold mt-6 mb-4">Commercial vs. Residential Painting</h3>
                <p className="mb-4">
                  Commercial painting projects differ significantly from residential work in scale, 
                  requirements, and execution. Understanding these differences is crucial for accurate 
                  estimation and successful project completion.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Key Commercial Considerations</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Business continuity</strong>: Minimize disruption to operations</li>
                  <li className="mb-2"><strong>Safety compliance</strong>: OSHA requirements and safety protocols</li>
                  <li className="mb-2"><strong>Insurance requirements</strong>: Higher liability limits needed</li>
                  <li className="mb-2"><strong>Specialized coatings</strong>: Industrial, antimicrobial, or fire-resistant</li>
                  <li className="mb-2"><strong>Volume efficiency</strong>: Larger areas allow faster application</li>
                  <li className="mb-2"><strong>Access equipment</strong>: Lifts, scaffolding, and safety gear</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Pricing by Building Type</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Office Buildings ($1.50-3.00/sq ft)</p>
                  <ul className="list-disc pl-6">
                    <li>Multiple colors and accent walls</li>
                    <li>Low-VOC paint requirements</li>
                    <li>After-hours work common</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Warehouses ($0.75-2.00/sq ft)</p>
                  <ul className="list-disc pl-6">
                    <li>Large open areas</li>
                    <li>Industrial coatings</li>
                    <li>Minimal prep work</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Retail Spaces ($2.00-4.00/sq ft)</p>
                  <ul className="list-disc pl-6">
                    <li>Brand color requirements</li>
                    <li>Quick turnaround needed</li>
                    <li>Weekend/overnight work</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Medical Facilities ($3.00-5.00/sq ft)</p>
                  <ul className="list-disc pl-6">
                    <li>Antimicrobial coatings</li>
                    <li>Strict compliance requirements</li>
                    <li>Phased work approach</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Commercial Paint Selection</h3>
                <p className="mb-4">
                  Commercial projects require specific paint characteristics:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Durability</strong>: Withstand high traffic and cleaning</li>
                  <li className="mb-2"><strong>Coverage</strong>: Minimize coats for faster completion</li>
                  <li className="mb-2"><strong>Dry time</strong>: Quick return to service</li>
                  <li className="mb-2"><strong>VOC compliance</strong>: Meet environmental regulations</li>
                  <li className="mb-2"><strong>Warranty</strong>: Commercial-grade warranties</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Scheduling Strategies</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Business Hours Work</p>
                  <ul className="list-disc pl-6">
                    <li>Standard labor rates</li>
                    <li>Coordinate with facility management</li>
                    <li>Section-by-section approach</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">After-Hours Work (5 PM - 12 AM)</p>
                  <ul className="list-disc pl-6">
                    <li>30% labor premium typical</li>
                    <li>No business disruption</li>
                    <li>Security coordination required</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Weekend Work</p>
                  <ul className="list-disc pl-6">
                    <li>50% labor premium typical</li>
                    <li>Complete areas in one push</li>
                    <li>Ideal for retail/office spaces</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Equipment and Efficiency</h3>
                <p className="mb-4">
                  Commercial projects benefit from specialized equipment:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Airless sprayers</strong>: Cover 3,000-5,000 sq ft/day</li>
                  <li className="mb-2"><strong>Boom lifts</strong>: Access high ceilings safely</li>
                  <li className="mb-2"><strong>HEPA ventilation</strong>: Maintain air quality</li>
                  <li className="mb-2"><strong>Industrial rollers</strong>: 18-24" for large walls</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Cost Optimization Tips</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Bundle multiple buildings for volume discounts</li>
                  <li className="mb-2">Schedule during slow business periods</li>
                  <li className="mb-2">Use single color schemes where possible</li>
                  <li className="mb-2">Implement preventive maintenance programs</li>
                  <li className="mb-2">Consider long-term service contracts</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="mb-16 text-center bg-slate-700 text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Win More Commercial Painting Contracts?
            </h2>
            <p className="text-xl mb-8">
              Create professional commercial painting proposals in minutes
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
                className="bg-transparent text-white border-white hover:bg-white hover:text-slate-700"
                onClick={() => window.location.href = '/enterprise'}
              >
                Enterprise Solutions
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}