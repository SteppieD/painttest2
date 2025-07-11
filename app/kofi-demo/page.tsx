import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Palette,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Ko-fi Inspired Design Demo - Paint Quote Pro',
  description: 'Demo of Ko-fi inspired design system for Paint Quote Pro',
};

export default function KofiDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />
      
      {/* Ko-fi Hero Section */}
      <section className="kofi-hero">
        <div className="kofi-container">
          <div className="kofi-hero-content">
            <h1 className="kofi-h1">
              Win More Painting Jobs with <span className="text-orange-500">Professional Quotes</span>
            </h1>
            <p className="kofi-body-large kofi-mb-xl">
              Create stunning, professional painting quotes in 30 seconds. Trusted by 5,000+ contractors nationwide. 
              Increase your win rate by 40% with our AI-powered quoting platform.
            </p>
            <div className="kofi-hero-actions">
              <Link href="/trial-signup" className="kofi-btn kofi-btn-primary kofi-btn-xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="kofi-btn kofi-btn-outline kofi-btn-xl">
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="kofi-section-sm bg-gray-50">
        <div className="kofi-container">
          <div className="text-center kofi-mb-lg">
            <div className="flex items-center justify-center gap-1 kofi-mb-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="kofi-body">
              Trusted by <span className="font-semibold text-orange-500">5,000+</span> painting contractors
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-3">
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto kofi-mb-md">
                  <TrendingUp className="w-8 h-8 text-orange-500" />
                </div>
                <div className="kofi-h3 text-orange-500 kofi-mb-sm">278%</div>
                <div className="kofi-body-small">Average ROI in 90 days</div>
              </div>
            </div>
            
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto kofi-mb-md">
                  <Clock className="w-8 h-8 text-teal-500" />
                </div>
                <div className="kofi-h3 text-teal-500 kofi-mb-sm">30 sec</div>
                <div className="kofi-body-small">Average quote creation time</div>
              </div>
            </div>
            
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto kofi-mb-md">
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                <div className="kofi-h3 text-green-500 kofi-mb-sm">$47K</div>
                <div className="kofi-body-small">Monthly revenue increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="kofi-section">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">Everything You Need to Win More Jobs</h2>
            <p className="kofi-body-large">
              Professional tools designed specifically for painting contractors
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-3">
            <div className="kofi-card">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center kofi-mb-md">
                  <Calculator className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="kofi-h4 kofi-mb-sm">Instant Quotes</h3>
                <p className="kofi-body kofi-mb-md">
                  Create professional painting quotes in 30 seconds with our AI-powered calculator. 
                  No more hours of manual calculations.
                </p>
                <Link href="/painting-estimate-calculator-free" className="kofi-btn kofi-btn-outline kofi-btn-sm">
                  Try Calculator
                </Link>
              </div>
            </div>
            
            <div className="kofi-card">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center kofi-mb-md">
                  <Palette className="w-6 h-6 text-teal-500" />
                </div>
                <h3 className="kofi-h4 kofi-mb-sm">Professional Templates</h3>
                <p className="kofi-body kofi-mb-md">
                  Beautiful, branded quote templates that impress customers and increase your win rate. 
                  Fully customizable to match your brand.
                </p>
                <Link href="/paint-estimate-templates" className="kofi-btn kofi-btn-outline kofi-btn-sm">
                  View Templates
                </Link>
              </div>
            </div>
            
            <div className="kofi-card">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center kofi-mb-md">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="kofi-h4 kofi-mb-sm">Smart Automation</h3>
                <p className="kofi-body kofi-mb-md">
                  Automated follow-ups, digital signatures, and payment processing. 
                  Focus on painting while we handle the paperwork.
                </p>
                <Link href="/features" className="kofi-btn kofi-btn-outline kofi-btn-sm">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="kofi-section bg-gray-50">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">How It Works</h2>
            <p className="kofi-body-large">
              Three simple steps to professional quotes
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-3">
            <div className="kofi-text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto kofi-mb-md font-bold text-xl">
                1
              </div>
              <h3 className="kofi-h4 kofi-mb-sm">Enter Project Details</h3>
              <p className="kofi-body">
                Simply describe the painting project or use our room templates for instant setup.
              </p>
            </div>
            
            <div className="kofi-text-center">
              <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto kofi-mb-md font-bold text-xl">
                2
              </div>
              <h3 className="kofi-h4 kofi-mb-sm">AI Calculates Everything</h3>
              <p className="kofi-body">
                Our AI instantly calculates materials, labor, and provides accurate pricing based on your location.
              </p>
            </div>
            
            <div className="kofi-text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto kofi-mb-md font-bold text-xl">
                3
              </div>
              <h3 className="kofi-h4 kofi-mb-sm">Send Professional Quote</h3>
              <p className="kofi-body">
                Generate a beautiful, branded quote and send it directly to your customer's email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="kofi-section">
        <div className="kofi-container-narrow">
          <div className="kofi-card bg-gradient-to-br from-orange-50 to-teal-50">
            <div className="kofi-card-body kofi-text-center">
              <div className="flex items-center justify-center gap-1 kofi-mb-md">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="kofi-h3 kofi-mb-md text-gray-800">
                "Paint Quote Pro increased our revenue by $47,000 per month. The professional quotes 
                helped us win 60% more jobs than before."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div className="kofi-text-left">
                  <div className="font-semibold text-gray-900">Miguel Rodriguez</div>
                  <div className="kofi-body-small">Rodriguez Painting, Texas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="kofi-section bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="kofi-container kofi-text-center">
          <h2 className="kofi-h2 text-white kofi-mb-md">
            Ready to Win More Painting Jobs?
          </h2>
          <p className="kofi-body-large kofi-mb-xl opacity-90">
            Join 5,000+ contractors who've increased their win rates with Paint Quote Pro. 
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trial-signup" className="kofi-btn bg-white text-orange-500 hover:bg-gray-100 kofi-btn-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo" className="kofi-btn border-2 border-white text-white hover:bg-white hover:text-orange-500 kofi-btn-lg">
              Watch Demo
            </Link>
          </div>
          
          <div className="kofi-mt-xl">
            <div className="flex items-center justify-center gap-6 kofi-body-small opacity-80">
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