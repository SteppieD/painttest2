import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, PaintBucket, Clock, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Free Painting Estimate Calculator - Get Instant Paint Job Quotes | ProPaint',
  description: 'Calculate accurate painting estimates instantly with our free painting estimate calculator. Get detailed quotes for interior, exterior, and commercial painting projects.',
  keywords: 'painting estimate calculator, paint estimate calculator, painting quote calculator, house painter estimate, painting cost calculator',
  alternates: {
    canonical: '/painting-estimate-calculator'
  }
};

export default function PaintingEstimateCalculatorPage() {
  const features = [
    {
      icon: Calculator,
      title: "Instant Calculations",
      description: "Get accurate painting estimates in seconds with our advanced calculator"
    },
    {
      icon: PaintBucket,
      title: "All Project Types",
      description: "Interior, exterior, commercial, and residential painting estimates"
    },
    {
      icon: Clock,
      title: "Time Estimates",
      description: "Includes labor time and project timeline calculations"
    },
    {
      icon: DollarSign,
      title: "Material Costs",
      description: "Detailed breakdown of paint, supplies, and labor costs"
    }
  ];

  const benefits = [
    "Professional-grade estimate accuracy",
    "Customizable for different paint qualities",
    "Room-by-room calculation support",
    "Printable and shareable quotes",
    "Mobile-friendly calculator",
    "No download required - works in browser"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Free Painting Estimate Calculator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Get instant, accurate painting quotes for any project size
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/access-code">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Start Free Calculator
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/painting-quote-templates">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                  View Quote Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Painting Estimate Calculator?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trusted by professional painters and contractors nationwide for accurate, detailed painting estimates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
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
                Professional Painting Estimates Made Simple
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our painting estimate calculator uses industry-standard formulas and real-world data to provide 
                accurate quotes that help you win more jobs and maintain profitable margins.
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Calculate?</h3>
              <p className="text-gray-600 mb-6">
                Start creating professional painting estimates in under 2 minutes. No registration required for basic calculations.
              </p>
              <Link href="/access-code">
                <Button size="lg" className="w-full">
                  Launch Calculator Now
                  <Calculator className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use a Painting Estimate Calculator
            </h2>
            <p className="text-gray-600 mb-6">
              A painting estimate calculator is an essential tool for both professional painters and homeowners 
              looking to understand the true cost of a painting project. Our calculator takes into account room 
              dimensions, paint quality, surface preparation requirements, and local labor rates to provide 
              accurate estimates.
            </p>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What Makes a Good Painting Estimate?</h3>
            <p className="text-gray-600 mb-4">
              Professional painting estimates should include detailed breakdowns of materials, labor, and timeline. 
              Our calculator automatically factors in:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li>Square footage calculations for walls, ceilings, and trim</li>
              <li>Paint coverage rates and number of coats needed</li>
              <li>Surface preparation requirements</li>
              <li>Labor costs based on project complexity</li>
              <li>Material costs including primer, paint, and supplies</li>
            </ul>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Types of Painting Projects</h3>
            <p className="text-gray-600 mb-4">
              Our painting estimate calculator works for all types of projects:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6">
              <li><strong>Interior Painting:</strong> Bedrooms, living rooms, kitchens, bathrooms</li>
              <li><strong>Exterior Painting:</strong> Siding, trim, doors, windows, decks</li>
              <li><strong>Commercial Painting:</strong> Offices, retail spaces, warehouses</li>
              <li><strong>Specialty Projects:</strong> Cabinets, furniture, decorative finishes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Free Painting Estimate</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of painters and contractors who trust our calculator for accurate estimates
          </p>
          <Link href="/access-code">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Get Started - It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}