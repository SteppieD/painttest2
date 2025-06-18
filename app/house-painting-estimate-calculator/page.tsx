import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Home, 
  Calculator, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Star,
  ArrowRight,
  Palette,
  Ruler,
  PaintBucket,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'House Painting Estimate Calculator | Residential Painting Cost Calculator | ProPaint Quote',
  description: 'Free house painting estimate calculator. Get accurate residential painting costs instantly. Professional estimates for interior and exterior house painting.',
  keywords: 'house painting estimate, house painter estimate, residential painting calculator, house painting cost calculator, home painting estimate',
  openGraph: {
    title: 'House Painting Estimate Calculator | Residential Painting Costs',
    description: 'Get accurate house painting estimates instantly with our free residential painting calculator.',
    type: 'website',
  },
};

export default function HousePaintingEstimateCalculatorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Palette className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProPaint Quote</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/painting-estimate-calculator" className="text-gray-600 hover:text-gray-900">Calculator</Link>
              <Link href="/painting-quote-templates" className="text-gray-600 hover:text-gray-900">Templates</Link>
              <Link href="/trial-signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Free Calculator</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">House Painting</span> Estimate Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get accurate residential painting estimates instantly. Calculate interior and exterior house painting costs with our professional calculator used by contractors nationwide.
          </p>
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Link href="/trial-signup" className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculate House Painting Cost
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-600">Free estimates • Professional accuracy • Instant results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Home className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Residential Focus</div>
              <div className="text-gray-600">Designed specifically for house painting</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Clock className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">2-Minute Estimates</div>
              <div className="text-gray-600">Get accurate costs in just minutes</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <DollarSign className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">100% Free</div>
              <div className="text-gray-600">No hidden fees or signup required</div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Accurate House Painting Estimates</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Professional-grade calculator that considers all aspects of residential painting projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What Our Calculator Includes:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Room-by-Room Analysis</h4>
                    <p className="text-gray-600">Calculate each room separately for maximum accuracy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Interior & Exterior</h4>
                    <p className="text-gray-600">Separate calculations for indoor and outdoor painting</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Paint & Labor Costs</h4>
                    <p className="text-gray-600">Complete breakdown of materials and labor</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Local Market Rates</h4>
                    <p className="text-gray-600">Pricing adjusted for your geographic area</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sample House Estimates</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">Small House (1,200 sq ft)</h4>
                      <p className="text-sm text-gray-600">Interior painting, 3 bedrooms</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">$2,800-$4,200</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">Medium House (2,000 sq ft)</h4>
                      <p className="text-sm text-gray-600">Full interior & exterior</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">$6,500-$9,800</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">Large House (3,500 sq ft)</h4>
                      <p className="text-sm text-gray-600">Premium paint, full service</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">$12,000-$18,500</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">*Estimates vary by location, paint quality, and project scope</p>
            </div>
          </div>
        </div>
      </section>

      {/* House Painting Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Types of House Painting We Calculate</h2>
            <p className="text-xl text-gray-600">Comprehensive estimates for all residential painting projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Home className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Interior House Painting</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Living rooms and bedrooms</li>
                <li>• Kitchens and bathrooms</li>
                <li>• Hallways and staircases</li>
                <li>• Ceilings and trim work</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Exterior House Painting</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Siding and walls</li>
                <li>• Trim and shutters</li>
                <li>• Doors and windows</li>
                <li>• Decks and fencing</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <PaintBucket className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Specialty Painting</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Cabinet refinishing</li>
                <li>• Accent walls</li>
                <li>• Garage floors</li>
                <li>• Deck staining</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Calculate Your House Painting Cost</h2>
            <p className="text-xl text-gray-600">Simple 4-step process to get accurate estimates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Measure Rooms</h3>
              <p className="text-gray-600">Enter the dimensions of each room you want painted</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Select Surfaces</h3>
              <p className="text-gray-600">Choose walls, ceilings, trim, or exterior surfaces</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PaintBucket className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Choose Paint Quality</h3>
              <p className="text-gray-600">Select from good, better, or premium paint options</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">4. Get Estimate</h3>
              <p className="text-gray-600">Receive detailed cost breakdown and professional quote</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Homeowners Trust Our Calculator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The house painting calculator gave me exactly what I needed to budget for our home renovation. The estimate was spot-on compared to the actual quotes I received from contractors."
              </p>
              <div className="font-medium text-gray-900">Lisa Thompson</div>
              <div className="text-sm text-gray-500">Homeowner, Austin TX</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "I used this to plan my painting budget before getting contractor quotes. It helped me understand the costs and negotiate better. Highly accurate and easy to use!"
              </p>
              <div className="font-medium text-gray-900">Robert Chen</div>
              <div className="text-sm text-gray-500">Homeowner, Seattle WA</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Your House Painting Estimate Now</h2>
          <p className="text-xl text-green-100 mb-8">Calculate accurate painting costs for your home in just 2 minutes</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Start Free Calculator
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/painting-quote-templates" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-md text-lg font-medium">
              Get Quote Templates
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>100% Free calculator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">ProPaint Quote</span>
              </div>
              <p className="text-gray-400">Free house painting calculator for accurate residential painting estimates. Used by homeowners nationwide.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Calculators</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/painting-estimate-calculator" className="hover:text-white">Painting Calculator</Link></li>
                <li><Link href="/commercial-painting-estimating" className="hover:text-white">Commercial Calculator</Link></li>
                <li><Link href="/trial-signup" className="hover:text-white">Professional Tools</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/painting-quote-templates" className="hover:text-white">Quote Templates</Link></li>
                <li><Link href="/how-to-quote-painting-jobs" className="hover:text-white">Quoting Guide</Link></li>
                <li><Link href="/painting-business-software" className="hover:text-white">Business Software</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProPaint Quote. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}