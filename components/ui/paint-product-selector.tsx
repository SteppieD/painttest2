"use client";

import { Button } from "./button";
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
      <div>
        No {brand} products available for {category}
      </div>
    );
  }

  // Sort products by price for consistent quality ordering
  const sortedProducts = [...products].sort((a, b) => a.cost_per_gallon - b.cost_per_gallon);
  const allPrices = products.map(p => p.cost_per_gallon);

  return (
    <div>
      <div>
        <div>
          <span>
            Choose your {brand} {category} paint:
          </span>
        </div>
        <p>
          {products.length} option{products.length !== 1 ? 's' : ''} • Prices include coverage up to 350 sq ft per gallon
        </p>
      </div>
      
      <div>
        {sortedProducts.map((product, index) => {
          const isSelected = selectedProduct?.id === product.id;
          const quality = getQualityLevel(product.cost_per_gallon, allPrices);
          const qualityColorClass = getQualityColor(quality);
          const qualityDesc = getQualityDescription(quality);
          const isRecommended = quality === 'Better';
          
          return (
            <div key={product.id}>
              {isRecommended && !isSelected && (
                <div>
                  <span>
                    Recommended
                  </span>
                </div>
              )}
              <Button
                variant={isSelected ? "default" : "outline"}
               
                onClick={() => onProductSelect(product)}
              >
                <div>
                  <div>
                    <span>
                      {product.product_name}
                    </span>
                    <span>
                      {quality}
                    </span>
                  </div>
                  <div>
                    {product.product_line && (
                      <span>{product.product_line}</span>
                    )}
                    {product.sheen && (
                      <span> • {product.sheen} finish</span>
                    )}
                  </div>
                  <div>
                    {qualityDesc}
                  </div>
                </div>
                
                <div>
                  <div>
                    ${product.cost_per_gallon}
                  </div>
                  <div>
                    per gallon
                  </div>
                  <div>
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