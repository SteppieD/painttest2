'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, TrendingUp, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TestimonialData {
  id: number
  name: string
  company: string
  location: string
  quote: string
  avatar: string
  beforeStats: {
    winRate: string
    monthlyRevenue: string
    quotesPerMonth: number
    timePerQuote: string
  }
  afterStats: {
    winRate: string
    monthlyRevenue: string
    quotesPerMonth: number
    timePerQuote: string
  }
  keyBenefit: string
  businessType: string
}

interface TestimonialCarouselProps {
  className?: string
  autoPlay?: boolean
  interval?: number
}

export function TestimonialCarousel({ 
  className, 
  autoPlay = true, 
  interval = 8000 
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials: TestimonialData[] = [
    {
      id: 1,
      name: "Mike Johnson",
      company: "Elite Painting Co.",
      location: "Austin, Texas",
      quote: "My closing rate has skyrocketed from 25% to 45%. The estimates look super professional and I can deliver them while I'm still at the customer's house. Best investment I've made for my painting business.",
      avatar: "MJ",
      beforeStats: {
        winRate: "25%",
        monthlyRevenue: "$12,000",
        quotesPerMonth: 15,
        timePerQuote: "4-6 hours"
      },
      afterStats: {
        winRate: "45%",
        monthlyRevenue: "$20,400",
        quotesPerMonth: 25,
        timePerQuote: "6 minutes"
      },
      keyBenefit: "Revenue increased 70% in 3 months",
      businessType: "Solo Contractor"
    },
    {
      id: 2,
      name: "Sarah Rodriguez",
      company: "ColorCraft Painters",
      location: "San Diego, California", 
      quote: "Our quotation rate increased from 50 to over 200 per month. It has increased the speed that we can win work four times over. The professional presentation gives customers confidence in our work.",
      avatar: "SR",
      beforeStats: {
        winRate: "35%",
        monthlyRevenue: "$28,000",
        quotesPerMonth: 50,
        timePerQuote: "3-5 hours"
      },
      afterStats: {
        winRate: "62%",
        monthlyRevenue: "$43,200",
        quotesPerMonth: 200,
        timePerQuote: "8 minutes"
      },
      keyBenefit: "300% increase in quote volume",
      businessType: "Small Team (3 employees)"
    },
    {
      id: 3,
      name: "Tom Williams",
      company: "Premier Paint Solutions",
      location: "Charlotte, North Carolina",
      quote: "Managing 3 crews across 2 cities is now effortless. Our profit margins increased 25% and we're closing deals faster than ever. The analytics help us optimize our pricing strategy.",
      avatar: "TW",
      beforeStats: {
        winRate: "40%",
        monthlyRevenue: "$65,000",
        quotesPerMonth: 80,
        timePerQuote: "2-4 hours"
      },
      afterStats: {
        winRate: "65%",
        monthlyRevenue: "$90,200",
        quotesPerMonth: 120,
        timePerQuote: "5 minutes"
      },
      keyBenefit: "25% profit margin improvement",
      businessType: "Growing Business (8 employees)"
    },
    {
      id: 4,
      name: "Lisa Chen", 
      company: "Precision Painting",
      location: "Denver, Colorado",
      quote: "I was skeptical about digital tools, but this changed everything. My customers love getting quotes immediately, and I love winning more jobs. The time savings alone pays for itself.",
      avatar: "LC",
      beforeStats: {
        winRate: "30%",
        monthlyRevenue: "$18,000",
        quotesPerMonth: 20,
        timePerQuote: "5-7 hours"
      },
      afterStats: {
        winRate: "55%",
        monthlyRevenue: "$31,500",
        quotesPerMonth: 35,
        timePerQuote: "10 minutes"
      },
      keyBenefit: "75% revenue increase in 6 months",
      businessType: "Family Business"
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, testimonials.length])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Real Results from Real Contractors
          </h2>
          <p className="text-xl text-gray-600">
            See how painting contractors across America have transformed their businesses with professional quoting
          </p>
        </div>

        <div className="relative">
          {/* Main Testimonial Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side - Testimonial */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {currentTestimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {currentTestimonial.name}
                      </h3>
                      <p>{currentTestimonial.company}</p>
                      <p>{currentTestimonial.location}</p>
                      <p>{currentTestimonial.businessType}</p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg text-gray-700 italic">
                    "{currentTestimonial.quote}"
                  </blockquote>

                  {/* Key Benefit */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <TrendingUp className="w-5 h-5" />
                      <span>
                        {currentTestimonial.keyBenefit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Before/After Stats */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-6 text-center">
                    Before vs. After Results
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Before Column */}
                    <div>
                      <h5 className="font-semibold text-gray-500 mb-3 text-center">Before</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Win Rate:</span>
                          <span className="font-semibold">{currentTestimonial.beforeStats.winRate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-semibold">{currentTestimonial.beforeStats.monthlyRevenue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Quotes/Month:</span>
                          <span className="font-semibold">{currentTestimonial.beforeStats.quotesPerMonth}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time/Quote:</span>
                          <span className="font-semibold">{currentTestimonial.beforeStats.timePerQuote}</span>
                        </div>
                      </div>
                    </div>

                    {/* After Column */}
                    <div>
                      <h5 className="font-semibold text-green-600 mb-3 text-center">After</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Win Rate:</span>
                          <span className="font-semibold text-green-600">{currentTestimonial.afterStats.winRate}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-semibold text-green-600">{currentTestimonial.afterStats.monthlyRevenue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Quotes/Month:</span>
                          <span className="font-semibold text-green-600">{currentTestimonial.afterStats.quotesPerMonth}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time/Quote:</span>
                          <span className="font-semibold text-green-600">{currentTestimonial.afterStats.timePerQuote}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="border-t pt-4">
                    <h5 className="font-semibold mb-3 text-center">Impact Summary</h5>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-green-600">
                          +{Math.round(((parseInt(currentTestimonial.afterStats.monthlyRevenue.replace(/[,$]/g, '')) - parseInt(currentTestimonial.beforeStats.monthlyRevenue.replace(/[,$]/g, ''))) / parseInt(currentTestimonial.beforeStats.monthlyRevenue.replace(/[,$]/g, ''))) * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                      <div>
                        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-green-600">
                          +{parseInt(currentTestimonial.afterStats.winRate) - parseInt(currentTestimonial.beforeStats.winRate)}%
                        </div>
                        <div className="text-xs text-gray-600">Win Rate</div>
                      </div>
                      <div>
                        <Clock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-green-600">
                          {currentTestimonial.afterStats.quotesPerMonth - currentTestimonial.beforeStats.quotesPerMonth}+
                        </div>
                        <div className="text-xs text-gray-600">More Quotes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
          >
            <ChevronRight />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Overall Industry Stats */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Industry-Wide Results</h3>
            <p className="text-gray-600">Based on data from 5,000+ active contractors using our platform</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">47%</div>
              <p className="text-sm text-gray-600 mt-1">Average win rate increase</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">$8,400</div>
              <p className="text-sm text-gray-600 mt-1">Average monthly revenue increase</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.2x</div>
              <p className="text-sm text-gray-600 mt-1">Faster quote delivery</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">94%</div>
              <p className="text-sm text-gray-600 mt-1">Customer satisfaction rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}