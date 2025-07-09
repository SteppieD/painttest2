import { NextRequest, NextResponse } from 'next/server';
import { getSmartDefaults } from '@/lib/smart-defaults';

export async function POST(request: NextRequest) {
  try {
    const { companyId, context } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get smart suggestions based on context
    const smartDefaults = await getSmartDefaults(companyId, context);
    
    // Convert to suggestion format
    const suggestions = [];

    // Dimension suggestions
    if (context.roomName && !context.currentDimensions) {
      suggestions.push({
        type: 'dimension',
        title: `Typical ${context.roomName} Size`,
        description: `${smartDefaults.dimensions.length}' × ${smartDefaults.dimensions.width}' × ${smartDefaults.dimensions.height}'`,
        value: smartDefaults.dimensions,
        confidence: 'high',
        reasoning: 'Based on industry standards for this room type',
        applyable: true
      });
    }

    // Surface suggestions
    if (context.roomName && (!context.selectedSurfaces || context.selectedSurfaces.length === 0)) {
      suggestions.push({
        type: 'surface',
        title: 'Common Surfaces',
        description: smartDefaults.surfaces.join(', '),
        value: smartDefaults.surfaces,
        confidence: 'high',
        reasoning: `Most ${context.roomName}s include these surfaces`,
        applyable: true
      });
    }

    // Paint suggestions
    if (smartDefaults.paint) {
      suggestions.push({
        type: 'paint',
        title: 'Recommended Paint',
        description: `${(smartDefaults.paint as any).brand || 'Professional'} - Based on your history`,
        value: smartDefaults.paint,
        confidence: 'medium',
        reasoning: 'Most used paint in your recent quotes',
        applyable: true
      });
    }

    // Pricing suggestions
    if (smartDefaults.pricing.laborPerSqFt > 0) {
      suggestions.push({
        type: 'pricing',
        title: 'Labor Rate',
        description: `$${smartDefaults.pricing.laborPerSqFt.toFixed(2)} per sq ft`,
        value: smartDefaults.pricing.laborPerSqFt,
        confidence: 'high',
        reasoning: 'Based on your average pricing from recent quotes',
        applyable: false
      });
    }

    // Time estimation
    if (smartDefaults.timeEstimate > 0) {
      suggestions.push({
        type: 'time',
        title: 'Time Estimate',
        description: `${smartDefaults.timeEstimate} day${smartDefaults.timeEstimate > 1 ? 's' : ''}`,
        value: smartDefaults.timeEstimate,
        confidence: 'medium',
        reasoning: 'Based on similar projects you\'ve completed',
        applyable: false
      });
    }

    // Add contextual suggestions based on project type
    if (context.projectType?.includes('kitchen')) {
      suggestions.push({
        type: 'surface',
        title: 'Kitchen Specialization',
        description: 'Consider adding cabinets and trim for kitchens',
        value: ['walls', 'ceilings', 'cabinets', 'trim'],
        confidence: 'medium',
        reasoning: 'Kitchen projects often include cabinet painting',
        applyable: true
      });
    }

    if (context.projectType?.includes('bathroom')) {
      suggestions.push({
        type: 'paint',
        title: 'Moisture-Resistant Paint',
        description: 'Use bathroom-specific paint for moisture protection',
        value: { category: 'bathroom', type: 'moisture-resistant' },
        confidence: 'high',
        reasoning: 'Bathrooms require moisture-resistant formulations',
        applyable: true
      });
    }

    return NextResponse.json({
      success: true,
      suggestions,
      context: {
        totalSuggestions: suggestions.length,
        highConfidence: suggestions.filter(s => s.confidence === 'high').length,
        applyable: suggestions.filter(s => s.applyable).length
      }
    });

  } catch (error) {
    console.error('Error generating smart suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}