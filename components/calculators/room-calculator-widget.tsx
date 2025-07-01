'use client'

import { useState } from 'react'
import { Home, Calculator, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RoomCalculatorWidgetProps {
  title?: string
  className?: string
}

export function RoomCalculatorWidget({ 
  title = "Room Paint Calculator",
  className = ""
}: RoomCalculatorWidgetProps) {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('9')
  const [roomType, setRoomType] = useState('bedroom')
  const [result, setResult] = useState<{
    wallArea: number
    ceilingArea: number
    paintNeeded: number
    estimatedCost: number
  } | null>(null)

  const roomTypes = {
    bedroom: { windows: 2, doors: 1, factor: 1.0 },
    bathroom: { windows: 1, doors: 1, factor: 1.2 },
    kitchen: { windows: 2, doors: 2, factor: 1.3 },
    living_room: { windows: 3, doors: 2, factor: 1.1 },
    dining_room: { windows: 2, doors: 1, factor: 1.0 }
  }

  const calculateRoom = () => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 9
    
    if (l > 0 && w > 0) {
      const room = roomTypes[roomType as keyof typeof roomTypes]
      
      // Calculate wall area (perimeter × height)
      const wallArea = (2 * (l + w) * h)
      
      // Subtract windows and doors (rough estimate)
      const windowArea = room.windows * 15 // 15 sqft per window
      const doorArea = room.doors * 20 // 20 sqft per door
      const adjustedWallArea = wallArea - windowArea - doorArea
      
      // Ceiling area
      const ceilingArea = l * w
      
      // Total paintable area
      const totalArea = adjustedWallArea + ceilingArea
      
      // Paint needed (1 gallon covers ~350 sqft)
      const paintNeeded = Math.ceil(totalArea / 350)
      
      // Cost estimate ($45/gallon + $2.50/sqft labor)
      const paintCost = paintNeeded * 45
      const laborCost = totalArea * 2.50 * room.factor
      const estimatedCost = paintCost + laborCost
      
      setResult({
        wallArea: Math.round(adjustedWallArea),
        ceilingArea: Math.round(ceilingArea),
        paintNeeded,
        estimatedCost: Math.round(estimatedCost)
      })
    }
  }

  return (
    <Card className={`border-2 border-green-100 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Home className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">Calculate paint for individual rooms</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Length (ft)
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Width (ft)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Height (ft)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="9"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="bedroom">Bedroom</option>
              <option value="bathroom">Bathroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="living_room">Living Room</option>
              <option value="dining_room">Dining Room</option>
            </select>
          </div>
          
          <Button 
            onClick={calculateRoom}
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            Calculate Room
            <Ruler className="w-4 h-4 ml-2" />
          </Button>
          
          {result && (
            <div className="mt-4 space-y-2 bg-blue-50 border border-blue-200 p-3 rounded-md">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-800">
                  ${result.estimatedCost.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Room Total</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-semibold">{result.wallArea} sq ft</div>
                  <div className="text-gray-600">Wall area</div>
                </div>
                <div>
                  <div className="font-semibold">{result.ceilingArea} sq ft</div>
                  <div className="text-gray-600">Ceiling area</div>
                </div>
              </div>
              <div className="text-center text-xs">
                <div className="font-semibold">{result.paintNeeded} gallons needed</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}