import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbRun } from '@/lib/database';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { 
      companyId, 
      preferences,
      askForConfirmation = true,
      source = 'ai_conversation'
    } = await request.json();

    if (!companyId || !preferences) {
      return NextResponse.json({ 
        error: 'Missing required fields: companyId and preferences' 
      }, { status: 400 });
    }

    // Get current settings to compare
    const currentSettings = dbGet(`
      SELECT * FROM companies WHERE id = ?
    `, [companyId]);

    if (!currentSettings) {
      return NextResponse.json({ 
        error: 'Company not found' 
      }, { status: 404 });
    }

    // Check if AI learning is enabled
    if (currentSettings.ai_learning_enabled === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'AI learning is disabled for this contractor',
        learningEnabled: false
      });
    }

    // Build update query dynamically based on provided preferences
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Product spread rates
    if (preferences.primer_spread_rate !== undefined) {
      updateFields.push('primer_spread_rate = ?');
      updateValues.push(preferences.primer_spread_rate);
    }
    if (preferences.wall_paint_spread_rate !== undefined) {
      updateFields.push('wall_paint_spread_rate = ?');
      updateValues.push(preferences.wall_paint_spread_rate);
    }
    if (preferences.ceiling_paint_spread_rate !== undefined) {
      updateFields.push('ceiling_paint_spread_rate = ?');
      updateValues.push(preferences.ceiling_paint_spread_rate);
    }
    if (preferences.trim_doors_per_gallon !== undefined) {
      updateFields.push('trim_doors_per_gallon = ?');
      updateValues.push(preferences.trim_doors_per_gallon);
    }
    if (preferences.trim_windows_per_gallon !== undefined) {
      updateFields.push('trim_windows_per_gallon = ?');
      updateValues.push(preferences.trim_windows_per_gallon);
    }

    // All-in labor rates
    if (preferences.wall_allin_rate_per_sqft !== undefined) {
      updateFields.push('wall_allin_rate_per_sqft = ?');
      updateValues.push(preferences.wall_allin_rate_per_sqft);
    }
    if (preferences.ceiling_allin_rate_per_sqft !== undefined) {
      updateFields.push('ceiling_allin_rate_per_sqft = ?');
      updateValues.push(preferences.ceiling_allin_rate_per_sqft);
    }
    if (preferences.primer_allin_rate_per_sqft !== undefined) {
      updateFields.push('primer_allin_rate_per_sqft = ?');
      updateValues.push(preferences.primer_allin_rate_per_sqft);
    }
    if (preferences.door_allin_rate_each !== undefined) {
      updateFields.push('door_allin_rate_each = ?');
      updateValues.push(preferences.door_allin_rate_each);
    }
    if (preferences.window_allin_rate_each !== undefined) {
      updateFields.push('window_allin_rate_each = ?');
      updateValues.push(preferences.window_allin_rate_each);
    }

    // Product preferences
    if (preferences.preferred_primer_brand !== undefined) {
      updateFields.push('preferred_primer_brand = ?');
      updateValues.push(preferences.preferred_primer_brand);
    }
    if (preferences.preferred_primer_product !== undefined) {
      updateFields.push('preferred_primer_product = ?');
      updateValues.push(preferences.preferred_primer_product);
    }
    if (preferences.preferred_wall_paint_brand !== undefined) {
      updateFields.push('preferred_wall_paint_brand = ?');
      updateValues.push(preferences.preferred_wall_paint_brand);
    }
    if (preferences.preferred_wall_paint_product !== undefined) {
      updateFields.push('preferred_wall_paint_product = ?');
      updateValues.push(preferences.preferred_wall_paint_product);
    }
    if (preferences.preferred_ceiling_paint_brand !== undefined) {
      updateFields.push('preferred_ceiling_paint_brand = ?');
      updateValues.push(preferences.preferred_ceiling_paint_brand);
    }
    if (preferences.preferred_ceiling_paint_product !== undefined) {
      updateFields.push('preferred_ceiling_paint_product = ?');
      updateValues.push(preferences.preferred_ceiling_paint_product);
    }
    if (preferences.preferred_trim_paint_brand !== undefined) {
      updateFields.push('preferred_trim_paint_brand = ?');
      updateValues.push(preferences.preferred_trim_paint_brand);
    }
    if (preferences.preferred_trim_paint_product !== undefined) {
      updateFields.push('preferred_trim_paint_product = ?');
      updateValues.push(preferences.preferred_trim_paint_product);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: 'No valid preferences provided to save'
      });
    }

    // Check if we should ask for confirmation
    const shouldAsk = currentSettings.ai_ask_before_saving === 1 && askForConfirmation;

    if (shouldAsk) {
      // Return the proposed changes for user confirmation
      const changes = Object.keys(preferences).map(key => ({
        field: key,
        oldValue: currentSettings[key],
        newValue: preferences[key]
      })).filter(change => change.oldValue !== change.newValue);

      return NextResponse.json({
        success: false,
        requiresConfirmation: true,
        message: 'AI wants to save new preferences. Do you approve these changes?',
        proposedChanges: changes,
        preferences
      });
    }

    // Add timestamp and source tracking
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateFields.push('last_ai_update = CURRENT_TIMESTAMP');

    // Update the settings
    const result = dbRun(`
      UPDATE companies SET 
        ${updateFields.join(', ')}
      WHERE id = ?
    `, [...updateValues, companyId]);

    if (result.changes === 0) {
      return NextResponse.json({ 
        error: 'Failed to update preferences' 
      }, { status: 500 });
    }

    // Log the successful update
    const updatedCount = Object.keys(preferences).length;
    
    return NextResponse.json({
      success: true,
      message: `Successfully saved ${updatedCount} preference(s) from ${source}`,
      updatedFields: Object.keys(preferences),
      source,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI save preferences error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to save AI preferences'
    }, { status: 500 });
  }
}

// GET endpoint to check if AI learning is enabled
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ 
        error: 'Missing companyId' 
      }, { status: 400 });
    }

    const settings = dbGet(`
      SELECT ai_learning_enabled, ai_ask_before_saving 
      FROM companies 
      WHERE id = ?
    `, [companyId]);

    if (!settings) {
      return NextResponse.json({ 
        error: 'Company not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      learningEnabled: settings.ai_learning_enabled === 1,
      askBeforeSaving: settings.ai_ask_before_saving === 1
    });

  } catch (error) {
    console.error('AI learning check error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to check AI learning settings'
    }, { status: 500 });
  }
}