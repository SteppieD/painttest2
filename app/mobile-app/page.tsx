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
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

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
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <div>
              <div>
                <Smartphone />
                <span>Mobile-First Painting Software</span>
              </div>
              
              <h1>
                Quote Jobs <span>On-Site</span><br />
                Win More Business
              </h1>
              <p>
                Professional painting quotes in your pocket. Create estimates on-site, work offline, 
                get signatures instantly. Join 5,000+ contractors who increased their win rates with mobile quoting.
              </p>
              
              <div>
                <Button size="lg" asChild>
                  <Link href="/trial-signup">
                    <Download />
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">
                    <Play />
                    Watch Demo
                  </Link>
                </Button>
              </div>
              
              <div>
                <div>
                  <CheckCircle />
                  <span>Works offline</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>No credit card</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>30-second quotes</span>
                </div>
              </div>
            </div>
            
            <div>
              {/* Mobile App Mockup */}
              <div>
                <div>
                  {/* Mock app interface */}
                  <div>
                    <h3>ProPaint Quote</h3>
                    <p>New Quote - Kitchen</p>
                  </div>
                  <div>
                    <div>
                      <div>Customer</div>
                      <div>Johnson Residence</div>
                    </div>
                    <div>
                      <div>Room Type</div>
                      <div>Kitchen (12x14 ft)</div>
                    </div>
                    <div>
                      <div>Estimated Total</div>
                      <div>$2,847</div>
                    </div>
                    <Button>
                      Generate Quote PDF
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Floating features */}
              <div>
                <WifiOff />
                <div>Works Offline</div>
              </div>
              <div>
                <Clock />
                <div>30-Second Quotes</div>
              </div>
              <div>
                <PenTool />
                <div>Digital Signatures</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section>
        <div>
          <div>
            {mobileStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <Icon />
                  <div>{stat.metric}</div>
                  <div>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Field Workflow */}
      <section>
        <div>
          <div>
            <h2>
              Your New On-Site Workflow
            </h2>
            <p>
              From arrival to signed contract in minutes, not hours
            </p>
          </div>
          
          <div>
            {fieldWorkflow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index}>
                  <div>
                    <div>
                      <Icon`} />
                    </div>
                    <div>
                      {step.step}
                    </div>
                    {index < fieldWorkflow.length - 1 && (
                      <div></div>
                    )}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile Features */}
      <section>
        <div>
          <div>
            <h2>
              Built for the Field
            </h2>
            <p>
              Every feature designed for real-world painting contractor needs
            </p>
          </div>
          
          <div>
            {mobileFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div>
                      <Icon />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                    <div>
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
      <section>
        <div>
          <div>
            <h2>
              Works on Every Device
            </h2>
            <p>
              Native experience across iPhone, Android, tablets, and web browsers
            </p>
          </div>
          
          <div>
            {compatibility.map((device, index) => {
              const Icon = device.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <Icon />
                    <CardTitle>{device.device}</CardTitle>
                    <p>{device.description}</p>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile Testimonials */}
      <section>
        <div>
          <div>
            <h2>
              Contractors Love Mobile Quoting
            </h2>
            <p>
              Real stories from contractors using mobile quotes daily
            </p>
          </div>
          
          <div>
            {mobileTestimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p>"{testimonial.quote}"</p>
                  <div>
                    <div>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div>{testimonial.author}</div>
                      <div>{testimonial.company}</div>
                      <div>{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <Smartphone />
          <h2>
            Start Quoting On-Site Today
          </h2>
          <p>
            Join 5,000+ contractors who create professional quotes anywhere, anytime. 
            No more losing jobs to faster competitors.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                <Download />
                Get Mobile App Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                <Play />
                Watch Mobile Demo
              </Link>
            </Button>
          </div>
          
          <div>
            <div>
              <CheckCircle />
              <span>Works completely offline</span>
            </div>
            <div>
              <CheckCircle />
              <span>No credit card required</span>
            </div>
            <div>
              <CheckCircle />
              <span>Start quoting in 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      <ImprovedFooter />

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