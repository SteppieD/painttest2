"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Square, 
  Layers, 
  Home,
  Frame,
  DoorOpen,
  CheckCircle,
  Info,
  ArrowRight
} from "lucide-react";

export interface SurfaceOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  measurementType: 'area' | 'linear' | 'count' | 'rooms';
  category: 'walls' | 'ceilings' | 'trim' | 'items';
  commonWith?: string[]; // Other surfaces commonly painted together
  examples?: string[];
}

// Pre-defined surface options with smart categorization
export const SURFACE_OPTIONS: SurfaceOption[] = [
  // Wall surfaces (area-based)
  {
    id: 'walls',
    name: 'Walls',
    icon: <Square />,
    description: 'Interior or exterior wall surfaces',
    measurementType: 'area',
    category: 'walls',
    commonWith: ['trim', 'doors'],
    examples: ['Living room walls', 'Bedroom walls', 'Kitchen walls']
  },
  {
    id: 'accent_walls',
    name: 'Accent Walls',
    icon: <Square />,
    description: 'Feature walls with special paint or treatment',
    measurementType: 'area',
    category: 'walls',
    commonWith: ['walls'],
    examples: ['Living room accent wall', 'Bedroom feature wall']
  },

  // Ceiling surfaces (room-based)
  {
    id: 'ceilings',
    name: 'Ceilings',
    icon: <Layers />,
    description: 'Ceiling surfaces - requires room count',
    measurementType: 'rooms',
    category: 'ceilings',
    commonWith: ['walls', 'crown_molding'],
    examples: ['Living room ceiling', 'Bedroom ceiling', 'Kitchen ceiling']
  },

  // Trim surfaces (linear-based)
  {
    id: 'baseboards',
    name: 'Baseboards',
    icon: <Frame />,
    description: 'Base trim along floors',
    measurementType: 'linear',
    category: 'trim',
    commonWith: ['walls', 'doors'],
    examples: ['All room baseboards', 'Kitchen baseboards only']
  },
  {
    id: 'crown_molding',
    name: 'Crown Molding',
    icon: <Frame />,
    description: 'Decorative trim at ceiling',
    measurementType: 'linear',
    category: 'trim',
    commonWith: ['ceilings', 'walls'],
    examples: ['Living room crown molding', 'All rooms crown molding']
  },
  {
    id: 'window_trim',
    name: 'Window Trim',
    icon: <Frame />,
    description: 'Trim around windows',
    measurementType: 'linear',
    category: 'trim',
    commonWith: ['walls', 'doors'],
    examples: ['All window trim', 'Living room windows only']
  },
  {
    id: 'door_trim',
    name: 'Door Trim',
    icon: <Frame />,
    description: 'Trim around doors',
    measurementType: 'linear',
    category: 'trim',
    commonWith: ['walls', 'doors'],
    examples: ['All door frames', 'Interior doors only']
  },

  // Item surfaces (count-based)
  {
    id: 'doors',
    name: 'Doors',
    icon: <DoorOpen />,
    description: 'Door faces and panels',
    measurementType: 'count',
    category: 'items',
    commonWith: ['door_trim', 'walls'],
    examples: ['Interior doors', 'Front door', 'Closet doors']
  },
  {
    id: 'windows',
    name: 'Window Frames',
    icon: <Square />,
    description: 'Window frames and sashes',
    measurementType: 'count',
    category: 'items',
    commonWith: ['window_trim', 'walls'],
    examples: ['All window frames', 'Kitchen windows only']
  },
  {
    id: 'cabinets',
    name: 'Cabinets',
    icon: <Square />,
    description: 'Kitchen or bathroom cabinets',
    measurementType: 'count',
    category: 'items',
    commonWith: ['walls'],
    examples: ['Kitchen cabinets', 'Bathroom vanity', 'Built-in shelving']
  }
];

interface SurfaceSelectionButtonProps {
  surface: SurfaceOption;
  isSelected: boolean;
  onToggle: (surfaceId: string) => void;
  isRecommended?: boolean;
  disabled?: boolean;
}

export function SurfaceSelectionButton({ 
  surface, 
  isSelected, 
  onToggle,
  isRecommended = false,
  disabled = false
}: SurfaceSelectionButtonProps) {
  const measurementTypeLabels = {
    area: 'Square footage',
    linear: 'Linear feet',
    count: 'Item count',
    rooms: 'Room-by-room'
  };

  return (
    <Card 
     
      onClick={() => !disabled && onToggle(surface.id)}
    >
      <CardContent>
        <div>
          <div>
            {isSelected ? <CheckCircle /> : surface.icon}
          </div>
          
          <div>
            <div>
              <h3>{surface.name}</h3>
              {isRecommended && !isSelected && (
                <Badge variant="secondary">
                  Recommended
                </Badge>
              )}
              <Badge variant="outline">
                {measurementTypeLabels[surface.measurementType]}
              </Badge>
            </div>
            
            <p>{surface.description}</p>
            
            {surface.examples && surface.examples.length > 0 && (
              <div>
                Examples: {surface.examples.slice(0, 2).join(', ')}
                {surface.examples.length > 2 && '...'}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SmartSurfaceSelectorProps {
  selectedSurfaces: string[];
  onSurfaceToggle: (surfaceId: string) => void;
  onContinue: () => void;
  projectType?: 'interior' | 'exterior' | 'both';
  showRecommendations?: boolean;
  className?: string;
}

export function SmartSurfaceSelector({ 
  selectedSurfaces, 
  onSurfaceToggle, 
  onContinue,
  projectType = 'interior',
  showRecommendations = true,
  className
}: SmartSurfaceSelectorProps) {
  
  // Get recommendations based on selected surfaces
  const getRecommendations = (selected: string[]): string[] => {
    const recommendations = new Set<string>();
    
    selected.forEach(surfaceId => {
      const surface = SURFACE_OPTIONS.find(s => s.id === surfaceId);
      if (surface?.commonWith) {
        surface.commonWith.forEach(rec => recommendations.add(rec));
      }
    });
    
    // Remove already selected surfaces
    selected.forEach(id => recommendations.delete(id));
    
    return Array.from(recommendations);
  };

  const recommendations = getRecommendations(selectedSurfaces);
  
  // Group surfaces by category
  const surfacesByCategory = SURFACE_OPTIONS.reduce((acc, surface) => {
    if (!acc[surface.category]) acc[surface.category] = [];
    acc[surface.category].push(surface);
    return acc;
  }, {} as Record<string, SurfaceOption[]>);

  const categoryLabels = {
    walls: 'Wall Surfaces',
    ceilings: 'Ceiling Surfaces', 
    trim: 'Trim & Molding',
    items: 'Doors & Features'
  };

  const categoryIcons = {
    walls: <Square />,
    ceilings: <Layers />,
    trim: <Frame />,
    items: <DoorOpen />
  };

  // Detect measurement requirements
  const selectedSurfaceObjects = SURFACE_OPTIONS.filter(s => selectedSurfaces.includes(s.id));
  const measurementTypes = Array.from(new Set(selectedSurfaceObjects.map(s => s.measurementType)));
  
  return (
    <div>
      {/* Header */}
      <div>
        <h2>What surfaces are you painting?</h2>
        <p>
          Select all surfaces that need painting. We'll determine the best measurement approach.
        </p>
      </div>

      {/* Selected Surfaces Summary */}
      {selectedSurfaces.length > 0 && (
        <Card>
          <CardContent>
            <div>
              <CheckCircle />
              <span>
                {selectedSurfaces.length} surface{selectedSurfaces.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div>
              Measurement types needed: {measurementTypes.join(', ')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Surface Categories */}
      {Object.entries(surfacesByCategory).map(([category, surfaces]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>
              {categoryIcons[category as keyof typeof categoryIcons]}
              {categoryLabels[category as keyof typeof categoryLabels]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {surfaces.map((surface) => (
                <SurfaceSelectionButton
                  key={surface.id}
                  surface={surface}
                  isSelected={selectedSurfaces.includes(surface.id)}
                  onToggle={onSurfaceToggle}
                  isRecommended={showRecommendations && recommendations.includes(surface.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <Card>
          <CardContent>
            <div>
              <Info />
              <div>
                <div>Recommended additions</div>
                <div>
                  Based on your selections, contractors often also paint: {' '}
                  {recommendations.map(id => {
                    const surface = SURFACE_OPTIONS.find(s => s.id === id);
                    return surface?.name;
                  }).filter(Boolean).join(', ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      {selectedSurfaces.length > 0 && (
        <div>
          <Button 
            onClick={onContinue}
            size="lg"
           
          >
            Continue with {selectedSurfaces.length} surface{selectedSurfaces.length !== 1 ? 's' : ''}
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper function to get surface by ID
export function getSurfaceById(id: string): SurfaceOption | undefined {
  return SURFACE_OPTIONS.find(surface => surface.id === id);
}

// Helper function to get measurement types for selected surfaces
export function getMeasurementTypesForSurfaces(surfaceIds: string[]): string[] {
  const surfaces = SURFACE_OPTIONS.filter(s => surfaceIds.includes(s.id));
  return Array.from(new Set(surfaces.map(s => s.measurementType)));
}

// Helper function to determine if room count is needed
export function needsRoomCount(surfaceIds: string[]): boolean {
  const surfaces = SURFACE_OPTIONS.filter(s => surfaceIds.includes(s.id));
  return surfaces.some(s => s.measurementType === 'rooms');
}

// Helper function to get surface categories for selected surfaces  
export function getSurfaceCategories(surfaceIds: string[]): string[] {
  const surfaces = SURFACE_OPTIONS.filter(s => surfaceIds.includes(s.id));
  return Array.from(new Set(surfaces.map(s => s.category)));
}