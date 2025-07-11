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
      icon: <Smartphone />,
      title: "Mobile-First Design",
      description: "Works perfectly on phones and tablets. Create quotes while walking through properties with customers.",
      benefit: "Close deals on-site while excitement is high"
    },
    {
      icon: <Calculator />,
      title: "Smart Quote Calculator",
      description: "Industry-standard formulas automatically calculate materials, labor, and markup for any painting project.",
      benefit: "Accurate pricing protects profit margins"
    },
    {
      icon: <Camera />,
      title: "Photo Integration",
      description: "Take photos during estimates and attach them to quotes. Visual documentation for customers and crews.",
      benefit: "Clear project scope reduces change orders"
    },
    {
      icon: <Wifi />,
      title: "Works Offline",
      description: "Create quotes even without internet connection. Data syncs automatically when back online.",
      benefit: "Never lose a quote due to poor signal"
    },
    {
      icon: <MessageSquare />,
      title: "Customer Communication",
      description: "Send quotes via email or text message directly from the app. Track when customers view quotes.",
      benefit: "Faster response times increase win rates"
    },
    {
      icon: <BarChart3 />,
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
      icon: <Download />,
      stat: "5,000+",
      label: "Active Contractors",
      description: "Professional painters using our app daily"
    },
    {
      icon: <TrendingUp />,
      stat: "47%",
      label: "Average Win Rate Increase",
      description: "Contractors see higher success rates"
    },
    {
      icon: <Clock />,
      stat: "6 Min",
      label: "Average Quote Time",
      description: "From measurement to professional quote"
    },
    {
      icon: <DollarSign />,
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
    <div>

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Award />
            <span>#1 Rated Paint Contractor App - 4.8/5 Stars</span>
          </div>
          
          <h1>
            The <span>Paint Contractor App</span> That Wins Jobs
          </h1>
          <p>
            Create professional painting quotes <strong>on-site in 6 minutes</strong> instead of 6 hours back at the office. 
            Trusted by <strong>5,000+ contractors</strong> with <strong>47% higher win rates</strong>.
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Download Free App
                <Download />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">
                See App Features
              </Link>
            </Button>
          </div>
          
          <div>
            <div>
              <CheckCircle />
              <span>Works offline</span>
            </div>
            <div>
              <Smartphone />
              <span>iPhone & Android</span>
            </div>
            <div>
              <Calculator />
              <span>Built-in calculator</span>
            </div>
            <div>
              <Star />
              <span>10 free quotes included</span>
            </div>
          </div>
        </div>
      </section>

      {/* App Statistics */}
      <section>
        <div>
          <div>
            <h2>
              Why Contractors Choose Our App
            </h2>
            <p>
              Real results from painting contractors using mobile quote technology
            </p>
          </div>

          <div>
            {appStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {stat.icon}
                  </div>
                  <CardTitle>{stat.stat}</CardTitle>
                  <p>{stat.label}</p>
                </CardHeader>
                <CardContent>
                  <p>{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile vs Traditional Comparison */}
      <section>
        <div>
          <div>
            <h2>
              Mobile App vs Traditional Methods
            </h2>
            <p>
              See how the right contractor app transforms every aspect of your quoting process
            </p>
          </div>

          <div>
            {mobileAdvantages.map((advantage, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    <div>
                      <h3>{advantage.scenario}</h3>
                    </div>
                    
                    <div>
                      <div>
                        <p>Traditional Method</p>
                        <p>{advantage.traditional}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div>
                        <p>With Our App</p>
                        <p>{advantage.withApp}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div>
                      <p>Time Saved</p>
                      <p>{advantage.timesSaved}</p>
                    </div>
                    <div>
                      <p>Win Rate Increase</p>
                      <p>{advantage.winRateIncrease}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Features */}
      <section id="features">
        <div>
          <div>
            <h2>
              Powerful Features Built for Painting Contractors
            </h2>
            <p>
              Every feature designed to solve real contractor problems and win more jobs
            </p>
          </div>

          <div>
            {appFeatures.map((feature, index) => (
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

      {/* Device Compatibility */}
      <section>
        <div>
          <div>
            <h2>
              Works on All Your Devices
            </h2>
            <p>
              Native apps and web access - use what works best for each situation
            </p>
          </div>

          <div>
            {deviceCompatibility.map((device, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{device.device}</CardTitle>
                  <p>{device.versions}</p>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                    <span>{device.rating}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul>
                    {device.features.map((feature, i) => (
                      <li key={i}>
                        <CheckCircle />
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
      <TestimonialCarousel />

      {/* App Security & Reliability */}
      <section>
        <div>
          <div>
            <h2>
              Enterprise-Grade Security & Reliability
            </h2>
            <p>
              Your business data is protected with bank-level security
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Shield />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>
                    <CheckCircle />
                    <span>256-bit SSL encryption for all data</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Automatic encrypted backups</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>SOC 2 Type II compliance</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>GDPR & CCPA compliant</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Zap />
                  Performance & Reliability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>
                    <CheckCircle />
                    <span>99.9% uptime guarantee</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Cloud sync across all devices</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Offline mode with auto-sync</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>24/7 technical support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section>
        <div>
          <div>
            <h2>
              Get Started in Under 5 Minutes
            </h2>
            <p>
              Simple setup process gets you creating professional quotes immediately
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div>
                  1
                </div>
                <CardTitle>Download & Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Download the app or sign up online. No credit card required for 10 free quotes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  2
                </div>
                <CardTitle>Add Your Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Upload your logo and company colors. Customize quote templates with your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  3
                </div>
                <CardTitle>Create Your First Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Input project details and watch as professional quotes are generated automatically.
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
            Ready to Transform Your Painting Business?
          </h2>
          <p>
            Join 5,000+ contractors using the top-rated paint contractor app to win more jobs and increase revenue
          </p>
          
          <div>
            <Button size="lg" variant="outline_white" asChild>
              <Link href="/trial-signup">
                Download Free App Now
                <Download />
              </Link>
            </Button>
            <Button size="lg" variant="outline_white" asChild>
              <Link href="/painting-contractors">
                Learn More About Features
              </Link>
            </Button>
          </div>
          
          <div>
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