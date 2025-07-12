import { NextRequest, NextResponse } from 'next/server'

// Mock database for onboarding status
const onboardingDB = new Map<string, any>()

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

    const status = onboardingDB.get(userId) || {
      userId,
      completed: false,
      steps: {
        quickWin: false,
        personalize: false,
        firstReal: false
      },
      startedAt: null,
      completedAt: null
    }

    return NextResponse.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error fetching onboarding status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch onboarding status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, step, completed } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    let status = onboardingDB.get(userId) || {
      userId,
      completed: false,
      steps: {
        quickWin: false,
        personalize: false,
        firstReal: false
      },
      startedAt: new Date().toISOString(),
      completedAt: null
    }

    // Update step if provided
    if (step && status.steps.hasOwnProperty(step)) {
      status.steps[step] = true
      
      // Check if all steps are completed
      const allCompleted = Object.values(status.steps).every(v => v === true)
      if (allCompleted) {
        status.completed = true
        status.completedAt = new Date().toISOString()
      }
    }

    // Update completed status if provided
    if (typeof completed === 'boolean') {
      status.completed = completed
      if (completed && !status.completedAt) {
        status.completedAt = new Date().toISOString()
      }
    }

    onboardingDB.set(userId, status)

    return NextResponse.json({
      success: true,
      data: status
    })
  } catch (error) {
    console.error('Error updating onboarding status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update onboarding status' },
      { status: 500 }
    )
  }
}

// Reset onboarding for testing
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

    onboardingDB.delete(userId)

    return NextResponse.json({
      success: true,
      message: 'Onboarding status reset successfully'
    })
  } catch (error) {
    console.error('Error resetting onboarding:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset onboarding status' },
      { status: 500 }
    )
  }
}