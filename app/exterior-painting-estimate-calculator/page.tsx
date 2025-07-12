"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, Building2, DollarSign, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function ExteriorPaintingCalculatorPage() {
  const [houseType, setHouseType] = useState('single-story')
  const [siding, setSiding] = useState('wood')
  const [condition, setCondition] = useState('good')
  const [paintQuality, setPaintQuality] = useState('standard')
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    gableHeight: '',
    doors: 1,
    windows: 8,
    trim: true,
    shutters: false
  })

  const updateDimension = (field: string, value: any) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
  }

  const calculateCosts = () => {
    const length = parseFloat(dimensions.length) || 0
    const width = parseFloat(dimensions.width) || 0
    const height = parseFloat(dimensions.height) || 8
    const gableHeight = parseFloat(dimensions.gableHeight) || 0
    
    // Calculate exterior wall area
    const wallArea = 2 * (length + width) * height
    const gableArea = gableHeight > 0 ? 2 * (width * gableHeight / 2) : 0
    const totalWallArea = wallArea + gableArea
    
    // Subtract doors and windows
    const doorArea = dimensions.doors * 20
    const windowArea = dimensions.windows * 12
    const paintableArea = Math.max(0, totalWallArea - doorArea - windowArea)
    
    // Trim area (windows and doors perimeter)
    const trimArea = dimensions.trim ? (dimensions.windows * 40 + dimensions.doors * 30) : 0
    
    // Shutter area
    const shutterArea = dimensions.shutters ? dimensions.windows * 8 : 0
    
    // Paint requirements based on siding type and condition
    const coverageRates = {
      wood: { good: 400, fair: 350, poor: 300 },
      vinyl: { good: 450, fair: 400, poor: 350 },
      stucco: { good: 300, fair: 250, poor: 200 },
      brick: { good: 200, fair: 150, poor: 100 }
    }
    
    const coverage = coverageRates[siding as keyof typeof coverageRates]?.[condition as keyof typeof coverageRates.wood] || 350
    
    // Calculate gallons needed
    const wallGallons = Math.ceil(paintableArea / coverage)
    const trimGallons = Math.ceil(trimArea / 400)
    const shutterGallons = shutterArea > 0 ? Math.ceil(shutterArea / 400) : 0
    const totalGallons = wallGallons + trimGallons + shutterGallons
    
    // Paint costs
    const paintCosts = {
      budget: 45,
      standard: 65,
      premium: 95
    }
    const paintPrice = paintCosts[paintQuality as keyof typeof paintCosts]
    
    // Material costs
    const wallPaintCost = wallGallons * paintPrice
    const trimPaintCost = trimGallons * (paintPrice + 10) // Trim paint is more expensive
    const shutterPaintCost = shutterGallons * (paintPrice + 15) // Specialty paint
    const primerCost = condition === 'poor' ? totalGallons * 35 : 0
    const suppliesCost = totalGallons * 20 // Brushes, rollers, sprayer rental, drop cloths
    const totalMaterials = wallPaintCost + trimPaintCost + shutterPaintCost + primerCost + suppliesCost
    
    // Labor calculation (more complex for exterior)
    const baseRate = 3.5 // per sq ft for walls
    const trimRate = 8 // per linear ft for trim
    const prepMultiplier = { good: 1, fair: 1.3, poor: 1.8 }[condition] || 1
    
    const wallLabor = paintableArea * baseRate * prepMultiplier
    const trimLabor = trimArea * (trimRate / 4) * prepMultiplier // Convert to sq ft rate
    const shutterLabor = shutterArea * 5 * prepMultiplier
    const totalLabor = wallLabor + trimLabor + shutterLabor
    
    // Additional costs for exterior
    const scaffoldingCost = houseType === 'two-story' ? 800 : 0
    const pressureWashCost = condition !== 'good' ? 300 : 0
    
    // Calculate total
    const subtotal = totalMaterials + totalLabor + scaffoldingCost + pressureWashCost
    const tax = subtotal * 0.08
    const total = subtotal + tax

    return {
      paintableArea: Math.round(paintableArea),
      trimArea: Math.round(trimArea),
      shutterArea: Math.round(shutterArea),
      wallGallons,
      trimGallons,
      shutterGallons,
      totalGallons,
      wallPaintCost,
      trimPaintCost,
      shutterPaintCost,
      primerCost,
      suppliesCost,
      totalMaterials,
      wallLabor: Math.round(wallLabor),
      trimLabor: Math.round(trimLabor),
      shutterLabor: Math.round(shutterLabor),
      totalLabor: Math.round(totalLabor),
      scaffoldingCost,
      pressureWashCost,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      total: Math.round(total)
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
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              Exterior Painting Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional exterior painting cost estimates including prep work, materials, and labor
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-primary-600" />
                    House Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>House Type</Label>
                      <Select value={houseType} onValueChange={setHouseType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-story">Single Story</SelectItem>
                          <SelectItem value="two-story">Two Story</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Siding Material</Label>
                      <Select value={siding} onValueChange={setSiding}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wood">Wood</SelectItem>
                          <SelectItem value="vinyl">Vinyl</SelectItem>
                          <SelectItem value="stucco">Stucco</SelectItem>
                          <SelectItem value="brick">Brick</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Surface Condition</Label>
                      <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good (minimal prep)</SelectItem>
                          <SelectItem value="fair">Fair (moderate prep)</SelectItem>
                          <SelectItem value="poor">Poor (extensive prep)</SelectItem>
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
                          <SelectItem value="budget">Budget ($45/gal)</SelectItem>
                          <SelectItem value="standard">Standard ($65/gal)</SelectItem>
                          <SelectItem value="premium">Premium ($95/gal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Measurements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>House Length (ft)</Label>
                      <Input
                        type="number"
                        value={dimensions.length}
                        onChange={(e) => updateDimension('length', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>House Width (ft)</Label>
                      <Input
                        type="number"
                        value={dimensions.width}
                        onChange={(e) => updateDimension('width', e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Wall Height (ft)</Label>
                      <Input
                        type="number"
                        value={dimensions.height}
                        onChange={(e) => updateDimension('height', e.target.value)}
                        placeholder="8"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Gable Height (ft)</Label>
                      <Input
                        type="number"
                        value={dimensions.gableHeight}
                        onChange={(e) => updateDimension('gableHeight', e.target.value)}
                        placeholder="0"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Doors</Label>
                      <Input
                        type="number"
                        value={dimensions.doors}
                        onChange={(e) => updateDimension('doors', parseInt(e.target.value) || 0)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Windows</Label>
                      <Input
                        type="number"
                        value={dimensions.windows}
                        onChange={(e) => updateDimension('windows', parseInt(e.target.value) || 0)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="trim"
                        checked={dimensions.trim}
                        onChange={(e) => updateDimension('trim', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="trim">Paint window/door trim</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="shutters"
                        checked={dimensions.shutters}
                        onChange={(e) => updateDimension('shutters', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="shutters">Paint shutters</Label>
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
                    Cost Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Project Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span>Paintable area:</span>
                      <span className="font-medium">{costs.paintableArea} sq ft</span>
                      {costs.trimArea > 0 && (
                        <>
                          <span>Trim area:</span>
                          <span className="font-medium">{costs.trimArea} sq ft</span>
                        </>
                      )}
                      {costs.shutterArea > 0 && (
                        <>
                          <span>Shutter area:</span>
                          <span className="font-medium">{costs.shutterArea} sq ft</span>
                        </>
                      )}
                      <span>Paint needed:</span>
                      <span className="font-medium">{costs.totalGallons} gallons</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Materials</h4>
                    <div className="flex justify-between">
                      <span>Wall paint ({costs.wallGallons} gal)</span>
                      <span>${costs.wallPaintCost}</span>
                    </div>
                    {costs.trimGallons > 0 && (
                      <div className="flex justify-between">
                        <span>Trim paint ({costs.trimGallons} gal)</span>
                        <span>${costs.trimPaintCost}</span>
                      </div>
                    )}
                    {costs.shutterGallons > 0 && (
                      <div className="flex justify-between">
                        <span>Shutter paint ({costs.shutterGallons} gal)</span>
                        <span>${costs.shutterPaintCost}</span>
                      </div>
                    )}
                    {costs.primerCost > 0 && (
                      <div className="flex justify-between">
                        <span>Primer (poor condition)</span>
                        <span>${costs.primerCost}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Supplies & equipment</span>
                      <span>${costs.suppliesCost}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total materials</span>
                      <span>${costs.totalMaterials}</span>
                    </div>
                    
                    <h4 className="font-semibold pt-3">Labor & Services</h4>
                    <div className="flex justify-between">
                      <span>Painting labor</span>
                      <span>${costs.totalLabor}</span>
                    </div>
                    {costs.scaffoldingCost > 0 && (
                      <div className="flex justify-between">
                        <span>Scaffolding rental</span>
                        <span>${costs.scaffoldingCost}</span>
                      </div>
                    )}
                    {costs.pressureWashCost > 0 && (
                      <div className="flex justify-between">
                        <span>Pressure washing</span>
                        <span>${costs.pressureWashCost}</span>
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
                      <span>Total Project Cost</span>
                      <span>${costs.total.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-orange-700 text-sm space-y-2">
                  <p>• Weather conditions can affect project timeline</p>
                  <p>• Poor surface condition may require additional prep work</p>
                  <p>• Two-story homes require scaffolding or ladder safety measures</p>
                  <p>• Pressure washing recommended before painting</p>
                  <p>• Premium paints offer better durability and coverage</p>
                  <p>• Lead testing required for homes built before 1978</p>
                  <p>• Get multiple professional quotes for accuracy</p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Link href="/get-quote">Create Professional Quote</Link>
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