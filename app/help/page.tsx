import { Metadata } from 'next'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { Search, MessageCircle, Book, Video, Settings, Users, Calculator, FileText, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help Center | ProPaint Quote - Support & Documentation',
  description: 'Get help with ProPaint Quote painting contractor software. Find answers, tutorials, and support for creating professional painting quotes.',
  robots: 'index, follow',
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers, tutorials, and support for getting the most out of ProPaint Quote
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for help articles, tutorials, or features..."
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Popular searches: "How to create a quote", "Setting up paint products", "Customer management"
          </p>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Popular Help Topics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Creating Quotes</h3>
              <p className="text-gray-600 mb-4">
                Learn how to create accurate, professional painting quotes quickly
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Quote creation walkthrough
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Pricing calculations explained
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Adding custom line items
                </li>
              </ul>
              <button className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Articles <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Setup & Configuration</h3>
              <p className="text-gray-600 mb-4">
                Get your account configured and customize settings for your business
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Initial account setup
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Paint products configuration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Labor rates and pricing
                </li>
              </ul>
              <button className="text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Articles <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Management</h3>
              <p className="text-gray-600 mb-4">
                Manage customers, track quotes, and follow up on opportunities
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Adding customer information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Quote status tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Follow-up reminders
                </li>
              </ul>
              <button className="text-purple-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Articles <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Proposals & Documents</h3>
              <p className="text-gray-600 mb-4">
                Create professional proposals and customize document templates
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Customizing proposals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Adding your branding
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Terms and conditions
                </li>
              </ul>
              <button className="text-orange-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Articles <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">
                Watch step-by-step video guides for all major features
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Getting started series
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Advanced features
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Best practices
                </li>
              </ul>
              <button className="text-red-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Tutorials <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">API & Integrations</h3>
              <p className="text-gray-600 mb-4">
                Connect ProPaint Quote with your existing tools and workflows
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  API documentation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Available integrations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Webhook setup
                </li>
              </ul>
              <button className="text-gray-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View Documentation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I create my first quote?</h3>
              <p className="text-gray-600 mb-4">
                Creating your first quote is simple! Start by clicking "Create Quote" in your dashboard, 
                then follow our guided process to enter project details. Our AI assistant will help 
                calculate accurate pricing based on your configured rates and materials.
              </p>
              <button className="text-blue-600 font-medium">Read full guide →</button>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How accurate are the pricing calculations?</h3>
              <p className="text-gray-600 mb-4">
                Our pricing calculations are based on industry-standard formulas and your specific 
                business settings. The accuracy depends on how well you've configured your labor 
                rates, material costs, and overhead percentages during setup.
              </p>
              <button className="text-blue-600 font-medium">Learn about pricing →</button>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Can I customize the quote templates?</h3>
              <p className="text-gray-600 mb-4">
                Yes! You can customize quote templates with your company branding, logo, terms and 
                conditions, and specific formatting preferences. Go to Settings → Templates to 
                get started.
              </p>
              <button className="text-blue-600 font-medium">Customize templates →</button>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What if I need help beyond these articles?</h3>
              <p className="text-gray-600 mb-4">
                We're here to help! You can contact our support team via email at hello@paintquoteapp.com 
                or use the live chat feature. We typically respond within 2-4 hours during business hours.
              </p>
              <button className="text-blue-600 font-medium">Contact support →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Still need help?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is here to help you succeed with ProPaint Quote
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <MessageCircle className="w-8 h-8 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Live Chat Support</h3>
              <p className="text-blue-100 mb-4">
                Get instant help from our support team
              </p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Start Chat
              </button>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <Book className="w-8 h-8 text-white mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-blue-100 mb-4">
                Send us a detailed message and we'll respond within 4 hours
              </p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Send Email
              </button>
            </div>
          </div>
          
          <p className="text-sm text-blue-200 mt-8">
            Support hours: Monday-Friday 8am-6pm EST • Average response time: 2 hours
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}