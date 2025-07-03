import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Smartphone, 
  Download, 
  Camera,
  MapPin,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Users,
  Target,
  Zap,
  Shield,
  Fingerprint,
  Battery,
  Monitor,
  Tablet,
  Apple,
  Globe,
  PenTool,
  Calculator,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Mobile Painting Estimate App | ProPaint Quote Field Software',
  description: 'Create professional painting quotes on-site with our mobile app. Works offline, instant quotes, digital signatures. Trusted by 5,000+ contractors for field estimates.',
  keywords: 'mobile painting app, field estimate software, painting quote app, contractor mobile app, on-site estimates, offline painting software',
  alternates: {
    canonical: '/mobile-app',
  },
  openGraph: {
    title: 'Mobile Painting Estimate App - Quote On-Site, Win More Jobs',
    description: 'Professional painting quotes in your pocket. Create estimates on-site, work offline, get signatures instantly. 5,000+ contractors trust our mobile app.',
    url: '/mobile-app',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function MobileAppPage() {
  // Mobile-specific features
  const mobileFeatures = [
    {
      icon: WifiOff,
      title: "Works Completely Offline",
      description: "Create quotes even when cell service is spotty. All data syncs automatically when you're back online.",
      benefit: "Never lose a quote opportunity"
    },
    {
      icon: Camera,
      title: "Photo Integration",
      description: "Take photos of rooms, attach to quotes, and use for accurate measurements and reference.",
      benefit: "Visual documentation for accuracy"
    },
    {
      icon: PenTool,
      title: "Digital Signatures",
      description: "Get customer signatures right on your phone or tablet. Instant contract acceptance.",
      benefit: "Close deals on the spot"
    },
    {
      icon: MapPin,
      title: "GPS Location Tracking",
      description: "Automatically track job locations and travel time for accurate cost calculations.",
      benefit: "Built-in expense tracking"
    },
    {
      icon: Clock,
      title: "30-Second Quotes",
      description: "Express quote mode for standard rooms. Just select room type and get instant pricing.",
      benefit: "Faster than competitors"
    },
    {
      icon: Calculator,
      title: "Smart Measurement Tools",
      description: "Touch-optimized measurement entry with room templates and dimension suggestions.",
      benefit: "Accuracy without complexity"
    }
  ];

  // Field workflow advantages
  const fieldWorkflow = [
    {
      step: "1",
      title: "Arrive On-Site",
      description: "Open the app, create new quote, GPS auto-fills location",
      icon: MapPin,
      color: "text-blue-600"
    },
    {
      step: "2", 
      title: "Quick Measurements",
      description: "Use room templates or measure walls, take photos for reference",
      icon: Camera,
      color: "text-green-600"
    },
    {
      step: "3",
      title: "Instant Quote",
      description: "AI calculates pricing, generate professional PDF in 30 seconds",
      icon: Zap,
      color: "text-purple-600"
    },
    {
      step: "4",
      title: "Get Signature",
      description: "Customer reviews quote, signs digitally, you win the job",
      icon: PenTool,
      color: "text-orange-600"
    }
  ];

  // Mobile success metrics
  const mobileStats = [
    { metric: "83%", label: "Contractors Use Mobile Daily", icon: Smartphone },
    { metric: "5x", label: "Faster Than Paper Quotes", icon: Clock },
    { metric: "67%", label: "Win Rate for On-Site Quotes", icon: Target },
    { metric: "100%", label: "Works Offline", icon: WifiOff }
  ];

  // Device compatibility
  const compatibility = [
    {
      device: "iPhone",
      description: "iOS 14+ optimized with native gestures and haptic feedback",
      icon: Apple,
      features: ["Face ID unlock", "Siri shortcuts", "Apple Pencil support", "AirDrop sharing"]
    },
    {
      device: "Android",
      description: "Android 9+ with Material Design and gesture navigation", 
      icon: Smartphone,
      features: ["Fingerprint unlock", "Google Assistant", "S-Pen support", "Quick Share"]
    },
    {
      device: "Tablet",
      description: "iPad and Android tablets with split-screen multitasking",
      icon: Tablet,
      features: ["Larger canvas", "Multi-app view", "Presentation mode", "External keyboard"]
    },
    {
      device: "Web App",
      description: "Progressive Web App works on any device with a browser",
      icon: Globe,
      features: ["No download needed", "Auto updates", "Cross-platform", "Offline capable"]
    }
  ];

  // Customer testimonials focused on mobile
  const mobileTestimonials = [
    {
      quote: "I closed a $15K job while sitting in the customer's driveway. The mobile app made me look incredibly professional.",
      author: "David Chen",
      company: "Precision Painters",
      location: "Seattle, WA",
      avatar: "D"
    },
    {
      quote: "Being able to quote jobs on-site, even without internet, has been a game-changer. I win 70% of quotes now.",
      author: "Sarah Martinez", 
      company: "ProPaint Solutions",
      location: "Austin, TX",
      avatar: "S"
    },
    {
      quote: "The mobile app pays for itself. Customers love watching the quote being created and signing right there.",
      author: "Mike Johnson",
      company: "Elite Painting Co.",
      location: "Denver, CO", 
      avatar: "M"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Smartphone className="w-4 h-4" />
                <span>Mobile-First Painting Software</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Quote Jobs <span className="text-blue-600">On-Site</span><br />
                Win More Business
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professional painting quotes in your pocket. Create estimates on-site, work offline, 
                get signatures instantly. Join 5,000+ contractors who increased their win rates with mobile quoting.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/trial-signup">
                    <Download className="w-5 h-5 mr-2" />
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Works offline</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>30-second quotes</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Mobile App Mockup */}
              <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Mock app interface */}
                  <div className="bg-blue-600 text-white p-4 text-center">
                    <h3 className="font-bold">ProPaint Quote</h3>
                    <p className="text-sm text-blue-100">New Quote - Kitchen</p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">Customer</div>
                      <div className="font-medium">Johnson Residence</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">Room Type</div>
                      <div className="font-medium">Kitchen (12x14 ft)</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-sm text-green-600 mb-1">Estimated Total</div>
                      <div className="text-2xl font-bold text-green-600">$2,847</div>
                    </div>
                    <Button className="w-full bg-blue-600">
                      Generate Quote PDF
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Floating features */}
              <div className="absolute -left-4 top-20 bg-white rounded-lg shadow-lg p-3 max-w-32">
                <WifiOff className="w-6 h-6 text-gray-600 mb-2" />
                <div className="text-xs font-medium">Works Offline</div>
              </div>
              <div className="absolute -right-4 top-32 bg-white rounded-lg shadow-lg p-3 max-w-32">
                <Clock className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-xs font-medium">30-Second Quotes</div>
              </div>
              <div className="absolute -left-4 bottom-32 bg-white rounded-lg shadow-lg p-3 max-w-32">
                <PenTool className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-xs font-medium">Digital Signatures</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {mobileStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.metric}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Field Workflow */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your New On-Site Workflow
            </h2>
            <p className="text-xl text-gray-600">
              From arrival to signed contract in minutes, not hours
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {fieldWorkflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center`}>
                      {step.step}
                    </div>
                    {index < fieldWorkflow.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for the Field
            </h2>
            <p className="text-xl text-gray-600">
              Every feature designed for real-world painting contractor needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mobileFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                      ✓ {feature.benefit}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Works on Every Device
            </h2>
            <p className="text-xl text-gray-600">
              Native experience across iPhone, Android, tablets, and web browsers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {compatibility.map((device, index) => {
              const Icon = device.icon;
              return (
                <Card key={index} className="border-0 shadow-sm bg-white text-center">
                  <CardHeader>
                    <Icon className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <CardTitle className="text-lg">{device.device}</CardTitle>
                    <p className="text-sm text-gray-600">{device.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {device.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contractors Love Mobile Quoting
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from contractors using mobile quotes daily
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mobileTestimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-blue-600">{testimonial.company}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Smartphone className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Quoting On-Site Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ contractors who create professional quotes anywhere, anytime. 
            No more losing jobs to faster competitors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                <Download className="w-5 h-5 mr-2" />
                Get Mobile App Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/demo">
                <Play className="w-5 h-5 mr-2" />
                Watch Mobile Demo
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-200 text-sm">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Works completely offline</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Start quoting in 2 minutes</span>
            </div>
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
            "name": "ProPaint Quote Mobile App",
            "operatingSystem": ["iOS", "Android"],
            "applicationCategory": "BusinessApplication",
            "description": "Professional painting quote app for on-site estimates. Works offline, includes digital signatures, and instant quote generation.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating", 
              "ratingValue": 4.9,
              "reviewCount": 5000
            }
          })
        }}
      />
    </div>
  );
}