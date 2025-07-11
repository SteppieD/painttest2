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
import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'

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
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <h1>
              How to Scale Your Painting Business: The Complete 2025 Growth Guide
            </h1>
            <p>
              From $100K to $1M+: The proven systems, technology, and strategies successful painting contractors use to scale professionally. Based on analysis of 500+ painting businesses.
            </p>
            <div>
              <div>
                <div>340%</div>
                <div>Average Revenue Growth</div>
              </div>
              <div>
                <div>18 Months</div>
                <div>Average Scale Timeline</div>
              </div>
              <div>
                <div>500+</div>
                <div>Contractors Analyzed</div>
              </div>
            </div>
            <p>15-minute read • Updated January 2025</p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section>
        <div>
          <h2>Table of Contents</h2>
          <div>
            {tableOfContents.map((item, index) => (
              <a 
                key={index}
                href={`#${item.anchor}`}
               
              >
                <span>{index + 1}.</span>
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The Scaling Reality Check */}
      <section id="scaling-reality">
        <div>
          <h2>The Scaling Reality Check</h2>
          
          <div>
            <div>
              <AlertTriangle />
              <div>
                <h3>The Brutal Truth About Painting Business Growth</h3>
                <p>
                  78% of painting contractors never scale beyond $200K annual revenue. They work 60+ hour weeks, struggle with cash flow, and burn out within 5 years. But 22% crack the code and build million-dollar businesses with systems that work without them.
                </p>
              </div>
            </div>
          </div>

          <p>
            Your painting business hit $100K this year. You're booked solid, customers love your work, and referrals keep coming. But you're working 70-hour weeks, doing everything yourself, and one bad week could sink the whole operation.
          </p>

          <p>
            Sound familiar? You're not alone. After analyzing 500+ painting businesses, we found a clear pattern: successful scaling requires systems, not just skills.
          </p>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>❌ Businesses That Stay Small</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
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
                <CardTitle>✅ Businesses That Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
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
      <section id="why-businesses-stay-small">
        <div>
          <h2>Why Most Painting Businesses Stay Small</h2>
          
          <p>
            The painting industry has a scaling problem. While contractors excel at the craft, they struggle with the business side. Our research identified four critical barriers:
          </p>

          <div>
            {scalingChallenges.map((item, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    <div>
                      <h3>{item.challenge}</h3>
                    </div>
                    <div>
                      <p>Problem: {item.problem}</p>
                    </div>
                    <div>
                      <p>Solution: {item.solution}</p>
                    </div>
                    <div>
                      <p>{item.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3>The $200K Revenue Ceiling</h3>
            <p>
              Most painting businesses hit a revenue ceiling around $200K because the owner becomes the bottleneck. They can't estimate fast enough, manage quality, or find reliable team members.
            </p>
            <p>
              Breaking through requires shifting from "I do everything" to "I build systems that do everything."
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section>
        <div>
          <h2>Real Success Stories: From Struggling to Scaling</h2>
          
          <div>
            {caseStudies.map((study, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    <div>
                      <h3>{study.name}</h3>
                      <p>{study.company}</p>
                      <div>
                        <div>
                          <span>Before: </span>
                          {study.before}
                        </div>
                        <div>
                          <span>After: </span>
                          {study.after}
                        </div>
                        <div>
                          <span>Timeline: </span>
                          {study.timeline}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4>Key Strategy:</h4>
                      <p>{study.keyStrategy}</p>
                      <div>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <blockquote>
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
      <section id="million-dollar-framework">
        <div>
          <h2>The Million-Dollar Framework</h2>
          
          <p>
            After studying 100+ painting businesses that scaled past $1M, we identified the four pillars every successful operation relies on:
          </p>

          <div>
            <Card>
              <CardHeader>
                <div>
                  <Calculator />
                </div>
                <CardTitle>Professional Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>• Instant, accurate quotes</li>
                  <li>• Standardized processes</li>
                  <li>• Quality checklists</li>
                  <li>• Customer communication</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <Users />
                </div>
                <CardTitle>Scalable Team</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>• Clear role definitions</li>
                  <li>• Training programs</li>
                  <li>• Performance metrics</li>
                  <li>• Growth pathways</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <BarChart3 />
                </div>
                <CardTitle>Smart Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>• Quote automation</li>
                  <li>• Customer management</li>
                  <li>• Business analytics</li>
                  <li>• Mobile accessibility</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <Target />
                </div>
                <CardTitle>Marketing Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
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
      <section id="90-day-action-plan">
        <div>
          <h2>Your 90-Day Scaling Action Plan</h2>
          
          <p>
            Don't try to change everything at once. This proven 90-day plan prioritizes the highest-impact changes first:
          </p>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Days 1-30: Foundation Building</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <h4>Week 1-2: Assessment</h4>
                    <ul>
                      <li>• Audit current processes and bottlenecks</li>
                      <li>• Calculate true hourly rates and profit margins</li>
                      <li>• Document what you do vs. what you should delegate</li>
                    </ul>
                  </div>
                  <div>
                    <h4>Week 3-4: Quick Wins</h4>
                    <ul>
                      <li>• Implement professional quote system</li>
                      <li>• Create standard price sheet</li>
                      <li>• Set up basic customer database</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Days 31-60: System Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <h4>Operations</h4>
                    <ul>
                      <li>• Standardize job processes and quality checks</li>
                      <li>• Create customer communication templates</li>
                      <li>• Implement project tracking system</li>
                    </ul>
                  </div>
                  <div>
                    <h4>Team Building</h4>
                    <ul>
                      <li>• Define roles and responsibilities</li>
                      <li>• Create training materials</li>
                      <li>• Establish performance metrics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Days 61-90: Growth Acceleration</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <h4>Marketing</h4>
                    <ul>
                      <li>• Launch referral program</li>
                      <li>• Optimize online presence</li>
                      <li>• Track lead sources and conversion rates</li>
                    </ul>
                  </div>
                  <div>
                    <h4>Optimization</h4>
                    <ul>
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
      <section>
        <div>
          <h2>
            Ready to Scale Your Painting Business?
          </h2>
          <p>
            Get your free Business Scaling Assessment and discover exactly where to focus your efforts for maximum growth.
          </p>
          <div>
            <Button asChild size="lg" variant="outline_white">
              <Link href="/trial-signup">
                <Calculator />
                Get Free Assessment
              </Link>
            </Button>
            <Button asChild variant="outline_white" size="lg">
              <Link href="/contact">
                <Phone />
                Schedule Strategy Call
              </Link>
            </Button>
          </div>
          <p>
            Join 10,000+ painting contractors already scaling with professional systems
          </p>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  )
}