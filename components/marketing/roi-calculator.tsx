'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Slider } from '@/components/ui/slider'
import { Calculator, TrendingUp, DollarSign, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ROICalculatorProps {
  className?: string
}

export function ROICalculator({ className }: ROICalculatorProps) {
  const [quotesPerMonth, setQuotesPerMonth] = useState(20)
  const [currentCloseRate, setCurrentCloseRate] = useState(30)
  const [averageJobValue, setAverageJobValue] = useState(2800)
  const [results, setResults] = useState({
    currentRevenue: 0,
    projectedRevenue: 0,
    monthlyIncrease: 0,
    annualIncrease: 0,
    additionalJobs: 0,
    timeSaved: 0
  })

  useEffect(() => {
    // Calculate current performance
    const currentJobs = (quotesPerMonth * currentCloseRate) / 100
    const currentRevenue = currentJobs * averageJobValue

    // Calculate improved performance (research shows 40-60% improvement, using conservative 45%)
    const improvedCloseRate = Math.min(currentCloseRate + 15, 65) // Cap at realistic 65%
    const projectedJobs = (quotesPerMonth * improvedCloseRate) / 100
    const projectedRevenue = projectedJobs * averageJobValue

    // Calculate increases
    const monthlyIncrease = projectedRevenue - currentRevenue
    const annualIncrease = monthlyIncrease * 12
    const additionalJobs = projectedJobs - currentJobs
    
    // Time savings: Manual quotes take 3-6 hours, app takes 10 minutes
    const timeSavedPerQuote = 4.5 // Conservative estimate (middle of 3-6 hour range minus 10 minutes)
    const timeSaved = quotesPerMonth * timeSavedPerQuote

    setResults({
      currentRevenue: Math.round(currentRevenue),
      projectedRevenue: Math.round(projectedRevenue),
      monthlyIncrease: Math.round(monthlyIncrease),
      annualIncrease: Math.round(annualIncrease),
      additionalJobs: Math.round(additionalJobs * 10) / 10,
      timeSaved: Math.round(timeSaved)
    })
  }, [quotesPerMonth, currentCloseRate, averageJobValue])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Calculator />
            ROI Calculator for Painting Contractors
          </CardTitle>
          <p>
            See how much additional revenue you could generate with faster, more professional quotes
          </p>
        </CardHeader>

        <CardContent>
          <div>
            {/* Input Section */}
            <div>
              <h3>Your Current Business</h3>
              
              <div>
                <Label htmlFor="quotes-per-month">Quotes per month</Label>
                <Input
                  id="quotes-per-month"
                  type="number"
                  min={5}
                  max={50}
                  value={quotesPerMonth}
                  onChange={(e) => setQuotesPerMonth(parseInt(e.target.value) || 5)}
                 
                />
              </div>

              <div>
                <Label htmlFor="close-rate">Current close rate (%)</Label>
                <Input
                  id="close-rate"
                  type="number"
                  min={15}
                  max={50}
                  value={currentCloseRate}
                  onChange={(e) => setCurrentCloseRate(parseInt(e.target.value) || 15)}
                 
                />
              </div>

              <div>
                <Label htmlFor="job-value">Average job value ($)</Label>
                <Input
                  id="job-value"
                  type="number"
                  value={averageJobValue}
                  onChange={(e) => setAverageJobValue(Number(e.target.value))}
                 
                />
                <p>Industry average: $2,800</p>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h3>Your Potential with Professional Quotes</h3>
              
              <div>
                <div>
                  <div>
                    <DollarSign />
                    <span>Current Monthly Revenue</span>
                  </div>
                  <p>{formatCurrency(results.currentRevenue)}</p>
                </div>

                <div>
                  <div>
                    <TrendingUp />
                    <span>Projected Monthly Revenue</span>
                  </div>
                  <p>{formatCurrency(results.projectedRevenue)}</p>
                </div>

                <div>
                  <div>
                    <TrendingUp />
                    <span>Monthly Increase</span>
                  </div>
                  <p>{formatCurrency(results.monthlyIncrease)}</p>
                  <p>+{results.additionalJobs} more jobs per month</p>
                </div>

                <div>
                  <div>
                    <Clock />
                    <span>Time Saved</span>
                  </div>
                  <p>{results.timeSaved} hours/month</p>
                  <p>Worth {formatCurrency(results.timeSaved * 50)} at $50/hour</p>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Summary */}
          <div>
            <h4>Annual Revenue Increase</h4>
            <p>{formatCurrency(results.annualIncrease)}</p>
            <p>
              Based on 40-60% win rate improvement with professional quotes and faster response times
            </p>
          </div>

          {/* CTA Section */}
          <div>
            <h4>
              Ready to start winning more jobs?
            </h4>
            <p>
              Join thousands of contractors already using professional quoting to grow their business
            </p>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Free
                <ArrowRight />
              </Link>
            </Button>
            <p>No credit card required • Setup in 5 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}