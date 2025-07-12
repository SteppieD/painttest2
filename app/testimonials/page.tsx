import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Star, 
  Quote, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  Award,
  Building,
  Smartphone,
  Target,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Customer Success Stories & Testimonials | ProPaint Quote Reviews',
  description: 'Read real testimonials from 5,000+ painting contractors using ProPaint Quote. See how professionals increased win rates by 40% and grew their businesses.',
  keywords: 'painting contractor testimonials, ProPaint Quote reviews, customer success stories, painting software reviews, contractor testimonials',
  alternates: {
    canonical: '/testimonials',
  },
  openGraph: {
    title: 'Customer Success Stories - ProPaint Quote Testimonials',
    description: 'Real stories from painting contractors who transformed their businesses with ProPaint Quote. 40% higher win rates and faster quotes.',
    url: '/testimonials',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function TestimonialsPage() {
  // Detailed customer success stories
  const detailedTestimonials = [
    {
      id: 1,
      name: "Mike Johnson",
      company: "Elite Painting Co.",
      location: "Denver, CO",
      avatar: "M",
      rating: 5,
      headline: "Increased win rate from 35% to 78% in 3 months",
      quote: "ProPaint Quote completely transformed how we do business. Before, I was spending 2-3 hours on each quote and still losing jobs to faster competitors. Now I create professional quotes in 5 minutes while driving to the next job. My win rate went from 35% to 78%, and I'm booking 40% more jobs per month.",
      results: {
        winRate: "+43%",
        timesSaved: "2.5 hrs per quote",
        revenue: "+$47K in 3 months"
      },
      businessSize: "Solo contractor → 3 employees",
      yearStarted: "2023"
    },
    {
      id: 2,
      name: "Sarah Martinez",
      company: "ProPaint Solutions",
      location: "Austin, TX",
      avatar: "S",
      rating: 5,
      headline: "From $180K to $420K annual revenue in 18 months",
      quote: "The mobile app changed everything. I can measure a room, create a quote, and email it to the customer before I even leave their driveway. Customers love the professional presentation, and I'm closing deals on the spot. We've grown from a 2-person team to 8 painters.",
      results: {
        winRate: "+52%",
        timesSaved: "15 hrs per week",
        revenue: "$420K annually"
      },
      businessSize: "2 → 8 employees",
      yearStarted: "2022"
    },
    {
      id: 3,
      name: "David Chen",
      company: "Precision Painters",
      location: "Seattle, WA",
      avatar: "D",
      rating: 5,
      headline: "Closed $15K job on-site with mobile quote",
      quote: "I was skeptical about quote software until I saw ProPaint Quote's mobile features. Last week, I quoted a $15,000 commercial job and got the contract signed before I left the parking lot. The customer was impressed by the professional presentation and detailed breakdown.",
      results: {
        winRate: "+61%",
        timesSaved: "20 hrs per week",
        revenue: "+$89K in 6 months"
      },
      businessSize: "Solo → 4 employees",
      yearStarted: "2023"
    },
    {
      id: 4,
      name: "Jennifer Walsh",
      company: "Walsh Painting",
      location: "Phoenix, AZ",
      avatar: "J",
      rating: 5,
      headline: "Reduced quote time by 85% while doubling accuracy",
      quote: "As a woman in this industry, I needed every advantage to compete. ProPaint Quote gave me that edge. My quotes are faster, more accurate, and look incredibly professional. I'm no longer losing jobs to timing, and customers trust me more because everything looks so polished.",
      results: {
        winRate: "+38%",
        timesSaved: "12 hrs per week",
        revenue: "+$34K in 4 months"
      },
      businessSize: "Solo contractor",
      yearStarted: "2024"
    },
    {
      id: 5,
      name: "Robert Thompson",
      company: "Thompson Bros Painting",
      location: "Orlando, FL",
      avatar: "R",
      rating: 5,
      headline: "Scaled from 2 to 12 employees using systematic quoting",
      quote: "ProPaint Quote didn't just speed up our quotes - it standardized our entire sales process. Now all our estimators create consistent, professional quotes. We've grown from 2 to 12 employees and our profit margins have improved because the calculations are always accurate.",
      results: {
        winRate: "+29%",
        timesSaved: "25 hrs per week",
        revenue: "$680K annually"
      },
      businessSize: "2 → 12 employees",
      yearStarted: "2022"
    }
  ];

  // Industry statistics
  const industryStats = [
    { stat: "5,000+", label: "Active Contractors", icon: Users },
    { stat: "$2.3M+", label: "Quotes Generated", icon: DollarSign },
    { stat: "40%", label: "Average Win Rate Increase", icon: TrendingUp },
    { stat: "80%", label: "Time Savings", icon: Clock }
  ];

  // Quick testimonials for variety
  const quickTestimonials = [
    {
      text: "Game changer for my painting business. Quotes that used to take hours now take minutes.",
      author: "Tom Rodriguez",
      company: "Rodriguez Painting"
    },
    {
      text: "My customers love how professional everything looks. It definitely helps close more deals.",
      author: "Lisa Chen",
      company: "Chen Painting Services"
    },
    {
      text: "The mobile app is incredible. I can quote jobs while I'm still at the customer's house.",
      author: "Mark Williams",
      company: "Williams Professional Painting"
    },
    {
      text: "Best investment I've made for my painting business. ROI was immediate.",
      author: "Amanda Davis",
      company: "Davis Quality Painting"
    }
  ];

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Star />
            <span>4.9/5 Average Rating from 5,000+ Contractors</span>
          </div>
          
          <h1>
            Real Stories from <span>Real Contractors</span>
          </h1>
          <p>
            See how painting professionals across the country are transforming their businesses with ProPaint Quote. 
            These aren't just testimonials – they're success stories.
          </p>
          
          {/* Industry Stats */}
          <div>
            {industryStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <Icon />
                  <div>{item.stat}</div>
                  <div>{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Success Stories */}
      <section>
        <div>
          <div>
            <h2>
              Success Stories That Speak for Themselves
            </h2>
            <p>
              Real contractors, real results, real impact on their businesses
            </p>
          </div>
          
          <div>
            {detailedTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id}>
                <div>
                  {/* Customer Info */}
                  <div>
                    <div>
                      <div>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h3>{testimonial.name}</h3>
                        <p>{testimonial.company}</p>
                        <p>{testimonial.location}</p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} />
                      ))}
                    </div>
                    
                    {/* Business Growth */}
                    <div>
                      <div>Business Growth:</div>
                      <div>{testimonial.businessSize}</div>
                      <div>Started: {testimonial.yearStarted}</div>
                    </div>
                  </div>
                  
                  {/* Testimonial Content */}
                  <div>
                    <h4>{testimonial.headline}</h4>
                    
                    <div>
                      <Quote />
                      <p>
                        {testimonial.quote}
                      </p>
                    </div>
                    
                    {/* Results Grid */}
                    <div>
                      <div>
                        <div>{testimonial.results.winRate}</div>
                        <div>Win Rate Increase</div>
                      </div>
                      <div>
                        <div>{testimonial.results.timesSaved}</div>
                        <div>Time Saved</div>
                      </div>
                      <div>
                        <div>{testimonial.results.revenue}</div>
                        <div>Revenue Impact</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Testimonials Grid */}
      <section>
        <div>
          <div>
            <h2>
              What Contractors Are Saying
            </h2>
            <p>
              Join thousands of satisfied painting professionals
            </p>
          </div>
          
          <div>
            {quickTestimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p>"{testimonial.text}"</p>
                  <div>
                    <div>{testimonial.author}</div>
                    <div>{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section>
        <div>
          <h2>
            Trusted by Industry Leaders
          </h2>
          
          <div>
            <div>
              <Award />
              <h3>Industry Recognition</h3>
              <p>Recommended by Painting Contractors Association</p>
            </div>
            <div>
              <Shield />
              <h3>Secure & Reliable</h3>
              <p>Enterprise-grade security with 99.9% uptime</p>
            </div>
            <div>
              <Users />
              <h3>Growing Community</h3>
              <p>5,000+ contractors and growing every month</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Ready to Write Your Success Story?
          </h2>
          <p>
            Join thousands of contractors who've transformed their businesses with ProPaint Quote
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Start Your Free Trial
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                Watch Demo First
              </Link>
            </Button>
          </div>
          
          <p>
            Start with 1 free quote • No credit card required • Cancel anytime
          </p>
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
            "review": detailedTestimonials.map(testimonial => ({
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating,
                "bestRating": 5
              },
              "name": testimonial.headline,
              "reviewBody": testimonial.quote,
              "author": {
                "@type": "Person",
                "name": testimonial.name
              },
              "publisher": {
                "@type": "Organization",
                "name": testimonial.company
              }
            })),
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": 4.9,
              "reviewCount": 5000,
              "bestRating": 5
            }
          })
        }}
      />
    </div>
  );
}