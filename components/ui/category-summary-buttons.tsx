"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface CategorySummaryButtonProps {
  id: string;
  categoryType: 'walls' | 'ceilings' | 'doors' | 'trim' | 'cabinets' | 'other';
  icon: string;
  title: string;
  subtitle: string;
  cost: number;
  isCompleted: boolean;
  onClick?: () => void;
}

export function CategorySummaryButton({
  icon,
  title, 
  subtitle,
  cost,
  isCompleted,
  onClick
}: CategorySummaryButtonProps) {
  return (
    <Card`} onClick={onClick}>
      <div>
        <div>{icon}</div>
        <div>
          <div>{title}</div>
          <div>{subtitle}</div>
        </div>
        <div>
          <div>${cost}</div>
          {isCompleted && (
            <div>✓ Complete</div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function CategorySummaryList({ 
  categories, 
  onCategoryClick 
}: { 
  categories: CategorySummaryButtonProps[];
  onCategoryClick?: (category: CategorySummaryButtonProps) => void;
}) {
  if (categories.length === 0) return null;
  
  const totalCost = categories.reduce((sum, cat) => sum + cat.cost, 0);
  
  return (
    <div>
      <div>Quote Progress:</div>
      {categories.map((category) => (
        <CategorySummaryButton
          key={category.id}
          {...category}
          onClick={() => onCategoryClick?.(category)}
        />
      ))}
      {categories.length > 1 && (
        <div>
          <div>
            Total Paint Cost: ${totalCost}
          </div>
        </div>
      )}
    </div>
  );
}