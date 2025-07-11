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
    <div className="min-h-screen bg-white">
      <KofiHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>4.9/5 Average Rating from 5,000+ Contractors</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Real Stories from <span className="text-blue-600">Real Contractors</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            See how painting professionals across the country are transforming their businesses with ProPaint Quote. 
            These aren't just testimonials – they're success stories.
          </p>
          
          {/* Industry Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {industryStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{item.stat}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Success Stories */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories That Speak for Themselves
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real contractors, real results, real impact on their businesses
            </p>
          </div>
          
          <div className="space-y-12">
            {detailedTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="border-0 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                  {/* Customer Info */}
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-blue-600 font-medium">{testimonial.company}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex justify-center lg:justify-start gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    {/* Business Growth */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="text-sm font-medium text-gray-600">Business Growth:</div>
                      <div className="text-sm text-gray-700">{testimonial.businessSize}</div>
                      <div className="text-sm text-gray-700">Started: {testimonial.yearStarted}</div>
                    </div>
                  </div>
                  
                  {/* Testimonial Content */}
                  <div className="lg:col-span-2">
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">{testimonial.headline}</h4>
                    
                    <div className="relative mb-6">
                      <Quote className="w-8 h-8 text-blue-200 absolute -top-2 -left-2" />
                      <p className="text-lg text-gray-700 leading-relaxed pl-6 italic">
                        {testimonial.quote}
                      </p>
                    </div>
                    
                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{testimonial.results.winRate}</div>
                        <div className="text-sm text-green-700">Win Rate Increase</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{testimonial.results.timesSaved}</div>
                        <div className="text-sm text-blue-700">Time Saved</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{testimonial.results.revenue}</div>
                        <div className="text-sm text-purple-700">Revenue Impact</div>
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
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Contractors Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied painting professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickTestimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Trusted by Industry Leaders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Recognition</h3>
              <p className="text-gray-600">Recommended by Painting Contractors Association</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with 99.9% uptime</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growing Community</h3>
              <p className="text-gray-600">5,000+ contractors and growing every month</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of contractors who've transformed their businesses with ProPaint Quote
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/trial-signup">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/demo">
                Watch Demo First
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
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