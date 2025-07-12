import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, CheckCircle, Clock, DollarSign, Smartphone } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/constants'

export const metadata = {
  title: 'Free Painting Estimate Calculator - Instant Paint Quote Calculator',
  description: 'Get instant painting estimates with our free calculator. Calculate paint costs, labor, and total project costs for interior and exterior painting. Mobile-friendly and accurate.',
  keywords: ['painting estimate calculator', 'paint calculator', 'painting cost calculator', 'free painting calculator', 'painting quote calculator'],
  openGraph: {
    title: 'Free Painting Estimate Calculator - Get Instant Quotes',
    description: 'Calculate your painting project costs instantly. Free, accurate, and easy to use.',
  }
}

export default function PaintingEstimateCalculatorPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ProPaint Estimate Calculator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "523"
    }
  }

  return (
    <>
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Calculator className="w-4 h-4" />
                <span>100% Free • No Email Required</span>
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
                Free Painting Estimate Calculator
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Get accurate painting quotes instantly. Calculate costs for any room size, 
                see paint requirements, and compare prices from top paint brands.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild className="text-lg">
                  <Link href="/calculator">
                    <Calculator className="w-5 h-5 mr-2" />
                    Start Free Calculator
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg">
                  <Link href="/get-quote">Get Professional Quote</Link>
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>No Sign-up Required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span>Mobile Friendly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-secondary-900 mb-12 text-center">
              Why Use Our Painting Calculator?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <DollarSign className="w-12 h-12 text-primary-600 mb-4" />
                  <CardTitle>Accurate Pricing</CardTitle>
                  <CardDescription>
                    Real-time prices from major paint brands including Sherwin-Williams, 
                    Benjamin Moore, Behr, and Valspar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Paint cost calculations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Labor estimates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Supply costs included</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Calculator className="w-12 h-12 text-primary-600 mb-4" />
                  <CardTitle>Easy to Use</CardTitle>
                  <CardDescription>
                    Simple interface designed for homeowners and contractors. 
                    Get estimates in under 2 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Room-by-room calculation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Multiple paint options</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Instant results</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Smartphone className="w-12 h-12 text-primary-600 mb-4" />
                  <CardTitle>Mobile Optimized</CardTitle>
                  <CardDescription>
                    Works perfectly on any device. Calculate estimates on-site 
                    from your phone or tablet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Responsive design</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Touch-friendly interface</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Fast loading</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-secondary-900 mb-12 text-center">
                How Our Calculator Works
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Enter Room Dimensions</h3>
                      <p className="text-gray-600">
                        Input the length, width, and height of each room you want to paint
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Select Paint Brand & Type</h3>
                      <p className="text-gray-600">
                        Choose from premium brands and paint types to match your budget
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Choose Surfaces</h3>
                      <p className="text-gray-600">
                        Select walls, ceilings, trim, or any combination for accurate pricing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Get Instant Quote</h3>
                      <p className="text-gray-600">
                        See detailed breakdown of paint, labor, and total project costs
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Image
                    src="/images/construction-contractor-using-computer-smiling.jpg"
                    alt="Contractor using painting calculator"
                    width={500}
                    height={400}
                    className="rounded-lg shadow-xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white p-4 rounded-lg shadow-lg">
                    <div className="text-2xl font-bold">2 min</div>
                    <div className="text-sm">Average time to quote</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Preview Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-secondary-900 mb-6">
                What's Included in Your Estimate?
              </h2>
              
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-semibold mb-3">Materials Cost</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Paint gallons needed</li>
                      <li>• Primer requirements</li>
                      <li>• Supplies (brushes, rollers, tape)</li>
                      <li>• Drop cloths and protection</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Labor Cost</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Professional painter rates</li>
                      <li>• Hours by surface type</li>
                      <li>• Prep work included</li>
                      <li>• Clean-up time</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t">
                  <p className="text-gray-600 mb-6">
                    Our calculator uses industry-standard formulas and current market prices 
                    to provide the most accurate estimates possible.
                  </p>
                  <Button size="lg" asChild>
                    <Link href="/calculator">Try Calculator Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-secondary-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Is the painting calculator really free?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Our calculator is 100% free to use with no hidden costs, 
                    sign-ups, or email requirements. Use it as many times as you need.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    How accurate are the estimates?
                  </h3>
                  <p className="text-gray-600">
                    Our estimates are based on current market prices and industry standards. 
                    While they're very accurate for planning purposes, final costs may vary 
                    based on wall condition, prep work needed, and local labor rates.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Can I save or print my estimate?
                  </h3>
                  <p className="text-gray-600">
                    Yes! Once you generate your estimate, you can print it directly from 
                    your browser or save it as a PDF for future reference.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Do you offer professional painting services?
                  </h3>
                  <p className="text-gray-600">
                    Yes! {COMPANY_INFO.name} provides professional painting services. 
                    After using our calculator, you can request a detailed quote from 
                    our experienced team for a more precise estimate and scheduling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Calculate Your Painting Costs?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Use our free calculator now or get a professional quote from our expert team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/calculator">
                  <Calculator className="w-5 h-5 mr-2" />
                  Use Free Calculator
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white hover:text-primary-600">
                <Link href="/get-quote">Get Pro Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}