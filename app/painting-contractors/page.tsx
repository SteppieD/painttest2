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
      icon: <Clock className="w-8 h-8 text-red-600" />,
      problem: "Manual Quoting Takes 2-6 Hours",
      solution: "Generate quotes in 6 minutes on-site",
      impact: "Save 4.5 hours per quote ($225 value)"
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      problem: "24-48 Hour Response Window",
      solution: "Same-day quote delivery while on-site",
      impact: "Beat competitors who take days to respond"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      problem: "Low Win Rates (25-35%)",
      solution: "Professional presentation increases trust",
      impact: "Win 40-60% more jobs with better quotes"
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      problem: "Inconsistent Quote Formatting",
      solution: "Branded, professional templates",
      impact: "Build customer confidence and credibility"
    }
  ]

  const contractorFeatures = [
    {
      icon: <Smartphone className="w-12 h-12 text-blue-600" />,
      title: "Mobile-First Design",
      description: "Create quotes on your phone or tablet while at the customer's location. Perfect for walk-through estimates.",
      benefit: "Close deals while excitement is high"
    },
    {
      icon: <Calculator className="w-12 h-12 text-green-600" />,
      title: "Smart Material Calculator",
      description: "Automatically calculate paint, primer, labor costs with industry-standard formulas. Never underestimate again.",
      benefit: "Protect your profit margins"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-purple-600" />,
      title: "Win Rate Analytics",
      description: "Track your conversion rates, average job size, and identify which types of jobs you win most often.",
      benefit: "Make data-driven business decisions"
    },
    {
      icon: <Users className="w-12 h-12 text-orange-600" />,
      title: "Customer Management",
      description: "Keep track of all prospects, follow up on pending quotes, and manage your sales pipeline effectively.",
      benefit: "Never lose track of potential revenue"
    },
    {
      icon: <Shield className="w-12 h-12 text-indigo-600" />,
      title: "Professional Branding",
      description: "Every quote includes your logo, colors, and professional formatting that builds customer confidence.",
      benefit: "Stand out from handwritten estimates"
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-600" />,
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
    <div className="min-h-screen bg-white">

      {/* Hero Section - Contractor Focused */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trusted by 5,000+ Professional Painting Contractors</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop Losing Jobs to <span className="text-red-500">Slow Quotes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            While you're spending 6 hours creating estimates, competitors deliver professional quotes in 6 minutes and win the job. 
            Join <strong>5,000+ contractors</strong> who've increased win rates by <strong>40-60%</strong> with same-day quoting.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/demo">
                Watch 2-Minute Demo
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span>Setup in under 5 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>See results in first week</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contractor Pain Points & Solutions */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Contractor's Dilemma: Speed vs. Professionalism
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every painting contractor faces the same challenge: customers want quotes fast, but professional estimates take hours to create.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contractorChallenges.map((challenge, index) => (
              <Card key={index} className="text-center border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {challenge.icon}
                  </div>
                  <CardTitle className="text-lg text-red-700 mb-2">{challenge.problem}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 font-semibold mb-2">{challenge.solution}</p>
                  <p className="text-sm text-gray-600">{challenge.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Statistics */}
      <IndustryStats 
        className="bg-gray-50" 
        title="Why Painting Contractors Choose ProPaint Quote"
        subtitle="Data-driven insights from thousands of successful contractors"
      />

      {/* Features for Contractors */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built Specifically for Painting Contractors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed to solve real contractor problems and increase your win rate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contractorFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solutions for Every Size Painting Business
            </h2>
            <p className="text-xl text-gray-600">
              From solo contractors to multi-crew operations, we have the right plan for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessSizes.map((business, index) => (
              <Card key={index} className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">{business.type}</CardTitle>
                  <p className="text-gray-600">{business.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Common Challenges:</h4>
                    <ul className="space-y-2">
                      {business.painPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-red-500 mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Our Solution:</h4>
                    <p className="text-sm text-green-700 font-medium">{business.solution}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <p className="text-sm font-bold text-green-800">{business.result}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Success Stories */}
      <TestimonialCarousel className="bg-white" />

      {/* ROI Calculator for Contractors */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Revenue Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly how much more revenue you could generate with professional quotes and faster response times
            </p>
          </div>
          
          <ROICalculator className="mb-8" />
        </div>
      </section>

      {/* Location-Based SEO Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Serving Painting Contractors Nationwide
            </h2>
            <p className="text-xl text-gray-600">
              Professional quote software trusted by contractors in every major market
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
            {[
              "Texas Painting Contractors", "California Painters", "Florida Painting Companies",
              "New York Contractors", "Georgia Paint Pros", "North Carolina Painters",
              "Arizona Painting Services", "Colorado Contractors", "Washington Painters",
              "Oregon Painting Companies", "Virginia Paint Contractors", "Maryland Painters"
            ].map((location, index) => (
              <div key={index} className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{location}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Win More Painting Jobs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ contractors who've transformed their quoting process and increased revenue by 40-60%
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" asChild className="text-lg px-12 py-6">
              <Link href="/trial-signup">
                Start Free Trial Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-blue-200 text-sm">
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