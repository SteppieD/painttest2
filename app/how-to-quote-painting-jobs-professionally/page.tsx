import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  CheckCircle,
  ArrowRight,
  Palette,
  FileText,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'How to Quote Painting Jobs Like a Professional Contractor (2024 Guide)',
  description: 'Learn how to quote painting jobs accurately and profitably. Professional guide for contractors on pricing interior, exterior, and commercial painting projects.',
  keywords: 'how to quote painting jobs, how to quote for painting, how to write a painting quote, what should a painting quote include, painting quotation template, how to quote for painting jobs',
  openGraph: {
    title: 'How to Quote Painting Jobs Like a Professional Contractor',
    description: 'Complete guide to accurate painting job quotes. Learn professional pricing strategies for maximum profits.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Quote Painting Jobs - Professional Guide',
    description: 'Master the art of painting job quotes. Professional pricing strategies revealed.',
  }
};

export default function HowToQuotePaintingJobsProfessionallyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How to Quote <span className="text-blue-600">Painting Jobs</span> Like a Pro
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Master the art of professional painting estimates. Learn proven strategies to price jobs accurately, win more bids, and maximize your profits with every quote.
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                <Calculator className="w-5 h-5 mr-2" />
                Get Professional Quote Tool
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Guide Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li><a href="#basics" className="text-blue-600 hover:text-blue-700">1. Painting Quote Basics</a></li>
                <li><a href="#measurement" className="text-blue-600 hover:text-blue-700">2. Accurate Measurements</a></li>
                <li><a href="#materials" className="text-blue-600 hover:text-blue-700">3. Material Calculations</a></li>
                <li><a href="#labor" className="text-blue-600 hover:text-blue-700">4. Labor Cost Estimation</a></li>
              </ul>
              <ul className="space-y-2">
                <li><a href="#pricing" className="text-blue-600 hover:text-blue-700">5. Pricing Strategies</a></li>
                <li><a href="#templates" className="text-blue-600 hover:text-blue-700">6. Professional Templates</a></li>
                <li><a href="#mistakes" className="text-blue-600 hover:text-blue-700">7. Common Mistakes</a></li>
                <li><a href="#tools" className="text-blue-600 hover:text-blue-700">8. Quote Software Tools</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Basics */}
      <section id="basics" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">1. Painting Quote Basics: What Every Professional Needs to Know</h2>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-600 text-lg mb-6">
              Creating accurate painting quotes is the foundation of a profitable painting business. A professional quote should include all costs, 
              establish clear expectations, and position you competitively in the market.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mb-4">What Should a Painting Quote Include?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Essential Quote Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Detailed scope of work</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Material specifications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Labor costs breakdown</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Timeline expectations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Terms and conditions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Pricing Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Paint and primer costs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Supplies and equipment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Prep work requirements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Labor hours and rates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Profit margin and overhead</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Measurement */}
      <section id="measurement" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">2. Accurate Measurements: The Foundation of Every Quote</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg mb-6">
              Accurate measurements are crucial for profitable painting quotes. Here's how professional contractors measure different surfaces:
            </p>

            <div className="bg-white rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Wall Surface Calculation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Standard Formula:</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                    <code className="text-blue-800">
                      (Length × Height) - Doors - Windows = Paintable Area
                    </code>
                  </div>
                  <ul className="space-y-2">
                    <li>• Measure wall length and height</li>
                    <li>• Subtract door area (21 sq ft each)</li>
                    <li>• Subtract window area (15 sq ft average)</li>
                    <li>• Add 10% for waste and touch-ups</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pro Tips:</h4>
                  <ul className="space-y-2">
                    <li>• Use a laser measure for accuracy</li>
                    <li>• Round up to nearest half foot</li>
                    <li>• Account for texture differences</li>
                    <li>• Note prep work requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Interior Walls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Standard ceiling height: 8-9 feet</p>
                  <p className="text-sm text-gray-600">Coverage: 350-400 sq ft per gallon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ceilings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Length × Width = Area</p>
                  <p className="text-sm text-gray-600">Coverage: 350-400 sq ft per gallon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trim & Doors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">Measure linear feet of trim</p>
                  <p className="text-sm text-gray-600">Doors: 20 sq ft average each</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Materials */}
      <section id="materials" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">3. Material Cost Calculations</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Pro Tip: Material Cost Strategy</h3>
                <p className="text-yellow-700">
                  Always add 15-20% to material costs for waste, touch-ups, and price fluctuations. This protects your profit margins and accounts for unexpected needs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Paint Cost Calculation</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Premium Paint</h4>
                  <p className="text-sm text-gray-600">$45-65 per gallon</p>
                  <p className="text-sm text-gray-600">Coverage: 350-400 sq ft</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Standard Paint</h4>
                  <p className="text-sm text-gray-600">$25-45 per gallon</p>
                  <p className="text-sm text-gray-600">Coverage: 300-350 sq ft</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Primer</h4>
                  <p className="text-sm text-gray-600">$20-35 per gallon</p>
                  <p className="text-sm text-gray-600">Coverage: 300-400 sq ft</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Supply Costs</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Brushes & Rollers</span>
                  <span className="font-medium">$25-50</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Drop Cloths</span>
                  <span className="font-medium">$15-30</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Painter's Tape</span>
                  <span className="font-medium">$10-25</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Sandpaper & Prep</span>
                  <span className="font-medium">$20-40</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Plastic & Protection</span>
                  <span className="font-medium">$15-35</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t-2 font-semibold">
                  <span>Total Supplies</span>
                  <span>$85-180</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Labor */}
      <section id="labor" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">4. Labor Cost Estimation</h2>
          
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-600 text-lg mb-6">
              Labor typically represents 70-80% of your total quote. Accurate labor estimation is crucial for profitability.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Labor Rate Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Hourly Rate Components:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Base wage: $20-35/hour</li>
                        <li>• Taxes & benefits: +25%</li>
                        <li>• Equipment & overhead: +15%</li>
                        <li>• Profit margin: +20-30%</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="font-medium text-blue-800">
                        Total Rate: $35-65/hour
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Estimates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Prep work</span>
                      <span className="font-medium">150-200 sq ft/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priming</span>
                      <span className="font-medium">300-400 sq ft/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wall painting</span>
                      <span className="font-medium">350-450 sq ft/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trim painting</span>
                      <span className="font-medium">25-40 linear ft/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleanup</span>
                      <span className="font-medium">10% of total time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Tools CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Automate Your Painting Quotes with Professional Software
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Stop calculating quotes manually. Get accurate estimates in minutes with our professional painting quote software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                <Calculator className="w-5 h-5 mr-2" />
                Try Free Calculator
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 text-white border-white hover:bg-white hover:text-blue-600">
              <Link href="/painting-quote-templates">
                <FileText className="w-5 h-5 mr-2" />
                Get Quote Templates
              </Link>
            </Button>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            Free trial • Professional templates included • Mobile-friendly
          </p>
        </div>
      </section>

      {/* Continue reading sections would go here... */}
      
      <Footer />
    </div>
  );
}