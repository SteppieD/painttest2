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
    <Card className="card-flat w-full max-w-sm bg-white border-business-primary/20">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="icon-flat text-business-primary" />
          <span className="text-flat-subheading">Running Estimate</span>
          <div className={`ml-auto px-3 py-1 rounded-flat text-flat-sm font-semibold border ${getConfidenceColor(estimate.confidence)}`}>
            <div className="flex items-center gap-1">
              {getConfidenceIcon(estimate.confidence)}
              {estimate.confidence}
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div 
          className={`text-center mb-3 cursor-pointer transition-all duration-200 interactive-flat ${
            animatePrice ? 'scale-105' : 'scale-100'
          }`}
          onClick={onEstimateClick}
        >
          {estimate.confidence === 'high' ? (
            <div className="text-flat-2xl font-bold text-business-primary">
              ${estimate.estimatedPrice.toLocaleString()}
            </div>
          ) : (
            <div className="text-flat-lg font-bold text-business-primary">
              ${estimate.suggestedRange.min.toLocaleString()} - ${estimate.suggestedRange.max.toLocaleString()}
            </div>
          )}
          <div className="text-flat-caption mt-1">
            {estimate.completeness}% complete • Tap for details
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-flat-caption">Estimate Accuracy</span>
            <span className="text-flat-caption font-semibold">{estimate.completeness}%</span>
          </div>
          <div className="w-full bg-flat-gray-200 rounded-flat-full h-2">
            <div 
              className="bg-gradient-to-r from-business-primary to-business-primary-dark h-2 rounded-flat-full transition-all duration-300 ease-out"
              style={{ width: `${estimate.completeness}%` }}
            />
          </div>
        </div>

        {/* Quick Breakdown Toggle */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="btn-flat-primary w-full text-flat-sm"
        >
          {showBreakdown ? 'Hide' : 'Show'} Breakdown
        </button>

        {/* Breakdown Details */}
        {showBreakdown && (
          <div className="mt-3 pt-3 border-t border-flat-gray-200 space-y-2">
            <div className="flex justify-between text-flat-sm">
              <span className="text-flat-gray-600">Materials</span>
              <span className="font-semibold">${estimate.breakdown.materials.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-flat-sm">
              <span className="text-flat-gray-600">Labor</span>
              <span className="font-semibold">${estimate.breakdown.labor.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-flat-sm">
              <span className="text-flat-gray-600">Markup</span>
              <span className="font-semibold">${estimate.breakdown.markup.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-flat-sm font-bold pt-1 border-t border-flat-gray-200">
              <span>Total</span>
              <span>${estimate.breakdown.total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Missing Data Hint */}
        {estimate.missingData.length > 0 && estimate.completeness < 80 && (
          <div className="mt-3 text-flat-caption">
            <div className="font-semibold mb-1 text-business-warning">For better accuracy:</div>
            <div className="text-flat-gray-500">
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
      className="fixed bottom-4 right-4 z-30 cursor-pointer transform transition-all duration-200 interactive-flat"
      onClick={onToggle}
    >
      <Card className="bg-business-primary text-white shadow-flat border-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            <div className="text-flat-sm">
              <div className="font-bold">
                {estimate.confidence === 'high' 
                  ? `$${estimate.estimatedPrice.toLocaleString()}`
                  : `$${estimate.suggestedRange.min.toLocaleString()}-${estimate.suggestedRange.max.toLocaleString()}`
                }
              </div>
              <div className="text-flat-xs opacity-90">
                {estimate.completeness}% complete
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}