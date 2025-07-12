export const COMPANY_INFO = {
  name: 'ProPaint Solutions',
  tagline: 'Transform Your Space with Professional Excellence',
  phone: '1-800-PROPAINT',
  email: 'hello@propaintsolutions.com',
  address: {
    street: '123 Main Street',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    country: 'USA'
  },
  businessHours: {
    weekdays: '7:00 AM - 7:00 PM',
    saturday: '8:00 AM - 5:00 PM',
    sunday: '10:00 AM - 4:00 PM'
  },
  licenses: ['Licensed', 'Bonded', 'Insured'],
  established: 2010,
  employees: 50,
  projectsCompleted: 5000
}

export const PAINTING_SERVICES = [
  {
    id: 'interior',
    name: 'Interior Painting',
    description: 'Transform your indoor spaces with precision and care',
    icon: 'home',
    features: [
      'Wall and ceiling painting',
      'Trim and baseboard painting',
      'Cabinet painting and refinishing',
      'Accent walls and feature walls',
      'Texture removal and repair'
    ],
    priceRange: '$1.50 - $3.50 per sq ft'
  },
  {
    id: 'exterior',
    name: 'Exterior Painting',
    description: 'Protect and beautify your property exterior',
    icon: 'building',
    features: [
      'Complete exterior painting',
      'Siding and trim painting',
      'Deck and fence staining',
      'Pressure washing included',
      'Weather-resistant coatings'
    ],
    priceRange: '$2.00 - $4.00 per sq ft'
  },
  {
    id: 'commercial',
    name: 'Commercial Painting',
    description: 'Professional painting for businesses and properties',
    icon: 'briefcase',
    features: [
      'Office and retail spaces',
      'Warehouses and industrial',
      'Multi-unit properties',
      'Minimal business disruption',
      'Weekend and night work available'
    ],
    priceRange: 'Custom quotes available'
  },
  {
    id: 'specialty',
    name: 'Specialty Finishes',
    description: 'Unique textures and decorative finishes',
    icon: 'sparkles',
    features: [
      'Venetian plaster',
      'Faux finishes',
      'Metallic coatings',
      'Epoxy flooring',
      'Murals and custom artwork'
    ],
    priceRange: '$5.00 - $15.00 per sq ft'
  }
]

export const SERVICE_AREAS = [
  { city: 'Denver', state: 'CO', population: '715,522' },
  { city: 'Colorado Springs', state: 'CO', population: '478,961' },
  { city: 'Aurora', state: 'CO', population: '386,261' },
  { city: 'Fort Collins', state: 'CO', population: '169,810' },
  { city: 'Lakewood', state: 'CO', population: '155,984' },
  { city: 'Thornton', state: 'CO', population: '141,867' },
  { city: 'Arvada', state: 'CO', population: '124,402' },
  { city: 'Westminster', state: 'CO', population: '116,317' },
  { city: 'Pueblo', state: 'CO', population: '111,876' },
  { city: 'Centennial', state: 'CO', population: '108,418' }
]

export const PAINT_BRANDS = [
  {
    id: 'sherwin-williams',
    name: 'Sherwin-Williams',
    logo: '/images/sherwin-williams-logo.png',
    tiers: [
      { name: 'ProClassic', tier: 'premium', price: 65 },
      { name: 'Duration', tier: 'premium', price: 58 },
      { name: 'SuperPaint', tier: 'standard', price: 48 },
      { name: 'ProMar 200', tier: 'economy', price: 35 }
    ]
  },
  {
    id: 'benjamin-moore',
    name: 'Benjamin Moore',
    logo: '/images/benjamin-moore-logo.png',
    tiers: [
      { name: 'Aura', tier: 'premium', price: 70 },
      { name: 'Regal Select', tier: 'premium', price: 55 },
      { name: 'ben', tier: 'standard', price: 45 },
      { name: 'Ultra Spec', tier: 'economy', price: 32 }
    ]
  },
  {
    id: 'behr',
    name: 'Behr',
    logo: '/images/behr-logo.png',
    tiers: [
      { name: 'Marquee', tier: 'premium', price: 48 },
      { name: 'Dynasty', tier: 'standard', price: 38 },
      { name: 'Premium Plus Ultra', tier: 'standard', price: 35 },
      { name: 'Premium Plus', tier: 'economy', price: 28 }
    ]
  },
  {
    id: 'valspar',
    name: 'Valspar',
    logo: '/images/valspar-logo.png',
    tiers: [
      { name: 'Reserve', tier: 'premium', price: 45 },
      { name: 'Signature', tier: 'standard', price: 35 },
      { name: '2000', tier: 'standard', price: 32 },
      { name: 'Ultra', tier: 'economy', price: 25 }
    ]
  }
]

export const ROOM_TYPES = [
  { id: 'bedroom', name: 'Bedroom', avgSize: '12x12', surfaces: ['walls', 'ceiling', 'trim'] },
  { id: 'living-room', name: 'Living Room', avgSize: '16x20', surfaces: ['walls', 'ceiling', 'trim'] },
  { id: 'kitchen', name: 'Kitchen', avgSize: '12x16', surfaces: ['walls', 'ceiling', 'cabinets'] },
  { id: 'bathroom', name: 'Bathroom', avgSize: '8x10', surfaces: ['walls', 'ceiling', 'vanity'] },
  { id: 'dining-room', name: 'Dining Room', avgSize: '12x14', surfaces: ['walls', 'ceiling', 'trim'] },
  { id: 'master-bedroom', name: 'Master Bedroom', avgSize: '14x16', surfaces: ['walls', 'ceiling', 'trim'] },
  { id: 'hallway', name: 'Hallway', avgSize: '4x20', surfaces: ['walls', 'ceiling'] },
  { id: 'office', name: 'Home Office', avgSize: '10x12', surfaces: ['walls', 'ceiling', 'trim'] }
]

export const FINISH_TYPES = [
  { id: 'flat', name: 'Flat/Matte', sheen: '0-5%', bestFor: 'Ceilings, low-traffic areas' },
  { id: 'eggshell', name: 'Eggshell', sheen: '10-25%', bestFor: 'Living rooms, bedrooms' },
  { id: 'satin', name: 'Satin', sheen: '25-35%', bestFor: 'Kitchens, bathrooms, hallways' },
  { id: 'semi-gloss', name: 'Semi-Gloss', sheen: '35-70%', bestFor: 'Trim, doors, cabinets' },
  { id: 'gloss', name: 'Gloss', sheen: '70-90%', bestFor: 'High-impact areas, furniture' }
]