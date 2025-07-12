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
    <Card>
      <CardHeader>
        <CardTitle>
          <Calculator />
          Quote Progress
          <Badge variant="secondary">
            {quoteData.completion_percentage || 0}%
          </Badge>
        </CardTitle>
        <div>
          <div 
           
           %` }}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Customer Information Section */}
        <div>
          <button
            onClick={() => toggleSection('customer')}
           
          >
            {getFieldStatus(quoteData.customer_name) === 'complete' ? (
              <CheckCircle />
            ) : (
              <Circle />
            )}
            Customer Information
          </button>
          {expandedSections.includes('customer') && (
            <div>
              <div>
                <span>Name:</span>
                <span>
                  {quoteData.customer_name || 'Pending'}
                </span>
              </div>
              <div>
                <span>Address:</span>
                <span>
                  {quoteData.address ? quoteData.address.substring(0, 20) + '...' : 'Pending'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Project Details Section */}
        <div>
          <button
            onClick={() => toggleSection('project')}
           
          >
            {getFieldStatus(quoteData.total_sqft) === 'complete' ? (
              <CheckCircle />
            ) : (
              <Circle />
            )}
            Project Details
          </button>
          {expandedSections.includes('project') && (
            <div>
              <div>
                <span>Type:</span>
                <span>
                  {quoteData.project_type || 'Pending'}
                </span>
              </div>
              <div>
                <span>Linear Feet:</span>
                <span>
                  {quoteData.linear_feet || 'Pending'}
                </span>
              </div>
              <div>
                <span>Height:</span>
                <span>
                  {quoteData.ceiling_height ? `${quoteData.ceiling_height} ft` : 'Pending'}
                </span>
              </div>
              <div>
                <span>Total Area:</span>
                <span>
                  {quoteData.total_sqft ? `${quoteData.total_sqft.toLocaleString()} sq ft` : 'Calculating...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Paint Specifications Section */}
        <div>
          <button
            onClick={() => toggleSection('paint')}
           
          >
            {getFieldStatus(quoteData.gallons_needed) === 'complete' ? (
              <CheckCircle />
            ) : (
              <Circle />
            )}
            Paint & Materials
          </button>
          {expandedSections.includes('paint') && (
            <div>
              <div>
                <span>Brand:</span>
                <span>
                  {quoteData.paint_brand || 'Pending'}
                </span>
              </div>
              <div>
                <span>Cost/Gallon:</span>
                <span>
                  {quoteData.cost_per_gallon ? `$${quoteData.cost_per_gallon}` : 'Pending'}
                </span>
              </div>
              <div>
                <span>Gallons Needed:</span>
                <span>
                  {quoteData.gallons_needed || 'Calculating...'}
                </span>
              </div>
              <div>
                <span>Material Cost:</span>
                <span>
                  {quoteData.total_material_cost ? `$${quoteData.total_material_cost.toLocaleString()}` : 'Calculating...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Labor & Pricing Section */}
        <div>
          <button
            onClick={() => toggleSection('pricing')}
           
          >
            {getFieldStatus(quoteData.final_quote_amount) === 'complete' ? (
              <CheckCircle />
            ) : (
              <Circle />
            )}
            Labor & Pricing
          </button>
          {expandedSections.includes('pricing') && (
            <div>
              <div>
                <span>Labor Rate:</span>
                <span>
                  {quoteData.labor_cost_per_sqft ? `$${quoteData.labor_cost_per_sqft}/sq ft` : 'Pending'}
                </span>
              </div>
              <div>
                <span>Labor Cost:</span>
                <span>
                  {quoteData.total_labor_cost ? `$${quoteData.total_labor_cost.toLocaleString()}` : 'Calculating...'}
                </span>
              </div>
              <div>
                <span>Markup:</span>
                <span>
                  {quoteData.markup_percentage ? `${quoteData.markup_percentage}%` : 'Pending'}
                </span>
              </div>
              <div>
                <span>Final Quote:</span>
                <span>
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