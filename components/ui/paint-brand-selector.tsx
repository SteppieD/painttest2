"use client";

import { useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Brand {
  brand: string;
  products: {
    [category: string]: any[];
  };
}

interface PaintBrandSelectorProps {
  brands: Brand[];
  topBrands?: Brand[];
  otherBrands?: Brand[];
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

const brandDescriptions: { [key: string]: string } = {
  'Sherwin-Williams': 'Premium Professional',
  'Benjamin Moore': 'Designer Favorite',
  'Behr': 'Best Value',
  'PPG': 'Industrial Strength',
  'Kilz': 'Primer Specialist',
  'Zinsser': 'Problem Solver',
};

export function PaintBrandSelector({ 
  brands, 
  topBrands,
  otherBrands,
  category, 
  onBrandSelect, 
  selectedBrand,
  className 
}: PaintBrandSelectorProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  
  // Use topBrands if provided, otherwise filter from all brands
  const brandsToUse = topBrands || brands.filter(brand => 
    brand.products[category] && brand.products[category].length > 0
  );
  
  const otherBrandsToUse = otherBrands || [];
  
  // Filter for current category
  const availableTopBrands = brandsToUse.filter(brand => 
    brand.products[category] && brand.products[category].length > 0
  );
  
  const availableOtherBrands = otherBrandsToUse.filter(brand => 
    brand.products[category] && brand.products[category].length > 0
  );

  if (availableTopBrands.length === 0 && availableOtherBrands.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No brands available for {category}
      </div>
    );
  }

  const renderBrandButton = (brand: Brand, isTop: boolean = false) => {
    const productCount = brand.products[category]?.length || 0;
    const isSelected = selectedBrand === brand.brand;
    const colorClass = brandColors[brand.brand] || 'border-gray-300 hover:bg-gray-50';
    const icon = brandIcons[brand.brand] || '🎨';
    const description = brandDescriptions[brand.brand] || '';
    
    return (
      <Button
        key={brand.brand}
        variant={isSelected ? "default" : "outline"}
        className={cn(
          "h-auto p-4 flex flex-col items-center text-center transition-all relative",
          isSelected 
            ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105" 
            : colorClass,
          isTop && "border-2"
        )}
        onClick={() => onBrandSelect(brand.brand)}
      >
        {isTop && !isSelected && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium">
            Popular
          </span>
        )}
        <span className="text-2xl mb-2">{icon}</span>
        <span className="text-sm font-semibold leading-tight">{brand.brand}</span>
        {description && (
          <span className="text-xs opacity-75 mt-1">{description}</span>
        )}
        <span className="text-xs mt-2 opacity-60">
          {productCount} product{productCount !== 1 ? 's' : ''}
        </span>
      </Button>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Choose paint brand for {category}:
        </p>
        <p className="text-xs text-gray-500">
          Select from our most popular professional brands
        </p>
      </div>
      
      {/* Top 3 Brands */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {availableTopBrands.map(brand => renderBrandButton(brand, true))}
      </div>
      
      {/* Show More Brands */}
      {availableOtherBrands.length > 0 && (
        <>
          <Button
            variant="ghost"
            className="w-full text-sm text-blue-600 hover:text-blue-700"
            onClick={() => setShowAllBrands(!showAllBrands)}
          >
            {showAllBrands ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Fewer Brands
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show {availableOtherBrands.length} More Brand{availableOtherBrands.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
          
          {showAllBrands && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {availableOtherBrands.map(brand => renderBrandButton(brand, false))}
            </div>
          )}
        </>
      )}
    </div>
  );
}