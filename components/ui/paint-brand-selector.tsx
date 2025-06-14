"use client";

import { Button } from "./button";
import { cn } from "@/lib/utils";

interface Brand {
  brand: string;
  products: {
    [category: string]: any[];
  };
}

interface PaintBrandSelectorProps {
  brands: Brand[];
  category: string;
  onBrandSelect: (brand: string) => void;
  selectedBrand?: string;
  className?: string;
}

const brandColors: { [key: string]: string } = {
  'Sherwin-Williams': 'border-red-500 hover:bg-red-50 text-red-700',
  'Benjamin Moore': 'border-blue-500 hover:bg-blue-50 text-blue-700',
  'PPG': 'border-purple-500 hover:bg-purple-50 text-purple-700',
  'Behr': 'border-orange-500 hover:bg-orange-50 text-orange-700',
  'Kilz': 'border-gray-500 hover:bg-gray-50 text-gray-700',
  'Zinsser': 'border-green-500 hover:bg-green-50 text-green-700',
};

const brandIcons: { [key: string]: string } = {
  'Sherwin-Williams': '🎨',
  'Benjamin Moore': '🏠',
  'PPG': '🎭',
  'Behr': '✨',
  'Kilz': '🛡️',
  'Zinsser': '💪',
};

export function PaintBrandSelector({ 
  brands, 
  category, 
  onBrandSelect, 
  selectedBrand,
  className 
}: PaintBrandSelectorProps) {
  // Filter brands that have products for the specified category
  const availableBrands = brands.filter(brand => 
    brand.products[category] && brand.products[category].length > 0
  );

  if (availableBrands.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No brands available for {category}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-sm font-medium text-gray-700">
        Choose paint brand for {category}:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {availableBrands.map(({ brand, products }) => {
          const productCount = products[category]?.length || 0;
          const isSelected = selectedBrand === brand;
          const colorClass = brandColors[brand] || 'border-gray-300 hover:bg-gray-50';
          const icon = brandIcons[brand] || '🎨';
          
          return (
            <Button
              key={brand}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-auto p-3 flex flex-col items-center text-center transition-all",
                isSelected 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : colorClass
              )}
              onClick={() => onBrandSelect(brand)}
            >
              <span className="text-lg mb-1">{icon}</span>
              <span className="text-xs font-medium leading-tight">{brand}</span>
              <span className="text-xs opacity-75">
                {productCount} option{productCount !== 1 ? 's' : ''}
              </span>
            </Button>
          );
        })}
      </div>
      
      {availableBrands.length > 6 && (
        <Button
          variant="outline"
          className="w-full text-sm"
          onClick={() => onBrandSelect('custom')}
        >
          🔧 Custom / Other Brand
        </Button>
      )}
    </div>
  );
}