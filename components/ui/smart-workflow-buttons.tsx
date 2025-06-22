"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Square, 
  Ruler, 
  DoorOpen,
  Layers,
  Calculator,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

// Define project scope types
export type ProjectScope = 
  | 'room_count' // Ceilings, full room painting - needs room count
  | 'square_footage' // Walls, floors - needs area measurements  
  | 'linear_feet' // Trim, baseboards - needs linear measurements
  | 'item_count' // Doors, windows - needs quantity count
  | 'mixed'; // Multiple measurement types

export type MeasurementType = 
  | 'rooms' 
  | 'area' 
  | 'linear' 
  | 'quantity'
  | 'custom';

export interface ProjectContext {
  surfaces: string[];
  projectType: 'interior' | 'exterior' | 'both';
  scope: ProjectScope;
  requiredMeasurements: MeasurementType[];
  optional?: boolean;
}

// Smart detection of what measurements are needed based on selected surfaces
export function detectProjectScope(surfaces: string[]): ProjectContext {
  const surfaceSet = new Set(surfaces.map(s => s.toLowerCase()));
  
  // Determine scope based on surfaces
  const needsRoomCount = surfaceSet.has('ceilings') || surfaceSet.has('ceiling');
  const needsAreaMeasurement = surfaceSet.has('walls') || surfaceSet.has('wall') || surfaceSet.has('floors') || surfaceSet.has('floor');
  const needsLinearMeasurement = surfaceSet.has('trim') || surfaceSet.has('baseboards') || surfaceSet.has('crown molding');
  const needsQuantityCount = surfaceSet.has('doors') || surfaceSet.has('windows');
  
  const requiredMeasurements: MeasurementType[] = [];
  
  if (needsRoomCount) requiredMeasurements.push('rooms');
  if (needsAreaMeasurement) requiredMeasurements.push('area');
  if (needsLinearMeasurement) requiredMeasurements.push('linear');
  if (needsQuantityCount) requiredMeasurements.push('quantity');
  
  // Determine primary scope
  let scope: ProjectScope = 'mixed';
  if (requiredMeasurements.length === 1) {
    switch (requiredMeasurements[0]) {
      case 'rooms': scope = 'room_count'; break;
      case 'area': scope = 'square_footage'; break;
      case 'linear': scope = 'linear_feet'; break;
      case 'quantity': scope = 'item_count'; break;
    }
  }
  
  return {
    surfaces,
    projectType: 'interior', // Default, can be updated
    scope,
    requiredMeasurements,
  };
}

interface ScopeExplanationProps {
  context: ProjectContext;
  className?: string;
}

export function ScopeExplanation({ context, className }: ScopeExplanationProps) {
  const explanations = {
    room_count: {
      icon: <Home className="w-5 h-5 text-blue-600" />,
      title: "Room-by-Room Approach",
      description: "We'll collect dimensions for each room since you're painting ceilings.",
      color: "bg-blue-50 border-blue-200"
    },
    square_footage: {
      icon: <Square className="w-5 h-5 text-green-600" />,
      title: "Area Measurements",
      description: "We'll measure wall and floor areas for accurate paint calculations.",
      color: "bg-green-50 border-green-200"
    },
    linear_feet: {
      icon: <Ruler className="w-5 h-5 text-purple-600" />,
      title: "Linear Measurements",
      description: "We'll measure trim length - no room count needed.",
      color: "bg-purple-50 border-purple-200"
    },
    item_count: {
      icon: <DoorOpen className="w-5 h-5 text-orange-600" />,
      title: "Item Quantities",
      description: "We'll count doors and windows for accurate estimates.",
      color: "bg-orange-50 border-orange-200"
    },
    mixed: {
      icon: <Layers className="w-5 h-5 text-gray-600" />,
      title: "Mixed Measurements",
      description: "We'll collect different measurements based on your selected surfaces.",
      color: "bg-gray-50 border-gray-200"
    }
  };
  
  const config = explanations[context.scope];
  
  return (
    <Card className={cn(config.color, className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg">
            {config.icon}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{config.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{config.description}</p>
            <div className="flex flex-wrap gap-1">
              {context.requiredMeasurements.map((measurement) => (
                <Badge key={measurement} variant="secondary" className="text-xs">
                  {measurement}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SmartWorkflowStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    required: boolean;
    completed?: boolean;
  };
  onSelect: (stepId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SmartWorkflowStep({ step, onSelect, disabled = false, className }: SmartWorkflowStepProps) {
  const { id, title, description, icon, required, completed = false } = step;
  
  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md",
        completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50 border-gray-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && onSelect(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={cn(
              "p-2 rounded-lg",
              completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
            )}>
              {completed ? <CheckCircle className="w-5 h-5" /> : icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">{title}</h3>
                {required && (
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          
          {!completed && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface RoomCountSelectorProps {
  onSelect: (count: number) => void;
  selectedCount?: number;
  maxRooms?: number;
  context: ProjectContext;
  className?: string;
}

export function RoomCountSelector({ 
  onSelect, 
  selectedCount, 
  maxRooms = 10,
  context,
  className 
}: RoomCountSelectorProps) {
  // Only show if room count is actually needed
  if (!context.requiredMeasurements.includes('rooms')) {
    return null;
  }
  
  const commonCounts = [1, 2, 3, 4, 5, 6, 8, 10];
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Home className="w-5 h-5 text-blue-600" />
          How many rooms?
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Needed for ceiling measurements</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {commonCounts.map((count) => (
            <Button
              key={count}
              variant={selectedCount === count ? "default" : "outline"}
              onClick={() => onSelect(count)}
              className={cn(
                "h-12 text-lg font-medium",
                selectedCount === count && "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {count}
            </Button>
          ))}
        </div>
        
        {selectedCount && selectedCount > 8 && (
          <div className="text-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
            {selectedCount} rooms selected
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MeasurementTypeButtonProps {
  type: MeasurementType;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: () => void;
  isSelected?: boolean;
  isRequired?: boolean;
  isCompleted?: boolean;
  disabled?: boolean;
}

export function MeasurementTypeButton({
  type,
  title,
  description,
  icon,
  onSelect,
  isSelected = false,
  isRequired = false,
  isCompleted = false,
  disabled = false
}: MeasurementTypeButtonProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "h-auto p-4 justify-start text-left",
        isCompleted && "bg-green-50 border-green-200 text-green-700",
        isSelected && !isCompleted && "bg-blue-600 hover:bg-blue-700 text-white"
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <div className={cn(
          "p-1 rounded-lg",
          isCompleted ? "bg-green-100" : isSelected ? "bg-white/20" : "bg-gray-100"
        )}>
          {isCompleted ? <CheckCircle className="w-5 h-5 text-green-600" /> : icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium truncate">{title}</h3>
            {isRequired && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  isSelected && "bg-white/20 text-white"
                )}
              >
                Required
              </Badge>
            )}
          </div>
          <p className={cn(
            "text-sm",
            isSelected ? "text-white/80" : "text-gray-600"
          )}>
            {description}
          </p>
        </div>
      </div>
    </Button>
  );
}

interface SmartMeasurementFlowProps {
  context: ProjectContext;
  onMeasurementTypeSelect: (type: MeasurementType) => void;
  onRoomCountSelect: (count: number) => void;
  selectedMeasurementType?: MeasurementType;
  selectedRoomCount?: number;
  completedMeasurements?: MeasurementType[];
  className?: string;
}

export function SmartMeasurementFlow({
  context,
  onMeasurementTypeSelect,
  onRoomCountSelect,
  selectedMeasurementType,
  selectedRoomCount,
  completedMeasurements = [],
  className
}: SmartMeasurementFlowProps) {
  const measurementTypes = [
    {
      type: 'rooms' as MeasurementType,
      title: 'Room Dimensions',
      description: 'Length × width × height for each room',
      icon: <Home className="w-5 h-5" />,
      required: context.requiredMeasurements.includes('rooms')
    },
    {
      type: 'area' as MeasurementType,
      title: 'Wall/Floor Area',
      description: 'Square footage measurements',
      icon: <Square className="w-5 h-5" />,
      required: context.requiredMeasurements.includes('area')
    },
    {
      type: 'linear' as MeasurementType,
      title: 'Linear Measurements',
      description: 'Trim, baseboards, crown molding length',
      icon: <Ruler className="w-5 h-5" />,
      required: context.requiredMeasurements.includes('linear')
    },
    {
      type: 'quantity' as MeasurementType,
      title: 'Item Quantities',
      description: 'Count of doors, windows, fixtures',
      icon: <DoorOpen className="w-5 h-5" />,
      required: context.requiredMeasurements.includes('quantity')
    }
  ].filter(m => context.requiredMeasurements.includes(m.type));
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Context Explanation */}
      <ScopeExplanation context={context} />
      
      {/* Room Count Selector - Only if needed */}
      <RoomCountSelector
        context={context}
        onSelect={onRoomCountSelect}
        selectedCount={selectedRoomCount}
      />
      
      {/* Measurement Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gray-600" />
            What measurements do you need?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {measurementTypes.map((measurement) => (
              <MeasurementTypeButton
                key={measurement.type}
                type={measurement.type}
                title={measurement.title}
                description={measurement.description}
                icon={measurement.icon}
                onSelect={() => onMeasurementTypeSelect(measurement.type)}
                isSelected={selectedMeasurementType === measurement.type}
                isRequired={measurement.required}
                isCompleted={completedMeasurements.includes(measurement.type)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to generate smart workflow steps based on context
export function generateWorkflowSteps(context: ProjectContext) {
  const steps = [];
  
  // Always need customer info
  steps.push({
    id: 'customer_info',
    title: 'Customer Information',
    description: 'Name and project address',
    icon: <Home className="w-5 h-5" />,
    required: true
  });
  
  // Surface selection
  steps.push({
    id: 'surface_selection',
    title: 'Surface Selection',
    description: 'What surfaces are you painting?',
    icon: <Square className="w-5 h-5" />,
    required: true
  });
  
  // Conditional steps based on context
  if (context.requiredMeasurements.includes('rooms')) {
    steps.push({
      id: 'room_count',
      title: 'Room Count',
      description: 'How many rooms are you painting?',
      icon: <Home className="w-5 h-5" />,
      required: true
    });
  }
  
  if (context.requiredMeasurements.includes('area')) {
    steps.push({
      id: 'area_measurements',
      title: 'Area Measurements',
      description: 'Measure wall and floor areas',
      icon: <Square className="w-5 h-5" />,
      required: true
    });
  }
  
  if (context.requiredMeasurements.includes('linear')) {
    steps.push({
      id: 'linear_measurements',
      title: 'Linear Measurements',
      description: 'Measure trim and molding length',
      icon: <Ruler className="w-5 h-5" />,
      required: true
    });
  }
  
  if (context.requiredMeasurements.includes('quantity')) {
    steps.push({
      id: 'quantity_count',
      title: 'Item Quantities',
      description: 'Count doors, windows, and fixtures',
      icon: <DoorOpen className="w-5 h-5" />,
      required: true
    });
  }
  
  return steps;
}