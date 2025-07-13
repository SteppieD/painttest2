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
    <div>

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Award />
            <span>Award-Winning Painting Software</span>
          </div>
          
          <h1>
            Industry Recognition & <span>Awards</span>
          </h1>
          <p>
            Discover why ProPaint Quote has earned industry recognition, customer choice awards, and professional certifications from leading organizations.
          </p>
          
          {/* Quick Stats */}
          <div>
            {performanceMetrics.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <Icon />
                  <div>{item.metric}</div>
                  <div>{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Major Awards */}
      <section>
        <div>
          <div>
            <h2>
              Major Awards & Recognition
            </h2>
            <p>
              Honored by industry leaders for innovation, customer satisfaction, and business impact
            </p>
          </div>
          
          <div>
            {majorAwards.map((award, index) => {
              const Icon = award.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className={`${award.bgColor} ${award.color} px-3 py-1 rounded-full text-sm font-bold mb-4 inline-flex items-center gap-2`}>
                      <Icon className="w-4 h-4" />
                      <span>{award.badge}</span>
                    </div>
                    <div>{award.year}</div>
                    <CardTitle>{award.title}</CardTitle>
                    <p>{award.organization}</p>
                  </CardHeader>
                  <CardContent>
                    <p>{award.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <div>
          <div>
            <h2>
              Professional Certifications
            </h2>
            <p>
              Certified by leading organizations for security, quality, and innovation
            </p>
          </div>
          
          <div>
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card key={index}>
                  <CardContent>
                    <div>
                      <div>
                        <Icon />
                      </div>
                      <div>
                        <div>
                          <h3>{cert.title}</h3>
                          {cert.verified && (
                            <CheckCircle />
                          )}
                        </div>
                        <p>{cert.organization}</p>
                        <p>{cert.description}</p>
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
      <section>
        <div>
          <div>
            <h2>
              What Award Judges Are Saying
            </h2>
            <p>
              Real feedback from customers that influenced award decisions
            </p>
          </div>
          
          <div>
            {awardTestimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent>
                  <Quote />
                  <p>"{testimonial.quote}"</p>
                  <div>
                    <div>{testimonial.author}</div>
                    <div>{testimonial.company}</div>
                    <div>{testimonial.location}</div>
                    <div>{testimonial.metric}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section>
        <div>
          <div>
            <h2>
              Media Coverage & Press
            </h2>
            <p>
              Industry publications recognize ProPaint Quote innovation
            </p>
          </div>
          
          <div>
            {mediaCoverage.map((article, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    <div>
                      <div>
                        <BookOpen />
                        <span>{article.type}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                      <h3>{article.headline}</h3>
                      <p>{article.excerpt}</p>
                      <p>{article.publication}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Read Article
                      <ArrowRight />
                    </Button>
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
          <Medal />
          <h2>
            Join the Award-Winning Platform
          </h2>
          <p>
            Experience the software that's earned industry recognition and transformed thousands of painting businesses
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                See Award-Winning Features
              </Link>
            </Button>
          </div>
          
          <p>
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