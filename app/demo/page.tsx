import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Play, CheckCircle, Users, Clock, DollarSign, FileText, Calculator, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Interactive Demo | ProPaint Quote - See Our Software in Action',
  description: 'Watch our interactive demo to see how ProPaint Quote helps painting contractors create professional quotes in minutes. Try our software risk-free.',
  robots: 'index, follow',
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-bold mb-6">
            See ProPaint Quote in Action
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Watch how professional painting contractors create accurate quotes in under 3 minutes. 
            No signup required - see the full software experience right now.
          </p>
          
          {/* Video Demo */}
          <div className="bg-gray-900 rounded-lg p-8 mb-12 max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90"></div>
              <div className="relative z-10 text-center">
                <Play className="w-20 h-20 text-white mb-4 mx-auto" />
                <h3 className="text-2xl font-bold mb-2">Interactive Software Demo</h3>
                <p className="text-blue-100">3 minutes • Full walkthrough</p>
                <button className="mt-6 bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Watch Demo Now
                </button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-300 mb-4">
                🎥 Complete walkthrough: Quote creation → Customer management → Business analytics
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-blue-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  3 min demo
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  5,000+ contractors
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  No signup required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll See */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll See in the Demo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow along as we create a real painting quote from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Quote Creation</h3>
              <p className="text-gray-600">
                Enter project details and watch our AI calculate accurate pricing instantly
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Proposals</h3>
              <p className="text-gray-600">
                Generate branded proposals that win more jobs and look professional
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Track customers, follow up on quotes, and manage your sales pipeline
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Insights</h3>
              <p className="text-gray-600">
                View analytics on win rates, profit margins, and business growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Try It Yourself</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Demo Steps */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Project Details</h3>
                  <p className="text-gray-600">
                    "2-bedroom house, interior walls and ceilings, 1,200 sq ft, premium paint"
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Calculates Instantly</h3>
                  <p className="text-gray-600">
                    Our system factors in materials, labor, overhead, and your profit margins
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Professional Quote</h3>
                  <p className="text-gray-600">
                    Branded PDF with detailed breakdown, terms, and next steps
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Send & Track</h3>
                  <p className="text-gray-600">
                    Email quotes to customers and track when they're viewed
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Demo Panel */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Live Demo Access</h3>
              
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Sample Project:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Customer:</span> Sarah Johnson</p>
                  <p><span className="font-medium">Project:</span> Kitchen & Living Room</p>
                  <p><span className="font-medium">Size:</span> 800 sq ft walls, 10ft ceilings</p>
                  <p><span className="font-medium">Paint:</span> Sherwin Williams Duration</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Try Interactive Demo
                </button>
                <p className="text-sm text-gray-500">
                  No signup required • Full feature access • Sample data included
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Quote: $3,850
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    2 min setup
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Free Trial?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ painting contractors who've increased their quote accuracy and win rates
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Personal Demo
            </button>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}