"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { CheckCircle, Circle, Calculator } from "lucide-react";

export interface ProgressiveQuoteData {
  // Customer Information
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  
  // Project Details
  project_type?: 'interior' | 'exterior' | 'both';
  surfaces?: string[];
  linear_feet?: number;
  ceiling_height?: number;
  total_sqft?: number;
  room_count?: number;
  
  // Paint Specifications
  paint_brand?: string;
  paint_product?: string;
  paint_type?: string; // eggshell, satin, etc.
  cost_per_gallon?: number;
  coverage_per_gallon?: number;
  gallons_needed?: number;
  needs_primer?: boolean;
  
  // Labor & Costs
  labor_cost_per_sqft?: number;
  total_labor_cost?: number;
  total_material_cost?: number;
  markup_percentage?: number;
  subtotal?: number;
  final_quote_amount?: number;
  
  // Meta
  timeline?: string;
  notes?: string;
  completion_percentage?: number;
}

interface ProgressiveQuoteFormProps {
  quoteData: ProgressiveQuoteData;
  onQuoteUpdate: (data: ProgressiveQuoteData) => void;
  isVisible?: boolean;
}

export function ProgressiveQuoteForm({ 
  quoteData, 
  onQuoteUpdate, 
  isVisible = true 
}: ProgressiveQuoteFormProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['customer']);

  // Auto-calculate derived values when base values change
  useEffect(() => {
    const calculations = calculateQuoteValues(quoteData);
    if (JSON.stringify(calculations) !== JSON.stringify(quoteData)) {
      onQuoteUpdate(calculations);
    }
  }, [
    quoteData.linear_feet,
    quoteData.ceiling_height, 
    quoteData.cost_per_gallon,
    quoteData.coverage_per_gallon,
    quoteData.labor_cost_per_sqft,
    quoteData.markup_percentage
  ]);

  const calculateQuoteValues = (data: ProgressiveQuoteData): ProgressiveQuoteData => {
    const calculated = { ...data };
    
    // Calculate total square footage
    if (data.linear_feet && data.ceiling_height) {
      calculated.total_sqft = data.linear_feet * data.ceiling_height;
    }
    
    // Calculate gallons needed
    if (calculated.total_sqft && data.coverage_per_gallon) {
      calculated.gallons_needed = Math.ceil(calculated.total_sqft / data.coverage_per_gallon);
    }
    
    // Calculate material cost
    if (calculated.gallons_needed && data.cost_per_gallon) {
      calculated.total_material_cost = calculated.gallons_needed * data.cost_per_gallon;
    }
    
    // Calculate labor cost
    if (calculated.total_sqft && data.labor_cost_per_sqft) {
      calculated.total_labor_cost = calculated.total_sqft * data.labor_cost_per_sqft;
    }
    
    // Calculate subtotal
    if (calculated.total_material_cost && calculated.total_labor_cost) {
      calculated.subtotal = calculated.total_material_cost + calculated.total_labor_cost;
    }
    
    // Calculate final amount with markup
    if (calculated.subtotal && data.markup_percentage) {
      const markupMultiplier = 1 + (data.markup_percentage / 100);
      calculated.final_quote_amount = Math.round(calculated.subtotal * markupMultiplier);
    }
    
    // Calculate completion percentage
    const totalFields = 15; // Total number of key fields
    const filledFields = Object.values(calculated).filter(v => v !== undefined && v !== null && v !== '').length;
    calculated.completion_percentage = Math.round((filledFields / totalFields) * 100);
    
    return calculated;
  };

  const getFieldStatus = (value: any): 'complete' | 'partial' | 'missing' => {
    if (value === undefined || value === null || value === '') return 'missing';
    if (typeof value === 'string' && value.length > 0) return 'complete';
    if (typeof value === 'number' && value > 0) return 'complete';
    if (Array.isArray(value) && value.length > 0) return 'complete';
    return 'partial';
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-blue-600" />
          Quote Progress
          <Badge variant="secondary" className="ml-auto">
            {quoteData.completion_percentage || 0}%
          </Badge>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${quoteData.completion_percentage || 0}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Customer Information Section */}
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleSection('customer')}
            className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {getFieldStatus(quoteData.customer_name) === 'complete' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
            Customer Information
          </button>
          {expandedSections.includes('customer') && (
            <div className="mt-2 ml-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className={quoteData.customer_name ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.customer_name || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Address:</span>
                <span className={quoteData.address ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.address ? quoteData.address.substring(0, 20) + '...' : 'Pending'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Project Details Section */}
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleSection('project')}
            className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {getFieldStatus(quoteData.total_sqft) === 'complete' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
            Project Details
          </button>
          {expandedSections.includes('project') && (
            <div className="mt-2 ml-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className={quoteData.project_type ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.project_type || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Linear Feet:</span>
                <span className={quoteData.linear_feet ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.linear_feet || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Height:</span>
                <span className={quoteData.ceiling_height ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.ceiling_height ? `${quoteData.ceiling_height} ft` : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Area:</span>
                <span className={quoteData.total_sqft ? 'text-blue-600 font-bold' : 'text-gray-400'}>
                  {quoteData.total_sqft ? `${quoteData.total_sqft.toLocaleString()} sq ft` : 'Calculating...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Paint Specifications Section */}
        <div className="border-b border-gray-200 pb-3">
          <button
            onClick={() => toggleSection('paint')}
            className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {getFieldStatus(quoteData.gallons_needed) === 'complete' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
            Paint & Materials
          </button>
          {expandedSections.includes('paint') && (
            <div className="mt-2 ml-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Brand:</span>
                <span className={quoteData.paint_brand ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.paint_brand || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cost/Gallon:</span>
                <span className={quoteData.cost_per_gallon ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.cost_per_gallon ? `$${quoteData.cost_per_gallon}` : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Gallons Needed:</span>
                <span className={quoteData.gallons_needed ? 'text-blue-600 font-bold' : 'text-gray-400'}>
                  {quoteData.gallons_needed || 'Calculating...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Material Cost:</span>
                <span className={quoteData.total_material_cost ? 'text-blue-600 font-bold' : 'text-gray-400'}>
                  {quoteData.total_material_cost ? `$${quoteData.total_material_cost.toLocaleString()}` : 'Calculating...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Labor & Pricing Section */}
        <div className="pb-3">
          <button
            onClick={() => toggleSection('pricing')}
            className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            {getFieldStatus(quoteData.final_quote_amount) === 'complete' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
            Labor & Pricing
          </button>
          {expandedSections.includes('pricing') && (
            <div className="mt-2 ml-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Labor Rate:</span>
                <span className={quoteData.labor_cost_per_sqft ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.labor_cost_per_sqft ? `$${quoteData.labor_cost_per_sqft}/sq ft` : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Labor Cost:</span>
                <span className={quoteData.total_labor_cost ? 'text-blue-600 font-bold' : 'text-gray-400'}>
                  {quoteData.total_labor_cost ? `$${quoteData.total_labor_cost.toLocaleString()}` : 'Calculating...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Markup:</span>
                <span className={quoteData.markup_percentage ? 'text-green-600 font-medium' : 'text-gray-400'}>
                  {quoteData.markup_percentage ? `${quoteData.markup_percentage}%` : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Final Quote:</span>
                <span className={quoteData.final_quote_amount ? 'text-green-600 text-lg' : 'text-gray-400'}>
                  {quoteData.final_quote_amount ? `$${quoteData.final_quote_amount.toLocaleString()}` : 'Calculating...'}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}