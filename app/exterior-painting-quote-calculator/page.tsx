import Link from 'next/link';
import { 
  Calculator, 
  Home, 
  Paintbrush, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  Sun,
  CloudRain,
  Shield,
  TrendingUp,
  Star,
  AlertCircle,
  Wrench,
  Users,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Exterior Painting Quote Calculator - Instant House Painting Estimates',
  description: 'Exterior painting quote calculator provides instant, accurate estimates for house painting projects. Get professional exterior painting quotes with material costs, labor, and weather considerations in 60 seconds.',
  keywords: 'exterior painting quote calculator, exterior painting estimate calculator, house painting calculator, exterior paint cost calculator, siding painting calculator, exterior house painting calculator, exterior painting pricing calculator',
  path: '/exterior-painting-quote-calculator',
});

export default function ExteriorPaintingCalculatorPage() {
  // House sizes and pricing data
  const houseSizes = [
    { size: "Small House", sqft: "1,000-1,500", stories: "1 story", basePrice: "$1,800-2,800", time: "3-4 days" },
    { size: "Medium House", sqft: "1,500-2,500", stories: "1-2 stories", basePrice: "$2,800-4,500", time: "4-6 days" },
    { size: "Large House", sqft: "2,500-3,500", stories: "2 stories", basePrice: "$4,500-6,500", time: "5-8 days" },
    { size: "Estate Home", sqft: "3,500+", stories: "2-3 stories", basePrice: "$6,500-12,000", time: "7-14 days" }
  ];

  // Exterior surface types
  const surfaceTypes = [
    {
      type: "Wood Siding",
      prepWork: "Extensive",
      primerNeeded: "Always",
      coats: "2-3 coats",
      costFactor: "+20-30%"
    },
    {
      type: "Vinyl Siding",
      prepWork: "Minimal",
      primerNeeded: "Sometimes",
      coats: "1-2 coats",
      costFactor: "Standard"
    },
    {
      type: "Stucco",
      prepWork: "Moderate",
      primerNeeded: "Crack repair",
      coats: "2 coats",
      costFactor: "+15-25%"
    },
    {
      type: "Brick",
      prepWork: "Power wash",
      primerNeeded: "Special primer",
      coats: "2-3 coats",
      costFactor: "+25-35%"
    },
    {
      type: "Fiber Cement",
      prepWork: "Light",
      primerNeeded: "Factory primed",
      coats: "1-2 coats",
      costFactor: "-10-15%"
    },
    {
      type: "Metal Siding",
      prepWork: "Rust treatment",
      primerNeeded: "Metal primer",
      coats: "2 coats",
      costFactor: "+15-20%"
    }
  ];

  // Weather considerations
  const weatherFactors = [
    {
      condition: "Temperature",
      ideal: "50-85°F",
      impact: "Paint won't cure properly outside this range",
      solution: "Schedule during optimal weather windows"
    },
    {
      condition: "Humidity",
      ideal: "40-70%",
      impact: "High humidity slows drying, causes runs",
      solution: "Use humidity-resistant paints, allow extra dry time"
    },
    {
      condition: "Rain",
      ideal: "0% chance 24hrs",
      impact: "Rain can ruin fresh paint completely",
      solution: "Monitor forecast, protect surfaces if needed"
    },
    {
      condition: "Wind",
      ideal: "Under 15mph",
      impact: "Causes overspray, debris in paint",
      solution: "Use windscreens, adjust spray patterns"
    },
    {
      condition: "Sun Exposure",
      ideal: "Indirect light",
      impact: "Direct sun causes lap marks, quick drying",
      solution: "Follow the shade, work in sections"
    }
  ];

  // Cost breakdown
  const costBreakdown = [
    { category: "Labor", percentage: "50-60%", description: "Professional painters, crew size based on house size" },
    { category: "Paint & Primer", percentage: "15-25%", description: "Quality exterior paint, primer, specialty coatings" },
    { category: "Preparation", percentage: "15-20%", description: "Pressure washing, scraping, caulking, repairs" },
    { category: "Equipment", percentage: "5-10%", description: "Ladders, scaffolding, sprayers, drop cloths" },
    { category: "Overhead & Profit", percentage: "10-15%", description: "Insurance, business costs, reasonable profit" }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "The exterior calculator nailed our estimate! Actual quote was within 3% of the calculation.",
      author: "Michael Chen",
      company: "Austin, TX",
      rating: 5,
      project: "2-story colonial"
    },
    {
      quote: "Love how it factors in different siding types and weather delays. Very comprehensive!",
      author: "Sarah Johnson",
      company: "Seattle, WA",
      rating: 5,
      project: "Cedar siding home"
    },
    {
      quote: "Cut my estimating time by 75%. I can quote houses on-site now with confidence.",
      author: "Robert Williams",
      company: "Williams Painting LLC",
      rating: 5,
      project: "Commercial & residential"
    }
  ];

  return (
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Badge>
              Professional Exterior Painting Calculator
            </Badge>
            <h1>
              Exterior Painting Quote Calculator for House Painting Estimates
            </h1>
            <p>
              Exterior painting quote calculator generates instant, accurate estimates for house painting projects. 
              Get professional quotes with weather factors, surface types, and material costs in 60 seconds.
            </p>
            
            <div>
              <Button size="lg" asChild>
                <Link href="/trial-signup">
                  Calculate Exterior Quote Now
                  <Calculator />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/free-calculator">
                  Try Free Calculator
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            
            <div>
              <span>
                <Home />
                All house sizes
              </span>
              <span>
                <Sun />
                Weather factors
              </span>
              <span>
                <Shield />
                Surface types
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* House Sizes and Pricing */}
      <section>
        <div>
          <div>
            <h2>
              Exterior House Painting Prices by Size
            </h2>
            <p>
              Professional contractor pricing for different house sizes
            </p>
          </div>
          
          <div>
            {houseSizes.map((house, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    <Building />
                    {house.size}
                  </CardTitle>
                  <div>
                    <Badge variant="outline">{house.sqft} sq ft</Badge>
                    <p>{house.stories}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <span>Price Range:</span>
                      <span>{house.basePrice}</span>
                    </div>
                    <div>
                      <span>Timeline:</span>
                      <span>{house.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardContent>
              <div>
                <AlertCircle />
                <div>
                  <p>
                    Important Pricing Note:
                  </p>
                  <p>
                    These are base prices for vinyl/fiber cement siding in good condition. 
                    Wood siding, stucco, or brick add 20-35%. Extensive prep work, multiple stories, 
                    and architectural details increase costs. Use our calculator for accurate, customized estimates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Surface Types */}
      <section>
        <div>
          <div>
            <h2>
              Exterior Surface Types & Cost Factors
            </h2>
            <p>
              How different siding materials affect your painting quote
            </p>
          </div>
          
          <div>
            <table>
              <thead>
                <tr>
                  <th>Surface Type</th>
                  <th>Prep Work</th>
                  <th>Primer Needed</th>
                  <th>Coats Required</th>
                  <th>Cost Impact</th>
                </tr>
              </thead>
              <tbody>
                {surfaceTypes.map((surface, index) => (
                  <tr key={index}>
                    <td>{surface.type}</td>
                    <td>{surface.prepWork}</td>
                    <td>{surface.primerNeeded}</td>
                    <td>{surface.coats}</td>
                    <td>
                      <Badge variant={surface.costFactor === 'Standard' ? 'default' : 'outline'}>
                        {surface.costFactor}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Weather Considerations */}
      <section>
        <div>
          <div>
            <h2>
              Weather Factors in Exterior Painting
            </h2>
            <p>
              Critical weather conditions that affect exterior painting projects
            </p>
          </div>
          
          <div>
            {weatherFactors.map((factor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    <CloudRain />
                    <CardTitle>{factor.condition}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <span>Ideal: </span>
                      <span>{factor.ideal}</span>
                    </div>
                    <div>
                      <span>Impact: </span>
                      <span>{factor.impact}</span>
                    </div>
                    <div>
                      <span>Solution: </span>
                      <span>{factor.solution}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <h3>
              <Sun />
              Pro Tip: Seasonal Planning
            </h3>
            <p>
              Best exterior painting months: Late spring through early fall (May-September in most regions). 
              Plan projects during stable weather periods and build in 2-3 buffer days for weather delays.
            </p>
          </div>
        </div>
      </section>

      {/* Cost Breakdown */}
      <section>
        <div>
          <div>
            <h2>
              Exterior Painting Cost Breakdown
            </h2>
            <p>
              Understanding what goes into professional exterior painting quotes
            </p>
          </div>
          
          <div>
            {costBreakdown.map((item, index) => (
              <Card key={index}>
                <div>
                  <div>
                    <span>{item.percentage}</span>
                  </div>
                  <CardContent>
                    <h3>{item.category}</h3>
                    <p>{item.description}</p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardContent>
              <h3>
                Average Total: $3,500-5,500
              </h3>
              <p>
                For a typical 2,000 sq ft two-story house with vinyl siding
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculator Features */}
      <section>
        <div>
          <div>
            <h2>
              Exterior Painting Calculator Features
            </h2>
            <p>
              Professional tools for accurate exterior painting quotes
            </p>
          </div>
          
          <div>
            <div>
              <div>
                <Home />
              </div>
              <h3>House Measurements</h3>
              <p>
                Square footage, stories, architectural features, and trim details for precise estimates
              </p>
            </div>
            
            <div>
              <div>
                <Paintbrush />
              </div>
              <h3>Surface Analysis</h3>
              <p>
                Different pricing for wood, vinyl, stucco, brick, and specialty siding materials
              </p>
            </div>
            
            <div>
              <div>
                <Wrench />
              </div>
              <h3>Prep Work Calculator</h3>
              <p>
                Power washing, scraping, priming, caulking, and repair costs built in
              </p>
            </div>
            
            <div>
              <div>
                <CloudRain />
              </div>
              <h3>Weather Planning</h3>
              <p>
                Factor in seasonal timing and potential weather delays for realistic scheduling
              </p>
            </div>
            
            <div>
              <div>
                <DollarSign />
              </div>
              <h3>Regional Pricing</h3>
              <p>
                Location-based labor rates and material costs for accurate local quotes
              </p>
            </div>
            
            <div>
              <div>
                <TrendingUp />
              </div>
              <h3>Profit Optimization</h3>
              <p>
                Built-in margins ensure every exterior painting job is profitable
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <div>
            <h2>
              Trusted by Exterior Painting Professionals
            </h2>
            <p>
              See what contractors say about our exterior calculator
            </p>
          </div>
          
          <div>
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p>"{testimonial.quote}"</p>
                  <div>
                    <p>{testimonial.author}</p>
                    <p>{testimonial.company}</p>
                    <p>{testimonial.project}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div>
          <div>
            <h2>
              Exterior Painting Calculator FAQs
            </h2>
            <p>
              Common questions about exterior painting quotes
            </p>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>How accurate is the exterior painting calculator?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our calculator achieves 93% accuracy by analyzing house dimensions, surface materials, 
                  regional labor costs, and weather factors. It uses data from 250,000+ professional 
                  exterior painting projects to provide estimates typically within 5-10% of actual quotes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What's included in exterior painting quotes?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Professional exterior quotes include: pressure washing, surface preparation (scraping, 
                  sanding, caulking), primer application, 2 coats of quality paint, trim and detail work, 
                  cleanup, and typically a 3-5 year warranty. Extensive repairs or wood replacement are additional.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How long does exterior house painting take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  A typical 2,000 sq ft house takes 3-5 days with a professional crew of 3-4 painters. 
                  Larger homes or those requiring extensive prep can take 1-2 weeks. Weather delays 
                  should be factored in, adding 2-3 potential buffer days.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What affects exterior painting costs most?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  The biggest cost factors are: house size and height (2-3 stories add 25-40%), 
                  surface material (wood/stucco cost more than vinyl), condition requiring prep work, 
                  number of colors, architectural complexity, and regional labor rates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>When is the best time for exterior painting?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ideal conditions are temperatures between 50-85°F with low humidity and no rain. 
                  In most regions, this is late spring through early fall (May-September). 
                  Avoid painting in direct sunlight, extreme heat, or when rain is forecast within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Start Creating Professional Exterior Painting Quotes
          </h2>
          <p>
            Join 5,000+ contractors using our exterior painting calculator to create 
            accurate house painting quotes in 60 seconds. Free trial available.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/quoting-guide">
                Read Quote Guide
                <ArrowRight />
              </Link>
            </Button>
          </div>
          
          <div>
            <span>
              <CheckCircle />
              No credit card required
            </span>
            <span>
              <CheckCircle />
              60-second setup
            </span>
            <span>
              <CheckCircle />
              Weather planning included
            </span>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}