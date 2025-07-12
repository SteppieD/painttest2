import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Home,
  Palette,
  DollarSign,
  Ruler,
  PaintBucket,
  Target,
  TrendingUp,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'
import { RoomCalculatorWidget } from '@/components/calculators/room-calculator-widget'

export const metadata: Metadata = {
  title: 'Interior Painting Quote Calculator | Free Estimate Tool for Contractors',
  description: 'Free interior painting quote calculator. Get accurate estimates for bedroom, bathroom, apartment, and house interior painting. Used by 5,000+ professional contractors.',
  keywords: 'interior painting quote, interior paint quote, interior house painting quote, apartment painting quote, bedroom painting quote, bathroom painting quote, interior paint estimate template, interior home paint estimate, interior paint calculator, wall paint calculator',
  alternates: {
    canonical: '/interior-painting-quote-calculator',
  },
  openGraph: {
    title: 'Interior Painting Quote Calculator - Free Professional Tool',
    description: 'Calculate accurate interior painting quotes in minutes. Professional tool used by contractors nationwide.',
    url: '/interior-painting-quote-calculator',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
}

export default function InteriorPaintingQuoteCalculatorPage() {
  const roomTypes = [
    {
      icon: <Home />,
      name: "Living Room",
      avgSize: "12' x 15'",
      avgCost: "$450 - $750",
      timeEstimate: "1-2 days",
      considerations: ["High ceiling areas", "Multiple windows", "Built-in features"]
    },
    {
      icon: <Palette />,
      name: "Bedroom",
      avgSize: "10' x 12'", 
      avgCost: "$300 - $550",
      timeEstimate: "1 day",
      considerations: ["Closet interiors", "Accent walls", "Ceiling fans"]
    },
    {
      icon: <PaintBucket />,
      name: "Bathroom",
      avgSize: "8' x 10'",
      avgCost: "$200 - $400", 
      timeEstimate: "0.5-1 day",
      considerations: ["Moisture-resistant paint", "Ventilation", "Trim work"]
    },
    {
      icon: <DollarSign />,
      name: "Kitchen",
      avgSize: "10' x 12'",
      avgCost: "$350 - $600",
      timeEstimate: "1-1.5 days",
      considerations: ["Grease-resistant paint", "Cabinet areas", "Backsplash coordination"]
    }
  ]

  const apartmentSizes = [
    {
      type: "Studio Apartment",
      sqft: "400-600 sq ft",
      rooms: "1 main room + bathroom",
      avgCost: "$800 - $1,200",
      paintNeeded: "2-3 gallons"
    },
    {
      type: "1 Bedroom Apartment", 
      sqft: "600-900 sq ft",
      rooms: "Bedroom, living room, kitchen, bathroom",
      avgCost: "$1,200 - $1,800",
      paintNeeded: "3-4 gallons"
    },
    {
      type: "2 Bedroom Apartment",
      sqft: "900-1,200 sq ft", 
      rooms: "2 bedrooms, living room, kitchen, bathroom",
      avgCost: "$1,800 - $2,500",
      paintNeeded: "4-6 gallons"
    },
    {
      type: "3 Bedroom House Interior",
      sqft: "1,500-2,000 sq ft",
      rooms: "3 bedrooms, living areas, kitchen, 2 bathrooms",
      avgCost: "$2,500 - $4,000", 
      paintNeeded: "6-8 gallons"
    }
  ]

  const calculationFactors = [
    {
      icon: <Ruler />,
      factor: "Wall Area Calculation",
      formula: "Length × Width × Height - Doors & Windows",
      example: "12' × 15' × 9' = 1,620 sq ft - 120 sq ft = 1,500 sq ft"
    },
    {
      icon: <PaintBucket />,
      factor: "Paint Coverage",
      formula: "400 sq ft per gallon (average)",
      example: "1,500 sq ft ÷ 400 = 3.75 gallons needed"
    },
    {
      icon: <DollarSign />,
      factor: "Labor Costs",
      formula: "$1.50 - $3.50 per sq ft",
      example: "1,500 sq ft × $2.50 = $3,750 labor"
    },
    {
      icon: <Clock />,
      factor: "Time Estimation",
      formula: "200-300 sq ft per hour",
      example: "1,500 sq ft ÷ 250 = 6 hours work"
    }
  ]

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Free <span>Interior Painting Quote</span> Calculator
          </h1>
          <p>
            Get accurate estimates for <strong>bedrooms, bathrooms, apartments, and house interiors</strong>. 
            Professional calculator used by <strong>5,000+ contractors</strong> for precise interior painting quotes.
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
              <span>Instant estimates</span>
            </div>
            <div>
              <Calculator />
              <span>Industry-standard formulas</span>
            </div>
            <div>
              <Home />
              <span>All room types</span>
            </div>
            <div>
              <Smartphone />
              <span>Mobile-friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Room-by-Room Estimates */}
      <section>
        <div>
          <div>
            <h2>
              Interior Painting Quotes by Room Type
            </h2>
            <p>
              Average costs and considerations for different interior spaces
            </p>
          </div>

          <div>
            {roomTypes.map((room, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {room.icon}
                  </div>
                  <CardTitle>{room.name}</CardTitle>
                  <p>Average: {room.avgSize}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <span>Cost Range:</span>
                      <span>{room.avgCost}</span>
                    </div>
                    <div>
                      <span>Time:</span>
                      <span>{room.timeEstimate}</span>
                    </div>
                    <div>
                      <h4>Key Factors:</h4>
                      <ul>
                        {room.considerations.map((factor, i) => (
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

      {/* Apartment & House Interior Quotes */}
      <section>
        <div>
          <div>
            <h2>
              Apartment & House Interior Painting Quotes
            </h2>
            <p>
              Complete interior painting estimates by property size
            </p>
          </div>

          <div>
            {apartmentSizes.map((property, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{property.type}</CardTitle>
                  <p>{property.sqft}</p>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <h4>Included Areas:</h4>
                      <p>{property.rooms}</p>
                    </div>
                    
                    <div>
                      <div>
                        <p>Total Cost Range</p>
                        <p>{property.avgCost}</p>
                      </div>
                      <div>
                        <p>Paint Needed</p>
                        <p>{property.paintNeeded}</p>
                      </div>
                    </div>

                    <div>
                      <p>
                        <strong>Pro Tip:</strong> Add 15-20% for primer, ceiling paint, and touch-ups
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculation Guide */}
      <section>
        <div>
          <div>
            <h2>
              How to Calculate Interior Painting Quotes
            </h2>
            <p>
              Professional formulas contractors use for accurate interior paint estimates
            </p>
          </div>

          <div>
            {calculationFactors.map((factor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    {factor.icon}
                    {factor.factor}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <p>Formula:</p>
                      <p>{factor.formula}</p>
                    </div>
                    <div>
                      <p>Example:</p>
                      <p>{factor.example}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3>
              Complete Interior Quote Formula
            </h3>
            <div>
              <p>
                Materials + Labor + Overhead (15%) + Profit (20%) = Total Quote
              </p>
              <p>
                Example: $200 materials + $750 labor + $143 overhead + $219 profit = <strong>$1,312 total</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Basic Calculator Section */}
      <section id="calculator">
        <div>
          <div>
            <h2>
              Quick Interior Paint Calculator
            </h2>
            <p>
              Get an instant estimate for your interior painting project
            </p>
          </div>
          
          <Card>
            <CardContent>
              <div>
                <h3>
                  🎯 Want Professional Results?
                </h3>
                <p>
                  This basic calculator gives rough estimates. For accurate quotes that win jobs, 
                  contractors use our professional software with industry-standard formulas.
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
                  <h4>Room Dimensions</h4>
                  <div>
                    <div>
                      <label>Length (feet)</label>
                      <input type="number" placeholder="12" />
                    </div>
                    <div>
                      <label>Width (feet)</label>
                      <input type="number" placeholder="15" />
                    </div>
                    <div>
                      <label>Height (feet)</label>
                      <input type="number" placeholder="9" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4>Project Details</h4>
                  <div>
                    <div>
                      <label>Number of Doors</label>
                      <input type="number" placeholder="2" />
                    </div>
                    <div>
                      <label>Number of Windows</label>
                      <input type="number" placeholder="3" />
                    </div>
                    <div>
                      <label>Paint Quality</label>
                      <select>
                        <option>Standard ($35/gallon)</option>
                        <option>Premium ($50/gallon)</option>
                        <option>Designer ($70/gallon)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <Button>
                Calculate Interior Paint Quote
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
              See how professional quote software increases your interior painting business revenue
            </p>
          </div>
          
          <ROICalculator />
          
          <div>
            <h3>
              Try Our Room-by-Room Calculator
            </h3>
            <p>
              See how professionals calculate interior paint costs room by room
            </p>
            <div>
              <RoomCalculatorWidget title="Professional Room Calculator" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Contractors Choose Our Calculator */}
      <section>
        <div>
          <div>
            <h2>
              Why 5,000+ Contractors Trust Our Interior Paint Calculator
            </h2>
            <p>
              Professional features that help you win more interior painting jobs
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Target />
                  Accurate Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Industry-standard formulas ensure your interior paint quotes are competitive yet profitable. 
                  Never underestimate bedroom, bathroom, or apartment painting jobs again.
                </p>
                <p>
                  ✓ Wall area calculations with door/window deductions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Clock />
                  Save Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Generate interior painting quotes in 6 minutes instead of hours. Perfect for apartment buildings, 
                  house interiors, and multi-room projects.
                </p>
                <p>
                  ✓ Mobile calculator works on-site during consultations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingUp />
                  Win More Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Professional interior paint quotes increase win rates by 40-60%. Customers trust contractors 
                  who use modern tools and provide detailed estimates.
                </p>
                <p>
                  ✓ Branded quotes with your company logo and colors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Smartphone />
                  Work Anywhere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Calculate interior paint quotes on your phone or tablet while walking through bedrooms, 
                  bathrooms, and living spaces with customers.
                </p>
                <p>
                  ✓ Close deals while excitement is high
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
            Ready for Professional Interior Paint Quotes?
          </h2>
          <p>
            Join contractors who've increased their interior painting revenue by 40-60% with professional quote software
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
            <div>✓ All room types covered</div>
            <div>✓ Professional presentation</div>
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
            "name": "Interior Painting Quote Calculator",
            "description": "Free interior painting quote calculator for bedrooms, bathrooms, apartments, and house interiors.",
            "url": "https://propaintquote.com/interior-painting-quote-calculator",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "audience": {
              "@type": "Audience",
              "audienceType": "Painting Contractors"
            },
            "featureList": [
              "Room-by-room calculations",
              "Apartment painting quotes", 
              "Bedroom painting estimates",
              "Bathroom painting costs",
              "Wall area calculator",
              "Paint coverage calculator"
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free interior painting calculator"
            }
          })
        }}
      />
    </div>
  )
}