"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Bed, 
  ChefHat, 
  Bath, 
  Sofa, 
  Car, 
  Users, 
  Coffee,
  Building,
  Plus
} from "lucide-react";

export interface RoomTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  typicalDimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
  commonSurfaces: string[];
  typicalDoors: number;
  typicalWindows: number;
  category: 'common' | 'bedroom' | 'living' | 'service';
}

// Pre-defined room templates
export const ROOM_TEMPLATES: RoomTemplate[] = [
  {
    id: 'living_room',
    name: 'Living Room',
    icon: <Sofa className="w-6 h-6" />,
    typicalDimensions: { length: 16, width: 12, height: 9 },
    description: 'Main living space',
    commonSurfaces: ['walls', 'ceiling', 'trim'],
    typicalDoors: 2,
    typicalWindows: 3,
    category: 'living'
  },
  {
    id: 'master_bedroom',
    name: 'Master Bedroom',
    icon: <Bed className="w-6 h-6" />,
    typicalDimensions: { length: 14, width: 12, height: 9 },
    description: 'Primary bedroom',
    commonSurfaces: ['walls', 'ceiling', 'trim'],
    typicalDoors: 2,
    typicalWindows: 2,
    category: 'bedroom'
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: <Bed className="w-6 h-6" />,
    typicalDimensions: { length: 12, width: 10, height: 9 },
    description: 'Standard bedroom',
    commonSurfaces: ['walls', 'ceiling', 'trim'],
    typicalDoors: 1,
    typicalWindows: 2,
    category: 'bedroom'
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: <ChefHat className="w-6 h-6" />,
    typicalDimensions: { length: 12, width: 10, height: 9 },
    description: 'Cooking area',
    commonSurfaces: ['walls', 'ceiling', 'trim'],
    typicalDoors: 1,
    typicalWindows: 1,
    category: 'common'
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: <Bath className="w-6 h-6" />,
    typicalDimensions: { length: 8, width: 6, height: 9 },
    description: 'Full bathroom',
    commonSurfaces: ['walls', 'ceiling', 'trim'],
    typicalDoors: 1,
    typicalWindows: 1,
    category: 'service'
  },
  {
    id: 'dining_room',
    name: 'Dining Room',
    icon: <Users className="w-6 h-6" />,
    typicalDimensions: { length: 12, width: 10, height: 9 },
    description: 'Formal dining',
    commonSurfaces: ['walls', 'ceiling', 'trim'],
    typicalDoors: 1,
    typicalWindows: 2,
    category: 'living'
  },
  {
    id: 'office',
    name: 'Office/Study',
    icon: <Coffee className="w-6 h-6" />,
    typicalDimensions: { length: 10, width: 10, height: 9 },
    description: 'Home office',
    commonSurfaces: ['walls', 'ceiling', 'trim'],
    typicalDoors: 1,
    typicalWindows: 1,
    category: 'common'
  },
  {
    id: 'garage',
    name: 'Garage',
    icon: <Car className="w-6 h-6" />,
    typicalDimensions: { length: 20, width: 20, height: 8 },
    description: '2-car garage',
    commonSurfaces: ['walls', 'ceiling'],
    typicalDoors: 2,
    typicalWindows: 0,
    category: 'service'
  }
];

interface RoomTypeButtonProps {
  template: RoomTemplate;
  onClick: (template: RoomTemplate) => void;
  isSelected?: boolean;
  showDetails?: boolean;
  disabled?: boolean;
}

export function RoomTypeButton({ 
  template, 
  onClick, 
  isSelected = false,
  showDetails = false,
  disabled = false
}: RoomTypeButtonProps) {
  const { length, width, height } = template.typicalDimensions;
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md cursor-pointer",
      isSelected 
        ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200" 
        : "hover:bg-gray-50 border-gray-200",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      <CardContent 
        className="p-4"
        onClick={() => !disabled && onClick(template)}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            "p-2 rounded-lg",
            isSelected 
              ? "bg-blue-100 text-blue-600" 
              : "bg-gray-100 text-gray-600"
          )}>
            {template.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900">
                {template.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {length}' × {width}'
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {template.description}
            </p>
            
            {showDetails && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  Height: {height}ft • Doors: {template.typicalDoors} • Windows: {template.typicalWindows}
                </div>
                <div className="text-xs text-gray-500">
                  Surfaces: {template.commonSurfaces.join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RoomTypeGridProps {
  templates?: RoomTemplate[];
  onRoomSelect: (template: RoomTemplate) => void;
  selectedRoomIds?: string[];
  showDetails?: boolean;
  category?: 'all' | 'common' | 'bedroom' | 'living' | 'service';
  className?: string;
}

export function RoomTypeGrid({ 
  templates = ROOM_TEMPLATES,
  onRoomSelect,
  selectedRoomIds = [],
  showDetails = false,
  category = 'all',
  className
}: RoomTypeGridProps) {
  const filteredTemplates = category === 'all' 
    ? templates 
    : templates.filter(t => t.category === category);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", className)}>
      {filteredTemplates.map((template) => (
        <RoomTypeButton
          key={template.id}
          template={template}
          onClick={onRoomSelect}
          isSelected={selectedRoomIds.includes(template.id)}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
}

interface CustomRoomButtonProps {
  onClick: () => void;
  className?: string;
}

export function CustomRoomButton({ onClick, className }: CustomRoomButtonProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md cursor-pointer border-dashed border-2 hover:bg-gray-50",
      className
    )}>
      <CardContent 
        className="p-4"
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Custom Room</h3>
            <p className="text-sm text-gray-600">Enter custom dimensions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get room template by ID
export function getRoomTemplate(id: string): RoomTemplate | undefined {
  return ROOM_TEMPLATES.find(template => template.id === id);
}

// Helper function to calculate room area from template
export function calculateRoomArea(template: RoomTemplate): number {
  const { length, width } = template.typicalDimensions;
  return length * width;
}