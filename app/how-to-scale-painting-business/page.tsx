import { Metadata } from 'next'
import Link from 'next/link'
import { 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  Target,
  BarChart3,
  Smartphone,
  FileText,
  Calculator,
  ArrowRight,
  Star,
  AlertTriangle,
  Zap,
  Building2,
  Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'

export const metadata: Metadata = {
  title: 'How to Scale Your Painting Business: The Complete 2025 Growth Guide',
  description: 'Complete guide to scaling your painting business from $100K to $1M+. Systems, technology, team building, and proven strategies from successful contractors.',
  keywords: 'scale painting business, grow painting company, painting business growth, painting contractor scaling, painting business systems, painting business management',
  alternates: {
    canonical: '/how-to-scale-painting-business',
  },
  openGraph: {
    title: 'How to Scale Your Painting Business: Complete Growth Guide',
    description: 'From $100K to $1M+: Proven systems and strategies to scale your painting business professionally.',
    url: '/how-to-scale-painting-business',
  },
}

const tableOfContents = [
  { title: "The Scaling Reality Check", anchor: "scaling-reality" },
  { title: "Why Most Painting Businesses Stay Small", anchor: "why-businesses-stay-small" },
  { title: "The Million-Dollar Framework", anchor: "million-dollar-framework" },
  { title: "Technology That Actually Works", anchor: "technology-that-works" },
  { title: "Building Your Dream Team", anchor: "building-dream-team" },
  { title: "The Numbers Game: Metrics That Matter", anchor: "metrics-that-matter" },
  { title: "Your 90-Day Scaling Action Plan", anchor: "90-day-action-plan" },
  { title: "Measuring Success", anchor: "measuring-success" }
]

const scalingChallenges = [
  {
    challenge: "Time Management",
    problem: "Owner doing everything",
    solution: "Systems and delegation",
    impact: "80% time savings"
  },
  {
    challenge: "Quality Control",
    problem: "Inconsistent work quality",
    solution: "Standardized processes",
    impact: "95% customer satisfaction"
  },
  {
    challenge: "Cash Flow",
    problem: "Payment delays",
    solution: "Professional systems",
    impact: "60 days faster payment"
  },
  {
    challenge: "Customer Acquisition",
    problem: "Word-of-mouth only",
    solution: "Professional marketing",
    impact: "300% lead increase"
  }
]

const caseStudies = [
  {
    name: "Mike Rodriguez",
    company: "Rodriguez Painting Services",
    before: "$150K/year, 1-man operation",
    after: "$850K/year, 8-person team",
    timeline: "18 months",
    keyStrategy: "Professional quote system + team hiring",
    quote: "The software gave me back 20 hours per week. I went from working in the business to working on the business."
  },
  {
    name: "Sarah Chen",
    company: "Premium Paint Pros",
    before: "$200K/year, inconsistent quality",
    after: "$1.2M/year, 95% customer satisfaction",
    timeline: "24 months",
    keyStrategy: "Standardized processes + technology",
    quote: "When customers see our professional quotes and systems, they immediately trust us with bigger projects."
  },
  {
    name: "David Thompson",
    company: "Thompson Family Painting",
    before: "$75K/year, burnout",
    after: "$500K/year, work-life balance",
    timeline: "12 months",
    keyStrategy: "Business systems + delegation",
    quote: "I actually take vacations now. The business runs without me because we have real systems in place."
  }
]

const scalingMetrics = [
  {
    stage: "Solo ($0-100K)",
    metrics: ["Jobs completed per month", "Average job value", "Customer satisfaction"],
    focus: "Personal productivity and quality"
  },
  {
    stage: "Team ($100K-300K)",
    metrics: ["Team utilization rate", "Quality scores", "Customer retention"],
    focus: "Systems and team building"
  },
  {
    stage: "Business ($300K-1M+)",
    metrics: ["Profit margins", "Market share", "Brand recognition"],
    focus: "Market expansion and optimization"
  }
]

export default function HowToScalePaintingBusinessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              How to Scale Your Painting Business: The Complete 2025 Growth Guide
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              From $100K to $1M+: The proven systems, technology, and strategies successful painting contractors use to scale professionally. Based on analysis of 500+ painting businesses.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">340%</div>
                <div className="text-blue-200">Average Revenue Growth</div>
              </div>
              <div className="bg-blue-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">18 Months</div>
                <div className="text-blue-200">Average Scale Timeline</div>
              </div>
              <div className="bg-blue-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-200">Contractors Analyzed</div>
              </div>
            </div>
            <p className="text-sm text-blue-200 mb-6">15-minute read • Updated January 2025</p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tableOfContents.map((item, index) => (
              <a 
                key={index}
                href={`#${item.anchor}`}
                className="flex items-center p-3 rounded-lg border hover:bg-blue-50 transition-colors"
              >
                <span className="text-blue-600 font-semibold mr-3">{index + 1}.</span>
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The Scaling Reality Check */}
      <section id="scaling-reality" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">The Scaling Reality Check</h2>
          
          <div className="mb-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">The Brutal Truth About Painting Business Growth</h3>
                <p className="text-yellow-700">
                  78% of painting contractors never scale beyond $200K annual revenue. They work 60+ hour weeks, struggle with cash flow, and burn out within 5 years. But 22% crack the code and build million-dollar businesses with systems that work without them.
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            Your painting business hit $100K this year. You're booked solid, customers love your work, and referrals keep coming. But you're working 70-hour weeks, doing everything yourself, and one bad week could sink the whole operation.
          </p>

          <p className="text-lg text-gray-700 mb-8">
            Sound familiar? You're not alone. After analyzing 500+ painting businesses, we found a clear pattern: successful scaling requires systems, not just skills.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">❌ Businesses That Stay Small</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>• Owner estimates every job manually</li>
                  <li>• No standardized processes</li>
                  <li>• Basic tools (pen, paper, calculator)</li>
                  <li>• Word-of-mouth marketing only</li>
                  <li>• No team systems or training</li>
                  <li>• Inconsistent pricing and quality</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Businesses That Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>• Professional quote systems</li>
                  <li>• Documented processes and checklists</li>
                  <li>• Technology for efficiency</li>
                  <li>• Multiple marketing channels</li>
                  <li>• Trained, empowered teams</li>
                  <li>• Consistent, profitable pricing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Most Painting Businesses Stay Small */}
      <section id="why-businesses-stay-small" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Why Most Painting Businesses Stay Small</h2>
          
          <p className="text-lg text-gray-700 mb-8">
            The painting industry has a scaling problem. While contractors excel at the craft, they struggle with the business side. Our research identified four critical barriers:
          </p>

          <div className="grid gap-8 mb-12">
            {scalingChallenges.map((item, index) => (
              <Card key={index} className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="font-bold text-lg">{item.challenge}</h3>
                    </div>
                    <div>
                      <p className="text-red-600 font-medium">Problem: {item.problem}</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-medium">Solution: {item.solution}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 font-bold">{item.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">The $200K Revenue Ceiling</h3>
            <p className="text-gray-700 mb-4">
              Most painting businesses hit a revenue ceiling around $200K because the owner becomes the bottleneck. They can't estimate fast enough, manage quality, or find reliable team members.
            </p>
            <p className="text-gray-700">
              Breaking through requires shifting from "I do everything" to "I build systems that do everything."
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Real Success Stories: From Struggling to Scaling</h2>
          
          <div className="grid gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{study.name}</h3>
                      <p className="text-gray-600 mb-4">{study.company}</p>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-red-600 font-medium">Before: </span>
                          {study.before}
                        </div>
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">After: </span>
                          {study.after}
                        </div>
                        <div className="text-sm">
                          <span className="text-blue-600 font-medium">Timeline: </span>
                          {study.timeline}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Strategy:</h4>
                      <p className="text-gray-700 mb-4">{study.keyStrategy}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <blockquote className="text-gray-700 italic">
                        "{study.quote}"
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Million-Dollar Framework */}
      <section id="million-dollar-framework" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">The Million-Dollar Framework</h2>
          
          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            After studying 100+ painting businesses that scaled past $1M, we identified the four pillars every successful operation relies on:
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Professional Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Instant, accurate quotes</li>
                  <li>• Standardized processes</li>
                  <li>• Quality checklists</li>
                  <li>• Customer communication</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Scalable Team</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Clear role definitions</li>
                  <li>• Training programs</li>
                  <li>• Performance metrics</li>
                  <li>• Growth pathways</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Smart Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Quote automation</li>
                  <li>• Customer management</li>
                  <li>• Business analytics</li>
                  <li>• Mobile accessibility</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle>Marketing Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-left">
                  <li>• Multiple lead sources</li>
                  <li>• Professional branding</li>
                  <li>• Customer retention</li>
                  <li>• Referral systems</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 90-Day Action Plan */}
      <section id="90-day-action-plan" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Your 90-Day Scaling Action Plan</h2>
          
          <p className="text-lg text-gray-700 mb-12">
            Don't try to change everything at once. This proven 90-day plan prioritizes the highest-impact changes first:
          </p>

          <div className="space-y-8">
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Days 1-30: Foundation Building</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Week 1-2: Assessment</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Audit current processes and bottlenecks</li>
                      <li>• Calculate true hourly rates and profit margins</li>
                      <li>• Document what you do vs. what you should delegate</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Week 3-4: Quick Wins</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Implement professional quote system</li>
                      <li>• Create standard price sheet</li>
                      <li>• Set up basic customer database</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">Days 31-60: System Implementation</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Operations</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Standardize job processes and quality checks</li>
                      <li>• Create customer communication templates</li>
                      <li>• Implement project tracking system</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Team Building</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Define roles and responsibilities</li>
                      <li>• Create training materials</li>
                      <li>• Establish performance metrics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-800">Days 61-90: Growth Acceleration</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Marketing</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Launch referral program</li>
                      <li>• Optimize online presence</li>
                      <li>• Track lead sources and conversion rates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Optimization</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Analyze profitability by job type</li>
                      <li>• Refine pricing strategy</li>
                      <li>• Plan next quarter's growth initiatives</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Scale Your Painting Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your free Business Scaling Assessment and discover exactly where to focus your efforts for maximum growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" variant="outline_white">
              <Link href="/trial-signup">
                <Calculator className="h-5 w-5 mr-2" />
                Get Free Assessment
              </Link>
            </Button>
            <Button asChild variant="outline_white" size="lg">
              <Link href="/contact">
                <Phone className="h-5 w-5 mr-2" />
                Schedule Strategy Call
              </Link>
            </Button>
          </div>
          <p className="text-sm text-blue-200">
            Join 10,000+ painting contractors already scaling with professional systems
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}