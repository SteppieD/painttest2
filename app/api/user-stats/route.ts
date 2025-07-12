import { NextRequest, NextResponse } from 'next/server'

// Mock database for user statistics
const userStatsDB = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get or create user stats
    let stats = userStatsDB.get(userId)
    if (!stats) {
      stats = {
        userId,
        quotesCreated: 0,
        quotesAccepted: 0,
        totalRevenue: 0,
        timeSaved: 0,
        lastQuoteDate: null,
        wonJobs: 0,
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
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      userStatsDB.set(userId, stats)
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, data } = body

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'User ID and action are required' },
        { status: 400 }
      )
    }

    // Get or create user stats
    let stats = userStatsDB.get(userId) || {
      userId,
      quotesCreated: 0,
      quotesAccepted: 0,
      totalRevenue: 0,
      timeSaved: 0,
      lastQuoteDate: null,
      wonJobs: 0,
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
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Update stats based on action
    switch (action) {
      case 'quote_created':
        stats.quotesCreated += 1
        stats.timeSaved += 2.5 // 2.5 hours saved per quote
        stats.lastQuoteDate = new Date().toISOString()
        
        // Check milestones
        if (stats.quotesCreated === 1) {
          stats.milestones.firstQuote = true
        }
        if (stats.quotesCreated === 10) {
          stats.milestones.tenQuotes = true
        }
        if (stats.timeSaved >= 50) {
          stats.milestones.fiftyHoursSaved = true
        }
        break

      case 'quote_accepted':
        stats.quotesAccepted += 1
        stats.wonJobs += 1
        stats.totalRevenue += data?.quoteValue || 0
        
        // Check milestones
        if (stats.quotesAccepted === 1) {
          stats.milestones.firstAcceptedQuote = true
        }
        if (stats.totalRevenue >= 100000) {
          stats.milestones.hundredKRevenue = true
        }
        break

      case 'feature_used':
        if (data?.feature && stats.featureUsage[data.feature] !== undefined) {
          stats.featureUsage[data.feature] += 1
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    stats.updatedAt = new Date().toISOString()
    userStatsDB.set(userId, stats)

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error updating user stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update user statistics' },
      { status: 500 }
    )
  }
}

// Reset stats endpoint for testing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    userStatsDB.delete(userId)

    return NextResponse.json({
      success: true,
      message: 'User stats reset successfully'
    })
  } catch (error) {
    console.error('Error resetting user stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset user statistics' },
      { status: 500 }
    )
  }
}