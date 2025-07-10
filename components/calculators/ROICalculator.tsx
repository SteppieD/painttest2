'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Calculator,
  BarChart3,
  Zap,
  ChevronRight,
  Info
} from 'lucide-react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'

interface ROIMetrics {
  monthlyTimeSaved: number
  monthlyTimeSavedValue: number
  additionalQuotesPerMonth: number
  additionalJobsWon: number
  additionalRevenue: number
  totalMonthlySavings: number
  monthlyROI: number
  annualROI: number
  paybackPeriod: number
}

export function ROICalculator() {
  // Input states
  const [quotesPerMonth, setQuotesPerMonth] = useState(20)
  const [hoursPerQuote, setHoursPerQuote] = useState(3)
  const [hourlyRate, setHourlyRate] = useState(50)
  const [currentCloseRate, setCurrentCloseRate] = useState(30)
  const [averageJobValue, setAverageJobValue] = useState(2500)
  const [averageProfit, setAverageProfit] = useState(800)
  const [softwareCost] = useState(79) // Fixed at $79/month for Professional plan

  // Calculated metrics
  const [metrics, setMetrics] = useState<ROIMetrics>({
    monthlyTimeSaved: 0,
    monthlyTimeSavedValue: 0,
    additionalQuotesPerMonth: 0,
    additionalJobsWon: 0,
    additionalRevenue: 0,
    totalMonthlySavings: 0,
    monthlyROI: 0,
    annualROI: 0,
    paybackPeriod: 0
  })

  // Calculate ROI whenever inputs change
  useEffect(() => {
    // Time savings calculations
    const timePerQuoteWithSoftware = 0.5 // 30 minutes
    const timeSavedPerQuote = hoursPerQuote - timePerQuoteWithSoftware
    const monthlyTimeSaved = timeSavedPerQuote * quotesPerMonth
    const monthlyTimeSavedValue = monthlyTimeSaved * hourlyRate

    // Additional quotes from saved time
    const additionalQuotesPerMonth = Math.floor(monthlyTimeSaved / hoursPerQuote)
    
    // Close rate improvement (40-60% typical improvement)
    const improvedCloseRate = currentCloseRate * 1.5 // 50% improvement average
    const closeRateDifference = improvedCloseRate - currentCloseRate
    
    // Jobs won calculations
    const currentJobsWon = (quotesPerMonth * currentCloseRate) / 100
    const improvedJobsWon = ((quotesPerMonth + additionalQuotesPerMonth) * improvedCloseRate) / 100
    const additionalJobsWon = improvedJobsWon - currentJobsWon
    
    // Revenue calculations
    const additionalRevenue = additionalJobsWon * averageProfit
    const totalMonthlySavings = monthlyTimeSavedValue + additionalRevenue
    
    // ROI calculations
    const monthlyROI = ((totalMonthlySavings - softwareCost) / softwareCost) * 100
    const annualROI = ((totalMonthlySavings * 12 - softwareCost * 12) / (softwareCost * 12)) * 100
    const paybackPeriod = softwareCost / (totalMonthlySavings / 30) // Days to payback

    setMetrics({
      monthlyTimeSaved,
      monthlyTimeSavedValue,
      additionalQuotesPerMonth,
      additionalJobsWon,
      additionalRevenue,
      totalMonthlySavings,
      monthlyROI,
      annualROI,
      paybackPeriod
    })
  }, [quotesPerMonth, hoursPerQuote, hourlyRate, currentCloseRate, averageJobValue, averageProfit, softwareCost])

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">ROI Calculator for Painting Contractors</h2>
            <p className="text-gray-600">See how much ProPaint Quote can save your business</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Your Current Business Metrics
              </h3>

              <div className="space-y-6">
                {/* Quotes per month */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Quotes Created Monthly
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average number of quotes you create each month</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <span className="text-sm font-semibold">{quotesPerMonth}</span>
                  </div>
                  <Slider
                    value={[quotesPerMonth]}
                    onValueChange={(value) => setQuotesPerMonth(value[0])}
                    min={5}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Hours per quote */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Hours Per Quote (Currently)
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time spent measuring, calculating, and creating each quote</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <span className="text-sm font-semibold">{hoursPerQuote} hrs</span>
                  </div>
                  <Slider
                    value={[hoursPerQuote]}
                    onValueChange={(value) => setHoursPerQuote(value[0])}
                    min={1}
                    max={6}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Hourly rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Your Hourly Rate
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>What your time is worth per hour</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <span className="text-sm font-semibold">${hourlyRate}/hr</span>
                  </div>
                  <Slider
                    value={[hourlyRate]}
                    onValueChange={(value) => setHourlyRate(value[0])}
                    min={25}
                    max={150}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Current close rate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Current Close Rate
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of quotes that turn into jobs</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <span className="text-sm font-semibold">{currentCloseRate}%</span>
                  </div>
                  <Slider
                    value={[currentCloseRate]}
                    onValueChange={(value) => setCurrentCloseRate(value[0])}
                    min={10}
                    max={60}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Average job value */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Average Job Value
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average revenue per painting job</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <span className="text-sm font-semibold">${averageJobValue.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[averageJobValue]}
                    onValueChange={(value) => setAverageJobValue(value[0])}
                    min={500}
                    max={10000}
                    step={250}
                    className="w-full"
                  />
                </div>

                {/* Average profit per job */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      Average Profit Per Job
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Net profit after materials and labor</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <span className="text-sm font-semibold">${averageProfit.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[averageProfit]}
                    onValueChange={(value) => setAverageProfit(value[0])}
                    min={100}
                    max={3000}
                    step={50}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Potential ROI with ProPaint Quote
              </h3>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <Clock className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-900">
                    {metrics.monthlyTimeSaved.toFixed(0)} hrs
                  </div>
                  <div className="text-sm text-blue-700">Time saved monthly</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Worth ${metrics.monthlyTimeSavedValue.toLocaleString()}
                  </div>
                </Card>

                <Card className="p-4 bg-green-50 border-green-200">
                  <Users className="w-6 h-6 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-900">
                    +{metrics.additionalJobsWon.toFixed(1)}
                  </div>
                  <div className="text-sm text-green-700">Extra jobs won/month</div>
                  <div className="text-xs text-green-600 mt-1">
                    ${metrics.additionalRevenue.toLocaleString()} revenue
                  </div>
                </Card>

                <Card className="p-4 bg-purple-50 border-purple-200">
                  <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-900">
                    ${metrics.totalMonthlySavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-700">Total monthly value</div>
                  <div className="text-xs text-purple-600 mt-1">
                    After $79 software cost
                  </div>
                </Card>

                <Card className="p-4 bg-orange-50 border-orange-200">
                  <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-orange-900">
                    {metrics.monthlyROI.toFixed(0)}%
                  </div>
                  <div className="text-sm text-orange-700">Monthly ROI</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {metrics.paybackPeriod.toFixed(0)} day payback
                  </div>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <Card className="p-6 bg-gray-50">
                <h4 className="font-semibold mb-4">Detailed ROI Breakdown</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Software Cost</span>
                    <span className="font-medium text-red-600">-${softwareCost}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Savings Value</span>
                    <span className="font-medium text-green-600">
                      +${metrics.monthlyTimeSavedValue.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Revenue</span>
                    <span className="font-medium text-green-600">
                      +${metrics.additionalRevenue.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Net Monthly Benefit</span>
                    <span className="text-green-600">
                      ${(metrics.totalMonthlySavings - softwareCost).toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Annual Benefit</span>
                    <span className="text-green-600">
                      ${((metrics.totalMonthlySavings - softwareCost) * 12).toLocaleString()}/yr
                    </span>
                  </div>
                </div>
              </Card>

              {/* Improvement Projections */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50">
                <h4 className="font-semibold mb-4">Expected Improvements</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Quote Creation Speed</div>
                      <div className="text-xs text-gray-600">
                        From {hoursPerQuote} hours to 30 minutes
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      {((hoursPerQuote - 0.5) / hoursPerQuote * 100).toFixed(0)}% faster
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Close Rate</div>
                      <div className="text-xs text-gray-600">
                        From {currentCloseRate}% to {(currentCloseRate * 1.5).toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      +50% improvement
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Monthly Quotes</div>
                      <div className="text-xs text-gray-600">
                        From {quotesPerMonth} to {quotesPerMonth + metrics.additionalQuotesPerMonth}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      +{metrics.additionalQuotesPerMonth} quotes
                    </div>
                  </div>
                </div>
              </Card>

              {/* CTA */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/trial-signup'}
                >
                  Start Saving ${(metrics.totalMonthlySavings - softwareCost).toLocaleString()}/month
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  14-day free trial • No credit card required
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
}