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
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

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
      <Header />

      {/* Hero Section - CIALDINI: Social Proof & Authority */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          {/* Authority Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by 5,000+ Professional Contractors Nationwide</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Only Painting Quote Software That <span className="text-blue-600">Guarantees Results</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the thousands of professional painters who've increased their win rates by 40% and reduced quote time by 80%. 
            Every feature is battle-tested by real contractors in the field.
          </p>
          
          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {socialProofStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Start Free Trial - All Features Included
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-gray-500">✓ No credit card required ✓ 1 free quote included ✓ Setup in 5 minutes</p>
          </div>
        </div>
      </section>

      {/* Trust Indicators - CIALDINI: Authority */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="container mx-auto max-w-4xl">
          <p className="text-center text-gray-600 mb-8">
            "The most comprehensive painting quote software I've ever used. Pays for itself with the first job."
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-gray-600">4.9/5 stars on G2</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
              <p className="text-sm text-gray-600">Uptime SLA</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
              <p className="text-sm text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features - CIALDINI: Social Proof with Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features That Actually <span className="text-blue-600">Increase Your Revenue</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                      <Icon className="w-4 h-4" />
                      <span>{feature.badge}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-blue-600 font-medium mb-4">
                      {feature.subtitle}
                    </p>
                    <p className="text-gray-600 mb-6 text-lg">
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
                    
                    {/* Customer Testimonial - CIALDINI: Social Proof */}
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 italic mb-2">{feature.proof}</p>
                    </div>
                  </div>
                  
                  <div className={`${isEven ? '' : 'lg:col-start-1'} bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 flex items-center justify-center`}>
                    <div className="text-center">
                      <Icon className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                      <div className="text-lg font-semibold text-gray-900 mb-2">
                        Live Demo Available
                      </div>
                      <Button variant="outline" asChild>
                        <Link href="/demo">
                          See {feature.title} in Action
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features - CIALDINI: Scarcity */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Features for <span className="text-blue-600">Growing Businesses</span>
            </h2>
            <p className="text-xl text-gray-600">
              Unlock powerful features as your business grows. Available in Professional and Business plans.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-10 h-10 text-blue-600" />
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {feature.available}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href="/pricing">
                        Upgrade to Access
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA - CIALDINI: Commitment & Scarcity */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join 5,000+ Contractors Who <span className="text-yellow-300">Increased Their Revenue</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't let another lead slip away to faster competitors. Start your free trial today and experience 
            the difference professional quote software makes.
          </p>
          
          {/* Urgency Element - CIALDINI: Scarcity */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="text-yellow-300 font-bold mb-2">⚡ Limited Time Offer</div>
            <div className="text-white text-lg mb-2">First 100 signups this month get:</div>
            <ul className="text-blue-100 text-left space-y-1">
              <li>✓ 3 free quotes (normally 1)</li>
              <li>✓ Free setup consultation</li>
              <li>✓ Priority customer support</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Claim Your Free Trial + Bonuses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-blue-200 text-sm">
              <span>✓ No credit card required</span>
              <span>✓ Full feature access</span>
              <span>✓ Cancel anytime</span>
            </div>
            
            <p className="text-blue-200 text-sm max-w-md mx-auto">
              Join contractors like Mike Johnson (Elite Painting) who says: "ProPaint Quote paid for itself with the first job. 
              My win rate went from 30% to 70%."
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}