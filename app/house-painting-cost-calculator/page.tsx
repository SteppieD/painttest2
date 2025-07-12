import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home,
  DollarSign,
  Ruler,
  PaintBucket,
  Users,
  MapPin,
  TrendingUp,
  Target,
  Smartphone,
  Shield,
  Building2,
  TreePine,
  Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'
import { generatePageMetadata } from '@/lib/metadata-utils'

export const metadata = generatePageMetadata({
  title: 'House Painting Cost Calculator | How Much Does It Cost to Paint a House?',
  description: 'Free house painting cost calculator. Get accurate estimates for interior and exterior house painting. Compare local contractor prices and find painters near you.',
  keywords: 'house painting cost calculator, how much does it cost to paint a house, house painters near me, house painting prices, interior house painting cost, exterior house painting cost, paint cost estimator, house paint calculator',
  path: '/house-painting-cost-calculator',
})

export default function HousePaintingCostCalculatorPage() {
  const costFactors = [
    {
      icon: <Home />,
      factor: "House Size",
      impact: "Most significant cost factor",
      range: "$1,500 - $15,000+",
      details: "Square footage determines material and labor needs"
    },
    {
      icon: <PaintBucket />,
      factor: "Paint Quality",
      impact: "Affects durability and appearance",
      range: "$30 - $80 per gallon",
      details: "Premium paints last 2-3x longer than basic options"
    },
    {
      icon: <Users />,
      factor: "Labor Costs",
      impact: "Varies by region and contractor",
      range: "$25 - $75 per hour",
      details: "Professional painters vs DIY can save 40-60%"
    },
    {
      icon: <Building2 />,
      factor: "Surface Condition",
      impact: "Prep work requirements",
      range: "+20% - 50% to base cost",
      details: "Scraping, priming, repairs add significant time"
    }
  ]

  const houseSizeCosts = [
    {
      size: "Small House (1,000-1,500 sq ft)",
      interior: "$2,500 - $4,500",
      exterior: "$3,000 - $6,500",
      both: "$5,500 - $11,000",
      rooms: "2-3 bedrooms, 1-2 bathrooms",
      timeframe: "3-7 days total"
    },
    {
      size: "Medium House (1,500-2,500 sq ft)",
      interior: "$3,500 - $7,500", 
      exterior: "$5,500 - $10,500",
      both: "$9,000 - $18,000",
      rooms: "3-4 bedrooms, 2-3 bathrooms",
      timeframe: "5-10 days total"
    },
    {
      size: "Large House (2,500-4,000 sq ft)",
      interior: "$6,000 - $12,000",
      exterior: "$9,500 - $16,000", 
      both: "$15,500 - $28,000",
      rooms: "4-5 bedrooms, 3-4 bathrooms",
      timeframe: "8-15 days total"
    },
    {
      size: "Luxury House (4,000+ sq ft)",
      interior: "$10,000 - $20,000+",
      exterior: "$15,000 - $30,000+",
      both: "$25,000 - $50,000+",
      rooms: "5+ bedrooms, 4+ bathrooms",
      timeframe: "12-25 days total"
    }
  ]

  const regionalPricing = [
    {
      region: "Northeast (NY, NJ, CT, MA)",
      laborRate: "$45 - $75/hour",
      interiorCost: "$3.50 - $6.50/sq ft",
      exteriorCost: "$2.50 - $4.50/sq ft",
      premium: "+25-40% above national average"
    },
    {
      region: "West Coast (CA, WA, OR)",
      laborRate: "$40 - $70/hour", 
      interiorCost: "$3.25 - $6.00/sq ft",
      exteriorCost: "$2.25 - $4.25/sq ft",
      premium: "+20-35% above national average"
    },
    {
      region: "Southeast (FL, GA, NC, SC)",
      laborRate: "$25 - $45/hour",
      interiorCost: "$2.00 - $4.00/sq ft", 
      exteriorCost: "$1.50 - $3.00/sq ft",
      premium: "5-15% below national average"
    },
    {
      region: "Midwest (IL, IN, OH, MI)",
      laborRate: "$25 - $50/hour",
      interiorCost: "$2.25 - $4.50/sq ft",
      exteriorCost: "$1.75 - $3.25/sq ft",
      premium: "National average pricing"
    },
    {
      region: "Southwest (TX, AZ, NV, NM)",
      laborRate: "$25 - $45/hour",
      interiorCost: "$2.00 - $4.25/sq ft",
      exteriorCost: "$1.50 - $3.25/sq ft",
      premium: "5-10% below national average"
    }
  ]

  const contractorTips = [
    {
      icon: <Target />,
      tip: "Get Multiple Quotes",
      description: "Compare at least 3 licensed contractors. Prices can vary 30-50% for the same job.",
      action: "Ask for detailed breakdowns to compare accurately"
    },
    {
      icon: <Shield />,
      tip: "Verify Licensing & Insurance",
      description: "Ensure contractors have proper licensing, liability insurance, and workers' compensation.",
      action: "Ask to see certificates and verify with issuing agencies"
    },
    {
      icon: <Star />,
      tip: "Check References & Reviews",
      description: "Look at recent work, read online reviews, and ask for customer references.",
      action: "Visit recent job sites if possible to see quality"
    },
    {
      icon: <Clock />,
      tip: "Understand Timeline",
      description: "Good contractors are often booked 2-4 weeks out. Beware of immediate availability.",
      action: "Plan your project during contractor's slower seasons"
    }
  ]

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            <span>House Painting Cost</span> Calculator
          </h1>
          <p>
            Get accurate estimates for <strong>interior and exterior house painting</strong>. 
            Compare costs, find qualified <strong>house painters near you</strong>, and make informed decisions for your project.
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="#calculator">
                Calculate House Painting Cost
                <Calculator />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#find-painters">
                Find Local Painters
              </Link>
            </Button>
          </div>
          
          <div>
            <div>
              <CheckCircle />
              <span>Instant estimates</span>
            </div>
            <div>
              <MapPin />
              <span>Local pricing data</span>
            </div>
            <div>
              <Home />
              <span>Interior & exterior</span>
            </div>
            <div>
              <Users />
              <span>Contractor finder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section>
        <div>
          <div>
            <h2>
              What Affects House Painting Costs?
            </h2>
            <p>
              Understanding these key factors helps you budget accurately and avoid surprises
            </p>
          </div>

          <div>
            {costFactors.map((factor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {factor.icon}
                  </div>
                  <CardTitle>{factor.factor}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <p>{factor.range}</p>
                      <p>{factor.impact}</p>
                    </div>
                    <div>
                      <p>{factor.details}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* House Size Cost Breakdown */}
      <section>
        <div>
          <div>
            <h2>
              House Painting Costs by Size
            </h2>
            <p>
              Typical cost ranges for interior, exterior, and complete house painting projects
            </p>
          </div>

          <div>
            {houseSizeCosts.map((house, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{house.size}</CardTitle>
                  <p>{house.rooms}</p>
                  <p>Project Timeline: {house.timeframe}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <div>
                        <p>Interior Only</p>
                        <p>{house.interior}</p>
                      </div>
                      <div>
                        <p>Exterior Only</p>
                        <p>{house.exterior}</p>
                      </div>
                      <div>
                        <p>Complete House</p>
                        <p>{house.both}</p>
                      </div>
                    </div>

                    <div>
                      <p>
                        <strong>Includes:</strong> Labor, materials, basic prep work, cleanup. Premium finishes and extensive repairs cost extra.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Pricing */}
      <section>
        <div>
          <div>
            <h2>
              House Painting Costs by Region
            </h2>
            <p>
              Labor costs and material prices vary significantly by geographic location
            </p>
          </div>

          <div>
            {regionalPricing.map((region, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{region.region}</CardTitle>
                  <p>{region.premium}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <div>
                        <p>Labor Rate</p>
                        <p>{region.laborRate}</p>
                      </div>
                      <div>
                        <p>Interior Cost</p>
                        <p>{region.interiorCost}</p>
                      </div>
                    </div>
                    <div>
                      <p>Exterior Cost per Sq Ft</p>
                      <p>{region.exteriorCost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3>
              National Average House Painting Costs
            </h3>
            <div>
              <div>
                <p>Interior Painting</p>
                <p>$2.75/sq ft</p>
                <p>Includes labor & materials</p>
              </div>
              <div>
                <p>Exterior Painting</p>
                <p>$2.25/sq ft</p>
                <p>Includes prep work & primer</p>
              </div>
              <div>
                <p>Complete House</p>
                <p>$12,500</p>
                <p>Average 2,500 sq ft home</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section id="calculator">
        <div>
          <div>
            <h2>
              House Painting Cost Calculator
            </h2>
            <p>
              Get an instant estimate for your house painting project
            </p>
          </div>
          
          <Card>
            <CardContent>
              <div>
                <h3>
                  🏠 Want Professional Results?
                </h3>
                <p>
                  This calculator gives rough estimates. For accurate quotes that account for your specific house 
                  and local conditions, connect with qualified painters in your area.
                </p>
                <Button asChild>
                  <Link href="#find-painters">
                    Find Local House Painters
                    <ArrowRight />
                  </Link>
                </Button>
              </div>

              <div>
                <div>
                  <h4>House Details</h4>
                  <div>
                    <div>
                      <label>House Square Footage</label>
                      <input type="number" placeholder="2000" />
                    </div>
                    <div>
                      <label>Number of Stories</label>
                      <select>
                        <option>1 Story</option>
                        <option>1.5 Stories</option>
                        <option>2 Stories</option>
                        <option>3+ Stories</option>
                      </select>
                    </div>
                    <div>
                      <label>Your Location</label>
                      <select>
                        <option>Northeast (High Cost)</option>
                        <option>West Coast (High Cost)</option>
                        <option>Southeast (Low Cost)</option>
                        <option>Midwest (Average Cost)</option>
                        <option>Southwest (Low Cost)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4>Project Scope</h4>
                  <div>
                    <div>
                      <label>Painting Type</label>
                      <select>
                        <option>Interior Only</option>
                        <option>Exterior Only</option>
                        <option>Complete House (Interior + Exterior)</option>
                      </select>
                    </div>
                    <div>
                      <label>Paint Quality</label>
                      <select>
                        <option>Standard Paint ($35-45/gallon)</option>
                        <option>Premium Paint ($50-65/gallon)</option>
                        <option>Ultra-Premium Paint ($70-85/gallon)</option>
                      </select>
                    </div>
                    <div>
                      <label>House Condition</label>
                      <select>
                        <option>Good (minimal prep needed)</option>
                        <option>Fair (moderate prep work)</option>
                        <option>Poor (extensive prep required)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <Button>
                Calculate House Painting Cost
                <Calculator />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Find Local Painters */}
      <section id="find-painters">
        <div>
          <div>
            <h2>
              Find Qualified House Painters Near You
            </h2>
            <p>
              Connect with licensed, insured contractors who provide detailed quotes and quality work
            </p>
          </div>

          <div>
            {contractorTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>{tip.icon}</div>
                  <CardTitle>{tip.tip}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tip.description}</p>
                  <p>✓ {tip.action}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent>
              <h3>
                Get Quotes from Pre-Screened House Painters
              </h3>
              <p>
                Connect with licensed, insured painting contractors in your area. 
                Compare quotes and read verified reviews before making your decision.
              </p>
              <div>
                <div>
                  <CheckCircle />
                  <span>Licensed & Insured</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Background Checked</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Customer Reviews</span>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/trial-signup">
                  Find Local Painters
                  <MapPin />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* For Contractors */}
      <section>
        <div>
          <div>
            <h2>
              For Painting Contractors: Calculate Your Revenue Potential
            </h2>
            <p>
              See how professional quote software helps house painters win more jobs and increase revenue
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div>
          <h2>
            Ready to Get Accurate House Painting Costs?
          </h2>
          <p>
            Use our calculator for estimates, then connect with qualified local painters for detailed quotes
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#calculator">
                Calculate Your Costs
                <Calculator />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/trial-signup">
                Find Local Painters
              </Link>
            </Button>
          </div>
          
          <div>
            <div>✓ Instant cost estimates</div>
            <div>✓ Regional pricing data</div>
            <div>✓ Licensed contractor network</div>
          </div>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "House Painting Cost Calculator",
            "description": "Calculate house painting costs for interior and exterior projects. Find local painters and compare quotes.",
            "url": "https://propaintquote.com/house-painting-cost-calculator",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "audience": {
              "@type": "Audience",
              "audienceType": "Homeowners"
            },
            "featureList": [
              "House painting cost calculator",
              "Interior painting estimates",
              "Exterior painting costs", 
              "Regional pricing data",
              "Local painter finder",
              "Quote comparison tool"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free house painting calculator"
            }
          })
        }}
      />
    </div>
  )
}