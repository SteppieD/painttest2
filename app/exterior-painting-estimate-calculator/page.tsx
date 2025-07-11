import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home,
  Building2,
  Palette,
  CloudRain,
  Sun,
  Shield,
  Ruler,
  DollarSign,
  Target,
  TrendingUp,
  Smartphone,
  TreePine,
  Thermometer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'

export const metadata: Metadata = {
  title: 'Exterior Painting Estimate Calculator | Free House Paint Cost Estimator',
  description: 'Free exterior painting estimate calculator. Get accurate costs for house exterior, siding, trim painting. Professional tool used by 5,000+ contractors nationwide.',
  keywords: 'exterior paint quote, exterior house paint estimate, exterior painting estimate, house exterior paint cost, siding painting estimate, exterior paint calculator, how to estimate exterior paint job, exterior paint cost calculator',
  alternates: {
    canonical: '/exterior-painting-estimate-calculator',
  },
  openGraph: {
    title: 'Exterior Painting Estimate Calculator - Free Professional Tool',
    description: 'Calculate accurate exterior house painting estimates. Professional calculator for siding, trim, and exterior surfaces.',
    url: '/exterior-painting-estimate-calculator',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

export default function ExteriorPaintingEstimateCalculatorPage() {
  const exteriorSurfaces = [
    {
      icon: <Home />,
      name: "Vinyl Siding",
      costPerSqFt: "$1.25 - $2.50",
      prepWork: "Pressure washing, caulking gaps",
      paintType: "100% acrylic latex",
      considerations: ["Surface texture", "Color retention", "Moisture protection"]
    },
    {
      icon: <Building2 />,
      name: "Wood Siding",
      costPerSqFt: "$1.75 - $3.25", 
      prepWork: "Scraping, sanding, priming",
      paintType: "High-quality acrylic",
      considerations: ["Rot inspection", "Primer requirement", "Stain blocking"]
    },
    {
      icon: <Shield />,
      name: "Brick & Masonry",
      costPerSqFt: "$1.50 - $3.00",
      prepWork: "Power washing, efflorescence removal",
      paintType: "Masonry-specific paint",
      considerations: ["Breathable paint", "Alkaline resistance", "Texture spray"]
    },
    {
      icon: <TreePine />,
      name: "Stucco",
      costPerSqFt: "$1.50 - $2.75",
      prepWork: "Cleaning, crack filling",
      paintType: "Elastomeric coating",
      considerations: ["Crack bridging", "Texture matching", "UV protection"]
    }
  ]

  const houseSizes = [
    {
      type: "Small House (1,000-1,500 sq ft)",
      exteriorSqFt: "1,200-1,800 sq ft",
      avgCost: "$3,000 - $6,500",
      paintNeeded: "8-12 gallons",
      timeEstimate: "3-5 days",
      crew: "2-3 painters"
    },
    {
      type: "Medium House (1,500-2,500 sq ft)", 
      exteriorSqFt: "1,800-3,000 sq ft",
      avgCost: "$5,500 - $10,500",
      paintNeeded: "12-18 gallons",
      timeEstimate: "5-8 days",
      crew: "3-4 painters"
    },
    {
      type: "Large House (2,500-4,000 sq ft)",
      exteriorSqFt: "3,000-4,800 sq ft",
      avgCost: "$9,500 - $16,000",
      paintNeeded: "18-25 gallons",
      timeEstimate: "8-12 days", 
      crew: "4-5 painters"
    },
    {
      type: "Two-Story House",
      exteriorSqFt: "2,200-3,500 sq ft",
      avgCost: "$7,000 - $13,500",
      paintNeeded: "15-22 gallons",
      timeEstimate: "6-10 days",
      crew: "3-4 painters"
    }
  ]

  const exteriorFactors = [
    {
      icon: <CloudRain />,
      factor: "Weather Conditions",
      impact: "Temperature 50-85°F, low humidity",
      cost: "Delays can add 20-30% to timeline"
    },
    {
      icon: <Ruler />,
      factor: "Surface Area Calculation",
      impact: "Height × Perimeter - Windows/Doors",
      cost: "Accurate measurement critical for materials"
    },
    {
      icon: <Palette />,
      factor: "Paint Quality",
      impact: "Premium vs standard exterior paint",
      cost: "$40-$80 per gallon difference"
    },
    {
      icon: <Shield />,
      factor: "Prep Work Required",
      impact: "Scraping, priming, caulking",
      cost: "30-50% of total project cost"
    },
    {
      icon: <Thermometer />,
      factor: "Number of Coats",
      impact: "Primer + 1-2 finish coats",
      cost: "Each additional coat adds 40% to materials"
    },
    {
      icon: <Building2 />,
      factor: "Architectural Details",
      impact: "Trim, shutters, complex features",
      cost: "Detail work: $3-8 per linear foot"
    }
  ]

  const seasonalConsiderations = [
    {
      season: "Spring (March-May)",
      pros: ["Mild temperatures", "Lower humidity", "High demand season"],
      cons: ["Rain delays possible", "Pollen issues", "Premium pricing"],
      ideal: "Best overall painting season"
    },
    {
      season: "Summer (June-August)", 
      pros: ["Consistent weather", "Long daylight hours", "Fast cure times"],
      cons: ["Heat stress on workers", "Paint dries too fast", "Peak pricing"],
      ideal: "Good for quick turnaround projects"
    },
    {
      season: "Fall (September-November)",
      pros: ["Stable weather", "Lower humidity", "Competitive pricing"],
      cons: ["Shorter days", "Leaf debris", "Rain season starting"],
      ideal: "Excellent value season"
    },
    {
      season: "Winter (December-February)",
      pros: ["Lowest pricing", "Available contractors", "Indoor prep work"],
      cons: ["Temperature limits", "Shorter days", "Weather delays"],
      ideal: "Planning and preparation season"
    }
  ]

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Free <span>Exterior Painting</span> Estimate Calculator
          </h1>
          <p>
            Get accurate estimates for <strong>house exterior, siding, trim, and outdoor surfaces</strong>. 
            Professional calculator used by <strong>5,000+ contractors</strong> for precise exterior painting quotes.
          </p>
          
          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Try Professional Calculator Free
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#calculator">
                Use Basic Calculator Below
              </Link>
            </Button>
          </div>
          
          <div>
            <div>
              <CheckCircle />
              <span>Weather considerations</span>
            </div>
            <div>
              <Calculator />
              <span>Surface-specific pricing</span>
            </div>
            <div>
              <Home />
              <span>All exterior surfaces</span>
            </div>
            <div>
              <Smartphone />
              <span>Mobile-friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Exterior Surface Types */}
      <section>
        <div>
          <div>
            <h2>
              Exterior Painting Estimates by Surface Type
            </h2>
            <p>
              Different exterior surfaces require specific preparation, paint types, and pricing
            </p>
          </div>

          <div>
            {exteriorSurfaces.map((surface, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {surface.icon}
                  </div>
                  <CardTitle>{surface.name}</CardTitle>
                  <p>{surface.costPerSqFt}/sq ft</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <h4>Prep Work:</h4>
                      <p>{surface.prepWork}</p>
                    </div>
                    <div>
                      <h4>Paint Type:</h4>
                      <p>{surface.paintType}</p>
                    </div>
                    <div>
                      <h4>Key Factors:</h4>
                      <ul>
                        {surface.considerations.map((factor, i) => (
                          <li key={i}>
                            <span>•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* House Size Estimates */}
      <section>
        <div>
          <div>
            <h2>
              Exterior House Painting Estimates by Size
            </h2>
            <p>
              Complete exterior painting costs based on house size and complexity
            </p>
          </div>

          <div>
            {houseSizes.map((house, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{house.type}</CardTitle>
                  <p>Exterior Surface: {house.exteriorSqFt}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <div>
                        <p>Total Cost Range</p>
                        <p>{house.avgCost}</p>
                      </div>
                      <div>
                        <p>Paint Needed</p>
                        <p>{house.paintNeeded}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div>
                        <p>Time Estimate</p>
                        <p>{house.timeEstimate}</p>
                      </div>
                      <div>
                        <p>Crew Size</p>
                        <p>{house.crew}</p>
                      </div>
                    </div>

                    <div>
                      <p>
                        <strong>Includes:</strong> Power washing, minor repairs, primer, 2 coats quality exterior paint
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Factors */}
      <section>
        <div>
          <div>
            <h2>
              Key Factors in Exterior Painting Estimates
            </h2>
            <p>
              Professional considerations that affect exterior painting costs and timelines
            </p>
          </div>

          <div>
            {exteriorFactors.map((factor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    {factor.icon}
                    <span>{factor.factor}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <p>Impact:</p>
                      <p>{factor.impact}</p>
                    </div>
                    <div>
                      <p>Cost Effect:</p>
                      <p>{factor.cost}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3>
              Complete Exterior Painting Formula
            </h3>
            <div>
              <p>
                Surface Area × Cost per Sq Ft + Prep Work + Materials + Overhead + Profit
              </p>
              <p>
                Example: 2,000 sq ft × $2.25 + $800 prep + $600 materials + $510 overhead + $680 profit = <strong>$6,090 total</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Considerations */}
      <section>
        <div>
          <div>
            <h2>
              Best Time for Exterior Painting
            </h2>
            <p>
              Seasonal factors that affect exterior painting success and pricing
            </p>
          </div>

          <div>
            {seasonalConsiderations.map((season, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{season.season}</CardTitle>
                  <p>{season.ideal}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <h4>Advantages:</h4>
                      <ul>
                        {season.pros.map((pro, i) => (
                          <li key={i}>
                            <CheckCircle />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4>Challenges:</h4>
                      <ul>
                        {season.cons.map((con, i) => (
                          <li key={i}>
                            <span>•</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Basic Calculator Section */}
      <section id="calculator">
        <div>
          <div>
            <h2>
              Quick Exterior Paint Calculator
            </h2>
            <p>
              Get an instant estimate for your exterior painting project
            </p>
          </div>
          
          <Card>
            <CardContent>
              <div>
                <h3>
                  🎯 Want Weather-Resistant Results?
                </h3>
                <p>
                  This basic calculator gives rough estimates. For exterior projects that last 10+ years, 
                  contractors use our professional software with climate-specific recommendations.
                </p>
                <Button asChild>
                  <Link href="/trial-signup">
                    Try Professional Calculator Free
                    <ArrowRight />
                  </Link>
                </Button>
              </div>

              <div>
                <div>
                  <h4>House Dimensions</h4>
                  <div>
                    <div>
                      <label>House Height (feet)</label>
                      <input type="number" placeholder="20" />
                    </div>
                    <div>
                      <label>House Perimeter (feet)</label>
                      <input type="number" placeholder="150" />
                    </div>
                    <div>
                      <label>Stories</label>
                      <select>
                        <option>1 Story</option>
                        <option>1.5 Stories</option>
                        <option>2 Stories</option>
                        <option>3+ Stories</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4>Surface Details</h4>
                  <div>
                    <div>
                      <label>Surface Type</label>
                      <select>
                        <option>Vinyl Siding</option>
                        <option>Wood Siding</option>
                        <option>Brick/Masonry</option>
                        <option>Stucco</option>
                        <option>Mixed Surfaces</option>
                      </select>
                    </div>
                    <div>
                      <label>Paint Quality</label>
                      <select>
                        <option>Standard Exterior ($45/gallon)</option>
                        <option>Premium Exterior ($65/gallon)</option>
                        <option>Ultra-Premium ($85/gallon)</option>
                      </select>
                    </div>
                    <div>
                      <label>Condition</label>
                      <select>
                        <option>Good (minimal prep)</option>
                        <option>Fair (moderate prep)</option>
                        <option>Poor (extensive prep)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <Button>
                Calculate Exterior Paint Estimate
                <Calculator />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Professional ROI Calculator */}
      <section>
        <div>
          <div>
            <h2>
              For Contractors: Calculate Your Revenue Potential
            </h2>
            <p>
              See how professional quote software increases your exterior painting business revenue
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Why Contractors Choose Our Calculator */}
      <section>
        <div>
          <div>
            <h2>
              Why 5,000+ Contractors Trust Our Exterior Paint Calculator
            </h2>
            <p>
              Professional features designed for exterior painting challenges
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <CloudRain />
                  Weather-Smart Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Our calculator factors in seasonal pricing, weather delays, and optimal painting conditions 
                  for exterior projects that last 10+ years.
                </p>
                <p>
                  ✓ Climate-specific paint recommendations included
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Shield />
                  Surface-Specific Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Different exterior surfaces require unique prep work, paint types, and application methods. 
                  Our calculator handles all surface variations automatically.
                </p>
                <p>
                  ✓ Vinyl, wood, brick, stucco, and mixed surfaces covered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingUp />
                  Win More Exterior Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Professional exterior painting quotes show homeowners you understand the complexity 
                  of outdoor projects and weather protection requirements.
                </p>
                <p>
                  ✓ 40-60% higher win rates with detailed exterior quotes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Smartphone />
                  On-Site Estimates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Walk around the house with customers, input measurements and surface conditions, 
                  and deliver professional exterior quotes immediately.
                </p>
                <p>
                  ✓ Close exterior projects while walking the property
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div>
          <h2>
            Ready for Professional Exterior Paint Quotes?
          </h2>
          <p>
            Join contractors who've increased their exterior painting revenue by 40-60% with weather-smart quote software
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Included
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/painting-contractors">
                Learn More About Our Software
              </Link>
            </Button>
          </div>
          
          <div>
            <div>✓ All exterior surfaces covered</div>
            <div>✓ Weather considerations included</div>
            <div>✓ Mobile-friendly calculator</div>
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
            "name": "Exterior Painting Estimate Calculator",
            "description": "Free exterior house painting estimate calculator for all surface types and weather conditions.",
            "url": "https://propaintquote.com/exterior-painting-estimate-calculator",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "audience": {
              "@type": "Audience",
              "audienceType": "Painting Contractors"
            },
            "featureList": [
              "House exterior calculations",
              "Surface-specific pricing", 
              "Weather considerations",
              "Siding painting estimates",
              "Trim and detail work",
              "Seasonal pricing factors"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free exterior painting calculator"
            }
          })
        }}
      />
    </div>
  )
}