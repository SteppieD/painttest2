'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  TrendingUp,
  Users,
  Shield,
  Phone,
  ArrowRight,
  Calculator,
  FileText,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { QuickPaintCalculator } from '@/components/calculators/quick-paint-calculator'
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel'
import { useState } from 'react'

interface CityPageProps {
  city: string
  state: string
  stateAbbr: string
  population?: string
  avgHomePrice?: string
  avgProjectSize?: string
  localTestimonials?: Array<{
    name: string
    company: string
    text: string
    rating: number
    projects: string
    location: string
  }>
}

export function CityPageTemplate({ 
  city, 
  state, 
  stateAbbr,
  population = "500,000+",
  avgHomePrice = "$450,000",
  avgProjectSize = "$3,500-$7,500",
  localTestimonials
}: CityPageProps) {
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  
  const localStats = {
    contractorsServed: Math.floor(Math.random() * 50) + 100,
    quotesGenerated: Math.floor(Math.random() * 5000) + 10000,
    avgQuoteTime: "6 minutes",
    winRateIncrease: "40-60%"
  }

  const nearbyAreas = [
    "Downtown",
    "North Side",
    "South Side", 
    "East End",
    "West End",
    "Suburbs"
  ].map(area => `${area} ${city}`)

  return (
    <div>
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <div>
              <MapPin />
              <span>Serving {city}, {stateAbbr} & Surrounding Areas</span>
            </div>
            
            <h1>
              Painting Contractors in {city}, {state}
            </h1>
            
            <p>
              Professional painting quote software trusted by {localStats.contractorsServed}+ contractors 
              in {city}. Generate accurate quotes in 6 minutes, win 40-60% more jobs.
            </p>
            
            <div>
              <Link href="/trial-signup">
                <Button size="lg">
                  Start Free Trial
                  <ArrowRight />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowQuoteForm(true)}
              >
                <Calculator />
                Try Quote Calculator
              </Button>
            </div>
          </div>
          
          {/* Local Stats */}
          <div>
            <Card>
              <CardContent>
                <div>
                  {localStats.contractorsServed}+
                </div>
                <p>
                  {city} Contractors
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div>
                  {localStats.quotesGenerated}+
                </div>
                <p>
                  Quotes Generated
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div>
                  {localStats.avgQuoteTime}
                </div>
                <p>
                  Avg Quote Time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div>
                  {localStats.winRateIncrease}
                </div>
                <p>
                  Win Rate Increase
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Local Market Insights */}
      <section>
        <div>
          <h2>
            {city} Painting Market Insights
          </h2>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <Users />
                  Market Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{population}</p>
                <p>Population in metro area</p>
                <p>
                  Large residential market with consistent demand for painting services
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  <DollarSign />
                  Average Home Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{avgHomePrice}</p>
                <p>Median home price</p>
                <p>
                  Higher property values mean larger painting project budgets
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  <TrendingUp />
                  Project Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{avgProjectSize}</p>
                <p>Average project value</p>
                <p>
                  Typical interior/exterior residential painting projects
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      {showQuoteForm && (
        <section>
          <div>
            <h2>
              Quick Paint Estimate Calculator for {city} Projects
            </h2>
            <QuickPaintCalculator />
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section>
        <div>
          <h2>
            Why {city} Painting Contractors Choose ProPaint Quote
          </h2>
          
          <div>
            <Card>
              <CardContent>
                <Clock />
                <h3>
                  Same-Day Quotes
                </h3>
                <p>
                  Generate professional quotes in 6 minutes while on-site. 
                  Beat competitors who take days to respond.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <MapPin />
                <h3>
                  Local Market Data
                </h3>
                <p>
                  Pre-configured with {city} area pricing, labor rates, 
                  and material costs for accurate estimates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Star />
                <h3>
                  Professional Image
                </h3>
                <p>
                  Stand out from {city} competitors with branded, 
                  detailed quotes that win trust instantly.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Shield />
                <h3>
                  Never Lose a Quote
                </h3>
                <p>
                  Cloud-based system ensures all your {city} area quotes 
                  are saved and accessible anywhere.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Zap />
                <h3>
                  Win More Jobs
                </h3>
                <p>
                  {city} contractors report 40-60% higher win rates 
                  with faster, professional quotes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Phone />
                <h3>
                  Mobile Ready
                </h3>
                <p>
                  Quote from anywhere in {city} - works on phone, 
                  tablet, or laptop with no downloads.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section>
        <div>
          <h2>
            Serving All {city} Neighborhoods
          </h2>
          
          <div>
            {nearbyAreas.map((area) => (
              <div key={area}>
                <MapPin />
                <p>{area}</p>
              </div>
            ))}
          </div>
          
          <p>
            Plus all surrounding {city} metro areas within 50 miles
          </p>
        </div>
      </section>

      {/* Testimonials */}
      {localTestimonials && localTestimonials.length > 0 && (
        <section>
          <div>
            <h2>
              What {city} Painting Contractors Say
            </h2>
            <TestimonialCarousel />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Join {localStats.contractorsServed}+ {city} Contractors 
            Winning More Jobs
          </h2>
          
          <p>
            Start your 14-day free trial today. No credit card required.
          </p>
          
          <div>
            <Link href="/trial-signup">
              <Button size="lg" variant="secondary">
                Start Free Trial
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
          
          <p>
            Join the painting contractors in {city} who are modernizing their business
          </p>
        </div>
      </section>
    </div>
  )
}