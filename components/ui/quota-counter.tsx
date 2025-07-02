'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Crown, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuotaCounterProps {
  companyId: string
  variant?: 'header' | 'badge' | 'full'
  showUpgrade?: boolean
  className?: string
}

interface QuotaData {
  is_trial: boolean
  quote_limit: number
  quotes_used: number
  quotes_remaining: number
  company_name: string
}

export function QuotaCounter({ 
  companyId, 
  variant = 'header', 
  showUpgrade = true,
  className 
}: QuotaCounterProps) {
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await fetch(`/api/company-quota?company_id=${companyId}`)
        if (response.ok) {
          const data = await response.json()
          setQuotaData(data)
        }
      } catch (error) {
        console.error('Failed to fetch quota:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchQuota()
      // Refresh quota every 30 seconds
      const interval = setInterval(fetchQuota, 30000)
      return () => clearInterval(interval)
    }
  }, [companyId])

  if (isLoading || !quotaData) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
        <div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />
      </div>
    )
  }

  const usagePercentage = quotaData.quote_limit > 0 ? (quotaData.quotes_used / quotaData.quote_limit) * 100 : 0
  const isNearLimit = usagePercentage >= 80
  const isOverLimit = quotaData.quotes_used >= quotaData.quote_limit

  // Header variant - compact for headers
  if (variant === 'header') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {quotaData.quotes_used}/{quotaData.quote_limit}
          </span>
        </div>
        {quotaData.is_trial && (
          <Badge 
            variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
            className="text-xs"
          >
            {isOverLimit ? "Limit Reached" : `${quotaData.quotes_remaining} left`}
          </Badge>
        )}
        {showUpgrade && isOverLimit && (
          <Button 
            size="sm" 
            variant="default"
            className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open('mailto:sales@propaintquote.com?subject=Upgrade Request', '_blank')}
          >
            Upgrade
          </Button>
        )}
      </div>
    )
  }

  // Badge variant - minimal for tight spaces
  if (variant === 'badge') {
    return (
      <Badge 
        variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
        className={cn("flex items-center gap-1", className)}
      >
        <FileText className="w-3 h-3" />
        {quotaData.quotes_used}/{quotaData.quote_limit}
        {isOverLimit && <AlertTriangle className="w-3 h-3" />}
      </Badge>
    )
  }

  // Full variant - detailed display
  return (
    <div className={cn("flex items-center justify-between p-3 rounded-lg border", {
      "border-red-200 bg-red-50": isOverLimit,
      "border-yellow-200 bg-yellow-50": isNearLimit && !isOverLimit,
      "border-blue-200 bg-blue-50": !isNearLimit
    }, className)}>
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", {
          "bg-red-100": isOverLimit,
          "bg-yellow-100": isNearLimit && !isOverLimit,
          "bg-blue-100": !isNearLimit
        })}>
          <FileText className={cn("w-5 h-5", {
            "text-red-600": isOverLimit,
            "text-yellow-600": isNearLimit && !isOverLimit,
            "text-blue-600": !isNearLimit
          })} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {quotaData.quotes_used} of {quotaData.quote_limit} quotes used
            </span>
            {quotaData.is_trial && (
              <Badge variant="outline" className="text-xs">
                <Crown className="w-3 h-3 mr-1" />
                Trial
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {isOverLimit 
              ? "Quote limit reached. Upgrade to create more quotes."
              : `${quotaData.quotes_remaining} quotes remaining.`
            }
          </p>
        </div>
      </div>
      {showUpgrade && isOverLimit && (
        <Button 
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => window.open('mailto:sales@propaintquote.com?subject=Upgrade Request', '_blank')}
        >
          Upgrade Now
        </Button>
      )}
    </div>
  )
}

// Hook for quota data
export function useQuotaData(companyId: string) {
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await fetch(`/api/company-quota?company_id=${companyId}`)
        if (response.ok) {
          const data = await response.json()
          setQuotaData(data)
        }
      } catch (error) {
        console.error('Failed to fetch quota:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) {
      fetchQuota()
      const interval = setInterval(fetchQuota, 30000)
      return () => clearInterval(interval)
    }
  }, [companyId])

  return { quotaData, isLoading }
}