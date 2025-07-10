'use client'

import React, { useState } from 'react'
import { 
  calculatePaintingProject, 
  PaintCalculationInput, 
  PaintCalculationResult
} from '@/lib/calculators/paint-calculator-engine'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Home, Info, Palette } from 'lucide-react'

interface CabinetCalculatorProps {
  onCalculate: (result: PaintCalculationResult) => void
}

export function CabinetCalculator({ onCalculate }: CabinetCalculatorProps) {
  const [cabinetType, setCabinetType] = useState('kitchen')
  const [cabinetCount, setCabinetCount] = useState('')
  const [cabinetStyle, setCabinetStyle] = useState('shaker')
  const [currentFinish, setCurrentFinish] = useState('wood')
  
  const [paintQuality, setPaintQuality] = useState<'economy' | 'standard' | 'premium'>('premium')
  const [numberOfCoats, setNumberOfCoats] = useState('2')
  const [primerNeeded, setPrimerNeeded] = useState('yes')
  
  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validateInputs = (): boolean => {
    const newErrors: string[] = []
    
    if (!cabinetCount || parseInt(cabinetCount) <= 0) {
      newErrors.push('Please enter the number of cabinets')
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCalculate = async () => {
    if (!validateInputs()) return
    
    setIsCalculating(true)
    
    try {
      // Adjust number of coats based on primer selection
      const totalCoats = primerNeeded === 'yes' ? parseInt(numberOfCoats) + 1 : parseInt(numberOfCoats)
      
      const input: PaintCalculationInput = {
        type: 'cabinet',
        dimensions: {
          cabinetCount: parseInt(cabinetCount)
        },
        surfaces: {
          // Cabinets always have all surfaces painted
          walls: true
        },
        paintQuality,
        coats: totalCoats
      }
      
      const result = calculatePaintingProject(input)
      
      // Adjust recommendations based on cabinet specifics
      if (currentFinish === 'laminate') {
        result.recommendations.primerNeeded = true
        result.recommendations.paintType = 'Bonding Primer + Hybrid Enamel'
      } else if (currentFinish === 'painted') {
        result.recommendations.paintType = 'Hybrid Enamel'
      }
      
      // Add cabinet-specific details to recommendations
      result.recommendations.brandSuggestions = [
        'Benjamin Moore Advance',
        'Sherwin-Williams ProClassic',
        'PPG Breakthrough'
      ]
      
      onCalculate(result)
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors(['An error occurred during calculation. Please try again.'])
    } finally {
      setIsCalculating(false)
    }
  }

  // Cabinet count suggestions based on type
  const getCabinetCountPlaceholder = () => {
    switch (cabinetType) {
      case 'kitchen': return '20-30'
      case 'bathroom': return '3-6'
      case 'laundry': return '4-8'
      case 'custom': return '10'
      default: return '10'
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Cabinet Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Cabinet Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="cabinetType">Cabinet Location</Label>
            <select 
              id="cabinetType"
              className="w-full mt-2 p-2 border rounded-md"
              value={cabinetType}
              onChange={(e) => setCabinetType(e.target.value)}
            >
              <option value="kitchen">Kitchen Cabinets</option>
              <option value="bathroom">Bathroom Vanity</option>
              <option value="laundry">Laundry Room</option>
              <option value="custom">Custom/Built-in</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="cabinetCount">Number of Cabinet Doors & Drawers</Label>
            <Input
              id="cabinetCount"
              type="number"
              value={cabinetCount}
              onChange={(e) => setCabinetCount(e.target.value)}
              placeholder={getCabinetCountPlaceholder()}
              min="1"
              max="100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Count all doors and drawer fronts that need painting
            </p>
          </div>
          
          <div>
            <Label htmlFor="cabinetStyle">Cabinet Style</Label>
            <select 
              id="cabinetStyle"
              className="w-full mt-2 p-2 border rounded-md"
              value={cabinetStyle}
              onChange={(e) => setCabinetStyle(e.target.value)}
            >
              <option value="shaker">Shaker Style</option>
              <option value="raised-panel">Raised Panel</option>
              <option value="flat-panel">Flat Panel/Slab</option>
              <option value="detailed">Detailed/Ornate</option>
            </select>
          </div>
          
          <div>
            <Label>Current Cabinet Finish</Label>
            <RadioGroup value={currentFinish} onValueChange={setCurrentFinish}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="wood" id="wood" />
                <Label htmlFor="wood" className="cursor-pointer">
                  Natural Wood/Stained
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="painted" id="painted" />
                <Label htmlFor="painted" className="cursor-pointer">
                  Previously Painted
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="laminate" id="laminate" />
                <Label htmlFor="laminate" className="cursor-pointer">
                  Laminate/Thermofoil
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </Card>
      
      {/* Paint Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Cabinet Paint Options
        </h3>
        <div className="space-y-6">
          <div>
            <Label>Primer Required?</Label>
            <RadioGroup value={primerNeeded} onValueChange={setPrimerNeeded}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="yes" id="primer-yes" />
                <Label htmlFor="primer-yes" className="cursor-pointer">
                  Yes - Recommended for best adhesion
                  <span className="text-sm text-gray-500 block">Essential for wood or color changes</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="no" id="primer-no" />
                <Label htmlFor="primer-no" className="cursor-pointer">
                  No - Cabinets already primed/painted
                  <span className="text-sm text-gray-500 block">Only if repainting same color</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label>Paint Quality</Label>
            <RadioGroup value={paintQuality} onValueChange={(value: any) => setPaintQuality(value)}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="economy" id="economy" />
                <Label htmlFor="economy" className="cursor-pointer">
                  Economy ($40-50/gallon)
                  <span className="text-sm text-gray-500 block">Basic cabinet paint</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="cursor-pointer">
                  Standard ($60-75/gallon)
                  <span className="text-sm text-gray-500 block">Good durability and flow</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="cursor-pointer">
                  Premium ($80-100/gallon)
                  <span className="text-sm text-gray-500 block">Professional cabinet enamel</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="coats">Number of Finish Coats</Label>
            <select 
              id="coats"
              className="w-full mt-2 p-2 border rounded-md"
              value={numberOfCoats}
              onChange={(e) => setNumberOfCoats(e.target.value)}
            >
              <option value="1">1 Coat (light refresh)</option>
              <option value="2">2 Coats (standard)</option>
              <option value="3">3 Coats (maximum durability)</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 font-semibold mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Calculate Button */}
      <Button 
        onClick={handleCalculate}
        disabled={isCalculating}
        className="w-full"
        size="lg"
      >
        {isCalculating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Calculating...
          </>
        ) : (
          <>
            <Palette className="w-5 h-5 mr-2" />
            Calculate Cabinet Painting Cost
          </>
        )}
      </Button>
      
      {/* Info Box */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-800">
            <p className="font-semibold mb-1">Cabinet Painting Note:</p>
            <p>Cabinet painting requires meticulous preparation and high-quality materials for a factory-like finish. 
            Our calculator includes time for proper cleaning, sanding, priming, and multiple finish coats.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}