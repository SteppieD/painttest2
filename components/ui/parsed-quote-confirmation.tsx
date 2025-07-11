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
      <div>
        <div>
          <div>{label}</div>
          {editingField === field ? (
            <div>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
               
              />
              <Button size="sm" onClick={handleSaveEdit}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>Cancel</Button>
            </div>
          ) : (
            <div>
              {isEmpty ? (
                <span>Not specified</span>
              ) : type === 'boolean' ? (
                <Badge variant={value ? 'default' : 'secondary'}>
                  {value ? 'Yes' : 'No'}
                </Badge>
              ) : (
                <span>{String(value)}</span>
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
            <Edit2 />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Confidence Score */}
      <Card>
        <CardHeader>
          <CardTitle>
            <CheckCircle />
            Extraction Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Badge>
              {parsedData.confidence_score}% Confidence
            </Badge>
            <span>
              {parsedData.missing_fields.length} fields missing
            </span>
          </div>
          
          {parsedData.assumptions_made.length > 0 && (
            <div>
              <h4>Assumptions Made:</h4>
              <ul>
                {parsedData.assumptions_made.map((assumption, index) => (
                  <li key={index}>{assumption}</li>
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
        <CardContent>
          {renderField('Customer Name', 'customer_name', parsedData.customer_name)}
          {renderField('Property Address', 'property_address', parsedData.property_address)}
        </CardContent>
      </Card>

      {/* Project Scope */}
      <Card>
        <CardHeader>
          <CardTitle>Project Scope</CardTitle>
        </CardHeader>
        <CardContent>
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
        <CardContent>
          {renderField('Linear Feet', 'linear_feet', parsedData.linear_feet, 'number')}
          {renderField('Wall Height (ft)', 'wall_height_ft', parsedData.wall_height_ft, 'number')}
          {renderField('Wall Square Feet', 'walls_sqft', parsedData.walls_sqft, 'number')}
          {renderField('Ceiling Square Feet', 'ceilings_sqft', parsedData.ceilings_sqft, 'number')}
          {renderField('Trim Square Feet', 'trim_sqft', parsedData.trim_sqft, 'number')}
          {renderField('Number of Doors', 'doors_count', parsedData.doors_count, 'number')}
          {renderField('Number of Windows', 'windows_count', parsedData.windows_count, 'number')}
          
          {parsedData.calculated_wall_area_sqft && (
            <div>
              <div>Calculated Wall Area</div>
              <div>
                {parsedData.calculated_wall_area_sqft} sq ft 
                {parsedData.linear_feet && parsedData.wall_height_ft && (
                  <span>
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
        <CardContent>
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
        <CardContent>
          {renderField('Labor Cost per Sq Ft ($)', 'labor_cost_per_sqft', parsedData.labor_cost_per_sqft, 'number')}
          {renderField('Markup Percentage (%)', 'markup_percent', parsedData.markup_percent, 'number')}
        </CardContent>
      </Card>

      {/* Quote Calculation */}
      {canCalculate && quoteCalculation && (
        <Card>
          <CardHeader>
            <CardTitle>
              <Calculator />
              Quote Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>Paint Needed</div>
                <div>{quoteCalculation.paint_gallons_needed} gallons</div>
              </div>
              <div>
                <div>Materials Cost</div>
                <div>${quoteCalculation.materials_cost.toFixed(2)}</div>
              </div>
              {quoteCalculation.primer_cost > 0 && (
                <div>
                  <div>Primer Cost</div>
                  <div>${quoteCalculation.primer_cost.toFixed(2)}</div>
                </div>
              )}
              <div>
                <div>Labor Cost</div>
                <div>${quoteCalculation.labor_cost.toFixed(2)}</div>
              </div>
              <div>
                <div>Markup</div>
                <div>${quoteCalculation.markup_amount.toFixed(2)}</div>
              </div>
            </div>
            <div>
              <div>
                <span>Final Quote</span>
                <span>
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
            <CardTitle>
              <AlertTriangle />
              Missing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {parsedData.missing_fields.map((field, index) => (
                <Badge key={index} variant="outline">
                  {field}
                </Badge>
              ))}
            </div>
            {clarificationQuestions.length > 0 && (
              <div>
                <h4>Clarification Questions:</h4>
                <ul>
                  {clarificationQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div>
        {canCalculate ? (
          <Button onClick={onConfirm}>
            <CheckCircle />
            Confirm & Generate Quote
          </Button>
        ) : (
          <Button onClick={() => onRequestClarification(clarificationQuestions)}>
            Request Missing Information
          </Button>
        )}
      </div>
    </div>
  );
}