'use client'

import React, { useState, useCallback } from 'react'
import { 
  calculatePaintingProject, 
  PaintCalculationInput, 
  PaintCalculationResult,
  formatCurrency 
} from '@/lib/calculators/paint-calculator-engine'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Calculator, Info } from 'lucide-react'

interface InteriorCalculatorProps {
  onCalculate: (result: PaintCalculationResult) => void
}

export function InteriorCalculator({ onCalculate }: InteriorCalculatorProps) {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '8'
  })
  
  const [surfaces, setSurfaces] = useState({
    walls: true,
    ceiling: false,
    trim: false,
    doors: false,
    windows: false
  })
  
  const [additionalInputs, setAdditionalInputs] = useState({
    doors: '0',
    windows: '0'
  })
  
  const [paintQuality, setPaintQuality] = useState<'economy' | 'standard' | 'premium'>('standard')
  const [numberOfCoats, setNumberOfCoats] = useState('2')
  
  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleDimensionChange = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
    setErrors([]) // Clear errors on input change
  }

  const handleSurfaceChange = (surface: string, checked: boolean) => {
    setSurfaces(prev => ({ ...prev, [surface]: checked }))
    setErrors([])
  }

  const validateInputs = (): boolean => {
    const newErrors: string[] = []
    
    if (!dimensions.length || parseFloat(dimensions.length) <= 0) {
      newErrors.push('Please enter a valid room length')
    }
    if (!dimensions.width || parseFloat(dimensions.width) <= 0) {
      newErrors.push('Please enter a valid room width')
    }
    if (!dimensions.height || parseFloat(dimensions.height) <= 0) {
      newErrors.push('Please enter a valid ceiling height')
    }
    if (!Object.values(surfaces).some(v => v)) {
      newErrors.push('Please select at least one surface to paint')
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleCalculate = async () => {
    if (!validateInputs()) return
    
    setIsCalculating(true)
    
    try {
      const input: PaintCalculationInput = {
        type: 'interior',
        dimensions: {
          length: parseFloat(dimensions.length),
          width: parseFloat(dimensions.width),
          height: parseFloat(dimensions.height),
          doors: surfaces.doors ? parseInt(additionalInputs.doors) || 2 : 0,
          windows: surfaces.windows ? parseInt(additionalInputs.windows) || 2 : 0
        },
        surfaces,
        paintQuality,
        coats: parseInt(numberOfCoats)
      }
      
      const result = calculatePaintingProject(input)
      onCalculate(result)
    } catch (error) {
      console.error('Calculation error:', error)
      setErrors(['An error occurred during calculation. Please try again.'])
    } finally {
      setIsCalculating(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Room Dimensions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Room Dimensions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="length">Length (ft)</Label>
            <Input
              id="length"
              type="number"
              value={dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder="12"
              step="0.5"
            />
          </div>
          <div>
            <Label htmlFor="width">Width (ft)</Label>
            <Input
              id="width"
              type="number"
              value={dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder="10"
              step="0.5"
            />
          </div>
          <div>
            <Label htmlFor="height">Ceiling Height (ft)</Label>
            <Input
              id="height"
              type="number"
              value={dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder="8"
              step="0.5"
            />
          </div>
        </div>
      </Card>
      
      {/* Surfaces to Paint */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Surfaces to Paint</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="walls" 
              checked={surfaces.walls}
              onCheckedChange={(checked) => handleSurfaceChange('walls', !!checked)}
            />
            <Label htmlFor="walls" className="cursor-pointer">
              Walls
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ceiling" 
              checked={surfaces.ceiling}
              onCheckedChange={(checked) => handleSurfaceChange('ceiling', !!checked)}
            />
            <Label htmlFor="ceiling" className="cursor-pointer">
              Ceiling
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="trim" 
              checked={surfaces.trim}
              onCheckedChange={(checked) => handleSurfaceChange('trim', !!checked)}
            />
            <Label htmlFor="trim" className="cursor-pointer">
              Trim/Baseboards
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="doors" 
              checked={surfaces.doors}
              onCheckedChange={(checked) => handleSurfaceChange('doors', !!checked)}
            />
            <Label htmlFor="doors" className="cursor-pointer">
              Doors
            </Label>
            {surfaces.doors && (
              <Input
                type="number"
                value={additionalInputs.doors}
                onChange={(e) => setAdditionalInputs(prev => ({ ...prev, doors: e.target.value }))}
                placeholder="2"
                className="w-20 ml-4"
                min="0"
                max="10"
              />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="windows" 
              checked={surfaces.windows}
              onCheckedChange={(checked) => handleSurfaceChange('windows', !!checked)}
            />
            <Label htmlFor="windows" className="cursor-pointer">
              Window Trim
            </Label>
            {surfaces.windows && (
              <Input
                type="number"
                value={additionalInputs.windows}
                onChange={(e) => setAdditionalInputs(prev => ({ ...prev, windows: e.target.value }))}
                placeholder="2"
                className="w-20 ml-4"
                min="0"
                max="20"
              />
            )}
          </div>
        </div>
      </Card>
      
      {/* Paint Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Paint Options</h3>
        <div className="space-y-6">
          <div>
            <Label>Paint Quality</Label>
            <RadioGroup value={paintQuality} onValueChange={(value: any) => setPaintQuality(value)}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="economy" id="economy" />
                <Label htmlFor="economy" className="cursor-pointer">
                  Economy ($25-35/gallon)
                  <span className="text-sm text-gray-500 block">Good coverage, basic durability</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="cursor-pointer">
                  Standard ($40-55/gallon)
                  <span className="text-sm text-gray-500 block">Better coverage, washable finish</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="cursor-pointer">
                  Premium ($60-80/gallon)
                  <span className="text-sm text-gray-500 block">Best coverage, stain resistant, longest lasting</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="coats">Number of Coats</Label>
            <select 
              id="coats"
              className="w-full mt-2 p-2 border rounded-md"
              value={numberOfCoats}
              onChange={(e) => setNumberOfCoats(e.target.value)}
            >
              <option value="1">1 Coat (touch-up only)</option>
              <option value="2">2 Coats (standard)</option>
              <option value="3">3 Coats (color change)</option>
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
            <Calculator className="w-5 h-5 mr-2" />
            Calculate Interior Painting Cost
          </>
        )}
      </Button>
      
      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Pro Tip:</p>
            <p>Our calculator automatically deducts 10% for doors and windows in wall calculations. 
            For more accurate results, measure each wall individually and subtract large openings.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}