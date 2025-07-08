"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
    icon: <Square className="w-5 h-5" />,
    description: 'Interior or exterior wall surfaces',
    measurementType: 'area',
    category: 'walls',
    commonWith: ['trim', 'doors'],
    examples: ['Living room walls', 'Bedroom walls', 'Kitchen walls']
  },
  {
    id: 'accent_walls',
    name: 'Accent Walls',
    icon: <Square className="w-5 h-5" />,
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
    icon: <Layers className="w-5 h-5" />,
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
    icon: <Frame className="w-5 h-5" />,
    description: 'Base trim along floors',
    measurementType: 'linear',
    category: 'trim',
    commonWith: ['walls', 'doors'],
    examples: ['All room baseboards', 'Kitchen baseboards only']
  },
  {
    id: 'crown_molding',
    name: 'Crown Molding',
    icon: <Frame className="w-5 h-5" />,
    description: 'Decorative trim at ceiling',
    measurementType: 'linear',
    category: 'trim',
    commonWith: ['ceilings', 'walls'],
    examples: ['Living room crown molding', 'All rooms crown molding']
  },
  {
    id: 'window_trim',
    name: 'Window Trim',
    icon: <Frame className="w-5 h-5" />,
    description: 'Trim around windows',
    measurementType: 'linear',
    category: 'trim',
    commonWith: ['walls', 'doors'],
    examples: ['All window trim', 'Living room windows only']
  },
  {
    id: 'door_trim',
    name: 'Door Trim',
    icon: <Frame className="w-5 h-5" />,
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
    icon: <DoorOpen className="w-5 h-5" />,
    description: 'Door faces and panels',
    measurementType: 'count',
    category: 'items',
    commonWith: ['door_trim', 'walls'],
    examples: ['Interior doors', 'Front door', 'Closet doors']
  },
  {
    id: 'windows',
    name: 'Window Frames',
    icon: <Square className="w-5 h-5" />,
    description: 'Window frames and sashes',
    measurementType: 'count',
    category: 'items',
    commonWith: ['window_trim', 'walls'],
    examples: ['All window frames', 'Kitchen windows only']
  },
  {
    id: 'cabinets',
    name: 'Cabinets',
    icon: <Square className="w-5 h-5" />,
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
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md",
        isSelected ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200" : "hover:bg-gray-50 border-gray-200",
        isRecommended && !isSelected && "border-green-300 bg-green-50/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => !disabled && onToggle(surface.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isSelected ? "bg-blue-100 text-blue-600" : 
            isRecommended ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
          )}>
            {isSelected ? <CheckCircle className="w-5 h-5" /> : surface.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900">{surface.name}</h3>
              {isRecommended && !isSelected && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  Recommended
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {measurementTypeLabels[surface.measurementType]}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{surface.description}</p>
            
            {surface.examples && surface.examples.length > 0 && (
              <div className="text-xs text-gray-500">
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
    walls: <Square className="w-5 h-5" />,
    ceilings: <Layers className="w-5 h-5" />,
    trim: <Frame className="w-5 h-5" />,
    items: <DoorOpen className="w-5 h-5" />
  };

  // Detect measurement requirements
  const selectedSurfaceObjects = SURFACE_OPTIONS.filter(s => selectedSurfaces.includes(s.id));
  const measurementTypes = [...new Set(selectedSurfaceObjects.map(s => s.measurementType))];
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">What surfaces are you painting?</h2>
        <p className="text-gray-600">
          Select all surfaces that need painting. We'll determine the best measurement approach.
        </p>
      </div>

      {/* Selected Surfaces Summary */}
      {selectedSurfaces.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {selectedSurfaces.length} surface{selectedSurfaces.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="text-sm text-blue-700">
              Measurement types needed: {measurementTypes.join(', ')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Surface Categories */}
      {Object.entries(surfacesByCategory).map(([category, surfaces]) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {categoryIcons[category as keyof typeof categoryIcons]}
              {categoryLabels[category as keyof typeof categoryLabels]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900 mb-1">Recommended additions</div>
                <div className="text-sm text-green-700">
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
        <div className="flex justify-center">
          <Button 
            onClick={onContinue}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            Continue with {selectedSurfaces.length} surface{selectedSurfaces.length !== 1 ? 's' : ''}
            <ArrowRight className="w-5 h-5 ml-2" />
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
  return [...new Set(surfaces.map(s => s.measurementType))];
}

// Helper function to determine if room count is needed
export function needsRoomCount(surfaceIds: string[]): boolean {
  const surfaces = SURFACE_OPTIONS.filter(s => surfaceIds.includes(s.id));
  return surfaces.some(s => s.measurementType === 'rooms');
}

// Helper function to get surface categories for selected surfaces  
export function getSurfaceCategories(surfaceIds: string[]): string[] {
  const surfaces = SURFACE_OPTIONS.filter(s => surfaceIds.includes(s.id));
  return [...new Set(surfaces.map(s => s.category))];
}