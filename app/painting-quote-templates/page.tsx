import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Download, Eye, Star, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

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
    <div>
      <KofiHeader />
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <h1>
              Professional Painting Quote Templates
            </h1>
            <p>
              Free downloadable templates that help you win more painting jobs
            </p>
            <div>
              <Link href="/access-code">
                <Button size="lg">
                  Create Custom Quote
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/painting-estimate-calculator">
                <Button size="lg" variant="outline">
                  Try Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section>
        <div>
          <div>
            <h2>
              Choose Your Painting Quote Template
            </h2>
            <p>
              Professional templates used by successful painting contractors nationwide. Customizable and ready to use.
            </p>
          </div>

          <div>
            {templates.map((template, index) => (
              <Card key={index}`}>
                {template.popular && (
                  <div>
                    <span>
                      <Star />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <FileText />
                  <CardTitle>{template.title}</CardTitle>
                  <p>{template.description}</p>
                </CardHeader>
                <CardContent>
                  <ul>
                    {template.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <CheckCircle />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Link href="/access-code">
                      <Button>
                        Create Quote
                        <Eye />
                      </Button>
                    </Link>
                    <Button variant="outline">
                      <Download />
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
      <section>
        <div>
          <div>
            <div>
              <h2>
                Why Use Professional Painting Quote Templates?
              </h2>
              <p>
                Professional quote templates help you present detailed, accurate estimates that build trust 
                with potential clients and increase your job conversion rate.
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
              <h3>What's Included?</h3>
              <p>
                Every template includes all the essential elements for a professional painting quote:
              </p>
              <ul>
                {sampleFields.slice(0, 4).map((field, index) => (
                  <li key={index}>
                    <CheckCircle />
                    {field}
                  </li>
                ))}
              </ul>
              <p>...and much more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Quote Section */}
      <section>
        <div>
          <div>
            <h2>
              What Should a Painting Quote Include?
            </h2>
            <p>
              A professional painting quote should be comprehensive and transparent. Here's what our templates include:
            </p>
          </div>
          
          <div>
            {sampleFields.map((field, index) => (
              <div key={index}>
                <CheckCircle />
                <span>{field}</span>
              </div>
            ))}
          </div>

          <div>
            <h3>Example Painting Quote Structure</h3>
            <div>
              <div>
                <h4>Project: Interior Painting - 3 Bedroom Home</h4>
                <p>123 Main Street, Anytown, ST 12345</p>
                
                <div>
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
                
                <div>
                  <strong>Total: $4,850</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>Ready to Create Professional Quotes?</h2>
          <p>
            Start using our templates and calculator to create winning painting estimates
          </p>
          <div>
            <Link href="/access-code">
              <Button size="lg">
                Start Creating Quotes
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/how-to-quote-painting-jobs">
              <Button size="lg" variant="outline">
                Learn Quote Best Practices
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <ImprovedFooter />
    </div>
  );
}