import React from 'react';
import { CalculationResult } from './types';

interface CalculatorResultsProps {
  result: CalculationResult;
  onReset?: () => void;
}

export const CalculatorResults: React.FC<CalculatorResultsProps> = ({ result, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Paint Calculation Results
          </h2>
          {onReset && (
            <button
              onClick={onReset}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Calculate Again
            </button>
          )}
        </div>

        {/* Paint Needed Section */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Gallons Needed</h3>
            <p className="text-3xl font-bold text-blue-600">{result.paintNeeded.gallons}</p>
            <p className="text-sm text-blue-700 mt-1">
              ({result.paintNeeded.liters} liters)
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Coverage Area</h3>
            <p className="text-3xl font-bold text-green-600">{result.coverage.totalArea}</p>
            <p className="text-sm text-green-700 mt-1">square feet</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Total Cost</h3>
            <p className="text-3xl font-bold text-purple-600">${result.cost.total}</p>
            <p className="text-sm text-purple-700 mt-1">Paint + Labor</p>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Paint Cost:</span>
              <span className="font-medium">${result.cost.paint}</span>
            </div>
            {result.cost.labor !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Labor:</span>
                <span className="font-medium">${result.cost.labor}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${result.cost.total}</span>
            </div>
          </div>
        </div>

        {/* Time Estimate */}
        {result.timeEstimate && (
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Time Estimate</h3>
            <div className="flex gap-8">
              <div>
                <span className="text-2xl font-bold text-yellow-600">
                  {result.timeEstimate.hours}
                </span>
                <span className="text-yellow-700 ml-1">hours</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-600">
                  {result.timeEstimate.days}
                </span>
                <span className="text-yellow-700 ml-1">
                  {result.timeEstimate.days === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Products</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.recommendedProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-green-600">
                    ${product.pricePerGallon}/gal
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.coveragePerGallon} sq ft/gal
                  </span>
                </div>
                <div className="space-y-1">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Tips for Your Project</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Buy 10% extra paint for touch-ups and future repairs</li>
            <li>• Consider primer if changing colors drastically</li>
            <li>• Account for multiple coats on new drywall</li>
            <li>• Store leftover paint properly for future use</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Mobile-optimized summary component
export const CalculatorResultsSummary: React.FC<{ result: CalculationResult }> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Paint Needed</p>
          <p className="text-xl font-bold text-blue-600">{result.paintNeeded.gallons} gal</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-xl font-bold text-green-600">${result.cost.total}</p>
        </div>
      </div>
    </div>
  );
};