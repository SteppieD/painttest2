"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, Zap, DollarSign, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function PaintingEstimateCalculatorPage() {
  const [projectData, setProjectData] = useState({
    projectType: 'interior',
    area: '',
    paintType: 'standard',
    coats: '2',
    prep: 'minimal',
    urgency: 'standard',
    location: 'urban'
  })

  const updateProject = (field: string, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }))
  }

  const calculateEstimate = () => {
    const area = parseFloat(projectData.area) || 0
    
    // Base rates per square foot
    const baseRates = {
      interior: {
        budget: 2.5,
        standard: 3.5,
        premium: 5.0
      },
      exterior: {
        budget: 3.0,
        standard: 4.5,
        premium: 6.5
      },
      commercial: {
        budget: 2.0,
        standard: 3.0,
        premium: 4.5
      }
    }
    
    const baseRate = baseRates[projectData.projectType as keyof typeof baseRates][projectData.paintType as keyof typeof baseRates.interior]
    
    // Multipliers
    const coatMultiplier = projectData.coats === '1' ? 0.8 : projectData.coats === '3' ? 1.3 : 1.0
    const prepMultiplier = {
      minimal: 1.0,
      moderate: 1.3,
      extensive: 1.8,
      repair: 2.2
    }[projectData.prep] || 1.0
    
    const urgencyMultiplier = {
      flexible: 0.9,
      standard: 1.0,
      rush: 1.4,
      emergency: 1.8
    }[projectData.urgency] || 1.0
    
    const locationMultiplier = {
      rural: 0.85,
      suburban: 1.0,
      urban: 1.15,
      premium: 1.35
    }[projectData.location] || 1.0
    
    // Calculate costs
    const laborCost = area * baseRate * coatMultiplier * prepMultiplier * urgencyMultiplier * locationMultiplier
    
    // Material costs (paint, primer, supplies)
    const materialCosts = {
      budget: area * 0.8,
      standard: area * 1.2,
      premium: area * 1.8
    }
    
    const materialCost = materialCosts[projectData.paintType as keyof typeof materialCosts]
    
    // Time estimates
    const baseHours = {
      interior: area / 200, // 200 sq ft per hour
      exterior: area / 150, // 150 sq ft per hour
      commercial: area / 250 // 250 sq ft per hour
    }
    
    const timeHours = Math.ceil(baseHours[projectData.projectType as keyof typeof baseHours] * coatMultiplier * prepMultiplier)
    const timeDays = Math.ceil(timeHours / 8)
    
    // Total costs
    const subtotal = laborCost + materialCost
    const overhead = subtotal * 0.15 // 15% overhead
    const profit = subtotal * 0.20 // 20% profit margin
    const tax = (subtotal + overhead + profit) * 0.08
    const total = subtotal + overhead + profit + tax
    
    // Cost per square foot
    const costPerSqFt = total / area

    return {
      area,
      laborCost: Math.round(laborCost),
      materialCost: Math.round(materialCost),
      overhead: Math.round(overhead),
      profit: Math.round(profit),
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      total: Math.round(total),
      costPerSqFt: Math.round(costPerSqFt * 100) / 100,
      timeHours,
      timeDays
    }
  }

  const estimate = calculateEstimate()

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
              Professional Painting Estimate Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get accurate painting estimates with professional pricing that includes labor, materials, and project factors
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary-600" />
                    Project Details
                  </CardTitle>
                  <CardDescription>
                    Enter your project specifications for an accurate estimate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Project Type</Label>
                      <Select value={projectData.projectType} onValueChange={(value) => updateProject('projectType', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interior">Interior Painting</SelectItem>
                          <SelectItem value="exterior">Exterior Painting</SelectItem>
                          <SelectItem value="commercial">Commercial Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Paint Quality</Label>
                      <Select value={projectData.paintType} onValueChange={(value) => updateProject('paintType', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget Paint</SelectItem>
                          <SelectItem value="standard">Standard Paint</SelectItem>
                          <SelectItem value="premium">Premium Paint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="area">Total Area (square feet)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={projectData.area}
                      onChange={(e) => updateProject('area', e.target.value)}
                      placeholder="Enter total paintable area"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Include walls, ceilings, trim as applicable
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Number of Coats</Label>
                      <Select value={projectData.coats} onValueChange={(value) => updateProject('coats', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Coat (touch-up)</SelectItem>
                          <SelectItem value="2">2 Coats (standard)</SelectItem>
                          <SelectItem value="3">3 Coats (premium finish)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Prep Work Required</Label>
                      <Select value={projectData.prep} onValueChange={(value) => updateProject('prep', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal (clean surfaces)</SelectItem>
                          <SelectItem value="moderate">Moderate (filling, sanding)</SelectItem>
                          <SelectItem value="extensive">Extensive (scraping, priming)</SelectItem>
                          <SelectItem value="repair">Repair work needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Project Timeline</Label>
                      <Select value={projectData.urgency} onValueChange={(value) => updateProject('urgency', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible (4+ weeks)</SelectItem>
                          <SelectItem value="standard">Standard (2-3 weeks)</SelectItem>
                          <SelectItem value="rush">Rush (1 week)</SelectItem>
                          <SelectItem value="emergency">Emergency (2-3 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Project Location</Label>
                      <Select value={projectData.location} onValueChange={(value) => updateProject('location', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rural">Rural Area</SelectItem>
                          <SelectItem value="suburban">Suburban</SelectItem>
                          <SelectItem value="urban">Urban</SelectItem>
                          <SelectItem value="premium">Premium Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Professional Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${estimate.total.toLocaleString()}
                    </div>
                    <p className="text-lg font-medium text-gray-700">Total Project Cost</p>
                    <p className="text-sm text-gray-600 mt-1">
                      ${estimate.costPerSqFt}/sq ft • {estimate.area} sq ft
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Cost Breakdown</h4>
                    
                    <div className="flex justify-between">
                      <span>Labor</span>
                      <span className="font-medium">${estimate.laborCost.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Materials</span>
                      <span className="font-medium">${estimate.materialCost.toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t pt-2 flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium">${estimate.subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Business overhead (15%)</span>
                      <span>${estimate.overhead.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Profit margin (20%)</span>
                      <span>${estimate.profit.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${estimate.tax.toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t-2 pt-3 flex justify-between text-xl font-bold text-green-600">
                      <span>Total</span>
                      <span>${estimate.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{estimate.timeHours}</div>
                      <p className="text-sm text-gray-600">Total Hours</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{estimate.timeDays}</div>
                      <p className="text-sm text-gray-600">Working Days</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Based on professional painter productivity rates
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Market Pricing Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-700 text-sm space-y-2">
                  <p>• <strong>Budget projects:</strong> Focus on basic coverage and cleanup</p>
                  <p>• <strong>Standard projects:</strong> Include quality prep work and materials</p>
                  <p>• <strong>Premium projects:</strong> Superior finishes with warranty</p>
                  <p className="pt-2 border-t">
                    This estimate reflects current market rates for professional painting services.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Link href="/get-quote">Get AI-Powered Quote in 30 Seconds</Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/interior-painting-quote-calculator">Interior Calculator</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/exterior-painting-estimate-calculator">Exterior Calculator</Link>
                  </Button>
                </div>
                
                <div className="text-center">
                  <Link href="/roi-calculator" className="text-primary-600 hover:underline text-sm">
                    See ROI of professional painting software →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>What's Included in This Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Labor Includes:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Surface preparation and cleaning</li>
                      <li>• Professional painting application</li>
                      <li>• Trim and detail work</li>
                      <li>• Daily cleanup</li>
                      <li>• Final walkthrough</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Materials Include:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Quality paint and primer</li>
                      <li>• Brushes, rollers, and applicators</li>
                      <li>• Drop cloths and protection</li>
                      <li>• Sandpaper and prep materials</li>
                      <li>• Cleanup supplies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}