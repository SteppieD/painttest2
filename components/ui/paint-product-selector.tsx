"use client";

import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PaintProduct {
  id: string;
  product_name: string;
  use_case: string;
  cost_per_gallon: number;
  sheen?: string;
  brand?: string;
  product_line?: string;
  [key: string]: any; // Allow additional properties for flexibility
}

interface PaintProductSelectorProps {
  products: PaintProduct[];
  brand: string;
  category: string;
  onProductSelect: (product: PaintProduct) => void;
  selectedProduct?: PaintProduct;
  className?: string;
}

const qualityLevels = ['Good', 'Better', 'Best'];

const getQualityLevel = (price: number, allPrices: number[]): string => {
  // Determine quality based on relative pricing within the category
  const uniquePrices = Array.from(new Set(allPrices));
  const sortedPrices = uniquePrices.sort((a, b) => a - b);
  const priceIndex = sortedPrices.indexOf(price);
  const pricePercentile = priceIndex / (sortedPrices.length - 1);
  
  if (pricePercentile <= 0.33) return 'Good';
  if (pricePercentile <= 0.66) return 'Better';
  return 'Best';
};

const getQualityColor = (quality: string): string => {
  switch (quality) {
    case 'Good': return 'text-green-600 bg-green-50 border-green-200';
    case 'Better': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Best': return 'text-purple-600 bg-purple-50 border-purple-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getQualityDescription = (quality: string): string => {
  switch (quality) {
    case 'Good': return 'Budget-friendly • Good coverage';
    case 'Better': return 'Great value • Excellent durability';
    case 'Best': return 'Premium finish • Lifetime warranty';
    default: return '';
  }
};

export function PaintProductSelector({ 
  products, 
  brand, 
  category, 
  onProductSelect, 
  selectedProduct,
  className 
}: PaintProductSelectorProps) {
  if (products.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No {brand} products available for {category}
      </div>
    );
  }

  // Sort products by price for consistent quality ordering
  const sortedProducts = [...products].sort((a, b) => a.cost_per_gallon - b.cost_per_gallon);
  const allPrices = products.map(p => p.cost_per_gallon);

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700">
            Choose your {brand} {category} paint:
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {products.length} option{products.length !== 1 ? 's' : ''} • Prices include coverage up to 350 sq ft per gallon
        </p>
      </div>
      
      <div className="space-y-3">
        {sortedProducts.map((product, index) => {
          const isSelected = selectedProduct?.id === product.id;
          const quality = getQualityLevel(product.cost_per_gallon, allPrices);
          const qualityColorClass = getQualityColor(quality);
          const qualityDesc = getQualityDescription(quality);
          const isRecommended = quality === 'Better';
          
          return (
            <div key={product.id} className="relative">
              {isRecommended && !isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Recommended
                  </span>
                </div>
              )}
              <Button
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "w-full h-auto p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-left transition-all border-2",
                  isSelected 
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg" 
                    : isRecommended 
                      ? "border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                      : "hover:bg-gray-50"
                )}
                onClick={() => onProductSelect(product)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-base leading-tight">
                      {product.product_name}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      isSelected 
                        ? "bg-white text-blue-600 border-white" 
                        : qualityColorClass
                    )}>
                      {quality}
                    </span>
                  </div>
                  <div className="text-sm mb-1">
                    {product.product_line && (
                      <span className="font-medium">{product.product_line}</span>
                    )}
                    {product.sheen && (
                      <span className="text-gray-600"> • {product.sheen} finish</span>
                    )}
                  </div>
                  <div className="text-xs opacity-75">
                    {qualityDesc}
                  </div>
                </div>
                
                <div className="text-right mt-3 sm:mt-0">
                  <div className="font-bold text-xl text-green-600">
                    ${product.cost_per_gallon}
                  </div>
                  <div className="text-xs opacity-75">
                    per gallon
                  </div>
                  <div className="text-xs mt-1 opacity-60">
                    ~350 sq ft coverage
                  </div>
                </div>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}