// Calculator Types and Interfaces

export interface CalculatorInputs {
  area: number;
  coats: number;
  paintType: 'premium' | 'standard' | 'economy';
}

export interface InteriorCalculatorInputs extends CalculatorInputs {
  roomType: 'living' | 'bedroom' | 'kitchen' | 'bathroom';
  ceilingHeight: number;
  includesCeiling: boolean;
  includesTorim: boolean;
  trimLinearFeet?: number;
}

export interface PaintProduct {
  id: string;
  name: string;
  type: 'premium' | 'standard' | 'economy';
  coveragePerGallon: number;
  pricePerGallon: number;
  description: string;
  features: string[];
}

export interface CalculationResult {
  paintNeeded: {
    gallons: number;
    quarts: number;
    liters: number;
  };
  coverage: {
    totalArea: number;
    adjustedArea: number; // After accounting for windows/doors
  };
  cost: {
    paint: number;
    labor?: number;
    total: number;
  };
  recommendedProducts: PaintProduct[];
  timeEstimate?: {
    hours: number;
    days: number;
  };
}

export interface CalculatorProps {
  onCalculate: (result: CalculationResult) => void;
  initialValues?: Partial<CalculatorInputs>;
}