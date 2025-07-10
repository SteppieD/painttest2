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
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Home, Info, AlertCircle } from 'lucide-react'

interface ExteriorCalculatorProps {
  onCalculate: (result: PaintCalculationResult) => void
}

export function ExteriorCalculator({ onCalculate }: ExteriorCalculatorProps) {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    stories: '1'
  })
  
  const [surfaces, setSurfaces] = useState({
    siding: true,
    soffit: false,
    fascia: false,
    trim: false,
    doors: false,
    windows: false
  })
  
  const [additionalInputs, setAdditionalInputs] = useState({
    doors: '2',
    windows: '8',
    garageDoors: '0'
  })
  
  const [paintQuality, setPaintQuality] = useState<'economy' | 'standard' | 'premium'>('standard')
  const [numberOfCoats, setNumberOfCoats] = useState('2')
  const [surfaceCondition, setSurfaceCondition] = useState('average')
  
  const [isCalculating, setIsCalculating] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleDimensionChange = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
    setErrors([])
  }

  const handleSurfaceChange = (surface: string, checked: boolean) => {
    setSurfaces(prev => ({ ...prev, [surface]: checked }))
    setErrors([])
  }

  const validateInputs = (): boolean => {
    const newErrors: string[] = []
    
    if (!dimensions.length || parseFloat(dimensions.length) <= 0) {
      newErrors.push('Please enter a valid house length')
    }
    if (!dimensions.width || parseFloat(dimensions.width) <= 0) {
      newErrors.push('Please enter a valid house width')
    }
    if (!dimensions.height || parseFloat(dimensions.height) <= 0) {
      newErrors.push('Please enter a valid wall height')
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
      // Calculate total height based on stories
      const storyMultiplier = parseInt(dimensions.stories)
      const totalHeight = parseFloat(dimensions.height) * storyMultiplier
      
      const input: PaintCalculationInput = {
        type: 'exterior',
        dimensions: {
          length: parseFloat(dimensions.length),
          width: parseFloat(dimensions.width),
          height: totalHeight,
          doors: surfaces.doors ? parseInt(additionalInputs.doors) + parseInt(additionalInputs.garageDoors) : 0,
          windows: surfaces.windows ? parseInt(additionalInputs.windows) : 0
        },
        surfaces: {
          siding: surfaces.siding,
          soffit: surfaces.soffit,
          fascia: surfaces.fascia,
          trim: surfaces.trim,
          doors: surfaces.doors,
          windows: surfaces.windows
        },
        paintQuality,
        coats: parseInt(numberOfCoats),
        // Adjust coverage for surface condition
        paintCoverage: surfaceCondition === 'rough' ? 300 : surfaceCondition === 'smooth' ? 400 : 350
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
      {/* House Dimensions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Home className="w-5 h-5" />
          House Dimensions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="length">House Length (ft)</Label>
            <Input
              id="length"
              type="number"
              value={dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder="40"
              step="1"
            />
          </div>
          <div>
            <Label htmlFor="width">House Width (ft)</Label>
            <Input
              id="width"
              type="number"
              value={dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder="30"
              step="1"
            />
          </div>
          <div>
            <Label htmlFor="height">Wall Height per Story (ft)</Label>
            <Input
              id="height"
              type="number"
              value={dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder="10"
              step="0.5"
            />
          </div>
          <div>
            <Label htmlFor="stories">Number of Stories</Label>
            <select 
              id="stories"
              className="w-full p-2 border rounded-md"
              value={dimensions.stories}
              onChange={(e) => handleDimensionChange('stories', e.target.value)}
            >
              <option value="1">1 Story</option>
              <option value="1.5">1.5 Stories</option>
              <option value="2">2 Stories</option>
              <option value="2.5">2.5 Stories</option>
              <option value="3">3 Stories</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Surfaces to Paint */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Surfaces to Paint</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="siding" 
              checked={surfaces.siding}
              onCheckedChange={(checked) => handleSurfaceChange('siding', !!checked)}
            />
            <Label htmlFor="siding" className="cursor-pointer">
              Siding / Walls
              <span className="text-sm text-gray-500 block">Main exterior walls</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="soffit" 
              checked={surfaces.soffit}
              onCheckedChange={(checked) => handleSurfaceChange('soffit', !!checked)}
            />
            <Label htmlFor="soffit" className="cursor-pointer">
              Soffits
              <span className="text-sm text-gray-500 block">Underside of roof overhangs</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fascia" 
              checked={surfaces.fascia}
              onCheckedChange={(checked) => handleSurfaceChange('fascia', !!checked)}
            />
            <Label htmlFor="fascia" className="cursor-pointer">
              Fascia Boards
              <span className="text-sm text-gray-500 block">Boards along roof edge</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="trim" 
              checked={surfaces.trim}
              onCheckedChange={(checked) => handleSurfaceChange('trim', !!checked)}
            />
            <Label htmlFor="trim" className="cursor-pointer">
              Trim / Shutters
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="doors" 
                checked={surfaces.doors}
                onCheckedChange={(checked) => handleSurfaceChange('doors', !!checked)}
              />
              <Label htmlFor="doors" className="cursor-pointer">
                Doors
              </Label>
            </div>
            {surfaces.doors && (
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="regularDoors" className="text-sm">Regular:</Label>
                  <Input
                    id="regularDoors"
                    type="number"
                    value={additionalInputs.doors}
                    onChange={(e) => setAdditionalInputs(prev => ({ ...prev, doors: e.target.value }))}
                    className="w-16"
                    min="0"
                    max="10"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Label htmlFor="garageDoors" className="text-sm">Garage:</Label>
                  <Input
                    id="garageDoors"
                    type="number"
                    value={additionalInputs.garageDoors}
                    onChange={(e) => setAdditionalInputs(prev => ({ ...prev, garageDoors: e.target.value }))}
                    className="w-16"
                    min="0"
                    max="4"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="windows" 
                checked={surfaces.windows}
                onCheckedChange={(checked) => handleSurfaceChange('windows', !!checked)}
              />
              <Label htmlFor="windows" className="cursor-pointer">
                Window Trim
              </Label>
            </div>
            {surfaces.windows && (
              <Input
                type="number"
                value={additionalInputs.windows}
                onChange={(e) => setAdditionalInputs(prev => ({ ...prev, windows: e.target.value }))}
                placeholder="8"
                className="w-20"
                min="0"
                max="50"
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
            <Label>Surface Condition</Label>
            <RadioGroup value={surfaceCondition} onValueChange={setSurfaceCondition}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="smooth" id="smooth" />
                <Label htmlFor="smooth" className="cursor-pointer">
                  Smooth / New (400 sq ft/gallon coverage)
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="average" id="average" />
                <Label htmlFor="average" className="cursor-pointer">
                  Average (350 sq ft/gallon coverage)
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="rough" id="rough" />
                <Label htmlFor="rough" className="cursor-pointer">
                  Rough / Textured (300 sq ft/gallon coverage)
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
                  Economy ($25-35/gallon)
                  <span className="text-sm text-gray-500 block">5-7 year durability</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="cursor-pointer">
                  Standard ($40-55/gallon)
                  <span className="text-sm text-gray-500 block">8-10 year durability</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-3">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium" className="cursor-pointer">
                  Premium ($60-80/gallon)
                  <span className="text-sm text-gray-500 block">12-15 year durability</span>
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
              <option value="3">3 Coats (bare wood/color change)</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Weather Notice */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Weather Considerations:</p>
            <p>Exterior painting requires dry conditions with temperatures between 50-90°F. 
            Budget may need adjustment for weather delays or seasonal scheduling.</p>
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
            <Home className="w-5 h-5 mr-2" />
            Calculate Exterior Painting Cost
          </>
        )}
      </Button>
      
      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Pro Tip:</p>
            <p>Our calculator automatically deducts 15% for doors, windows, and architectural features. 
            For homes with unusual designs or many windows, you may want to increase the deduction.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}