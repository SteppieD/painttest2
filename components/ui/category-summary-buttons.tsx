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
    <Card className={`p-3 mb-2 cursor-pointer transition-all hover:shadow-md ${
      isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
    }`} onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-gray-600">{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-sm">${cost}</div>
          {isCompleted && (
            <div className="text-xs text-green-600">✓ Complete</div>
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
    <div className="my-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Quote Progress:</div>
      {categories.map((category) => (
        <CategorySummaryButton
          key={category.id}
          {...category}
          onClick={() => onCategoryClick?.(category)}
        />
      ))}
      {categories.length > 1 && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-800">
            Total Paint Cost: ${totalCost}
          </div>
        </div>
      )}
    </div>
  );
}