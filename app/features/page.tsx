import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  Smartphone,
  Users,
  TrendingUp,
  Shield,
  Palette,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  DollarSign,
  Target,
  Award,
  Globe,
  Briefcase,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { QuickPaintCalculator } from '@/components/calculators/quick-paint-calculator';
import { RoomCalculatorWidget } from '@/components/calculators/room-calculator-widget';

export const metadata: Metadata = {
  title: 'Painting Quote Software Features - Trusted by 5,000+ Professional Contractors | ProPaint Quote',
  description: 'Discover why 5,000+ painting contractors choose ProPaint Quote. Smart calculators, mobile quoting, customer management, and profit analytics. See 40% higher win rates.',
  keywords: 'painting software features, quote calculator, mobile estimating, contractor tools, painting business management, professional painting quotes, painting estimate software',
  alternates: {
    canonical: '/features',
  },
  openGraph: {
    title: 'Painting Quote Software Features - Trusted by 5,000+ Contractors',
    description: 'Join 5,000+ professional painters using ProPaint Quote. Smart features that increase win rates by 40% and reduce quote time by 80%.',
    url: '/features',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function FeaturesPage() {
  // CIALDINI PRINCIPLE: Social Proof & Authority
  const socialProofStats = [
    { number: "5,000+", label: "Professional Contractors", icon: Users },
    { number: "$2.3M+", label: "In Quotes Generated", icon: DollarSign },
    { number: "40%", label: "Higher Win Rates", icon: Target },
    { number: "95%", label: "Quote Accuracy", icon: Award }
  ];

  // CIALDINI PRINCIPLE: Authority & Expertise
  const coreFeatures = [
    {
      icon: Calculator,
      title: 'AI-Powered Quote Calculator',
      subtitle: 'Used by 5,000+ Professional Contractors',
      description: 'Industry-leading formulas developed by master painters with 50+ years combined experience. Never lose money on underestimated jobs again.',
      benefits: [
        'Precise material calculations (±2% accuracy)',
        'Labor cost estimation by surface type',
        'Automatic markup with profit optimization',
        'Paint coverage calculations for all brands',
        'Regional pricing adjustments'
      ],
      proof: '"Increased our accuracy by 95% and saved 3 hours per quote" - Mike Johnson, Elite Painting',
      badge: 'Most Popular'
    },
    {
      icon: Clock,
      title: '5-Minute Professional Quotes',
      subtitle: '80% Faster Than Traditional Methods',
      description: 'Respond to leads while your competitors are still calculating. Our proven system generates detailed quotes in under 5 minutes.',
      benefits: [
        'Instant quote generation with one-click',
        'Professional PDF exports with your branding',
        'Automated email delivery to customers',
        'Mobile-optimized quote viewing',
        'Real-time quote status tracking'
      ],
      proof: '"We\'re booking 3x more jobs since switching" - Sarah Martinez, ProPaint Solutions',
      badge: 'Time Saver'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      subtitle: 'Quote On-Site, Win More Jobs',
      description: 'Close deals on the spot with instant mobile quoting. Works perfectly on phones and tablets - no laptop required.',
      benefits: [
        'Works offline when internet is spotty',
        'Touch-optimized for easy navigation',
        'Camera integration for job photos',
        'GPS location tracking for travel time',
        'Instant customer signature capture'
      ],
      proof: '"Closed a $15K job on-site with my phone" - David Chen, Precision Painters',
      badge: 'Mobile First'
    },
    {
      icon: Users,
      title: 'Customer Relationship Management',
      subtitle: 'Never Lose a Lead Again',
      description: 'Built-in CRM designed specifically for painting contractors. Track every lead from first contact to project completion.',
      benefits: [
        'Complete customer history and notes',
        'Automated follow-up reminders',
        'Lead source tracking and ROI analysis',
        'Customer lifetime value calculations',
        'Referral tracking and rewards'
      ],
      proof: '"Our follow-up rate went from 20% to 95%" - Lisa Rodriguez, Color Masters LLC',
      badge: 'Relationship Builder'
    },
    {
      icon: TrendingUp,
      title: 'Profit Analytics Dashboard',
      subtitle: 'Data-Driven Business Growth',
      description: 'Make smarter business decisions with detailed analytics. See exactly what\'s working and what isn\'t.',
      benefits: [
        'Win rate tracking by job type and size',
        'Profit margin analysis per project',
        'Monthly and yearly growth reports',
        'Customer acquisition cost tracking',
        'Seasonal trend analysis'
      ],
      proof: '"Identified our most profitable services and increased margins by 25%" - Tom Wilson, Fresh Look Painters',
      badge: 'Business Intelligence'
    },
    {
      icon: Shield,
      title: 'Professional Branding Suite',
      subtitle: 'Stand Out From Competitors',
      description: 'Present like a Fortune 500 company with professional, branded materials that build instant trust and credibility.',
      benefits: [
        'Custom logo and color scheme integration',
        'Professional quote templates',
        'Branded email signatures and headers',
        'Certificate and license display',
        'Trust badges and security indicators'
      ],
      proof: '"Customers comment on how professional our quotes look" - Jennifer Adams, Royal Brush Company',
      badge: 'Trust Builder'
    }
  ];

  // CIALDINI PRINCIPLE: Scarcity & Commitment
  const advancedFeatures = [
    {
      icon: Zap,
      title: 'Instant Paint Matching',
      description: 'Match any color instantly with our database of 50,000+ paint colors from major brands.',
      available: 'Professional Plan'
    },
    {
      icon: Globe,
      title: 'Multi-Location Management',
      description: 'Manage multiple crews and locations from one dashboard. Perfect for growing businesses.',
      available: 'Business Plan'
    },
    {
      icon: Briefcase,
      title: 'API Integration',
      description: 'Connect with your existing tools - QuickBooks, Google Calendar, and more.',
      available: 'Business Plan'
    },
    {
      icon: BarChart3,
      title: 'Advanced Reporting',
      description: 'Custom reports for accountants, investors, and business planning.',
      available: 'Business Plan'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />
      
      {/* Hero Section - Ko-fi Design */}
      <section className="kofi-hero">
        <div className="kofi-container">
          <div className="kofi-hero-content">
            <div className="kofi-badge kofi-badge-success kofi-mb-md">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by 5,000+ Professional Contractors Nationwide</span>
            </div>
            
            <h1 className="kofi-h1">
              The Only Painting Quote Software That <span className="text-orange-500">Guarantees Results</span>
            </h1>
            <p className="kofi-body-large kofi-mb-xl">
              Join the thousands of professional painters who've increased their win rates by 40% and reduced quote time by 80%. 
              Every feature is battle-tested by real contractors in the field.
            </p>
          
            <div className="kofi-grid kofi-grid-4 kofi-mb-xl">
              {socialProofStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="kofi-card kofi-text-center">
                    <div className="kofi-card-body">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="kofi-h3 text-orange-500 kofi-mb-sm">{stat.number}</div>
                      <div className="kofi-body-small">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="kofi-hero-actions">
              <Link href="/trial-signup" className="kofi-btn kofi-btn-primary kofi-btn-xl">
                Start Free Trial - All Features Included
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="kofi-mt-lg">
              <p className="kofi-body-small text-gray-600">✓ No credit card required ✓ 1 free quote included ✓ Setup in 5 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="kofi-section-sm bg-white border-b border-gray-200">
        <div className="kofi-container-narrow">
          <div className="kofi-text-center kofi-mb-lg">
            <p className="kofi-body-large text-gray-600">
              "The most comprehensive painting quote software I've ever used. Pays for itself with the first job."
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-3">
            <div className="kofi-text-center">
              <div className="flex justify-center kofi-mb-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="kofi-h3 text-green-500 kofi-mb-xs">4.9/5</div>
              <p className="kofi-body-small">stars on G2</p>
            </div>
            <div className="kofi-text-center">
              <div className="kofi-h3 text-green-500 kofi-mb-xs">99.9%</div>
              <p className="kofi-body-small">Uptime SLA</p>
            </div>
            <div className="kofi-text-center">
              <div className="kofi-h3 text-teal-500 kofi-mb-xs">24/7</div>
              <p className="kofi-body-small">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="kofi-section">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">
              Features That Actually <span className="text-orange-500">Increase Your Revenue</span>
            </h2>
            <p className="kofi-body-large">
              Every feature is designed based on feedback from thousands of professional contractors. 
              Here's what our customers are saying:
            </p>
          </div>
          
          <div className="space-y-16">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  isEven ? '' : 'lg:grid-flow-col-dense'
                }`}>
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <div className="kofi-badge kofi-badge-secondary kofi-mb-md">
                      <Icon className="w-4 h-4" />
                      <span>{feature.badge}</span>
                    </div>
                    
                    <h3 className="kofi-h3 kofi-mb-sm">
                      {feature.title}
                    </h3>
                    <p className="kofi-body-large text-teal-500 font-medium kofi-mb-md">
                      {feature.subtitle}
                    </p>
                    <p className="kofi-body kofi-mb-lg">
                      {feature.description}
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Customer Testimonial */}
                    <div className="kofi-card bg-gray-50 border-l-4 border-orange-500">
                      <div className="kofi-card-body">
                        <p className="kofi-body text-gray-700 italic">{feature.proof}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${isEven ? '' : 'lg:col-start-1'} kofi-card bg-gradient-to-br from-orange-50 to-teal-50`}>
                    <div className="kofi-card-body kofi-text-center">
                      <Icon className="w-24 h-24 text-orange-500 mx-auto kofi-mb-md" />
                      <div className="kofi-h4 kofi-mb-sm">
                        Live Demo Available
                      </div>
                      <Link href="/demo" className="kofi-btn kofi-btn-outline kofi-btn-sm">
                        See {feature.title} in Action
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Try Our Calculator */}
      <section className="kofi-section bg-gray-50">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">
              Experience Our <span className="text-orange-500">Smart Calculator</span> Technology
            </h2>
            <p className="kofi-body-large">
              Try the same calculators that 5,000+ contractors use daily. See the difference professional tools make.
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-2 kofi-mb-xl">
            <QuickPaintCalculator 
              title="Professional Paint Calculator"
              subtitle="Used by 5,000+ contractors daily"
            />
            <RoomCalculatorWidget 
              title="Smart Room Calculator"
            />
          </div>
          
          <div className="kofi-text-center">
            <Link href="/trial-signup" className="kofi-btn kofi-btn-primary kofi-btn-lg kofi-mb-md">
              Get Full Professional Calculator Suite
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="kofi-body text-gray-600">
              Professional version includes regional pricing, material costs, profit optimization, and mobile access
            </p>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="kofi-section bg-white">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">
              Advanced Features for <span className="text-orange-500">Growing Businesses</span>
            </h2>
            <p className="kofi-body-large">
              Unlock powerful features as your business grows. Available in Professional and Business plans.
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-2">
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="kofi-card hover:kofi-shadow-lg transition-shadow">
                  <div className="kofi-card-body">
                    <div className="flex items-center justify-between kofi-mb-md">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="kofi-badge kofi-badge-secondary">
                        {feature.available}
                      </div>
                    </div>
                    <h3 className="kofi-h4 kofi-mb-sm">{feature.title}</h3>
                    <p className="kofi-body kofi-mb-md">{feature.description}</p>
                    <Link href="/pricing" className="kofi-btn kofi-btn-outline kofi-btn-sm w-full">
                      Upgrade to Access
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="kofi-section bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="kofi-container-narrow kofi-text-center">
          <h2 className="kofi-h2 text-white kofi-mb-md">
            Join 5,000+ Contractors Who <span className="text-yellow-300">Increased Their Revenue</span>
          </h2>
          <p className="kofi-body-large opacity-90 kofi-mb-xl">
            Don't let another lead slip away to faster competitors. Start your free trial today and experience 
            the difference professional quote software makes.
          </p>
          
          {/* Urgency Element */}
          <div className="kofi-card bg-white/10 backdrop-blur kofi-mb-xl">
            <div className="kofi-card-body">
              <div className="text-yellow-300 font-bold kofi-mb-sm">⚡ Limited Time Offer</div>
              <div className="text-white kofi-body-large kofi-mb-sm">First 100 signups this month get:</div>
              <ul className="text-left space-y-1 kofi-body-small text-gray-200">
                <li>✓ 3 free quotes (normally 1)</li>
                <li>✓ Free setup consultation</li>
                <li>✓ Priority customer support</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <Link href="/trial-signup" className="kofi-btn bg-white text-orange-500 hover:bg-gray-100 kofi-btn-lg">
              Claim Your Free Trial + Bonuses
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-200 kofi-body-small">
              <span>✓ No credit card required</span>
              <span>✓ Full feature access</span>
              <span>✓ Cancel anytime</span>
            </div>
            
            <p className="kofi-body-small text-gray-200 max-w-md mx-auto">
              Join contractors like Mike Johnson (Elite Painting) who says: "ProPaint Quote paid for itself with the first job. 
              My win rate went from 30% to 70%."
            </p>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}