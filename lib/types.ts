export interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: string
  accessCode: string
  createdAt: Date
  updatedAt: Date
  settings?: CompanySettings
}

export interface CompanySettings {
  id: string
  companyId: string
  defaultMarkup: number
  laborRate: number
  overheadPercentage: number
  favoritePaints: FavoritePaint[]
  createdAt: Date
  updatedAt: Date
}

export interface FavoritePaint {
  brandId: string
  brandName: string
  productId: string
  productName: string
  tier: 'economy' | 'standard' | 'premium'
  pricePerGallon: number
  category: 'interior' | 'exterior' | 'primer' | 'specialty'
}

export interface Customer {
  id: string
  companyId: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Quote {
  id: string
  companyId: string
  customerId?: string
  quoteNumber: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  projectType: 'interior' | 'exterior' | 'both'
  rooms: Room[]
  totalSquareFeet: number
  paintCost: number
  laborCost: number
  prepCost: number
  suppliesCost: number
  subtotal: number
  markup: number
  tax: number
  total: number
  notes?: string
  validUntil: Date
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  viewedAt?: Date
  acceptedAt?: Date
}

export interface Room {
  id: string
  name: string
  type: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  surfaces: Surface[]
  paintProduct?: {
    brandId: string
    productId: string
    name: string
    pricePerGallon: number
    coverage: number
  }
  laborHours: number
  paintGallons: number
  totalCost: number
}

export interface Surface {
  type: 'walls' | 'ceiling' | 'trim' | 'doors' | 'cabinets'
  area: number
  coats: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  prep: PrepWork[]
}

export interface PrepWork {
  type: 'patching' | 'sanding' | 'priming' | 'caulking' | 'taping'
  hours: number
  cost: number
}

export interface QuoteMessage {
  id: string
  quoteId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata?: {
    stage?: string
    extracted?: any
    confidence?: number
  }
  createdAt: Date
}

export interface AnalyticsEvent {
  id: string
  companyId: string
  type: 'quote_created' | 'quote_sent' | 'quote_viewed' | 'quote_accepted' | 'quote_rejected'
  entityId: string
  metadata?: Record<string, any>
  createdAt: Date
}