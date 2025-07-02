import { Metadata } from 'next';
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
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ROICalculator } from '@/components/marketing/roi-calculator';
import { IndustryStats } from '@/components/marketing/industry-stats';
import { SpeedComparison } from '@/components/marketing/speed-comparison';
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel';
import { QuickPaintCalculator } from '@/components/calculators/quick-paint-calculator';
import { RoomCalculatorWidget } from '@/components/calculators/room-calculator-widget';
import { PaintCoverageWidget } from '@/components/calculators/paint-coverage-widget';
import { CostComparisonWidget } from '@/components/calculators/cost-comparison-widget';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            From <span className="text-red-500">6 Hours</span> to <span className="text-green-600">6 Minutes</span>: Professional <span className="text-blue-600">Painting Quotes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            While competitors take days, you deliver same-day quotes. Join 10,000+ contractors winning <strong>40-60% more jobs</strong> with professional, mobile-first quoting that closes deals on-site.
          </p>
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-gray-600">
              Already have an access code? 
              <Link href="/access-code" className="text-blue-600 hover:text-blue-700 ml-1 underline">
                Sign in here
              </Link>
            </p>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <span>Quote in 6 minutes vs. 6 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>40-60% higher win rates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Quote Like a Pro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for painting contractors who want to win more jobs and increase profit margins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Calculator className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Smart Quote Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically calculate materials, labor, and markup with industry-standard formulas. Never underestimate a job again.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Clock className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>5-Minute Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate detailed, professional quotes in minutes instead of hours. Respond to leads faster than your competition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Smartphone className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Mobile Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create quotes on-site with your phone or tablet. Perfect for walk-through estimates and immediate customer responses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track all your quotes and customers in one place. Follow up on pending estimates and convert more leads.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-red-600 mb-4" />
                <CardTitle>Profit Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your win rates, average job size, and profit margins. Make data-driven decisions to grow your business.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Professional Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Send professional, branded quotes that build trust with customers and help you stand out from competitors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <TestimonialCarousel className="bg-gray-50" />

      {/* Industry Statistics */}
      <IndustryStats className="bg-white" />

      {/* Speed Comparison */}
      <SpeedComparison className="bg-gray-50" />

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
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
          
          <div className="text-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/roi-calculator">
                View Detailed Calculator
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Calculators Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Our Free Paint Calculators
            </h2>
            <p className="text-xl text-gray-600">
              Get instant estimates and see the power of professional painting software
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickPaintCalculator />
            <RoomCalculatorWidget />
            <PaintCoverageWidget />
            <CostComparisonWidget />
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Get Full Professional Calculator
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Professional features include material costs, regional pricing, and detailed breakdowns
            </p>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Painting Business Resources
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to grow your painting business and create professional estimates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Estimate Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Free painting estimate calculator for instant, accurate quotes on any project size.
                </p>
                <Link href="/painting-estimate-calculator" className="text-blue-600 hover:text-blue-700 font-medium">
                  Try Calculator →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Quote Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Professional painting quote templates for interior, exterior, and commercial projects.
                </p>
                <Link href="/painting-quote-templates" className="text-green-600 hover:text-green-700 font-medium">
                  Download Templates →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Quoting Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete guide on how to quote painting jobs like a professional contractor.
                </p>
                <Link href="/how-to-quote-painting-jobs" className="text-purple-600 hover:text-purple-700 font-medium">
                  Read Guide →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Smartphone className="w-8 h-8 text-indigo-600 mb-2" />
                <CardTitle className="text-lg">Software Features</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn about the best painting estimating software features and benefits.
                </p>
                <Link href="/painting-estimating-software" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Explore Features →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Win More Painting Jobs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and see why contractors choose ProPaint Quote
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/trial-signup">
              Create Free Account Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            1 Free Quote • No credit card required • Instant access
          </p>
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
            "name": "ProPaint Quote",
            "description": "Professional painting quote software for contractors",
            "url": "https://propaintquote.com",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free trial available"
            },
            "provider": {
              "@type": "Organization",
              "name": "ProPaint Quote"
            }
          })
        }}
      />
    </div>
  );
}