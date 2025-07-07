import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Smartphone,
  DollarSign,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'
import { SpeedComparison } from '@/components/marketing/speed-comparison'

export const metadata: Metadata = {
  title: 'Painting Estimate Software | Professional Quote Calculator for Contractors',
  description: 'Best painting estimate software for contractors. Create professional quotes in 6 minutes vs 6 hours. Join 5,000+ contractors with 40-60% higher win rates.',
  keywords: 'painting estimate software, painting quote software, contractor estimating software, painting calculator app, professional painting quotes, estimate software for painters',
  alternates: {
    canonical: '/painting-estimate-software',
  },
  openGraph: {
    title: 'Painting Estimate Software - Professional Quote Calculator',
    description: 'Create professional painting estimates in 6 minutes, not 6 hours. Used by 5,000+ contractors nationwide.',
    url: '/painting-estimate-software',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

export default function PaintingEstimateSoftwarePage() {
  const softwareFeatures = [
    {
      icon: <Calculator className="w-8 h-8 text-blue-600" />,
      title: "Smart Quote Calculator",
      description: "Industry-standard formulas automatically calculate materials, labor, and markup. Never underestimate a job again.",
      benefit: "Protect profit margins with accurate pricing"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      title: "Mobile-First Design", 
      description: "Create estimates on your phone or tablet while at the customer's location. Perfect for walk-through quotes.",
      benefit: "Close deals while excitement is high"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "6-Minute Quote Generation",
      description: "Generate detailed, professional estimates in minutes instead of hours. Respond faster than competitors.",
      benefit: "Win more jobs with speed advantage"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Professional Branding",
      description: "Every estimate includes your logo, colors, and professional formatting that builds customer confidence.",
      benefit: "Stand out from handwritten estimates"
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Win Rate Analytics",
      description: "Track conversion rates, average job size, and identify your most profitable project types.",
      benefit: "Make data-driven pricing decisions"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-600" />,
      title: "Profit Optimization",
      description: "Built-in markup calculations ensure you maintain healthy profit margins on every project.",
      benefit: "Maximize revenue per job"
    }
  ]

  const comparisonPoints = [
    {
      category: "Speed",
      traditional: "2-6 hours per estimate",
      software: "6 minutes per estimate",
      improvement: "95% time savings"
    },
    {
      category: "Accuracy", 
      traditional: "Manual calculations, prone to errors",
      software: "Industry-standard formulas, no mistakes",
      improvement: "100% calculation accuracy"
    },
    {
      category: "Presentation",
      traditional: "Handwritten or basic Word docs",
      software: "Professional branded estimates",
      improvement: "40-60% higher win rates"
    },
    {
      category: "Accessibility",
      traditional: "Office-based, desktop only",
      software: "Mobile-first, work anywhere",
      improvement: "Same-day quote delivery"
    }
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The #1 <span className="text-blue-600">Painting Estimate Software</span> for Contractors
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop losing jobs to slow estimates. Create professional painting quotes in <strong>6 minutes</strong> instead of 6 hours. 
            Trusted by <strong>5,000+ contractors</strong> with <strong>40-60% higher win rates</strong>.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Try Free - 10 Estimates Included
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/demo">
                See Live Demo
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
              <span>Works on all devices</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Instant setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional vs Software Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Traditional Estimating vs. Modern Software
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See why smart contractors are switching from manual estimating to professional software
            </p>
          </div>

          <div className="grid gap-8">
            {comparisonPoints.map((point, index) => (
              <Card key={index} className="border-2 border-gray-100">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6 items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{point.category}</h3>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <p className="text-sm text-red-700 font-medium">Traditional Method</p>
                      <p className="text-red-800">{point.traditional}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">With Software</p>
                      <p className="text-green-800">{point.software}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-700 font-medium">Improvement</p>
                      <p className="text-blue-800 font-bold">{point.improvement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Software Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in Painting Estimate Software
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional features designed specifically for painting contractors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softwareFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
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

      {/* Speed Comparison */}
      <SpeedComparison className="bg-white" />

      {/* ROI Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Software ROI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly how much time and money you'll save with professional estimate software
            </p>
          </div>
          
          <ROICalculator className="mb-8" />
        </div>
      </section>

      {/* Software Selection Guide */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Choose Painting Estimate Software
            </h2>
            <p className="text-xl text-gray-600">
              Key features to look for when selecting estimate software for your painting business
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  Mobile Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Your software must work perfectly on phones and tablets. Most estimates happen on-site during customer consultations.
                </p>
                <p className="text-sm text-blue-700 font-medium">
                  ✓ ProPaint Quote is mobile-first designed for on-site estimating
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  Industry-Specific Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Generic estimate software doesn't understand painting. You need software with paint-specific formulas and material databases.
                </p>
                <p className="text-sm text-green-700 font-medium">
                  ✓ Built specifically for painting contractors with industry-standard formulas
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  Professional Presentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Your estimates are often the first impression customers have of your business. They must look professional and branded.
                </p>
                <p className="text-sm text-purple-700 font-medium">
                  ✓ Every estimate includes your branding and professional formatting
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  Speed & Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  If your software takes longer than manual methods, it's not worth using. Look for solutions that dramatically reduce estimate time.
                </p>
                <p className="text-sm text-orange-700 font-medium">
                  ✓ Create estimates in 6 minutes vs. 6 hours with manual methods
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Estimating Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ contractors who've switched to professional estimate software and increased their win rates by 40-60%
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="outline_white" asChild className="text-lg px-12 py-6">
              <Link href="/trial-signup">
                Start Free Trial - No Credit Card
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline_white" asChild className="text-lg px-8 py-6">
              <Link href="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 text-blue-200 text-sm">
            <div>✓ 10 free estimates included</div>
            <div>✓ Works on all devices</div>
            <div>✓ Professional support included</div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ProPaint Quote - Painting Estimate Software",
            "description": "Professional painting estimate software for contractors. Create quotes in 6 minutes vs 6 hours.",
            "url": "https://propaintquote.com/painting-estimate-software",
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
              "description": "Free trial with 10 estimates included"
            },
            "featureList": [
              "Mobile estimate creation",
              "Industry-specific calculations", 
              "Professional branding",
              "Win rate analytics",
              "6-minute quote generation"
            ]
          })
        }}
      />
    </div>
  )
}