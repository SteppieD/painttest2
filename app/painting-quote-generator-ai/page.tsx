import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Brain, 
  Clock, 
  Smartphone, 
  TrendingUp, 
  Zap, 
  Shield,
  CheckCircle,
  Star,
  ArrowRight,
  Calculator,
  Sparkles,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'AI Painting Quote Generator | Instant Professional Estimates | ProPaint Quote',
  description: 'Generate professional painting quotes instantly with AI. No manual calculations. Accurate estimates in seconds. Try our AI painting quote generator free.',
  keywords: 'painting quote generator, ai painting quote, automated painting estimates, ai quote generator, painting estimate ai, smart painting quotes',
  openGraph: {
    title: 'AI Painting Quote Generator | Instant Professional Estimates',
    description: 'Generate professional painting quotes instantly with AI. No manual calculations required.',
    type: 'website',
  },
};

export default function PaintingQuoteGeneratorAIPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Technology
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-purple-600">AI Painting Quote</span> Generator
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Generate professional painting quotes instantly with artificial intelligence. No manual calculations, no guesswork – just accurate estimates in seconds.
          </p>
          
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Link href="/trial-signup" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-md text-lg font-medium flex items-center gap-2 shadow-lg">
              <Brain className="w-5 h-5" />
              Try AI Quote Generator Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-600">Free AI quotes • No credit card required • Instant results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Instant Quotes</div>
              <div className="text-gray-600">AI generates quotes in under 30 seconds</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Brain className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">Smart Analysis</div>
              <div className="text-gray-600">AI learns from millions of painting projects</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <TrendingUp className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 mb-2">95% Accuracy</div>
              <div className="text-gray-600">More accurate than manual calculations</div>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Our AI Quote Generator Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Advanced artificial intelligence analyzes your project details and generates professional quotes instantly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Input Project Details</h3>
              <p className="text-gray-600">Simply describe your painting project – room dimensions, surfaces, and preferences. Our conversational AI guides you through the process.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600">Our AI analyzes your project using data from thousands of painting jobs, industry standards, and current material costs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional Quote</h3>
              <p className="text-gray-600">Receive a detailed, professional quote with material lists, labor estimates, and total costs – ready to send to your customer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI-Powered Features</h2>
            <p className="text-xl text-gray-600">Advanced artificial intelligence that thinks like an experienced painter</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Lightbulb className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Room Analysis</h3>
              <p className="text-gray-600 mb-4">AI automatically calculates surface areas, identifies prep work needs, and recommends paint quantities based on room characteristics.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatic area calculations</li>
                <li>• Prep work assessment</li>
                <li>• Paint coverage optimization</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Brain className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Intelligent Pricing</h3>
              <p className="text-gray-600 mb-4">AI considers local market rates, material costs, and project complexity to suggest competitive yet profitable pricing.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Market-aware pricing</li>
                <li>• Profit margin optimization</li>
                <li>• Competitive analysis</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Learning Algorithm</h3>
              <p className="text-gray-600 mb-4">Our AI continuously learns from successful quotes and industry data to improve accuracy and recommendations.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Continuous improvement</li>
                <li>• Industry data integration</li>
                <li>• Pattern recognition</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Clock className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Instant Generation</h3>
              <p className="text-gray-600 mb-4">Generate detailed quotes in under 30 seconds. What used to take hours now takes moments.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 30-second quotes</li>
                <li>• Real-time processing</li>
                <li>• Immediate delivery</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Smartphone className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Mobile AI Assistant</h3>
              <p className="text-gray-600 mb-4">Access AI quote generation on any device. Create quotes on-site during customer consultations.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-optimized AI</li>
                <li>• On-site quote generation</li>
                <li>• Offline capability</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Shield className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
              <p className="text-gray-600 mb-4">AI validates quotes for accuracy and completeness before delivery, ensuring professional standards.</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Automatic validation</li>
                <li>• Error detection</li>
                <li>• Professional formatting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Traditional Estimating vs AI-Powered Quotes</h2>
            <p className="text-xl text-gray-600">See the dramatic difference AI makes in your quoting process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-red-700 mb-6">❌ Traditional Manual Estimating</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="text-red-500 mt-1">•</div>
                  <div><strong>2-4 hours per quote</strong> - Measuring, calculating, researching prices</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-red-500 mt-1">•</div>
                  <div><strong>Math errors common</strong> - Manual calculations lead to mistakes</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-red-500 mt-1">•</div>
                  <div><strong>Outdated pricing</strong> - Hard to keep track of current material costs</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-red-500 mt-1">•</div>
                  <div><strong>Inconsistent format</strong> - Each quote looks different</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-red-500 mt-1">•</div>
                  <div><strong>Lost opportunities</strong> - Slow response loses customers</div>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-green-700 mb-6">✅ AI-Powered Quote Generation</h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="text-green-500 mt-1">•</div>
                  <div><strong>30 seconds per quote</strong> - AI handles all calculations instantly</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-green-500 mt-1">•</div>
                  <div><strong>95% accuracy guaranteed</strong> - AI eliminates human error</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-green-500 mt-1">•</div>
                  <div><strong>Real-time pricing</strong> - AI updates with current market rates</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-green-500 mt-1">•</div>
                  <div><strong>Professional templates</strong> - Consistent, branded presentation</div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="text-green-500 mt-1">•</div>
                  <div><strong>Instant delivery</strong> - Respond to leads immediately</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Contractors Love Our AI Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The AI quote generator is like having an experienced estimator working 24/7. It's incredibly accurate and saves me hours every day. My customers are impressed with the speed and professionalism."
              </p>
              <div className="font-medium text-gray-900">David Chen</div>
              <div className="text-sm text-gray-500">Premier Painting Services</div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "I was skeptical about AI at first, but this tool has transformed my business. I can now provide quotes during the initial consultation, which has increased my closing rate by 60%."
              </p>
              <div className="font-medium text-gray-900">Maria Rodriguez</div>
              <div className="text-sm text-gray-500">Rodriguez Painting Co.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experience the Future of Painting Quotes</h2>
          <p className="text-xl text-purple-100 mb-8">Try our AI quote generator free and see why contractors are switching to automated estimating</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/trial-signup" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-md text-lg font-medium flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Try AI Generator Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/painting-estimate-calculator" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-md text-lg font-medium">
              See Live Demo
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-purple-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Free AI quotes included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Instant activation</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}