import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Calculator,
  FileText,
  Users,
  Target,
  Lightbulb,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';

export const metadata: Metadata = {
  title: 'Professional Painting Quote Guide - Expert Strategies for Contractors | ProPaint Quote',
  description: 'Professional painting quote guide teaches expert strategies to win more jobs. Learn pricing formulas, customer psychology, and proven techniques from 5,000+ successful contractors.',
  keywords: 'professional painting quote guide, painting estimate strategies, contractor quoting guide, painting pricing guide, quote writing tips, painting estimate guide, contractor pricing strategies',
  alternates: {
    canonical: '/quoting-guide',
  },
  openGraph: {
    title: 'Professional Painting Quote Guide - Win More Jobs with Expert Strategies',
    description: 'Professional painting quote guide reveals the strategies top contractors use to close 60%+ of quotes. Free guide with proven templates and formulas.',
    url: '/quoting-guide',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function QuotingGuidePage() {
  // Guide chapters
  const guideChapters = [
    {
      number: "01",
      title: "Understanding Your True Costs",
      topics: ["Calculate real labor costs", "Factor in overhead properly", "Account for profit margins", "Hidden cost traps to avoid"],
      readTime: "8 min"
    },
    {
      number: "02", 
      title: "Professional Quote Presentation",
      topics: ["Psychology of pricing display", "Visual hierarchy that converts", "Professional formatting tips", "Digital vs. paper quotes"],
      readTime: "10 min"
    },
    {
      number: "03",
      title: "Pricing Strategies That Win",
      topics: ["Good-better-best options", "Bundle pricing techniques", "Psychological pricing tricks", "Competitive positioning"],
      readTime: "12 min"
    },
    {
      number: "04",
      title: "Customer Communication",
      topics: ["Pre-quote conversations", "Presenting your quote", "Handling objections", "Follow-up sequences"],
      readTime: "15 min"
    },
    {
      number: "05",
      title: "Closing Techniques",
      topics: ["Creating urgency ethically", "Value-based selling", "Overcoming price objections", "Getting signatures faster"],
      readTime: "10 min"
    }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: "Underpricing to Win Jobs",
      impact: "Lost $15,000+ annually",
      solution: "Use proper markup formulas (Labor × 2.5 minimum)",
      severity: "critical"
    },
    {
      mistake: "Slow Quote Delivery", 
      impact: "40% lower close rate",
      solution: "Deliver quotes within 24 hours while interest is high",
      severity: "high"
    },
    {
      mistake: "No Follow-Up System",
      impact: "Missing 30% of sales",
      solution: "Automated 3-touch follow-up sequence",
      severity: "high"
    },
    {
      mistake: "Poor Quote Presentation",
      impact: "20% lower perceived value",
      solution: "Professional PDF with photos and details",
      severity: "medium"
    },
    {
      mistake: "Single Price Option",
      impact: "Lower average job value",
      solution: "Always present 3 options (good-better-best)",
      severity: "medium"
    }
  ];

  // Success metrics
  const successMetrics = [
    { metric: "Average Close Rate", before: "25%", after: "60%", improvement: "+140%" },
    { metric: "Quote Delivery Time", before: "3-5 days", after: "Same day", improvement: "5x faster" },
    { metric: "Average Job Value", before: "$2,800", after: "$4,200", improvement: "+50%" },
    { metric: "Customer Satisfaction", before: "3.5/5", after: "4.8/5", improvement: "+37%" }
  ];

  // Expert tips
  const expertTips = [
    {
      category: "Pricing Psychology",
      tips: [
        "Always end prices with 7 or 9 (e.g., $2,497 not $2,500)",
        "Show original price crossed out with 'special' price",
        "Bundle small items to increase perceived value",
        "Use 'investment' instead of 'cost' in conversations"
      ]
    },
    {
      category: "Quote Structure",
      tips: [
        "Lead with benefits, not features",
        "Include 3-5 high-quality project photos",
        "Break down pricing into understandable sections",
        "Always include a clear call-to-action"
      ]
    },
    {
      category: "Winning Follow-Up",
      tips: [
        "First follow-up within 24 hours",
        "Reference specific project details discussed",
        "Offer limited-time incentive (ethically)",
        "Ask for the sale directly - don't hint"
      ]
    }
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Badge>
              Based on 250,000+ Successful Quotes
            </Badge>
            <h1>
              Professional Painting Quote Guide for Contractors
            </h1>
            <p>
              Professional painting quote guide reveals the exact strategies top contractors use to 
              close 60%+ of estimates. Learn proven formulas, templates, and techniques.
            </p>
            
            <div>
              <Button size="lg" asChild>
                <Link href="#guide-chapters">
                  Read Free Guide Now
                  <BookOpen />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/painting-quote-templates-free">
                  Get Free Templates
                  <FileText />
                </Link>
              </Button>
            </div>
            
            <div>
              <span>
                <Users />
                5,000+ contractors trained
              </span>
              <span>
                <TrendingUp />
                140% average close rate increase
              </span>
              <span>
                <Clock />
                45-minute read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section>
        <div>
          <div>
            <h2>
              Results from Following This Painting Quote Guide
            </h2>
            <p>
              Average improvements contractors see after implementing our strategies
            </p>
          </div>
          
          <div>
            {successMetrics.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    {item.metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>{item.before}</div>
                  <div>{item.after}</div>
                  <Badge>
                    {item.improvement}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section>
        <div>
          <div>
            <h2>
              5 Costly Painting Quote Mistakes to Avoid
            </h2>
            <p>
              These mistakes cost the average contractor $40,000+ per year
            </p>
          </div>
          
          <div>
            {commonMistakes.map((item, index) => (
              <Card key={index}`}>
                <CardContent>
                  <div>
                    <AlertCircle />
                    <div>
                      <div>
                        <div>
                          <h3>
                            Mistake #{index + 1}: {item.mistake}
                          </h3>
                          <p>Impact: {item.impact}</p>
                          <p>
                            ✓ Solution: {item.solution}
                          </p>
                        </div>
                        <Badge variant="outline"`}>
                          {item.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Chapters */}
      <section id="guide-chapters">
        <div>
          <div>
            <h2>
              Complete Painting Quote Guide Chapters
            </h2>
            <p>
              Master the art and science of professional painting quotes
            </p>
          </div>
          
          <div>
            {guideChapters.map((chapter, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    <span>{chapter.number}</span>
                    <Badge variant="outline">{chapter.readTime} read</Badge>
                  </div>
                  <CardTitle>{chapter.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {chapter.topics.map((topic, idx) => (
                      <li key={idx}>
                        <CheckCircle />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" asChild>
                    <Link href={`#chapter-${index + 1}`}>
                      Read Chapter {chapter.number}
                      <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Tips */}
      <section>
        <div>
          <div>
            <div>
              <Lightbulb />
            </div>
            <h2>
              Expert Painting Quote Tips
            </h2>
            <p>
              Insider strategies from top-performing contractors
            </p>
          </div>
          
          <div>
            {expertTips.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {category.tips.map((tip, idx) => (
                      <li key={idx}>
                        <Target />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Formula */}
      <section>
        <div>
          <div>
            <h2>
              The Professional Painting Quote Formula
            </h2>
            <p>
              Used by 5,000+ successful contractors
            </p>
          </div>
          
          <Card>
            <div>
              <h3>The P.R.I.C.E. Formula</h3>
            </div>
            <CardContent>
              <div>
                <div>
                  <div>
                    P
                  </div>
                  <div>
                    <h4>Prepare Thoroughly</h4>
                    <p>Measure accurately, photograph everything, understand the scope completely</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    R
                  </div>
                  <div>
                    <h4>Respond Quickly</h4>
                    <p>Deliver quotes within 24 hours while customer interest is highest</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    I
                  </div>
                  <div>
                    <h4>Include Everything</h4>
                    <p>Materials, labor, prep work, cleanup - leave nothing to assumption</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    C
                  </div>
                  <div>
                    <h4>Communicate Value</h4>
                    <p>Focus on benefits, quality, and peace of mind - not just price</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    E
                  </div>
                  <div>
                    <h4>Execute Follow-Up</h4>
                    <p>Systematic 3-touch follow-up increases close rates by 40%</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p>
                  Contractors using the P.R.I.C.E. formula report:
                </p>
                <div>
                  <div>
                    <div>2.4x</div>
                    <div>Higher close rate</div>
                  </div>
                  <div>
                    <div>50%</div>
                    <div>Larger job sizes</div>
                  </div>
                  <div>
                    <div>90%</div>
                    <div>Customer satisfaction</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources CTA */}
      <section>
        <div>
          <div>
            <h2>
              Free Resources for Professional Painting Quotes
            </h2>
            <p>
              Everything you need to create winning estimates
            </p>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <Calculator />
                <CardTitle>Free Quote Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Create accurate estimates in 60 seconds with our professional calculator
                </p>
                <Button variant="outline" asChild>
                  <Link href="/free-calculator">
                    Try Calculator
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <FileText />
                <CardTitle>Quote Templates</CardTitle>
                <Badge>Most Popular</Badge>
              </CardHeader>
              <CardContent>
                <p>
                  Professional templates that have generated $125M+ in accepted quotes
                </p>
                <Button asChild>
                  <Link href="/painting-quote-templates-free">
                    Get Templates
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp />
                <CardTitle>ROI Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  See how much more you could earn with better quoting practices
                </p>
                <Button variant="outline" asChild>
                  <Link href="/roi-calculator">
                    Calculate ROI
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div>
          <div>
            <div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} />
              ))}
            </div>
          </div>
          <h2>
            Ready to Master Professional Painting Quotes?
          </h2>
          <p>
            Join 5,000+ contractors who transformed their business with better quoting. 
            Start with our free guide and tools.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/painting-quote-templates-free">
                Download Templates
                <FileText />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}