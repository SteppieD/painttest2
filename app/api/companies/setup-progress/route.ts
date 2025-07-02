import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbRun } from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    const { companyId, setupData, sectionCompleted } = await req.json()
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Check if setup progress record exists
    const existingProgress = dbGet(`
      SELECT * FROM company_setup_progress 
      WHERE company_id = ?
    `, [companyId])

    if (existingProgress) {
      // Update existing progress
      dbRun(`
        UPDATE company_setup_progress 
        SET 
          last_updated_at = CURRENT_TIMESTAMP,
          ${sectionCompleted === 'labor_rates' ? 'labor_rates_completed = TRUE,' : ''}
          ${sectionCompleted === 'paint_preferences' ? 'paint_preferences_completed = TRUE,' : ''}
          ${sectionCompleted === 'business_settings' ? 'business_settings_completed = TRUE,' : ''}
        WHERE company_id = ?
      `.replace(/,\s*WHERE/, ' WHERE'), [companyId]) // Remove trailing comma
    } else {
      // Create new progress record
      dbRun(`
        INSERT INTO company_setup_progress (
          company_id,
          ${sectionCompleted === 'labor_rates' ? 'labor_rates_completed,' : ''}
          ${sectionCompleted === 'paint_preferences' ? 'paint_preferences_completed,' : ''}
          ${sectionCompleted === 'business_settings' ? 'business_settings_completed,' : ''}
          setup_started_at
        ) VALUES (
          ?,
          ${sectionCompleted === 'labor_rates' ? 'TRUE,' : ''}
          ${sectionCompleted === 'paint_preferences' ? 'TRUE,' : ''}
          ${sectionCompleted === 'business_settings' ? 'TRUE,' : ''}
          CURRENT_TIMESTAMP
        )
      `.replace(/,\s*CURRENT_TIMESTAMP/, ' CURRENT_TIMESTAMP'), [companyId])
    }

    // Update or create rate card data
    const existingRateCard = dbGet(`
      SELECT * FROM company_rate_cards 
      WHERE company_id = ?
    `, [companyId])

    const rateCardData = {
      interior_wall_rate: setupData.interior_wall_rate,
      ceiling_rate: setupData.ceiling_rate,
      trim_rate: setupData.trim_rate,
      door_rate: setupData.door_rate,
      preferred_wall_paint: setupData.preferred_wall_paint,
      wall_paint_cost: setupData.wall_paint_cost,
      wall_paint_coverage: setupData.wall_paint_coverage,
      preferred_primer: setupData.preferred_primer,
      primer_cost: setupData.primer_cost,
      primer_coverage: setupData.primer_coverage,
      labor_included_in_paint: setupData.labor_included_in_paint,
      material_markup_percent: setupData.material_markup_percent,
      separate_prep_charge: setupData.separate_prep_charge
    }

    if (existingRateCard) {
      // Update existing rate card
      const updateFields = Object.entries(rateCardData)
        .filter(([key, value]) => value !== undefined)
        .map(([key]) => `${key} = ?`)
        .join(', ')
      
      const updateValues = Object.values(rateCardData)
        .filter(value => value !== undefined)
        .concat([companyId])

      if (updateFields) {
        dbRun(`
          UPDATE company_rate_cards 
          SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
          WHERE company_id = ?
        `, updateValues)
      }
    } else {
      // Create new rate card
      const fields = Object.keys(rateCardData).filter(key => rateCardData[key as keyof typeof rateCardData] !== undefined)
      const values = Object.values(rateCardData).filter(value => value !== undefined)
      
      if (fields.length > 0) {
        dbRun(`
          INSERT INTO company_rate_cards (
            company_id, 
            ${fields.join(', ')},
            created_at,
            updated_at
          ) VALUES (
            ?, 
            ${fields.map(() => '?').join(', ')},
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
          )
        `, [companyId, ...values])
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Setup progress saved successfully'
    })

  } catch (error) {
    console.error('Setup progress save error:', error)
    return NextResponse.json(
      { error: 'Failed to save setup progress' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const companyId = searchParams.get('companyId')
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Get setup progress
    const progress = dbGet(`
      SELECT * FROM company_setup_progress 
      WHERE company_id = ?
    `, [parseInt(companyId)])

    // Get rate card data
    const rateCard = dbGet(`
      SELECT * FROM company_rate_cards 
      WHERE company_id = ?
    `, [parseInt(companyId)])

    // Get industry defaults for sliders
    const rateDefaults = dbGet(`
      SELECT 
        service_type,
        low_rate,
        avg_rate, 
        high_rate
      FROM industry_rate_defaults
      WHERE region = 'national'
    `) || []

    return NextResponse.json({
      progress: progress || null,
      rateCard: rateCard || null,
      rateDefaults: rateDefaults
    })

  } catch (error) {
    console.error('Setup progress fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch setup progress' },
      { status: 500 }
    )
  }
}