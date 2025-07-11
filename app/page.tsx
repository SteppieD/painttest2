import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  FileText,
  BookOpen,
  Zap,
  DollarSign,
  BarChart3,
  Award,
  Check,
  Palette
} from 'lucide-react';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Paint Quote Pro - Professional Painting Quote Software for Contractors',
  description: 'Win 40-60% more painting jobs with professional quotes in 30 seconds. Trusted by 5,000+ painting contractors. Start free trial today.',
  keywords: 'painting quote software, painting estimate software, contractor quoting app, painting business tools',
  path: '/',
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="unified-section py-24 bg-gradient-to-br from-orange-50 to-white">
        <div className="unified-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="unified-h1">
              Win More Painting Jobs with <span className="text-orange-500">Professional Quotes</span>
            </h1>
            <p className="unified-body-large mb-8">
              Create stunning, professional painting quotes in 30 seconds. Trusted by 5,000+ contractors nationwide. 
              Increase your win rate by 40% with our AI-powered quoting platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trial-signup" className="unified-btn unified-btn-primary unified-btn-xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="unified-btn unified-btn-outline unified-btn-xl">
                Watch Demo
              </Link>
            </div>
            
            <div className="mt-12">
              <div className="flex items-center justify-center gap-6 unified-body-small text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="unified-section py-12 bg-gray-50">
        <div className="unified-container">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="unified-body">
              Trusted by <span className="font-semibold text-orange-500">5,000+</span> painting contractors
            </p>
          </div>
          
          <div className="unified-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <div className="unified-card text-center">
              <div className="p-6">
                <div className="unified-h3 text-orange-500 mb-2">5,000+</div>
                <div className="unified-body-small">Active Contractors</div>
              </div>
            </div>
            
            <div className="unified-card text-center">
              <div className="p-6">
                <div className="unified-h3 text-teal-500 mb-2">$73M+</div>
                <div className="unified-body-small">Quotes Generated</div>
              </div>
            </div>
            
            <div className="unified-card text-center">
              <div className="p-6">
                <div className="unified-h3 text-green-500 mb-2">99%</div>
                <div className="unified-body-small">Accuracy Rate</div>
              </div>
            </div>
            
            <div className="unified-card text-center">
              <div className="p-6">
                <div className="unified-h3 text-purple-500 mb-2">4.9/5</div>
                <div className="unified-body-small">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="unified-section">
        <div className="unified-container">
          <div className="text-center mb-12">
            <h2 className="unified-h2">Everything You Need to Win More Jobs</h2>
            <p className="unified-body-large">
              Professional tools designed specifically for painting contractors
            </p>
          </div>
          
          <div className="unified-grid grid-cols-1 md:grid-cols-3">
            <div className="unified-card">
              <div className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="unified-h4 mb-2">Instant Quotes</h3>
                <p className="unified-body mb-4">
                  Create professional painting quotes in 30 seconds with our AI-powered calculator. 
                  No more hours of manual calculations.
                </p>
                <Link href="/painting-estimate-calculator-free" className="unified-btn unified-btn-outline unified-btn-sm">
                  Try Calculator
                </Link>
              </div>
            </div>
            
            <div className="unified-card">
              <div className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="unified-h4 mb-2">Professional Templates</h3>
                <p className="unified-body mb-4">
                  Beautiful, branded quote templates that impress customers and increase your win rate. 
                  Fully customizable to match your brand.
                </p>
                <Link href="/paint-estimate-templates" className="unified-btn unified-btn-outline unified-btn-sm">
                  View Templates
                </Link>
              </div>
            </div>
            
            <div className="unified-card">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="unified-h4 mb-2">Smart Automation</h3>
                <p className="unified-body mb-4">
                  Automated follow-ups, digital signatures, and payment processing. 
                  Focus on painting while we handle the paperwork.
                </p>
                <Link href="/features" className="unified-btn unified-btn-outline unified-btn-sm">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="unified-section bg-gray-50">
        <div className="unified-container">
          <div className="text-center mb-12">
            <h2 className="unified-h2">How It Works</h2>
            <p className="unified-body-large">
              Three simple steps to professional quotes
            </p>
          </div>
          
          <div className="unified-grid grid-cols-1 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="unified-h4 mb-2">Enter Project Details</h3>
              <p className="unified-body">
                Simply describe the painting project or use our room templates for instant setup.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="unified-h4 mb-2">AI Calculates Everything</h3>
              <p className="unified-body">
                Our AI instantly calculates materials, labor, and provides accurate pricing based on your location.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="unified-h4 mb-2">Send Professional Quote</h3>
              <p className="unified-body">
                Generate a beautiful, branded quote and send it directly to your customer's email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="unified-section">
        <div className="unified-container">
          <div className="unified-grid grid-cols-1 md:grid-cols-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 className="unified-h2 mb-6">Why 5,000+ Contractors Choose Paint Quote Pro</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Increase Win Rate by 40%</h4>
                    <p className="unified-body-small">Professional quotes impress customers and build trust</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-1">
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Save 5+ Hours Per Week</h4>
                    <p className="unified-body-small">Automated calculations and instant quote generation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mt-1">
                    <DollarSign className="w-4 h-4 text-teal-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Increase Revenue by 278%</h4>
                    <p className="unified-body-small">Accurate pricing and faster turnaround times</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <Smartphone className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Work From Anywhere</h4>
                    <p className="unified-body-small">Mobile-optimized for on-site estimates and quotes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="unified-card bg-gradient-to-br from-orange-50 to-teal-50">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="unified-h3 mb-2">278% ROI</h3>
                <p className="unified-body">Average return on investment in just 90 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="unified-section bg-gray-50">
        <div className="unified-container max-w-3xl">
          <div className="unified-card bg-gradient-to-br from-orange-50 to-teal-50">
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="unified-h3 mb-6 text-gray-800">
                "Paint Quote Pro increased our revenue by $47,000 per month. The professional quotes 
                helped us win 60% more jobs than before."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Miguel Rodriguez</div>
                  <div className="unified-body-small">Rodriguez Painting, Texas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="unified-section bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="unified-container text-center">
          <h2 className="unified-h2 text-white mb-6">
            Ready to Win More Painting Jobs?
          </h2>
          <p className="unified-body-large mb-8 opacity-90">
            Join 5,000+ contractors who've increased their win rates with Paint Quote Pro. 
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trial-signup" className="unified-btn bg-white text-orange-500 hover:bg-gray-100 unified-btn-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo" className="unified-btn border-2 border-white text-white hover:bg-white hover:text-orange-500 unified-btn-lg">
              Watch Demo
            </Link>
          </div>
          
          <div className="mt-12">
            <div className="flex items-center justify-center gap-6 unified-body-small opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}