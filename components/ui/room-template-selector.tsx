"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { 
  Home, 
  Bed, 
  Bath, 
  ChefHat, 
  Sofa, 
  Baby, 
  Briefcase,
  Car,
  Plus,
  Edit,
  Check,
  X,
  Ruler
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomTemplate {
  id: string;
  name: string;
  category: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'other';
  icon: any;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  surfaces: string[];
  commonPaint: string;
  estimatedArea: number;
  estimatedCost: number;
  popularity: number; // 1-100
  description: string;
}

interface RoomTemplateSelectorProps {
  onTemplateSelect: (template: RoomTemplate) => void;
  onCustomRoom: () => void;
  selectedTemplates?: RoomTemplate[];
  className?: string;
  allowMultiple?: boolean;
}

const ROOM_TEMPLATES: RoomTemplate[] = [
  // Bedrooms
  {
    id: 'master-bedroom',
    name: 'Master Bedroom',
    category: 'bedroom',
    icon: Bed,
    dimensions: { length: 14, width: 16, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'ProClassic Interior',
    estimatedArea: 540,
    estimatedCost: 1850,
    popularity: 95,
    description: 'Large bedroom with walk-in closet space'
  },
  {
    id: 'guest-bedroom',
    name: 'Guest Bedroom',
    category: 'bedroom',
    icon: Bed,
    dimensions: { length: 11, width: 12, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'ProClassic Interior',
    estimatedArea: 414,
    estimatedCost: 1400,
    popularity: 85,
    description: 'Standard secondary bedroom'
  },
  {
    id: 'kids-bedroom',
    name: 'Kids Bedroom',
    category: 'bedroom',
    icon: Baby,
    dimensions: { length: 10, width: 11, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'ProClassic Interior',
    estimatedArea: 378,
    estimatedCost: 1250,
    popularity: 75,
    description: 'Child-friendly room with durable paint'
  },

  // Bathrooms
  {
    id: 'master-bathroom',
    name: 'Master Bathroom',
    category: 'bathroom',
    icon: Bath,
    dimensions: { length: 10, width: 12, height: 9 },
    surfaces: ['walls', 'ceilings', 'trim'],
    commonPaint: 'Bath Paint (Moisture Resistant)',
    estimatedArea: 396,
    estimatedCost: 1600,
    popularity: 90,
    description: 'Large bathroom with moisture-resistant paint'
  },
  {
    id: 'guest-bathroom',
    name: 'Guest Bathroom',
    category: 'bathroom',
    icon: Bath,
    dimensions: { length: 6, width: 8, height: 9 },
    surfaces: ['walls', 'ceilings', 'trim'],
    commonPaint: 'Bath Paint (Moisture Resistant)',
    estimatedArea: 252,
    estimatedCost: 950,
    popularity: 80,
    description: 'Powder room or half bath'
  },

  // Kitchen
  {
    id: 'standard-kitchen',
    name: 'Standard Kitchen',
    category: 'kitchen',
    icon: ChefHat,
    dimensions: { length: 12, width: 16, height: 9 },
    surfaces: ['walls', 'ceilings', 'trim'],
    commonPaint: 'Advance Waterborne Alkyd',
    estimatedArea: 504,
    estimatedCost: 2200,
    popularity: 85,
    description: 'Full kitchen with cabinets and appliances'
  },
  {
    id: 'galley-kitchen',
    name: 'Galley Kitchen',
    category: 'kitchen',
    icon: ChefHat,
    dimensions: { length: 8, width: 12, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'Advance Waterborne Alkyd',
    estimatedArea: 360,
    estimatedCost: 1500,
    popularity: 65,
    description: 'Narrow kitchen layout'
  },

  // Living Areas
  {
    id: 'living-room',
    name: 'Living Room',
    category: 'living',
    icon: Sofa,
    dimensions: { length: 16, width: 20, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'ProClassic Interior',
    estimatedArea: 648,
    estimatedCost: 2400,
    popularity: 90,
    description: 'Main family gathering space'
  },
  {
    id: 'family-room',
    name: 'Family Room',
    category: 'living',
    icon: Sofa,
    dimensions: { length: 14, width: 18, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'ProClassic Interior',
    estimatedArea: 576,
    estimatedCost: 2100,
    popularity: 75,
    description: 'Casual family entertainment area'
  },

  // Other
  {
    id: 'home-office',
    name: 'Home Office',
    category: 'other',
    icon: Briefcase,
    dimensions: { length: 10, width: 12, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'ProClassic Interior',
    estimatedArea: 396,
    estimatedCost: 1350,
    popularity: 70,
    description: 'Professional workspace'
  },
  {
    id: 'hallway',
    name: 'Hallway',
    category: 'other',
    icon: Home,
    dimensions: { length: 20, width: 4, height: 9 },
    surfaces: ['walls', 'ceilings'],
    commonPaint: 'ProClassic Interior',
    estimatedArea: 432,
    estimatedCost: 850,
    popularity: 60,
    description: 'Long connecting corridor'
  }
];

export function RoomTemplateSelector({ 
  onTemplateSelect, 
  onCustomRoom, 
  selectedTemplates = [],
  allowMultiple = false,
  className 
}: RoomTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customDimensions, setCustomDimensions] = useState({ length: 12, width: 14, height: 9 });

  const categories = [
    { id: 'all', label: 'All Rooms', icon: Home },
    { id: 'bedroom', label: 'Bedrooms', icon: Bed },
    { id: 'bathroom', label: 'Bathrooms', icon: Bath },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
    { id: 'living', label: 'Living Areas', icon: Sofa },
    { id: 'other', label: 'Other', icon: Briefcase }
  ];

  const filteredTemplates = ROOM_TEMPLATES
    .filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => b.popularity - a.popularity);

  const isSelected = (template: RoomTemplate) => {
    return selectedTemplates.some(selected => selected.id === template.id);
  };

  const getPopularityBadge = (popularity: number) => {
    if (popularity >= 90) return { label: 'Most Popular', color: 'bg-green-100 text-green-700' };
    if (popularity >= 80) return { label: 'Popular', color: 'bg-blue-100 text-blue-700' };
    if (popularity >= 70) return { label: 'Common', color: 'bg-yellow-100 text-yellow-700' };
    return null;
  };

  const getCostPerSqFt = (template: RoomTemplate) => {
    return (template.estimatedCost / template.estimatedArea).toFixed(2);
  };

  return (
    <div className={cn("design-container max-w-6xl mx-auto", className)}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="design-heading-2">Choose Room Templates</h2>
        <p className="design-body">Select from our most popular room configurations to speed up your quote</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Search room types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="design-input max-w-md mx-auto"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "design-button design-button-small",
                selectedCategory === category.id 
                  ? "design-button-primary" 
                  : "design-button-secondary"
              )}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Room Templates Grid */}
      <div className="design-grid design-grid-3 mb-8">
        {filteredTemplates.map((template) => {
          const popularityBadge = getPopularityBadge(template.popularity);
          const selected = isSelected(template);

          return (
            <Card 
              key={template.id}
              className={cn(
                "design-card design-card-interactive cursor-pointer transition-all duration-200",
                selected 
                  ? "ring-2 ring-blue-600 bg-blue-50 border-blue-300" 
                  : "hover:border-blue-300 hover:shadow-lg"
              )}
              onClick={() => onTemplateSelect(template)}
            >
              <CardContent className="p-6">
                <div className="design-stack">
                  {/* Header */}
                  <div className="design-inline">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <template.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                    {selected && (
                      <div className="p-1 bg-blue-600 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="design-inline">
                    {popularityBadge && (
                      <Badge className={cn("text-xs", popularityBadge.color)}>
                        {popularityBadge.label}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {template.surfaces.length} surfaces
                    </Badge>
                  </div>

                  {/* Dimensions */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="design-inline mb-2">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Dimensions</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {template.dimensions.length}' × {template.dimensions.width}' × {template.dimensions.height}'
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {template.estimatedArea} sq ft • ${getCostPerSqFt(template)}/sq ft
                    </div>
                  </div>

                  {/* Surfaces */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.surfaces.map((surface) => (
                        <Badge key={surface} variant="secondary" className="text-xs">
                          {surface}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="design-inline pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Estimated Cost</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${template.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Room Option */}
      <Card className="design-card border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="design-stack items-center">
            <div className="p-4 bg-gray-100 rounded-full">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="design-heading-3">Custom Room</h3>
              <p className="design-body">Need different dimensions or surfaces? Create a custom room.</p>
            </div>
            
            {/* Quick Custom Form */}
            <div className="w-full max-w-md space-y-4">
              <div className="design-grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Length (ft)</label>
                  <Input
                    type="number"
                    value={customDimensions.length}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, length: Number(e.target.value) }))}
                    className="design-input design-input-small text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Width (ft)</label>
                  <Input
                    type="number"
                    value={customDimensions.width}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                    className="design-input design-input-small text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Height (ft)</label>
                  <Input
                    type="number"
                    value={customDimensions.height}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="design-input design-input-small text-center"
                  />
                </div>
              </div>
              
              <Button 
                onClick={onCustomRoom}
                className="design-button design-button-secondary w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Create Custom Room
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedTemplates.length > 0 && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-3">
            Selected Rooms ({selectedTemplates.length})
          </h4>
          <div className="space-y-2">
            {selectedTemplates.map((template) => (
              <div key={template.id} className="design-inline text-sm">
                <template.icon className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{template.name}</span>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  ${template.estimatedCost.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="design-inline">
              <span className="font-semibold text-blue-900">Total Estimated Cost:</span>
              <span className="text-xl font-bold text-green-600">
                ${selectedTemplates.reduce((sum, t) => sum + t.estimatedCost, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}