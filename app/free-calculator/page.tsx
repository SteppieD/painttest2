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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1 text-sm font-semibold bg-green-100 text-green-800 border-green-200">
              100% FREE - No Credit Card Required
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Free Painting Estimate Calculator for Professional Contractors
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Free painting estimate calculator creates instant, accurate quotes in 60 seconds. 
              Join 5,000+ contractors saving hours on every estimate with our professional calculator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/painting-estimate-calculator-free">
                  Start Free Calculator Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/demo">
                  Watch 2-Min Demo
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No signup required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Works on all devices
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Professional PDFs
              </span>
            </div>
          </div>
          
          {/* Success Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {successMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900">{metric.number}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Contractors Love Our Free Painting Calculator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional painting estimate calculator designed by contractors, for contractors
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {calculatorFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Free Calculator vs. Traditional Estimating
            </h2>
            <p className="text-xl text-gray-600">
              See why 5,000+ contractors switched to our free painting calculator
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center p-4 font-semibold text-gray-600">Traditional Method</th>
                    <th className="text-center p-4 font-semibold text-blue-600">With Free Calculator</th>
                    <th className="text-center p-4 font-semibold text-green-600">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{row.feature}</td>
                      <td className="p-4 text-center text-gray-600">{row.traditional}</td>
                      <td className="p-4 text-center font-semibold text-blue-600">{row.withCalculator}</td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Free Painting Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Specialized calculators for every painting project type
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {calculatorTypes.map((calc, index) => {
              const Icon = calc.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${calc.color} mb-4`}>
                      <Icon className="w-full h-full" />
                    </div>
                    <CardTitle className="text-xl">{calc.title}</CardTitle>
                    <p className="text-gray-600">{calc.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {calc.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={calc.link}>
                        Try {calc.title.split(' ')[0]} Calculator
                        <ArrowRight className="ml-2 w-4 h-4" />
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
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How the Free Painting Calculator Works
            </h2>
            <p className="text-xl text-gray-600">
              Create professional painting estimates in 3 simple steps
            </p>
          </div>
          
          <div className="space-y-8">
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
              <div key={index} className="flex gap-6 bg-white rounded-lg p-6 shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    <Badge variant="outline" className="text-sm">
                      {step.time}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {step.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Free Painting Calculator FAQ
            </h2>
            <p className="text-xl text-gray-600">
              Common questions about our free estimating tool
            </p>
          </div>
          
          <div className="space-y-6">
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
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Using the Free Painting Calculator Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 5,000+ painting contractors creating faster, more accurate quotes. 
            No credit card required - start calculating in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/painting-estimate-calculator-free">
                Launch Free Calculator
                <Calculator className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/pricing">
                View Pro Features
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              5,000+ contractors trust us
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              250,000+ quotes created
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}