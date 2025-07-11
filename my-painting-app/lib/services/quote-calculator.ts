import { Room, Surface, PrepWork } from '@/lib/types'

interface CalculationParams {
  rooms: Room[]
  laborRate: number
  markupPercentage: number
  taxRate: number
  overheadPercentage: number
}

interface CalculationResult {
  totalSquareFeet: number
  paintCost: number
  laborCost: number
  prepCost: number
  suppliesCost: number
  subtotal: number
  overhead: number
  markup: number
  tax: number
  total: number
  breakdown: {
    byRoom: RoomBreakdown[]
    bySurface: SurfaceBreakdown[]
  }
}

interface RoomBreakdown {
  roomName: string
  squareFeet: number
  paintGallons: number
  paintCost: number
  laborHours: number
  laborCost: number
  prepCost: number
  totalCost: number
}

interface SurfaceBreakdown {
  surface: string
  totalArea: number
  totalGallons: number
  averageCondition: string
}

export class QuoteCalculator {
  private static readonly SUPPLIES_MULTIPLIER = 0.15 // 15% of paint cost
  private static readonly DEFAULT_COVERAGE_PER_GALLON = 350 // sq ft
  private static readonly LABOR_RATES_PER_SQFT = {
    walls: { excellent: 0.40, good: 0.50, fair: 0.65, poor: 0.80 },
    ceiling: { excellent: 0.50, good: 0.65, fair: 0.80, poor: 1.00 },
    trim: { excellent: 2.00, good: 2.50, fair: 3.00, poor: 3.50 },
    doors: { excellent: 25, good: 35, fair: 45, poor: 60 }, // per door
    cabinets: { excellent: 3.00, good: 4.00, fair: 5.00, poor: 6.00 }
  }

  static calculate(params: CalculationParams): CalculationResult {
    let totalSquareFeet = 0
    let paintCost = 0
    let laborCost = 0
    let prepCost = 0
    const roomBreakdowns: RoomBreakdown[] = []
    const surfaceMap = new Map<string, { area: number, gallons: number, conditions: string[] }>()

    // Calculate room by room
    for (const room of params.rooms) {
      const roomResult = this.calculateRoom(room, params.laborRate)
      
      totalSquareFeet += roomResult.squareFeet
      paintCost += roomResult.paintCost
      laborCost += roomResult.laborCost
      prepCost += roomResult.prepCost

      roomBreakdowns.push({
        roomName: room.name,
        ...roomResult
      })

      // Aggregate surface data
      for (const surface of room.surfaces) {
        const key = surface.type
        const existing = surfaceMap.get(key) || { area: 0, gallons: 0, conditions: [] }
        const gallons = (surface.area * surface.coats) / (room.paintProduct?.coverage || this.DEFAULT_COVERAGE_PER_GALLON)
        
        existing.area += surface.area
        existing.gallons += gallons
        existing.conditions.push(surface.condition)
        
        surfaceMap.set(key, existing)
      }
    }

    // Calculate supplies cost
    const suppliesCost = paintCost * this.SUPPLIES_MULTIPLIER

    // Calculate subtotal
    const subtotal = paintCost + laborCost + prepCost + suppliesCost

    // Calculate overhead
    const overhead = subtotal * (params.overheadPercentage / 100)

    // Calculate markup
    const subtotalWithOverhead = subtotal + overhead
    const markup = subtotalWithOverhead * (params.markupPercentage / 100)

    // Calculate tax
    const beforeTax = subtotalWithOverhead + markup
    const tax = beforeTax * (params.taxRate / 100)

    // Calculate total
    const total = beforeTax + tax

    // Prepare surface breakdown
    const surfaceBreakdown: SurfaceBreakdown[] = Array.from(surfaceMap.entries()).map(([surface, data]) => {
      const conditionCounts = data.conditions.reduce((acc, cond) => {
        acc[cond] = (acc[cond] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const mostCommon = Object.entries(conditionCounts)
        .sort(([, a], [, b]) => b - a)[0][0]

      return {
        surface,
        totalArea: data.area,
        totalGallons: Math.ceil(data.gallons),
        averageCondition: mostCommon
      }
    })

    return {
      totalSquareFeet,
      paintCost,
      laborCost,
      prepCost,
      suppliesCost,
      subtotal,
      overhead,
      markup,
      tax,
      total,
      breakdown: {
        byRoom: roomBreakdowns,
        bySurface: surfaceBreakdown
      }
    }
  }

  private static calculateRoom(room: Room, laborRate: number) {
    let squareFeet = 0
    let paintGallons = 0
    let paintCost = 0
    let laborHours = 0
    let prepCost = 0

    for (const surface of room.surfaces) {
      squareFeet += surface.area

      // Calculate paint needed
      const gallonsForSurface = (surface.area * surface.coats) / (room.paintProduct?.coverage || this.DEFAULT_COVERAGE_PER_GALLON)
      paintGallons += gallonsForSurface

      // Calculate labor based on surface type and condition
      if (surface.type === 'doors') {
        // Doors are priced per unit, not per square foot
        const doorCount = Math.round(surface.area / 20) // Assume 20 sq ft per door
        const hourlyRate = laborRate
        const hoursPerDoor = this.LABOR_RATES_PER_SQFT.doors[surface.condition] / hourlyRate
        laborHours += doorCount * hoursPerDoor
      } else {
        const laborRatePerSqFt = this.LABOR_RATES_PER_SQFT[surface.type][surface.condition]
        const surfaceLaborCost = surface.area * laborRatePerSqFt
        laborHours += surfaceLaborCost / laborRate
      }

      // Calculate prep work cost
      if (surface.prep && surface.prep.length > 0) {
        for (const prep of surface.prep) {
          prepCost += prep.cost
          laborHours += prep.hours
        }
      }
    }

    // Calculate paint cost
    if (room.paintProduct) {
      paintCost = Math.ceil(paintGallons) * room.paintProduct.pricePerGallon
    }

    // Calculate total labor cost
    const laborCost = laborHours * laborRate

    return {
      squareFeet: Math.round(squareFeet),
      paintGallons: Math.ceil(paintGallons),
      paintCost: Math.round(paintCost),
      laborHours: Math.round(laborHours * 10) / 10,
      laborCost: Math.round(laborCost),
      prepCost: Math.round(prepCost),
      totalCost: Math.round(paintCost + laborCost + prepCost)
    }
  }

  static estimateFromSquareFeet(
    squareFeet: number,
    pricePerGallon: number = 45,
    laborRate: number = 50,
    coats: number = 2
  ) {
    const gallons = Math.ceil((squareFeet * coats) / this.DEFAULT_COVERAGE_PER_GALLON)
    const paintCost = gallons * pricePerGallon
    const laborHours = squareFeet * 0.006 // Average 0.006 hours per sq ft
    const laborCost = laborHours * laborRate
    const suppliesCost = paintCost * this.SUPPLIES_MULTIPLIER
    const subtotal = paintCost + laborCost + suppliesCost
    const markup = subtotal * 0.35 // 35% markup
    const total = subtotal + markup

    return {
      squareFeet,
      gallons,
      paintCost: Math.round(paintCost),
      laborCost: Math.round(laborCost),
      suppliesCost: Math.round(suppliesCost),
      total: Math.round(total)
    }
  }
}