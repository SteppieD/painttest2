"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Minus, 
  DoorOpen, 
  Square, 
  Frame,
  Home,
  Check,
  X
} from "lucide-react";

export interface QuantityItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  quantity: number;
  unit?: string;
  description?: string;
  maxQuantity?: number;
  minQuantity?: number;
}

interface QuantityButtonProps {
  item: QuantityItem;
  onChange: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  showRemove?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

export function QuantityButton({ 
  item, 
  onChange, 
  onRemove,
  showRemove = false,
  disabled = false,
  size = 'md',
  variant = 'default'
}: QuantityButtonProps) {
  const { id, name, icon, quantity, unit = '', description, maxQuantity = 20, minQuantity = 0 } = item;
  
  const increment = () => {
    if (quantity < maxQuantity) {
      onChange(id, quantity + 1);
    }
  };
  
  const decrement = () => {
    if (quantity > minQuantity) {
      onChange(id, quantity - 1);
    }
  };

  const sizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  };

  const buttonSizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 flex-1">
          <div className="text-gray-600">
            {icon}
          </div>
          <span className="text-sm font-medium">{name}</span>
          {unit && <span className="text-xs text-gray-500">({unit})</span>}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={decrement}
            disabled={disabled || quantity <= minQuantity}
            className="h-6 w-6 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>
          
          <span className="w-8 text-center text-sm font-medium">
            {quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={increment}
            disabled={disabled || quantity >= maxQuantity}
            className="h-6 w-6 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      quantity > 0 ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-200",
      disabled && "opacity-50"
    )}>
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center justify-between">
          {/* Left: Icon and Label */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              quantity > 0 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-600"
            )}>
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{name}</h3>
                {unit && (
                  <Badge variant="secondary" className="text-xs">
                    {unit}
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-sm text-gray-600 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Right: Quantity Controls */}
          <div className="flex items-center gap-2">
            {/* Quantity Display */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={decrement}
                disabled={disabled || quantity <= minQuantity}
                className={cn(buttonSizeClasses[size], "p-0")}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="w-12 text-center">
                <span className="text-lg font-semibold">{quantity}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={increment}
                disabled={disabled || quantity >= maxQuantity}
                className={cn(buttonSizeClasses[size], "p-0")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Remove Button */}
            {showRemove && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-defined quantity items for common painting elements
export const COMMON_QUANTITY_ITEMS: QuantityItem[] = [
  {
    id: 'doors',
    name: 'Doors',
    icon: <DoorOpen className="w-5 h-5" />,
    quantity: 0,
    description: 'Interior doors to paint',
    maxQuantity: 15
  },
  {
    id: 'windows',
    name: 'Windows',
    icon: <Square className="w-5 h-5" />,
    quantity: 0,
    description: 'Window frames and trim',
    maxQuantity: 20
  },
  {
    id: 'closets',
    name: 'Closets',
    icon: <Home className="w-5 h-5" />,
    quantity: 0,
    description: 'Closet interiors',
    maxQuantity: 10
  }
];

// Pre-defined trim items
export const TRIM_QUANTITY_ITEMS: QuantityItem[] = [
  {
    id: 'baseboards',
    name: 'Baseboards',
    icon: <Frame className="w-5 h-5" />,
    quantity: 0,
    unit: 'lin ft',
    description: 'Baseboard trim',
    maxQuantity: 500
  },
  {
    id: 'crown_molding',
    name: 'Crown Molding',
    icon: <Frame className="w-5 h-5" />,
    quantity: 0,
    unit: 'lin ft',
    description: 'Crown molding',
    maxQuantity: 300
  },
  {
    id: 'chair_rail',
    name: 'Chair Rail',
    icon: <Frame className="w-5 h-5" />,
    quantity: 0,
    unit: 'lin ft',
    description: 'Chair rail molding',
    maxQuantity: 200
  }
];

interface QuantityGridProps {
  items: QuantityItem[];
  onChange: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  showRemove?: boolean;
  title?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function QuantityGrid({ 
  items, 
  onChange, 
  onRemove,
  showRemove = false,
  title,
  variant = 'default',
  className
}: QuantityGridProps) {
  const hasQuantities = items.some(item => item.quantity > 0);
  
  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          {hasQuantities && (
            <Badge variant="secondary" className="text-xs">
              {items.filter(item => item.quantity > 0).length} selected
            </Badge>
          )}
        </div>
      )}
      
      <div className={cn(
        variant === 'compact' ? "space-y-2" : "space-y-3"
      )}>
        {items.map((item) => (
          <QuantityButton
            key={item.id}
            item={item}
            onChange={onChange}
            onRemove={onRemove}
            showRemove={showRemove}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}

// Helper function to get total quantity across all items
export function getTotalQuantity(items: QuantityItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Helper function to get items with quantities > 0
export function getSelectedItems(items: QuantityItem[]): QuantityItem[] {
  return items.filter(item => item.quantity > 0);
}

// Helper function to create quantity item
export function createQuantityItem(
  id: string, 
  name: string, 
  icon: React.ReactNode, 
  options?: Partial<QuantityItem>
): QuantityItem {
  return {
    id,
    name,
    icon,
    quantity: 0,
    ...options
  };
}