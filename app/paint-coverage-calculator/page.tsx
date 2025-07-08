import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Paintbrush, 
  Ruler, 
  Info, 
  CheckCircle, 
  ArrowRight,
  Home,
  Building,
  AlertCircle,
  BarChart3,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';

export const metadata: Metadata = {
  title: 'Paint Coverage Calculator - Square Footage Paint Calculator | ProPaint Quote',
  description: 'Paint coverage calculator determines exactly how much paint you need. Calculate gallons by square footage, room dimensions, and surface type. Free tool used by 5,000+ contractors.',
  keywords: 'paint coverage calculator, paint calculator square feet, wall paint calculator, paint needed calculator, paint coverage per gallon, how much paint calculator, paint square footage calculator, paint consumption calculator',
  alternates: {
    canonical: '/paint-coverage-calculator',
  },
  openGraph: {
    title: 'Paint Coverage Calculator - Calculate Gallons Needed by Square Feet',
    description: 'Paint coverage calculator shows exactly how many gallons you need. Input square footage or room dimensions for accurate paint calculations. Free professional tool.',
    url: '/paint-coverage-calculator',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function PaintCoverageCalculatorPage() {
  // Paint coverage data by type
  const paintCoverageRates = [
    {
      type: "Flat/Matte Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Ceilings, low-traffic areas",
      coats: "Usually 2 coats",
      absorption: "High absorption"
    },
    {
      type: "Eggshell Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Living rooms, bedrooms",
      coats: "2 coats standard",
      absorption: "Moderate absorption"
    },
    {
      type: "Satin Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "High-traffic areas, kitchens",
      coats: "1-2 coats",
      absorption: "Low absorption"
    },
    {
      type: "Semi-Gloss Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Bathrooms, trim, doors",
      coats: "1-2 coats",
      absorption: "Very low absorption"
    },
    {
      type: "Gloss Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Cabinets, furniture",
      coats: "1-2 coats",
      absorption: "Minimal absorption"
    },
    {
      type: "Primer",
      coverage: "200-300 sq ft/gallon",
      bestFor: "New drywall, stains",
      coats: "1 coat",
      absorption: "Seals surface"
    }
  ];

  // Surface type factors
  const surfaceFactors = [
    { surface: "Smooth Drywall", factor: "1.0x", note: "Standard coverage rate" },
    { surface: "Textured Walls", factor: "1.15x", note: "15% more paint needed" },
    { surface: "Rough Stucco", factor: "1.5x", note: "50% more paint needed" },
    { surface: "Bare Wood", factor: "1.25x", note: "25% more for first coat" },
    { surface: "Previously Painted", factor: "0.9x", note: "10% less paint needed" },
    { surface: "New Drywall", factor: "1.3x", note: "30% more for primer + paint" }
  ];

  // Room size examples
  const roomExamples = [
    {
      room: "Small Bedroom",
      dimensions: "10' x 10' x 8'",
      wallArea: "320 sq ft",
      paintNeeded: "0.8-1 gallon",
      with2Coats: "1.5-2 gallons"
    },
    {
      room: "Master Bedroom",
      dimensions: "14' x 16' x 9'",
      wallArea: "540 sq ft",
      paintNeeded: "1.4-1.5 gallons",
      with2Coats: "2.5-3 gallons"
    },
    {
      room: "Living Room",
      dimensions: "16' x 20' x 10'",
      wallArea: "720 sq ft",
      paintNeeded: "1.8-2 gallons",
      with2Coats: "3.5-4 gallons"
    },
    {
      room: "Average House Interior",
      dimensions: "2,000 sq ft home",
      wallArea: "5,500 sq ft",
      paintNeeded: "14-16 gallons",
      with2Coats: "28-32 gallons"
    }
  ];

  // Coverage calculation tips
  const calculationTips = [
    {
      tip: "Measure Accurately",
      description: "Length × Height for each wall, then add together",
      example: "4 walls: (12×8) + (12×8) + (10×8) + (10×8) = 352 sq ft"
    },
    {
      tip: "Subtract Openings",
      description: "Deduct doors (20 sq ft) and windows (15 sq ft each)",
      example: "352 sq ft - 20 (door) - 30 (2 windows) = 302 sq ft"
    },
    {
      tip: "Add 10% Buffer",
      description: "Always buy extra for touch-ups and mistakes",
      example: "302 sq ft + 10% = 332 sq ft total"
    },
    {
      tip: "Consider Ceiling",
      description: "Ceiling = Length × Width of room",
      example: "12 × 10 = 120 sq ft for ceiling"
    }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: "Forgetting Second Coat",
      impact: "Running out mid-project",
      solution: "Always calculate for 2 coats"
    },
    {
      mistake: "Not Accounting for Texture",
      impact: "15-50% shortage",
      solution: "Use surface factor multipliers"
    },
    {
      mistake: "Ignoring Primer Needs",
      impact: "Poor coverage, more coats",
      solution: "Add primer for new/dark surfaces"
    },
    {
      mistake: "Exact Calculations Only",
      impact: "No paint for touch-ups",
      solution: "Always add 10% buffer"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-200">
              Professional Paint Calculator
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Paint Coverage Calculator by Square Footage
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Paint coverage calculator determines exactly how many gallons of paint you need. 
              Calculate by square footage, room dimensions, or full house. Accurate coverage for any surface type.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/trial-signup">
                  Use Advanced Calculator
                  <Calculator className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#calculator">
                  Try Basic Calculator
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Ruler className="w-4 h-4 text-green-500" />
                Accurate coverage rates
              </span>
              <span className="flex items-center gap-1">
                <Paintbrush className="w-4 h-4 text-green-500" />
                All paint types
              </span>
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4 text-green-500" />
                Room & house calculators
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Paint Coverage Rates Table */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paint Coverage Rates by Type
            </h2>
            <p className="text-xl text-gray-600">
              Professional coverage rates for accurate paint calculations
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left">Paint Type</th>
                  <th className="px-6 py-4 text-left">Coverage Rate</th>
                  <th className="px-6 py-4 text-left">Best For</th>
                  <th className="px-6 py-4 text-left">Coats Needed</th>
                  <th className="px-6 py-4 text-left">Absorption</th>
                </tr>
              </thead>
              <tbody>
                {paintCoverageRates.map((paint, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{paint.type}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">{paint.coverage}</td>
                    <td className="px-6 py-4">{paint.bestFor}</td>
                    <td className="px-6 py-4">{paint.coats}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paint.absorption}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Card className="mt-8 bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">
                    Important Coverage Note:
                  </p>
                  <p className="text-amber-800 text-sm">
                    These are manufacturer specifications for smooth surfaces. Actual coverage varies based on 
                    surface texture, porosity, application method, and painter technique. Always calculate 
                    conservatively and purchase 10% extra.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Surface Type Factors */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Surface Type Coverage Factors
            </h2>
            <p className="text-xl text-gray-600">
              Adjust paint calculations based on surface texture
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surfaceFactors.map((surface, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {surface.surface}
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {surface.factor}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{surface.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Room Examples */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paint Coverage by Room Size
            </h2>
            <p className="text-xl text-gray-600">
              Real-world examples for common room sizes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roomExamples.map((room, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardTitle className="text-lg">{room.room}</CardTitle>
                  <p className="text-sm text-gray-600">{room.dimensions}</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Wall Area:</p>
                      <p className="font-semibold">{room.wallArea}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paint (1 coat):</p>
                      <p className="font-semibold text-blue-600">{room.paintNeeded}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paint (2 coats):</p>
                      <p className="font-semibold text-green-600">{room.with2Coats}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paint Coverage Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Calculate exactly how much paint you need
            </p>
          </div>
          
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Room Dimensions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Length (feet)
                      </label>
                      <input 
                        type="number" 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Width (feet)
                      </label>
                      <input 
                        type="number" 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wall Height (feet)
                      </label>
                      <input 
                        type="number" 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        placeholder="8"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Paint Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Doors
                      </label>
                      <input 
                        type="number" 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Windows
                      </label>
                      <input 
                        type="number" 
                        className="w-full p-3 border border-gray-300 rounded-lg" 
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Coats
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option>1 coat</option>
                        <option selected>2 coats (recommended)</option>
                        <option>3 coats</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface Type
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg mb-6">
                  <option>Smooth Drywall (Standard)</option>
                  <option>Textured Walls (+15%)</option>
                  <option>Rough Stucco (+50%)</option>
                  <option>Bare Wood (+25%)</option>
                  <option>Previously Painted (-10%)</option>
                </select>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                Calculate Paint Coverage
                <Calculator className="ml-2 w-5 h-5" />
              </Button>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Sample Calculation:</h4>
                <div className="space-y-2 text-sm">
                  <p>Wall Area: 320 sq ft (after subtracting doors/windows)</p>
                  <p>Coverage Rate: 400 sq ft per gallon</p>
                  <p>Coats: 2</p>
                  <p className="font-semibold text-blue-600">Total Paint Needed: 1.6 gallons (recommend buying 2 gallons)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculation Tips */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Calculate Paint Coverage
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step guide for accurate calculations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {calculationTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {tip.tip}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{tip.description}</p>
                  <div className="p-3 bg-blue-50 rounded text-sm font-mono text-blue-800">
                    {tip.example}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Paint Coverage Mistakes
            </h2>
            <p className="text-xl text-gray-600">
              Avoid these errors in your calculations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {commonMistakes.map((mistake, index) => (
              <Card key={index} className="border-l-4 border-red-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    {mistake.mistake}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Impact:</span> {mistake.impact}
                    </p>
                    <p className="text-sm text-green-600">
                      <span className="font-semibold">Solution:</span> {mistake.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Why Contractors Trust Our Calculator
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">95% Accuracy</h3>
                      <p className="text-blue-100 text-sm">Based on 250,000+ real projects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Save 30 Minutes</h3>
                      <p className="text-blue-100 text-sm">Per quote with instant calculations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Reduce Waste</h3>
                      <p className="text-blue-100 text-sm">Order right amount, save money</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-6">Professional Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Multiple surface type calculations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Interior & exterior coverage rates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Brand-specific coverage data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Commercial project scaling</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Export calculations to quotes</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/trial-signup">
                    Try Professional Calculator
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Professional Paint Coverage Calculations
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 5,000+ contractors using our advanced calculators for accurate paint 
            estimates. Never run out or over-order again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/painting-quote-templates-free">
                Get Free Templates
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Accurate calculations
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              All paint types
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Save on materials
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}