import { NextRequest, NextResponse } from 'next/server'
import { dbGet, dbRun } from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json()
    
    // Handle both old format (companyId + setupData) and new conversational format (accessCode + company details)
    let companyId = requestData.companyId
    let setupData = requestData.setupData
    
    if (requestData.accessCode) {
      // New conversational setup format
      const company = await dbGet(`
        SELECT id FROM companies WHERE access_code = ?
      `, [requestData.accessCode])
      
      if (!company) {
        return NextResponse.json(
          { error: 'Invalid access code' },
          { status: 404 }
        )
      }
      
      companyId = company.id
      
      // Update company details if provided
      if (requestData.companyName || requestData.address || requestData.phone || requestData.email) {
        const updateFields = []
        const updateValues = []
        
        if (requestData.companyName) {
          updateFields.push('name = ?')
          updateValues.push(requestData.companyName)
        }
        if (requestData.address) {
          updateFields.push('address = ?')
          updateValues.push(requestData.address)
        }
        if (requestData.phone) {
          updateFields.push('phone = ?')
          updateValues.push(requestData.phone)
        }
        if (requestData.email) {
          updateFields.push('email = ?')
          updateValues.push(requestData.email)
        }
        
        if (updateFields.length > 0) {
          updateValues.push(companyId)
          dbRun(`
            UPDATE companies 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, updateValues)
        }
      }
      
      // For conversational setup, create minimal setupData
      setupData = {
        setupType: requestData.setupType || 'conversational'
      }
    }
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Check if already completed to prevent duplicate bonuses
    const existingProgress = await dbGet(`
      SELECT setup_completed_at, bonus_quotes_awarded 
      FROM company_setup_progress 
      WHERE company_id = ?
    `, [companyId])

    const isAlreadyCompleted = existingProgress?.setup_completed_at !== null

    // Update setup progress as completed
    dbRun(`
      INSERT INTO company_setup_progress (
        company_id,
        setup_completed_at,
        labor_rates_completed,
        paint_preferences_completed,
        business_settings_completed,
        last_updated_at
      ) VALUES (?, CURRENT_TIMESTAMP, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP)
      ON CONFLICT (company_id) DO UPDATE SET
        setup_completed_at = CURRENT_TIMESTAMP,
        labor_rates_completed = TRUE,
        paint_preferences_completed = TRUE, 
        business_settings_completed = TRUE,
        last_updated_at = CURRENT_TIMESTAMP
    `, [companyId])

    // Save final rate card data
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

    // Update or insert rate card
    const existingRateCard = dbGet(`
      SELECT id FROM company_rate_cards WHERE company_id = ?
    `, [companyId])

    if (existingRateCard) {
      // Update existing
      const updateFields = []
      const updateValues = []
      
      Object.entries(rateCardData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`)
          updateValues.push(value)
        }
      })
      
      updateValues.push(companyId)
      
      await dbRun(`
        UPDATE company_rate_cards 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE company_id = ?
      `, updateValues)
    } else {
      // Insert new
      const fields = Object.keys(rateCardData).filter(key => 
        rateCardData[key as keyof typeof rateCardData] !== undefined
      )
      const values = Object.values(rateCardData).filter(value => value !== undefined)
      
      await dbRun(`
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

    // Award bonus quotes if this is first completion
    let bonusQuotesAwarded = false
    let bonusAmount = 0

    if (!isAlreadyCompleted) {
      bonusAmount = 6 // 6 bonus quotes (bringing total to 10 for first month)
      
      // Get current quote limit
      const company = await dbGet(`
        SELECT quote_limit FROM companies WHERE id = ?
      `, [companyId])
      
      const currentLimit = company?.quote_limit || 4
      const newLimit = currentLimit + bonusAmount
      
      // Update company quote limit
      await dbRun(`
        UPDATE companies 
        SET quote_limit = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [newLimit, companyId])
      
      // Mark bonus as awarded
      await dbRun(`
        UPDATE company_setup_progress 
        SET 
          bonus_quotes_awarded = TRUE,
          bonus_quotes_amount = ?
        WHERE company_id = ?
      `, [bonusAmount, companyId])
      
      bonusQuotesAwarded = true
    }

    return NextResponse.json({
      success: true,
      message: 'Setup completed successfully!',
      bonusQuotesAwarded,
      bonusQuotes: bonusAmount,
      setupCompleted: true
    })

  } catch (error) {
    console.error('Setup completion error:', error)
    return NextResponse.json(
      { error: 'Failed to complete setup' },
      { status: 500 }
    )
  }
}