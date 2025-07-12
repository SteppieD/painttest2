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
    <section`}>
      <div>
        <div>
          <h2>
            Real Results from Real Contractors
          </h2>
          <p>
            See how painting contractors across America have transformed their businesses with professional quoting
          </p>
        </div>

        <div>
          {/* Main Testimonial Card */}
          <Card>
            <CardContent>
              <div>
                {/* Left Side - Testimonial */}
                <div>
                  <div>
                    <div>
                      <span>
                        {currentTestimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <h3>
                        {currentTestimonial.name}
                      </h3>
                      <p>{currentTestimonial.company}</p>
                      <p>{currentTestimonial.location}</p>
                      <p>{currentTestimonial.businessType}</p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote>
                    "{currentTestimonial.quote}"
                  </blockquote>

                  {/* Key Benefit */}
                  <div>
                    <div>
                      <TrendingUp />
                      <span>
                        {currentTestimonial.keyBenefit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Before/After Stats */}
                <div>
                  <h4>
                    Before vs. After Results
                  </h4>
                  
                  <div>
                    {/* Before Column */}
                    <div>
                      <h5>Before</h5>
                      <div>
                        <div>
                          <span>Win Rate:</span>
                          <span>{currentTestimonial.beforeStats.winRate}</span>
                        </div>
                        <div>
                          <span>Revenue:</span>
                          <span>{currentTestimonial.beforeStats.monthlyRevenue}</span>
                        </div>
                        <div>
                          <span>Quotes/Month:</span>
                          <span>{currentTestimonial.beforeStats.quotesPerMonth}</span>
                        </div>
                        <div>
                          <span>Time/Quote:</span>
                          <span>{currentTestimonial.beforeStats.timePerQuote}</span>
                        </div>
                      </div>
                    </div>

                    {/* After Column */}
                    <div>
                      <h5>After</h5>
                      <div>
                        <div>
                          <span>Win Rate:</span>
                          <span>{currentTestimonial.afterStats.winRate}</span>
                        </div>
                        <div>
                          <span>Revenue:</span>
                          <span>{currentTestimonial.afterStats.monthlyRevenue}</span>
                        </div>
                        <div>
                          <span>Quotes/Month:</span>
                          <span>{currentTestimonial.afterStats.quotesPerMonth}</span>
                        </div>
                        <div>
                          <span>Time/Quote:</span>
                          <span>{currentTestimonial.afterStats.timePerQuote}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div>
                    <h5>Impact Summary</h5>
                    <div>
                      <div>
                        <DollarSign />
                        <div>
                          +{Math.round(((parseInt(currentTestimonial.afterStats.monthlyRevenue.replace(/[,$]/g, '')) - parseInt(currentTestimonial.beforeStats.monthlyRevenue.replace(/[,$]/g, ''))) / parseInt(currentTestimonial.beforeStats.monthlyRevenue.replace(/[,$]/g, ''))) * 100)}%
                        </div>
                        <div>Revenue</div>
                      </div>
                      <div>
                        <TrendingUp />
                        <div>
                          +{parseInt(currentTestimonial.afterStats.winRate) - parseInt(currentTestimonial.beforeStats.winRate)}%
                        </div>
                        <div>Win Rate</div>
                      </div>
                      <div>
                        <Clock />
                        <div>
                          {currentTestimonial.afterStats.quotesPerMonth - currentTestimonial.beforeStats.quotesPerMonth}+
                        </div>
                        <div>More Quotes</div>
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
           
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
           
          >
            <ChevronRight />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
             `}
            />
          ))}
        </div>

        {/* Overall Industry Stats */}
        <div>
          <div>
            <h3>Industry-Wide Results</h3>
            <p>Based on data from 5,000+ active contractors using our platform</p>
          </div>
          
          <div>
            <div>
              <div>47%</div>
              <p>Average win rate increase</p>
            </div>
            <div>
              <div>$8,400</div>
              <p>Average monthly revenue increase</p>
            </div>
            <div>
              <div>4.2x</div>
              <p>Faster quote delivery</p>
            </div>
            <div>
              <div>94%</div>
              <p>Customer satisfaction rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}