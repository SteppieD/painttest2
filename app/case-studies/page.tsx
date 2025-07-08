import { Metadata } from 'next';
import Link from 'next/link';
import { 
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Building,
  Calendar,
  Award,
  Target,
  Zap,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';

export const metadata: Metadata = {
  title: 'Painting Contractor Case Studies - Success Stories & Results | ProPaint Quote',
  description: 'Painting contractor case studies showing real results. See how contractors increased revenue 156%, saved 10+ hours weekly, and transformed their painting businesses with our software.',
  keywords: 'painting contractor case studies, painting business success stories, contractor software results, painting business case study, painting contractor testimonials, painting software success, contractor growth stories',
  alternates: {
    canonical: '/case-studies',
  },
  openGraph: {
    title: 'Painting Contractor Success Stories - Real Results from Real Contractors',
    description: 'Painting contractor case studies demonstrate 156% revenue growth, 10+ hours saved weekly, and business transformations. Read success stories from 5,000+ contractors.',
    url: '/case-studies',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function CaseStudiesPage() {
  // Featured case studies
  const featuredCaseStudies = [
    {
      contractor: "Rodriguez Painting LLC",
      location: "Austin, TX",
      established: "2019",
      teamSize: "Started: 2, Now: 12",
      beforeRevenue: "$180,000/year",
      afterRevenue: "$461,000/year",
      growth: "+156%",
      timeframe: "18 months",
      challenge: "Losing jobs to competitors with faster quotes",
      solution: "Implemented mobile quoting and automated follow-ups",
      keyResults: [
        "Quote delivery time: 2 days → 2 hours",
        "Close rate increased from 25% to 62%",
        "Average job value up 45%",
        "10 new commercial contracts"
      ],
      quote: "This software didn't just save us time - it transformed how we do business. We're now the go-to contractor for commercial properties.",
      avatar: "CR"
    },
    {
      contractor: "Premium Painters Inc",
      location: "Seattle, WA",
      established: "2015",
      teamSize: "Started: 5, Now: 8",
      beforeRevenue: "$385,000/year",
      afterRevenue: "$542,000/year",
      growth: "+41%",
      timeframe: "12 months",
      challenge: "Spending 3+ hours per quote, limiting growth",
      solution: "Adopted photo measurement and template system",
      keyResults: [
        "Quote creation: 3 hours → 15 minutes",
        "Quotes per week: 5 → 25",
        "Customer satisfaction: 4.2 → 4.9 stars",
        "Referral rate increased 80%"
      ],
      quote: "We went from turning down jobs to having a 3-week waitlist. The efficiency gains are incredible.",
      avatar: "PP"
    },
    {
      contractor: "Thompson & Sons Painting",
      location: "Chicago, IL",
      established: "2008",
      teamSize: "Started: 8, Now: 15",
      beforeRevenue: "$720,000/year",
      afterRevenue: "$1,240,000/year",
      growth: "+72%",
      timeframe: "24 months",
      challenge: "Family business struggling with modern competition",
      solution: "Full digital transformation with app and CRM",
      keyResults: [
        "Lead response time: 24 hrs → 1 hour",
        "Jobs tracked digitally: 0% → 100%",
        "Profit margins up 18%",
        "Expanded to 2 new cities"
      ],
      quote: "My dad built this business with paper and pencil. This software helped us honor his legacy while modernizing for the future.",
      avatar: "TS"
    }
  ];

  // Quick success metrics
  const quickWins = [
    {
      company: "Ace Painting Co",
      metric: "First Week Results",
      result: "3 jobs closed from mobile quotes",
      value: "$12,500"
    },
    {
      company: "Color Masters LLC",
      metric: "30-Day Impact",
      result: "Quote volume up 240%",
      value: "15 → 51 quotes"
    },
    {
      company: "Pro Paint Services",
      metric: "90-Day Revenue",
      result: "Best quarter in company history",
      value: "+$67,000"
    },
    {
      company: "Elite Painters",
      metric: "6-Month Growth",
      result: "Hired 3 new painters",
      value: "40% capacity increase"
    }
  ];

  // Industry challenges solved
  const challengesSolved = [
    {
      challenge: "Slow Quote Delivery",
      before: "2-5 days average",
      after: "Under 2 hours",
      impact: "3x higher close rate"
    },
    {
      challenge: "Lost Leads",
      before: "No follow-up system",
      after: "Automated sequences",
      impact: "45% of lost leads recovered"
    },
    {
      challenge: "Pricing Inconsistency",
      before: "Manual calculations",
      after: "Standardized formulas",
      impact: "18% higher margins"
    },
    {
      challenge: "Paper Chaos",
      before: "Filing cabinets",
      after: "Cloud-based system",
      impact: "Zero lost quotes"
    }
  ];

  // Results by business size
  const resultsBySize = [
    {
      size: "Solo Contractors",
      avgGrowth: "+85%",
      timesSaved: "15 hrs/week",
      keyBenefit: "Work-life balance restored",
      example: "Jim went from 60-hour weeks to 40 while doubling revenue"
    },
    {
      size: "Small Teams (2-5)",
      avgGrowth: "+125%",
      timesSaved: "25 hrs/week",
      keyBenefit: "Scaled without hiring admin",
      example: "Maria's team handles 3x more jobs with same crew"
    },
    {
      size: "Mid-Size (6-15)",
      avgGrowth: "+65%",
      timesSaved: "40 hrs/week",
      keyBenefit: "Professional operations",
      example: "Thompson & Sons expanded to new markets"
    },
    {
      size: "Large (15+)",
      avgGrowth: "+45%",
      timesSaved: "60+ hrs/week",
      keyBenefit: "Enterprise efficiency",
      example: "ProPaint Corp streamlined 3 locations"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-200">
              Real Contractors, Real Results
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Painting Contractor Case Studies & Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Painting contractor case studies showing how 5,000+ professionals transformed 
              their businesses. Real data, real growth, real success stories.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/trial-signup">
                  Start Your Success Story
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#featured">
                  Read Case Studies
                  <FileText className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Aggregate Results Banner */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">78%</div>
              <div className="text-gray-400">Average Revenue Growth</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+ hrs</div>
              <div className="text-gray-400">Saved Per Week</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">2.4x</div>
              <div className="text-gray-400">More Quotes Won</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">45%</div>
              <div className="text-gray-400">Higher Job Values</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section id="featured" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Painting Contractor Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              In-depth case studies from contractors who transformed their businesses
            </p>
          </div>
          
          <div className="space-y-12">
            {featuredCaseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden shadow-xl">
                <div className="grid lg:grid-cols-3 gap-0">
                  {/* Company Info */}
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                      {study.avatar}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{study.contractor}</h3>
                    <p className="text-blue-100 mb-4">{study.location}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-blue-200">Established</p>
                        <p className="font-semibold">{study.established}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-200">Team Size</p>
                        <p className="font-semibold">{study.teamSize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-200">Growth Timeline</p>
                        <p className="font-semibold">{study.timeframe}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results & Challenge */}
                  <div className="lg:col-span-2 p-8">
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">The Challenge</h4>
                        <p className="text-gray-600 mb-4">{study.challenge}</p>
                        
                        <h4 className="font-bold text-gray-900 mb-2">The Solution</h4>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4">Revenue Growth</h4>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Before:</span>
                            <span className="font-semibold">{study.beforeRevenue}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">After:</span>
                            <span className="font-semibold text-green-600">{study.afterRevenue}</span>
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">{study.growth}</div>
                          <div className="text-sm text-gray-600">Revenue Increase</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Key Results</h4>
                      <div className="grid md:grid-cols-2 gap-3 mb-6">
                        {study.keyResults.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{result}</span>
                          </div>
                        ))}
                      </div>
                      
                      <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-700">
                        "{study.quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Wins */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Wins from Real Contractors
            </h2>
            <p className="text-xl text-gray-600">
              Immediate results contractors saw after switching to our software
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickWins.map((win, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{win.company}</CardTitle>
                  <Badge variant="outline">{win.metric}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{win.value}</p>
                  <p className="text-gray-600">{win.result}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Solved */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Painting Business Challenges We Solve
            </h2>
            <p className="text-xl text-gray-600">
              See how our software addresses industry-wide problems
            </p>
          </div>
          
          <div className="grid gap-6">
            {challengesSolved.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid md:grid-cols-4 gap-6 p-6 items-center">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{item.challenge}</h3>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Before</p>
                    <p className="font-semibold text-red-600">{item.before}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">After</p>
                    <p className="font-semibold text-green-600">{item.after}</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {item.impact}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results by Business Size */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories by Business Size
            </h2>
            <p className="text-xl text-gray-600">
              Our software scales with your painting business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resultsBySize.map((size, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{size.size}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{size.avgGrowth}</p>
                      <p className="text-sm text-gray-600">Average Growth</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-600">{size.timesSaved}</p>
                      <p className="text-sm text-gray-600">Time Saved</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{size.keyBenefit}</p>
                      <p className="text-sm text-gray-600 italic">"{size.example}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Formula */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Success Formula Our Case Studies Reveal
            </h2>
            <p className="text-xl text-gray-600">
              Common patterns from our most successful contractors
            </p>
          </div>
          
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-3">
                <div className="p-8 border-b md:border-b-0 md:border-r">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Week 1-2</h3>
                    <p className="text-gray-600">Quick Implementation</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Set up in one afternoon</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>First mobile quote same day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Team training in 2 hours</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-8 border-b md:border-b-0 md:border-r">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Month 1-3</h3>
                    <p className="text-gray-600">Momentum Building</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Quote volume doubles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Close rate up 40%+</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>First record month</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-8">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Month 6+</h3>
                    <p className="text-gray-600">Transformation</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>50-150% revenue growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Expansion opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Industry leader status</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 5,000+ painting contractors who transformed their businesses. 
            Start your free trial and see results in your first week.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/trial-signup">
                Start Your Transformation
                <TrendingUp className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/features">
                See How It Works
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Full support included
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}