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
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Painting Contractor Case Studies - Success Stories & Results',
  description: 'Painting contractor case studies showing real results. See how contractors increased revenue 156%, saved 10+ hours weekly, and transformed their painting businesses with our software.',
  keywords: 'painting contractor case studies, painting business success stories, contractor software results, painting business case study, painting contractor testimonials, painting software success, contractor growth stories',
  path: '/case-studies',
});

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
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Badge>
              Real Contractors, Real Results
            </Badge>
            <h1>
              Painting Contractor Case Studies & Success Stories
            </h1>
            <p>
              Painting contractor case studies showing how 5,000+ professionals transformed 
              their businesses. Real data, real growth, real success stories.
            </p>
            
            <div>
              <Button size="lg" asChild>
                <Link href="/trial-signup">
                  Start Your Success Story
                  <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#featured">
                  Read Case Studies
                  <FileText />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Aggregate Results Banner */}
      <section>
        <div>
          <div>
            <div>
              <div>78%</div>
              <div>Average Revenue Growth</div>
            </div>
            <div>
              <div>10+ hrs</div>
              <div>Saved Per Week</div>
            </div>
            <div>
              <div>2.4x</div>
              <div>More Quotes Won</div>
            </div>
            <div>
              <div>45%</div>
              <div>Higher Job Values</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section id="featured">
        <div>
          <div>
            <h2>
              Featured Painting Contractor Success Stories
            </h2>
            <p>
              In-depth case studies from contractors who transformed their businesses
            </p>
          </div>
          
          <div>
            {featuredCaseStudies.map((study, index) => (
              <Card key={index}>
                <div>
                  {/* Company Info */}
                  <div>
                    <div>
                      {study.avatar}
                    </div>
                    <h3>{study.contractor}</h3>
                    <p>{study.location}</p>
                    
                    <div>
                      <div>
                        <p>Established</p>
                        <p>{study.established}</p>
                      </div>
                      <div>
                        <p>Team Size</p>
                        <p>{study.teamSize}</p>
                      </div>
                      <div>
                        <p>Growth Timeline</p>
                        <p>{study.timeframe}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results & Challenge */}
                  <div>
                    <div>
                      <div>
                        <h4>The Challenge</h4>
                        <p>{study.challenge}</p>
                        
                        <h4>The Solution</h4>
                        <p>{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4>Revenue Growth</h4>
                        <div>
                          <div>
                            <span>Before:</span>
                            <span>{study.beforeRevenue}</span>
                          </div>
                          <div>
                            <span>After:</span>
                            <span>{study.afterRevenue}</span>
                          </div>
                        </div>
                        <div>
                          <div>{study.growth}</div>
                          <div>Revenue Increase</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4>Key Results</h4>
                      <div>
                        {study.keyResults.map((result, idx) => (
                          <div key={idx}>
                            <CheckCircle />
                            <span>{result}</span>
                          </div>
                        ))}
                      </div>
                      
                      <blockquote>
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
      <section>
        <div>
          <div>
            <h2>
              Quick Wins from Real Contractors
            </h2>
            <p>
              Immediate results contractors saw after switching to our software
            </p>
          </div>
          
          <div>
            {quickWins.map((win, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{win.company}</CardTitle>
                  <Badge variant="outline">{win.metric}</Badge>
                </CardHeader>
                <CardContent>
                  <p>{win.value}</p>
                  <p>{win.result}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Solved */}
      <section>
        <div>
          <div>
            <h2>
              Common Painting Business Challenges We Solve
            </h2>
            <p>
              See how our software addresses industry-wide problems
            </p>
          </div>
          
          <div>
            {challengesSolved.map((item, index) => (
              <Card key={index}>
                <div>
                  <div>
                    <h3>{item.challenge}</h3>
                  </div>
                  <div>
                    <p>Before</p>
                    <p>{item.before}</p>
                  </div>
                  <div>
                    <p>After</p>
                    <p>{item.after}</p>
                  </div>
                  <div>
                    <Badge>
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
      <section>
        <div>
          <div>
            <h2>
              Success Stories by Business Size
            </h2>
            <p>
              Our software scales with your painting business
            </p>
          </div>
          
          <div>
            {resultsBySize.map((size, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{size.size}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <p>{size.avgGrowth}</p>
                      <p>Average Growth</p>
                    </div>
                    <div>
                      <p>{size.timesSaved}</p>
                      <p>Time Saved</p>
                    </div>
                    <div>
                      <p>{size.keyBenefit}</p>
                      <p>"{size.example}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Formula */}
      <section>
        <div>
          <div>
            <h2>
              The Success Formula Our Case Studies Reveal
            </h2>
            <p>
              Common patterns from our most successful contractors
            </p>
          </div>
          
          <Card>
            <CardContent>
              <div>
                <div>
                  <div>
                    <div>
                      <Zap />
                    </div>
                    <h3>Week 1-2</h3>
                    <p>Quick Implementation</p>
                  </div>
                  <ul>
                    <li>
                      <CheckCircle />
                      <span>Set up in one afternoon</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>First mobile quote same day</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Team training in 2 hours</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div>
                    <div>
                      <Target />
                    </div>
                    <h3>Month 1-3</h3>
                    <p>Momentum Building</p>
                  </div>
                  <ul>
                    <li>
                      <CheckCircle />
                      <span>Quote volume doubles</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Close rate up 40%+</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>First record month</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div>
                    <div>
                      <Award />
                    </div>
                    <h3>Month 6+</h3>
                    <p>Transformation</p>
                  </div>
                  <ul>
                    <li>
                      <CheckCircle />
                      <span>50-150% revenue growth</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Expansion opportunities</span>
                    </li>
                    <li>
                      <CheckCircle />
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
      <section>
        <div>
          <h2>
            Ready to Write Your Success Story?
          </h2>
          <p>
            Join 5,000+ painting contractors who transformed their businesses. 
            Start your free trial and see results in your first week.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Your Transformation
                <TrendingUp />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">
                See How It Works
                <ArrowRight />
              </Link>
            </Button>
          </div>
          
          <div>
            <span>
              <CheckCircle />
              14-day free trial
            </span>
            <span>
              <CheckCircle />
              No credit card required
            </span>
            <span>
              <CheckCircle />
              Full support included
            </span>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}