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
    <div>
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <h1>
              How to Quote Painting Jobs Like a Pro
            </h1>
            <p>
              Master the art of accurate painting estimates that win jobs and maintain profits
            </p>
            <div>
              <Link href="/access-code">
                <Button size="lg">
                  Try Our Quote Calculator
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/painting-quote-templates">
                <Button size="lg" variant="outline">
                  Get Quote Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section>
        <div>
          <div>
            <h2>
              4 Steps to Accurate Painting Quotes
            </h2>
            <p>
              Follow this proven process to create detailed, competitive quotes that win jobs and protect your profit margins
            </p>
          </div>

          <div>
            {steps.map((step, index) => (
              <Card key={index}>
                <div>
                  <div>
                    <div>Step {step.number}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  <div>
                    <h4>Key Activities:</h4>
                    <ul>
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>
                          <CheckCircle />
                          <span>{detail}</span>
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
      <section>
        <div>
          <div>
            <div>
              <h2>
                Key Factors That Affect Painting Prices
              </h2>
              <p>
                Understanding these factors helps you create more accurate estimates and explain pricing to clients.
              </p>
              <ul>
                {pricingFactors.map((factor, index) => (
                  <li key={index}>
                    <CheckCircle />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Pro Tip: Use Technology</h3>
              <p>
                Modern painting estimate calculators can help you factor in all these variables automatically, 
                ensuring you don't miss important cost components.
              </p>
              <Link href="/access-code">
                <Button size="lg">
                  Try Our Calculator
                  <Calculator />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section>
        <div>
          <div>
            <h2>
              Common Quoting Mistakes to Avoid
            </h2>
            <p>
              Learn from these frequent errors that can cost you jobs or profits
            </p>
          </div>

          <div>
            {commonMistakes.map((mistake, index) => (
              <Card key={index}>
                <CardHeader>
                  <mistake.icon />
                  <CardTitle>{mistake.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{mistake.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Guide */}
      <section>
        <div>
          <div>
            <h2>
              Detailed Painting Estimate Calculations
            </h2>
            
            <h3>Surface Area Calculations</h3>
            <p>
              Accurate measurements are the foundation of good quotes. For interior rooms, measure each wall 
              separately and subtract window and door areas. For exteriors, include all paintable surfaces 
              like siding, trim, doors, and shutters.
            </p>

            <div>
              <h4>Quick Calculation Formula:</h4>
              <div>
                <div>Wall Area = (Length × Height) - (Doors + Windows)</div>
                <div>Ceiling Area = Length × Width</div>
                <div>Total Paintable Area = Walls + Ceiling + Trim</div>
              </div>
            </div>

            <h3>Material Cost Estimation</h3>
            <p>
              Paint coverage varies by surface type and paint quality. Standard coverage is approximately 
              350-400 square feet per gallon, but porous or textured surfaces may require more. Always 
              add 10-15% extra for touch-ups and waste.
            </p>

            <h3>Labor Time Calculations</h3>
            <p>
              Labor estimates should include all phases of work:
            </p>
            <ul>
              <li>Surface preparation (cleaning, sanding, priming)</li>
              <li>Paint application (multiple coats as needed)</li>
              <li>Detail work (cutting in, trim painting)</li>
              <li>Cleanup and final inspection</li>
            </ul>

            <h3>Professional Quote Presentation</h3>
            <p>
              Your quote should be detailed but easy to understand. Include:
            </p>
            <ul>
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
      <section>
        <div>
          <h2>Start Creating Professional Quotes Today</h2>
          <p>
            Use our tools and templates to streamline your quoting process and win more jobs
          </p>
          <div>
            <Link href="/access-code">
              <Button size="lg">
                Try Quote Calculator
                <Calculator />
              </Button>
            </Link>
            <Link href="/painting-quote-templates">
              <Button size="lg" variant="outline">
                Download Templates
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}