import Link from 'next/link'
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
  DollarSign,
  Target,
  Zap,
  Award,
  BarChart3,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'
import { IndustryStats } from '@/components/marketing/industry-stats'
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel'
import { generatePageMetadata } from '@/lib/metadata-utils'

export const metadata = generatePageMetadata({
  title: 'Painting Contractors: Professional Quote Software | Win 40-60% More Jobs',
  description: 'Professional painting quote software built for contractors. Generate quotes in 6 minutes vs 6 hours. Join 5,000+ contractors winning 40-60% more jobs with same-day quotes.',
  keywords: 'painting contractor software, painting estimate software, quote software for painters, painting business tools, contractor quoting app, painting job estimator, professional painting quotes',
  path: '/painting-contractors',
})

export default function PaintingContractorsPage() {
  const contractorChallenges = [
    {
      icon: <Clock />,
      problem: "Manual Quoting Takes 2-6 Hours",
      solution: "Generate quotes in 6 minutes on-site",
      impact: "Save 4.5 hours per quote ($225 value)"
    },
    {
      icon: <Target />,
      problem: "24-48 Hour Response Window",
      solution: "Same-day quote delivery while on-site",
      impact: "Beat competitors who take days to respond"
    },
    {
      icon: <DollarSign />,
      problem: "Low Win Rates (25-35%)",
      solution: "Professional presentation increases trust",
      impact: "Win 40-60% more jobs with better quotes"
    },
    {
      icon: <FileText />,
      problem: "Inconsistent Quote Formatting",
      solution: "Branded, professional templates",
      impact: "Build customer confidence and credibility"
    }
  ]

  const contractorFeatures = [
    {
      icon: <Smartphone />,
      title: "Mobile-First Design",
      description: "Create quotes on your phone or tablet while at the customer's location. Perfect for walk-through estimates.",
      benefit: "Close deals while excitement is high"
    },
    {
      icon: <Calculator />,
      title: "Smart Material Calculator",
      description: "Automatically calculate paint, primer, labor costs with industry-standard formulas. Never underestimate again.",
      benefit: "Protect your profit margins"
    },
    {
      icon: <BarChart3 />,
      title: "Win Rate Analytics",
      description: "Track your conversion rates, average job size, and identify which types of jobs you win most often.",
      benefit: "Make data-driven business decisions"
    },
    {
      icon: <Users />,
      title: "Customer Management",
      description: "Keep track of all prospects, follow up on pending quotes, and manage your sales pipeline effectively.",
      benefit: "Never lose track of potential revenue"
    },
    {
      icon: <Shield />,
      title: "Professional Branding",
      description: "Every quote includes your logo, colors, and professional formatting that builds customer confidence.",
      benefit: "Stand out from handwritten estimates"
    },
    {
      icon: <Zap />,
      title: "Instant Calculations",
      description: "Real-time pricing updates as you adjust room sizes, paint types, or service options during consultations.",
      benefit: "Answer 'what if' questions instantly"
    }
  ]

  const businessSizes = [
    {
      type: "Solo Contractors",
      description: "1 person painting business",
      painPoints: ["Time is money", "Need professional image", "Compete with larger companies"],
      solution: "10 free quotes/month + professional presentation",
      result: "Average $2,800/month revenue increase"
    },
    {
      type: "Small Teams",
      description: "2-4 employee painting companies", 
      painPoints: ["Multiple crews to manage", "Consistent pricing needed", "Scale operations"],
      solution: "Unlimited quotes + team collaboration",
      result: "40-60% win rate improvement"
    },
    {
      type: "Growing Businesses",
      description: "5+ employees, multiple locations",
      painPoints: ["Complex project management", "Multi-location coordination", "Advanced reporting"],
      solution: "Enterprise features + dedicated support",
      result: "25% profit margin improvement"
    }
  ]

  return (
    <div>

      {/* Hero Section - Contractor Focused */}
      <section>
        <div>
          <div>
            <Award />
            <span>Trusted by 5,000+ Professional Painting Contractors</span>
          </div>
          
          <h1>
            Stop Losing Jobs to <span>Slow Quotes</span>
          </h1>
          <p>
            While you're spending 6 hours creating estimates, competitors deliver professional quotes in 6 minutes and win the job. 
            Join <strong>5,000+ contractors</strong> who've increased win rates by <strong>40-60%</strong> with same-day quoting.
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Free
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Watch 2-Minute Demo
              </Link>
            </Button>
          </div>
          
          <div>
            <div>
              <CheckCircle />
              <span>No credit card required</span>
            </div>
            <div>
              <Clock />
              <span>Setup in under 5 minutes</span>
            </div>
            <div>
              <TrendingUp />
              <span>See results in first week</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contractor Pain Points & Solutions */}
      <section>
        <div>
          <div>
            <h2>
              The Contractor's Dilemma: Speed vs. Professionalism
            </h2>
            <p>
              Every painting contractor faces the same challenge: customers want quotes fast, but professional estimates take hours to create.
            </p>
          </div>

          <div>
            {contractorChallenges.map((challenge, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {challenge.icon}
                  </div>
                  <CardTitle>{challenge.problem}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{challenge.solution}</p>
                  <p>{challenge.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Statistics */}
      <IndustryStats 
        
        title="Why Painting Contractors Choose ProPaint Quote"
        subtitle="Data-driven insights from thousands of successful contractors"
      />

      {/* Features for Contractors */}
      <section>
        <div>
          <div>
            <h2>
              Built Specifically for Painting Contractors
            </h2>
            <p>
              Every feature designed to solve real contractor problems and increase your win rate
            </p>
          </div>

          <div>
            {contractorFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                  <div>
                    <p>
                      ✓ {feature.benefit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions by Business Size */}
      <section>
        <div>
          <div>
            <h2>
              Solutions for Every Size Painting Business
            </h2>
            <p>
              From solo contractors to multi-crew operations, we have the right plan for your business
            </p>
          </div>

          <div>
            {businessSizes.map((business, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{business.type}</CardTitle>
                  <p>{business.description}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4>Common Challenges:</h4>
                    <ul>
                      {business.painPoints.map((point, i) => (
                        <li key={i}>
                          <span>•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4>Our Solution:</h4>
                    <p>{business.solution}</p>
                  </div>

                  <div>
                    <p>{business.result}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Success Stories */}
      <TestimonialCarousel />

      {/* ROI Calculator for Contractors */}
      <section>
        <div>
          <div>
            <h2>
              Calculate Your Revenue Potential
            </h2>
            <p>
              See exactly how much more revenue you could generate with professional quotes and faster response times
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Location-Based SEO Section */}
      <section>
        <div>
          <div>
            <h2>
              Serving Painting Contractors Nationwide
            </h2>
            <p>
              Professional quote software trusted by contractors in every major market
            </p>
          </div>

          <div>
            {[
              "Texas Painting Contractors", "California Painters", "Florida Painting Companies",
              "New York Contractors", "Georgia Paint Pros", "North Carolina Painters",
              "Arizona Painting Services", "Colorado Contractors", "Washington Painters",
              "Oregon Painting Companies", "Virginia Paint Contractors", "Maryland Painters"
            ].map((location, index) => (
              <div key={index}>
                <MapPin />
                <span>{location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div>
          <h2>
            Ready to Win More Painting Jobs?
          </h2>
          <p>
            Join 5,000+ contractors who've transformed their quoting process and increased revenue by 40-60%
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Free Trial Today
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
          
          <div>
            <div>✓ 10 free quotes to start</div>
            <div>✓ No credit card required</div>
            <div>✓ See results in first week</div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Painting Contractor Software - Professional Quote Tool",
            "description": "Professional painting quote software for contractors. Generate quotes in 6 minutes vs 6 hours. 40-60% higher win rates.",
            "url": "https://propaintquote.com/painting-contractors",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "ProPaint Quote",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "audience": {
                "@type": "Audience",
                "audienceType": "Painting Contractors"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "10 free quotes included"
              }
            }
          })
        }}
      />
    </div>
  )
}