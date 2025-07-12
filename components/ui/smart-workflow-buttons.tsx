"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      icon: <Home />,
      title: "Room-by-Room Approach",
      description: "We'll collect dimensions for each room since you're painting ceilings.",
      color: "bg-blue-50 border-blue-200"
    },
    square_footage: {
      icon: <Square />,
      title: "Area Measurements",
      description: "We'll measure wall and floor areas for accurate paint calculations.",
      color: "bg-green-50 border-green-200"
    },
    linear_feet: {
      icon: <Ruler />,
      title: "Linear Measurements",
      description: "We'll measure trim length - no room count needed.",
      color: "bg-purple-50 border-purple-200"
    },
    item_count: {
      icon: <DoorOpen />,
      title: "Item Quantities",
      description: "We'll count doors and windows for accurate estimates.",
      color: "bg-orange-50 border-orange-200"
    },
    mixed: {
      icon: <Layers />,
      title: "Mixed Measurements",
      description: "We'll collect different measurements based on your selected surfaces.",
      color: "bg-gray-50 border-gray-200"
    }
  };
  
  const config = explanations[context.scope];
  
  return (
    <Card>
      <CardContent>
        <div>
          <div>
            {config.icon}
          </div>
          <div>
            <h4>{config.title}</h4>
            <p>{config.description}</p>
            <div>
              {context.requiredMeasurements.map((measurement) => (
                <Badge key={measurement} variant="secondary">
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
     
      onClick={() => !disabled && onSelect(id)}
    >
      <CardContent>
        <div>
          <div>
            <div>
              {completed ? <CheckCircle /> : icon}
            </div>
            
            <div>
              <div>
                <h3>{title}</h3>
                {required && (
                  <Badge variant="secondary">Required</Badge>
                )}
              </div>
              <p>{description}</p>
            </div>
          </div>
          
          {!completed && (
            <ChevronRight />
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
    <Card>
      <CardHeader>
        <CardTitle>
          <Home />
          How many rooms?
        </CardTitle>
        <div>
          <Info />
          <span>Needed for ceiling measurements</span>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          {commonCounts.map((count) => (
            <Button
              key={count}
              variant={selectedCount === count ? "default" : "outline"}
              onClick={() => onSelect(count)}
             
            >
              {count}
            </Button>
          ))}
        </div>
        
        {selectedCount && selectedCount > 8 && (
          <div>
            <CheckCircle />
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
     
    >
      <div>
        <div>
          {isCompleted ? <CheckCircle /> : icon}
        </div>
        
        <div>
          <div>
            <h3>{title}</h3>
            {isRequired && (
              <Badge 
                variant="secondary" 
               
              >
                Required
              </Badge>
            )}
          </div>
          <p>
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
      icon: <Home />,
      required: context.requiredMeasurements.includes('rooms')
    },
    {
      type: 'area' as MeasurementType,
      title: 'Wall/Floor Area',
      description: 'Square footage measurements',
      icon: <Square />,
      required: context.requiredMeasurements.includes('area')
    },
    {
      type: 'linear' as MeasurementType,
      title: 'Linear Measurements',
      description: 'Trim, baseboards, crown molding length',
      icon: <Ruler />,
      required: context.requiredMeasurements.includes('linear')
    },
    {
      type: 'quantity' as MeasurementType,
      title: 'Item Quantities',
      description: 'Count of doors, windows, fixtures',
      icon: <DoorOpen />,
      required: context.requiredMeasurements.includes('quantity')
    }
  ].filter(m => context.requiredMeasurements.includes(m.type));
  
  return (
    <div>
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
          <CardTitle>
            <Calculator />
            What measurements do you need?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
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
    icon: <Home />,
    required: true
  });
  
  // Surface selection
  steps.push({
    id: 'surface_selection',
    title: 'Surface Selection',
    description: 'What surfaces are you painting?',
    icon: <Square />,
    required: true
  });
  
  // Conditional steps based on context
  if (context.requiredMeasurements.includes('rooms')) {
    steps.push({
      id: 'room_count',
      title: 'Room Count',
      description: 'How many rooms are you painting?',
      icon: <Home />,
      required: true
    });
  }
  
  if (context.requiredMeasurements.includes('area')) {
    steps.push({
      id: 'area_measurements',
      title: 'Area Measurements',
      description: 'Measure wall and floor areas',
      icon: <Square />,
      required: true
    });
  }
  
  if (context.requiredMeasurements.includes('linear')) {
    steps.push({
      id: 'linear_measurements',
      title: 'Linear Measurements',
      description: 'Measure trim and molding length',
      icon: <Ruler />,
      required: true
    });
  }
  
  if (context.requiredMeasurements.includes('quantity')) {
    steps.push({
      id: 'quantity_count',
      title: 'Item Quantities',
      description: 'Count doors, windows, and fixtures',
      icon: <DoorOpen />,
      required: true
    });
  }
  
  return steps;
}