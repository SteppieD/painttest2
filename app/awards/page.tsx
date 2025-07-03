import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Award, 
  Star, 
  Shield, 
  Users,
  Trophy,
  Medal,
  Target,
  TrendingUp,
  CheckCircle,
  Calendar,
  Building,
  Zap,
  Globe,
  ArrowRight,
  Quote,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'Awards & Industry Recognition | ProPaint Quote Achievements',
  description: 'Discover why ProPaint Quote is the award-winning choice for painting contractors. Industry recognition, customer awards, and professional certifications.',
  keywords: 'painting software awards, contractor software recognition, ProPaint Quote achievements, industry awards, software certifications',
  alternates: {
    canonical: '/awards',
  },
  openGraph: {
    title: 'Award-Winning Painting Software - ProPaint Quote Recognition',
    description: 'See why ProPaint Quote has earned industry recognition and customer choice awards from thousands of painting contractors.',
    url: '/awards',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function AwardsPage() {
  // Major awards and recognition
  const majorAwards = [
    {
      year: "2024",
      title: "Best Painting Software",
      organization: "Contractor Technology Awards",
      description: "Recognized for innovation in AI-powered quote generation and mobile-first design that increased contractor efficiency by 40%.",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      badge: "Gold Winner"
    },
    {
      year: "2024", 
      title: "Customer Choice Award",
      organization: "Software Review Platform",
      description: "Earned 4.9/5 stars from 5,000+ painting contractors with 95% customer satisfaction rating.",
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      badge: "Top Rated"
    },
    {
      year: "2023",
      title: "Innovation Excellence",
      organization: "Small Business Technology Summit",
      description: "Honored for revolutionary dual-interface approach and smart learning capabilities that adapt to contractor preferences.",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      badge: "Innovation Leader"
    },
    {
      year: "2023",
      title: "Rising Star Award",
      organization: "Construction Software Alliance",
      description: "Fastest-growing painting software with 500% user growth and highest contractor retention rate in the industry.",
      icon: TrendingUp,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      badge: "Rising Star"
    }
  ];

  // Industry certifications and partnerships
  const certifications = [
    {
      title: "SOC 2 Type II Compliant",
      organization: "Security & Privacy",
      description: "Enterprise-grade security standards protecting contractor and customer data",
      icon: Shield,
      verified: true
    },
    {
      title: "Painting Contractors Association",
      organization: "Recommended Software Partner",
      description: "Official recommendation for professional quote generation and business management",
      icon: Building,
      verified: true
    },
    {
      title: "Mobile Excellence Certification",
      organization: "App Development Institute",
      description: "Certified for superior mobile user experience and touch-first design",
      icon: Target,
      verified: true
    },
    {
      title: "AI Innovation Certificate",
      organization: "Technology Innovation Board",
      description: "Recognized for breakthrough AI learning and smart suggestion capabilities",
      icon: Briefcase,
      verified: true
    }
  ];

  // Customer testimonials from award submissions
  const awardTestimonials = [
    {
      quote: "ProPaint Quote doesn't just deserve recognition—it deserves to be the industry standard. The innovation and results speak for themselves.",
      author: "Mike Johnson",
      company: "Elite Painting Co.",
      location: "Denver, CO",
      metric: "78% win rate increase"
    },
    {
      quote: "When evaluating painting software, ProPaint Quote consistently outperformed every competitor. The awards validate what we contractors already know.",
      author: "Sarah Martinez", 
      company: "ProPaint Solutions",
      location: "Austin, TX",
      metric: "$420K annual revenue"
    },
    {
      quote: "The recognition is well-deserved. This platform transformed our business in ways we never thought possible for a software tool.",
      author: "David Chen",
      company: "Precision Painters", 
      location: "Seattle, WA",
      metric: "$89K revenue increase"
    }
  ];

  // Performance metrics that led to awards
  const performanceMetrics = [
    { metric: "5,000+", label: "Active Contractors", icon: Users },
    { metric: "40%", label: "Average Win Rate Increase", icon: Target },
    { metric: "80%", label: "Time Savings", icon: Calendar },
    { metric: "95%", label: "Customer Satisfaction", icon: CheckCircle },
    { metric: "4.9/5", label: "Average Rating", icon: Star },
    { metric: "99.9%", label: "Uptime Reliability", icon: Shield }
  ];

  // Industry media coverage
  const mediaCoverage = [
    {
      publication: "Contractor Technology Today",
      headline: "Revolutionary AI Changes How Painters Quote Jobs",
      date: "March 2024",
      excerpt: "ProPaint Quote's smart learning system represents the future of construction software.",
      type: "Feature Article"
    },
    {
      publication: "Small Business Software Review",
      headline: "ProPaint Quote Earns Top Marks for Innovation",
      date: "February 2024", 
      excerpt: "The most comprehensive review of painting software shows ProPaint Quote leading in every category.",
      type: "Product Review"
    },
    {
      publication: "Construction Technology Weekly",
      headline: "Case Study: 340% Revenue Growth with Smart Quote Software",
      date: "January 2024",
      excerpt: "Real contractors share how ProPaint Quote transformed their businesses.",
      type: "Case Study"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Award-Winning Painting Software</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Industry Recognition & <span className="text-yellow-600">Awards</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover why ProPaint Quote has earned industry recognition, customer choice awards, and professional certifications from leading organizations.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
            {performanceMetrics.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{item.metric}</div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Major Awards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Major Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Honored by industry leaders for innovation, customer satisfaction, and business impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {majorAwards.map((award, index) => {
              const Icon = award.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-6">
                    <div className={`inline-flex items-center gap-2 ${award.bgColor} px-3 py-1 rounded-full text-sm font-bold mb-4`}>
                      <Icon className={`w-4 h-4 ${award.color}`} />
                      <span className={award.color}>{award.badge}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{award.year}</div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{award.title}</CardTitle>
                    <p className="text-lg text-blue-600 font-medium">{award.organization}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center">{award.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Certifications
            </h2>
            <p className="text-xl text-gray-600">
              Certified by leading organizations for security, quality, and innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card key={index} className="border-0 shadow-sm bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{cert.title}</h3>
                          {cert.verified && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-blue-600 font-medium mb-2">{cert.organization}</p>
                        <p className="text-gray-600 text-sm">{cert.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Award Judges Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from customers that influenced award decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awardTestimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-blue-200 mb-4" />
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                    <div className="text-sm text-green-600 font-medium mt-1">{testimonial.metric}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Media Coverage & Press
            </h2>
            <p className="text-xl text-gray-600">
              Industry publications recognize ProPaint Quote innovation
            </p>
          </div>
          
          <div className="space-y-6">
            {mediaCoverage.map((article, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">{article.type}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{article.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{article.headline}</h3>
                      <p className="text-gray-600 mb-2">{article.excerpt}</p>
                      <p className="text-sm font-medium text-gray-700">{article.publication}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Medal className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Award-Winning Platform
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Experience the software that's earned industry recognition and transformed thousands of painting businesses
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-yellow-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-yellow-600">
              <Link href="/demo">
                See Award-Winning Features
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-yellow-200 mt-6">
            Join 5,000+ contractors using award-winning quote software • No credit card required
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
            "@type": "Organization",
            "name": "ProPaint Quote",
            "award": majorAwards.map(award => ({
              "@type": "Award",
              "name": award.title,
              "awarder": {
                "@type": "Organization", 
                "name": award.organization
              },
              "dateReceived": award.year
            })),
            "hasCredential": certifications.map(cert => ({
              "@type": "EducationalOccupationalCredential",
              "name": cert.title,
              "credentialCategory": "certification",
              "recognizedBy": {
                "@type": "Organization",
                "name": cert.organization
              }
            }))
          })
        }}
      />
    </div>
  );
}