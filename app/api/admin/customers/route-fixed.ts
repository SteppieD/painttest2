export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { withSecureApi } from "@/lib/secure-api-wrapper";
import { supabaseDb } from "@/lib/database/supabase-adapter";

/**
 * Fixed Admin Customers API
 * 
 * FIXES THE CRITICAL BUG: Previous version confused companies (contractors) with customers
 * 
 * CORRECT MODEL:
 * - Companies = Painting contractors who use our software
 * - Customers = People who hire painting contractors for work
 * - Quotes = Work estimates for customers, created by companies
 */

async function getAllCustomers(request: NextRequest) {
  try {
    // Get customers with their company information and quote statistics
    // This uses the customer_dashboard view created in the migration
    const customers = await supabaseDb.query(`
      SELECT 
        cd.*,
        c.company_name,
        c.access_code as company_access_code
      FROM customer_dashboard cd
      JOIN companies c ON cd.company_id = c.id
      ORDER BY cd.last_quote_date DESC, cd.created_at DESC
      LIMIT 100
    `);

    // Transform data for admin display
    const formattedCustomers = customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
      
      // Company information (which contractor this customer belongs to)
      company_name: customer.company_name,
      company_access_code: customer.company_access_code,
      company_id: customer.company_id,
      
      // Customer metrics
      quote_count: customer.quote_count || 0,
      total_revenue: customer.approved_revenue || 0,
      pending_revenue: customer.pending_revenue || 0,
      conversion_rate: customer.conversion_rate || 0,
      
      // Activity timestamps
      first_quote_date: customer.first_quote_date,
      last_quote_date: customer.last_quote_date,
      last_contact_date: customer.last_contact_date,
      created_at: customer.created_at
    }));

    return NextResponse.json({
      success: true,
      data: formattedCustomers,
      total: formattedCustomers.length
    });

  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function createCustomer(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_id, name, email, phone, address, notes } = body;

    // Validate required fields
    if (!company_id || !name) {
      return NextResponse.json(
        { 
          success: false,
          error: "Missing required fields: company_id and name" 
        },
        { status: 400 }
      );
    }

    // Verify company exists
    const company = await supabaseDb.getCompanyById(company_id);
    if (!company) {
      return NextResponse.json(
        { 
          success: false,
          error: `Company with ID ${company_id} not found` 
        },
        { status: 404 }
      );
    }

    // Check for duplicate customer (same email or phone for this company)
    if (email) {
      const existingByEmail = await supabaseDb.query(
        'SELECT id, name FROM customers WHERE company_id = ? AND email = ?',
        [company_id, email]
      );
      if (existingByEmail.length > 0) {
        return NextResponse.json(
          { 
            success: false,
            error: `Customer with email ${email} already exists for ${company.company_name}` 
          },
          { status: 409 }
        );
      }
    }

    // Create new customer
    const customerId = await supabaseDb.run(
      `INSERT INTO customers (
        company_id, name, email, phone, address, notes, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'prospect', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [company_id, name, email || null, phone || null, address || null, notes || null]
    );

    // Fetch the created customer with company info
    const newCustomer = await supabaseDb.query(`
      SELECT 
        c.*,
        comp.company_name,
        comp.access_code as company_access_code
      FROM customers c
      JOIN companies comp ON c.company_id = comp.id
      WHERE c.id = ?
    `, [customerId]);

    return NextResponse.json({
      success: true,
      data: newCustomer[0],
      message: `Customer ${name} created successfully for ${company.company_name}`
    });

  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create customer",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getCustomerStatistics(request: NextRequest) {
  try {
    // Get overall customer statistics across all companies
    const stats = await supabaseDb.query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT CASE WHEN c.status = 'prospect' THEN c.id END) as prospects,
        COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_customers,
        COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_customers,
        COUNT(DISTINCT c.company_id) as total_companies,
        COUNT(DISTINCT q.id) as total_quotes,
        COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN q.status = 'approved' THEN q.final_price END), 0) as average_quote_value
      FROM customers c
      LEFT JOIN quotes q ON c.id = q.customer_id
    `);

    // Get customer growth by month
    const monthlyGrowth = await supabaseDb.query(`
      SELECT 
        strftime('%Y-%m', c.created_at) as month,
        COUNT(*) as new_customers,
        COUNT(DISTINCT c.company_id) as active_companies
      FROM customers c
      WHERE c.created_at >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', c.created_at)
      ORDER BY month DESC
      LIMIT 12
    `);

    // Get top companies by customer count
    const topCompanies = await supabaseDb.query(`
      SELECT 
        comp.company_name,
        comp.access_code,
        COUNT(c.id) as customer_count,
        COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue
      FROM companies comp
      LEFT JOIN customers c ON comp.id = c.company_id
      LEFT JOIN quotes q ON c.id = q.customer_id
      GROUP BY comp.id
      ORDER BY customer_count DESC, total_revenue DESC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        overview: stats[0],
        monthly_growth: monthlyGrowth,
        top_companies: topCompanies
      }
    });

  } catch (error) {
    console.error("Error fetching customer statistics:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch customer statistics",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Export handlers with proper security
export const GET = withSecureApi({
  requireAuth: true,
  allowedMethods: ['GET']
})(async (request: NextRequest) => {
  const url = request.nextUrl;
  const action = url.searchParams.get('action');

  switch (action) {
    case 'statistics':
      return getCustomerStatistics(request);
    default:
      return getAllCustomers(request);
  }
});

export const POST = withSecureApi({
  requireAuth: true,
  allowedMethods: ['POST'],
  sanitizeInput: true
})(createCustomer);