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
      icon: <Calculator />,
      title: "Smart Quote Calculator",
      description: "Industry-standard formulas automatically calculate materials, labor, and markup. Never underestimate a job again.",
      benefit: "Protect profit margins with accurate pricing"
    },
    {
      icon: <Smartphone />,
      title: "Mobile-First Design", 
      description: "Create estimates on your phone or tablet while at the customer's location. Perfect for walk-through quotes.",
      benefit: "Close deals while excitement is high"
    },
    {
      icon: <Clock />,
      title: "6-Minute Quote Generation",
      description: "Generate detailed, professional estimates in minutes instead of hours. Respond faster than competitors.",
      benefit: "Win more jobs with speed advantage"
    },
    {
      icon: <Shield />,
      title: "Professional Branding",
      description: "Every estimate includes your logo, colors, and professional formatting that builds customer confidence.",
      benefit: "Stand out from handwritten estimates"
    },
    {
      icon: <Target />,
      title: "Win Rate Analytics",
      description: "Track conversion rates, average job size, and identify your most profitable project types.",
      benefit: "Make data-driven pricing decisions"
    },
    {
      icon: <DollarSign />,
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
    <div>

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            The #1 <span>Painting Estimate Software</span> for Contractors
          </h1>
          <p>
            Stop losing jobs to slow estimates. Create professional painting quotes in <strong>6 minutes</strong> instead of 6 hours. 
            Trusted by <strong>5,000+ contractors</strong> with <strong>40-60% higher win rates</strong>.
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Try Free - 10 Estimates Included
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                See Live Demo
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
              <span>Works on all devices</span>
            </div>
            <div>
              <TrendingUp />
              <span>Instant setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional vs Software Comparison */}
      <section>
        <div>
          <div>
            <h2>
              Traditional Estimating vs. Modern Software
            </h2>
            <p>
              See why smart contractors are switching from manual estimating to professional software
            </p>
          </div>

          <div>
            {comparisonPoints.map((point, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    <div>
                      <h3>{point.category}</h3>
                    </div>
                    <div>
                      <p>Traditional Method</p>
                      <p>{point.traditional}</p>
                    </div>
                    <div>
                      <p>With Software</p>
                      <p>{point.software}</p>
                    </div>
                    <div>
                      <p>Improvement</p>
                      <p>{point.improvement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Software Features */}
      <section>
        <div>
          <div>
            <h2>
              Everything You Need in Painting Estimate Software
            </h2>
            <p>
              Professional features designed specifically for painting contractors
            </p>
          </div>

          <div>
            {softwareFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>{feature.icon}</div>
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

      {/* Speed Comparison */}
      <SpeedComparison />

      {/* ROI Section */}
      <section>
        <div>
          <div>
            <h2>
              Calculate Your Software ROI
            </h2>
            <p>
              See exactly how much time and money you'll save with professional estimate software
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Software Selection Guide */}
      <section>
        <div>
          <div>
            <h2>
              How to Choose Painting Estimate Software
            </h2>
            <p>
              Key features to look for when selecting estimate software for your painting business
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <span>1</span>
                  Mobile Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Your software must work perfectly on phones and tablets. Most estimates happen on-site during customer consultations.
                </p>
                <p>
                  ✓ ProPaint Quote is mobile-first designed for on-site estimating
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <span>2</span>
                  Industry-Specific Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Generic estimate software doesn't understand painting. You need software with paint-specific formulas and material databases.
                </p>
                <p>
                  ✓ Built specifically for painting contractors with industry-standard formulas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <span>3</span>
                  Professional Presentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Your estimates are often the first impression customers have of your business. They must look professional and branded.
                </p>
                <p>
                  ✓ Every estimate includes your branding and professional formatting
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <span>4</span>
                  Speed & Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If your software takes longer than manual methods, it's not worth using. Look for solutions that dramatically reduce estimate time.
                </p>
                <p>
                  ✓ Create estimates in 6 minutes vs. 6 hours with manual methods
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div>
          <h2>
            Ready to Transform Your Estimating Process?
          </h2>
          <p>
            Join 5,000+ contractors who've switched to professional estimate software and increased their win rates by 40-60%
          </p>
          
          <div>
            <Button size="lg" variant="outline_white" asChild>
              <Link href="/trial-signup">
                Start Free Trial - No Credit Card
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline_white" asChild>
              <Link href="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>
          
          <div>
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