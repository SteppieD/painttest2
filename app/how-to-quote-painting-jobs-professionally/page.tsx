import Link from 'next/link';
import { 
  Calculator, 
  CheckCircle,
  ArrowRight,
  Palette,
  FileText,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'How to Quote Painting Jobs Like a Professional Contractor (2024 Guide)',
  description: 'Learn how to quote painting jobs accurately and profitably. Professional guide for contractors on pricing interior, exterior, and commercial painting projects.',
  keywords: 'how to quote painting jobs, how to quote for painting, how to write a painting quote, what should a painting quote include, painting quotation template, how to quote for painting jobs',
  path: '/how-to-quote-painting-jobs-professionally',
});

export default function HowToQuotePaintingJobsProfessionallyPage() {
  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <h1>
              How to Quote <span>Painting Jobs</span> Like a Pro
            </h1>
            <p>
              Master the art of professional painting estimates. Learn proven strategies to price jobs accurately, win more bids, and maximize your profits with every quote.
            </p>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                <Calculator />
                Get Professional Quote Tool
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section>
        <div>
          <div>
            <h2>Complete Guide Contents</h2>
            <div>
              <ul>
                <li><a href="#basics">1. Painting Quote Basics</a></li>
                <li><a href="#measurement">2. Accurate Measurements</a></li>
                <li><a href="#materials">3. Material Calculations</a></li>
                <li><a href="#labor">4. Labor Cost Estimation</a></li>
              </ul>
              <ul>
                <li><a href="#pricing">5. Pricing Strategies</a></li>
                <li><a href="#templates">6. Professional Templates</a></li>
                <li><a href="#mistakes">7. Common Mistakes</a></li>
                <li><a href="#tools">8. Quote Software Tools</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Basics */}
      <section id="basics">
        <div>
          <h2>1. Painting Quote Basics: What Every Professional Needs to Know</h2>
          
          <div>
            <p>
              Creating accurate painting quotes is the foundation of a profitable painting business. A professional quote should include all costs, 
              establish clear expectations, and position you competitively in the market.
            </p>

            <h3>What Should a Painting Quote Include?</h3>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FileText />
                    Essential Quote Elements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>
                      <CheckCircle />
                      <span>Detailed scope of work</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Material specifications</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Labor costs breakdown</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Timeline expectations</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Terms and conditions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    <DollarSign />
                    Pricing Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>
                      <CheckCircle />
                      <span>Paint and primer costs</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Supplies and equipment</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Prep work requirements</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Labor hours and rates</span>
                    </li>
                    <li>
                      <CheckCircle />
                      <span>Profit margin and overhead</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Measurement */}
      <section id="measurement">
        <div>
          <h2>2. Accurate Measurements: The Foundation of Every Quote</h2>
          
          <div>
            <p>
              Accurate measurements are crucial for profitable painting quotes. Here's how professional contractors measure different surfaces:
            </p>

            <div>
              <h3>Wall Surface Calculation</h3>
              <div>
                <div>
                  <h4>Standard Formula:</h4>
                  <div>
                    <code>
                      (Length × Height) - Doors - Windows = Paintable Area
                    </code>
                  </div>
                  <ul>
                    <li>• Measure wall length and height</li>
                    <li>• Subtract door area (21 sq ft each)</li>
                    <li>• Subtract window area (15 sq ft average)</li>
                    <li>• Add 10% for waste and touch-ups</li>
                  </ul>
                </div>
                <div>
                  <h4>Pro Tips:</h4>
                  <ul>
                    <li>• Use a laser measure for accuracy</li>
                    <li>• Round up to nearest half foot</li>
                    <li>• Account for texture differences</li>
                    <li>• Note prep work requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Interior Walls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Standard ceiling height: 8-9 feet</p>
                  <p>Coverage: 350-400 sq ft per gallon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ceilings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Length × Width = Area</p>
                  <p>Coverage: 350-400 sq ft per gallon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trim & Doors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Measure linear feet of trim</p>
                  <p>Doors: 20 sq ft average each</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Materials */}
      <section id="materials">
        <div>
          <h2>3. Material Cost Calculations</h2>
          
          <div>
            <div>
              <AlertCircle />
              <div>
                <h3>Pro Tip: Material Cost Strategy</h3>
                <p>
                  Always add 15-20% to material costs for waste, touch-ups, and price fluctuations. This protects your profit margins and accounts for unexpected needs.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div>
              <h3>Paint Cost Calculation</h3>
              <div>
                <div>
                  <h4>Premium Paint</h4>
                  <p>$45-65 per gallon</p>
                  <p>Coverage: 350-400 sq ft</p>
                </div>
                <div>
                  <h4>Standard Paint</h4>
                  <p>$25-45 per gallon</p>
                  <p>Coverage: 300-350 sq ft</p>
                </div>
                <div>
                  <h4>Primer</h4>
                  <p>$20-35 per gallon</p>
                  <p>Coverage: 300-400 sq ft</p>
                </div>
              </div>
            </div>

            <div>
              <h3>Supply Costs</h3>
              <div>
                <div>
                  <span>Brushes & Rollers</span>
                  <span>$25-50</span>
                </div>
                <div>
                  <span>Drop Cloths</span>
                  <span>$15-30</span>
                </div>
                <div>
                  <span>Painter's Tape</span>
                  <span>$10-25</span>
                </div>
                <div>
                  <span>Sandpaper & Prep</span>
                  <span>$20-40</span>
                </div>
                <div>
                  <span>Plastic & Protection</span>
                  <span>$15-35</span>
                </div>
                <div>
                  <span>Total Supplies</span>
                  <span>$85-180</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Labor */}
      <section id="labor">
        <div>
          <h2>4. Labor Cost Estimation</h2>
          
          <div>
            <p>
              Labor typically represents 70-80% of your total quote. Accurate labor estimation is crucial for profitability.
            </p>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Labor Rate Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <h4>Hourly Rate Components:</h4>
                      <ul>
                        <li>• Base wage: $20-35/hour</li>
                        <li>• Taxes & benefits: +25%</li>
                        <li>• Equipment & overhead: +15%</li>
                        <li>• Profit margin: +20-30%</li>
                      </ul>
                    </div>
                    <div>
                      <p>
                        Total Rate: $35-65/hour
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time Estimates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <span>Prep work</span>
                      <span>150-200 sq ft/hour</span>
                    </div>
                    <div>
                      <span>Priming</span>
                      <span>300-400 sq ft/hour</span>
                    </div>
                    <div>
                      <span>Wall painting</span>
                      <span>350-450 sq ft/hour</span>
                    </div>
                    <div>
                      <span>Trim painting</span>
                      <span>25-40 linear ft/hour</span>
                    </div>
                    <div>
                      <span>Cleanup</span>
                      <span>10% of total time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Tools CTA */}
      <section>
        <div>
          <h2>
            Automate Your Painting Quotes with Professional Software
          </h2>
          <p>
            Stop calculating quotes manually. Get accurate estimates in minutes with our professional painting quote software.
          </p>
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                <Calculator />
                Try Free Calculator
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/painting-quote-templates">
                <FileText />
                Get Quote Templates
              </Link>
            </Button>
          </div>
          <p>
            Free trial • Professional templates included • Mobile-friendly
          </p>
        </div>
      </section>

      {/* Continue reading sections would go here... */}
      
      <ImprovedFooter />
    </div>
  );
}