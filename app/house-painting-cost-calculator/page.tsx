"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, Home, DollarSign, Info, Palette } from 'lucide-react'
import Link from 'next/link'

export default function HousePaintingCostCalculatorPage() {
  const [projectType, setProjectType] = useState('both')
  const [houseSize, setHouseSize] = useState('medium')
  const [paintQuality, setPaintQuality] = useState('standard')
  const [condition, setCondition] = useState('good')
  const [customDimensions, setCustomDimensions] = useState({
    length: '',
    width: '',
    height: '',
    stories: '1',
    interiorRooms: '5'
  })
  const [useCustom, setUseCustom] = useState(false)

  const updateDimension = (field: string, value: any) => {
    setCustomDimensions(prev => ({ ...prev, [field]: value }))
  }

  const getHouseDimensions = () => {
    if (useCustom) {
      return {
        length: parseFloat(customDimensions.length) || 0,
        width: parseFloat(customDimensions.width) || 0,
        height: parseFloat(customDimensions.height) || 8,
        stories: parseInt(customDimensions.stories) || 1,
        interiorRooms: parseInt(customDimensions.interiorRooms) || 5
      }
    }

    const presetSizes = {
      small: { length: 24, width: 30, height: 8, stories: 1, interiorRooms: 3 },
      medium: { length: 30, width: 40, height: 9, stories: 1.5, interiorRooms: 5 },
      large: { length: 40, width: 50, height: 10, stories: 2, interiorRooms: 8 },
      'extra-large': { length: 50, width: 60, height: 10, stories: 2, interiorRooms: 12 }
    }

    return presetSizes[houseSize as keyof typeof presetSizes]
  }

  const calculateCosts = () => {
    const dims = getHouseDimensions()
    
    // Exterior calculations
    const exteriorWallArea = 2 * (dims.length + dims.width) * dims.height * dims.stories
    const exteriorPaintableArea = Math.max(0, exteriorWallArea * 0.85) // Account for doors/windows
    
    // Interior calculations (average room size approach)
    const avgRoomSize = (dims.length * dims.width) / dims.interiorRooms
    const avgRoomWallArea = Math.sqrt(avgRoomSize) * 4 * dims.height
    const interiorPaintableArea = avgRoomWallArea * dims.interiorRooms * 0.8 // Account for doors/windows
    
    // Paint quality pricing
    const paintPrices = {
      budget: { interior: 35, exterior: 45 },
      standard: { interior: 55, exterior: 65 },
      premium: { interior: 75, exterior: 95 }
    }
    
    const selectedPaint = paintPrices[paintQuality as keyof typeof paintPrices]
    
    // Coverage rates (sq ft per gallon)
    const coverageRates = {
      interior: 400,
      exterior: condition === 'poor' ? 300 : condition === 'fair' ? 350 : 400
    }
    
    // Calculate gallons and costs
    let exteriorCosts = { gallons: 0, paint: 0, labor: 0, prep: 0 }
    let interiorCosts = { gallons: 0, paint: 0, labor: 0, prep: 0 }
    
    if (projectType === 'exterior' || projectType === 'both') {
      exteriorCosts.gallons = Math.ceil(exteriorPaintableArea / coverageRates.exterior)
      exteriorCosts.paint = exteriorCosts.gallons * selectedPaint.exterior
      exteriorCosts.labor = exteriorPaintableArea * 3.5 // $3.50 per sq ft
      exteriorCosts.prep = condition === 'poor' ? 1500 : condition === 'fair' ? 800 : 300
    }
    
    if (projectType === 'interior' || projectType === 'both') {
      interiorCosts.gallons = Math.ceil(interiorPaintableArea / coverageRates.interior)
      interiorCosts.paint = interiorCosts.gallons * selectedPaint.interior
      interiorCosts.labor = interiorPaintableArea * 2.5 // $2.50 per sq ft
      interiorCosts.prep = condition === 'poor' ? 800 : condition === 'fair' ? 400 : 150
    }
    
    // Additional costs
    const supplies = (exteriorCosts.gallons + interiorCosts.gallons) * 18
    const scaffolding = dims.stories > 1 ? 600 : 0
    const permits = projectType === 'exterior' || projectType === 'both' ? 150 : 0
    
    // Totals
    const materialCosts = exteriorCosts.paint + interiorCosts.paint + supplies
    const laborCosts = exteriorCosts.labor + interiorCosts.labor + exteriorCosts.prep + interiorCosts.prep
    const additionalCosts = scaffolding + permits
    const subtotal = materialCosts + laborCosts + additionalCosts
    const tax = subtotal * 0.08
    const total = subtotal + tax

    return {
      exteriorPaintableArea: Math.round(exteriorPaintableArea),
      interiorPaintableArea: Math.round(interiorPaintableArea),
      exteriorCosts,
      interiorCosts,
      materialCosts: Math.round(materialCosts),
      laborCosts: Math.round(laborCosts),
      additionalCosts,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      total: Math.round(total),
      supplies,
      scaffolding,
      permits
    }
  }

  const costs = calculateCosts()

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              House Painting Cost Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complete cost estimates for interior, exterior, or whole house painting projects
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-primary-600" />
                    Project Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Project Type</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interior">Interior Only</SelectItem>
                        <SelectItem value="exterior">Exterior Only</SelectItem>
                        <SelectItem value="both">Complete House (Interior + Exterior)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Surface Condition</Label>
                      <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Excellent/Good</SelectItem>
                          <SelectItem value="fair">Fair/Average</SelectItem>
                          <SelectItem value="poor">Poor/Needs Repair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Paint Quality</Label>
                      <Select value={paintQuality} onValueChange={setPaintQuality}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>House Size</CardTitle>
                  <CardDescription>
                    Choose a preset size or enter custom dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="useCustom"
                      checked={useCustom}
                      onChange={(e) => setUseCustom(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="useCustom">Use custom dimensions</Label>
                  </div>
                  
                  {!useCustom ? (
                    <div>
                      <Label>House Size Preset</Label>
                      <Select value={houseSize} onValueChange={setHouseSize}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (800-1,200 sq ft)</SelectItem>
                          <SelectItem value="medium">Medium (1,200-2,000 sq ft)</SelectItem>
                          <SelectItem value="large">Large (2,000-3,000 sq ft)</SelectItem>
                          <SelectItem value="extra-large">Extra Large (3,000+ sq ft)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-2">
                        {houseSize === 'small' && '24×30 ft, 1 story, 3 rooms'}
                        {houseSize === 'medium' && '30×40 ft, 1.5 stories, 5 rooms'}
                        {houseSize === 'large' && '40×50 ft, 2 stories, 8 rooms'}
                        {houseSize === 'extra-large' && '50×60 ft, 2 stories, 12 rooms'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Length (ft)</Label>
                          <Input
                            type="number"
                            value={customDimensions.length}
                            onChange={(e) => updateDimension('length', e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Width (ft)</Label>
                          <Input
                            type="number"
                            value={customDimensions.width}
                            onChange={(e) => updateDimension('width', e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Height (ft)</Label>
                          <Input
                            type="number"
                            value={customDimensions.height}
                            onChange={(e) => updateDimension('height', e.target.value)}
                            placeholder="8"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Stories</Label>
                          <Select value={customDimensions.stories} onValueChange={(value) => updateDimension('stories', value)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Story</SelectItem>
                              <SelectItem value="1.5">1.5 Stories</SelectItem>
                              <SelectItem value="2">2 Stories</SelectItem>
                              <SelectItem value="3">3 Stories</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Interior Rooms</Label>
                          <Input
                            type="number"
                            value={customDimensions.interiorRooms}
                            onChange={(e) => updateDimension('interiorRooms', e.target.value)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Complete Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${costs.total.toLocaleString()}
                      </div>
                      <p className="text-lg font-medium text-gray-700">Total Project Cost</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {projectType === 'both' ? 'Complete house painting' : 
                         projectType === 'interior' ? 'Interior painting only' : 
                         'Exterior painting only'}
                      </p>
                    </div>
                  </div>

                  {(projectType === 'exterior' || projectType === 'both') && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Exterior Project</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>Paintable area:</span>
                        <span className="font-medium">{costs.exteriorPaintableArea} sq ft</span>
                        <span>Paint needed:</span>
                        <span className="font-medium">{costs.exteriorCosts.gallons} gallons</span>
                        <span>Paint cost:</span>
                        <span className="font-medium">${costs.exteriorCosts.paint}</span>
                        <span>Labor cost:</span>
                        <span className="font-medium">${Math.round(costs.exteriorCosts.labor)}</span>
                      </div>
                    </div>
                  )}

                  {(projectType === 'interior' || projectType === 'both') && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Interior Project</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>Paintable area:</span>
                        <span className="font-medium">{costs.interiorPaintableArea} sq ft</span>
                        <span>Paint needed:</span>
                        <span className="font-medium">{costs.interiorCosts.gallons} gallons</span>
                        <span>Paint cost:</span>
                        <span className="font-medium">${costs.interiorCosts.paint}</span>
                        <span>Labor cost:</span>
                        <span className="font-medium">${Math.round(costs.interiorCosts.labor)}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-semibold">Cost Summary</h4>
                    <div className="flex justify-between">
                      <span>Materials (paint + supplies)</span>
                      <span>${costs.materialCosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor (painting + prep work)</span>
                      <span>${costs.laborCosts}</span>
                    </div>
                    {costs.scaffolding > 0 && (
                      <div className="flex justify-between">
                        <span>Scaffolding rental</span>
                        <span>${costs.scaffolding}</span>
                      </div>
                    )}
                    {costs.permits > 0 && (
                      <div className="flex justify-between">
                        <span>Permits & fees</span>
                        <span>${costs.permits}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between">
                      <span>Subtotal</span>
                      <span>${costs.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${costs.tax}</span>
                    </div>
                    <div className="border-t-2 pt-3 flex justify-between text-xl font-bold text-green-600">
                      <span>Total Cost</span>
                      <span>${costs.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Paint Quality Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-700 text-sm">
                  <div className="space-y-2">
                    <div><strong>Budget:</strong> Basic coverage, 3-5 year lifespan</div>
                    <div><strong>Standard:</strong> Good durability, 7-10 year lifespan</div>
                    <div><strong>Premium:</strong> Superior finish, 12-15 year lifespan</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Estimate Includes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-yellow-700 text-sm space-y-2">
                  <p>• Surface preparation and cleaning</p>
                  <p>• Premium primer where needed</p>
                  <p>• Two coats of quality paint</p>
                  <p>• Professional brushes and rollers</p>
                  <p>• Drop cloths and surface protection</p>
                  <p>• Basic trim and detail work</p>
                  <p>• Clean-up and disposal</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button asChild size="lg" className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Link href="/get-quote">Get Detailed Professional Quote</Link>
                </Button>
                <div className="text-center">
                  <Link href="/roi-calculator" className="text-primary-600 hover:underline text-sm">
                    Calculate ROI for professional painting software →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}