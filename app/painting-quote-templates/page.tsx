import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Download, Eye, Star, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Free Painting Quote Templates - Professional Paint Job Estimates | ProPaint',
  description: 'Download free professional painting quote templates. Customizable templates for interior, exterior, and commercial painting estimates with detailed breakdowns.',
  keywords: 'painting quote template, painting quotation template, painting estimate template, painting quote sample, free painting quote template',
  alternates: {
    canonical: '/painting-quote-templates'
  }
};

export default function PaintingQuoteTemplatesPage() {
  const templates = [
    {
      title: "Interior Painting Quote Template",
      description: "Perfect for residential interior projects including rooms, hallways, and ceilings",
      features: ["Room-by-room breakdown", "Paint quality options", "Prep work details", "Timeline included"],
      popular: true
    },
    {
      title: "Exterior Painting Quote Template", 
      description: "Comprehensive template for siding, trim, doors, and exterior surfaces",
      features: ["Surface preparation", "Weather considerations", "Multi-coat systems", "Warranty terms"],
      popular: false
    },
    {
      title: "Commercial Painting Quote Template",
      description: "Professional template for office buildings, retail spaces, and commercial properties",
      features: ["Large area calculations", "Minimal disruption scheduling", "Safety compliance", "Professional finishes"],
      popular: false
    }
  ];

  const benefits = [
    "Professionally designed layouts",
    "Detailed cost breakdowns",
    "Customizable for your brand",
    "Legally compliant terms",
    "Multiple format options",
    "Instant download available"
  ];

  const sampleFields = [
    "Project scope and description",
    "Detailed material specifications",
    "Labor cost breakdown",
    "Surface preparation requirements",
    "Paint brand and quality level",
    "Project timeline and milestones",
    "Payment terms and schedule",
    "Warranty and guarantee details"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Painting Quote Templates
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Free downloadable templates that help you win more painting jobs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/access-code">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Create Custom Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/painting-estimate-calculator">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3">
                  Try Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Painting Quote Template
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional templates used by successful painting contractors nationwide. Customizable and ready to use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-shadow ${template.popular ? 'ring-2 ring-green-500' : ''}`}>
                {template.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                  <p className="text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {template.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    <Link href="/access-code">
                      <Button className="w-full">
                        Create Quote
                        <Eye className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 w-4 h-4" />
                      Download Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Use Professional Painting Quote Templates?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Professional quote templates help you present detailed, accurate estimates that build trust 
                with potential clients and increase your job conversion rate.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Included?</h3>
              <p className="text-gray-600 mb-6">
                Every template includes all the essential elements for a professional painting quote:
              </p>
              <ul className="space-y-2">
                {sampleFields.slice(0, 4).map((field, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {field}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-4">...and much more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Quote Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Should a Painting Quote Include?
            </h2>
            <p className="text-lg text-gray-600">
              A professional painting quote should be comprehensive and transparent. Here's what our templates include:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleFields.map((field, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1" />
                <span className="text-gray-700">{field}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-white rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Example Painting Quote Structure</h3>
            <div className="prose prose-gray max-w-none">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-green-500">
                <h4 className="font-semibold">Project: Interior Painting - 3 Bedroom Home</h4>
                <p className="text-sm text-gray-600 mb-2">123 Main Street, Anytown, ST 12345</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <strong>Scope:</strong> Paint all walls, ceilings, and trim
                  </div>
                  <div>
                    <strong>Timeline:</strong> 3-4 days
                  </div>
                  <div>
                    <strong>Paint Quality:</strong> Premium latex
                  </div>
                  <div>
                    <strong>Total Area:</strong> 2,400 sq ft
                  </div>
                </div>
                
                <div className="mt-4 text-right">
                  <strong className="text-lg">Total: $4,850</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Professional Quotes?</h2>
          <p className="text-xl text-green-100 mb-8">
            Start using our templates and calculator to create winning painting estimates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/access-code">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Creating Quotes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/how-to-quote-painting-jobs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3">
                Learn Quote Best Practices
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}