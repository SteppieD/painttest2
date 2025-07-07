import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, CheckCircle, Clock, DollarSign, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/shared/footer';

export const metadata: Metadata = {
  title: 'How to Quote Painting Jobs: Complete Guide for Contractors | ProPaint',
  description: 'Learn how to create accurate painting quotes that win jobs. Step-by-step guide covering estimation, pricing, and professional quoting best practices for painters.',
  keywords: 'how to quote painting jobs, how to quote for painting, painting estimate guide, painting contractor pricing, how to write painting quotes',
  alternates: {
    canonical: '/how-to-quote-painting-jobs'
  }
};

export default function HowToQuotePaintingJobsPage() {
  const steps = [
    {
      number: "1",
      title: "Site Assessment",
      description: "Conduct thorough on-site evaluation of surfaces, conditions, and requirements",
      details: ["Measure all surfaces accurately", "Assess surface conditions", "Note prep work needed", "Identify access challenges"]
    },
    {
      number: "2", 
      title: "Calculate Materials",
      description: "Determine exact paint and supply quantities needed for the project",
      details: ["Calculate square footage", "Determine paint coverage", "Account for primer needs", "List all supplies required"]
    },
    {
      number: "3",
      title: "Estimate Labor",
      description: "Factor in all labor components including prep, painting, and cleanup",
      details: ["Surface preparation time", "Painting application time", "Cleanup and touch-ups", "Travel and setup time"]
    },
    {
      number: "4",
      title: "Add Overhead & Profit",
      description: "Include business expenses and desired profit margin",
      details: ["Insurance and licensing", "Equipment depreciation", "Business overhead", "Desired profit margin"]
    }
  ];

  const commonMistakes = [
    {
      icon: AlertTriangle,
      title: "Underestimating Prep Work",
      description: "Failing to account for surface preparation can destroy profit margins"
    },
    {
      icon: Clock,
      title: "Unrealistic Timelines", 
      description: "Promising impossible deadlines leads to rushed work and unhappy clients"
    },
    {
      icon: DollarSign,
      title: "Forgetting Hidden Costs",
      description: "Not including permits, parking, or disposal fees in your estimates"
    }
  ];

  const pricingFactors = [
    "Surface type and condition",
    "Paint quality and brand",
    "Number of coats required",
    "Prep work complexity",
    "Project accessibility",
    "Local labor rates",
    "Seasonal demand",
    "Competition in area"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How to Quote Painting Jobs Like a Pro
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Master the art of accurate painting estimates that win jobs and maintain profits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/access-code">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Try Our Quote Calculator
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/painting-quote-templates">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3">
                  Get Quote Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              4 Steps to Accurate Painting Quotes
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Follow this proven process to create detailed, competitive quotes that win jobs and protect your profit margins
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="bg-purple-600 text-white p-8 lg:w-1/3">
                    <div className="text-4xl font-bold mb-4">Step {step.number}</div>
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-purple-100">{step.description}</p>
                  </div>
                  <div className="p-8 lg:w-2/3">
                    <h4 className="text-xl font-semibold mb-4 text-gray-900">Key Activities:</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Factors */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Key Factors That Affect Painting Prices
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Understanding these factors helps you create more accurate estimates and explain pricing to clients.
              </p>
              <ul className="space-y-3">
                {pricingFactors.map((factor, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-purple-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Tip: Use Technology</h3>
              <p className="text-gray-600 mb-6">
                Modern painting estimate calculators can help you factor in all these variables automatically, 
                ensuring you don't miss important cost components.
              </p>
              <Link href="/access-code">
                <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700">
                  Try Our Calculator
                  <Calculator className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Quoting Mistakes to Avoid
            </h2>
            <p className="text-lg text-gray-600">
              Learn from these frequent errors that can cost you jobs or profits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {commonMistakes.map((mistake, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-red-200">
                <CardHeader>
                  <mistake.icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <CardTitle className="text-xl text-red-700">{mistake.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{mistake.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Detailed Painting Estimate Calculations
            </h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Surface Area Calculations</h3>
            <p className="text-gray-600 mb-6">
              Accurate measurements are the foundation of good quotes. For interior rooms, measure each wall 
              separately and subtract window and door areas. For exteriors, include all paintable surfaces 
              like siding, trim, doors, and shutters.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h4 className="text-xl font-semibold mb-3">Quick Calculation Formula:</h4>
              <div className="font-mono text-sm bg-white p-4 rounded border">
                <div>Wall Area = (Length × Height) - (Doors + Windows)</div>
                <div>Ceiling Area = Length × Width</div>
                <div>Total Paintable Area = Walls + Ceiling + Trim</div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Material Cost Estimation</h3>
            <p className="text-gray-600 mb-4">
              Paint coverage varies by surface type and paint quality. Standard coverage is approximately 
              350-400 square feet per gallon, but porous or textured surfaces may require more. Always 
              add 10-15% extra for touch-ups and waste.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Labor Time Calculations</h3>
            <p className="text-gray-600 mb-4">
              Labor estimates should include all phases of work:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Surface preparation (cleaning, sanding, priming)</li>
              <li>Paint application (multiple coats as needed)</li>
              <li>Detail work (cutting in, trim painting)</li>
              <li>Cleanup and final inspection</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Quote Presentation</h3>
            <p className="text-gray-600 mb-4">
              Your quote should be detailed but easy to understand. Include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Clear scope of work description</li>
              <li>Itemized material and labor costs</li>
              <li>Project timeline with start/completion dates</li>
              <li>Payment terms and schedule</li>
              <li>Warranty information</li>
              <li>Professional company branding</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Creating Professional Quotes Today</h2>
          <p className="text-xl text-purple-100 mb-8">
            Use our tools and templates to streamline your quoting process and win more jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/access-code">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                Try Quote Calculator
                <Calculator className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/painting-quote-templates">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3">
                Download Templates
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}