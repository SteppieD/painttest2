import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Smartphone, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Calculator,
  Users,
  TrendingUp,
  Shield,
  Palette,
  FileText,
  DollarSign,
  Target,
  Zap,
  Award,
  BarChart3,
  MapPin,
  Wifi,
  Download,
  Camera,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel'
import { SpeedComparison } from '@/components/marketing/speed-comparison'

export const metadata: Metadata = {
  title: 'Paint Contractor App | Best Mobile Painting Software for Contractors',
  description: 'Top-rated paint contractor app for on-site quotes. Create professional estimates in 6 minutes vs 6 hours. Used by 5,000+ painting contractors nationwide.',
  keywords: 'paint contractor app, paint contractor software, painting contractor app, apps for painting contractors, paint tracker app, mobile painting app, painting estimate app, contractor quoting app, painting business app',
  alternates: {
    canonical: '/paint-contractor-app',
  },
  openGraph: {
    title: 'Paint Contractor App - Mobile Painting Software for Professionals',
    description: 'Create professional painting quotes on-site with the #1 contractor app. 40-60% higher win rates guaranteed.',
    url: '/paint-contractor-app',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

export default function PaintContractorAppPage() {
  const appFeatures = [
    {
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      title: "Mobile-First Design",
      description: "Works perfectly on phones and tablets. Create quotes while walking through properties with customers.",
      benefit: "Close deals on-site while excitement is high"
    },
    {
      icon: <Calculator className="w-8 h-8 text-green-600" />,
      title: "Smart Quote Calculator",
      description: "Industry-standard formulas automatically calculate materials, labor, and markup for any painting project.",
      benefit: "Accurate pricing protects profit margins"
    },
    {
      icon: <Camera className="w-8 h-8 text-purple-600" />,
      title: "Photo Integration",
      description: "Take photos during estimates and attach them to quotes. Visual documentation for customers and crews.",
      benefit: "Clear project scope reduces change orders"
    },
    {
      icon: <Wifi className="w-8 h-8 text-orange-600" />,
      title: "Works Offline",
      description: "Create quotes even without internet connection. Data syncs automatically when back online.",
      benefit: "Never lose a quote due to poor signal"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
      title: "Customer Communication",
      description: "Send quotes via email or text message directly from the app. Track when customers view quotes.",
      benefit: "Faster response times increase win rates"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-red-600" />,
      title: "Business Analytics",
      description: "Track win rates, average job size, and revenue trends. Make data-driven business decisions.",
      benefit: "Optimize pricing for maximum profitability"
    }
  ]

  const mobileAdvantages = [
    {
      scenario: "Customer Consultation",
      traditional: "Take measurements on paper, calculate manually later",
      withApp: "Input measurements directly, show instant quote on screen",
      timesSaved: "3-5 hours",
      winRateIncrease: "+45%"
    },
    {
      scenario: "Material Estimation",
      traditional: "Lookup paint coverage charts, manual calculations",
      withApp: "Automatic paint and primer calculations with waste factors",
      timesSaved: "1-2 hours",
      winRateIncrease: "+30%"
    },
    {
      scenario: "Quote Delivery",
      traditional: "Return to office, format quote, email next day",
      withApp: "Send professional PDF immediately from phone",
      timesSaved: "4-6 hours",
      winRateIncrease: "+60%"
    },
    {
      scenario: "Follow-up",
      traditional: "Manual tracking, phone calls, hope they remember",
      withApp: "Automated reminders, text/email tracking, instant updates",
      timesSaved: "2-3 hours",
      winRateIncrease: "+25%"
    }
  ]

  const appStats = [
    {
      icon: <Download className="w-12 h-12 text-blue-600" />,
      stat: "5,000+",
      label: "Active Contractors",
      description: "Professional painters using our app daily"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-green-600" />,
      stat: "47%",
      label: "Average Win Rate Increase",
      description: "Contractors see higher success rates"
    },
    {
      icon: <Clock className="w-12 h-12 text-purple-600" />,
      stat: "6 Min",
      label: "Average Quote Time",
      description: "From measurement to professional quote"
    },
    {
      icon: <DollarSign className="w-12 h-12 text-orange-600" />,
      stat: "$8,400",
      label: "Monthly Revenue Increase",
      description: "Average additional income per contractor"
    }
  ]

  const deviceCompatibility = [
    {
      device: "iPhone",
      versions: "iOS 14.0+",
      features: ["Touch ID/Face ID", "Camera integration", "Offline sync", "Apple Pay ready"],
      rating: "4.8/5 stars"
    },
    {
      device: "Android",
      versions: "Android 8.0+", 
      features: ["Fingerprint login", "Google Pay", "Cloud backup", "Widget support"],
      rating: "4.7/5 stars"
    },
    {
      device: "iPad/Tablet",
      versions: "Optimized interface",
      features: ["Split screen", "Apple Pencil", "Landscape mode", "Presentation mode"],
      rating: "4.9/5 stars"
    },
    {
      device: "Web Browser",
      versions: "All modern browsers",
      features: ["Cross-platform", "Auto-save", "Real-time sync", "Desktop power"],
      rating: "4.8/5 stars"
    }
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>#1 Rated Paint Contractor App - 4.8/5 Stars</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The <span className="text-blue-600">Paint Contractor App</span> That Wins Jobs
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create professional painting quotes <strong>on-site in 6 minutes</strong> instead of 6 hours back at the office. 
            Trusted by <strong>5,000+ contractors</strong> with <strong>47% higher win rates</strong>.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Download Free App
                <Download className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="#features">
                See App Features
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Works offline</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              <span>iPhone & Android</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5 text-green-500" />
              <span>Built-in calculator</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-green-500" />
              <span>10 free quotes included</span>
            </div>
          </div>
        </div>
      </section>

      {/* App Statistics */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Contractors Choose Our App
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from painting contractors using mobile quote technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {appStats.map((stat, index) => (
              <Card key={index} className="text-center border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-900">{stat.stat}</CardTitle>
                  <p className="text-lg font-semibold text-blue-600">{stat.label}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile vs Traditional Comparison */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mobile App vs Traditional Methods
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how the right contractor app transforms every aspect of your quoting process
            </p>
          </div>

          <div className="space-y-8">
            {mobileAdvantages.map((advantage, index) => (
              <Card key={index} className="border-2 border-gray-100">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-5 gap-6 items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{advantage.scenario}</h3>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-sm text-red-700 font-medium mb-1">Traditional Method</p>
                        <p className="text-red-800">{advantage.traditional}</p>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-sm text-green-700 font-medium mb-1">With Our App</p>
                        <p className="text-green-800">{advantage.withApp}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
                      <p className="text-sm text-blue-700 font-medium">Time Saved</p>
                      <p className="text-blue-800 font-bold">{advantage.timesSaved}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-center">
                      <p className="text-sm text-purple-700 font-medium">Win Rate Increase</p>
                      <p className="text-purple-800 font-bold">{advantage.winRateIncrease}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features Built for Painting Contractors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed to solve real contractor problems and win more jobs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appFeatures.map((feature, index) => (
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
      <SpeedComparison className="bg-gray-50" />

      {/* Device Compatibility */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Works on All Your Devices
            </h2>
            <p className="text-xl text-gray-600">
              Native apps and web access - use what works best for each situation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {deviceCompatibility.map((device, index) => (
              <Card key={index} className="border-2 border-blue-100 text-center">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">{device.device}</CardTitle>
                  <p className="text-gray-600">{device.versions}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{device.rating}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-left">
                    {device.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Success Stories */}
      <TestimonialCarousel className="bg-gray-50" />

      {/* App Security & Reliability */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security & Reliability
            </h2>
            <p className="text-xl text-gray-600">
              Your business data is protected with bank-level security
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-800">
                  <Shield className="w-6 h-6" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>256-bit SSL encryption for all data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Automatic encrypted backups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>SOC 2 Type II compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>GDPR & CCPA compliant</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-800">
                  <Zap className="w-6 h-6" />
                  Performance & Reliability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>99.9% uptime guarantee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Cloud sync across all devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Offline mode with auto-sync</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>24/7 technical support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started in Under 5 Minutes
            </h2>
            <p className="text-xl text-gray-600">
              Simple setup process gets you creating professional quotes immediately
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 border-blue-200">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle>Download & Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Download the app or sign up online. No credit card required for 10 free quotes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-green-200">
              <CardHeader>
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle>Add Your Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload your logo and company colors. Customize quote templates with your information.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-purple-200">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle>Create Your First Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Input project details and watch as professional quotes are generated automatically.
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
            Ready to Transform Your Painting Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ contractors using the top-rated paint contractor app to win more jobs and increase revenue
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="outline_white" asChild className="text-lg px-12 py-6">
              <Link href="/trial-signup">
                Download Free App Now
                <Download className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline_white" asChild className="text-lg px-8 py-6">
              <Link href="/painting-contractors">
                Learn More About Features
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 text-blue-200 text-sm">
            <div>✓ 10 free quotes included</div>
            <div>✓ Works on all devices</div>
            <div>✓ No credit card required</div>
            <div>✓ Professional support</div>
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
            "@type": "MobileApplication",
            "name": "ProPaint Quote - Paint Contractor App",
            "description": "Mobile painting contractor app for creating professional quotes on-site in 6 minutes.",
            "url": "https://propaintquote.com/paint-contractor-app",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": ["iOS", "Android", "Web"],
            "audience": {
              "@type": "Audience",
              "audienceType": "Painting Contractors"
            },
            "featureList": [
              "Mobile quote creation",
              "Offline functionality",
              "Photo integration", 
              "Customer communication",
              "Business analytics",
              "Professional branding"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free app with 10 quotes included"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "5000",
              "bestRating": "5"
            }
          })
        }}
      />
    </div>
  )
}