"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, TrendingUp, Users, Clock, Star, ChevronRight } from 'lucide-react'

interface UserSession {
  accessCode: string
  accountType: string
  accountName: string
  quotesLimit: number
  quotesUsed: number
  loginTime: string
}

export default function DashboardPage() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
    } catch (error) {
      router.push('/access-code')
      return
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('paintQuoteAuth')
    router.push('/')
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

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome back! 👋
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
              </CardContent>
            </Card>

            {/* Time Saved */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{session.quotesUsed * 2.5}hrs</div>
                <p className="text-xs text-muted-foreground">
                  ~2.5 hours per quote
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
                    <h3 className="font-semibold text-yellow-800 mb-2">Trial Account</h3>
                    <p className="text-yellow-700 text-sm mb-3">
                      You have {getQuotesRemaining()} quotes remaining in your trial.
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
    </>
  )
}