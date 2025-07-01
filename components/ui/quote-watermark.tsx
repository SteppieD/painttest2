'use client'

import { cn } from '@/lib/utils'

interface QuoteWatermarkProps {
  className?: string
  variant?: 'subtle' | 'visible' | 'footer'
}

export function QuoteWatermark({ className, variant = 'footer' }: QuoteWatermarkProps) {
  if (variant === 'subtle') {
    return (
      <div className={cn(
        "absolute top-4 right-4 text-xs text-gray-400 opacity-60 pointer-events-none",
        "print:opacity-40 print:text-gray-300",
        className
      )}>
        ProPaintQuote.com
      </div>
    )
  }

  if (variant === 'visible') {
    return (
      <div className={cn(
        "absolute top-0 right-0 bg-blue-50 border border-blue-200 rounded-bl-lg px-3 py-1",
        "text-xs text-blue-700 font-medium pointer-events-none z-10",
        "print:bg-gray-50 print:border-gray-300 print:text-gray-600",
        className
      )}>
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <span className="font-semibold">ProPaintQuote</span>
        </div>
      </div>
    )
  }

  // Footer variant (default)
  return (
    <div className={cn(
      "mt-6 pt-4 border-t border-gray-200 text-center",
      "text-xs text-gray-500 space-y-1",
      className
    )}>
      <div className="flex items-center justify-center gap-1">
        <span>Created with</span>
        <span className="font-semibold text-blue-600">ProPaintQuote</span>
      </div>
      <div className="text-gray-400">
        Professional quotes for painting contractors • www.propaintquote.com
      </div>
    </div>
  )
}

// Hook to determine if watermark should be shown
export function useWatermarkVisibility(companyId: string, isFreeTier: boolean = true) {
  // For now, always show watermark for free tier
  // Later this can check subscription status
  return {
    shouldShowWatermark: isFreeTier,
    watermarkVariant: isFreeTier ? 'footer' as const : null
  }
}