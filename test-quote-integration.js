// Integration test showing complete quote creation flow
// This demonstrates how the structured data would be used in the app

const quoteData = {
  "client_name": "Cici",
  "address": "9090 Hillside Drive", 
  "date": "2025-06-23",
  "rooms": [
    {
      "name": "Interior Space",
      "wall_sqft": 4500,
      "ceiling_sqft": 0,
      "doors_count": 0,
      "windows_count": 0,
      "floor_sqft": 0,
      "trim_linear_feet": 0
    }
  ],
  "materials": {
    "wall_paint": {
      "brand": "Sherwin Williams Eggshell",
      "gallons": 13,
      "cost_per_gallon": 50,
      "total_cost": 650
    }
  },
  "labor": {
    "estimated_hours": 23,
    "rate_type": "sqft",
    "rate_amount": 1.5,
    "total_labor_cost": 6750
  },
  "overhead": {
    "total": 0
  },
  "subtotal": 7400,
  "markup_percentage": 20,
  "markup_amount": 1480,
  "total_quote": 8880,
  "scope_notes": "500 linear feet interior painting, 9ft ceilings, walls only (no doors, trim, windows, or ceilings). No primer required.",
  "validity_days": 30
};

console.log('🎯 Quote Integration Test');
console.log('========================');

// 1. Show the structured data
console.log('📊 Extracted Quote Data:');
console.log(JSON.stringify(quoteData, null, 2));
console.log('');

// 2. Show how it would appear as a professional quote
console.log('📋 Professional Quote Display:');
console.log('================================');

const formatCurrency = (amount) => `$${amount.toLocaleString()}`;

console.log(`**PROJECT QUOTE**

**Client:** ${quoteData.client_name}
**Address:** ${quoteData.address}
**Date:** ${quoteData.date}

**Scope of Work:**`);

quoteData.rooms.forEach(room => {
  console.log(`- ${room.name}: ${room.wall_sqft} sq ft walls`);
  if (room.ceiling_sqft > 0) console.log(`  - ${room.ceiling_sqft} sq ft ceiling`);
  if (room.doors_count > 0) console.log(`  - ${room.doors_count} doors`);
  if (room.windows_count > 0) console.log(`  - ${room.windows_count} windows`);
});

console.log(`
**Materials:**`);

Object.entries(quoteData.materials).forEach(([type, material]) => {
  if (material) {
    const typeName = type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log(`- ${typeName}: ${material.brand} – ${material.gallons} gallons @ ${formatCurrency(material.cost_per_gallon)}/gal = ${formatCurrency(material.total_cost)}`);
  }
});

console.log(`
**Labor:**
- Estimated Hours: ${quoteData.labor.estimated_hours}
- Rate: ${formatCurrency(quoteData.labor.rate_amount)}/${quoteData.labor.rate_type}
- Total Labor Cost: ${formatCurrency(quoteData.labor.total_labor_cost)}

**Subtotal:** ${formatCurrency(quoteData.subtotal)}
**Markup:** ${quoteData.markup_percentage}% = ${formatCurrency(quoteData.markup_amount)}
**Total Quote:** **${formatCurrency(quoteData.total_quote)}**

*${quoteData.scope_notes}*

*This quote is valid for ${quoteData.validity_days} days.*`);

console.log('');

// 3. Show editable fields
console.log('✏️ Editable Quote Fields:');
console.log('=========================');
console.log('Customer Info:');
console.log(`- Name: ${quoteData.client_name} [EDITABLE]`);
console.log(`- Address: ${quoteData.address} [EDITABLE]`);
console.log('');

console.log('Project Details:');
console.log(`- Wall Area: ${quoteData.rooms[0].wall_sqft} sq ft [EDITABLE]`);
console.log(`- Room Description: ${quoteData.rooms[0].name} [EDITABLE]`);
console.log('');

console.log('Materials:');
console.log(`- Paint Brand: ${quoteData.materials.wall_paint.brand} [EDITABLE]`);
console.log(`- Gallons Needed: ${quoteData.materials.wall_paint.gallons} [AUTO-CALCULATED]`);
console.log(`- Cost per Gallon: ${formatCurrency(quoteData.materials.wall_paint.cost_per_gallon)} [EDITABLE]`);
console.log('');

console.log('Labor:');
console.log(`- Rate: ${formatCurrency(quoteData.labor.rate_amount)}/${quoteData.labor.rate_type} [EDITABLE]`);
console.log(`- Total Labor: ${formatCurrency(quoteData.labor.total_labor_cost)} [AUTO-CALCULATED]`);
console.log('');

console.log('Pricing:');
console.log(`- Markup: ${quoteData.markup_percentage}% [EDITABLE]`);
console.log(`- Final Total: ${formatCurrency(quoteData.total_quote)} [AUTO-CALCULATED]`);
console.log('');

// 4. Show validation
console.log('✅ Quote Validation:');
console.log('====================');
const validationChecks = [
  { check: 'Client name provided', status: quoteData.client_name ? '✅ PASS' : '❌ FAIL' },
  { check: 'Address provided', status: quoteData.address ? '✅ PASS' : '❌ FAIL' },
  { check: 'Project scope defined', status: quoteData.rooms.length > 0 ? '✅ PASS' : '❌ FAIL' },
  { check: 'Materials specified', status: Object.keys(quoteData.materials).length > 0 ? '✅ PASS' : '❌ FAIL' },
  { check: 'Labor rate provided', status: quoteData.labor.rate_amount > 0 ? '✅ PASS' : '❌ FAIL' },
  { check: 'Total calculated', status: quoteData.total_quote > 0 ? '✅ PASS' : '❌ FAIL' }
];

validationChecks.forEach(check => {
  console.log(`${check.status} ${check.check}`);
});

console.log('');
console.log('🎯 RESULT: Quote successfully created and ready for editing!');
console.log(`💰 Total Value: ${formatCurrency(quoteData.total_quote)}`);
console.log(`📧 Ready to send to: ${quoteData.client_name} at ${quoteData.address}`);