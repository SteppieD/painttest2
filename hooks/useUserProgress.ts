import { useState, useEffect, useCallback } from 'react'

interface UserProgress {
  onboardingCompleted: boolean
  onboardingSteps: {
    quickWin: boolean
    personalize: boolean
    firstReal: boolean
  }
  quotesCreated: number
  quotesAccepted: number
  totalRevenue: number
  timeSaved: number
  lastQuoteDate: string | null
  featureUsage: {
    calculator: number
    templates: number
    customBranding: number
    analytics: number
  }
  milestones: {
    firstQuote: boolean
    firstAcceptedQuote: boolean
    tenQuotes: boolean
    hundredKRevenue: boolean
    fiftyHoursSaved: boolean
  }
}

const DEFAULT_PROGRESS: UserProgress = {
  onboardingCompleted: false,
  onboardingSteps: {
    quickWin: false,
    personalize: false,
    firstReal: false
  },
  quotesCreated: 0,
  quotesAccepted: 0,
  totalRevenue: 0,
  timeSaved: 0,
  lastQuoteDate: null,
  featureUsage: {
    calculator: 0,
    templates: 0,
    customBranding: 0,
    analytics: 0
  },
  milestones: {
    firstQuote: false,
    firstAcceptedQuote: false,
    tenQuotes: false,
    hundredKRevenue: false,
    fiftyHoursSaved: false
  }
}

export function useUserProgress(userId: string) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS)
  const [isLoading, setIsLoading] = useState(true)

  // Load progress from localStorage
  useEffect(() => {
    if (!userId) return

    const storageKey = `paintQuoteProgress_${userId}`
    const savedProgress = localStorage.getItem(storageKey)
    
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress))
      } catch (error) {
        console.error('Failed to parse user progress:', error)
        setProgress(DEFAULT_PROGRESS)
      }
    }
    
    setIsLoading(false)
  }, [userId])

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: UserProgress) => {
    if (!userId) return
    
    const storageKey = `paintQuoteProgress_${userId}`
    localStorage.setItem(storageKey, JSON.stringify(newProgress))
    setProgress(newProgress)
  }, [userId])

  // Update onboarding step
  const completeOnboardingStep = useCallback((step: keyof UserProgress['onboardingSteps']) => {
    const newProgress = {
      ...progress,
      onboardingSteps: {
        ...progress.onboardingSteps,
        [step]: true
      }
    }
    
    // Check if all steps are completed
    const allStepsCompleted = Object.values(newProgress.onboardingSteps).every(v => v)
    if (allStepsCompleted) {
      newProgress.onboardingCompleted = true
    }
    
    saveProgress(newProgress)
  }, [progress, saveProgress])

  // Track quote creation
  const trackQuoteCreated = useCallback((quoteValue: number = 0) => {
    const newProgress = {
      ...progress,
      quotesCreated: progress.quotesCreated + 1,
      timeSaved: progress.timeSaved + 2.5, // 2.5 hours saved per quote
      lastQuoteDate: new Date().toISOString()
    }
    
    // Check milestones
    if (!progress.milestones.firstQuote && newProgress.quotesCreated >= 1) {
      newProgress.milestones = {
        ...newProgress.milestones,
        firstQuote: true
      }
    }
    
    if (!progress.milestones.tenQuotes && newProgress.quotesCreated >= 10) {
      newProgress.milestones = {
        ...newProgress.milestones,
        tenQuotes: true
      }
    }
    
    if (!progress.milestones.fiftyHoursSaved && newProgress.timeSaved >= 50) {
      newProgress.milestones = {
        ...newProgress.milestones,
        fiftyHoursSaved: true
      }
    }
    
    saveProgress(newProgress)
    return newProgress
  }, [progress, saveProgress])

  // Track quote acceptance
  const trackQuoteAccepted = useCallback((quoteValue: number) => {
    const newProgress = {
      ...progress,
      quotesAccepted: progress.quotesAccepted + 1,
      totalRevenue: progress.totalRevenue + quoteValue
    }
    
    // Check milestones
    if (!progress.milestones.firstAcceptedQuote && newProgress.quotesAccepted >= 1) {
      newProgress.milestones = {
        ...newProgress.milestones,
        firstAcceptedQuote: true
      }
    }
    
    if (!progress.milestones.hundredKRevenue && newProgress.totalRevenue >= 100000) {
      newProgress.milestones = {
        ...newProgress.milestones,
        hundredKRevenue: true
      }
    }
    
    saveProgress(newProgress)
    return newProgress
  }, [progress, saveProgress])

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: keyof UserProgress['featureUsage']) => {
    const newProgress = {
      ...progress,
      featureUsage: {
        ...progress.featureUsage,
        [feature]: progress.featureUsage[feature] + 1
      }
    }
    
    saveProgress(newProgress)
  }, [progress, saveProgress])

  // Get upgrade prompt recommendations
  const getUpgradePromptRecommendation = useCallback(() => {
    // Time-based triggers
    const daysSinceLastQuote = progress.lastQuoteDate 
      ? Math.floor((Date.now() - new Date(progress.lastQuoteDate).getTime()) / (1000 * 60 * 60 * 24))
      : null

    if (daysSinceLastQuote && daysSinceLastQuote > 7) {
      return {
        type: 'engagement',
        message: 'It\'s been a while! Create a quote to keep your pipeline full.'
      }
    }

    // Milestone-based triggers
    if (progress.quotesCreated === 9) {
      return {
        type: 'milestone',
        message: 'One more quote to reach 10! You\'re on a roll.'
      }
    }

    if (progress.timeSaved >= 45 && progress.timeSaved < 50) {
      return {
        type: 'milestone',
        message: 'Almost at 50 hours saved! That\'s over a week of work.'
      }
    }

    // Success-based triggers
    const winRate = progress.quotesCreated > 0 
      ? (progress.quotesAccepted / progress.quotesCreated) * 100 
      : 0

    if (winRate > 40 && progress.quotesAccepted >= 3) {
      return {
        type: 'success',
        message: `Your ${winRate.toFixed(0)}% win rate is impressive! Pro features can help you win even more.`
      }
    }

    return null
  }, [progress])

  // Calculate user score (gamification)
  const calculateUserScore = useCallback(() => {
    let score = 0
    
    // Points for quotes
    score += progress.quotesCreated * 10
    score += progress.quotesAccepted * 50
    
    // Points for revenue
    score += Math.floor(progress.totalRevenue / 1000) * 5
    
    // Points for feature usage
    score += Object.values(progress.featureUsage).reduce((sum, usage) => sum + usage * 2, 0)
    
    // Bonus points for milestones
    score += Object.values(progress.milestones).filter(v => v).length * 100
    
    return score
  }, [progress])

  return {
    progress,
    isLoading,
    completeOnboardingStep,
    trackQuoteCreated,
    trackQuoteAccepted,
    trackFeatureUsage,
    getUpgradePromptRecommendation,
    userScore: calculateUserScore(),
    stats: {
      winRate: progress.quotesCreated > 0 
        ? ((progress.quotesAccepted / progress.quotesCreated) * 100).toFixed(1)
        : '0',
      avgQuoteValue: progress.quotesAccepted > 0
        ? (progress.totalRevenue / progress.quotesAccepted).toFixed(0)
        : '0',
      hoursSaved: progress.timeSaved.toFixed(1),
      dollarsSaved: (progress.timeSaved * 50).toFixed(0) // Assuming $50/hour
    }
  }
}