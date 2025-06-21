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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Professional <span className="text-blue-600">Painting Quotes</span> in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop losing jobs to slow estimates. ProPaint Quote helps professional painters create accurate, detailed quotes that win more business and increase profits.
          </p>
          <div className="flex flex-col items-center gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Start Free Trial Now
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
          
          {/* Modern UX Preview Banner */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-green-900">🚀 NEW: Apple & Google-Inspired Interface</h3>
                <p className="text-sm text-green-700">Experience our revolutionary contractor-focused UX</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                asChild 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Link href="/dashboard-modern">
                  <Zap className="w-4 h-4 mr-2" />
                  Try Modern Interface
                </Link>
              </Button>
              <div className="flex items-center gap-4 text-sm text-green-700">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>30-second quotes</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Smart suggestions</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mobile-first</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>1 Free Quote Included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Setup in 5 minutes</span>
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

      {/* Modern UX Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              NEW: Revolutionary Interface
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apple & Google-Inspired Design for Contractors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We studied the best mobile interfaces and rebuilt our quote system from the ground up. 
              Experience the difference modern UX makes in your daily workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Express Quote Creation</CardTitle>
                    <p className="text-sm text-gray-500">Skip the chat, get quotes fast</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create professional quotes in 30 seconds using room templates. Perfect for repeat customers and standard configurations.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>80% faster than traditional methods</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Smart Learning System</CardTitle>
                    <p className="text-sm text-gray-500">Learns your preferences</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The system remembers your room sizes, paint choices, and pricing patterns to suggest smart defaults for new quotes.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gets smarter with every quote</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Smartphone className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Touch-First Mobile Design</CardTitle>
                    <p className="text-sm text-gray-500">Built for phones and tablets</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Every button, input, and interaction is optimized for mobile. Create quotes on-site with confidence.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apple 44pt touch standards</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Palette className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Professional Client Presentation</CardTitle>
                    <p className="text-sm text-gray-500">Impress every customer</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Quotes become beautiful, professional presentations with your branding, detailed breakdowns, and digital acceptance.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Higher acceptance rates</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
              <Link href="/dashboard-modern">
                <ArrowRight className="w-5 h-5 mr-2" />
                Experience the Modern Interface
              </Link>
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No signup required - try it with demo access code: <strong>DEMO2024</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Professional Painters Nationwide
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of contractors who've increased their quote accuracy and win rates
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Quote Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-gray-600">Faster Estimates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">40%</div>
              <div className="text-gray-600">Higher Win Rate</div>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-gray-600">
            "ProPaint Quote has transformed how we estimate jobs. We're closing 40% more deals and our quotes are always accurate."
            <br />
            <span className="font-medium">- Mike Johnson, Elite Painting Co.</span>
          </p>
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