import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';

// Initialize database
const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
const db = new Database(dbPath);

// DELETE - Remove test user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Test user ID is required' },
        { status: 400 }
      );
    }

    // Check if test user exists
    const testUser = db.prepare('SELECT * FROM test_users WHERE id = ?').get(id);
    if (!testUser) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    // Get the test user's access code to clean up related data
    const { access_code, company_name } = testUser as any;

    // Begin transaction
    const transaction = db.transaction(() => {
      // Delete related quotes (if any exist)
      db.prepare('DELETE FROM quotes WHERE user_id = ?').run(access_code);
      
      // Delete related company data (if any exists)
      db.prepare('DELETE FROM companies WHERE access_code = ?').run(access_code);
      
      // Delete the test user
      db.prepare('DELETE FROM test_users WHERE id = ?').run(id);
    });

    transaction();

    // Log admin activity
    const activityQuery = `
      INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
      VALUES (?, ?, ?, ?)
    `;

    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    db.prepare(activityQuery).run(
      authResult.user.id,
      'delete_test_user',
      JSON.stringify({
        test_user_id: id,
        company_name: company_name,
        access_code: access_code
      }),
      clientIP
    );

    return NextResponse.json({ 
      message: 'Test user deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting test user:', error);
    return NextResponse.json(
      { error: 'Failed to delete test user' },
      { status: 500 }
    );
  }
}

// PATCH - Update test user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Test user ID is required' },
        { status: 400 }
      );
    }

    // Check if test user exists
    const existingUser = db.prepare('SELECT * FROM test_users WHERE id = ?').get(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically based on provided fields
    const allowedFields = [
      'company_name', 'status', 'quotes_allowed', 'expires_at', 'description'
    ];
    
    const updates = [];
    const values = [];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Add ID to values array for WHERE clause
    values.push(id);

    const updateQuery = `UPDATE test_users SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(updateQuery).run(...values);

    // Log admin activity
    const activityQuery = `
      INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
      VALUES (?, ?, ?, ?)
    `;

    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    db.prepare(activityQuery).run(
      authResult.user.id,
      'update_test_user',
      JSON.stringify({
        test_user_id: id,
        updated_fields: Object.keys(body)
      }),
      clientIP
    );

    // Return updated test user
    const updatedUser = db.prepare('SELECT * FROM test_users WHERE id = ?').get(id);

    return NextResponse.json({ 
      testUser: updatedUser,
      message: 'Test user updated successfully'
    });

  } catch (error) {
    console.error('Error updating test user:', error);
    return NextResponse.json(
      { error: 'Failed to update test user' },
      { status: 500 }
    );
  }
}