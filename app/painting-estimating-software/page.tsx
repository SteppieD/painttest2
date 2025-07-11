import { Metadata } from 'next';
import Link from 'next/link';
import { Smartphone, Monitor, Cloud, CheckCircle, Star, Users, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Best Painting Estimating Software for Contractors | ProPaint',
  description: 'Professional painting estimating software for contractors. Create accurate quotes, manage projects, and grow your painting business with our comprehensive platform.',
  keywords: 'painting estimating software, painting estimate software, best painting estimating software, painting contractor software, estimating software for painters',
  alternates: {
    canonical: '/painting-estimating-software'
  }
};

export default function PaintingEstimatingSoftwarePage() {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Create estimates on-site with any device - smartphone, tablet, or laptop"
    },
    {
      icon: Cloud,
      title: "Cloud-Based Platform", 
      description: "Access your estimates anywhere, sync across devices, automatic backups"
    },
    {
      icon: Monitor,
      title: "Professional Reports",
      description: "Generate detailed, branded quotes that impress clients and win jobs"
    }
  ];

  const benefits = [
    "Calculate accurate estimates in under 5 minutes",
    "Professional-looking quotes with your branding", 
    "Automatic material and labor calculations",
    "Room-by-room breakdown capabilities",
    "Multiple paint quality options",
    "Timeline and project scheduling",
    "Client communication tools",
    "Job tracking and follow-up reminders"
  ];

  const comparison = [
    {
      feature: "Ease of Use",
      traditional: "Complex spreadsheets, prone to errors",
      software: "Simple interface, guided workflows"
    },
    {
      feature: "Speed",
      traditional: "Hours per estimate", 
      software: "Minutes per estimate"
    },
    {
      feature: "Accuracy",
      traditional: "Manual calculations, mistakes common",
      software: "Automated calculations, consistent results"
    },
    {
      feature: "Professional Appearance",
      traditional: "Basic Word docs or handwritten",
      software: "Branded, professional PDF quotes"
    },
    {
      feature: "Client Management", 
      traditional: "Separate systems, lost leads",
      software: "Integrated CRM, automated follow-ups"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <KofiHeader />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Best Painting Estimating Software
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Create professional estimates faster and win more painting jobs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/access-code">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Try Free Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/painting-quote-templates">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600 text-lg px-8 py-3">
                  View Templates
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
              Why Choose ProPaint Estimating Software?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Designed specifically for painting contractors who want to streamline their estimating process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
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

      {/* Comparison Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Traditional Methods vs. Estimating Software
            </h2>
            <p className="text-lg text-gray-600">
              See how modern estimating software transforms your quoting process
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-4 text-left font-semibold">Feature</th>
                  <th className="border border-gray-300 p-4 text-left font-semibold">Traditional Methods</th>
                  <th className="border border-gray-300 p-4 text-left font-semibold bg-indigo-50">ProPaint Software</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 p-4 font-medium">{row.feature}</td>
                    <td className="border border-gray-300 p-4 text-gray-600">{row.traditional}</td>
                    <td className="border border-gray-300 p-4 text-indigo-700 bg-indigo-50">{row.software}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need in One Platform
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Stop juggling multiple tools and spreadsheets. Our comprehensive platform handles 
                everything from initial estimates to project completion.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-indigo-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <Star className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Trusted by Professionals</h3>
                <p className="text-gray-600">Join thousands of painting contractors</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estimates Created</span>
                  <span className="font-bold text-indigo-600">500,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Contractors</span>
                  <span className="font-bold text-indigo-600">15,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Time Saved</span>
                  <span className="font-bold text-indigo-600">75%</span>
                </div>
              </div>
              
              <Link href="/access-code">
                <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Complete Painting Business Solution
            </h2>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Estimation Engine</h3>
            <p className="text-gray-600 mb-6">
              Our software uses industry-standard formulas and real-world data to calculate accurate 
              material quantities, labor hours, and project costs. Built-in databases for paint 
              coverage rates, labor productivity, and local pricing ensure your estimates are both 
              competitive and profitable.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Quote Generation</h3>
            <p className="text-gray-600 mb-6">
              Create impressive, detailed quotes that showcase your professionalism. Include your 
              company branding, detailed scope of work, material specifications, timeline, and 
              terms. Clients receive polished PDF documents they can easily share and approve.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile Accessibility</h3>
            <p className="text-gray-600 mb-6">
              Work from anywhere with full mobile functionality. Measure and estimate on-site, 
              send quotes while still at the client's location, and manage your business from 
              your smartphone or tablet. No more rushing back to the office to create estimates.
            </p>

            <div className="bg-indigo-50 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-3 text-indigo-900">Getting Started is Easy</h4>
              <ol className="list-decimal list-inside space-y-2 text-indigo-800">
                <li>Sign up for free access</li>
                <li>Enter your project details</li>
                <li>Review automated calculations</li>
                <li>Generate professional quote</li>
                <li>Send to client and track responses</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Estimating Process?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of painting contractors who've streamlined their business with our software
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/access-code">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Free Trial Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/how-to-quote-painting-jobs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600 text-lg px-8 py-3">
                Learn Best Practices
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <ImprovedFooter />
    </div>
  );
}