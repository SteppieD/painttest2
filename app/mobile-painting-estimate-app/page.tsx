import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Smartphone, 
  Calculator, 
  Download, 
  Wifi, 
  Clock, 
  Camera,
  CheckCircle,
  Star,
  ArrowRight,
  Palette,
  Zap,
  Shield,
  MapPin,
  Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mobile Painting Estimate App | Field Estimates on iPhone & Android | ProPaint Quote',
  description: 'Professional mobile painting estimate app for contractors. Create accurate quotes on-site with iPhone and Android. Works offline. Download free painting estimator app.',
  keywords: 'mobile painting estimate app, painting estimate app, field estimating app, mobile painting calculator, on-site painting quotes, contractor mobile app',
  openGraph: {
    title: 'Mobile Painting Estimate App | Field Estimates on iPhone & Android',
    description: 'Professional mobile painting estimate app for contractors. Create accurate quotes on-site with iPhone and Android.',
    type: 'website',
  },
};

export default function MobilePaintingEstimateAppPage() {
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
              <Link href="/trial-signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Download App</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-100">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <Smartphone className="w-4 h-4" />
              Mobile-First Design
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">Mobile Painting</span> Estimate App
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create professional painting quotes directly on-site with your iPhone or Android. Superior speed to quote with accurate estimates in minutes, even without internet connection.
          </p>
          
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Link href="/trial-signup" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 rounded-md text-lg font-medium flex items-center gap-2 shadow-lg">
              <Download className="w-5 h-5" />
              Download Free Mobile App
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-600">iPhone & Android • Works offline • Free forever</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Field Ready</div>
              <div className="text-gray-600">Quote jobs on-site during customer walks</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Wifi className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Works Offline</div>
              <div className="text-gray-600">No internet required for calculations</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Clock className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">3-Min Quotes</div>
              <div className="text-gray-600">Fastest mobile quote generation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Specific Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for Contractors in the Field</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Mobile-first features designed specifically for on-site estimating and customer interactions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
              <Smartphone className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Touch-Optimized Interface</h3>
              <p className="text-gray-600 mb-4">Large buttons and intuitive gestures make estimating fast and error-free on any screen size.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Large touch targets</li>
                <li>• Gesture-based navigation</li>
                <li>• Portrait/landscape modes</li>
                <li>• Dark mode for outdoor use</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
              <Camera className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Photo Documentation</h3>
              <p className="text-gray-600 mb-4">Capture job site photos and attach them to quotes for professional documentation and follow-up.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• In-app photo capture</li>
                <li>• Image annotation tools</li>
                <li>• Before/after comparisons</li>
                <li>• Cloud photo storage</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
              <MapPin className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">GPS & Location</h3>
              <p className="text-gray-600 mb-4">Automatically tag quotes with GPS coordinates and get directions to customer locations.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatic GPS tagging</li>
                <li>• Built-in navigation</li>
                <li>• Location-based pricing</li>
                <li>• Route optimization</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500">
              <Wifi className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Offline Capability</h3>
              <p className="text-gray-600 mb-4">Create complete quotes without internet. Perfect for basements, remote areas, or poor signal locations.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full offline functionality</li>
                <li>• Local data storage</li>
                <li>• Sync when connected</li>
                <li>• No data usage worries</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
              <Calculator className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Voice Input</h3>
              <p className="text-gray-600 mb-4">Speak measurements and room details for hands-free data entry while walking through properties.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Speech-to-text entry</li>
                <li>• Voice measurement input</li>
                <li>• Hands-free operation</li>
                <li>• Multi-language support</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-indigo-500">
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Customer Signatures</h3>
              <p className="text-gray-600 mb-4">Get instant approvals with digital signature capture directly on your mobile device.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Digital signature pad</li>
                <li>• Instant approval process</li>
                <li>• Legal document creation</li>
                <li>• Email confirmations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Speed to Quote Advantage */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ultimate Speed to Quote Advantage</h2>
            <p className="text-xl text-gray-600">Mobile app gives you the fastest quote turnaround time in the industry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Beat Every Competitor on Response Time</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Same-Visit Quote Delivery</h4>
                    <p className="text-gray-600">Create and email professional quotes before leaving the customer's property.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">3-Minute Accurate Estimates</h4>
                    <p className="text-gray-600">Mobile-optimized interface reduces quote generation to under 3 minutes.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Instant Customer Approval</h4>
                    <p className="text-gray-600">Digital signatures and instant invoicing close deals on the spot.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">24/7 Estimating Capability</h4>
                    <p className="text-gray-600">Quote emergency jobs and after-hours requests from anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Mobile Performance Metrics</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">3min</div>
                  <div className="text-gray-600">Average quote creation time</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
                  <div className="text-gray-600">Same-visit conversion rate</div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">10x</div>
                  <div className="text-gray-600">Faster than traditional methods</div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Contractor Impact</h4>
                <div className="text-lg text-gray-600">"We close 3x more jobs since using the mobile app. Customers love getting quotes immediately."</div>
                <div className="text-sm text-gray-500 mt-2">- Mobile App User Survey</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Works on Any Mobile Device</h2>
            <p className="text-xl text-gray-600">Native apps for iPhone and Android, plus responsive web app for tablets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">iPhone App</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• iOS 12.0 or later</li>
                <li>• iPhone 6s and newer</li>
                <li>• iPad compatible</li>
                <li>• Apple Pencil support</li>
              </ul>
              <Link href="/trial-signup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md">
                <Download className="w-4 h-4" />
                Download for iOS
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Smartphone className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Android App</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Android 6.0 or later</li>
                <li>• All screen sizes</li>
                <li>• Tablet optimized</li>
                <li>• Stylus support</li>
              </ul>
              <Link href="/trial-signup" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md">
                <Download className="w-4 h-4" />
                Download for Android
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <Calculator className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Web App</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                <li>• Any modern browser</li>
                <li>• Progressive web app</li>
                <li>• Offline capabilities</li>
                <li>• No installation required</li>
              </ul>
              <Link href="/painting-estimate-calculator" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md">
                <Calculator className="w-4 h-4" />
                Try Web Version
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Field Contractors Love the Mobile App</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The mobile app is a game-changer. I create quotes while walking through homes with customers. They're impressed by the instant professionalism and I close 70% more jobs."
              </p>
              <div className="font-medium text-gray-900">Carlos Rodriguez</div>
              <div className="text-sm text-gray-500">Rodriguez Painting Services</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Working offline is crucial for my business. Many job sites have poor cell service, but I can still create accurate quotes. The photo features help with documentation too."
              </p>
              <div className="font-medium text-gray-900">Jennifer Park</div>
              <div className="text-sm text-gray-500">Park Professional Painting</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Download Your Mobile Painting Estimate App</h2>
          <p className="text-xl text-green-100 mb-8">Join thousands of contractors who quote jobs faster with mobile technology</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Free App
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/painting-estimate-calculator" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-md text-lg font-medium">
              Try Web Version
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>iPhone & Android apps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Works completely offline</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free forever</span>
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
              <p className="text-gray-400">Mobile painting estimate app for contractors. Create professional quotes on-site with superior speed to quote.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Mobile Apps</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/trial-signup" className="hover:text-white">iPhone App</Link></li>
                <li><Link href="/trial-signup" className="hover:text-white">Android App</Link></li>
                <li><Link href="/painting-estimate-calculator" className="hover:text-white">Web App</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/painting-estimating-software" className="hover:text-white">Estimating Software</Link></li>
                <li><Link href="/commercial-painting-estimating" className="hover:text-white">Commercial Tools</Link></li>
                <li><Link href="/painting-quote-templates" className="hover:text-white">Quote Templates</Link></li>
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