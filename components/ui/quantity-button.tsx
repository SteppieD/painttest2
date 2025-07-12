"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div>
        <div>
          <div>
            {icon}
          </div>
          <span>{name}</span>
          {unit && <span>({unit})</span>}
        </div>
        
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={decrement}
            disabled={disabled || quantity <= minQuantity}
           
          >
            <Minus />
          </Button>
          
          <span>
            {quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={increment}
            disabled={disabled || quantity >= maxQuantity}
           
          >
            <Plus />
          </Button>
        </div>
        
        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
           
          >
            <X />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent>
        <div>
          {/* Left: Icon and Label */}
          <div>
            <div>
              {icon}
            </div>
            <div>
              <div>
                <h3>{name}</h3>
                {unit && (
                  <Badge variant="secondary">
                    {unit}
                  </Badge>
                )}
              </div>
              {description && (
                <p>
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Right: Quantity Controls */}
          <div>
            {/* Quantity Display */}
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={decrement}
                disabled={disabled || quantity <= minQuantity}
               
              >
                <Minus />
              </Button>
              
              <div>
                <span>{quantity}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={increment}
                disabled={disabled || quantity >= maxQuantity}
               
              >
                <Plus />
              </Button>
            </div>
            
            {/* Remove Button */}
            {showRemove && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(id)}
               
              >
                <X />
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
    icon: <DoorOpen />,
    quantity: 0,
    description: 'Interior doors to paint',
    maxQuantity: 15
  },
  {
    id: 'windows',
    name: 'Windows',
    icon: <Square />,
    quantity: 0,
    description: 'Window frames and trim',
    maxQuantity: 20
  },
  {
    id: 'closets',
    name: 'Closets',
    icon: <Home />,
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
    icon: <Frame />,
    quantity: 0,
    unit: 'lin ft',
    description: 'Baseboard trim',
    maxQuantity: 500
  },
  {
    id: 'crown_molding',
    name: 'Crown Molding',
    icon: <Frame />,
    quantity: 0,
    unit: 'lin ft',
    description: 'Crown molding',
    maxQuantity: 300
  },
  {
    id: 'chair_rail',
    name: 'Chair Rail',
    icon: <Frame />,
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
    <div>
      {title && (
        <div>
          <h4>{title}</h4>
          {hasQuantities && (
            <Badge variant="secondary">
              {items.filter(item => item.quantity > 0).length} selected
            </Badge>
          )}
        </div>
      )}
      
      <div>
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