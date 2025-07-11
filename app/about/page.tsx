import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Palette, 
  ArrowRight,
  Target,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Star,
  Heart,
  MapPin,
  Clock,
  Shield,
  Zap,
  Building,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Briefcase,
  Lightbulb,
  Trophy,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'About ProPaint Quote - Leading Painting Contractor Software | Built by Painters',
  description: 'Discover the story behind ProPaint Quote - the painting contractor software trusted by 5,000+ professionals. Built by painters, for painters. Learn our mission to help contractors win 40% more jobs.',
  keywords: 'about painting software, painting contractor company, quote software founders, painting business tools, contractor software story, painting industry leaders',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About ProPaint Quote - The Story Behind the Leading Painting Software',
    description: 'Built by professional painters who understand the industry. See how ProPaint Quote helps 5,000+ contractors create quotes in 5 minutes and win 40% more jobs.',
    url: '/about',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ProPaint Quote - Built by Painters, for Painters',
    description: 'The story behind the painting software trusted by 5,000+ contractors nationwide.',
  },
};

export default function AboutPage() {
  // Company stats and achievements
  const companyStats = [
    { icon: Users, number: "5,000+", label: "Active Contractors", color: "text-blue-600" },
    { icon: Target, number: "95%", label: "Quote Accuracy", color: "text-green-600" },
    { icon: Clock, number: "5 Min", label: "Average Quote Time", color: "text-purple-600" },
    { icon: TrendingUp, number: "40%", label: "Higher Win Rates", color: "text-orange-600" }
  ];

  // Founder stories and testimonials
  const founderStories = [
    {
      quote: "I was losing jobs because my quotes took 2 hours to prepare. Competitors were getting back to customers in 30 minutes.",
      author: "Mike Rodriguez",
      title: "Co-Founder & Former Painting Contractor",
      years: "15 years in painting",
      avatar: "M"
    },
    {
      quote: "Spreadsheets and calculators weren't cutting it. We needed software built by people who actually understand painting.",
      author: "Sarah Chen", 
      title: "Co-Founder & Software Engineer",
      years: "Former contractor, 10 years tech",
      avatar: "S"
    }
  ];

  // Timeline milestones
  const milestones = [
    {
      year: "2019",
      title: "The Problem",
      description: "Co-founders Mike and Sarah meet at a contractor expo, both frustrated with slow quoting processes"
    },
    {
      year: "2020", 
      title: "First Prototype",
      description: "Built the first version in Mike's garage, tested with 50 local contractors"
    },
    {
      year: "2021",
      title: "Industry Validation", 
      description: "500 contractors using ProPaint Quote, average 40% increase in win rates reported"
    },
    {
      year: "2022",
      title: "National Growth",
      description: "Expanded to all 50 states, reached 2,000 active contractors"
    },
    {
      year: "2023",
      title: "AI Innovation",
      description: "Launched AI-powered quote assistance, reducing quote time to under 5 minutes"
    },
    {
      year: "2024",
      title: "Industry Leader",
      description: "5,000+ contractors trust ProPaint Quote, #1 painting software by usage"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />

      {/* Hero Section */}
      <section className="kofi-hero">
        <div className="kofi-container">
          <div className="kofi-hero-content">
            <div className="kofi-badge kofi-badge-success kofi-mb-md">
              <Star className="w-4 h-4 fill-current" />
              <span>Trusted by 5,000+ Professional Painting Contractors</span>
            </div>
            
            <h1 className="kofi-h1">
              Built by <span className="text-orange-500">Painters</span>, for <span className="text-orange-500">Painters</span>
            </h1>
            <p className="kofi-body-large kofi-mb-xl">
              ProPaint Quote was created by professional painting contractors who got tired of losing jobs 
              to faster competitors. We built the software we wished we had when we were spending hours 
              on quotes that should take minutes.
            </p>
          
            <div className="kofi-grid kofi-grid-4 kofi-mb-xl">
              {companyStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="kofi-card kofi-text-center">
                    <div className="kofi-card-body">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <div className="kofi-h3 text-orange-500 kofi-mb-sm">{stat.number}</div>
                      <div className="kofi-body-small">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="kofi-hero-actions">
              <Link href="/demo" className="kofi-btn kofi-btn-primary kofi-btn-xl">
                <Zap className="w-5 h-5" />
                See Our Story in Action
              </Link>
              <Link href="/access-code" className="kofi-btn kofi-btn-outline kofi-btn-xl">
                Join Our Community
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Stories Section */}
      <section className="kofi-section">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">
              The Founders Who Lived the Problem
            </h2>
            <p className="kofi-body-large">
              Real contractors who built the solution they wished they had
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-2 kofi-mb-xl">
            {founderStories.map((story, index) => (
              <div key={index} className="kofi-card">
                <div className="kofi-card-body">
                  <div className="flex kofi-mb-md">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="kofi-body-large text-gray-700 italic kofi-mb-lg">"{story.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {story.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{story.author}</div>
                      <div className="kofi-body-small text-gray-600">{story.title}</div>
                      <div className="kofi-body-small text-orange-500">{story.years}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="kofi-section bg-gray-50">
        <div className="kofi-container-narrow">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">
              Our Journey: From Garage to Industry Leader
            </h2>
            <p className="kofi-body-large">
              How two frustrated contractors built the #1 painting software
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="kofi-card">
                    <div className="kofi-card-body">
                      <h3 className="kofi-h4 kofi-mb-sm">{milestone.title}</h3>
                      <p className="kofi-body text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Impact Section */}
      <section className="kofi-section">
        <div className="kofi-container">
          <div className="kofi-grid kofi-grid-2" style={{ alignItems: 'center' }}>
            <div>
              <h2 className="kofi-h2 kofi-mb-lg">
                Our Mission: Empower Every Painting Contractor
              </h2>
              <p className="kofi-body-large kofi-mb-lg">
                We believe every painting contractor - from solo painters to growing companies - deserves access to 
                professional tools that help them create accurate quotes, win more jobs, and build successful businesses.
              </p>
              <p className="kofi-body-large kofi-mb-lg">
                Too many skilled painters lose jobs not because of their craft, but because their estimates take too long 
                or don't look professional enough. We're changing that reality, one contractor at a time.
              </p>
              
              <div className="kofi-card bg-orange-50 kofi-mb-xl">
                <div className="kofi-card-body">
                  <h3 className="font-bold text-gray-900 kofi-mb-md">Our Impact So Far:</h3>
                  <div className="grid grid-cols-2 gap-4 kofi-body-small">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>$50M+ in quotes generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>500,000+ hours saved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Average 40% win rate increase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>All 50 states covered</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href="/demo" className="kofi-btn kofi-btn-primary kofi-btn-lg">
                See Our Mission in Action
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="kofi-card">
                <div className="kofi-card-body">
                  <div className="flex items-center gap-4 kofi-mb-md">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="kofi-h4">Built with Love</h3>
                  </div>
                  <p className="kofi-body text-gray-600">
                    Every feature is crafted by people who understand the daily challenges of running a painting business.
                  </p>
                </div>
              </div>
              
              <div className="kofi-card">
                <div className="kofi-card-body">
                  <div className="flex items-center gap-4 kofi-mb-md">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="kofi-h4">Reliable & Secure</h3>
                  </div>
                  <p className="kofi-body text-gray-600">
                    Enterprise-grade security with 99.9% uptime. Your business data is always safe and accessible.
                  </p>
                </div>
              </div>
              
              <div className="kofi-card">
                <div className="kofi-card-body">
                  <div className="flex items-center gap-4 kofi-mb-md">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ThumbsUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="kofi-h4">Community Driven</h3>
                  </div>
                  <p className="kofi-body text-gray-600">
                    New features come from contractor feedback. Your voice shapes the future of ProPaint Quote.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Values Section */}
      <section className="kofi-section bg-gray-50">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2 kofi-mb-lg">
              Our Values Drive Everything We Do
            </h2>
            <p className="kofi-body-large">
              Built on principles that matter to contractors
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-3 kofi-mb-xl">
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="kofi-h4 kofi-mb-md">Innovation for Real Problems</h3>
                <p className="kofi-body text-gray-600">
                  Every feature solves a real contractor pain point. We don't build technology for technology's sake - we build solutions that matter.
                </p>
              </div>
            </div>
            
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="kofi-h4 kofi-mb-md">Community First</h3>
                <p className="kofi-body text-gray-600">
                  We're part of the painting community. Your feedback shapes our roadmap, and your success drives our motivation.
                </p>
              </div>
            </div>
            
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="kofi-h4 kofi-mb-md">Excellence in Simplicity</h3>
                <p className="kofi-body text-gray-600">
                  Professional tools should be powerful yet simple. We obsess over making complex calculations feel effortless.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="kofi-card bg-white kofi-shadow-lg">
            <div className="kofi-card-body">
              <div className="kofi-text-center kofi-mb-lg">
                <h3 className="kofi-h3 kofi-mb-md">Get in Touch</h3>
                <p className="kofi-body text-gray-600">
                  Questions about ProPaint Quote? We'd love to hear from you.
                </p>
              </div>
              
              <div className="kofi-grid kofi-grid-3 kofi-text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 kofi-mb-xs">Call Us</h4>
                  <p className="kofi-body text-gray-600">1-800-PROPAINT</p>
                  <p className="kofi-body-small text-gray-500">Mon-Fri 8AM-6PM EST</p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 kofi-mb-xs">Email Support</h4>
                  <p className="kofi-body text-gray-600">support@propaintquote.com</p>
                  <p className="kofi-body-small text-gray-500">24-hour response time</p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 kofi-mb-xs">Book a Demo</h4>
                  <p className="kofi-body text-gray-600">Personal 1-on-1 walkthrough</p>
                  <p className="kofi-body-small text-gray-500">15 minutes, free</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="kofi-section">
        <div className="kofi-container">
          <div className="kofi-text-center kofi-mb-xl">
            <h2 className="kofi-h2">
              Real Results from Real Contractors
            </h2>
            <p className="kofi-body-large">
              See how ProPaint Quote is transforming painting businesses
            </p>
          </div>
          
          <div className="kofi-grid kofi-grid-3 kofi-mb-xl">
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="kofi-h3 kofi-mb-sm">$500K+</h3>
                <p className="kofi-body text-gray-600 kofi-mb-sm">Additional Revenue</p>
                <p className="kofi-body-small text-gray-500">Average in first year</p>
              </div>
            </div>
            
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="kofi-h3 kofi-mb-sm">10 Hours</h3>
                <p className="kofi-body text-gray-600 kofi-mb-sm">Saved Per Week</p>
                <p className="kofi-body-small text-gray-500">Time back for more jobs</p>
              </div>
            </div>
            
            <div className="kofi-card kofi-text-center">
              <div className="kofi-card-body">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto kofi-mb-md">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="kofi-h3 kofi-mb-sm">300%</h3>
                <p className="kofi-body text-gray-600 kofi-mb-sm">Business Growth</p>
                <p className="kofi-body-small text-gray-500">Average in 18 months</p>
              </div>
            </div>
          </div>
          
          <div className="kofi-text-center">
            <Link href="/painting-contractor-software-case-study" className="kofi-btn kofi-btn-outline kofi-btn-lg">
              Read Complete Success Stories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="kofi-section bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="kofi-container-narrow kofi-text-center">
          <h2 className="kofi-h2 text-white kofi-mb-md">
            Ready to Transform Your Painting Business?
          </h2>
          <p className="kofi-body-large opacity-90 kofi-mb-xl">
            Join 5,000+ contractors who create professional quotes in 5 minutes and win 40% more jobs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center kofi-mb-lg">
            <Link href="/trial-signup" className="kofi-btn bg-white text-orange-500 hover:bg-gray-100 kofi-btn-lg">
              Start Free Trial Today
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo" className="kofi-btn border-2 border-white text-white hover:bg-white hover:text-orange-500 kofi-btn-lg">
              Watch Live Demo
              <Zap className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-200 kofi-body-small">
            <span>✓ 1 Free Quote to Start</span>
            <span>✓ No Credit Card Required</span>
            <span>✓ Setup in 5 Minutes</span>
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
            "@type": "Organization",
            "name": "ProPaint Quote",
            "description": "Professional painting contractor software built by painters, for painters. Trusted by 5,000+ contractors nationwide.",
            "url": "https://propaintquote.com",
            "logo": "https://propaintquote.com/paint-logo-transparent.png",
            "foundingDate": "2019",
            "founder": [
              {
                "@type": "Person",
                "name": "Mike Rodriguez",
                "jobTitle": "Co-Founder & Former Painting Contractor"
              },
              {
                "@type": "Person", 
                "name": "Sarah Chen",
                "jobTitle": "Co-Founder & Software Engineer"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "1-800-PROPAINT",
              "contactType": "customer service",
              "email": "support@propaintquote.com"
            },
            "sameAs": [
              "https://facebook.com/propaintquote",
              "https://twitter.com/propaintquote",
              "https://linkedin.com/company/propaintquote"
            ]
          })
        }}
      />
    </div>
  );
}