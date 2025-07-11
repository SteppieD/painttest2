interface ParsedQuoteData {
  customerName?: string
  address?: string
  projectType?: 'interior' | 'exterior' | 'both'
  surfaces: {
    walls?: {
      linearFeet?: number
      squareFeet?: number
      height?: number
      paint?: boolean
    }
    ceilings?: {
      squareFeet?: number
      paint?: boolean
    }
    doors?: {
      count?: number
      paint?: boolean
    }
    windows?: {
      count?: number
      paint?: boolean
    }
    trim?: {
      linearFeet?: number
      paint?: boolean
    }
    baseboards?: {
      linearFeet?: number
      paint?: boolean
    }
  }
  paint?: {
    brand?: string
    type?: string
    pricePerGallon?: number
    coveragePerGallon?: number
  }
  laborRate?: number
  includesPrimer?: boolean
  chargeRates?: {
    walls?: number
    ceilings?: number
    doors?: number
    windows?: number
    baseboards?: number
    trim?: number
  }
}

export class IntelligentQuoteParser {
  static parse(input: string): ParsedQuoteData {
    const data: ParsedQuoteData = { surfaces: {} }
    const text = input.toLowerCase()
    
    // Extract customer name and address
    const nameMatch = input.match(/(?:for|project for|quote for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:at|@)/i)
    if (nameMatch) {
      data.customerName = nameMatch[1]
    }
    
    const addressMatch = input.match(/(?:at|@)\s+(\d+\s+[A-Za-z\s]+(?:Drive|Street|Avenue|Road|Lane|Way|Court|Circle|Place|Blvd|Ave|St|Rd|Ln|Ct|Cir|Pl))/i)
    if (addressMatch) {
      data.address = addressMatch[1]
    }
    
    // Determine project type
    if (text.includes('interior') && text.includes('exterior')) {
      data.projectType = 'both'
    } else if (text.includes('exterior') || text.includes('outside')) {
      data.projectType = 'exterior'
    } else if (text.includes('interior') || text.includes('inside')) {
      data.projectType = 'interior'
    }
    
    // Parse wall information
    const linearFeetMatch = text.match(/(\d+)\s*(?:linear|lf|lin)\s*(?:feet|ft|foot)/i)
    if (linearFeetMatch) {
      data.surfaces.walls = data.surfaces.walls || {}
      data.surfaces.walls.linearFeet = parseInt(linearFeetMatch[1])
    }
    
    // Parse ceiling height
    const ceilingHeightMatch = text.match(/(?:ceiling|ceilings|walls?)\s+(?:are|is|height)?\s*(\d+)\s*(?:feet|ft|foot|')\s*(?:tall|high)?/i)
    if (ceilingHeightMatch) {
      data.surfaces.walls = data.surfaces.walls || {}
      data.surfaces.walls.height = parseInt(ceilingHeightMatch[1])
    }
    
    // Calculate wall square footage if we have linear feet and height
    if (data.surfaces.walls?.linearFeet && data.surfaces.walls?.height) {
      data.surfaces.walls.squareFeet = data.surfaces.walls.linearFeet * data.surfaces.walls.height
    }
    
    // Parse what's NOT being painted
    const notPaintingPattern = /(?:not|no|excluding|exclude|without)\s+painting?\s+(ceilings?|doors?|windows?|trim|baseboards?)/gi
    let match
    while ((match = notPaintingPattern.exec(text)) !== null) {
      const surface = match[1].toLowerCase()
      if (surface.includes('ceiling')) {
        data.surfaces.ceilings = { paint: false }
      } else if (surface.includes('door')) {
        data.surfaces.doors = { paint: false }
      } else if (surface.includes('window')) {
        data.surfaces.windows = { paint: false }
      } else if (surface.includes('trim')) {
        data.surfaces.trim = { paint: false }
      } else if (surface.includes('baseboard')) {
        data.surfaces.baseboards = { paint: false }
      }
    }
    
    // Parse paint information
    const paintPriceMatch = text.match(/\$(\d+)\s*(?:a|per)?\s*gallon/i)
    if (paintPriceMatch) {
      data.paint = data.paint || {}
      data.paint.pricePerGallon = parseInt(paintPriceMatch[1])
    }
    
    const coverageMatch = text.match(/(?:spread|coverage|cover)\s*(?:rate)?\s*(?:is|of)?\s*(\d+)\s*(?:square|sq|sf)?\s*(?:feet|ft)?/i)
    if (coverageMatch) {
      data.paint = data.paint || {}
      data.paint.coveragePerGallon = parseInt(coverageMatch[1])
    }
    
    // Parse paint brand and type
    const paintBrandMatch = input.match(/(?:sherwin\s*williams?|benjamin\s*moore|behr|valspar|ppg|kilz)/i)
    if (paintBrandMatch) {
      data.paint = data.paint || {}
      data.paint.brand = paintBrandMatch[0]
    }
    
    const paintTypeMatch = text.match(/(?:eggshell|flat|satin|semi-gloss|gloss|matte)/i)
    if (paintTypeMatch) {
      data.paint = data.paint || {}
      data.paint.type = paintTypeMatch[0]
    }
    
    // Parse labor rate
    const laborRateMatch = text.match(/(?:labor|labour)\s+(?:is|rate|cost|included)?\s*(?:at|@)?\s*\$?(\d+(?:\.\d+)?)\s*(?:per|\/)\s*(?:square|sq|sf)/i)
    if (laborRateMatch) {
      data.laborRate = parseFloat(laborRateMatch[1])
    }
    
    // Parse charge rates if provided
    const chargeRateMatch = text.match(/(?:charge|cost)\s+(?:rate)?\s*(?:per|\/)\s*(?:square|sq|sf)?\s*(?:foot|ft)?\s*(?:at|@|is)?\s*\$?(\d+(?:\.\d+)?)/i)
    if (chargeRateMatch && data.laborRate) {
      // If we have a labor rate and it's mentioned as included in charge rate
      if (text.includes('included')) {
        data.chargeRates = { walls: parseFloat(chargeRateMatch[1]) }
      }
    }
    
    // Check for primer
    data.includesPrimer = !text.includes('no primer')
    
    return data
  }
  
  static calculateQuote(parsedData: ParsedQuoteData): {
    summary: string
    breakdown: {
      area?: number
      paintGallons?: number
      paintCost?: number
      laborCost?: number
      total?: number
    }
  } {
    const breakdown: any = {}
    
    // Get setup configuration if available
    const setupData = typeof window !== 'undefined' ? 
      JSON.parse(sessionStorage.getItem('paintQuoteSetup') || '{}') : {}
    
    // Calculate area
    if (parsedData.surfaces.walls?.squareFeet) {
      breakdown.area = parsedData.surfaces.walls.squareFeet
    } else if (parsedData.surfaces.walls?.linearFeet && parsedData.surfaces.walls?.height) {
      breakdown.area = parsedData.surfaces.walls.linearFeet * parsedData.surfaces.walls.height
    }
    
    // Calculate paint needed
    if (breakdown.area && parsedData.paint?.coveragePerGallon) {
      breakdown.paintGallons = Math.ceil(breakdown.area / parsedData.paint.coveragePerGallon)
    }
    
    // Calculate costs based on charge rates or individual rates
    if (breakdown.area) {
      // First check if user provided charge rate in their message
      if (parsedData.chargeRates?.walls) {
        breakdown.total = breakdown.area * parsedData.chargeRates.walls
        breakdown.laborCost = breakdown.total * 0.7 // 70% is labor
        breakdown.paintCost = breakdown.total * 0.3 // 30% is materials
      }
      // Then check setup configuration
      else if (setupData.chargeRates?.interiorWalls && parsedData.projectType === 'interior') {
        breakdown.total = breakdown.area * setupData.chargeRates.interiorWalls
        const laborPercentage = setupData.laborPercentage || 70
        breakdown.laborCost = breakdown.total * (laborPercentage / 100)
        breakdown.paintCost = breakdown.total * ((100 - laborPercentage) / 100)
      }
      // Fall back to separate labor and material calculation
      else {
        // Calculate paint cost
        if (breakdown.paintGallons && parsedData.paint?.pricePerGallon) {
          breakdown.paintCost = breakdown.paintGallons * parsedData.paint.pricePerGallon
        } else if (breakdown.paintGallons) {
          // Use default paint price if not specified
          breakdown.paintCost = breakdown.paintGallons * 50 // $50/gallon default
        }
        
        // Calculate labor cost
        if (parsedData.laborRate) {
          breakdown.laborCost = breakdown.area * parsedData.laborRate
        } else if (setupData.chargeRates?.interiorWalls) {
          // Use setup charge rate and extract labor portion
          const chargeRate = setupData.chargeRates.interiorWalls
          const laborPercentage = setupData.laborPercentage || 70
          breakdown.laborCost = breakdown.area * chargeRate * (laborPercentage / 100)
        } else {
          // Default labor rate
          breakdown.laborCost = breakdown.area * 1.75 // $1.75/sq ft default
        }
        
        // Calculate total
        if (breakdown.paintCost && breakdown.laborCost) {
          breakdown.total = breakdown.paintCost + breakdown.laborCost
        }
      }
    }
    
    // Generate summary
    let summary = `Based on your specifications`
    if (parsedData.customerName && parsedData.address) {
      summary = `Perfect! Based on your specifications for ${parsedData.customerName} at ${parsedData.address}`
    } else if (parsedData.customerName) {
      summary = `Perfect! Based on your specifications for ${parsedData.customerName}`
    }
    
    summary += ':\n\n📊 **Quote Summary:**\n'
    
    if (breakdown.area) {
      summary += `- Wall Area: ${breakdown.area.toLocaleString()} sq ft`
      if (parsedData.surfaces.walls?.linearFeet) {
        summary += ` (${parsedData.surfaces.walls.linearFeet} linear ft × ${parsedData.surfaces.walls.height} ft height)`
      }
      summary += '\n'
    }
    
    if (breakdown.paintGallons && parsedData.paint?.brand) {
      summary += `- Paint Required: ${breakdown.paintGallons} gallons of ${parsedData.paint.brand} ${parsedData.paint.type || ''}\n`
    } else if (breakdown.paintGallons) {
      summary += `- Paint Required: ${breakdown.paintGallons} gallons\n`
    }
    
    if (breakdown.paintCost) {
      summary += `- Paint Cost: $${breakdown.paintCost.toLocaleString()}`
      if (breakdown.paintGallons && parsedData.paint?.pricePerGallon) {
        summary += ` (${breakdown.paintGallons} gal × $${parsedData.paint.pricePerGallon})`
      }
      summary += '\n'
    }
    
    if (breakdown.laborCost) {
      summary += `- Labor Cost: $${breakdown.laborCost.toLocaleString()}`
      if (breakdown.area && parsedData.laborRate) {
        summary += ` (${breakdown.area.toLocaleString()} sq ft × $${parsedData.laborRate}/sq ft)`
      }
      summary += '\n'
    }
    
    if (breakdown.total) {
      summary += `\n💰 **Total Quote: $${breakdown.total.toLocaleString()}**\n`
    }
    
    // Add exclusions
    const exclusions = []
    if (parsedData.surfaces.ceilings?.paint === false) exclusions.push('ceilings')
    if (parsedData.surfaces.doors?.paint === false) exclusions.push('doors')
    if (parsedData.surfaces.windows?.paint === false) exclusions.push('windows')
    if (parsedData.surfaces.trim?.paint === false) exclusions.push('trim')
    if (!parsedData.includesPrimer) exclusions.push('primer')
    
    if (exclusions.length > 0) {
      summary += `\n*Excludes: ${exclusions.join(', ')}*\n`
    }
    
    // Store quote data for email/PDF generation
    if (typeof window !== 'undefined' && breakdown.total) {
      sessionStorage.setItem('latestQuote', JSON.stringify({
        customerName: parsedData.customerName,
        address: parsedData.address,
        projectType: parsedData.projectType || 'interior',
        area: breakdown.area,
        paintGallons: breakdown.paintGallons,
        paintCost: breakdown.paintCost,
        laborCost: breakdown.laborCost,
        total: breakdown.total,
        excludes: exclusions,
        createdAt: new Date().toISOString()
      }))
    }
    
    summary += '\nWould you like me to adjust any details or send this quote to the customer?'
    
    return { summary, breakdown }
  }
}