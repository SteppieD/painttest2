'use client'

import React from 'react'
import { PaintCalculationResult, formatCurrency } from '@/lib/calculators/paint-calculator-engine'
import { Card } from '@/components/ui/card'
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  Paintbrush, 
  Info,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

interface CalculatorResultsProps {
  results: PaintCalculationResult
}

export function CalculatorResults({ results }: CalculatorResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Cost</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(results.costs.total)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Paint Needed</p>
              <p className="text-3xl font-bold text-green-900">
                {results.paintNeeded.gallons} gal
              </p>
              <p className="text-xs text-green-600">
                ({results.paintNeeded.liters} liters)
              </p>
            </div>
            <Paintbrush className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Time Estimate</p>
              <p className="text-3xl font-bold text-purple-900">
                {results.timeEstimates.totalDays} {results.timeEstimates.totalDays === 1 ? 'day' : 'days'}
              </p>
              <p className="text-xs text-purple-600">
                ({results.timeEstimates.totalHours.toFixed(1)} hours)
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Cost Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Paint & Primer</span>
            <span className="font-medium">{formatCurrency(results.costs.paint)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Labor</span>
            <span className="font-medium">{formatCurrency(results.costs.labor)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Supplies & Equipment</span>
            <span className="font-medium">{formatCurrency(results.costs.supplies)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-700">{formatCurrency(results.costs.subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-sm">
            <span className="text-gray-500">Overhead (15%)</span>
            <span className="text-gray-700">{formatCurrency(results.costs.overhead)}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-sm">
            <span className="text-gray-500">Profit Margin (25%)</span>
            <span className="text-gray-700">{formatCurrency(results.costs.profit)}</span>
          </div>
          <div className="flex justify-between pt-3 text-lg font-semibold">
            <span>Total Quote</span>
            <span className="text-blue-600">{formatCurrency(results.costs.total)}</span>
          </div>
        </div>
      </Card>

      {/* Surface Breakdown */}
      {Object.keys(results.breakdown).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Surface Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Surface</th>
                  <th className="text-right py-2">Area</th>
                  <th className="text-right py-2">Paint (gal)</th>
                  <th className="text-right py-2">Labor (hrs)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results.breakdown).map(([surface, details]) => (
                  <tr key={surface} className="border-b">
                    <td className="py-2 capitalize">{surface}</td>
                    <td className="text-right py-2">{details.area.toFixed(0)} sq ft</td>
                    <td className="text-right py-2">{details.paintGallons.toFixed(1)}</td>
                    <td className="text-right py-2">{details.laborHours.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Professional Recommendations
        </h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-700 mb-1">Paint Type</p>
            <p className="text-gray-600">{results.recommendations.paintType}</p>
          </div>
          
          <div>
            <p className="font-medium text-gray-700 mb-1">Sheen Recommendation</p>
            <p className="text-gray-600">{results.recommendations.sheenType}</p>
          </div>
          
          {results.recommendations.primerNeeded && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                <strong>Primer Required:</strong> We recommend using a quality primer for best results, 
                especially when changing colors or painting over stains.
              </p>
            </div>
          )}
          
          <div>
            <p className="font-medium text-gray-700 mb-2">Recommended Paint Brands</p>
            <div className="flex flex-wrap gap-2">
              {results.recommendations.brandSuggestions.map((brand, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Time Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Time Estimates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Preparation Time</p>
            <p className="text-xl font-semibold">{results.timeEstimates.prepHours.toFixed(1)} hours</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Painting Time</p>
            <p className="text-xl font-semibold">{results.timeEstimates.paintingHours.toFixed(1)} hours</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Time estimates assume a professional painter working at standard pace. 
              Actual time may vary based on surface condition and complexity.
            </p>
          </div>
        </div>
      </Card>

      {/* Savings Tip */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex gap-3">
          <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-900 mb-2">
              Save Time & Win More Jobs
            </h4>
            <p className="text-green-800 text-sm mb-3">
              Professional contractors using ProPaint Quote save an average of 3 hours per quote 
              and win 40% more jobs with instant, professional proposals.
            </p>
            <p className="text-green-700 text-sm font-medium">
              Turn this estimate into a professional quote in seconds →
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}