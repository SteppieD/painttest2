"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProgressiveEstimate } from '@/lib/progressive-calculator';

interface ProgressiveEstimateDisplayProps {
  estimate: ProgressiveEstimate;
  isVisible: boolean;
  onEstimateClick?: () => void;
}

export function ProgressiveEstimateDisplay({ 
  estimate, 
  isVisible, 
  onEstimateClick 
}: ProgressiveEstimateDisplayProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);

  // Animate price changes
  useEffect(() => {
    setAnimatePrice(true);
    const timer = setTimeout(() => setAnimatePrice(false), 600);
    return () => clearTimeout(timer);
  }, [estimate.estimatedPrice]);

  if (!isVisible) return null;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle2 className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Running Estimate</span>
          <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(estimate.confidence)}`}>
            <div className="flex items-center gap-1">
              {getConfidenceIcon(estimate.confidence)}
              {estimate.confidence}
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div 
          className={`text-center mb-3 cursor-pointer transition-all duration-300 ${
            animatePrice ? 'scale-105' : 'scale-100'
          }`}
          onClick={onEstimateClick}
        >
          {estimate.confidence === 'high' ? (
            <div className="text-2xl font-bold text-blue-700">
              ${estimate.estimatedPrice.toLocaleString()}
            </div>
          ) : (
            <div className="text-lg font-bold text-blue-700">
              ${estimate.suggestedRange.min.toLocaleString()} - ${estimate.suggestedRange.max.toLocaleString()}
            </div>
          )}
          <div className="text-xs text-gray-600 mt-1">
            {estimate.completeness}% complete • Click for details
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Estimate Accuracy</span>
            <span className="text-xs font-medium text-gray-700">{estimate.completeness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${estimate.completeness}%` }}
            />
          </div>
        </div>

        {/* Quick Breakdown Toggle */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {showBreakdown ? 'Hide' : 'Show'} Breakdown
        </button>

        {/* Breakdown Details */}
        {showBreakdown && (
          <div className="mt-3 pt-3 border-t border-blue-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Materials</span>
              <span className="font-medium">${estimate.breakdown.materials.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Labor</span>
              <span className="font-medium">${estimate.breakdown.labor.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Markup</span>
              <span className="font-medium">${estimate.breakdown.markup.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold pt-1 border-t border-blue-200">
              <span>Total</span>
              <span>${estimate.breakdown.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Missing Data Hint */}
        {estimate.missingData.length > 0 && estimate.completeness < 80 && (
          <div className="mt-3 text-xs text-gray-600">
            <div className="font-medium mb-1">For better accuracy:</div>
            <div className="text-gray-500">
              {estimate.missingData.slice(0, 2).join(', ')}
              {estimate.missingData.length > 2 && ` +${estimate.missingData.length - 2} more`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Floating estimate widget for minimal disruption
 */
export function FloatingEstimateWidget({ 
  estimate, 
  isVisible, 
  onToggle 
}: { 
  estimate: ProgressiveEstimate;
  isVisible: boolean;
  onToggle: () => void;
}) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-30 cursor-pointer transform transition-all duration-300 hover:scale-105"
      onClick={onToggle}
    >
      <Card className="bg-blue-600 text-white shadow-lg border-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <div className="text-sm">
              <div className="font-semibold">
                {estimate.confidence === 'high' 
                  ? `$${estimate.estimatedPrice.toLocaleString()}`
                  : `$${estimate.suggestedRange.min.toLocaleString()}-${estimate.suggestedRange.max.toLocaleString()}`
                }
              </div>
              <div className="text-xs opacity-90">
                {estimate.completeness}% complete
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}