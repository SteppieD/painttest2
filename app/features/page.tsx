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
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Painting Quote Software Features - Trusted by 5,000+ Professional Contractors',
  description: 'Discover why 5,000+ painting contractors choose ProPaint Quote. Smart calculators, mobile quoting, customer management, and profit analytics. See 40% higher win rates.',
  keywords: 'painting software features, quote calculator, mobile estimating, contractor tools, painting business management, professional painting quotes, painting estimate software',
  path: '/features',
});

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
    <div>
      <KofiHeader />
      
      {/* Hero Section - Ko-fi Design */}
      <section>
        <div>
          <div>
            <div>
              <Star />
              <span>Trusted by 5,000+ Professional Contractors Nationwide</span>
            </div>
            
            <h1>
              The Only Painting Quote Software That <span>Guarantees Results</span>
            </h1>
            <p>
              Join the thousands of professional painters who've increased their win rates by 40% and reduced quote time by 80%. 
              Every feature is battle-tested by real contractors in the field.
            </p>
          
            <div>
              {socialProofStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index}>
                    <div>
                      <div>
                        <Icon />
                      </div>
                      <div>{stat.number}</div>
                      <div>{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div>
              <Link href="/trial-signup">
                Start Free Trial - All Features Included
                <ArrowRight />
              </Link>
            </div>
            
            <div>
              <p>✓ No credit card required ✓ 1 free quote included ✓ Setup in 5 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section>
        <div>
          <div>
            <p>
              "The most comprehensive painting quote software I've ever used. Pays for itself with the first job."
            </p>
          </div>
          
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <div>4.9/5</div>
              <p>stars on G2</p>
            </div>
            <div>
              <div>99.9%</div>
              <p>Uptime SLA</p>
            </div>
            <div>
              <div>24/7</div>
              <p>Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section>
        <div>
          <div>
            <h2>
              Features That Actually <span>Increase Your Revenue</span>
            </h2>
            <p>
              Every feature is designed based on feedback from thousands of professional contractors. 
              Here's what our customers are saying:
            </p>
          </div>
          
          <div>
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index}`}>
                  <div>
                    <div>
                      <Icon />
                      <span>{feature.badge}</span>
                    </div>
                    
                    <h3>
                      {feature.title}
                    </h3>
                    <p>
                      {feature.subtitle}
                    </p>
                    <p>
                      {feature.description}
                    </p>
                    
                    <ul>
                      {feature.benefits.map((benefit, i) => (
                        <li key={i}>
                          <CheckCircle />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Customer Testimonial */}
                    <div>
                      <div>
                        <p>{feature.proof}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div kofi-card bg-gradient-to-br from-orange-50 to-teal-50`}>
                    <div>
                      <Icon />
                      <div>
                        Live Demo Available
                      </div>
                      <Link href="/demo">
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
      <section>
        <div>
          <div>
            <h2>
              Experience Our <span>Smart Calculator</span> Technology
            </h2>
            <p>
              Try the same calculators that 5,000+ contractors use daily. See the difference professional tools make.
            </p>
          </div>
          
          <div>
            <QuickPaintCalculator 
              title="Professional Paint Calculator"
              subtitle="Used by 5,000+ contractors daily"
            />
            <RoomCalculatorWidget 
              title="Smart Room Calculator"
            />
          </div>
          
          <div>
            <Link href="/trial-signup">
              Get Full Professional Calculator Suite
              <ArrowRight />
            </Link>
            <p>
              Professional version includes regional pricing, material costs, profit optimization, and mobile access
            </p>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section>
        <div>
          <div>
            <h2>
              Advanced Features for <span>Growing Businesses</span>
            </h2>
            <p>
              Unlock powerful features as your business grows. Available in Professional and Business plans.
            </p>
          </div>
          
          <div>
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index}>
                  <div>
                    <div>
                      <div>
                        <Icon />
                      </div>
                      <div>
                        {feature.available}
                      </div>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <Link href="/pricing">
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
      <section>
        <div>
          <h2>
            Join 5,000+ Contractors Who <span>Increased Their Revenue</span>
          </h2>
          <p>
            Don't let another lead slip away to faster competitors. Start your free trial today and experience 
            the difference professional quote software makes.
          </p>
          
          {/* Urgency Element */}
          <div>
            <div>
              <div>⚡ Limited Time Offer</div>
              <div>First 100 signups this month get:</div>
              <ul>
                <li>✓ 3 free quotes (normally 1)</li>
                <li>✓ Free setup consultation</li>
                <li>✓ Priority customer support</li>
              </ul>
            </div>
          </div>
          
          <div>
            <Link href="/trial-signup">
              Claim Your Free Trial + Bonuses
              <ArrowRight />
            </Link>
            
            <div>
              <span>✓ No credit card required</span>
              <span>✓ Full feature access</span>
              <span>✓ Cancel anytime</span>
            </div>
            
            <p>
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