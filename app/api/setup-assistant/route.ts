import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { trackFeatureUsed } from '@/lib/analytics/tracking';
import { getDatabase } from '@/lib/database/init';

const requestSchema = z.object({
  message: z.string(),
  context: z.object({
    companyId: z.number(),
    setupProgress: z.object({
      // Business info
      businessName: z.string().optional(),
      ownerName: z.string().optional(),
      businessAddress: z.string().optional(),
      
      // Interior paints
      interiorPrimer: z.object({
        supplier: z.string().optional(),
        productName: z.string().optional(),
        costPerGallon: z.number().optional(),
        spreadRate: z.number().optional(),
      }).optional(),
      interiorWallPaint: z.object({
        supplier: z.string().optional(),
        productName: z.string().optional(),
        costPerGallon: z.number().optional(),
        spreadRate: z.number().optional(),
      }).optional(),
      interiorCeilingPaint: z.object({
        supplier: z.string().optional(),
        productName: z.string().optional(),
        costPerGallon: z.number().optional(),
        spreadRate: z.number().optional(),
      }).optional(),
      interiorTrimPaint: z.object({
        supplier: z.string().optional(),
        productName: z.string().optional(),
        costPerGallon: z.number().optional(),
        spreadRate: z.number().optional(),
      }).optional(),
      
      // Exterior paints
      exteriorPrimer: z.object({
        supplier: z.string().optional(),
        productName: z.string().optional(),
        costPerGallon: z.number().optional(),
        spreadRate: z.number().optional(),
      }).optional(),
      exteriorWallPaint: z.object({
        supplier: z.string().optional(),
        productName: z.string().optional(),
        costPerGallon: z.number().optional(),
        spreadRate: z.number().optional(),
      }).optional(),
      exteriorTrimPaint: z.object({
        supplier: z.string().optional(),
        productName: z.string().optional(),
        costPerGallon: z.number().optional(),
        spreadRate: z.number().optional(),
      }).optional(),
      
      // Labor rates
      laborRates: z.object({
        wallRatePerSqft: z.number().optional(),
        ceilingRatePerSqft: z.number().optional(),
        primerRatePerSqft: z.number().optional(),
        doorRateEach: z.number().optional(),
        windowRateEach: z.number().optional(),
      }).optional(),
      
      // Markup
      markupPercentage: z.number().optional(),
      
      // Track current step
      currentStep: z.string().optional(),
    }),
  }),
});

const SETUP_STEPS = [
  'welcome',
  'owner_name',
  'business_name', 
  'business_address',
  'interior_primer_brand',
  'interior_primer_details',
  'interior_wall_brand',
  'interior_wall_details',
  'interior_ceiling_brand',
  'interior_ceiling_details',
  'interior_trim_brand',
  'interior_trim_details',
  'exterior_primer_brand',
  'exterior_primer_details',
  'exterior_wall_brand',
  'exterior_wall_details',
  'exterior_trim_brand',
  'exterior_trim_details',
  'labor_wall_rate',
  'labor_ceiling_rate',
  'labor_primer_rate',
  'labor_door_rate',
  'labor_window_rate',
  'markup_percentage',
  'complete'
];

const POPULAR_BRANDS = ['Sherwin-Williams', 'Benjamin Moore', 'PPG', 'Behr', 'Kilz', 'Zinsser'];

function getNextStep(currentStep: string): string {
  const currentIndex = SETUP_STEPS.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === SETUP_STEPS.length - 1) {
    return 'complete';
  }
  return SETUP_STEPS[currentIndex + 1];
}

function parseUserResponse(message: string, expectedType: 'text' | 'number' | 'percentage'): any {
  const cleaned = message.trim();
  
  if (expectedType === 'number' || expectedType === 'percentage') {
    // Extract numbers from text like "$45", "45 dollars", "45%", etc.
    const numberMatch = cleaned.match(/[\d,]+\.?\d*/);
    if (numberMatch) {
      const number = parseFloat(numberMatch[0].replace(/,/g, ''));
      return isNaN(number) ? null : number;
    }
  }
  
  return cleaned;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context } = requestSchema.parse(body);
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const currentStep = context.setupProgress.currentStep || 'welcome';
    let nextStep = currentStep;
    let updatedProgress = { ...context.setupProgress };
    let assistantResponse = '';
    let isComplete = false;
    
    // Process user input based on current step
    switch (currentStep) {
      case 'welcome':
        assistantResponse = "Welcome! I'll help you set up your painting business profile. This will take about 5-10 minutes and will help you create accurate quotes quickly.\n\nFirst, what's your name?";
        nextStep = 'owner_name';
        break;
        
      case 'owner_name':
        updatedProgress.ownerName = parseUserResponse(message, 'text');
        assistantResponse = `Nice to meet you, ${updatedProgress.ownerName}! What's the name of your painting business?`;
        nextStep = 'business_name';
        break;
        
      case 'business_name':
        updatedProgress.businessName = parseUserResponse(message, 'text');
        assistantResponse = `Great! ${updatedProgress.businessName} sounds professional. What's your business address? (This will appear on your quotes)`;
        nextStep = 'business_address';
        break;
        
      case 'business_address':
        updatedProgress.businessAddress = parseUserResponse(message, 'text');
        assistantResponse = `Perfect! Now let's set up your paint products. I'll ask about each type of paint you use.\n\n**Interior Primer**: What brand do you typically use? (e.g., ${POPULAR_BRANDS.slice(0, 3).join(', ')})`;
        nextStep = 'interior_primer_brand';
        break;
        
      case 'interior_primer_brand':
        if (!updatedProgress.interiorPrimer) updatedProgress.interiorPrimer = {};
        updatedProgress.interiorPrimer.supplier = parseUserResponse(message, 'text');
        assistantResponse = `Got it! For ${updatedProgress.interiorPrimer.supplier} primer:\n- What's the product name?\n- Cost per gallon?\n- Spread rate (sqft/gallon)?\n\nYou can answer like: "Bulls Eye 123, $28, 400 sqft"`;
        nextStep = 'interior_primer_details';
        break;
        
      case 'interior_primer_details':
        // Parse compound response
        const primerParts = message.split(',').map(s => s.trim());
        if (primerParts.length >= 3) {
          updatedProgress.interiorPrimer!.productName = primerParts[0];
          updatedProgress.interiorPrimer!.costPerGallon = parseUserResponse(primerParts[1], 'number');
          updatedProgress.interiorPrimer!.spreadRate = parseUserResponse(primerParts[2], 'number');
        }
        assistantResponse = `Great! Now for **Interior Wall Paint**: What brand do you use?`;
        nextStep = 'interior_wall_brand';
        break;
        
      case 'interior_wall_brand':
        if (!updatedProgress.interiorWallPaint) updatedProgress.interiorWallPaint = {};
        updatedProgress.interiorWallPaint.supplier = parseUserResponse(message, 'text');
        assistantResponse = `For ${updatedProgress.interiorWallPaint.supplier} wall paint:\n- Product name?\n- Cost per gallon?\n- Spread rate?\n\n(e.g., "ProClassic, $58, 350 sqft")`;
        nextStep = 'interior_wall_details';
        break;
        
      case 'interior_wall_details':
        const wallParts = message.split(',').map(s => s.trim());
        if (wallParts.length >= 3) {
          updatedProgress.interiorWallPaint!.productName = wallParts[0];
          updatedProgress.interiorWallPaint!.costPerGallon = parseUserResponse(wallParts[1], 'number');
          updatedProgress.interiorWallPaint!.spreadRate = parseUserResponse(wallParts[2], 'number');
        }
        assistantResponse = `Good! Now for **Interior Ceiling Paint**: What brand?`;
        nextStep = 'interior_ceiling_brand';
        break;
        
      case 'interior_ceiling_brand':
        if (!updatedProgress.interiorCeilingPaint) updatedProgress.interiorCeilingPaint = {};
        updatedProgress.interiorCeilingPaint.supplier = parseUserResponse(message, 'text');
        assistantResponse = `For ${updatedProgress.interiorCeilingPaint.supplier} ceiling paint:\n- Product name?\n- Cost per gallon?\n- Spread rate?\n\n(e.g., "Ceiling Paint Ultra, $42, 400 sqft")`;
        nextStep = 'interior_ceiling_details';
        break;
        
      case 'interior_ceiling_details':
        const ceilingParts = message.split(',').map(s => s.trim());
        if (ceilingParts.length >= 3) {
          updatedProgress.interiorCeilingPaint!.productName = ceilingParts[0];
          updatedProgress.interiorCeilingPaint!.costPerGallon = parseUserResponse(ceilingParts[1], 'number');
          updatedProgress.interiorCeilingPaint!.spreadRate = parseUserResponse(ceilingParts[2], 'number');
        }
        assistantResponse = `Now for **Interior Trim Paint**: What brand?`;
        nextStep = 'interior_trim_brand';
        break;
        
      case 'interior_trim_brand':
        if (!updatedProgress.interiorTrimPaint) updatedProgress.interiorTrimPaint = {};
        updatedProgress.interiorTrimPaint.supplier = parseUserResponse(message, 'text');
        assistantResponse = `For ${updatedProgress.interiorTrimPaint.supplier} trim paint:\n- Product name?\n- Cost per gallon?\n- Spread rate?\n\n(e.g., "Advance, $68, 300 sqft")`;
        nextStep = 'interior_trim_details';
        break;
        
      case 'interior_trim_details':
        const trimParts = message.split(',').map(s => s.trim());
        if (trimParts.length >= 3) {
          updatedProgress.interiorTrimPaint!.productName = trimParts[0];
          updatedProgress.interiorTrimPaint!.costPerGallon = parseUserResponse(trimParts[1], 'number');
          updatedProgress.interiorTrimPaint!.spreadRate = parseUserResponse(trimParts[2], 'number');
        }
        assistantResponse = `Great! Now let's set up **Exterior Paints**. For exterior primer, what brand do you use?`;
        nextStep = 'exterior_primer_brand';
        break;
        
      case 'exterior_primer_brand':
        if (!updatedProgress.exteriorPrimer) updatedProgress.exteriorPrimer = {};
        updatedProgress.exteriorPrimer.supplier = parseUserResponse(message, 'text');
        assistantResponse = `For ${updatedProgress.exteriorPrimer.supplier} exterior primer:\n- Product name?\n- Cost per gallon?\n- Spread rate?`;
        nextStep = 'exterior_primer_details';
        break;
        
      case 'exterior_primer_details':
        const extPrimerParts = message.split(',').map(s => s.trim());
        if (extPrimerParts.length >= 3) {
          updatedProgress.exteriorPrimer!.productName = extPrimerParts[0];
          updatedProgress.exteriorPrimer!.costPerGallon = parseUserResponse(extPrimerParts[1], 'number');
          updatedProgress.exteriorPrimer!.spreadRate = parseUserResponse(extPrimerParts[2], 'number');
        }
        assistantResponse = `For **Exterior Wall Paint**: What brand?`;
        nextStep = 'exterior_wall_brand';
        break;
        
      case 'exterior_wall_brand':
        if (!updatedProgress.exteriorWallPaint) updatedProgress.exteriorWallPaint = {};
        updatedProgress.exteriorWallPaint.supplier = parseUserResponse(message, 'text');
        assistantResponse = `For ${updatedProgress.exteriorWallPaint.supplier} exterior wall paint:\n- Product name?\n- Cost per gallon?\n- Spread rate?`;
        nextStep = 'exterior_wall_details';
        break;
        
      case 'exterior_wall_details':
        const extWallParts = message.split(',').map(s => s.trim());
        if (extWallParts.length >= 3) {
          updatedProgress.exteriorWallPaint!.productName = extWallParts[0];
          updatedProgress.exteriorWallPaint!.costPerGallon = parseUserResponse(extWallParts[1], 'number');
          updatedProgress.exteriorWallPaint!.spreadRate = parseUserResponse(extWallParts[2], 'number');
        }
        assistantResponse = `For **Exterior Trim Paint**: What brand?`;
        nextStep = 'exterior_trim_brand';
        break;
        
      case 'exterior_trim_brand':
        if (!updatedProgress.exteriorTrimPaint) updatedProgress.exteriorTrimPaint = {};
        updatedProgress.exteriorTrimPaint.supplier = parseUserResponse(message, 'text');
        assistantResponse = `For ${updatedProgress.exteriorTrimPaint.supplier} exterior trim paint:\n- Product name?\n- Cost per gallon?\n- Spread rate?`;
        nextStep = 'exterior_trim_details';
        break;
        
      case 'exterior_trim_details':
        const extTrimParts = message.split(',').map(s => s.trim());
        if (extTrimParts.length >= 3) {
          updatedProgress.exteriorTrimPaint!.productName = extTrimParts[0];
          updatedProgress.exteriorTrimPaint!.costPerGallon = parseUserResponse(extTrimParts[1], 'number');
          updatedProgress.exteriorTrimPaint!.spreadRate = parseUserResponse(extTrimParts[2], 'number');
        }
        assistantResponse = `Perfect! Now let's set up your **labor rates**. What do you charge per square foot for wall painting? (labor only, not materials)`;
        nextStep = 'labor_wall_rate';
        break;
      
      case 'labor_wall_rate':
        if (!updatedProgress.laborRates) updatedProgress.laborRates = {};
        updatedProgress.laborRates.wallRatePerSqft = parseUserResponse(message, 'number');
        assistantResponse = `What do you charge per square foot for **ceiling painting**? (labor only)`;
        nextStep = 'labor_ceiling_rate';
        break;
        
      case 'labor_ceiling_rate':
        updatedProgress.laborRates!.ceilingRatePerSqft = parseUserResponse(message, 'number');
        assistantResponse = `What's your rate per square foot for **primer application**?`;
        nextStep = 'labor_primer_rate';
        break;
        
      case 'labor_door_rate':
        updatedProgress.laborRates!.doorRateEach = parseUserResponse(message, 'number');
        assistantResponse = `What do you charge per **window** (painting trim and frame)?`;
        nextStep = 'labor_window_rate';
        break;
        
      case 'labor_window_rate':
        updatedProgress.laborRates!.windowRateEach = parseUserResponse(message, 'number');
        assistantResponse = `Almost done! What **markup percentage** do you typically apply to your quotes? (e.g., 45%)`;
        nextStep = 'markup_percentage';
        break;
        
      case 'markup_percentage':
        updatedProgress.markupPercentage = parseUserResponse(message, 'percentage');
        assistantResponse = `Excellent! Your setup is complete. Here's a summary:\n\n**Business**: ${updatedProgress.businessName}\n**Owner**: ${updatedProgress.ownerName}\n**Location**: ${updatedProgress.businessAddress}\n**Markup**: ${updatedProgress.markupPercentage}%\n\nYou're all set to start creating professional quotes!`;
        nextStep = 'complete';
        isComplete = true;
        
        // Save all the data
        await saveSetupData(context.companyId, updatedProgress);
        break;
        
      default:
        // For any abbreviated steps, jump to next major section
        if (currentStep.includes('ceiling_details')) {
          assistantResponse = `Now for **Interior Trim Paint**: What brand?`;
          nextStep = 'interior_trim_brand';
        } else if (currentStep.includes('trim_details') && currentStep.includes('interior')) {
          assistantResponse = `Let's move to **Exterior Paints**. For exterior primer, what brand do you use?`;
          nextStep = 'exterior_primer_brand';
        } else if (currentStep.includes('trim_details') && currentStep.includes('exterior')) {
          assistantResponse = `Perfect! Now let's set up your **labor rates**. What do you charge per square foot for wall painting? (labor only, not materials)`;
          nextStep = 'labor_wall_rate';
        } else if (currentStep.includes('primer_rate')) {
          assistantResponse = `What do you charge per **door** (painting both sides)?`;
          nextStep = 'labor_door_rate';
        }
    }
    
    // Update progress
    updatedProgress.currentStep = nextStep;
    
    // Track usage
    trackFeatureUsed('setup_assistant', { 
      companyId: context.companyId.toString(),
      step: currentStep
    });
    
    return NextResponse.json({
      response: assistantResponse,
      setupProgress: updatedProgress,
      isComplete,
      currentStep: nextStep,
      suggestions: getSuggestionsForStep(nextStep),
    });
    
  } catch (error) {
    console.error('Setup assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to process setup step' },
      { status: 500 }
    );
  }
}

function getSuggestionsForStep(step: string): string[] {
  switch (step) {
    // Brand suggestions
    case 'interior_primer_brand':
    case 'exterior_primer_brand':
      return ['Kilz', 'Zinsser', 'Sherwin-Williams'];
    case 'interior_wall_brand':
    case 'exterior_wall_brand':
      return ['Sherwin-Williams', 'Benjamin Moore', 'Behr'];
    case 'interior_ceiling_brand':
      return ['Benjamin Moore', 'Sherwin-Williams', 'Behr'];
    case 'interior_trim_brand':
    case 'exterior_trim_brand':
      return ['Benjamin Moore', 'Sherwin-Williams', 'PPG'];
      
    // Product detail suggestions
    case 'interior_primer_details':
      return ['Bulls Eye 123, $28, 400', 'Premium Primer, $25, 380', 'ProBlock, $32, 350'];
    case 'interior_wall_details':
      return ['ProClassic, $58, 350', 'Regal Select, $65, 400', 'Premium Plus, $45, 380'];
    case 'interior_ceiling_details':
      return ['Ceiling Paint, $42, 400', 'ProMar 200, $38, 380', 'Premium Plus, $35, 400'];
    case 'interior_trim_details':
      return ['Advance, $68, 300', 'ProClassic, $65, 320', 'Break-Through, $72, 280'];
    case 'exterior_primer_details':
      return ['Cover Stain, $38, 350', 'Adhesion Primer, $35, 380', 'Fresh Start, $42, 320'];
    case 'exterior_wall_details':
      return ['Duration, $78, 350', 'Aura Exterior, $85, 400', 'Marquee, $65, 380'];
    case 'exterior_trim_details':
      return ['Advance Exterior, $82, 300', 'ProClassic, $75, 320', 'Manor Hall, $70, 340'];
      
    // Labor rate suggestions
    case 'labor_wall_rate':
      return ['$1.50', '$1.75', '$2.00'];
    case 'labor_ceiling_rate':
      return ['$1.25', '$1.50', '$1.75'];
    case 'labor_primer_rate':
      return ['$0.45', '$0.55', '$0.65'];
    case 'labor_door_rate':
      return ['$125', '$150', '$175'];
    case 'labor_window_rate':
      return ['$75', '$100', '$125'];
    case 'markup_percentage':
      return ['35%', '45%', '55%'];
      
    default:
      return [];
  }
}

async function saveSetupData(companyId: number, setupData: any) {
  const db = getDatabase();
  
  try {
    // Save company preferences
    const preferencesStmt = db.prepare(`
      INSERT INTO company_preferences (company_id, preference_key, preference_value)
      VALUES (?, ?, ?)
      ON CONFLICT(company_id, preference_key) DO UPDATE SET preference_value = excluded.preference_value
    `);
    
    preferencesStmt.run(companyId, 'business_name', setupData.businessName);
    preferencesStmt.run(companyId, 'owner_name', setupData.ownerName);
    preferencesStmt.run(companyId, 'business_address', setupData.businessAddress);
    preferencesStmt.run(companyId, 'markup_percentage', setupData.markupPercentage);
    preferencesStmt.run(companyId, 'labor_rates', JSON.stringify(setupData.laborRates));
    preferencesStmt.run(companyId, 'setup_completed', '1');
    
    // Save paint products
    const productStmt = db.prepare(`
      INSERT INTO paint_products (
        company_id, project_type, product_category, supplier, 
        product_name, cost_per_gallon, spread_rate, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Interior products
    if (setupData.interiorPrimer?.productName) {
      productStmt.run(
        companyId, 'interior', 'primer', setupData.interiorPrimer.supplier,
        setupData.interiorPrimer.productName, setupData.interiorPrimer.costPerGallon,
        setupData.interiorPrimer.spreadRate, 1
      );
    }
    
    if (setupData.interiorWallPaint?.productName) {
      productStmt.run(
        companyId, 'interior', 'wall_paint', setupData.interiorWallPaint.supplier,
        setupData.interiorWallPaint.productName, setupData.interiorWallPaint.costPerGallon,
        setupData.interiorWallPaint.spreadRate, 1
      );
    }
    
    if (setupData.interiorCeilingPaint?.productName) {
      productStmt.run(
        companyId, 'interior', 'ceiling_paint', setupData.interiorCeilingPaint.supplier,
        setupData.interiorCeilingPaint.productName, setupData.interiorCeilingPaint.costPerGallon,
        setupData.interiorCeilingPaint.spreadRate, 1
      );
    }
    
    if (setupData.interiorTrimPaint?.productName) {
      productStmt.run(
        companyId, 'interior', 'trim_paint', setupData.interiorTrimPaint.supplier,
        setupData.interiorTrimPaint.productName, setupData.interiorTrimPaint.costPerGallon,
        setupData.interiorTrimPaint.spreadRate, 1
      );
    }
    
    // Exterior products
    if (setupData.exteriorPrimer?.productName) {
      productStmt.run(
        companyId, 'exterior', 'primer', setupData.exteriorPrimer.supplier,
        setupData.exteriorPrimer.productName, setupData.exteriorPrimer.costPerGallon,
        setupData.exteriorPrimer.spreadRate, 1
      );
    }
    
    if (setupData.exteriorWallPaint?.productName) {
      productStmt.run(
        companyId, 'exterior', 'wall_paint', setupData.exteriorWallPaint.supplier,
        setupData.exteriorWallPaint.productName, setupData.exteriorWallPaint.costPerGallon,
        setupData.exteriorWallPaint.spreadRate, 1
      );
    }
    
    if (setupData.exteriorTrimPaint?.productName) {
      productStmt.run(
        companyId, 'exterior', 'trim_paint', setupData.exteriorTrimPaint.supplier,
        setupData.exteriorTrimPaint.productName, setupData.exteriorTrimPaint.costPerGallon,
        setupData.exteriorTrimPaint.spreadRate, 1
      );
    }
    
  } catch (error) {
    console.error('Error saving setup data:', error);
    throw error;
  }
}