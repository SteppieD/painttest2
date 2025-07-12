"use client";

import { useState } from "react";
import { Button } from "./button";
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
      <div>
        No brands available for {category}
      </div>
    );
  }

  const renderBrandButton = (brand: Brand, isTop: boolean = false) => {
    const productCount = brand.products[category]?.length || 0;
    const isSelected = selectedBrand === brand.brand;
    const colorClass = brandColors[brand.brand] || 'border-flat-gray-300 hover:bg-flat-gray-50';
    const icon = brandIcons[brand.brand] || '🎨';
    const description = brandDescriptions[brand.brand] || '';
    
    return (
      <Button
        key={brand.brand}
        variant={isSelected ? "default" : "outline"}
       
        onClick={() => onBrandSelect(brand.brand)}
      >
        {isTop && !isSelected && (
          <span>
            Popular
          </span>
        )}
        <span>{icon}</span>
        <span>{brand.brand}</span>
        {description && (
          <span>{description}</span>
        )}
        <span>
          {productCount} product{productCount !== 1 ? 's' : ''}
        </span>
      </Button>
    );
  };

  return (
    <div>
      <div>
        <p>
          Choose paint brand for {category}:
        </p>
        <p>
          Select from our most popular professional brands
        </p>
      </div>
      
      {/* Top 3 Brands */}
      <div>
        {availableTopBrands.map(brand => renderBrandButton(brand, true))}
      </div>
      
      {/* Show More Brands */}
      {availableOtherBrands.length > 0 && (
        <>
          <Button
            variant="ghost"
           
            onClick={() => setShowAllBrands(!showAllBrands)}
          >
            {showAllBrands ? (
              <>
                <ChevronUp />
                Show Fewer Brands
              </>
            ) : (
              <>
                <ChevronDown />
                Show {availableOtherBrands.length} More Brand{availableOtherBrands.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
          
          {showAllBrands && (
            <div>
              {availableOtherBrands.map(brand => renderBrandButton(brand, false))}
            </div>
          )}
        </>
      )}
    </div>
  );
}