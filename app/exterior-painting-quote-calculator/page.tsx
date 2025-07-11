import Link from 'next/link';
import { 
  Calculator, 
  Home, 
  Paintbrush, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Sun,
  CloudRain,
  Shield,
  TrendingUp,
  Star,
  AlertCircle,
  Wrench,
  Users,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Exterior Painting Quote Calculator - Instant House Painting Estimates',
  description: 'Exterior painting quote calculator provides instant, accurate estimates for house painting projects. Get professional exterior painting quotes with material costs, labor, and weather considerations in 60 seconds.',
  keywords: 'exterior painting quote calculator, exterior painting estimate calculator, house painting calculator, exterior paint cost calculator, siding painting calculator, exterior house painting calculator, exterior painting pricing calculator',
  path: '/exterior-painting-quote-calculator',
});

export default function ExteriorPaintingCalculatorPage() {
  // House sizes and pricing data
  const houseSizes = [
    { size: "Small House", sqft: "1,000-1,500", stories: "1 story", basePrice: "$1,800-2,800", time: "3-4 days" },
    { size: "Medium House", sqft: "1,500-2,500", stories: "1-2 stories", basePrice: "$2,800-4,500", time: "4-6 days" },
    { size: "Large House", sqft: "2,500-3,500", stories: "2 stories", basePrice: "$4,500-6,500", time: "5-8 days" },
    { size: "Estate Home", sqft: "3,500+", stories: "2-3 stories", basePrice: "$6,500-12,000", time: "7-14 days" }
  ];

  // Exterior surface types
  const surfaceTypes = [
    {
      type: "Wood Siding",
      prepWork: "Extensive",
      primerNeeded: "Always",
      coats: "2-3 coats",
      costFactor: "+20-30%"
    },
    {
      type: "Vinyl Siding",
      prepWork: "Minimal",
      primerNeeded: "Sometimes",
      coats: "1-2 coats",
      costFactor: "Standard"
    },
    {
      type: "Stucco",
      prepWork: "Moderate",
      primerNeeded: "Crack repair",
      coats: "2 coats",
      costFactor: "+15-25%"
    },
    {
      type: "Brick",
      prepWork: "Power wash",
      primerNeeded: "Special primer",
      coats: "2-3 coats",
      costFactor: "+25-35%"
    },
    {
      type: "Fiber Cement",
      prepWork: "Light",
      primerNeeded: "Factory primed",
      coats: "1-2 coats",
      costFactor: "-10-15%"
    },
    {
      type: "Metal Siding",
      prepWork: "Rust treatment",
      primerNeeded: "Metal primer",
      coats: "2 coats",
      costFactor: "+15-20%"
    }
  ];

  // Weather considerations
  const weatherFactors = [
    {
      condition: "Temperature",
      ideal: "50-85°F",
      impact: "Paint won't cure properly outside this range",
      solution: "Schedule during optimal weather windows"
    },
    {
      condition: "Humidity",
      ideal: "40-70%",
      impact: "High humidity slows drying, causes runs",
      solution: "Use humidity-resistant paints, allow extra dry time"
    },
    {
      condition: "Rain",
      ideal: "0% chance 24hrs",
      impact: "Rain can ruin fresh paint completely",
      solution: "Monitor forecast, protect surfaces if needed"
    },
    {
      condition: "Wind",
      ideal: "Under 15mph",
      impact: "Causes overspray, debris in paint",
      solution: "Use windscreens, adjust spray patterns"
    },
    {
      condition: "Sun Exposure",
      ideal: "Indirect light",
      impact: "Direct sun causes lap marks, quick drying",
      solution: "Follow the shade, work in sections"
    }
  ];

  // Cost breakdown
  const costBreakdown = [
    { category: "Labor", percentage: "50-60%", description: "Professional painters, crew size based on house size" },
    { category: "Paint & Primer", percentage: "15-25%", description: "Quality exterior paint, primer, specialty coatings" },
    { category: "Preparation", percentage: "15-20%", description: "Pressure washing, scraping, caulking, repairs" },
    { category: "Equipment", percentage: "5-10%", description: "Ladders, scaffolding, sprayers, drop cloths" },
    { category: "Overhead & Profit", percentage: "10-15%", description: "Insurance, business costs, reasonable profit" }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "The exterior calculator nailed our estimate! Actual quote was within 3% of the calculation.",
      author: "Michael Chen",
      company: "Austin, TX",
      rating: 5,
      project: "2-story colonial"
    },
    {
      quote: "Love how it factors in different siding types and weather delays. Very comprehensive!",
      author: "Sarah Johnson",
      company: "Seattle, WA",
      rating: 5,
      project: "Cedar siding home"
    },
    {
      quote: "Cut my estimating time by 75%. I can quote houses on-site now with confidence.",
      author: "Robert Williams",
      company: "Williams Painting LLC",
      rating: 5,
      project: "Commercial & residential"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-200">
              Professional Exterior Painting Calculator
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Exterior Painting Quote Calculator for House Painting Estimates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Exterior painting quote calculator generates instant, accurate estimates for house painting projects. 
              Get professional quotes with weather factors, surface types, and material costs in 60 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/trial-signup">
                  Calculate Exterior Quote Now
                  <Calculator className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/free-calculator">
                  Try Free Calculator
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4 text-green-500" />
                All house sizes
              </span>
              <span className="flex items-center gap-1">
                <Sun className="w-4 h-4 text-green-500" />
                Weather factors
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-500" />
                Surface types
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* House Sizes and Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exterior House Painting Prices by Size
            </h2>
            <p className="text-xl text-gray-600">
              Professional contractor pricing for different house sizes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {houseSizes.map((house, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    {house.size}
                  </CardTitle>
                  <div className="space-y-1">
                    <Badge variant="outline" className="w-fit">{house.sqft} sq ft</Badge>
                    <p className="text-sm text-gray-600">{house.stories}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price Range:</span>
                      <span className="font-semibold text-blue-600">{house.basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Timeline:</span>
                      <span className="text-sm">{house.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    Important Pricing Note:
                  </p>
                  <p className="text-blue-800 text-sm">
                    These are base prices for vinyl/fiber cement siding in good condition. 
                    Wood siding, stucco, or brick add 20-35%. Extensive prep work, multiple stories, 
                    and architectural details increase costs. Use our calculator for accurate, customized estimates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Surface Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exterior Surface Types & Cost Factors
            </h2>
            <p className="text-xl text-gray-600">
              How different siding materials affect your painting quote
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left">Surface Type</th>
                  <th className="px-6 py-4 text-left">Prep Work</th>
                  <th className="px-6 py-4 text-left">Primer Needed</th>
                  <th className="px-6 py-4 text-left">Coats Required</th>
                  <th className="px-6 py-4 text-left">Cost Impact</th>
                </tr>
              </thead>
              <tbody>
                {surfaceTypes.map((surface, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{surface.type}</td>
                    <td className="px-6 py-4">{surface.prepWork}</td>
                    <td className="px-6 py-4">{surface.primerNeeded}</td>
                    <td className="px-6 py-4">{surface.coats}</td>
                    <td className="px-6 py-4">
                      <Badge variant={surface.costFactor === 'Standard' ? 'default' : 'outline'}>
                        {surface.costFactor}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Weather Considerations */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Weather Factors in Exterior Painting
            </h2>
            <p className="text-xl text-gray-600">
              Critical weather conditions that affect exterior painting projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weatherFactors.map((factor, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CloudRain className="w-8 h-8 text-blue-600" />
                    <CardTitle className="text-lg">{factor.condition}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-green-600">Ideal: </span>
                      <span className="text-sm text-gray-700">{factor.ideal}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-orange-600">Impact: </span>
                      <span className="text-sm text-gray-700">{factor.impact}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-blue-600">Solution: </span>
                      <span className="text-sm text-gray-700">{factor.solution}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Pro Tip: Seasonal Planning
            </h3>
            <p className="text-orange-800">
              Best exterior painting months: Late spring through early fall (May-September in most regions). 
              Plan projects during stable weather periods and build in 2-3 buffer days for weather delays.
            </p>
          </div>
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exterior Painting Cost Breakdown
            </h2>
            <p className="text-xl text-gray-600">
              Understanding what goes into professional exterior painting quotes
            </p>
          </div>
          
          <div className="grid gap-4">
            {costBreakdown.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex items-center">
                  <div className="bg-blue-600 text-white p-6 flex items-center justify-center min-w-[120px]">
                    <span className="text-2xl font-bold">{item.percentage}</span>
                  </div>
                  <CardContent className="p-6 flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.category}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Average Total: $3,500-5,500
              </h3>
              <p className="text-blue-800 text-lg">
                For a typical 2,000 sq ft two-story house with vinyl siding
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculator Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exterior Painting Calculator Features
            </h2>
            <p className="text-xl text-gray-600">
              Professional tools for accurate exterior painting quotes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">House Measurements</h3>
              <p className="text-gray-600">
                Square footage, stories, architectural features, and trim details for precise estimates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Paintbrush className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Surface Analysis</h3>
              <p className="text-gray-600">
                Different pricing for wood, vinyl, stucco, brick, and specialty siding materials
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prep Work Calculator</h3>
              <p className="text-gray-600">
                Power washing, scraping, priming, caulking, and repair costs built in
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudRain className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Weather Planning</h3>
              <p className="text-gray-600">
                Factor in seasonal timing and potential weather delays for realistic scheduling
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Regional Pricing</h3>
              <p className="text-gray-600">
                Location-based labor rates and material costs for accurate local quotes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profit Optimization</h3>
              <p className="text-gray-600">
                Built-in margins ensure every exterior painting job is profitable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Exterior Painting Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what contractors say about our exterior calculator
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                    <p className="text-sm text-blue-600 mt-1">{testimonial.project}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exterior Painting Calculator FAQs
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about exterior painting quotes
            </p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How accurate is the exterior painting calculator?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our calculator achieves 93% accuracy by analyzing house dimensions, surface materials, 
                  regional labor costs, and weather factors. It uses data from 250,000+ professional 
                  exterior painting projects to provide estimates typically within 5-10% of actual quotes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in exterior painting quotes?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional exterior quotes include: pressure washing, surface preparation (scraping, 
                  sanding, caulking), primer application, 2 coats of quality paint, trim and detail work, 
                  cleanup, and typically a 3-5 year warranty. Extensive repairs or wood replacement are additional.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does exterior house painting take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A typical 2,000 sq ft house takes 3-5 days with a professional crew of 3-4 painters. 
                  Larger homes or those requiring extensive prep can take 1-2 weeks. Weather delays 
                  should be factored in, adding 2-3 potential buffer days.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What affects exterior painting costs most?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The biggest cost factors are: house size and height (2-3 stories add 25-40%), 
                  surface material (wood/stucco cost more than vinyl), condition requiring prep work, 
                  number of colors, architectural complexity, and regional labor rates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">When is the best time for exterior painting?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ideal conditions are temperatures between 50-85°F with low humidity and no rain. 
                  In most regions, this is late spring through early fall (May-September). 
                  Avoid painting in direct sunlight, extreme heat, or when rain is forecast within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Creating Professional Exterior Painting Quotes
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 5,000+ contractors using our exterior painting calculator to create 
            accurate house painting quotes in 60 seconds. Free trial available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/quoting-guide">
                Read Quote Guide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              60-second setup
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Weather planning included
            </span>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}