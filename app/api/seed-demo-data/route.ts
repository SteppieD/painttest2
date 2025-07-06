import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { demoQuotes, demoContractors } from '@/lib/demo-data';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const companyData = cookieStore.get('paintquote_company');
    
    if (!companyData) {
      return NextResponse.json({ error: 'No company session found' }, { status: 401 });
    }

    const company = JSON.parse(companyData.value);
    const companyId = company.id;

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      // Use mock response if Supabase is not configured
      return NextResponse.json({
        success: true,
        message: 'Demo data created (mock mode)',
        quotesCreated: demoQuotes.length,
        contractorProfilesCreated: demoContractors.length,
        demoContractors: demoContractors
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if demo data already exists
    const { data: existingQuotes } = await supabase
      .from('quotes')
      .select('id')
      .eq('company_id', companyId)
      .like('id', 'demo-%');

    if (existingQuotes && existingQuotes.length > 0) {
      return NextResponse.json({ 
        message: 'Demo data already exists',
        quotesCreated: existingQuotes.length 
      });
    }

    // Insert demo quotes
    const quotesToInsert = demoQuotes.map(quote => ({
      id: quote.id,
      company_id: companyId,
      customer_name: quote.customerName,
      customer_email: quote.customerEmail,
      customer_phone: quote.customerPhone,
      customer_address: quote.customerAddress,
      project_type: quote.projectType,
      room_count: quote.roomCount || 0,
      surfaces: quote.surfaces,
      paint_products: quote.paintProducts,
      total_square_feet: quote.totalSquareFeet,
      subtotal: quote.subtotal,
      tax_rate: quote.taxRate,
      tax: quote.tax,
      total: quote.total,
      status: quote.status,
      created_at: quote.createdAt.toISOString(),
      accepted_at: quote.acceptedAt?.toISOString() || null,
      completed_at: quote.completedAt?.toISOString() || null,
      notes: quote.notes,
      room_details: quote.roomDetails || null,
      project_details: quote.projectDetails || null
    }));

    const { data: insertedQuotes, error: quotesError } = await supabase
      .from('quotes')
      .insert(quotesToInsert);

    if (quotesError) {
      console.error('Error inserting demo quotes:', quotesError);
      return NextResponse.json({ 
        error: 'Failed to insert demo quotes', 
        details: quotesError.message 
      }, { status: 500 });
    }

    // Store demo contractor data in localStorage (client-side)
    // This will be used for displaying success stories

    return NextResponse.json({
      success: true,
      message: 'Demo data created successfully',
      quotesCreated: demoQuotes.length,
      contractorProfilesCreated: demoContractors.length,
      demoContractors: demoContractors // Send to client for localStorage
    });

  } catch (error) {
    console.error('Error in seed-demo-data:', error);
    return NextResponse.json({ 
      error: 'Failed to seed demo data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve demo contractor data
export async function GET() {
  return NextResponse.json({
    contractors: demoContractors,
    quotes: demoQuotes.map(q => ({
      customerName: q.customerName,
      total: q.total,
      status: q.status,
      projectType: q.projectType
    }))
  });
}