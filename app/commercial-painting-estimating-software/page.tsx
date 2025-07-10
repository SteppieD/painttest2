import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building, 
  Calculator, 
  Clock, 
  DollarSign, 
  BarChart3, 
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Palette,
  FileText,
  Shield,
  TrendingUp,
  Zap
} from 'lucide-react';

// Force dynamic rendering to prevent timeout
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Commercial Painting Estimating Software | Large Project Quotes | ProPaint Quote',
  description: 'Professional commercial painting estimating software. Generate accurate quotes for office buildings, warehouses, and large projects. Advanced tools for commercial contractors.',
  keywords: 'commercial painting estimating software, commercial painting estimator, large project painting quotes, office building painting estimates, warehouse painting calculator',
  openGraph: {
    title: 'Commercial Painting Estimating Software | Large Project Quotes',
    description: 'Professional commercial painting estimating software for large projects and office buildings.',
    type: 'website',
  },
};

export default function CommercialPaintingEstimatingSoftwarePage() {
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
              <Link href="/trial-signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Start Free Trial</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Commercial Painting</span> Estimating Software
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional estimating software designed for large commercial projects. Generate accurate quotes for office buildings, warehouses, and multi-story facilities with enterprise-grade tools.
          </p>
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Link href="/trial-signup" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              <Building className="w-5 h-5" />
              Start Commercial Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-600">Enterprise features • Free trial • No setup fees</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Building className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Large Projects</div>
              <div className="text-gray-600">Designed for commercial-scale estimating</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Rapid Quotes</div>
              <div className="text-gray-600">Speed to quote advantage over competitors</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <TrendingUp className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Win More Bids</div>
              <div className="text-gray-600">Professional presentations win contracts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for Commercial Painting Contractors</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Advanced features specifically designed for large-scale commercial projects and multi-building complexes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
              <Calculator className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Multi-Building Calculations</h3>
              <p className="text-gray-600 mb-4">Calculate estimates for office complexes, shopping centers, and industrial facilities with multiple structures.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multi-building project management</li>
                <li>• Bulk area calculations</li>
                <li>• Phased project scheduling</li>
                <li>• Zone-based pricing</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
              <Clock className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Rapid Quote Turnaround</h3>
              <p className="text-gray-600 mb-4">Generate complex commercial quotes in minutes, not days. Beat competitors with superior speed to quote.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 15-minute large project quotes</li>
                <li>• Automated material calculations</li>
                <li>• Instant pricing updates</li>
                <li>• Same-day quote delivery</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
              <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Commercial Analytics</h3>
              <p className="text-gray-600 mb-4">Track large project profitability, bid success rates, and commercial market trends.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Project profitability analysis</li>
                <li>• Commercial bid tracking</li>
                <li>• Market rate comparisons</li>
                <li>• ROI forecasting</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500">
              <DollarSign className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Enterprise Pricing</h3>
              <p className="text-gray-600 mb-4">Advanced pricing models for commercial contracts, including prevailing wage calculations and union rates.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Prevailing wage integration</li>
                <li>• Union rate calculations</li>
                <li>• Commercial markup tiers</li>
                <li>• Volume discount pricing</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
              <FileText className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Compliance Documentation</h3>
              <p className="text-gray-600 mb-4">Generate compliance-ready documents for government contracts and commercial requirements.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Government contract formatting</li>
                <li>• Detailed material specifications</li>
                <li>• Labor breakdown reports</li>
                <li>• Safety compliance documentation</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-indigo-500">
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600 mb-4">Coordinate large estimates with multiple team members and stakeholders.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multi-user project access</li>
                <li>• Role-based permissions</li>
                <li>• Real-time collaboration</li>
                <li>• Approval workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Commercial Project Types We Support</h2>
            <p className="text-xl text-gray-600">Specialized tools for every type of commercial painting project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Building className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Office Buildings</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Interior office spaces</li>
                <li>• Common areas and lobbies</li>
                <li>• Stairwells and corridors</li>
                <li>• Executive suites</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Industrial Facilities</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Warehouses and distribution centers</li>
                <li>• Manufacturing facilities</li>
                <li>• High-ceiling structures</li>
                <li>• Specialized coating systems</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Retail & Hospitality</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Shopping centers and malls</li>
                <li>• Hotels and restaurants</li>
                <li>• Retail store build-outs</li>
                <li>• Entertainment venues</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <FileText className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Healthcare & Education</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Hospitals and medical facilities</li>
                <li>• Schools and universities</li>
                <li>• Specialized coating requirements</li>
                <li>• Infection control protocols</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Shield className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Government Projects</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Federal and state buildings</li>
                <li>• Municipal facilities</li>
                <li>• Military installations</li>
                <li>• Compliance documentation</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mixed-Use Developments</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Residential and commercial</li>
                <li>• Multi-phase projects</li>
                <li>• Different coating specifications</li>
                <li>• Coordinated scheduling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Maximize Commercial Project ROI</h2>
              <p className="text-xl text-gray-600 mb-8">
                Commercial painting projects demand precision, speed, and professionalism. Our software gives you the competitive edge needed to win more contracts and increase profitability.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Win 60% More Commercial Bids</h3>
                    <p className="text-gray-600">Professional presentations and rapid quote turnaround time beat competitors consistently.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Reduce Estimating Time by 80%</h3>
                    <p className="text-gray-600">Complex commercial estimates that used to take days now complete in hours.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Increase Project Margins by 25%</h3>
                    <p className="text-gray-600">Accurate calculations prevent underestimating and ensure profitable pricing.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Scale to Larger Projects</h3>
                    <p className="text-gray-600">Handle million-dollar projects with confidence and professional documentation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Commercial Success Metrics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Bid Success Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-semibold">+60%</div>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Estimating Efficiency</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-semibold">10x Faster</div>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Project Accuracy</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-semibold">98.5%</div>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Profit Margins</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-semibold">+25%</div>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Average Project Impact</h4>
                <div className="text-2xl font-bold text-blue-600">$2.5M+</div>
                <div className="text-sm text-gray-600">Annual revenue increase for commercial contractors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Commercial Painting Contractors Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "We've increased our commercial bid win rate by 65% since using ProPaint Quote. The speed to quote advantage is game-changing for large projects. Professional presentations close more deals."
              </p>
              <div className="font-medium text-gray-900">Robert Kim</div>
              <div className="text-sm text-gray-500">Metro Commercial Painting</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Managing multi-building projects is so much easier now. The software handles complex calculations perfectly, and our estimates are consistently profitable. Essential for commercial work."
              </p>
              <div className="font-medium text-gray-900">Linda Foster</div>
              <div className="text-sm text-gray-500">Foster Industrial Coatings</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Win More Commercial Contracts?</h2>
          <p className="text-xl text-blue-100 mb-8">Join commercial contractors who've transformed their bidding process with professional estimating software</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              <Building className="w-5 h-5" />
              Start Commercial Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/painting-estimate-calculator" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-md text-lg font-medium">
              See Demo
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Enterprise features included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Commercial support</span>
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
              <p className="text-gray-400">Professional commercial painting estimating software for large projects and enterprise contractors.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Commercial Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/painting-estimate-calculator" className="hover:text-white">Enterprise Calculator</Link></li>
                <li><Link href="/painting-quote-templates" className="hover:text-white">Commercial Templates</Link></li>
                <li><Link href="/trial-signup" className="hover:text-white">Commercial Trial</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/painting-estimating-software" className="hover:text-white">Estimating Software</Link></li>
                <li><Link href="/painting-business-software" className="hover:text-white">Business Management</Link></li>
                <li><Link href="/how-to-quote-painting-jobs" className="hover:text-white">Quoting Guide</Link></li>
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