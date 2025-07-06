import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface FeedbackData {
  message: string;
  email?: string;
  name?: string;
  type: 'app' | 'website';
  page?: string;
  rating?: number;
  companyId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: FeedbackData = await request.json();
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const timestamp = new Date().toISOString();
    
    // Get company from session if available
    const companyData = request.cookies.get('paintquote_company')?.value;
    let companyInfo = null;
    
    if (companyData) {
      try {
        companyInfo = JSON.parse(companyData);
      } catch (e) {
        console.error('Error parsing company data:', e);
      }
    }

    // In production, you would save this to Supabase
    // For now, we'll log it and return success
    const feedbackEntry = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      companyId: companyInfo?.id || data.companyId,
      companyName: companyInfo?.name,
      timestamp,
      userAgent,
      status: 'new'
    };

    console.log('📝 New Feedback Received:', feedbackEntry);

    // TODO: Save to Supabase feedback table
    // const { data: savedFeedback, error } = await supabase
    //   .from('feedback')
    //   .insert([feedbackEntry])
    //   .select()
    //   .single();

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.',
      feedbackId: feedbackEntry.id
    });

  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit feedback. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin endpoint to retrieve feedback
    // TODO: Add authentication check
    
    // For now, return mock data
    const mockFeedback = [
      {
        id: '1',
        message: 'Great app! The quote generation is super fast.',
        email: 'john@example.com',
        name: 'John Doe',
        type: 'app',
        page: '/create-quote',
        rating: 5,
        timestamp: new Date().toISOString(),
        status: 'new'
      },
      {
        id: '2',
        message: 'Would love to see more paint brand options.',
        email: 'jane@painting.com',
        name: 'Jane Smith',
        type: 'website',
        page: '/',
        rating: 4,
        timestamp: new Date().toISOString(),
        status: 'read'
      }
    ];

    return NextResponse.json({
      success: true,
      feedback: mockFeedback,
      total: mockFeedback.length
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch feedback' 
      },
      { status: 500 }
    );
  }
}