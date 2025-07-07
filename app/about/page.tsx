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
import { Footer } from '@/components/shared/footer';

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

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-5xl">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Trusted by 5,000+ Professional Painting Contractors</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Built by <span className="text-blue-600">Painters</span>, for <span className="text-blue-600">Painters</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ProPaint Quote was created by professional painting contractors who got tired of losing jobs 
            to faster competitors. We built the software we wished we had when we were spending hours 
            on quotes that should take minutes.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {companyStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              <Link href="/demo">
                <Zap className="w-5 h-5 mr-2" />
                See Our Story in Action
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link href="/access-code">
                Join Our Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Stories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Founders Who Lived the Problem
            </h2>
            <p className="text-xl text-gray-600">
              Real contractors who built the solution they wished they had
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {founderStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 italic mb-6">"{story.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {story.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{story.author}</div>
                      <div className="text-sm text-gray-600">{story.title}</div>
                      <div className="text-sm text-blue-600">{story.years}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey: From Garage to Industry Leader
            </h2>
            <p className="text-xl text-gray-600">
              How two frustrated contractors built the #1 painting software
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Impact Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission: Empower Every Painting Contractor
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe every painting contractor - from solo painters to growing companies - deserves access to 
                professional tools that help them create accurate quotes, win more jobs, and build successful businesses.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Too many skilled painters lose jobs not because of their craft, but because their estimates take too long 
                or don't look professional enough. We're changing that reality, one contractor at a time.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Our Impact So Far:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
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
              
              <Button size="lg" asChild>
                <Link href="/demo">
                  See Our Mission in Action
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Heart className="w-8 h-8 text-red-500" />
                    <h3 className="text-xl font-bold text-gray-900">Built with Love</h3>
                  </div>
                  <p className="text-gray-600">
                    Every feature is crafted by people who understand the daily challenges of running a painting business.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Reliable & Secure</h3>
                  </div>
                  <p className="text-gray-600">
                    Enterprise-grade security with 99.9% uptime. Your business data is always safe and accessible.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <ThumbsUp className="w-8 h-8 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Community Driven</h3>
                  </div>
                  <p className="text-gray-600">
                    New features come from contractor feedback. Your voice shapes the future of ProPaint Quote.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values Drive Everything We Do
            </h2>
            <p className="text-xl text-gray-600">
              Built on principles that matter to contractors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation for Real Problems</h3>
                <p className="text-gray-600">
                  Every feature solves a real contractor pain point. We don't build technology for technology's sake - we build solutions that matter.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Community First</h3>
                <p className="text-gray-600">
                  We're part of the painting community. Your feedback shapes our roadmap, and your success drives our motivation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <Trophy className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence in Simplicity</h3>
                <p className="text-gray-600">
                  Professional tools should be powerful yet simple. We obsess over making complex calculations feel effortless.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h3>
              <p className="text-gray-600">
                Questions about ProPaint Quote? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Call Us</h4>
                <p className="text-gray-600">1-800-PROPAINT</p>
                <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM EST</p>
              </div>
              
              <div>
                <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Email Support</h4>
                <p className="text-gray-600">support@propaintquote.com</p>
                <p className="text-sm text-gray-500">24-hour response time</p>
              </div>
              
              <div>
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">Book a Demo</h4>
                <p className="text-gray-600">Personal 1-on-1 walkthrough</p>
                <p className="text-sm text-gray-500">15 minutes, free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Contractors
            </h2>
            <p className="text-xl text-gray-600">
              See how ProPaint Quote is transforming painting businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">$500K+</h3>
                <p className="text-gray-600 mb-2">Additional Revenue</p>
                <p className="text-sm text-gray-500">Average in first year</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10 Hours</h3>
                <p className="text-gray-600 mb-2">Saved Per Week</p>
                <p className="text-sm text-gray-500">Time back for more jobs</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">300%</h3>
                <p className="text-gray-600 mb-2">Business Growth</p>
                <p className="text-sm text-gray-500">Average in 18 months</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/painting-contractor-software-case-study">
                Read Complete Success Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Painting Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 5,000+ contractors who create professional quotes in 5 minutes and win 40% more jobs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                Start Free Trial Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/demo">
                Watch Live Demo
                <Zap className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-blue-200 text-sm">
            <span>✓ 1 Free Quote to Start</span>
            <span>✓ No Credit Card Required</span>
            <span>✓ Setup in 5 Minutes</span>
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
            "@type": "Organization",
            "name": "ProPaint Quote",
            "description": "Professional painting contractor software built by painters, for painters. Trusted by 5,000+ contractors nationwide.",
            "url": "https://propaintquote.com",
            "logo": "https://propaintquote.com/logo.png",
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