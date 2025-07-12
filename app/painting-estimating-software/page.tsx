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
    <div>
      <KofiHeader />
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <h1>
              The Best Painting Estimating Software
            </h1>
            <p>
              Create professional estimates faster and win more painting jobs
            </p>
            <div>
              <Link href="/access-code">
                <Button size="lg">
                  Try Free Demo
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/painting-quote-templates">
                <Button size="lg" variant="outline">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div>
          <div>
            <h2>
              Why Choose ProPaint Estimating Software?
            </h2>
            <p>
              Designed specifically for painting contractors who want to streamline their estimating process
            </p>
          </div>

          <div>
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section>
        <div>
          <div>
            <h2>
              Traditional Methods vs. Estimating Software
            </h2>
            <p>
              See how modern estimating software transforms your quoting process
            </p>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Traditional Methods</th>
                  <th>ProPaint Software</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index}>
                    <td>{row.feature}</td>
                    <td>{row.traditional}</td>
                    <td>{row.software}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <div>
          <div>
            <div>
              <h2>
                Everything You Need in One Platform
              </h2>
              <p>
                Stop juggling multiple tools and spreadsheets. Our comprehensive platform handles 
                everything from initial estimates to project completion.
              </p>
              <ul>
                {benefits.map((benefit, index) => (
                  <li key={index}>
                    <CheckCircle />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div>
                <div>
                  <Star />
                </div>
                <h3>Trusted by Professionals</h3>
                <p>Join thousands of painting contractors</p>
              </div>
              
              <div>
                <div>
                  <span>Estimates Created</span>
                  <span>500,000+</span>
                </div>
                <div>
                  <span>Active Contractors</span>
                  <span>15,000+</span>
                </div>
                <div>
                  <span>Average Time Saved</span>
                  <span>75%</span>
                </div>
              </div>
              
              <Link href="/access-code">
                <Button size="lg">
                  Start Free Trial
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section>
        <div>
          <div>
            <h2>
              Complete Painting Business Solution
            </h2>
            
            <h3>Advanced Estimation Engine</h3>
            <p>
              Our software uses industry-standard formulas and real-world data to calculate accurate 
              material quantities, labor hours, and project costs. Built-in databases for paint 
              coverage rates, labor productivity, and local pricing ensure your estimates are both 
              competitive and profitable.
            </p>

            <h3>Professional Quote Generation</h3>
            <p>
              Create impressive, detailed quotes that showcase your professionalism. Include your 
              company branding, detailed scope of work, material specifications, timeline, and 
              terms. Clients receive polished PDF documents they can easily share and approve.
            </p>

            <h3>Mobile Accessibility</h3>
            <p>
              Work from anywhere with full mobile functionality. Measure and estimate on-site, 
              send quotes while still at the client's location, and manage your business from 
              your smartphone or tablet. No more rushing back to the office to create estimates.
            </p>

            <div>
              <h4>Getting Started is Easy</h4>
              <ol>
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
      <section>
        <div>
          <h2>Ready to Transform Your Estimating Process?</h2>
          <p>
            Join thousands of painting contractors who've streamlined their business with our software
          </p>
          <div>
            <Link href="/access-code">
              <Button size="lg">
                Start Free Trial Today
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/how-to-quote-painting-jobs">
              <Button size="lg" variant="outline">
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