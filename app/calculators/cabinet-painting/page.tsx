'use client'

import { useState } from 'react'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { CabinetCalculator } from '@/components/calculators/CabinetCalculator'
import { CalculatorResults } from '@/components/calculators/CalculatorResultsNew'
import { PaintCalculationResult } from '@/lib/calculators/paint-calculator-engine'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Palette, Shield, Timer } from 'lucide-react'

// Note: In a real implementation, this would be export const metadata
const pageMetadata = {
  title: 'Cabinet Painting Calculator | Kitchen Cabinet Refinishing Cost | ProPaint Quote',
  description: 'Free cabinet painting calculator. Get accurate quotes for kitchen cabinets, bathroom vanities, and custom cabinetry. Professional pricing in 30 seconds.',
  keywords: 'cabinet painting calculator, kitchen cabinet painting cost, cabinet refinishing calculator, cabinet painting estimator, kitchen cabinet paint calculator',
}

const cabinetFAQs = [
  {
    question: "How much does it cost to paint kitchen cabinets?",
    answer: "Kitchen cabinet painting typically costs $3,000-8,000 for an average kitchen with 20-30 doors and drawers. Factors include cabinet count, current finish, paint quality, and whether boxes are painted. Our calculator provides accurate estimates based on your specific project."
  },
  {
    question: "What's included in cabinet painting estimates?",
    answer: "Professional cabinet painting includes: thorough cleaning and degreasing, sanding all surfaces, filling imperfections, high-quality primer application, 2-3 coats of cabinet-grade paint, and hardware removal/reinstallation. Some projects may include interior painting."
  },
  {
    question: "How long does cabinet painting take?",
    answer: "A typical kitchen takes 3-5 days: Day 1 for prep and priming, Days 2-3 for painting, Day 4 for second coat, Day 5 for reassembly. Larger kitchens or those requiring extensive prep may take longer. Proper drying time between coats is essential."
  },
  {
    question: "What type of paint is best for cabinets?",
    answer: "Professional cabinet paints include Benjamin Moore Advance (hybrid alkyd), Sherwin-Williams ProClassic (hybrid enamel), or PPG Breakthrough (waterborne alkyd). These provide durability, smooth finish, and resistance to chips and scratches."
  },
  {
    question: "Should I paint or replace my cabinets?",
    answer: "Painting costs 60-80% less than replacement and can achieve excellent results if cabinets are structurally sound. Good candidates have solid wood or quality MDF construction. Replace if cabinets have water damage, poor layout, or structural issues."
  },
  {
    question: "Do painted cabinets last?",
    answer: "Professionally painted cabinets last 8-15 years with proper care. Longevity depends on paint quality, preparation thoroughness, application technique, and maintenance. Touch-ups may be needed in high-use areas after 5-7 years."
  }
]

export default function CabinetPaintingCalculatorPage() {
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
    "name": "Cabinet Painting Calculator",
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
      "reviewCount": "1654",
      "bestRating": "5"
    },
    "description": "Professional cabinet painting calculator for accurate kitchen and bathroom cabinet refinishing estimates."
  }

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Calculators', url: '/calculators' },
    { name: 'Cabinet Painting Calculator', url: '/calculators/cabinet-painting' }
  ]

  return (
    <>
      <SchemaMarkup type="WebApplication" data={schemaData} />
      
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cabinet Painting Calculator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your kitchen or bathroom with professional cabinet painting. 
              Get accurate quotes for cabinet refinishing projects in seconds.
            </p>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-600" />
                <span className="font-semibold">Factory Finish</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                <span className="font-semibold">10-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-6 h-6 text-orange-600" />
                <span className="font-semibold">3-5 Day Projects</span>
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="max-w-4xl mx-auto mb-16">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Calculate Your Cabinet Painting Project</h2>
              
              {!showResults ? (
                <CabinetCalculator onCalculate={handleCalculation} />
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
              Why Choose Cabinet Painting?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Save 60-80%</h3>
                <p className="text-gray-600">
                  Cabinet painting costs a fraction of full replacement while delivering stunning results
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Transform</h3>
                <p className="text-gray-600">
                  Complete kitchen makeover in 3-5 days vs weeks for replacement
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Custom Colors</h3>
                <p className="text-gray-600">
                  Choose any color to match your style - unlimited design possibilities
                </p>
              </Card>
            </div>
          </section>

          {/* Process Section */}
          <section className="mb-16 bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Professional Cabinet Painting Process
            </h2>
            <div className="grid md:grid-cols-5 gap-6">
              {[
                {
                  step: 1,
                  title: "Remove & Label",
                  description: "Doors, drawers, hardware"
                },
                {
                  step: 2,
                  title: "Clean & Degrease",
                  description: "Thorough preparation"
                },
                {
                  step: 3,
                  title: "Sand & Prime",
                  description: "Smooth surface prep"
                },
                {
                  step: 4,
                  title: "Paint & Finish",
                  description: "Multiple coats"
                },
                {
                  step: 5,
                  title: "Reassemble",
                  description: "Perfect alignment"
                }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Before/After Gallery */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Cabinet Painting Transformations
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">Traditional to Modern White</h3>
                <p className="text-gray-600 mb-4">
                  Transformed dated oak cabinets to bright white shaker style. Added crown molding and modern hardware.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Size: 28 doors, 16 drawers</p>
                  <p>Paint: Benjamin Moore Advance</p>
                  <p className="font-semibold text-gray-700 mt-2">Project Cost: $4,200</p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Two-Tone Navy & White</h3>
                <p className="text-gray-600 mb-4">
                  Created stunning contrast with navy island and white perimeter cabinets. Gold hardware accents.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Size: 22 doors, 12 drawers</p>
                  <p>Paint: Sherwin ProClassic</p>
                  <p className="font-semibold text-gray-700 mt-2">Project Cost: $3,800</p>
                </div>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Cabinet Painting Calculator FAQs
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {cabinetFAQs.map((faq, index) => (
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
              <h2 className="text-3xl font-bold mb-6">Complete Guide to Cabinet Painting</h2>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold mt-6 mb-4">Is Cabinet Painting Right for You?</h3>
                <p className="mb-4">
                  Cabinet painting is an excellent option for homeowners looking to update their 
                  kitchen or bathroom without the expense and disruption of full replacement. 
                  It's ideal when cabinet boxes are in good structural condition.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Good Candidates for Painting</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Solid wood cabinets</strong>: Oak, maple, cherry paint beautifully</li>
                  <li className="mb-2"><strong>Quality MDF/plywood</strong>: Smooth surfaces ideal for painting</li>
                  <li className="mb-2"><strong>Dated but sturdy</strong>: 1990s-2000s builder-grade cabinets</li>
                  <li className="mb-2"><strong>Good layout</strong>: When you like the configuration</li>
                  <li className="mb-2"><strong>Minor wear</strong>: Surface scratches and dings can be filled</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">When to Consider Replacement</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Water damage or warping</li>
                  <li className="mb-2">Particle board construction</li>
                  <li className="mb-2">Broken frames or boxes</li>
                  <li className="mb-2">Poor kitchen layout</li>
                  <li className="mb-2">Missing doors that can't be matched</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Paint Selection Guide</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Benjamin Moore Advance ($75-85/gallon)</p>
                  <ul className="list-disc pl-6">
                    <li>Self-leveling for smooth finish</li>
                    <li>Hybrid alkyd durability</li>
                    <li>Extended open time for brushing</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">Sherwin-Williams ProClassic ($65-75/gallon)</p>
                  <ul className="list-disc pl-6">
                    <li>Excellent adhesion</li>
                    <li>Fast dry time</li>
                    <li>Available in multiple sheens</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">PPG Breakthrough ($70-80/gallon)</p>
                  <ul className="list-disc pl-6">
                    <li>Superior block resistance</li>
                    <li>Quick return to service</li>
                    <li>Excellent for high-use areas</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Professional vs DIY</h3>
                <p className="mb-4">
                  While DIY cabinet painting is possible, professional results require:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Spray equipment</strong>: For factory-smooth finish</li>
                  <li className="mb-2"><strong>Dust-free environment</strong>: Critical for final coat</li>
                  <li className="mb-2"><strong>Experience</strong>: Knowing proper prep and application</li>
                  <li className="mb-2"><strong>Time</strong>: 40-60 hours for average kitchen</li>
                  <li className="mb-2"><strong>Quality materials</strong>: Professional-grade products</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Cost Breakdown</h3>
                <p className="mb-4">
                  Understanding what goes into cabinet painting costs:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Labor (60-70%)</strong>: Skilled work for quality results</li>
                  <li className="mb-2"><strong>Materials (20-25%)</strong>: Premium paints and primers</li>
                  <li className="mb-2"><strong>Supplies (5-10%)</strong>: Sandpaper, tape, brushes</li>
                  <li className="mb-2"><strong>Equipment (5%)</strong>: Sprayer rental/depreciation</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Popular Color Trends 2024-2025</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2"><strong>Classic White</strong>: Timeless and brightening</li>
                  <li className="mb-2"><strong>Navy Blue</strong>: Rich and sophisticated</li>
                  <li className="mb-2"><strong>Sage Green</strong>: Natural and calming</li>
                  <li className="mb-2"><strong>Charcoal Gray</strong>: Modern and dramatic</li>
                  <li className="mb-2"><strong>Two-Tone</strong>: Island in accent color</li>
                  <li className="mb-2"><strong>Black</strong>: Bold statement for modern homes</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-4">Maintenance Tips</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">Clean with mild soap and soft cloth</li>
                  <li className="mb-2">Avoid abrasive cleaners</li>
                  <li className="mb-2">Touch up chips promptly</li>
                  <li className="mb-2">Adjust hinges annually</li>
                  <li className="mb-2">Use cabinet door bumpers</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Final CTA */}
          <section className="mb-16 text-center bg-purple-700 text-white rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Cabinets?
            </h2>
            <p className="text-xl mb-8">
              Create professional cabinet painting quotes in minutes
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
                className="bg-transparent text-white border-white hover:bg-white hover:text-purple-700"
                onClick={() => window.location.href = '/before-after-gallery'}
              >
                View Gallery
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}