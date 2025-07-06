// Demo data for showcasing the platform to new users

export const demoQuotes = [
  {
    id: 'demo-1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '(555) 123-4567',
    customerAddress: '1234 Maple Street, Denver, CO 80203',
    projectType: 'interior',
    roomCount: 4,
    surfaces: ['walls', 'ceilings', 'trim'],
    paintProducts: {
      walls: { brand: 'Sherwin-Williams', product: 'ProClassic Interior', finish: 'Eggshell', color: 'Agreeable Gray SW 7029', price: 65 },
      ceilings: { brand: 'Benjamin Moore', product: 'Ceiling Paint', finish: 'Flat', color: 'White', price: 45 },
      trim: { brand: 'Sherwin-Williams', product: 'ProClassic Trim', finish: 'Semi-Gloss', color: 'Pure White SW 7005', price: 75 }
    },
    totalSquareFeet: 2840,
    subtotal: 3420,
    taxRate: 0.0875,
    tax: 299.25,
    total: 3719.25,
    status: 'accepted',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    acceptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    notes: 'Customer wants work completed before Thanksgiving. Furniture will be moved by homeowner.',
    roomDetails: [
      { name: 'Living Room', length: 18, width: 14, height: 9 },
      { name: 'Master Bedroom', length: 16, width: 12, height: 9 },
      { name: 'Kitchen', length: 12, width: 10, height: 9 },
      { name: 'Guest Bedroom', length: 11, width: 10, height: 9 }
    ]
  },
  {
    id: 'demo-2',
    customerName: 'Mike Thompson',
    customerEmail: 'mike.t@business.com',
    customerPhone: '(555) 234-5678',
    customerAddress: '5678 Oak Avenue, Suite 200, Denver, CO 80205',
    projectType: 'commercial',
    roomCount: 12,
    surfaces: ['walls', 'ceilings'],
    paintProducts: {
      walls: { brand: 'PPG', product: 'Commercial Grade', finish: 'Satin', color: 'Corporate Blue', price: 55 },
      ceilings: { brand: 'PPG', product: 'Commercial Ceiling', finish: 'Flat', color: 'Bright White', price: 42 }
    },
    totalSquareFeet: 8500,
    subtotal: 12750,
    taxRate: 0.0875,
    tax: 1115.63,
    total: 13865.63,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    notes: 'Office renovation project. Work must be done over weekend to minimize business disruption. COI required.',
    roomDetails: [
      { name: 'Reception Area', length: 25, width: 20, height: 10 },
      { name: 'Conference Room A', length: 20, width: 15, height: 10 },
      { name: 'Conference Room B', length: 20, width: 15, height: 10 },
      { name: 'Open Office Space', length: 40, width: 30, height: 10 }
    ]
  },
  {
    id: 'demo-3',
    customerName: 'Emily Rodriguez',
    customerEmail: 'emily.r@email.com',
    customerPhone: '(555) 345-6789',
    customerAddress: '789 Pine Street, Boulder, CO 80302',
    projectType: 'exterior',
    surfaces: ['siding', 'trim', 'doors'],
    paintProducts: {
      siding: { brand: 'Sherwin-Williams', product: 'Duration Exterior', finish: 'Satin', color: 'Naval SW 6244', price: 85 },
      trim: { brand: 'Sherwin-Williams', product: 'Duration Exterior', finish: 'Gloss', color: 'Extra White SW 7006', price: 90 },
      doors: { brand: 'Benjamin Moore', product: 'Advance', finish: 'Semi-Gloss', color: 'Hale Navy HC-154', price: 95 }
    },
    totalSquareFeet: 2200,
    subtotal: 5940,
    taxRate: 0.0875,
    tax: 519.75,
    total: 6459.75,
    status: 'accepted',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Week ago
    acceptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Full exterior repaint. Pressure washing included. Prime all bare wood. Two coats on all surfaces.',
    projectDetails: {
      stories: 2,
      sidingType: 'Wood lap siding',
      condition: 'Good - minor prep needed'
    }
  },
  {
    id: 'demo-4',
    customerName: 'David & Lisa Chen',
    customerEmail: 'chen.family@email.com',
    customerPhone: '(555) 456-7890',
    customerAddress: '321 Birch Lane, Littleton, CO 80120',
    projectType: 'interior',
    roomCount: 3,
    surfaces: ['walls', 'ceilings', 'cabinets'],
    paintProducts: {
      walls: { brand: 'Benjamin Moore', product: 'Regal Select', finish: 'Matte', color: 'Cloud White OC-130', price: 70 },
      ceilings: { brand: 'Benjamin Moore', product: 'Waterborne Ceiling', finish: 'Flat', color: 'White', price: 48 },
      cabinets: { brand: 'Benjamin Moore', product: 'Advance', finish: 'Satin', color: 'White Dove OC-17', price: 95 }
    },
    totalSquareFeet: 1580,
    subtotal: 3476,
    taxRate: 0.0875,
    tax: 304.15,
    total: 3780.15,
    status: 'draft',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    notes: 'Kitchen cabinet painting. Remove all hardware. Light sanding required. Customer purchasing new hardware.',
    roomDetails: [
      { name: 'Kitchen', length: 14, width: 12, height: 9 },
      { name: 'Dining Room', length: 12, width: 10, height: 9 },
      { name: 'Half Bath', length: 6, width: 5, height: 8 }
    ]
  },
  {
    id: 'demo-5',
    customerName: 'Robert Martinez',
    customerEmail: 'rmartinez@propertymanagement.com',
    customerPhone: '(555) 567-8901',
    customerAddress: '456 Washington Ave, Unit 10-15, Denver, CO 80203',
    projectType: 'multi-unit',
    unitCount: 6,
    surfaces: ['walls', 'ceilings', 'trim', 'doors'],
    paintProducts: {
      walls: { brand: 'PPG', product: 'Property Solutions', finish: 'Eggshell', color: 'Antique White', price: 48 },
      ceilings: { brand: 'PPG', product: 'Ceiling White', finish: 'Flat', color: 'White', price: 38 },
      trim: { brand: 'PPG', product: 'Property Solutions', finish: 'Semi-Gloss', color: 'White', price: 52 },
      doors: { brand: 'PPG', product: 'Property Solutions', finish: 'Semi-Gloss', color: 'White', price: 52 }
    },
    totalSquareFeet: 4800,
    subtotal: 9120,
    taxRate: 0.0875,
    tax: 798,
    total: 9918,
    status: 'accepted',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    acceptedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    notes: 'Apartment turnover painting. 6 units total. Patch all holes. Match existing paint in common areas.',
    projectDetails: {
      unitsPerFloor: 2,
      floors: 3,
      averageUnitSize: 800
    }
  }
];

export const demoContractors = [
  {
    id: 'contractor-1',
    companyName: "Mike's Professional Painting",
    ownerName: 'Mike Richardson',
    location: 'Denver, CO',
    established: 2018,
    employees: 8,
    metrics: {
      monthlyQuotes: 45,
      averageQuoteValue: 4250,
      winRate: 0.42,
      timePerQuote: { before: 180, after: 2 }, // minutes
      revenueGrowth: 0.47,
      customerSatisfaction: 4.8
    },
    testimonial: "ProPaint Quote transformed my business. We went from $150K to $500K annual revenue in 18 months. The speed of quoting changed everything - we can now respond to leads immediately and close deals on the spot.",
    beforeAfter: {
      quotesPerWeek: { before: 8, after: 35 },
      revenuePerMonth: { before: 12500, after: 41600 },
      hoursOnQuotes: { before: 24, after: 1.2 }
    }
  },
  {
    id: 'contractor-2',
    companyName: 'Elite Coatings LLC',
    ownerName: 'Jennifer Park',
    location: 'Miami, FL',
    established: 2020,
    employees: 5,
    metrics: {
      monthlyQuotes: 38,
      averageQuoteValue: 3800,
      winRate: 0.63,
      timePerQuote: { before: 120, after: 1.5 },
      revenueGrowth: 0.85,
      customerSatisfaction: 4.9
    },
    testimonial: "As a newer company, we needed to look professional and respond fast. ProPaint Quote gave us both. Our close rate went from 30% to 63% because customers are impressed by instant, professional quotes.",
    beforeAfter: {
      quotesPerWeek: { before: 5, after: 25 },
      revenuePerMonth: { before: 8000, after: 28900 },
      hoursOnQuotes: { before: 10, after: 0.6 }
    }
  },
  {
    id: 'contractor-3',
    companyName: 'Professional Painters Austin',
    ownerName: 'Carlos Mendez',
    location: 'Austin, TX',
    established: 2015,
    employees: 12,
    metrics: {
      monthlyQuotes: 62,
      averageQuoteValue: 5100,
      winRate: 0.38,
      timePerQuote: { before: 150, after: 1.8 },
      revenueGrowth: 0.32,
      customerSatisfaction: 4.7
    },
    testimonial: "What used to take me 3 hours now takes 30 seconds. I can bid on 10x more jobs and actually enjoy evenings with my family instead of writing quotes until midnight.",
    beforeAfter: {
      quotesPerWeek: { before: 12, after: 48 },
      revenuePerMonth: { before: 45000, after: 78500 },
      hoursOnQuotes: { before: 30, after: 1.4 }
    }
  }
];

export const pillarPageTopics = [
  {
    keyword: "how to quote painting jobs",
    title: "The Complete Guide to Quoting Painting Jobs Like a Pro",
    wordCount: 4500,
    sections: [
      "Understanding Painting Quote Basics",
      "Measuring and Calculating Square Footage",
      "Material Cost Calculations",
      "Labor Pricing Strategies",
      "Overhead and Profit Margins",
      "Professional Quote Presentation",
      "Common Pricing Mistakes to Avoid",
      "Technology Tools for Faster Quoting",
      "Winning More Jobs with Better Quotes"
    ],
    targetAudience: "New to intermediate painting contractors",
    searchVolume: 1900,
    difficulty: "Medium"
  },
  {
    keyword: "painting estimate calculator",
    title: "Painting Estimate Calculator: Complete Guide & Free Tools",
    wordCount: 3800,
    sections: [
      "How Painting Calculators Work",
      "Interior vs Exterior Calculations",
      "Room-by-Room Estimation Guide",
      "Paint Coverage Formulas",
      "Labor Hour Calculations",
      "Material Waste Factors",
      "Regional Pricing Adjustments",
      "Free Calculator Tools",
      "Professional Calculator Software"
    ],
    targetAudience: "DIY homeowners and contractors",
    searchVolume: 4400,
    difficulty: "High"
  },
  {
    keyword: "painting contractor software",
    title: "Best Painting Contractor Software 2025: Complete Comparison Guide",
    wordCount: 5200,
    sections: [
      "Why Painting Contractors Need Software",
      "Types of Contractor Software",
      "Top 10 Software Solutions Compared",
      "Features That Matter Most",
      "Pricing and ROI Analysis",
      "Implementation Best Practices",
      "Mobile vs Desktop Solutions",
      "Integration with Other Tools",
      "Success Stories and Case Studies"
    ],
    targetAudience: "Established painting contractors",
    searchVolume: 880,
    difficulty: "Low"
  }
];