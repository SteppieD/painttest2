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
    <div>
      {/* Header */}
      <div>
        <h2>Choose Room Templates</h2>
        <p>Select from our most popular room configurations to speed up your quote</p>
      </div>

      {/* Search and Filters */}
      <div>
        <Input
          placeholder="Search room types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
         
        />

        <div>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
             
            >
              <category.icon />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Room Templates Grid */}
      <div>
        {filteredTemplates.map((template) => {
          const popularityBadge = getPopularityBadge(template.popularity);
          const selected = isSelected(template);

          return (
            <Card 
              key={template.id}
             
              onClick={() => onTemplateSelect(template)}
            >
              <CardContent>
                <div>
                  {/* Header */}
                  <div>
                    <div>
                      <template.icon />
                    </div>
                    <div>
                      <h3>{template.name}</h3>
                      <p>{template.description}</p>
                    </div>
                    {selected && (
                      <div>
                        <Check />
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div>
                    {popularityBadge && (
                      <Badge>
                        {popularityBadge.label}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {template.surfaces.length} surfaces
                    </Badge>
                  </div>

                  {/* Dimensions */}
                  <div>
                    <div>
                      <Ruler />
                      <span>Dimensions</span>
                    </div>
                    <div>
                      {template.dimensions.length}' × {template.dimensions.width}' × {template.dimensions.height}'
                    </div>
                    <div>
                      {template.estimatedArea} sq ft • ${getCostPerSqFt(template)}/sq ft
                    </div>
                  </div>

                  {/* Surfaces */}
                  <div>
                    <p>Includes:</p>
                    <div>
                      {template.surfaces.map((surface) => (
                        <Badge key={surface} variant="secondary">
                          {surface}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Cost */}
                  <div>
                    <span>Estimated Cost</span>
                    <span>
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
      <Card>
        <CardContent>
          <div>
            <div>
              <Plus />
            </div>
            <div>
              <h3>Custom Room</h3>
              <p>Need different dimensions or surfaces? Create a custom room.</p>
            </div>
            
            {/* Quick Custom Form */}
            <div>
              <div>
                <div>
                  <label>Length (ft)</label>
                  <Input
                    type="number"
                    value={customDimensions.length}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, length: Number(e.target.value) }))}
                   
                  />
                </div>
                <div>
                  <label>Width (ft)</label>
                  <Input
                    type="number"
                    value={customDimensions.width}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                   
                  />
                </div>
                <div>
                  <label>Height (ft)</label>
                  <Input
                    type="number"
                    value={customDimensions.height}
                    onChange={(e) => setCustomDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                   
                  />
                </div>
              </div>
              
              <Button 
                onClick={onCustomRoom}
               
              >
                <Edit />
                Create Custom Room
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedTemplates.length > 0 && (
        <div>
          <h4>
            Selected Rooms ({selectedTemplates.length})
          </h4>
          <div>
            {selectedTemplates.map((template) => (
              <div key={template.id}>
                <template.icon />
                <span>{template.name}</span>
                <Badge variant="outline">
                  ${template.estimatedCost.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
          
          <div>
            <div>
              <span>Total Estimated Cost:</span>
              <span>
                ${selectedTemplates.reduce((sum, t) => sum + t.estimatedCost, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}