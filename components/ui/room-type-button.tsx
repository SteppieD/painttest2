"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    icon: <Sofa />,
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
    icon: <Bed />,
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
    icon: <Bed />,
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
    icon: <ChefHat />,
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
    icon: <Bath />,
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
    icon: <Users />,
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
    icon: <Coffee />,
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
    icon: <Car />,
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
    <Card>
      <CardContent 
       
        onClick={() => !disabled && onClick(template)}
      >
        <div>
          {/* Icon */}
          <div>
            {template.icon}
          </div>
          
          {/* Content */}
          <div>
            <div>
              <h3>
                {template.name}
              </h3>
              <Badge variant="secondary">
                {length}' × {width}'
              </Badge>
            </div>
            
            <p>
              {template.description}
            </p>
            
            {showDetails && (
              <div>
                <div>
                  Height: {height}ft • Doors: {template.typicalDoors} • Windows: {template.typicalWindows}
                </div>
                <div>
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
    <div>
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
    <Card>
      <CardContent 
       
        onClick={onClick}
      >
        <div>
          <div>
            <Plus />
          </div>
          <div>
            <h3>Custom Room</h3>
            <p>Enter custom dimensions</p>
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