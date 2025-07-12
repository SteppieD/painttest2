"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, FileText, DollarSign, Clock, Award, Target, 
  Zap, BarChart3, Trophy, Star, Activity, Users, 
  Calendar, ArrowUp, ArrowDown, Plus, Eye, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface DashboardStats {
  totalQuotes: number
  totalValue: number
  averageQuoteValue: number
  quotesThisMonth: number
  quotesThisWeek: number
  conversionRate: number
  timeToQuote: number
  customerCount: number
}

interface Quote {
  id: string
  customerName: string
  customerAddress: string
  total: number
  createdAt: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'
  projectType: string
  area: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ElementType
  progress: number
  target: number
  unlocked: boolean
  points: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotes: 0,
    totalValue: 0,
    averageQuoteValue: 0,
    quotesThisMonth: 0,
    quotesThisWeek: 0,
    conversionRate: 0,
    timeToQuote: 0,
    customerCount: 0
  })
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userLevel, setUserLevel] = useState(1)
  const [userPoints, setUserPoints] = useState(0)
  const [quotaInfo, setQuotaInfo] = useState<{ used: number; limit: number } | null>(null)

  useEffect(() => {
    // Check authentication
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) {
      router.push('/trial-signup')
      return
    }

    try {
      const session = JSON.parse(authData)
      setQuotaInfo({
        used: session.quotesUsed || 0,
        limit: session.quotesLimit || 1
      })
      
      // Load dashboard data
      loadDashboardData(session)
    } catch (error) {
      console.error('Failed to parse auth data:', error)
      router.push('/trial-signup')
    }
  }, [router])

  const loadDashboardData = (session: any) => {
    // Load quotes from localStorage
    const savedQuotes = JSON.parse(localStorage.getItem(`quotes_${session.companyId}`) || '[]')
    
    // Calculate stats
    const now = new Date()
    const thisMonth = savedQuotes.filter((q: Quote) => {
      const quoteDate = new Date(q.createdAt)
      return quoteDate.getMonth() === now.getMonth() && 
             quoteDate.getFullYear() === now.getFullYear()
    })
    
    const thisWeek = savedQuotes.filter((q: Quote) => {
      const quoteDate = new Date(q.createdAt)
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return quoteDate >= weekAgo
    })

    const totalValue = savedQuotes.reduce((sum: number, q: Quote) => sum + q.total, 0)
    const acceptedQuotes = savedQuotes.filter((q: Quote) => q.status === 'accepted').length
    
    setStats({
      totalQuotes: savedQuotes.length,
      totalValue,
      averageQuoteValue: savedQuotes.length > 0 ? totalValue / savedQuotes.length : 0,
      quotesThisMonth: thisMonth.length,
      quotesThisWeek: thisWeek.length,
      conversionRate: savedQuotes.length > 0 ? (acceptedQuotes / savedQuotes.length) * 100 : 0,
      timeToQuote: 4.5, // Mock average time in minutes
      customerCount: new Set(savedQuotes.map((q: Quote) => q.customerName)).size
    })

    setRecentQuotes(savedQuotes.slice(-5).reverse())
    
    // Calculate achievements
    const achievements: Achievement[] = [
      {
        id: 'first-quote',
        title: 'First Quote',
        description: 'Create your first quote',
        icon: FileText,
        progress: savedQuotes.length,
        target: 1,
        unlocked: savedQuotes.length >= 1,
        points: 100
      },
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Create 5 quotes in one day',
        icon: Zap,
        progress: thisWeek.length,
        target: 5,
        unlocked: thisWeek.length >= 5,
        points: 250
      },
      {
        id: 'high-roller',
        title: 'High Roller',
        description: 'Create a quote over $10,000',
        icon: DollarSign,
        progress: savedQuotes.filter((q: Quote) => q.total > 10000).length,
        target: 1,
        unlocked: savedQuotes.some((q: Quote) => q.total > 10000),
        points: 500
      },
      {
        id: 'consistent',
        title: 'Consistency King',
        description: 'Create quotes 7 days in a row',
        icon: Calendar,
        progress: 3, // Mock progress
        target: 7,
        unlocked: false,
        points: 300
      },
      {
        id: 'converter',
        title: 'Conversion Master',
        description: 'Achieve 50% acceptance rate',
        icon: Trophy,
        progress: Math.round(stats.conversionRate),
        target: 50,
        unlocked: stats.conversionRate >= 50,
        points: 1000
      }
    ]
    
    setAchievements(achievements)
    
    // Calculate user level and points
    const totalPoints = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0)
    setUserPoints(totalPoints)
    setUserLevel(Math.floor(totalPoints / 500) + 1)
    
    setIsLoading(false)
  }

  const saveNewQuote = (quoteData: Quote) => {
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) return

    const session = JSON.parse(authData)
    const savedQuotes = JSON.parse(localStorage.getItem(`quotes_${session.companyId}`) || '[]')
    savedQuotes.push(quoteData)
    localStorage.setItem(`quotes_${session.companyId}`, JSON.stringify(savedQuotes))
    
    // Update quota
    session.quotesUsed = (session.quotesUsed || 0) + 1
    sessionStorage.setItem('paintQuoteAuth', JSON.stringify(session))
    
    // Reload dashboard
    loadDashboardData(session)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const progressToNextLevel = ((userPoints % 500) / 500) * 100

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header with Gamification */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">
                  Welcome back! 🎨
                </h1>
                <p className="text-gray-600 mt-2">
                  Track your quotes, monitor performance, and level up your business
                </p>
              </div>
              <Link href="/get-quote">
                <Button className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Quote
                </Button>
              </Link>
            </div>

            {/* User Level & Progress */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Painting Pro</p>
                      <h2 className="text-2xl font-bold">Level {userLevel}</h2>
                      <p className="text-white/80 text-sm">{userPoints} points earned</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm">Next level in</p>
                    <p className="text-xl font-bold">{500 - (userPoints % 500)} points</p>
                  </div>
                </div>
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextLevel}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Quotes
                    </CardTitle>
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalQuotes}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <ArrowUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      {stats.quotesThisWeek} this week
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Total Value
                    </CardTitle>
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.totalValue)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Avg: {formatCurrency(stats.averageQuoteValue)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Conversion Rate
                    </CardTitle>
                    <Target className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.conversionRate.toFixed(1)}%
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Award className="w-3 h-3 text-purple-600" />
                    <span className="text-xs text-gray-600">
                      Industry avg: 25%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Avg Quote Time
                    </CardTitle>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.timeToQuote} min
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Zap className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs text-gray-600">
                      14x faster than manual
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Quotes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Quotes</CardTitle>
                    <Link href="/quotes">
                      <Button variant="ghost" size="sm">
                        View all →
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentQuotes.length > 0 ? (
                      recentQuotes.map((quote) => (
                        <div
                          key={quote.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-2 h-12 rounded-full",
                              quote.status === 'accepted' ? "bg-green-500" :
                              quote.status === 'sent' ? "bg-blue-500" :
                              quote.status === 'viewed' ? "bg-yellow-500" :
                              "bg-gray-300"
                            )} />
                            <div>
                              <p className="font-medium">{quote.customerName}</p>
                              <p className="text-sm text-gray-600">
                                {quote.projectType} • {quote.area} sq ft
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {formatCurrency(quote.total)}
                            </p>
                            <div className="flex gap-1 mt-1">
                              <Button size="sm" variant="ghost" className="h-7 px-2">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 px-2">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No quotes yet</p>
                        <Link href="/get-quote">
                          <Button variant="outline" size="sm" className="mt-3">
                            Create your first quote
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Chart */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quote Activity</CardTitle>
                  <CardDescription>Your quote creation over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[3, 5, 2, 8, 4, 6, 9].map((height, index) => (
                      <div key={index} className="flex-1">
                        <div 
                          className="bg-gradient-to-t from-primary-500 to-accent-500 rounded-t"
                          style={{ height: `${(height / 10) * 100}%` }}
                        />
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Unlock rewards as you grow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={cn(
                          "p-3 rounded-lg border transition-all",
                          achievement.unlocked
                            ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                            : "bg-gray-50 border-gray-200 opacity-60"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            achievement.unlocked
                              ? "bg-gradient-to-br from-green-500 to-blue-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          )}>
                            <achievement.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{achievement.title}</h4>
                              {achievement.unlocked && (
                                <span className="text-xs text-green-600 font-medium">
                                  +{achievement.points} pts
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {achievement.description}
                            </p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.target}</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    achievement.unlocked
                                      ? "bg-gradient-to-r from-green-500 to-blue-500"
                                      : "bg-gray-400"
                                  )}
                                  style={{
                                    width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quotes Created</span>
                      <span className="font-medium">{stats.quotesThisMonth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Unique Customers</span>
                      <span className="font-medium">{stats.customerCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time Saved</span>
                      <span className="font-medium">{(stats.totalQuotes * 3).toFixed(0)} hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quote Limit</span>
                      <span className={cn(
                        "font-medium",
                        quotaInfo && quotaInfo.used >= quotaInfo.limit ? "text-red-600" : "text-green-600"
                      )}>
                        {quotaInfo?.used}/{quotaInfo?.limit === -1 ? '∞' : quotaInfo?.limit}
                      </span>
                    </div>
                  </div>
                  
                  {quotaInfo && quotaInfo.limit !== -1 && quotaInfo.used >= quotaInfo.limit && (
                    <div className="mt-4 pt-4 border-t">
                      <Link href="/pricing">
                        <Button className="w-full" variant="kofi">
                          Upgrade for Unlimited Quotes
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}