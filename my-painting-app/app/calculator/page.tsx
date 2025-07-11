"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROOM_TYPES, PAINT_BRANDS, FINISH_TYPES } from '@/lib/constants'
import { QuoteCalculator } from '@/lib/services/quote-calculator'
import { formatCurrency } from '@/lib/utils'
import { Calculator, Plus, Trash2 } from 'lucide-react'

interface RoomInput {
  id: string
  type: string
  length: number
  width: number
  height: number
  paintBrand: string
  paintProduct: string
  includeWalls: boolean
  includeCeiling: boolean
  includeTrim: boolean
}

export default function CalculatorPage() {
  const [rooms, setRooms] = useState<RoomInput[]>([
    {
      id: '1',
      type: 'bedroom',
      length: 12,
      width: 12,
      height: 8,
      paintBrand: 'sherwin-williams',
      paintProduct: 'SuperPaint',
      includeWalls: true,
      includeCeiling: true,
      includeTrim: false
    }
  ])
  
  const [result, setResult] = useState<any>(null)

  const addRoom = () => {
    const newRoom: RoomInput = {
      id: Date.now().toString(),
      type: 'bedroom',
      length: 12,
      width: 12,
      height: 8,
      paintBrand: 'sherwin-williams',
      paintProduct: 'SuperPaint',
      includeWalls: true,
      includeCeiling: false,
      includeTrim: false
    }
    setRooms([...rooms, newRoom])
  }

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id))
  }

  const updateRoom = (id: string, field: keyof RoomInput, value: any) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ))
  }

  const calculateQuote = () => {
    // Convert room inputs to the format expected by calculator
    const formattedRooms = rooms.map(room => {
      const wallArea = room.includeWalls ? 2 * (room.length + room.width) * room.height : 0
      const ceilingArea = room.includeCeiling ? room.length * room.width : 0
      const trimLength = room.includeTrim ? 2 * (room.length + room.width) : 0
      
      const surfaces = []
      if (room.includeWalls && wallArea > 0) {
        surfaces.push({
          type: 'walls' as const,
          area: wallArea,
          coats: 2,
          condition: 'good' as const,
          prep: []
        })
      }
      if (room.includeCeiling && ceilingArea > 0) {
        surfaces.push({
          type: 'ceiling' as const,
          area: ceilingArea,
          coats: 2,
          condition: 'good' as const,
          prep: []
        })
      }
      if (room.includeTrim && trimLength > 0) {
        surfaces.push({
          type: 'trim' as const,
          area: trimLength * 0.5, // Assume 6" average trim height
          coats: 2,
          condition: 'good' as const,
          prep: []
        })
      }

      // Find paint product
      const brand = PAINT_BRANDS.find(b => b.id === room.paintBrand)
      const product = brand?.tiers.find(t => t.name === room.paintProduct)

      return {
        id: room.id,
        name: `${ROOM_TYPES.find(t => t.id === room.type)?.name || 'Room'}`,
        type: room.type,
        dimensions: {
          length: room.length,
          width: room.width,
          height: room.height
        },
        surfaces,
        paintProduct: product && brand ? {
          brandId: room.paintBrand,
          productId: room.paintProduct,
          name: `${brand.name} ${product.name}`,
          pricePerGallon: product.price,
          coverage: 350
        } : undefined,
        laborHours: 0,
        paintGallons: 0,
        totalCost: 0
      }
    })

    const calculation = QuoteCalculator.calculate({
      rooms: formattedRooms,
      laborRate: 50,
      markupPercentage: 35,
      taxRate: 8.5,
      overheadPercentage: 15
    })

    setResult(calculation)
  }

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl font-bold text-secondary-900 mb-4">
                Painting Quote Calculator
              </h1>
              <p className="text-lg text-gray-600">
                Get an instant estimate for your painting project
              </p>
            </div>

            {/* Room Inputs */}
            <div className="space-y-6 mb-8">
              {rooms.map((room, index) => (
                <Card key={room.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Room {index + 1}</CardTitle>
                      {rooms.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoom(room.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {/* Room Type */}
                      <div>
                        <Label>Room Type</Label>
                        <select
                          className="w-full h-10 px-3 rounded-md border"
                          value={room.type}
                          onChange={(e) => updateRoom(room.id, 'type', e.target.value)}
                        >
                          {ROOM_TYPES.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dimensions */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Length (ft)</Label>
                          <Input
                            type="number"
                            value={room.length}
                            onChange={(e) => updateRoom(room.id, 'length', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Width (ft)</Label>
                          <Input
                            type="number"
                            value={room.width}
                            onChange={(e) => updateRoom(room.id, 'width', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Height (ft)</Label>
                          <Input
                            type="number"
                            value={room.height}
                            onChange={(e) => updateRoom(room.id, 'height', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      {/* Paint Selection */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Paint Brand</Label>
                          <select
                            className="w-full h-10 px-3 rounded-md border"
                            value={room.paintBrand}
                            onChange={(e) => updateRoom(room.id, 'paintBrand', e.target.value)}
                          >
                            {PAINT_BRANDS.map(brand => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label>Paint Product</Label>
                          <select
                            className="w-full h-10 px-3 rounded-md border"
                            value={room.paintProduct}
                            onChange={(e) => updateRoom(room.id, 'paintProduct', e.target.value)}
                          >
                            {PAINT_BRANDS
                              .find(b => b.id === room.paintBrand)
                              ?.tiers.map(tier => (
                                <option key={tier.name} value={tier.name}>
                                  {tier.name} ({formatCurrency(tier.price)}/gal)
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      {/* Surfaces */}
                      <div>
                        <Label>Surfaces to Paint</Label>
                        <div className="flex gap-6 mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={room.includeWalls}
                              onChange={(e) => updateRoom(room.id, 'includeWalls', e.target.checked)}
                              className="rounded"
                            />
                            <span>Walls</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={room.includeCeiling}
                              onChange={(e) => updateRoom(room.id, 'includeCeiling', e.target.checked)}
                              className="rounded"
                            />
                            <span>Ceiling</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={room.includeTrim}
                              onChange={(e) => updateRoom(room.id, 'includeTrim', e.target.checked)}
                              className="rounded"
                            />
                            <span>Trim</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Room Button */}
            <div className="flex justify-center mb-8">
              <Button onClick={addRoom} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Room
              </Button>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center mb-8">
              <Button onClick={calculateQuote} size="lg">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Quote
              </Button>
            </div>

            {/* Results */}
            {result && (
              <Card className="bg-primary-50 border-primary-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Quote Estimate</CardTitle>
                  <CardDescription>
                    Based on {result.totalSquareFeet.toLocaleString()} square feet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Paint & Materials:</span>
                        <span className="font-medium">{formatCurrency(result.paintCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor:</span>
                        <span className="font-medium">{formatCurrency(result.laborCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Supplies:</span>
                        <span className="font-medium">{formatCurrency(result.suppliesCost)}</span>
                      </div>
                      {result.prepCost > 0 && (
                        <div className="flex justify-between">
                          <span>Prep Work:</span>
                          <span className="font-medium">{formatCurrency(result.prepCost)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(result.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Overhead (15%):</span>
                        <span>{formatCurrency(result.overhead)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Markup (35%):</span>
                        <span>{formatCurrency(result.markup)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax (8.5%):</span>
                        <span>{formatCurrency(result.tax)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold text-primary-700">
                        <span>Total Estimate:</span>
                        <span>{formatCurrency(result.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">
                      This is an estimate only. Actual costs may vary based on wall condition, 
                      prep work required, and other factors. Contact us for a detailed quote.
                    </p>
                  </div>

                  <div className="mt-6">
                    <Button asChild className="w-full" size="lg">
                      <a href="/get-quote">Get Detailed Quote</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}