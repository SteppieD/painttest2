import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home,
  Building2,
  Palette,
  CloudRain,
  Sun,
  Shield,
  Ruler,
  DollarSign,
  Target,
  TrendingUp,
  Smartphone,
  TreePine,
  Thermometer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'

export const metadata: Metadata = {
  title: 'Exterior Painting Estimate Calculator | Free House Paint Cost Estimator',
  description: 'Free exterior painting estimate calculator. Get accurate costs for house exterior, siding, trim painting. Professional tool used by 5,000+ contractors nationwide.',
  keywords: 'exterior paint quote, exterior house paint estimate, exterior painting estimate, house exterior paint cost, siding painting estimate, exterior paint calculator, how to estimate exterior paint job, exterior paint cost calculator',
  alternates: {
    canonical: '/exterior-painting-estimate-calculator',
  },
  openGraph: {
    title: 'Exterior Painting Estimate Calculator - Free Professional Tool',
    description: 'Calculate accurate exterior house painting estimates. Professional calculator for siding, trim, and exterior surfaces.',
    url: '/exterior-painting-estimate-calculator',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

export default function ExteriorPaintingEstimateCalculatorPage() {
  const exteriorSurfaces = [
    {
      icon: <Home className="w-8 h-8 text-blue-600" />,
      name: "Vinyl Siding",
      costPerSqFt: "$1.25 - $2.50",
      prepWork: "Pressure washing, caulking gaps",
      paintType: "100% acrylic latex",
      considerations: ["Surface texture", "Color retention", "Moisture protection"]
    },
    {
      icon: <Building2 className="w-8 h-8 text-green-600" />,
      name: "Wood Siding",
      costPerSqFt: "$1.75 - $3.25", 
      prepWork: "Scraping, sanding, priming",
      paintType: "High-quality acrylic",
      considerations: ["Rot inspection", "Primer requirement", "Stain blocking"]
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      name: "Brick & Masonry",
      costPerSqFt: "$1.50 - $3.00",
      prepWork: "Power washing, efflorescence removal",
      paintType: "Masonry-specific paint",
      considerations: ["Breathable paint", "Alkaline resistance", "Texture spray"]
    },
    {
      icon: <TreePine className="w-8 h-8 text-orange-600" />,
      name: "Stucco",
      costPerSqFt: "$1.50 - $2.75",
      prepWork: "Cleaning, crack filling",
      paintType: "Elastomeric coating",
      considerations: ["Crack bridging", "Texture matching", "UV protection"]
    }
  ]

  const houseSizes = [
    {
      type: "Small House (1,000-1,500 sq ft)",
      exteriorSqFt: "1,200-1,800 sq ft",
      avgCost: "$3,000 - $6,500",
      paintNeeded: "8-12 gallons",
      timeEstimate: "3-5 days",
      crew: "2-3 painters"
    },
    {
      type: "Medium House (1,500-2,500 sq ft)", 
      exteriorSqFt: "1,800-3,000 sq ft",
      avgCost: "$5,500 - $10,500",
      paintNeeded: "12-18 gallons",
      timeEstimate: "5-8 days",
      crew: "3-4 painters"
    },
    {
      type: "Large House (2,500-4,000 sq ft)",
      exteriorSqFt: "3,000-4,800 sq ft",
      avgCost: "$9,500 - $16,000",
      paintNeeded: "18-25 gallons",
      timeEstimate: "8-12 days", 
      crew: "4-5 painters"
    },
    {
      type: "Two-Story House",
      exteriorSqFt: "2,200-3,500 sq ft",
      avgCost: "$7,000 - $13,500",
      paintNeeded: "15-22 gallons",
      timeEstimate: "6-10 days",
      crew: "3-4 painters"
    }
  ]

  const exteriorFactors = [
    {
      icon: <CloudRain className="w-6 h-6 text-blue-600" />,
      factor: "Weather Conditions",
      impact: "Temperature 50-85°F, low humidity",
      cost: "Delays can add 20-30% to timeline"
    },
    {
      icon: <Ruler className="w-6 h-6 text-green-600" />,
      factor: "Surface Area Calculation",
      impact: "Height × Perimeter - Windows/Doors",
      cost: "Accurate measurement critical for materials"
    },
    {
      icon: <Palette className="w-6 h-6 text-purple-600" />,
      factor: "Paint Quality",
      impact: "Premium vs standard exterior paint",
      cost: "$40-$80 per gallon difference"
    },
    {
      icon: <Shield className="w-6 h-6 text-orange-600" />,
      factor: "Prep Work Required",
      impact: "Scraping, priming, caulking",
      cost: "30-50% of total project cost"
    },
    {
      icon: <Thermometer className="w-6 h-6 text-red-600" />,
      factor: "Number of Coats",
      impact: "Primer + 1-2 finish coats",
      cost: "Each additional coat adds 40% to materials"
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      factor: "Architectural Details",
      impact: "Trim, shutters, complex features",
      cost: "Detail work: $3-8 per linear foot"
    }
  ]

  const seasonalConsiderations = [
    {
      season: "Spring (March-May)",
      pros: ["Mild temperatures", "Lower humidity", "High demand season"],
      cons: ["Rain delays possible", "Pollen issues", "Premium pricing"],
      ideal: "Best overall painting season"
    },
    {
      season: "Summer (June-August)", 
      pros: ["Consistent weather", "Long daylight hours", "Fast cure times"],
      cons: ["Heat stress on workers", "Paint dries too fast", "Peak pricing"],
      ideal: "Good for quick turnaround projects"
    },
    {
      season: "Fall (September-November)",
      pros: ["Stable weather", "Lower humidity", "Competitive pricing"],
      cons: ["Shorter days", "Leaf debris", "Rain season starting"],
      ideal: "Excellent value season"
    },
    {
      season: "Winter (December-February)",
      pros: ["Lowest pricing", "Available contractors", "Indoor prep work"],
      cons: ["Temperature limits", "Shorter days", "Weather delays"],
      ideal: "Planning and preparation season"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Free <span className="text-green-600">Exterior Painting</span> Estimate Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get accurate estimates for <strong>house exterior, siding, trim, and outdoor surfaces</strong>. 
            Professional calculator used by <strong>5,000+ contractors</strong> for precise exterior painting quotes.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-green-600 hover:bg-green-700">
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
              <span>Weather considerations</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5 text-green-500" />
              <span>Surface-specific pricing</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5 text-green-500" />
              <span>All exterior surfaces</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              <span>Mobile-friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Exterior Surface Types */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exterior Painting Estimates by Surface Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different exterior surfaces require specific preparation, paint types, and pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {exteriorSurfaces.map((surface, index) => (
              <Card key={index} className="border-2 hover:border-green-200 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {surface.icon}
                  </div>
                  <CardTitle className="text-xl">{surface.name}</CardTitle>
                  <p className="text-green-600 font-bold">{surface.costPerSqFt}/sq ft</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Prep Work:</h4>
                      <p className="text-sm text-gray-600">{surface.prepWork}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Paint Type:</h4>
                      <p className="text-sm text-gray-600">{surface.paintType}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Factors:</h4>
                      <ul className="space-y-1">
                        {surface.considerations.map((factor, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
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

      {/* House Size Estimates */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Exterior House Painting Estimates by Size
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete exterior painting costs based on house size and complexity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {houseSizes.map((house, index) => (
              <Card key={index} className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="text-xl text-green-900">{house.type}</CardTitle>
                  <p className="text-gray-600">Exterior Surface: {house.exteriorSqFt}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <p className="text-sm text-green-700 font-medium">Total Cost Range</p>
                        <p className="text-lg font-bold text-green-800">{house.avgCost}</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium">Paint Needed</p>
                        <p className="text-lg font-bold text-blue-800">{house.paintNeeded}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                        <p className="text-sm text-purple-700 font-medium">Time Estimate</p>
                        <p className="text-lg font-bold text-purple-800">{house.timeEstimate}</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                        <p className="text-sm text-orange-700 font-medium">Crew Size</p>
                        <p className="text-lg font-bold text-orange-800">{house.crew}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Includes:</strong> Power washing, minor repairs, primer, 2 coats quality exterior paint
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Factors */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Factors in Exterior Painting Estimates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional considerations that affect exterior painting costs and timelines
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exteriorFactors.map((factor, index) => (
              <Card key={index} className="border-2 border-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {factor.icon}
                    <span className="text-lg">{factor.factor}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Impact:</p>
                      <p className="text-gray-700">{factor.impact}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Cost Effect:</p>
                      <p className="text-blue-800 font-semibold">{factor.cost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-green-50 border border-green-200 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-green-900 mb-4 text-center">
              Complete Exterior Painting Formula
            </h3>
            <div className="text-center text-lg">
              <p className="text-green-800 font-semibold mb-2">
                Surface Area × Cost per Sq Ft + Prep Work + Materials + Overhead + Profit
              </p>
              <p className="text-green-700">
                Example: 2,000 sq ft × $2.25 + $800 prep + $600 materials + $510 overhead + $680 profit = <strong>$6,090 total</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Considerations */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Time for Exterior Painting
            </h2>
            <p className="text-xl text-gray-600">
              Seasonal factors that affect exterior painting success and pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {seasonalConsiderations.map((season, index) => (
              <Card key={index} className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">{season.season}</CardTitle>
                  <p className="text-lg font-semibold text-green-700">{season.ideal}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Advantages:</h4>
                      <ul className="space-y-1">
                        {season.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">Challenges:</h4>
                      <ul className="space-y-1">
                        {season.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-orange-500 mt-1">•</span>
                            {con}
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

      {/* Basic Calculator Section */}
      <section id="calculator" className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Exterior Paint Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Get an instant estimate for your exterior painting project
            </p>
          </div>
          
          <Card className="border-2 border-green-200 shadow-xl">
            <CardContent className="p-8">
              <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">
                  🎯 Want Weather-Resistant Results?
                </h3>
                <p className="text-yellow-700 mb-4">
                  This basic calculator gives rough estimates. For exterior projects that last 10+ years, 
                  contractors use our professional software with climate-specific recommendations.
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
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">House Dimensions</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">House Height (feet)</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">House Perimeter (feet)</label>
                      <input type="number" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="150" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stories</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>1 Story</option>
                        <option>1.5 Stories</option>
                        <option>2 Stories</option>
                        <option>3+ Stories</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Surface Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Surface Type</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Vinyl Siding</option>
                        <option>Wood Siding</option>
                        <option>Brick/Masonry</option>
                        <option>Stucco</option>
                        <option>Mixed Surfaces</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paint Quality</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Standard Exterior ($45/gallon)</option>
                        <option>Premium Exterior ($65/gallon)</option>
                        <option>Ultra-Premium ($85/gallon)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>Good (minimal prep)</option>
                        <option>Fair (moderate prep)</option>
                        <option>Poor (extensive prep)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-8 bg-green-600 hover:bg-green-700 text-lg py-6">
                Calculate Exterior Paint Estimate
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
              See how professional quote software increases your exterior painting business revenue
            </p>
          </div>
          
          <ROICalculator className="mb-8" />
        </div>
      </section>

      {/* Why Contractors Choose Our Calculator */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why 5,000+ Contractors Trust Our Exterior Paint Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Professional features designed for exterior painting challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <CloudRain className="w-6 h-6" />
                  Weather-Smart Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our calculator factors in seasonal pricing, weather delays, and optimal painting conditions 
                  for exterior projects that last 10+ years.
                </p>
                <p className="text-sm font-semibold text-green-700">
                  ✓ Climate-specific paint recommendations included
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Shield className="w-6 h-6" />
                  Surface-Specific Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Different exterior surfaces require unique prep work, paint types, and application methods. 
                  Our calculator handles all surface variations automatically.
                </p>
                <p className="text-sm font-semibold text-blue-700">
                  ✓ Vinyl, wood, brick, stucco, and mixed surfaces covered
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <TrendingUp className="w-6 h-6" />
                  Win More Exterior Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Professional exterior painting quotes show homeowners you understand the complexity 
                  of outdoor projects and weather protection requirements.
                </p>
                <p className="text-sm font-semibold text-purple-700">
                  ✓ 40-60% higher win rates with detailed exterior quotes
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Smartphone className="w-6 h-6" />
                  On-Site Estimates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Walk around the house with customers, input measurements and surface conditions, 
                  and deliver professional exterior quotes immediately.
                </p>
                <p className="text-sm font-semibold text-orange-700">
                  ✓ Close exterior projects while walking the property
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Professional Exterior Paint Quotes?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join contractors who've increased their exterior painting revenue by 40-60% with weather-smart quote software
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" asChild className="text-lg px-12 py-6">
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Included
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/painting-contractors">
                Learn More About Our Software
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-green-200 text-sm">
            <div>✓ All exterior surfaces covered</div>
            <div>✓ Weather considerations included</div>
            <div>✓ Mobile-friendly calculator</div>
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
            "name": "Exterior Painting Estimate Calculator",
            "description": "Free exterior house painting estimate calculator for all surface types and weather conditions.",
            "url": "https://propaintquote.com/exterior-painting-estimate-calculator",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "audience": {
              "@type": "Audience",
              "audienceType": "Painting Contractors"
            },
            "featureList": [
              "House exterior calculations",
              "Surface-specific pricing", 
              "Weather considerations",
              "Siding painting estimates",
              "Trim and detail work",
              "Seasonal pricing factors"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free exterior painting calculator"
            }
          })
        }}
      />
    </div>
  )
}