import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home,
  Palette,
  DollarSign,
  Ruler,
  PaintBucket,
  Target,
  TrendingUp,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'
import { RoomCalculatorWidget } from '@/components/calculators/room-calculator-widget'

export const metadata: Metadata = {
  title: 'Interior Painting Quote Calculator | Free Estimate Tool for Contractors',
  description: 'Free interior painting quote calculator. Get accurate estimates for bedroom, bathroom, apartment, and house interior painting. Used by 5,000+ professional contractors.',
  keywords: 'interior painting quote, interior paint quote, interior house painting quote, apartment painting quote, bedroom painting quote, bathroom painting quote, interior paint estimate template, interior home paint estimate, interior paint calculator, wall paint calculator',
  alternates: {
    canonical: '/interior-painting-quote-calculator',
  },
  openGraph: {
    title: 'Interior Painting Quote Calculator - Free Professional Tool',
    description: 'Calculate accurate interior painting quotes in minutes. Professional tool used by contractors nationwide.',
    url: '/interior-painting-quote-calculator',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

export default function InteriorPaintingQuoteCalculatorPage() {
  const roomTypes = [
    {
      icon: <Home className="w-8 h-8 text-blue-600" />,
      name: "Living Room",
      avgSize: "12' x 15'",
      avgCost: "$450 - $750",
      timeEstimate: "1-2 days",
      considerations: ["High ceiling areas", "Multiple windows", "Built-in features"]
    },
    {
      icon: <Palette className="w-8 h-8 text-purple-600" />,
      name: "Bedroom",
      avgSize: "10' x 12'", 
      avgCost: "$300 - $550",
      timeEstimate: "1 day",
      considerations: ["Closet interiors", "Accent walls", "Ceiling fans"]
    },
    {
      icon: <PaintBucket className="w-8 h-8 text-green-600" />,
      name: "Bathroom",
      avgSize: "8' x 10'",
      avgCost: "$200 - $400", 
      timeEstimate: "0.5-1 day",
      considerations: ["Moisture-resistant paint", "Ventilation", "Trim work"]
    },
    {
      icon: <DollarSign className="w-8 h-8 text-orange-600" />,
      name: "Kitchen",
      avgSize: "10' x 12'",
      avgCost: "$350 - $600",
      timeEstimate: "1-1.5 days",
      considerations: ["Grease-resistant paint", "Cabinet areas", "Backsplash coordination"]
    }
  ]

  const apartmentSizes = [
    {
      type: "Studio Apartment",
      sqft: "400-600 sq ft",
      rooms: "1 main room + bathroom",
      avgCost: "$800 - $1,200",
      paintNeeded: "2-3 gallons"
    },
    {
      type: "1 Bedroom Apartment", 
      sqft: "600-900 sq ft",
      rooms: "Bedroom, living room, kitchen, bathroom",
      avgCost: "$1,200 - $1,800",
      paintNeeded: "3-4 gallons"
    },
    {
      type: "2 Bedroom Apartment",
      sqft: "900-1,200 sq ft", 
      rooms: "2 bedrooms, living room, kitchen, bathroom",
      avgCost: "$1,800 - $2,500",
      paintNeeded: "4-6 gallons"
    },
    {
      type: "3 Bedroom House Interior",
      sqft: "1,500-2,000 sq ft",
      rooms: "3 bedrooms, living areas, kitchen, 2 bathrooms",
      avgCost: "$2,500 - $4,000", 
      paintNeeded: "6-8 gallons"
    }
  ]

  const calculationFactors = [
    {
      icon: <Ruler className="w-6 h-6 text-blue-600" />,
      factor: "Wall Area Calculation",
      formula: "Length × Width × Height - Doors & Windows",
      example: "12' × 15' × 9' = 1,620 sq ft - 120 sq ft = 1,500 sq ft"
    },
    {
      icon: <PaintBucket className="w-6 h-6 text-green-600" />,
      factor: "Paint Coverage",
      formula: "400 sq ft per gallon (average)",
      example: "1,500 sq ft ÷ 400 = 3.75 gallons needed"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-purple-600" />,
      factor: "Labor Costs",
      formula: "$1.50 - $3.50 per sq ft",
      example: "1,500 sq ft × $2.50 = $3,750 labor"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      factor: "Time Estimation",
      formula: "200-300 sq ft per hour",
      example: "1,500 sq ft ÷ 250 = 6 hours work"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Free <span className="text-blue-600">Interior Painting Quote</span> Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get accurate estimates for <strong>bedrooms, bathrooms, apartments, and house interiors</strong>. 
            Professional calculator used by <strong>5,000+ contractors</strong> for precise interior painting quotes.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Try Professional Calculator Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="#calculator">
                Use Basic Calculator Below
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Instant estimates</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5 text-green-500" />
              <span>Industry-standard formulas</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5 text-green-500" />
              <span>All room types</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              <span>Mobile-friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Room-by-Room Estimates */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Interior Painting Quotes by Room Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Average costs and considerations for different interior spaces
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roomTypes.map((room, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {room.icon}
                  </div>
                  <CardTitle className="text-xl">{room.name}</CardTitle>
                  <p className="text-gray-600">Average: {room.avgSize}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Range:</span>
                      <span className="font-bold text-green-600">{room.avgCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{room.timeEstimate}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Factors:</h4>
                      <ul className="space-y-1">
                        {room.considerations.map((factor, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Apartment & House Interior Quotes */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apartment & House Interior Painting Quotes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete interior painting estimates by property size
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {apartmentSizes.map((property, index) => (
              <Card key={index} className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">{property.type}</CardTitle>
                  <p className="text-gray-600">{property.sqft}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Included Areas:</h4>
                      <p className="text-gray-600">{property.rooms}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">Total Cost Range</p>
                        <p className="text-lg font-bold text-green-800">{property.avgCost}</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium">Paint Needed</p>
                        <p className="text-lg font-bold text-blue-800">{property.paintNeeded}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Pro Tip:</strong> Add 15-20% for primer, ceiling paint, and touch-ups
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Guide */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Calculate Interior Painting Quotes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional formulas contractors use for accurate interior paint estimates
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {calculationFactors.map((factor, index) => (
              <Card key={index} className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {factor.icon}
                    {factor.factor}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Formula:</p>
                      <p className="text-blue-800 font-semibold">{factor.formula}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Example:</p>
                      <p className="text-gray-700">{factor.example}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
              Complete Interior Quote Formula
            </h3>
            <div className="text-center text-lg">
              <p className="text-blue-800 font-semibold mb-2">
                Materials + Labor + Overhead (15%) + Profit (20%) = Total Quote
              </p>
              <p className="text-blue-700">
                Example: $200 materials + $750 labor + $143 overhead + $219 profit = <strong>$1,312 total</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Calculator Section */}
      <section id="calculator" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Interior Paint Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Get an instant estimate for your interior painting project
            </p>
          </div>
          
          <Card className="border-2 border-blue-200 shadow-xl">
            <CardContent className="p-8">
              <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">
                  🎯 Want Professional Results?
                </h3>
                <p className="text-yellow-700 mb-4">
                  This basic calculator gives rough estimates. For accurate quotes that win jobs, 
                  contractors use our professional software with industry-standard formulas.
                </p>
                <Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <Link href="/trial-signup">
                    Try Professional Calculator Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Room Dimensions</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Length (feet)</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="12" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Width (feet)</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="15" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height (feet)</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="9" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Doors</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Windows</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paint Quality</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Standard ($35/gallon)</option>
                        <option>Premium ($50/gallon)</option>
                        <option>Designer ($70/gallon)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-lg py-6">
                Calculate Interior Paint Quote
                <Calculator className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Professional ROI Calculator */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Contractors: Calculate Your Revenue Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how professional quote software increases your interior painting business revenue
            </p>
          </div>
          
          <ROICalculator className="mb-8" />
          
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Try Our Room-by-Room Calculator
            </h3>
            <p className="text-gray-600 mb-8">
              See how professionals calculate interior paint costs room by room
            </p>
            <div className="max-w-md mx-auto">
              <RoomCalculatorWidget title="Professional Room Calculator" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Contractors Choose Our Calculator */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why 5,000+ Contractors Trust Our Interior Paint Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Professional features that help you win more interior painting jobs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <Target className="w-6 h-6" />
                  Accurate Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Industry-standard formulas ensure your interior paint quotes are competitive yet profitable. 
                  Never underestimate bedroom, bathroom, or apartment painting jobs again.
                </p>
                <p className="text-sm font-semibold text-green-700">
                  ✓ Wall area calculations with door/window deductions
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Clock className="w-6 h-6" />
                  Save Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Generate interior painting quotes in 6 minutes instead of hours. Perfect for apartment buildings, 
                  house interiors, and multi-room projects.
                </p>
                <p className="text-sm font-semibold text-blue-700">
                  ✓ Mobile calculator works on-site during consultations
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <TrendingUp className="w-6 h-6" />
                  Win More Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Professional interior paint quotes increase win rates by 40-60%. Customers trust contractors 
                  who use modern tools and provide detailed estimates.
                </p>
                <p className="text-sm font-semibold text-purple-700">
                  ✓ Branded quotes with your company logo and colors
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Smartphone className="w-6 h-6" />
                  Work Anywhere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Calculate interior paint quotes on your phone or tablet while walking through bedrooms, 
                  bathrooms, and living spaces with customers.
                </p>
                <p className="text-sm font-semibold text-orange-700">
                  ✓ Close deals while excitement is high
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Professional Interior Paint Quotes?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join contractors who've increased their interior painting revenue by 40-60% with professional quote software
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" asChild className="text-lg px-12 py-6">
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Included
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/painting-contractors">
                Learn More About Our Software
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-blue-200 text-sm">
            <div>✓ All room types covered</div>
            <div>✓ Professional presentation</div>
            <div>✓ Mobile-friendly calculator</div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Interior Painting Quote Calculator",
            "description": "Free interior painting quote calculator for bedrooms, bathrooms, apartments, and house interiors.",
            "url": "https://propaintquote.com/interior-painting-quote-calculator",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "audience": {
              "@type": "Audience",
              "audienceType": "Painting Contractors"
            },
            "featureList": [
              "Room-by-room calculations",
              "Apartment painting quotes", 
              "Bedroom painting estimates",
              "Bathroom painting costs",
              "Wall area calculator",
              "Paint coverage calculator"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free interior painting calculator"
            }
          })
        }}
      />
    </div>
  )
}