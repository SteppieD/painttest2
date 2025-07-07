import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbAll } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    // Get customer details
    const customer: any = dbGet(`
      SELECT 
        c.id,
        c.access_code,
        c.company_name,
        c.phone,
        c.email,
        c.created_at,
        COUNT(DISTINCT q.id) as quote_count,
        COALESCE(SUM(CASE WHEN q.final_price IS NOT NULL THEN q.final_price ELSE 0 END), 0) as total_revenue,
        MAX(q.created_at) as last_quote_date,
        SUM(CASE WHEN q.status = 'pending' OR q.status = 'sent' THEN 1 ELSE 0 END) as pending_quotes,
        SUM(CASE WHEN q.status = 'accepted' THEN 1 ELSE 0 END) as accepted_quotes,
        CASE 
          WHEN COUNT(q.id) > 0 THEN COALESCE(SUM(q.final_price), 0) / COUNT(q.id)
          ELSE 0
        END as average_quote_value,
        CASE 
          WHEN COUNT(q.id) > 0 THEN ROUND(CAST(SUM(CASE WHEN q.status = 'accepted' THEN 1 ELSE 0 END) AS FLOAT) / COUNT(q.id) * 100)
          ELSE 0
        END as conversion_rate
      FROM companies c
      LEFT JOIN projects p ON p.user_id = c.access_code
      LEFT JOIN quotes q ON q.project_id = p.id
      WHERE c.id = ?
      GROUP BY c.id
    `, [customerId]);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Get recent quotes for this customer
    const quotes = dbAll(`
      SELECT 
        q.id,
        p.client_name as project_name,
        q.final_price,
        q.status,
        q.created_at,
        COUNT(DISTINCT rd.id) as room_count
      FROM quotes q
      JOIN projects p ON q.project_id = p.id
      LEFT JOIN room_details rd ON rd.project_id = p.id
      WHERE p.user_id = ?
      GROUP BY q.id
      ORDER BY q.created_at DESC
      LIMIT 20
    `, [customer.access_code]);

    // Get monthly revenue for the last 6 months
    const monthlyRevenue = await dbAll(`
      SELECT 
        strftime('%Y-%m', q.created_at) as month,
        SUM(q.final_price) as revenue,
        COUNT(q.id) as quote_count
      FROM quotes q
      JOIN projects p ON q.project_id = p.id
      WHERE p.user_id = ?
        AND q.created_at >= datetime('now', '-6 months')
        AND q.final_price IS NOT NULL
      GROUP BY strftime('%Y-%m', q.created_at)
      ORDER BY month DESC
    `, [customer.access_code]);

    // Format monthly revenue with month names
    const formattedMonthlyRevenue = (monthlyRevenue || []).map((item: any) => {
      const [year, month] = item.month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        month: monthNames[parseInt(month) - 1],
        revenue: item.revenue || 0,
        quote_count: item.quote_count || 0
      };
    }).reverse(); // Reverse to show oldest to newest

    // Ensure we have 6 months of data
    const currentMonth = new Date().getMonth();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const completeMonthlyRevenue = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = monthNames[monthIndex];
      const existingData = formattedMonthlyRevenue.find((m: any) => m.month === monthName);
      
      completeMonthlyRevenue.push(existingData || {
        month: monthName,
        revenue: 0,
        quote_count: 0
      });
    }

    return NextResponse.json({
      customer,
      quotes,
      monthly_revenue: completeMonthlyRevenue
    });

  } catch (error) {
    console.error("Error fetching customer details:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer details" },
      { status: 500 }
    );
  }
}