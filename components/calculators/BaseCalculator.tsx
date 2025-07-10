import React, { useState, useCallback } from 'react';
import { CalculatorInputs, CalculationResult, PaintProduct } from './types';

// Mock paint products data - replace with actual data source
const PAINT_PRODUCTS: PaintProduct[] = [
  {
    id: 'prem-1',
    name: 'Premium Interior Paint',
    type: 'premium',
    coveragePerGallon: 400,
    pricePerGallon: 45.99,
    description: 'High-quality paint with excellent coverage and durability',
    features: ['One-coat coverage', 'Stain resistant', 'Washable', '10-year warranty']
  },
  {
    id: 'std-1',
    name: 'Standard Interior Paint',
    type: 'standard',
    coveragePerGallon: 350,
    pricePerGallon: 28.99,
    description: 'Good quality paint for most interior surfaces',
    features: ['Good coverage', 'Durable', 'Easy to apply', '5-year warranty']
  },
  {
    id: 'eco-1',
    name: 'Economy Interior Paint',
    type: 'economy',
    coveragePerGallon: 300,
    pricePerGallon: 18.99,
    description: 'Budget-friendly paint for basic coverage',
    features: ['Basic coverage', 'Quick drying', '2-year warranty']
  }
];

export const useCalculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePaintNeeded = useCallback((
    area: number,
    coats: number,
    paintType: 'premium' | 'standard' | 'economy'
  ): CalculationResult => {
    // Find products of selected type
    const products = PAINT_PRODUCTS.filter(p => p.type === paintType);
    const selectedProduct = products[0]; // Use first product of type
    
    if (!selectedProduct) {
      throw new Error('No paint product found for selected type');
    }

    // Calculate coverage
    const totalArea = area * coats;
    const adjustedArea = totalArea * 0.9; // Account for windows/doors (10% reduction)
    
    // Calculate paint needed
    const gallonsNeeded = Math.ceil(adjustedArea / selectedProduct.coveragePerGallon);
    const quartsNeeded = gallonsNeeded * 4;
    const litersNeeded = gallonsNeeded * 3.785;
    
    // Calculate costs
    const paintCost = gallonsNeeded * selectedProduct.pricePerGallon;
    const laborCost = area * 2.5; // $2.50 per sq ft labor estimate
    
    // Time estimate (150 sq ft per hour for one coat)
    const hoursNeeded = (totalArea / 150);
    const daysNeeded = Math.ceil(hoursNeeded / 8);

    return {
      paintNeeded: {
        gallons: gallonsNeeded,
        quarts: quartsNeeded,
        liters: parseFloat(litersNeeded.toFixed(2))
      },
      coverage: {
        totalArea,
        adjustedArea
      },
      cost: {
        paint: parseFloat(paintCost.toFixed(2)),
        labor: parseFloat(laborCost.toFixed(2)),
        total: parseFloat((paintCost + laborCost).toFixed(2))
      },
      recommendedProducts: products,
      timeEstimate: {
        hours: parseFloat(hoursNeeded.toFixed(1)),
        days: daysNeeded
      }
    };
  }, []);

  return {
    calculatePaintNeeded,
    isCalculating,
    setIsCalculating
  };
};

interface BaseCalculatorFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  description?: string;
}

export const BaseCalculatorForm: React.FC<BaseCalculatorFormProps> = ({
  children,
  onSubmit,
  title,
  description
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
        </form>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  type?: 'number' | 'text';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
  suffix?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'number',
  value,
  onChange,
  min,
  max,
  step,
  required = true,
  helpText,
  suffix
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  helpText?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = true,
  helpText
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helpText?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onChange,
  helpText
}) => {
  return (
    <div className="space-y-1">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
      {helpText && (
        <p className="ml-6 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export const SubmitButton: React.FC<{ isCalculating?: boolean }> = ({ isCalculating = false }) => {
  return (
    <button
      type="submit"
      disabled={isCalculating}
      className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
        isCalculating
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      }`}
    >
      {isCalculating ? 'Calculating...' : 'Calculate Paint Needed'}
    </button>
  );
};