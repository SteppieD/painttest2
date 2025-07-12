import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, PaintBucket, Clock, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

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
    <div>
      <KofiHeader />
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <h1>
              Free Painting Estimate Calculator
            </h1>
            <p>
              Get instant, accurate painting quotes for any project size
            </p>
            <div>
              <Link href="/access-code">
                <Button size="lg">
                  Start Free Calculator
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/painting-quote-templates">
                <Button size="lg" variant="outline">
                  View Quote Templates
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
              Why Choose Our Painting Estimate Calculator?
            </h2>
            <p>
              Trusted by professional painters and contractors nationwide for accurate, detailed painting estimates
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

      {/* Benefits Section */}
      <section>
        <div>
          <div>
            <div>
              <h2>
                Professional Painting Estimates Made Simple
              </h2>
              <p>
                Our painting estimate calculator uses industry-standard formulas and real-world data to provide 
                accurate quotes that help you win more jobs and maintain profitable margins.
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
              <h3>Ready to Calculate?</h3>
              <p>
                Start creating professional painting estimates in under 2 minutes. No registration required for basic calculations.
              </p>
              <Link href="/access-code">
                <Button size="lg">
                  Launch Calculator Now
                  <Calculator />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section>
        <div>
          <div>
            <h2>
              How to Use a Painting Estimate Calculator
            </h2>
            <p>
              A painting estimate calculator is an essential tool for both professional painters and homeowners 
              looking to understand the true cost of a painting project. Our calculator takes into account room 
              dimensions, paint quality, surface preparation requirements, and local labor rates to provide 
              accurate estimates.
            </p>
            
            <h3>What Makes a Good Painting Estimate?</h3>
            <p>
              Professional painting estimates should include detailed breakdowns of materials, labor, and timeline. 
              Our calculator automatically factors in:
            </p>
            <ul>
              <li>Square footage calculations for walls, ceilings, and trim</li>
              <li>Paint coverage rates and number of coats needed</li>
              <li>Surface preparation requirements</li>
              <li>Labor costs based on project complexity</li>
              <li>Material costs including primer, paint, and supplies</li>
            </ul>

            <h3>Types of Painting Projects</h3>
            <p>
              Our painting estimate calculator works for all types of projects:
            </p>
            <ul>
              <li><strong>Interior Painting:</strong> Bedrooms, living rooms, kitchens, bathrooms</li>
              <li><strong>Exterior Painting:</strong> Siding, trim, doors, windows, decks</li>
              <li><strong>Commercial Painting:</strong> Offices, retail spaces, warehouses</li>
              <li><strong>Specialty Projects:</strong> Cabinets, furniture, decorative finishes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>Start Your Free Painting Estimate</h2>
          <p>
            Join thousands of painters and contractors who trust our calculator for accurate estimates
          </p>
          <Link href="/access-code">
            <Button size="lg">
              Get Started - It's Free
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </section>
      <ImprovedFooter />
    </div>
  );
}