import React, { useState, useCallback } from 'react';
import { 
  InteriorCalculatorInputs, 
  CalculationResult,
  CalculatorProps 
} from './types';
import { 
  useCalculator,
  BaseCalculatorForm,
  InputField,
  SelectField,
  CheckboxField,
  SubmitButton
} from './BaseCalculator';

const ROOM_TYPES = [
  { value: 'living', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' }
];

const PAINT_TYPES = [
  { value: 'premium', label: 'Premium Paint' },
  { value: 'standard', label: 'Standard Paint' },
  { value: 'economy', label: 'Economy Paint' }
];

const CEILING_HEIGHTS = [
  { value: '8', label: '8 feet' },
  { value: '9', label: '9 feet' },
  { value: '10', label: '10 feet' },
  { value: '12', label: '12 feet' },
  { value: '14', label: '14 feet' }
];

export const InteriorCalculator: React.FC<CalculatorProps> = ({ 
  onCalculate, 
  initialValues 
}) => {
  const { calculatePaintNeeded, isCalculating, setIsCalculating } = useCalculator();
  
  const [inputs, setInputs] = useState<InteriorCalculatorInputs>({
    area: initialValues?.area || 0,
    coats: initialValues?.coats || 2,
    paintType: initialValues?.paintType || 'standard',
    roomType: 'living',
    ceilingHeight: 9,
    includesCeiling: false,
    includesTorim: false,
    trimLinearFeet: 0
  });

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setInputs(prev => ({ ...prev, [name]: checked }));
    } else {
      setInputs(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  }, []);

  const calculateInteriorPaint = useCallback((inputs: InteriorCalculatorInputs): CalculationResult => {
    let totalArea = inputs.area;
    
    // Add ceiling area if included
    if (inputs.includesCeiling) {
      // Assume room is roughly square, so ceiling area ≈ floor area
      totalArea += inputs.area;
    }
    
    // Add trim area if included
    if (inputs.includesTorim && inputs.trimLinearFeet) {
      // Assume average trim height of 0.5 feet
      const trimArea = inputs.trimLinearFeet * 0.5;
      totalArea += trimArea;
    }
    
    // Adjust for room type (different room types may need different coverage)
    const roomTypeMultiplier = {
      living: 1.0,
      bedroom: 0.95,
      kitchen: 1.1, // Kitchen may need more durable paint
      bathroom: 1.15 // Bathroom needs moisture-resistant paint
    };
    
    totalArea *= roomTypeMultiplier[inputs.roomType];
    
    // Use the base calculator with adjusted area
    const result = calculatePaintNeeded(totalArea, inputs.coats, inputs.paintType);
    
    // Add room-specific recommendations
    if (inputs.roomType === 'kitchen' || inputs.roomType === 'bathroom') {
      result.recommendedProducts = result.recommendedProducts.map(product => ({
        ...product,
        features: [...product.features, 'Moisture resistant']
      }));
    }
    
    return result;
  }, [calculatePaintNeeded]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    try {
      const result = calculateInteriorPaint(inputs);
      onCalculate(result);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [inputs, calculateInteriorPaint, onCalculate, setIsCalculating]);

  return (
    <BaseCalculatorForm
      onSubmit={handleSubmit}
      title="Interior Paint Calculator"
      description="Calculate how much paint you need for your interior painting project"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Room Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Room Details</h3>
          
          <SelectField
            label="Room Type"
            name="roomType"
            value={inputs.roomType}
            onChange={handleInputChange}
            options={ROOM_TYPES}
          />
          
          <InputField
            label="Wall Area"
            name="area"
            value={inputs.area}
            onChange={handleInputChange}
            min={1}
            max={10000}
            suffix="sq ft"
            helpText="Total wall area to be painted"
          />
          
          <SelectField
            label="Ceiling Height"
            name="ceilingHeight"
            value={inputs.ceilingHeight.toString()}
            onChange={handleInputChange}
            options={CEILING_HEIGHTS}
            helpText="Used for calculating wall area if needed"
          />
        </div>

        {/* Paint Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Paint Details</h3>
          
          <SelectField
            label="Paint Type"
            name="paintType"
            value={inputs.paintType}
            onChange={handleInputChange}
            options={PAINT_TYPES}
            helpText="Premium paints offer better coverage and durability"
          />
          
          <InputField
            label="Number of Coats"
            name="coats"
            value={inputs.coats}
            onChange={handleInputChange}
            min={1}
            max={5}
            helpText="Usually 2 coats for best results"
          />
        </div>
      </div>

      {/* Additional Options */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Surfaces</h3>
        
        <div className="space-y-3">
          <CheckboxField
            label="Include Ceiling"
            name="includesCeiling"
            checked={inputs.includesCeiling}
            onChange={handleInputChange}
            helpText="Add ceiling area to calculation"
          />
          
          <CheckboxField
            label="Include Trim/Baseboards"
            name="includesTorim"
            checked={inputs.includesTorim}
            onChange={handleInputChange}
            helpText="Add trim painting to calculation"
          />
          
          {inputs.includesTorim && (
            <InputField
              label="Trim Linear Feet"
              name="trimLinearFeet"
              value={inputs.trimLinearFeet || ''}
              onChange={handleInputChange}
              min={0}
              max={1000}
              suffix="ft"
              helpText="Total length of trim to be painted"
            />
          )}
        </div>
      </div>

      <SubmitButton isCalculating={isCalculating} />
    </BaseCalculatorForm>
  );
};

// Quick calculation widget for mobile/sidebar
export const InteriorQuickCalc: React.FC<{ onCalculate: (result: CalculationResult) => void }> = ({ 
  onCalculate 
}) => {
  const { calculatePaintNeeded } = useCalculator();
  const [area, setArea] = useState('');
  
  const handleQuickCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculatePaintNeeded(parseFloat(area) || 0, 2, 'standard');
    onCalculate(result);
  };
  
  return (
    <form onSubmit={handleQuickCalc} className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Quick Estimate</h3>
      <div className="space-y-3">
        <input
          type="number"
          placeholder="Enter wall area (sq ft)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Quick Calculate
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Assumes 2 coats of standard paint
      </p>
    </form>
  );
};