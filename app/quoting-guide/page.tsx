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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-200">
              Based on 250,000+ Successful Quotes
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional Painting Quote Guide for Contractors
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Professional painting quote guide reveals the exact strategies top contractors use to 
              close 60%+ of estimates. Learn proven formulas, templates, and techniques.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="#guide-chapters">
                  Read Free Guide Now
                  <BookOpen className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/painting-quote-templates-free">
                  Get Free Templates
                  <FileText className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-green-500" />
                5,000+ contractors trained
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                140% average close rate increase
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-green-500" />
                45-minute read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Results from Following This Painting Quote Guide
            </h2>
            <p className="text-xl text-gray-600">
              Average improvements contractors see after implementing our strategies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successMetrics.map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-600">
                    {item.metric}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 line-through mb-1">{item.before}</div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{item.after}</div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {item.improvement}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              5 Costly Painting Quote Mistakes to Avoid
            </h2>
            <p className="text-xl text-gray-600">
              These mistakes cost the average contractor $40,000+ per year
            </p>
          </div>
          
          <div className="space-y-6">
            {commonMistakes.map((item, index) => (
              <Alert key={index} className={`border-l-4 ${
                item.severity === 'critical' ? 'border-red-500' : 
                item.severity === 'high' ? 'border-orange-500' : 'border-yellow-500'
              }`}>
                <AlertCircle className="w-5 h-5" />
                <AlertDescription>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        Mistake #{index + 1}: {item.mistake}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">Impact: {item.impact}</p>
                      <p className="text-sm font-medium text-blue-600">
                        ✓ Solution: {item.solution}
                      </p>
                    </div>
                    <Badge variant="outline" className={`self-start ${
                      item.severity === 'critical' ? 'text-red-600 border-red-200' : 
                      item.severity === 'high' ? 'text-orange-600 border-orange-200' : 
                      'text-yellow-600 border-yellow-200'
                    }`}>
                      {item.severity.toUpperCase()}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </section>

      {/* Guide Chapters */}
      <section id="guide-chapters" className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Painting Quote Guide Chapters
            </h2>
            <p className="text-xl text-gray-600">
              Master the art and science of professional painting quotes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guideChapters.map((chapter, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl font-bold text-blue-100">{chapter.number}</span>
                    <Badge variant="outline">{chapter.readTime} read</Badge>
                  </div>
                  <CardTitle className="text-xl">{chapter.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {chapter.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`#chapter-${index + 1}`}>
                      Read Chapter {chapter.number}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Tips */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Lightbulb className="w-12 h-12 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expert Painting Quote Tips
            </h2>
            <p className="text-xl text-gray-600">
              Insider strategies from top-performing contractors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {expertTips.map((category, index) => (
              <Card key={index} className="border-t-4 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{tip}</span>
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Professional Painting Quote Formula
            </h2>
            <p className="text-xl text-gray-600">
              Used by 5,000+ successful contractors
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <h3 className="text-2xl font-bold text-center">The P.R.I.C.E. Formula</h3>
            </div>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    P
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Prepare Thoroughly</h4>
                    <p className="text-gray-600">Measure accurately, photograph everything, understand the scope completely</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    R
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Respond Quickly</h4>
                    <p className="text-gray-600">Deliver quotes within 24 hours while customer interest is highest</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    I
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Include Everything</h4>
                    <p className="text-gray-600">Materials, labor, prep work, cleanup - leave nothing to assumption</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    C
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Communicate Value</h4>
                    <p className="text-gray-600">Focus on benefits, quality, and peace of mind - not just price</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    E
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Execute Follow-Up</h4>
                    <p className="text-gray-600">Systematic 3-touch follow-up increases close rates by 40%</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
                <p className="text-lg font-semibold text-blue-900 mb-3">
                  Contractors using the P.R.I.C.E. formula report:
                </p>
                <div className="flex justify-center gap-8">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">2.4x</div>
                    <div className="text-sm text-gray-600">Higher close rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">50%</div>
                    <div className="text-sm text-gray-600">Larger job sizes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">90%</div>
                    <div className="text-sm text-gray-600">Customer satisfaction</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resources CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Free Resources for Professional Painting Quotes
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create winning estimates
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Free Quote Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create accurate estimates in 60 seconds with our professional calculator
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/free-calculator">
                    Try Calculator
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-shadow border-blue-200 bg-blue-50">
              <CardHeader>
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Quote Templates</CardTitle>
                <Badge className="mt-2 bg-blue-600 text-white">Most Popular</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Professional templates that have generated $125M+ in accepted quotes
                </p>
                <Button className="w-full" asChild>
                  <Link href="/painting-quote-templates-free">
                    Get Templates
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>ROI Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  See how much more you could earn with better quoting practices
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/roi-calculator">
                    Calculate ROI
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master Professional Painting Quotes?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 5,000+ contractors who transformed their business with better quoting. 
            Start with our free guide and tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/painting-quote-templates-free">
                Download Templates
                <FileText className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}