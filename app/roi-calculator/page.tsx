"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, TrendingUp, DollarSign, Clock } from 'lucide-react'

export default function ROICalculatorPage() {
  const [quotesPerMonth, setQuotesPerMonth] = useState(20)
  const [currentCloseRate, setCurrentCloseRate] = useState(30)
  const [averageJobValue, setAverageJobValue] = useState(2800)
  const [hoursPerQuote, setHoursPerQuote] = useState(3)
  const [hourlyRate, setHourlyRate] = useState(50)

  // Calculations
  const currentMonthlyRevenue = Math.round((quotesPerMonth * currentCloseRate / 100) * averageJobValue)
  const projectedCloseRate = Math.min(currentCloseRate + 15, 65) // 15% improvement, max 65%
  const projectedMonthlyRevenue = Math.round((quotesPerMonth * projectedCloseRate / 100) * averageJobValue)
  const monthlyIncrease = projectedMonthlyRevenue - currentMonthlyRevenue
  const annualIncrease = monthlyIncrease * 12
  
  const timeSavedPerQuote = hoursPerQuote * 0.85 // 85% time savings
  const monthlyTimeSaved = Math.round(quotesPerMonth * timeSavedPerQuote)
  const timeSavingsValue = monthlyTimeSaved * hourlyRate
  
  const totalMonthlyBenefit = monthlyIncrease + timeSavingsValue
  const annualBenefit = totalMonthlyBenefit * 12

  const softwareCost = 79 * 12 // Professional plan annual cost
  const roi = Math.round(((annualBenefit - softwareCost) / softwareCost) * 100)

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              ROI Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how much additional revenue you could generate with faster, more professional quotes
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                  Your Current Business
                </CardTitle>
                <CardDescription>
                  Enter your current business metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="quotes">Quotes per month</Label>
                  <Input
                    id="quotes"
                    type="number"
                    value={quotesPerMonth}
                    onChange={(e) => setQuotesPerMonth(parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="closeRate">Current close rate (%)</Label>
                  <Input
                    id="closeRate"
                    type="number"
                    value={currentCloseRate}
                    onChange={(e) => setCurrentCloseRate(parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Industry average: 25-35%</p>
                </div>
                
                <div>
                  <Label htmlFor="jobValue">Average job value ($)</Label>
                  <Input
                    id="jobValue"
                    type="number"
                    value={averageJobValue}
                    onChange={(e) => setAverageJobValue(parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Industry average: $2,800</p>
                </div>
                
                <div>
                  <Label htmlFor="hours">Hours per quote</Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    value={hoursPerQuote}
                    onChange={(e) => setHoursPerQuote(parseFloat(e.target.value) || 0)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">Time for site visit, measuring, calculating</p>
                </div>
                
                <div>
                  <Label htmlFor="rate">Your hourly rate ($)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">What your time is worth</p>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Current Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-700">Current Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    ${currentMonthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {Math.round(quotesPerMonth * currentCloseRate / 100)} jobs per month
                  </p>
                </CardContent>
              </Card>

              {/* Projected Revenue */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Projected Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-900">
                    ${projectedMonthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    {Math.round(quotesPerMonth * projectedCloseRate / 100)} jobs per month ({projectedCloseRate}% close rate)
                  </p>
                </CardContent>
              </Card>

              {/* Monthly Increase */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">Monthly Increase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">
                    +${monthlyIncrease.toLocaleString()}
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    +{Math.round(quotesPerMonth * (projectedCloseRate - currentCloseRate) / 100)} more jobs per month
                  </p>
                </CardContent>
              </Card>

              {/* Time Saved */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Time Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">
                    {monthlyTimeSaved} hours/month
                  </div>
                  <p className="text-purple-700 text-sm mt-1">
                    Worth ${timeSavingsValue.toLocaleString()} at ${hourlyRate}/hour
                  </p>
                </CardContent>
              </Card>

              {/* Annual Impact */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">Annual Revenue Increase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-900">
                    ${annualBenefit.toLocaleString()}
                  </div>
                  <p className="text-orange-700 text-sm mt-1">
                    ROI: {roi}% (Software costs ${softwareCost}/year)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Assumptions */}
          <Card className="mt-12 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Calculation Assumptions</CardTitle>
              <CardDescription>
                Based on data from 5,000+ contractors using professional quoting software
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Win Rate Improvement</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Professional quotes increase trust</li>
                    <li>• Faster response time beats competitors</li>
                    <li>• Average improvement: 15-20%</li>
                    <li>• Maximum realistic rate: 65%</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Time Savings</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 85% reduction in quote time</li>
                    <li>• No more manual calculations</li>
                    <li>• Instant professional documents</li>
                    <li>• Quote on-site in real-time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-8 rounded-3xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to achieve these results?</h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of contractors already using professional quoting to grow their business
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild className="bg-white text-primary-600 hover:bg-gray-100">
                  <Link href="/trial-signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent text-white border-white hover:bg-white/10">
                  <Link href="/get-quote">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}