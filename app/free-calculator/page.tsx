import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  DollarSign, 
  Home, 
  Paintbrush, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  BarChart3,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';

export const metadata: Metadata = {
  title: 'Free Painting Estimate Calculator - Instant Paint Quote Pricing | ProPaint Quote',
  description: 'Free painting estimate calculator for professional contractors. Get instant, accurate paint quotes in 60 seconds. Calculate interior and exterior painting costs with our free estimating tool.',
  keywords: 'free painting estimate calculator, paint quote calculator, painting cost calculator, free painting estimator, instant paint estimates, painting pricing calculator, contractor estimating tool',
  alternates: {
    canonical: '/free-calculator',
  },
  openGraph: {
    title: 'Free Painting Estimate Calculator - Instant Professional Quotes',
    description: 'Free painting estimate calculator saves contractors hours. Create accurate quotes in 60 seconds. Join 5,000+ painters using our free estimating tool.',
    url: '/free-calculator',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function FreeCalculatorPage() {
  // Calculator features data
  const calculatorFeatures = [
    {
      icon: Clock,
      title: "60-Second Quotes",
      description: "Create professional estimates in under a minute",
      highlight: "Save 3+ hours per quote"
    },
    {
      icon: DollarSign,
      title: "Accurate Pricing",
      description: "Industry-standard formulas with 95% accuracy",
      highlight: "Never underbid again"
    },
    {
      icon: Paintbrush,
      title: "All Paint Types",
      description: "Interior, exterior, specialty coatings included",
      highlight: "50,000+ paint database"
    },
    {
      icon: TrendingUp,
      title: "Smart Markups",
      description: "Automatic profit margins and labor costs",
      highlight: "Increase profits 25%"
    }
  ];

  // Comparison table data
  const comparisonData = [
    { feature: "Quote Creation Time", traditional: "3-4 hours", withCalculator: "60 seconds", improvement: "99% faster" },
    { feature: "Pricing Accuracy", traditional: "70-80%", withCalculator: "95%+", improvement: "25% more accurate" },
    { feature: "Professional Appearance", traditional: "Basic spreadsheet", withCalculator: "Branded PDF", improvement: "Win more jobs" },
    { feature: "Material Calculations", traditional: "Manual math", withCalculator: "Automatic", improvement: "Zero errors" },
    { feature: "Labor Estimates", traditional: "Guesswork", withCalculator: "Data-driven", improvement: "Consistent pricing" },
    { feature: "Monthly Quotes Created", traditional: "15-20", withCalculator: "50+", improvement: "3x more quotes" }
  ];

  // Calculator types
  const calculatorTypes = [
    {
      title: "Interior Painting Calculator",
      description: "Room-by-room interior estimates",
      features: ["Walls & ceilings", "Trim & doors", "Cabinet painting", "Texture work"],
      link: "/interior-painting-quote-calculator",
      icon: Home,
      color: "text-blue-600"
    },
    {
      title: "Exterior Painting Calculator", 
      description: "Complete exterior house quotes",
      features: ["Siding estimates", "Trim & shutters", "Deck staining", "Pressure washing"],
      link: "/exterior-painting-estimate-calculator",
      icon: Home,
      color: "text-green-600"
    },
    {
      title: "Complete House Calculator",
      description: "Full interior + exterior pricing",
      features: ["Whole house quotes", "Multi-room discounts", "Bundle pricing", "Project timeline"],
      link: "/house-painting-cost-calculator",
      icon: Home,
      color: "text-purple-600"
    }
  ];

  // Success metrics
  const successMetrics = [
    { number: "5,000+", label: "Active Contractors", icon: Users },
    { number: "250,000+", label: "Quotes Created", icon: Calculator },
    { number: "$125M+", label: "Quote Value Generated", icon: DollarSign },
    { number: "4.9/5", label: "User Rating", icon: Star }
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Badge>
              100% FREE - No Credit Card Required
            </Badge>
            <h1>
              Free Painting Estimate Calculator for Professional Contractors
            </h1>
            <p>
              Free painting estimate calculator creates instant, accurate quotes in 60 seconds. 
              Join 5,000+ contractors saving hours on every estimate with our professional calculator.
            </p>
            
            <div>
              <Button size="lg" asChild>
                <Link href="/painting-estimate-calculator-free">
                  Start Free Calculator Now
                  <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">
                  Watch 2-Min Demo
                </Link>
              </Button>
            </div>
            
            <div>
              <span>
                <CheckCircle />
                No signup required
              </span>
              <span>
                <CheckCircle />
                Works on all devices
              </span>
              <span>
                <CheckCircle />
                Professional PDFs
              </span>
            </div>
          </div>
          
          {/* Success Metrics */}
          <div>
            {successMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index}>
                  <Icon />
                  <div>{metric.number}</div>
                  <div>{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator Features */}
      <section>
        <div>
          <div>
            <h2>
              Why Contractors Love Our Free Painting Calculator
            </h2>
            <p>
              Professional painting estimate calculator designed by contractors, for contractors
            </p>
          </div>
          
          <div>
            {calculatorFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div>
                      <Icon />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                    <Badge variant="secondary">
                      {feature.highlight}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section>
        <div>
          <div>
            <h2>
              Free Calculator vs. Traditional Estimating
            </h2>
            <p>
              See why 5,000+ contractors switched to our free painting calculator
            </p>
          </div>
          
          <Card>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Traditional Method</th>
                    <th>With Free Calculator</th>
                    <th>Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.feature}</td>
                      <td>{row.traditional}</td>
                      <td>{row.withCalculator}</td>
                      <td>
                        <Badge variant="outline">
                          {row.improvement}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Calculator Types */}
      <section>
        <div>
          <div>
            <h2>
              Choose Your Free Painting Calculator
            </h2>
            <p>
              Specialized calculators for every painting project type
            </p>
          </div>
          
          <div>
            {calculatorTypes.map((calc, index) => {
              const Icon = calc.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div mb-4`}>
                      <Icon />
                    </div>
                    <CardTitle>{calc.title}</CardTitle>
                    <p>{calc.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {calc.features.map((feature, idx) => (
                        <li key={idx}>
                          <CheckCircle />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <Link href={calc.link}>
                        Try {calc.title.split(' ')[0]} Calculator
                        <ArrowRight />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div>
          <div>
            <h2>
              How the Free Painting Calculator Works
            </h2>
            <p>
              Create professional painting estimates in 3 simple steps
            </p>
          </div>
          
          <div>
            {[
              {
                step: 1,
                title: "Enter Project Details",
                description: "Input room dimensions, surface types, and paint preferences",
                time: "20 seconds",
                items: ["Room measurements", "Wall/ceiling surfaces", "Paint quality level", "Prep work needed"]
              },
              {
                step: 2,
                title: "Review Instant Calculations",
                description: "Our calculator automatically calculates materials and labor",
                time: "Instant",
                items: ["Paint gallons needed", "Labor hours estimate", "Material costs", "Prep work pricing"]
              },
              {
                step: 3,
                title: "Generate Professional Quote",
                description: "Download a branded PDF quote ready for customers",
                time: "10 seconds",
                items: ["Professional formatting", "Your logo & branding", "Detailed breakdown", "Terms & conditions"]
              }
            ].map((step, index) => (
              <div key={index}>
                <div>
                  <div>
                    {step.step}
                  </div>
                </div>
                <div>
                  <div>
                    <h3>{step.title}</h3>
                    <Badge variant="outline">
                      {step.time}
                    </Badge>
                  </div>
                  <p>{step.description}</p>
                  <div>
                    {step.items.map((item, idx) => (
                      <div key={idx}>
                        <CheckCircle />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div>
          <div>
            <h2>
              Free Painting Calculator FAQ
            </h2>
            <p>
              Common questions about our free estimating tool
            </p>
          </div>
          
          <div>
            {[
              {
                q: "Is the painting calculator really free?",
                a: "Yes! Our basic calculator is 100% free forever. No credit card required, no hidden fees. You can create up to 10 quotes per month at no cost."
              },
              {
                q: "How accurate is the free painting calculator?",
                a: "Our calculator uses industry-standard formulas and data from 5,000+ contractors, achieving 95% accuracy. It factors in paint coverage, labor rates, and regional pricing."
              },
              {
                q: "What's included in the free calculator?",
                a: "Free users get instant calculations, PDF quote generation, basic templates, all paint types, material estimates, and labor calculations. Perfect for small contractors."
              },
              {
                q: "Can I customize quotes from the calculator?",
                a: "Yes! You can adjust prices, add line items, include your logo, and modify any calculations. The calculator provides a professional starting point you can customize."
              },
              {
                q: "Do I need to download software?",
                a: "No downloads needed. Our free painting calculator works in any web browser on computers, tablets, and phones. Access it anywhere with internet."
              },
              {
                q: "How do I upgrade for more features?",
                a: "Love the free calculator? Upgrade to Professional ($79/month) for unlimited quotes, advanced features, customer management, and priority support."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Start Using the Free Painting Calculator Today
          </h2>
          <p>
            Join 5,000+ painting contractors creating faster, more accurate quotes. 
            No credit card required - start calculating in seconds.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/painting-estimate-calculator-free">
                Launch Free Calculator
                <Calculator />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">
                View Pro Features
                <ArrowRight />
              </Link>
            </Button>
          </div>
          
          <div>
            <span>
              <Shield />
              No credit card required
            </span>
            <span>
              <Users />
              5,000+ contractors trust us
            </span>
            <span>
              <BarChart3 />
              250,000+ quotes created
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}