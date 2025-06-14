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

const getQualityLevel = (price: number): string => {
  // Basic price-based quality determination
  if (price < 50) return 'Good';
  if (price < 80) return 'Better';
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

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          Choose {brand} {category} paint:
        </span>
        <span className="text-xs text-gray-500">
          ({products.length} option{products.length !== 1 ? 's' : ''})
        </span>
      </div>
      
      <div className="space-y-2">
        {sortedProducts.map((product, index) => {
          const isSelected = selectedProduct?.id === product.id;
          const quality = getQualityLevel(product.cost_per_gallon);
          const qualityColorClass = getQualityColor(quality);
          
          return (
            <Button
              key={product.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "w-full h-auto p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-left transition-all",
                isSelected 
                  ? "bg-blue-600 text-white border-blue-600" 
                  : "hover:bg-gray-50"
              )}
              onClick={() => onProductSelect(product)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm leading-tight">
                    {product.product_name}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium border",
                    isSelected 
                      ? "bg-white text-blue-600 border-white" 
                      : qualityColorClass
                  )}>
                    {quality}
                  </span>
                </div>
                <div className="text-xs opacity-75">
                  {product.product_line && (
                    <span>{product.product_line}</span>
                  )}
                  {product.sheen && (
                    <span> • {product.sheen}</span>
                  )}
                </div>
              </div>
              
              <div className="text-right mt-2 sm:mt-0">
                <div className="font-bold text-lg">
                  ${product.cost_per_gallon}
                </div>
                <div className="text-xs opacity-75">
                  per gallon
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => {
            // Could trigger a "go back to brand selection" action
          }}
        >
          ← Back to Brands
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-blue-600"
          onClick={() => {
            // Could trigger a "custom product" dialog
          }}
        >
          🔧 Custom Product
        </Button>
      </div>
    </div>
  );
}