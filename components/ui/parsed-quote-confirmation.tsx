"use client";

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { CheckCircle, AlertTriangle, Edit2, Calculator } from 'lucide-react';
import { Input } from './input';

interface ParsedQuoteData {
  customer_name?: string;
  property_address?: string;
  ceiling_included: boolean;
  doors_included: boolean;
  trim_included: boolean;
  windows_included: boolean;
  primer_included: boolean;
  linear_feet?: number;
  wall_height_ft?: number;
  walls_sqft?: number;
  ceilings_sqft?: number;
  trim_sqft?: number;
  doors_count?: number;
  windows_count?: number;
  paint_brand?: string;
  paint_product?: string;
  paint_sheen?: string;
  spread_rate_sqft_per_gallon?: number;
  paint_cost_per_gallon?: number;
  primer_cost_per_sqft?: number;
  labor_cost_per_sqft?: number;
  markup_percent?: number;
  calculated_wall_area_sqft?: number;
  project_type: 'interior' | 'exterior' | 'both';
  project_scope_notes: string;
  confidence_score: number;
  missing_fields: string[];
  assumptions_made: string[];
}

interface ParsedQuoteConfirmationProps {
  parsedData: ParsedQuoteData;
  canCalculate: boolean;
  quoteCalculation?: any;
  onFieldUpdate: (field: string, value: any) => void;
  onConfirm: () => void;
  onRequestClarification: (questions: string[]) => void;
  clarificationQuestions: string[];
}

export function ParsedQuoteConfirmation({
  parsedData,
  canCalculate,
  quoteCalculation,
  onFieldUpdate,
  onConfirm,
  onRequestClarification,
  clarificationQuestions
}: ParsedQuoteConfirmationProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setEditValue(String(currentValue || ''));
  };

  const handleSaveEdit = () => {
    if (editingField) {
      const numericFields = ['linear_feet', 'wall_height_ft', 'walls_sqft', 'ceilings_sqft', 'trim_sqft', 'doors_count', 'windows_count', 'spread_rate_sqft_per_gallon', 'paint_cost_per_gallon', 'primer_cost_per_sqft', 'labor_cost_per_sqft', 'markup_percent'];
      
      let value: any = editValue;
      if (numericFields.includes(editingField)) {
        value = parseFloat(editValue) || 0;
      } else if (editingField.includes('_included')) {
        value = editValue.toLowerCase() === 'true';
      }
      
      onFieldUpdate(editingField, value);
      setEditingField(null);
      setEditValue('');
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const renderField = (label: string, field: string, value: any, type: 'text' | 'number' | 'boolean' = 'text') => {
    const isEmpty = value === null || value === undefined || value === '';
    
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="font-medium text-sm text-gray-700">{label}</div>
          {editingField === field ? (
            <div className="flex items-center gap-2 mt-1">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
            </div>
          ) : (
            <div className="text-sm mt-1">
              {isEmpty ? (
                <span className="text-gray-400 italic">Not specified</span>
              ) : type === 'boolean' ? (
                <Badge variant={value ? 'default' : 'secondary'}>
                  {value ? 'Yes' : 'No'}
                </Badge>
              ) : (
                <span className="text-gray-900">{String(value)}</span>
              )}
            </div>
          )}
        </div>
        {editingField !== field && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(field, value)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Confidence Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Extraction Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={getConfidenceColor(parsedData.confidence_score)}>
              {parsedData.confidence_score}% Confidence
            </Badge>
            <span className="text-sm text-gray-600">
              {parsedData.missing_fields.length} fields missing
            </span>
          </div>
          
          {parsedData.assumptions_made.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Assumptions Made:</h4>
              <ul className="list-disc list-inside space-y-1">
                {parsedData.assumptions_made.map((assumption, index) => (
                  <li key={index} className="text-sm text-gray-600">{assumption}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderField('Customer Name', 'customer_name', parsedData.customer_name)}
          {renderField('Property Address', 'property_address', parsedData.property_address)}
        </CardContent>
      </Card>

      {/* Project Scope */}
      <Card>
        <CardHeader>
          <CardTitle>Project Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderField('Project Type', 'project_type', parsedData.project_type)}
          {renderField('Include Ceilings', 'ceiling_included', parsedData.ceiling_included, 'boolean')}
          {renderField('Include Doors', 'doors_included', parsedData.doors_included, 'boolean')}
          {renderField('Include Trim', 'trim_included', parsedData.trim_included, 'boolean')}
          {renderField('Include Windows', 'windows_included', parsedData.windows_included, 'boolean')}
          {renderField('Include Primer', 'primer_included', parsedData.primer_included, 'boolean')}
        </CardContent>
      </Card>

      {/* Measurements */}
      <Card>
        <CardHeader>
          <CardTitle>Measurements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderField('Linear Feet', 'linear_feet', parsedData.linear_feet, 'number')}
          {renderField('Wall Height (ft)', 'wall_height_ft', parsedData.wall_height_ft, 'number')}
          {renderField('Wall Square Feet', 'walls_sqft', parsedData.walls_sqft, 'number')}
          {renderField('Ceiling Square Feet', 'ceilings_sqft', parsedData.ceilings_sqft, 'number')}
          {renderField('Trim Square Feet', 'trim_sqft', parsedData.trim_sqft, 'number')}
          {renderField('Number of Doors', 'doors_count', parsedData.doors_count, 'number')}
          {renderField('Number of Windows', 'windows_count', parsedData.windows_count, 'number')}
          
          {parsedData.calculated_wall_area_sqft && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-medium text-sm text-blue-800">Calculated Wall Area</div>
              <div className="text-sm text-blue-700 mt-1">
                {parsedData.calculated_wall_area_sqft} sq ft 
                {parsedData.linear_feet && parsedData.wall_height_ft && (
                  <span className="ml-2 text-xs">
                    ({parsedData.linear_feet} linear ft × {parsedData.wall_height_ft} ft height)
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paint Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Paint Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderField('Paint Brand', 'paint_brand', parsedData.paint_brand)}
          {renderField('Paint Product', 'paint_product', parsedData.paint_product)}
          {renderField('Paint Sheen', 'paint_sheen', parsedData.paint_sheen)}
          {renderField('Spread Rate (sq ft/gallon)', 'spread_rate_sqft_per_gallon', parsedData.spread_rate_sqft_per_gallon, 'number')}
          {renderField('Cost per Gallon ($)', 'paint_cost_per_gallon', parsedData.paint_cost_per_gallon, 'number')}
          {renderField('Primer Cost per Sq Ft ($)', 'primer_cost_per_sqft', parsedData.primer_cost_per_sqft, 'number')}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderField('Labor Cost per Sq Ft ($)', 'labor_cost_per_sqft', parsedData.labor_cost_per_sqft, 'number')}
          {renderField('Markup Percentage (%)', 'markup_percent', parsedData.markup_percent, 'number')}
        </CardContent>
      </Card>

      {/* Quote Calculation */}
      {canCalculate && quoteCalculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Quote Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Paint Needed</div>
                <div className="font-semibold">{quoteCalculation.paint_gallons_needed} gallons</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Materials Cost</div>
                <div className="font-semibold">${quoteCalculation.materials_cost.toFixed(2)}</div>
              </div>
              {quoteCalculation.primer_cost > 0 && (
                <div>
                  <div className="text-sm text-gray-600">Primer Cost</div>
                  <div className="font-semibold">${quoteCalculation.primer_cost.toFixed(2)}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600">Labor Cost</div>
                <div className="font-semibold">${quoteCalculation.labor_cost.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Markup</div>
                <div className="font-semibold">${quoteCalculation.markup_amount.toFixed(2)}</div>
              </div>
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Final Quote</span>
                <span className="font-bold text-xl text-green-600">
                  ${quoteCalculation.final_quote.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missing Fields Warning */}
      {parsedData.missing_fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              Missing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {parsedData.missing_fields.map((field, index) => (
                <Badge key={index} variant="outline" className="mr-2">
                  {field}
                </Badge>
              ))}
            </div>
            {clarificationQuestions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Clarification Questions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {clarificationQuestions.map((question, index) => (
                    <li key={index} className="text-sm text-gray-600">{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {canCalculate ? (
          <Button onClick={onConfirm} className="flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm & Generate Quote
          </Button>
        ) : (
          <Button onClick={() => onRequestClarification(clarificationQuestions)} className="flex-1">
            Request Missing Information
          </Button>
        )}
      </div>
    </div>
  );
}