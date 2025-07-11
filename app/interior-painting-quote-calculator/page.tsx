"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calculator, Home, DollarSign, Info } from 'lucide-react'
import Link from 'next/link'

export default function InteriorPaintingCalculatorPage() {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Living Room', length: '', width: '', height: '', doors: 2, windows: 2, ceilingPaint: false }
  ])
  const [paintQuality, setPaintQuality] = useState('standard')
  const [laborRate, setLaborRate] = useState('50')

  const addRoom = () => {
    setRooms([...rooms, { 
      id: Date.now(), 
      name: `Room ${rooms.length + 1}`, 
      length: '', 
      width: '', 
      height: '', 
      doors: 1, 
      windows: 1,
      ceilingPaint: false
    }])
  }

  const updateRoom = (id: number, field: string, value: any) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ))
  }

  const removeRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(room => room.id !== id))
    }
  }

  const calculateCosts = () => {
    let totalWallArea = 0
    let totalCeilingArea = 0
    
    rooms.forEach(room => {
      const length = parseFloat(room.length) || 0
      const width = parseFloat(room.width) || 0
      const height = parseFloat(room.height) || 8
      
      // Wall area calculation
      const wallArea = 2 * (length + width) * height
      const doorArea = room.doors * 20 // 20 sq ft per door
      const windowArea = room.windows * 12 // 12 sq ft per window
      totalWallArea += Math.max(0, wallArea - doorArea - windowArea)
      
      // Ceiling area
      if (room.ceilingPaint) {
        totalCeilingArea += length * width
      }
    })

    // Paint costs based on quality
    const paintCosts = {
      budget: { wall: 35, ceiling: 30 },
      standard: { wall: 55, ceiling: 45 },
      premium: { wall: 75, ceiling: 65 }
    }
    
    const selectedPaint = paintCosts[paintQuality as keyof typeof paintCosts]
    
    // Calculate gallons needed (350 sq ft per gallon)
    const wallGallons = Math.ceil(totalWallArea / 350)
    const ceilingGallons = Math.ceil(totalCeilingArea / 350)
    
    // Material costs
    const wallPaintCost = wallGallons * selectedPaint.wall
    const ceilingPaintCost = ceilingGallons * selectedPaint.ceiling
    const suppliesCost = (wallGallons + ceilingGallons) * 15 // Brushes, rollers, drop cloths
    const totalMaterials = wallPaintCost + ceilingPaintCost + suppliesCost
    
    // Labor costs
    const rate = parseFloat(laborRate)
    const laborHours = Math.ceil((totalWallArea + totalCeilingArea) / 200) // 200 sq ft per hour
    const totalLabor = laborHours * rate
    
    // Total project cost
    const subtotal = totalMaterials + totalLabor
    const tax = subtotal * 0.08
    const total = subtotal + tax

    return {
      totalWallArea: Math.round(totalWallArea),
      totalCeilingArea: Math.round(totalCeilingArea),
      wallGallons,
      ceilingGallons,
      wallPaintCost,
      ceilingPaintCost,
      suppliesCost,
      totalMaterials,
      laborHours,
      totalLabor,
      subtotal,
      tax,
      total
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
              Interior Painting Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Calculate accurate costs for interior painting projects with room-by-room estimates
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-primary-600" />
                    Project Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="paintQuality">Paint Quality</Label>
                    <Select value={paintQuality} onValueChange={setPaintQuality}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget ($35/gal)</SelectItem>
                        <SelectItem value="standard">Standard ($55/gal)</SelectItem>
                        <SelectItem value="premium">Premium ($75/gal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
                    <Input
                      id="laborRate"
                      type="number"
                      value={laborRate}
                      onChange={(e) => setLaborRate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Room Inputs */}
              {rooms.map((room, index) => (
                <Card key={room.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      {rooms.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeRoom(room.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Length (ft)</Label>
                        <Input
                          type="number"
                          value={room.length}
                          onChange={(e) => updateRoom(room.id, 'length', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Width (ft)</Label>
                        <Input
                          type="number"
                          value={room.width}
                          onChange={(e) => updateRoom(room.id, 'width', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Height (ft)</Label>
                        <Input
                          type="number"
                          value={room.height}
                          onChange={(e) => updateRoom(room.id, 'height', e.target.value)}
                          placeholder="8"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Doors</Label>
                        <Input
                          type="number"
                          value={room.doors}
                          onChange={(e) => updateRoom(room.id, 'doors', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Windows</Label>
                        <Input
                          type="number"
                          value={room.windows}
                          onChange={(e) => updateRoom(room.id, 'windows', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`ceiling-${room.id}`}
                        checked={room.ceilingPaint}
                        onChange={(e) => updateRoom(room.id, 'ceilingPaint', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={`ceiling-${room.id}`}>Paint ceiling</Label>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addRoom} variant="outline" className="w-full">
                Add Another Room
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Project Summary</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span>Wall area:</span>
                      <span className="font-medium">{costs.totalWallArea} sq ft</span>
                      {costs.totalCeilingArea > 0 && (
                        <>
                          <span>Ceiling area:</span>
                          <span className="font-medium">{costs.totalCeilingArea} sq ft</span>
                        </>
                      )}
                      <span>Paint needed:</span>
                      <span className="font-medium">{costs.wallGallons + costs.ceilingGallons} gallons</span>
                      <span>Labor time:</span>
                      <span className="font-medium">{costs.laborHours} hours</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Wall paint ({costs.wallGallons} gal)</span>
                      <span>${costs.wallPaintCost}</span>
                    </div>
                    {costs.ceilingGallons > 0 && (
                      <div className="flex justify-between">
                        <span>Ceiling paint ({costs.ceilingGallons} gal)</span>
                        <span>${costs.ceilingPaintCost}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Supplies & materials</span>
                      <span>${costs.suppliesCost}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total materials</span>
                      <span>${costs.totalMaterials}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor ({costs.laborHours} hrs @ ${laborRate}/hr)</span>
                      <span>${costs.totalLabor}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span>Subtotal</span>
                      <span>${costs.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${Math.round(costs.tax)}</span>
                    </div>
                    <div className="border-t-2 pt-3 flex justify-between text-xl font-bold text-green-600">
                      <span>Total Project Cost</span>
                      <span>${Math.round(costs.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Estimate Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-yellow-700 text-sm space-y-2">
                  <p>• Prices include standard primer and two coats of paint</p>
                  <p>• Labor rate assumes professional painter productivity</p>
                  <p>• Ceiling paint is typically flat or eggshell finish</p>
                  <p>• Wall paint is typically satin or semi-gloss finish</p>
                  <p>• Additional prep work may increase total cost</p>
                  <p>• Get professional quotes for accurate pricing</p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Link href="/get-quote">Get Professional Quote</Link>
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