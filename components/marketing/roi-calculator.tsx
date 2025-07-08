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
    <div className={className}>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            ROI Calculator for Painting Contractors
          </CardTitle>
          <p className="text-gray-600">
            See how much additional revenue you could generate with faster, more professional quotes
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Your Current Business</h3>
              
              <div className="space-y-2">
                <Label htmlFor="quotes-per-month">Quotes per month</Label>
                <Input
                  id="quotes-per-month"
                  type="number"
                  min={5}
                  max={50}
                  value={quotesPerMonth}
                  onChange={(e) => setQuotesPerMonth(parseInt(e.target.value) || 5)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="close-rate">Current close rate (%)</Label>
                <Input
                  id="close-rate"
                  type="number"
                  min={15}
                  max={50}
                  value={currentCloseRate}
                  onChange={(e) => setCurrentCloseRate(parseInt(e.target.value) || 15)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-value">Average job value ($)</Label>
                <Input
                  id="job-value"
                  type="number"
                  value={averageJobValue}
                  onChange={(e) => setAverageJobValue(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">Industry average: $2,800</p>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Your Potential with Professional Quotes</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Current Monthly Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(results.currentRevenue)}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Projected Monthly Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800">{formatCurrency(results.projectedRevenue)}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Monthly Increase</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-800">{formatCurrency(results.monthlyIncrease)}</p>
                  <p className="text-sm text-blue-600">+{results.additionalJobs} more jobs per month</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Time Saved</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-800">{results.timeSaved} hours/month</p>
                  <p className="text-sm text-purple-600">Worth {formatCurrency(results.timeSaved * 50)} at $50/hour</p>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Summary */}
          <div className="bg-blue-600 text-white p-6 rounded-lg text-center" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
            <h4 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Annual Revenue Increase</h4>
            <p className="text-4xl font-bold mb-2" style={{ color: '#ffffff' }}>{formatCurrency(results.annualIncrease)}</p>
            <p className="opacity-90" style={{ color: '#ffffff' }}>
              Based on 40-60% win rate improvement with professional quotes and faster response times
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Ready to start winning more jobs?
            </h4>
            <p className="text-gray-600">
              Join thousands of contractors already using professional quoting to grow their business
            </p>
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                Start Free Trial - 10 Quotes Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-xs text-gray-500">No credit card required • Setup in 5 minutes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}