import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home,
  DollarSign,
  Ruler,
  PaintBucket,
  Users,
  MapPin,
  TrendingUp,
  Target,
  Smartphone,
  Shield,
  Building2,
  TreePine,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'
import { generatePageMetadata } from '@/lib/metadata-utils'

export const metadata = generatePageMetadata({
  title: 'House Painting Cost Calculator | How Much Does It Cost to Paint a House?',
  description: 'Free house painting cost calculator. Get accurate estimates for interior and exterior house painting. Compare local contractor prices and find painters near you.',
  keywords: 'house painting cost calculator, how much does it cost to paint a house, house painters near me, house painting prices, interior house painting cost, exterior house painting cost, paint cost estimator, house paint calculator',
  path: '/house-painting-cost-calculator',
})

export default function HousePaintingCostCalculatorPage() {
  const costFactors = [
    {
      icon: <Home className="w-8 h-8 text-blue-600" />,
      factor: "House Size",
      impact: "Most significant cost factor",
      range: "$1,500 - $15,000+",
      details: "Square footage determines material and labor needs"
    },
    {
      icon: <PaintBucket className="w-8 h-8 text-green-600" />,
      factor: "Paint Quality",
      impact: "Affects durability and appearance",
      range: "$30 - $80 per gallon",
      details: "Premium paints last 2-3x longer than basic options"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      factor: "Labor Costs",
      impact: "Varies by region and contractor",
      range: "$25 - $75 per hour",
      details: "Professional painters vs DIY can save 40-60%"
    },
    {
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      factor: "Surface Condition",
      impact: "Prep work requirements",
      range: "+20% - 50% to base cost",
      details: "Scraping, priming, repairs add significant time"
    }
  ]

  const houseSizeCosts = [
    {
      size: "Small House (1,000-1,500 sq ft)",
      interior: "$2,500 - $4,500",
      exterior: "$3,000 - $6,500",
      both: "$5,500 - $11,000",
      rooms: "2-3 bedrooms, 1-2 bathrooms",
      timeframe: "3-7 days total"
    },
    {
      size: "Medium House (1,500-2,500 sq ft)",
      interior: "$3,500 - $7,500", 
      exterior: "$5,500 - $10,500",
      both: "$9,000 - $18,000",
      rooms: "3-4 bedrooms, 2-3 bathrooms",
      timeframe: "5-10 days total"
    },
    {
      size: "Large House (2,500-4,000 sq ft)",
      interior: "$6,000 - $12,000",
      exterior: "$9,500 - $16,000", 
      both: "$15,500 - $28,000",
      rooms: "4-5 bedrooms, 3-4 bathrooms",
      timeframe: "8-15 days total"
    },
    {
      size: "Luxury House (4,000+ sq ft)",
      interior: "$10,000 - $20,000+",
      exterior: "$15,000 - $30,000+",
      both: "$25,000 - $50,000+",
      rooms: "5+ bedrooms, 4+ bathrooms",
      timeframe: "12-25 days total"
    }
  ]

  const regionalPricing = [
    {
      region: "Northeast (NY, NJ, CT, MA)",
      laborRate: "$45 - $75/hour",
      interiorCost: "$3.50 - $6.50/sq ft",
      exteriorCost: "$2.50 - $4.50/sq ft",
      premium: "+25-40% above national average"
    },
    {
      region: "West Coast (CA, WA, OR)",
      laborRate: "$40 - $70/hour", 
      interiorCost: "$3.25 - $6.00/sq ft",
      exteriorCost: "$2.25 - $4.25/sq ft",
      premium: "+20-35% above national average"
    },
    {
      region: "Southeast (FL, GA, NC, SC)",
      laborRate: "$25 - $45/hour",
      interiorCost: "$2.00 - $4.00/sq ft", 
      exteriorCost: "$1.50 - $3.00/sq ft",
      premium: "5-15% below national average"
    },
    {
      region: "Midwest (IL, IN, OH, MI)",
      laborRate: "$25 - $50/hour",
      interiorCost: "$2.25 - $4.50/sq ft",
      exteriorCost: "$1.75 - $3.25/sq ft",
      premium: "National average pricing"
    },
    {
      region: "Southwest (TX, AZ, NV, NM)",
      laborRate: "$25 - $45/hour",
      interiorCost: "$2.00 - $4.25/sq ft",
      exteriorCost: "$1.50 - $3.25/sq ft",
      premium: "5-10% below national average"
    }
  ]

  const contractorTips = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      tip: "Get Multiple Quotes",
      description: "Compare at least 3 licensed contractors. Prices can vary 30-50% for the same job.",
      action: "Ask for detailed breakdowns to compare accurately"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      tip: "Verify Licensing & Insurance",
      description: "Ensure contractors have proper licensing, liability insurance, and workers' compensation.",
      action: "Ask to see certificates and verify with issuing agencies"
    },
    {
      icon: <Star className="w-6 h-6 text-purple-600" />,
      tip: "Check References & Reviews",
      description: "Look at recent work, read online reviews, and ask for customer references.",
      action: "Visit recent job sites if possible to see quality"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      tip: "Understand Timeline",
      description: "Good contractors are often booked 2-4 weeks out. Beware of immediate availability.",
      action: "Plan your project during contractor's slower seasons"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">House Painting Cost</span> Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get accurate estimates for <strong>interior and exterior house painting</strong>. 
            Compare costs, find qualified <strong>house painters near you</strong>, and make informed decisions for your project.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-green-600 hover:bg-green-700">
              <Link href="#calculator">
                Calculate House Painting Cost
                <Calculator className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="#find-painters">
                Find Local Painters
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Instant estimates</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span>Local pricing data</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5 text-green-500" />
              <span>Interior & exterior</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>Contractor finder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Affects House Painting Costs?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding these key factors helps you budget accurately and avoid surprises
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {costFactors.map((factor, index) => (
              <Card key={index} className="border-2 hover:border-green-200 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {factor.icon}
                  </div>
                  <CardTitle className="text-xl">{factor.factor}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-green-600 font-bold text-lg">{factor.range}</p>
                      <p className="text-sm text-gray-600">{factor.impact}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">{factor.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* House Size Cost Breakdown */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              House Painting Costs by Size
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Typical cost ranges for interior, exterior, and complete house painting projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {houseSizeCosts.map((house, index) => (
              <Card key={index} className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="text-xl text-green-900">{house.size}</CardTitle>
                  <p className="text-gray-600">{house.rooms}</p>
                  <p className="text-sm text-blue-600 font-medium">Project Timeline: {house.timeframe}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
                        <p className="text-sm text-blue-700 font-medium">Interior Only</p>
                        <p className="text-lg font-bold text-blue-800">{house.interior}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center">
                        <p className="text-sm text-green-700 font-medium">Exterior Only</p>
                        <p className="text-lg font-bold text-green-800">{house.exterior}</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-center">
                        <p className="text-sm text-purple-700 font-medium">Complete House</p>
                        <p className="text-lg font-bold text-purple-800">{house.both}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Includes:</strong> Labor, materials, basic prep work, cleanup. Premium finishes and extensive repairs cost extra.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              House Painting Costs by Region
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Labor costs and material prices vary significantly by geographic location
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {regionalPricing.map((region, index) => (
              <Card key={index} className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">{region.region}</CardTitle>
                  <p className="text-green-600 font-semibold">{region.premium}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-600">Labor Rate</p>
                        <p className="font-bold text-gray-900">{region.laborRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interior Cost</p>
                        <p className="font-bold text-blue-800">{region.interiorCost}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Exterior Cost per Sq Ft</p>
                      <p className="font-bold text-green-800">{region.exteriorCost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
              National Average House Painting Costs
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-blue-700 font-medium">Interior Painting</p>
                <p className="text-3xl font-bold text-blue-900">$2.75/sq ft</p>
                <p className="text-sm text-blue-600">Includes labor & materials</p>
              </div>
              <div>
                <p className="text-green-700 font-medium">Exterior Painting</p>
                <p className="text-3xl font-bold text-green-900">$2.25/sq ft</p>
                <p className="text-sm text-green-600">Includes prep work & primer</p>
              </div>
              <div>
                <p className="text-purple-700 font-medium">Complete House</p>
                <p className="text-3xl font-bold text-purple-900">$12,500</p>
                <p className="text-sm text-purple-600">Average 2,500 sq ft home</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section id="calculator" className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              House Painting Cost Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Get an instant estimate for your house painting project
            </p>
          </div>
          
          <Card className="border-2 border-green-200 shadow-xl">
            <CardContent className="p-8">
              <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">
                  🏠 Want Professional Results?
                </h3>
                <p className="text-yellow-700 mb-4">
                  This calculator gives rough estimates. For accurate quotes that account for your specific house 
                  and local conditions, connect with qualified painters in your area.
                </p>
                <Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <Link href="#find-painters">
                    Find Local House Painters
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">House Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">House Square Footage</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="2000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stories</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>1 Story</option>
                        <option>1.5 Stories</option>
                        <option>2 Stories</option>
                        <option>3+ Stories</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Location</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Northeast (High Cost)</option>
                        <option>West Coast (High Cost)</option>
                        <option>Southeast (Low Cost)</option>
                        <option>Midwest (Average Cost)</option>
                        <option>Southwest (Low Cost)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Scope</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Painting Type</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Interior Only</option>
                        <option>Exterior Only</option>
                        <option>Complete House (Interior + Exterior)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paint Quality</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Standard Paint ($35-45/gallon)</option>
                        <option>Premium Paint ($50-65/gallon)</option>
                        <option>Ultra-Premium Paint ($70-85/gallon)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">House Condition</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Good (minimal prep needed)</option>
                        <option>Fair (moderate prep work)</option>
                        <option>Poor (extensive prep required)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-lg py-6">
                Calculate House Painting Cost
                <Calculator className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Find Local Painters */}
      <section id="find-painters" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Qualified House Painters Near You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with licensed, insured contractors who provide detailed quotes and quality work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {contractorTips.map((tip, index) => (
              <Card key={index} className="border-2 border-blue-100">
                <CardHeader>
                  <div className="mb-4">{tip.icon}</div>
                  <CardTitle className="text-lg">{tip.tip}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{tip.description}</p>
                  <p className="text-sm font-semibold text-blue-700">✓ {tip.action}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-green-900 mb-4">
                Get Quotes from Pre-Screened House Painters
              </h3>
              <p className="text-green-700 mb-6">
                Connect with licensed, insured painting contractors in your area. 
                Compare quotes and read verified reviews before making your decision.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Licensed & Insured</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Background Checked</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">Customer Reviews</span>
                </div>
              </div>
              <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/trial-signup">
                  Find Local Painters
                  <MapPin className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* For Contractors */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Painting Contractors: Calculate Your Revenue Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how professional quote software helps house painters win more jobs and increase revenue
            </p>
          </div>
          
          <ROICalculator className="mb-8" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Accurate House Painting Costs?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Use our calculator for estimates, then connect with qualified local painters for detailed quotes
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" asChild className="text-lg px-12 py-6">
              <Link href="#calculator">
                Calculate Your Costs
                <Calculator className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/trial-signup">
                Find Local Painters
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-green-200 text-sm">
            <div>✓ Instant cost estimates</div>
            <div>✓ Regional pricing data</div>
            <div>✓ Licensed contractor network</div>
          </div>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "House Painting Cost Calculator",
            "description": "Calculate house painting costs for interior and exterior projects. Find local painters and compare quotes.",
            "url": "https://propaintquote.com/house-painting-cost-calculator",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "audience": {
              "@type": "Audience",
              "audienceType": "Homeowners"
            },
            "featureList": [
              "House painting cost calculator",
              "Interior painting estimates",
              "Exterior painting costs", 
              "Regional pricing data",
              "Local painter finder",
              "Quote comparison tool"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free house painting calculator"
            }
          })
        }}
      />
    </div>
  )
}