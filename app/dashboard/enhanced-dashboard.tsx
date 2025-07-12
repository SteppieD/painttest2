"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ValueOnboarding } from '@/components/ui/value-onboarding'
import { UpgradePrompt, UsageStatsBar, ValueReminder } from '@/components/ui/upgrade-prompts'
import { Plus, FileText, TrendingUp, Users, Clock, Star, ChevronRight, BarChart3, Sparkles } from 'lucide-react'

interface UserSession {
  accessCode: string
  accountType: string
  accountName: string
  quotesLimit: number
  quotesUsed: number
  loginTime: string
  onboardingCompleted?: boolean
  trialStartDate?: string
}

interface UserStats {
  timeSaved: number
  quotesCreated: number
  revenueGenerated: number
  wonJobs: number
}

export default function EnhancedDashboard() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<{
    type: 'quota-limit' | 'feature-lock' | 'success-moment' | 'time-saved' | 'trial-ending'
    data?: any
  } | null>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    timeSaved: 0,
    quotesCreated: 0,
    revenueGenerated: 0,
    wonJobs: 0
  })
  const router = useRouter()

  useEffect(() => {
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) {
      router.push('/access-code')
      return
    }

    try {
      const parsedSession = JSON.parse(authData)
      setSession(parsedSession)
      
      // Check if user needs onboarding
      if (!parsedSession.onboardingCompleted && parsedSession.accountType === 'trial') {
        setShowOnboarding(true)
      }
      
      // Load user stats from localStorage (mock data for now)
      const savedStats = localStorage.getItem('paintQuoteStats')
      if (savedStats) {
        setUserStats(JSON.parse(savedStats))
      } else {
        // Initialize with mock data
        const mockStats = {
          timeSaved: parsedSession.quotesUsed * 2.5,
          quotesCreated: parsedSession.quotesUsed,
          revenueGenerated: parsedSession.quotesUsed * 2.8,
          wonJobs: Math.floor(parsedSession.quotesUsed * 0.47)
        }
        setUserStats(mockStats)
        localStorage.setItem('paintQuoteStats', JSON.stringify(mockStats))
      }
      
      // Check for upgrade prompt triggers
      checkUpgradePromptTriggers(parsedSession)
    } catch (error) {
      router.push('/access-code')
      return
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const checkUpgradePromptTriggers = (userSession: UserSession) => {
    // Check quota limit
    if (userSession.quotesLimit !== -1) {
      const usagePercentage = (userSession.quotesUsed / userSession.quotesLimit) * 100
      
      if (usagePercentage >= 80) {
        setTimeout(() => {
          setShowUpgradePrompt({
            type: 'quota-limit',
            data: { used: userSession.quotesUsed, limit: userSession.quotesLimit }
          })
        }, 2000)
        return
      }
    }
    
    // Check trial ending
    if (userSession.accountType === 'trial' && userSession.trialStartDate) {
      const trialStart = new Date(userSession.trialStartDate)
      const now = new Date()
      const daysElapsed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
      const daysLeft = 14 - daysElapsed // Assuming 14-day trial
      
      if (daysLeft <= 3 && daysLeft > 0) {
        setTimeout(() => {
          setShowUpgradePrompt({
            type: 'trial-ending',
            data: { daysLeft }
          })
        }, 5000)
        return
      }
    }
    
    // Check time saved milestone
    if (userSession.quotesUsed > 5 && userSession.quotesUsed % 5 === 0) {
      setTimeout(() => {
        setShowUpgradePrompt({
          type: 'time-saved',
          data: { hours: userSession.quotesUsed * 2.5 }
        })
      }, 3000)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('paintQuoteAuth')
    router.push('/')
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    if (session) {
      const updatedSession = { ...session, onboardingCompleted: true }
      sessionStorage.setItem('paintQuoteAuth', JSON.stringify(updatedSession))
      setSession(updatedSession)
    }
  }

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  const handleDismissUpgrade = () => {
    setShowUpgradePrompt(null)
  }

  const getQuotesRemaining = () => {
    if (!session) return 0
    if (session.quotesLimit === -1) return 'Unlimited'
    return Math.max(0, session.quotesLimit - session.quotesUsed)
  }

  const getUsagePercentage = () => {
    if (!session || session.quotesLimit === -1) return 0
    return Math.min(100, (session.quotesUsed / session.quotesLimit) * 100)
  }

  const getDaysLeftInTrial = () => {
    if (!session || session.accountType !== 'trial' || !session.trialStartDate) return null
    
    const trialStart = new Date(session.trialStartDate || session.loginTime)
    const now = new Date()
    const daysElapsed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, 14 - daysElapsed)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  const daysLeft = getDaysLeftInTrial()

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome back!
              </h1>
              <p className="text-xl text-gray-600">
                {session.accountName} • {session.accessCode}
              </p>
            </div>
            
            <div className="flex gap-4 mt-4 lg:mt-0">
              <Button asChild variant="kofi" size="lg">
                <Link href="/get-quote">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Quote
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Usage Stats Bar (for trial/limited accounts) */}
          {session.quotesLimit !== -1 && (
            <div className="mb-6">
              <UsageStatsBar
                quotesUsed={session.quotesUsed}
                quotesLimit={session.quotesLimit}
                daysLeftInTrial={daysLeft || undefined}
              />
            </div>
          )}

          {/* Value Reminder (show after 3+ quotes) */}
          {session.quotesUsed >= 3 && (
            <div className="mb-6">
              <ValueReminder
                timeSaved={userStats.timeSaved}
                quotesCreated={userStats.quotesCreated}
                revenueGenerated={userStats.revenueGenerated}
              />
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Quotes Remaining */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quotes Remaining</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getQuotesRemaining()}</div>
                <p className="text-xs text-muted-foreground">
                  {session.quotesUsed} of {session.quotesLimit === -1 ? '∞' : session.quotesLimit} used
                </p>
                {session.quotesLimit !== -1 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getUsagePercentage()}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Type */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Type</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{session.accountType}</div>
                <p className="text-xs text-muted-foreground">
                  Active since {new Date(session.loginTime).toLocaleDateString()}
                </p>
                {daysLeft !== null && (
                  <p className="text-xs text-orange-600 font-medium mt-1">
                    Trial ends in {daysLeft} days
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Time Saved */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.timeSaved.toFixed(1)}hrs</div>
                <p className="text-xs text-muted-foreground">
                  ~2.5 hours per quote
                </p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  Worth ${(userStats.timeSaved * 50).toFixed(0)} at $50/hour
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with these common tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full justify-between h-14">
                  <Link href="/get-quote">
                    <div className="flex items-center">
                      <Plus className="w-5 h-5 mr-3" />
                      Create New Quote
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-between h-14">
                  <Link href="/calculator">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      Use Calculator
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="w-full justify-between h-14">
                  <Link href="/painting-quote-templates-free">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3" />
                      Browse Templates
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.accountType === 'trial' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Trial Account
                    </h3>
                    <p className="text-yellow-700 text-sm mb-3">
                      You have {getQuotesRemaining()} quotes remaining in your trial.
                      {daysLeft !== null && ` ${daysLeft} days left.`}
                    </p>
                    <Button asChild variant="kofi" size="sm">
                      <Link href="/pricing">Upgrade Now</Link>
                    </Button>
                  </div>
                )}
                
                {session.accountType !== 'trial' && session.quotesLimit !== -1 && getUsagePercentage() > 80 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Quota Almost Reached</h3>
                    <p className="text-red-700 text-sm mb-3">
                      You've used {session.quotesUsed} of {session.quotesLimit} quotes this month.
                    </p>
                    <Button asChild variant="kofi" size="sm">
                      <Link href="/pricing">Upgrade Plan</Link>
                    </Button>
                  </div>
                )}

                {session.quotesLimit === -1 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Professional Account</h3>
                    <p className="text-green-700 text-sm mb-3">
                      You have unlimited quotes and all premium features.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/subscription/manage">Manage Billing</Link>
                    </Button>
                  </div>
                )}

                {/* Performance Insights */}
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Performance Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-600">
                          {userStats.wonJobs}
                        </div>
                        <div className="text-xs text-gray-600">Jobs Won</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">
                          47%
                        </div>
                        <div className="text-xs text-gray-600">Win Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest quotes and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotes yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first quote to see your activity here
                </p>
                <Button asChild variant="kofi">
                  <Link href="/get-quote">Create Your First Quote</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />

      {/* Onboarding Modal */}
      {showOnboarding && (
        <ValueOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
        />
      )}

      {/* Upgrade Prompts */}
      {showUpgradePrompt && (
        <UpgradePrompt
          type={showUpgradePrompt.type}
          data={showUpgradePrompt.data}
          onUpgrade={handleUpgrade}
          onDismiss={handleDismissUpgrade}
        />
      )}
    </>
  )
}