'use client'

import { DollarSign, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  baseCost: number
  markupPercentage: number
  markupAmount: number
  finalPrice: number
  className?: string
}

export function PriceDisplay({
  baseCost,
  markupPercentage,
  markupAmount,
  finalPrice,
  className
}: PriceDisplayProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Base Cost</span>
          <span className="text-lg font-medium">${baseCost.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-blue-600">
          <span className="text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Markup ({markupPercentage}%)
          </span>
          <span className="text-lg font-medium">+${markupAmount.toLocaleString()}</span>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Final Price
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ${finalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Profit margin indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs text-gray-500">
          <div className={cn(
            "w-2 h-2 rounded-full",
            markupPercentage < 15 ? "bg-yellow-500" :
            markupPercentage < 25 ? "bg-blue-500" :
            "bg-green-500"
          )} />
          <span>
            {markupPercentage < 15 ? "Low margin" :
             markupPercentage < 25 ? "Standard margin" :
             "Healthy margin"}
          </span>
        </div>
      </div>
    </div>
  )
}