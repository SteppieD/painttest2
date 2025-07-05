import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  Smartphone, 
  TrendingUp, 
  Shield, 
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  FileText,
  BarChart3
} from 'lucide-react';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Best Painting Estimating Software for Contractors (2025) | ProPaint Quote',
  description: 'Compare the top painting estimating software for contractors. AI-powered quotes, mobile apps, and professional tools. Start your free trial today.',
  keywords: 'painting estimating software, best painting estimating software, estimating software for painting contractors, painting contractor software, painting business software',
  openGraph: {
    title: 'Best Painting Estimating Software for Contractors',
    description: 'Compare the top painting estimating software for contractors. AI-powered quotes, mobile apps, and professional tools.',
    type: 'website',
  },
};

export default function PaintingEstimatingSoftwarePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Best <span className="text-blue-600">Painting Estimating Software</span> for Contractors
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Compare top-rated estimating software solutions. Create accurate quotes in minutes, win more jobs, and grow your painting business with professional tools.
          </p>
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Link href="/trial-signup" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              Try ProPaint Quote Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-600">Free trial • No credit card required • Setup in 5 minutes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">More Accurate Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5x</div>
              <div className="text-gray-600">Faster Than Manual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
              <div className="text-gray-600">Higher Win Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Comparison */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Contractors Choose ProPaint Quote</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Industry-leading features that save time and increase profits</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-4 text-left font-semibold">Feature</th>
                  <th className="border border-gray-200 p-4 text-center font-semibold text-blue-600">ProPaint Quote</th>
                  <th className="border border-gray-200 p-4 text-center font-semibold">Other Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-4">AI-Powered Quote Generation</td>
                  <td className="border border-gray-200 p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="border border-gray-200 p-4 text-center text-gray-400">❌</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-4">Mobile App for Field Work</td>
                  <td className="border border-gray-200 p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="border border-gray-200 p-4 text-center text-gray-400">Limited</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4">Professional Quote Templates</td>
                  <td className="border border-gray-200 p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="border border-gray-200 p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-4">Customer Management System</td>
                  <td className="border border-gray-200 p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="border border-gray-200 p-4 text-center text-gray-400">Basic</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4">Real-time Analytics</td>
                  <td className="border border-gray-200 p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="border border-gray-200 p-4 text-center text-gray-400">❌</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-4">Setup Time</td>
                  <td className="border border-gray-200 p-4 text-center font-semibold text-blue-600">5 Minutes</td>
                  <td className="border border-gray-200 p-4 text-center text-gray-600">2-4 Hours</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-4">Free Trial</td>
                  <td className="border border-gray-200 p-4 text-center"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="border border-gray-200 p-4 text-center text-gray-400">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need in One Platform</h2>
            <p className="text-xl text-gray-600">Professional tools designed specifically for painting contractors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Calculator className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Quote Calculator</h3>
              <p className="text-gray-600 mb-4">Industry-standard formulas calculate materials, labor, and markup automatically. Never underestimate a job again.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Paint coverage calculations</li>
                <li>• Labor time estimates</li>
                <li>• Material cost tracking</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Smartphone className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile-First Design</h3>
              <p className="text-gray-600 mb-4">Create quotes on-site with your phone or tablet. Perfect for walk-through estimates and immediate responses.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Works on any device</li>
                <li>• Offline capability</li>
                <li>• Customer signatures</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Customer Management</h3>
              <p className="text-gray-600 mb-4">Track all your quotes and customers in one place. Follow up on pending estimates and convert more leads.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Quote history tracking</li>
                <li>• Follow-up reminders</li>
                <li>• Customer communication</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <BarChart3 className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
              <p className="text-gray-600 mb-4">Track your win rates, average job size, and profit margins. Make data-driven decisions to grow your business.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Win rate analysis</li>
                <li>• Revenue tracking</li>
                <li>• Profit margin reports</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Clock className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">5-Minute Quotes</h3>
              <p className="text-gray-600 mb-4">Generate detailed, professional quotes in minutes instead of hours. Respond to leads faster than your competition.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Template automation</li>
                <li>• Quick calculations</li>
                <li>• Instant delivery</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Shield className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Professional Branding</h3>
              <p className="text-gray-600 mb-4">Send professional, branded quotes that build trust with customers and help you stand out from competitors.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Custom branding</li>
                <li>• Professional templates</li>
                <li>• Digital signatures</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Trusted by Professional Painters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "ProPaint Quote has transformed how we estimate jobs. We're closing 40% more deals and our quotes are always accurate. The mobile app is a game-changer for site visits."
              </p>
              <div className="font-medium text-gray-900">Mike Johnson</div>
              <div className="text-sm text-gray-500">Elite Painting Co.</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The AI-powered quotes are incredibly accurate. What used to take me an hour now takes 5 minutes. My customers love the professional presentation and quick turnaround."
              </p>
              <div className="font-medium text-gray-900">Sarah Martinez</div>
              <div className="text-sm text-gray-500">Precision Painters LLC</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Win More Painting Jobs?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of contractors using professional estimating software</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/painting-estimate-calculator" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-md text-lg font-medium">
              Try Calculator
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free trial included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}