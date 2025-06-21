"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Settings, Plus } from "lucide-react";

interface FavoritePaint {
  id: string;
  supplier: string;
  productName: string;
  costPerGallon: number;
  displayOrder: number;
}

interface FavoritePaintSelectorProps {
  category: string;
  projectType: 'interior' | 'exterior' | 'both';
  companyId: string;
  onProductSelect: (product: FavoritePaint) => void;
  selectedProduct?: FavoritePaint;
  className?: string;
}

const categoryLabels: { [key: string]: string } = {
  primer: 'Primer',
  wall_paint: 'Wall Paint',
  ceiling_paint: 'Ceiling Paint',
  trim_paint: 'Trim Paint',
};

const categoryIcons: { [key: string]: string } = {
  primer: '🛡️',
  wall_paint: '🎨',
  ceiling_paint: '☁️',
  trim_paint: '🪟',
};

const categoryStyles: { [key: string]: string } = {
  primer: 'card-flat-primer',
  wall_paint: 'card-flat-wall',
  ceiling_paint: 'card-flat-ceiling',
  trim_paint: 'card-flat-trim',
};

const categoryColors: { [key: string]: string } = {
  primer: 'bg-paint-primer text-paint-primer-foreground',
  wall_paint: 'bg-paint-wall text-paint-wall-foreground',
  ceiling_paint: 'bg-paint-ceiling text-paint-ceiling-foreground',
  trim_paint: 'bg-paint-trim text-paint-trim-foreground',
};

export function FavoritePaintSelector({
  category,
  projectType,
  companyId,
  onProductSelect,
  selectedProduct,
  className
}: FavoritePaintSelectorProps) {
  const [favorites, setFavorites] = useState<FavoritePaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, [category, projectType, companyId]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/paint-products?companyId=${companyId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Filter products for this specific category and project type
        const categoryFavorites = (data.products || []).filter((product: any) => {
          // If project type is 'both', show interior products (they're typically the same)
          const effectiveProjectType = projectType === 'both' ? 'interior' : projectType;
          return product.projectType === effectiveProjectType && 
            product.productCategory === category &&
            product.isActive !== false;
        });
        
        setFavorites(categoryFavorites);
        setError(null);
      } else {
        setError('Failed to load paint products');
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load paint products');
    } finally {
      setIsLoading(false);
    }
  };

  const getQualityBadge = (cost: number) => {
    if (cost >= 70) return { label: 'Premium', color: 'bg-purple-100 text-purple-700' };
    if (cost >= 50) return { label: 'Better', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Good', color: 'bg-green-100 text-green-700' };
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{categoryIcons[category] || '🎨'}</span>
          <h4 className="text-flat-lg text-flat-gray-800">
            Loading {categoryLabels[category] || category}...
          </h4>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className="h-20 bg-flat-gray-100 rounded-flat-lg animate-pulse shadow-flat" 
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">⚠️</span>
          <h4 className="text-flat-lg text-business-error">Error loading paint products</h4>
        </div>
        <p className="text-flat-base text-flat-gray-600">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadFavorites}
          className="btn-flat state-error"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{categoryIcons[category] || '🎨'}</span>
          <h4 className="text-flat-lg text-flat-gray-800">
            {categoryLabels[category] || category}
          </h4>
        </div>
        <div className={cn("text-center p-8 border-2 border-dashed rounded-flat-xl", categoryStyles[category])}>
          <Plus className="w-10 h-10 text-flat-gray-400 mx-auto mb-3" />
          <p className="text-flat-base text-flat-gray-700 mb-2">
            No {categoryLabels[category]?.toLowerCase()} products set up yet
          </p>
          <p className="text-flat-sm text-flat-gray-600 mb-4">
            Add your favorite products in Settings to use them in quotes
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/settings/products', '_blank')}
            className="btn-flat-primary"
          >
            <Settings className="icon-flat mr-2" />
            Set Up Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{categoryIcons[category] || '🎨'}</span>
        <h4 className="text-flat-lg text-flat-gray-800">
          Choose {categoryLabels[category] || category}:
        </h4>
        <Badge variant="outline" className="text-flat-xs font-semibold border-flat-gray-300">
          Your Favorites
        </Badge>
      </div>
      
      <div className="space-y-3">
        {favorites.map((product) => {
          const isSelected = selectedProduct?.id === product.id;
          const quality = getQualityBadge(product.costPerGallon);
          
          return (
            <Button
              key={product.id}
              variant="outline"
              className={cn(
                "w-full h-auto p-5 justify-between text-left transition-all duration-200",
                "mobile-flat-button interactive-flat",
                isSelected 
                  ? cn(categoryColors[category], "shadow-flat-lg border-transparent scale-105") 
                  : cn(categoryStyles[category], "hover:shadow-flat-hover")
              )}
              onClick={() => onProductSelect(product)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "text-flat-lg font-bold",
                    isSelected ? "text-white" : "text-flat-gray-900"
                  )}>
                    {product.supplier}
                  </span>
                  <Badge className={cn(
                    "text-flat-xs font-semibold",
                    isSelected ? "bg-white/20 text-white" : quality.color
                  )}>
                    {quality.label}
                  </Badge>
                </div>
                <div className={cn(
                  "text-flat-base font-medium",
                  isSelected ? "text-white/90" : "text-flat-gray-700"
                )}>
                  {product.productName}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={cn(
                    "text-flat-xl font-bold",
                    isSelected ? "text-white" : "text-flat-gray-900"
                  )}>
                    ${product.costPerGallon}/gal
                  </div>
                </div>
                {isSelected && <CheckCircle className="icon-flat-lg text-white" />}
              </div>
            </Button>
          );
        })}
      </div>
      
      {favorites.length < 3 && (
        <div className={cn("mt-4 p-4 rounded-flat-lg border-2", categoryStyles[category])}>
          <p className="text-flat-base text-flat-gray-700 mb-3">
            💡 <strong>Tip:</strong> You can add up to 3 favorite products per category
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/settings/products', '_blank')}
            className="btn-flat-primary"
          >
            <Plus className="icon-flat mr-2" />
            Add More Products
          </Button>
        </div>
      )}
    </div>
  );
}