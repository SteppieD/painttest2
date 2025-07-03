import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  Calculator, 
  BarChart3, 
  FileText, 
  CreditCard,
  Calendar,
  Smartphone,
  CheckCircle,
  Star,
  ArrowRight,
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Complete Painting Business Software | Customer Management & Quotes | ProPaint Quote',
  description: 'All-in-one painting business software. Manage quotes, customers, invoicing, and analytics in one platform. Grow your painting business with professional tools.',
  keywords: 'painting business software, painting contractor software, painting company management software, painting business management, contractor software',
  openGraph: {
    title: 'Complete Painting Business Software | Customer Management & Quotes',
    description: 'All-in-one painting business software for quotes, customers, invoicing, and analytics.',
    type: 'website',
  },
};

export default function PaintingBusinessSoftwarePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Complete <span className="text-blue-600">Painting Business</span> Software
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage your entire painting business in one platform. From quotes and customers to invoicing and analytics – everything you need to grow your contracting business.
          </p>
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Link href="/trial-signup" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              Start Free Business Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-600">Complete business management • Free trial • No credit card required</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">All-in-One</div>
              <div className="text-gray-600">Business Management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50%</div>
              <div className="text-gray-600">Less Admin Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">30%</div>
              <div className="text-gray-600">Revenue Growth</div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Solution */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything Your Painting Business Needs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Stop juggling multiple tools. Manage your entire business from one professional platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
              <Calculator className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Professional Quoting</h3>
              <p className="text-gray-600 mb-4">Generate accurate painting quotes in minutes with AI-powered calculations and professional templates.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AI-powered quote generation</li>
                <li>• Professional templates</li>
                <li>• Mobile quote creation</li>
                <li>• Digital signatures</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Customer Management</h3>
              <p className="text-gray-600 mb-4">Track all your customers, projects, and communications in one organized system.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Customer database</li>
                <li>• Project history tracking</li>
                <li>• Communication logs</li>
                <li>• Follow-up reminders</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
              <FileText className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Project Management</h3>
              <p className="text-gray-600 mb-4">Organize and track all your painting projects from estimate to completion.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Project timelines</li>
                <li>• Progress tracking</li>
                <li>• Material lists</li>
                <li>• Photo documentation</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500">
              <CreditCard className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Invoicing & Payments</h3>
              <p className="text-gray-600 mb-4">Create professional invoices and track payments to improve cash flow.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Professional invoicing</li>
                <li>• Payment tracking</li>
                <li>• Payment reminders</li>
                <li>• Revenue reporting</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-orange-500">
              <BarChart3 className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
              <p className="text-gray-600 mb-4">Track performance with detailed analytics and insights to grow your business.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revenue analytics</li>
                <li>• Win rate tracking</li>
                <li>• Profit margin analysis</li>
                <li>• Growth forecasting</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-indigo-500">
              <Calendar className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Scheduling & Tasks</h3>
              <p className="text-gray-600 mb-4">Organize your schedule and never miss important tasks or follow-ups.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Project scheduling</li>
                <li>• Task management</li>
                <li>• Automated reminders</li>
                <li>• Calendar integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Workflow */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Streamlined Business Workflow</h2>
            <p className="text-xl text-gray-600">See how our software optimizes every step of your painting business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lead Capture</h3>
              <p className="text-gray-600">Capture leads from website forms, phone calls, and referrals directly into your system.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quick Quotes</h3>
              <p className="text-gray-600">Generate professional quotes in minutes and send them instantly to prospects.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Project Management</h3>
              <p className="text-gray-600">Convert accepted quotes to projects and track progress from start to finish.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Paid</h3>
              <p className="text-gray-600">Send professional invoices and track payments to maintain healthy cash flow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Business */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Grow Your Painting Business</h2>
              <p className="text-xl text-gray-600 mb-8">
                Stop losing time on admin work and focus on what you do best – painting. Our software handles the business side so you can grow.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save 10+ Hours Per Week</h3>
                    <p className="text-gray-600">Automate quotes, invoices, and follow-ups to focus on actual painting work.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Increase Win Rate by 40%</h3>
                    <p className="text-gray-600">Professional quotes and faster response times win more jobs.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Improve Cash Flow</h3>
                    <p className="text-gray-600">Track payments and send automatic reminders to get paid faster.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Scale Your Business</h3>
                    <p className="text-gray-600">Handle more customers and projects without hiring more office staff.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Growth Results</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Administrative Time</span>
                  <div className="flex items-center gap-2">
                    <div className="text-red-600 font-semibold">-50%</div>
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quote Response Time</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-semibold">5x Faster</div>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Customer Satisfaction</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-semibold">+35%</div>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Revenue Growth</span>
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 font-semibold">+30%</div>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Run Your Business from Anywhere</h2>
            <p className="text-xl text-gray-600">Full mobile functionality means you can manage your business from the field</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile Quoting</h3>
              <p className="text-gray-600">Create and send quotes during customer consultations for instant approval.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
              <p className="text-gray-600">Get instant notifications about quote approvals, payments, and customer messages.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">Your business data is protected with bank-level security and automatic backups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Painting Contractors Love Our Software</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "This software has completely transformed my painting business. I've cut my admin time in half and increased my revenue by 30%. The mobile app lets me quote jobs on-site, which customers love."
              </p>
              <div className="font-medium text-gray-900">Tom Wilson</div>
              <div className="text-sm text-gray-500">Wilson Painting Contractors</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Finally, everything I need in one place. Quotes, customers, projects, invoices – it's all connected. The analytics help me make better business decisions. Highly recommended!"
              </p>
              <div className="font-medium text-gray-900">Jennifer Davis</div>
              <div className="text-sm text-gray-500">Davis Professional Painting</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Painting Business?</h2>
          <p className="text-xl text-blue-100 mb-8">Join hundreds of painting contractors who've streamlined their business with our software</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white hover:shadow-lg px-8 py-4 rounded-xl text-lg font-medium flex items-center gap-2 border-2 border-white/20 transition-all duration-200">
              Start Free Business Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/painting-estimate-calculator" className="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:shadow-lg px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200">
              See Demo
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Complete business suite</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free trial included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Setup in 10 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}