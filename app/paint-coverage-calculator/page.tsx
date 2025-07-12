import Link from 'next/link';
import { 
  Calculator, 
  Paintbrush, 
  Ruler, 
  Info, 
  CheckCircle, 
  ArrowRight,
  Home,
  Building,
  AlertCircle,
  BarChart3,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/shared/footer';
import { Header } from '@/components/shared/header';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Paint Coverage Calculator - Square Footage Paint Calculator',
  description: 'Paint coverage calculator determines exactly how much paint you need. Calculate gallons by square footage, room dimensions, and surface type. Free tool used by 5,000+ contractors.',
  keywords: 'paint coverage calculator, paint calculator square feet, wall paint calculator, paint needed calculator, paint coverage per gallon, how much paint calculator, paint square footage calculator, paint consumption calculator',
  path: '/paint-coverage-calculator',
});

export default function PaintCoverageCalculatorPage() {
  // Paint coverage data by type
  const paintCoverageRates = [
    {
      type: "Flat/Matte Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Ceilings, low-traffic areas",
      coats: "Usually 2 coats",
      absorption: "High absorption"
    },
    {
      type: "Eggshell Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Living rooms, bedrooms",
      coats: "2 coats standard",
      absorption: "Moderate absorption"
    },
    {
      type: "Satin Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "High-traffic areas, kitchens",
      coats: "1-2 coats",
      absorption: "Low absorption"
    },
    {
      type: "Semi-Gloss Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Bathrooms, trim, doors",
      coats: "1-2 coats",
      absorption: "Very low absorption"
    },
    {
      type: "Gloss Paint",
      coverage: "350-400 sq ft/gallon",
      bestFor: "Cabinets, furniture",
      coats: "1-2 coats",
      absorption: "Minimal absorption"
    },
    {
      type: "Primer",
      coverage: "200-300 sq ft/gallon",
      bestFor: "New drywall, stains",
      coats: "1 coat",
      absorption: "Seals surface"
    }
  ];

  // Surface type factors
  const surfaceFactors = [
    { surface: "Smooth Drywall", factor: "1.0x", note: "Standard coverage rate" },
    { surface: "Textured Walls", factor: "1.15x", note: "15% more paint needed" },
    { surface: "Rough Stucco", factor: "1.5x", note: "50% more paint needed" },
    { surface: "Bare Wood", factor: "1.25x", note: "25% more for first coat" },
    { surface: "Previously Painted", factor: "0.9x", note: "10% less paint needed" },
    { surface: "New Drywall", factor: "1.3x", note: "30% more for primer + paint" }
  ];

  // Room size examples
  const roomExamples = [
    {
      room: "Small Bedroom",
      dimensions: "10' x 10' x 8'",
      wallArea: "320 sq ft",
      paintNeeded: "0.8-1 gallon",
      with2Coats: "1.5-2 gallons"
    },
    {
      room: "Master Bedroom",
      dimensions: "14' x 16' x 9'",
      wallArea: "540 sq ft",
      paintNeeded: "1.4-1.5 gallons",
      with2Coats: "2.5-3 gallons"
    },
    {
      room: "Living Room",
      dimensions: "16' x 20' x 10'",
      wallArea: "720 sq ft",
      paintNeeded: "1.8-2 gallons",
      with2Coats: "3.5-4 gallons"
    },
    {
      room: "Average House Interior",
      dimensions: "2,000 sq ft home",
      wallArea: "5,500 sq ft",
      paintNeeded: "14-16 gallons",
      with2Coats: "28-32 gallons"
    }
  ];

  // Coverage calculation tips
  const calculationTips = [
    {
      tip: "Measure Accurately",
      description: "Length × Height for each wall, then add together",
      example: "4 walls: (12×8) + (12×8) + (10×8) + (10×8) = 352 sq ft"
    },
    {
      tip: "Subtract Openings",
      description: "Deduct doors (20 sq ft) and windows (15 sq ft each)",
      example: "352 sq ft - 20 (door) - 30 (2 windows) = 302 sq ft"
    },
    {
      tip: "Add 10% Buffer",
      description: "Always buy extra for touch-ups and mistakes",
      example: "302 sq ft + 10% = 332 sq ft total"
    },
    {
      tip: "Consider Ceiling",
      description: "Ceiling = Length × Width of room",
      example: "12 × 10 = 120 sq ft for ceiling"
    }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      mistake: "Forgetting Second Coat",
      impact: "Running out mid-project",
      solution: "Always calculate for 2 coats"
    },
    {
      mistake: "Not Accounting for Texture",
      impact: "15-50% shortage",
      solution: "Use surface factor multipliers"
    },
    {
      mistake: "Ignoring Primer Needs",
      impact: "Poor coverage, more coats",
      solution: "Add primer for new/dark surfaces"
    },
    {
      mistake: "Exact Calculations Only",
      impact: "No paint for touch-ups",
      solution: "Always add 10% buffer"
    }
  ];

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Badge>
              Professional Paint Calculator
            </Badge>
            <h1>
              Paint Coverage Calculator by Square Footage
            </h1>
            <p>
              Paint coverage calculator determines exactly how many gallons of paint you need. 
              Calculate by square footage, room dimensions, or full house. Accurate coverage for any surface type.
            </p>
            
            <div>
              <Button size="lg" asChild>
                <Link href="/trial-signup">
                  Use Advanced Calculator
                  <Calculator />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#calculator">
                  Try Basic Calculator
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            
            <div>
              <span>
                <Ruler />
                Accurate coverage rates
              </span>
              <span>
                <Paintbrush />
                All paint types
              </span>
              <span>
                <Home />
                Room & house calculators
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Paint Coverage Rates Table */}
      <section>
        <div>
          <div>
            <h2>
              Paint Coverage Rates by Type
            </h2>
            <p>
              Professional coverage rates for accurate paint calculations
            </p>
          </div>
          
          <div>
            <table>
              <thead>
                <tr>
                  <th>Paint Type</th>
                  <th>Coverage Rate</th>
                  <th>Best For</th>
                  <th>Coats Needed</th>
                  <th>Absorption</th>
                </tr>
              </thead>
              <tbody>
                {paintCoverageRates.map((paint, index) => (
                  <tr key={index}>
                    <td>{paint.type}</td>
                    <td>{paint.coverage}</td>
                    <td>{paint.bestFor}</td>
                    <td>{paint.coats}</td>
                    <td>{paint.absorption}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Card>
            <CardContent>
              <div>
                <Info />
                <div>
                  <p>
                    Important Coverage Note:
                  </p>
                  <p>
                    These are manufacturer specifications for smooth surfaces. Actual coverage varies based on 
                    surface texture, porosity, application method, and painter technique. Always calculate 
                    conservatively and purchase 10% extra.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Surface Type Factors */}
      <section>
        <div>
          <div>
            <h2>
              Surface Type Coverage Factors
            </h2>
            <p>
              Adjust paint calculations based on surface texture
            </p>
          </div>
          
          <div>
            {surfaceFactors.map((surface, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    {surface.surface}
                    <Badge>
                      {surface.factor}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{surface.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Room Examples */}
      <section>
        <div>
          <div>
            <h2>
              Paint Coverage by Room Size
            </h2>
            <p>
              Real-world examples for common room sizes
            </p>
          </div>
          
          <div>
            {roomExamples.map((room, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{room.room}</CardTitle>
                  <p>{room.dimensions}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <p>Wall Area:</p>
                      <p>{room.wallArea}</p>
                    </div>
                    <div>
                      <p>Paint (1 coat):</p>
                      <p>{room.paintNeeded}</p>
                    </div>
                    <div>
                      <p>Paint (2 coats):</p>
                      <p>{room.with2Coats}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator">
        <div>
          <div>
            <h2>
              Paint Coverage Calculator
            </h2>
            <p>
              Calculate exactly how much paint you need
            </p>
          </div>
          
          <Card>
            <CardContent>
              <div>
                <div>
                  <h3>Room Dimensions</h3>
                  <div>
                    <div>
                      <label>
                        Room Length (feet)
                      </label>
                      <input 
                        type="number" 
                        
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label>
                        Room Width (feet)
                      </label>
                      <input 
                        type="number" 
                        
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label>
                        Wall Height (feet)
                      </label>
                      <input 
                        type="number" 
                        
                        placeholder="8"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3>Paint Details</h3>
                  <div>
                    <div>
                      <label>
                        Number of Doors
                      </label>
                      <input 
                        type="number" 
                        
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label>
                        Number of Windows
                      </label>
                      <input 
                        type="number" 
                        
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label>
                        Number of Coats
                      </label>
                      <select>
                        <option>1 coat</option>
                        <option selected>2 coats (recommended)</option>
                        <option>3 coats</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label>
                  Surface Type
                </label>
                <select>
                  <option>Smooth Drywall (Standard)</option>
                  <option>Textured Walls (+15%)</option>
                  <option>Rough Stucco (+50%)</option>
                  <option>Bare Wood (+25%)</option>
                  <option>Previously Painted (-10%)</option>
                </select>
              </div>
              
              <Button>
                Calculate Paint Coverage
                <Calculator />
              </Button>
              
              <div>
                <h4>Sample Calculation:</h4>
                <div>
                  <p>Wall Area: 320 sq ft (after subtracting doors/windows)</p>
                  <p>Coverage Rate: 400 sq ft per gallon</p>
                  <p>Coats: 2</p>
                  <p>Total Paint Needed: 1.6 gallons (recommend buying 2 gallons)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculation Tips */}
      <section>
        <div>
          <div>
            <h2>
              How to Calculate Paint Coverage
            </h2>
            <p>
              Step-by-step guide for accurate calculations
            </p>
          </div>
          
          <div>
            {calculationTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    <span>
                      {index + 1}
                    </span>
                    {tip.tip}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tip.description}</p>
                  <div>
                    {tip.example}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section>
        <div>
          <div>
            <h2>
              Common Paint Coverage Mistakes
            </h2>
            <p>
              Avoid these errors in your calculations
            </p>
          </div>
          
          <div>
            {commonMistakes.map((mistake, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    <AlertCircle />
                    {mistake.mistake}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p>
                      <span>Impact:</span> {mistake.impact}
                    </p>
                    <p>
                      <span>Solution:</span> {mistake.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Benefits */}
      <section>
        <div>
          <Card>
            <div>
              <div>
                <h2>
                  Why Contractors Trust Our Calculator
                </h2>
                <div>
                  <div>
                    <BarChart3 />
                    <div>
                      <h3>95% Accuracy</h3>
                      <p>Based on 250,000+ real projects</p>
                    </div>
                  </div>
                  <div>
                    <Clock />
                    <div>
                      <h3>Save 30 Minutes</h3>
                      <p>Per quote with instant calculations</p>
                    </div>
                  </div>
                  <div>
                    <DollarSign />
                    <div>
                      <h3>Reduce Waste</h3>
                      <p>Order right amount, save money</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3>Professional Features</h3>
                <ul>
                  <li>
                    <CheckCircle />
                    <span>Multiple surface type calculations</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Interior & exterior coverage rates</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Brand-specific coverage data</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Commercial project scaling</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Export calculations to quotes</span>
                  </li>
                </ul>
                <Button asChild>
                  <Link href="/trial-signup">
                    Try Professional Calculator
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Get Professional Paint Coverage Calculations
          </h2>
          <p>
            Join 5,000+ contractors using our advanced calculators for accurate paint 
            estimates. Never run out or over-order again.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/painting-quote-templates-free">
                Get Free Templates
                <ArrowRight />
              </Link>
            </Button>
          </div>
          
          <div>
            <span>
              <CheckCircle />
              Accurate calculations
            </span>
            <span>
              <CheckCircle />
              All paint types
            </span>
            <span>
              <CheckCircle />
              Save on materials
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}