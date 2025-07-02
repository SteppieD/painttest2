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
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">Serving {city}, {stateAbbr} & Surrounding Areas</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Painting Contractors in {city}, {state}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional painting quote software trusted by {localStats.contractorsServed}+ contractors 
              in {city}. Generate accurate quotes in 6 minutes, win 40-60% more jobs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trial-signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowQuoteForm(true)}
              >
                <Calculator className="mr-2 w-4 h-4" />
                Try Quote Calculator
              </Button>
            </div>
          </div>
          
          {/* Local Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {localStats.contractorsServed}+
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {city} Contractors
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {localStats.quotesGenerated}+
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Quotes Generated
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {localStats.avgQuoteTime}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Avg Quote Time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {localStats.winRateIncrease}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Win Rate Increase
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Local Market Insights */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {city} Painting Market Insights
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Market Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{population}</p>
                <p className="text-gray-600">Population in metro area</p>
                <p className="text-sm text-gray-500 mt-4">
                  Large residential market with consistent demand for painting services
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Average Home Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{avgHomePrice}</p>
                <p className="text-gray-600">Median home price</p>
                <p className="text-sm text-gray-500 mt-4">
                  Higher property values mean larger painting project budgets
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Project Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">{avgProjectSize}</p>
                <p className="text-gray-600">Average project value</p>
                <p className="text-sm text-gray-500 mt-4">
                  Typical interior/exterior residential painting projects
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      {showQuoteForm && (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Quick Paint Estimate Calculator for {city} Projects
            </h2>
            <QuickPaintCalculator />
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why {city} Painting Contractors Choose ProPaint Quote
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Same-Day Quotes
                </h3>
                <p className="text-gray-600">
                  Generate professional quotes in 6 minutes while on-site. 
                  Beat competitors who take days to respond.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Local Market Data
                </h3>
                <p className="text-gray-600">
                  Pre-configured with {city} area pricing, labor rates, 
                  and material costs for accurate estimates.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Professional Image
                </h3>
                <p className="text-gray-600">
                  Stand out from {city} competitors with branded, 
                  detailed quotes that win trust instantly.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Never Lose a Quote
                </h3>
                <p className="text-gray-600">
                  Cloud-based system ensures all your {city} area quotes 
                  are saved and accessible anywhere.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Zap className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Win More Jobs
                </h3>
                <p className="text-gray-600">
                  {city} contractors report 40-60% higher win rates 
                  with faster, professional quotes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Phone className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Mobile Ready
                </h3>
                <p className="text-gray-600">
                  Quote from anywhere in {city} - works on phone, 
                  tablet, or laptop with no downloads.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Serving All {city} Neighborhoods
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nearbyAreas.map((area) => (
              <div key={area} className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">{area}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-gray-600 mt-8">
            Plus all surrounding {city} metro areas within 50 miles
          </p>
        </div>
      </section>

      {/* Testimonials */}
      {localTestimonials && localTestimonials.length > 0 && (
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              What {city} Painting Contractors Say
            </h2>
            <TestimonialCarousel testimonials={localTestimonials} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join {localStats.contractorsServed}+ {city} Contractors 
            Winning More Jobs
          </h2>
          
          <p className="text-xl mb-8 opacity-90">
            Start your 14-day free trial today. No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trial-signup">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Pricing
              </Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm opacity-75">
            Join the painting contractors in {city} who are modernizing their business
          </p>
        </div>
      </section>
    </div>
  )
}