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
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{categoryIcons[category] || '🎨'}</span>
          <h4 className="font-medium text-gray-700">
            Loading {categoryLabels[category] || category}...
          </h4>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">⚠️</span>
          <h4 className="font-medium text-red-700">Error loading paint products</h4>
        </div>
        <p className="text-sm text-red-600">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadFavorites}
          className="text-red-600 border-red-300"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{categoryIcons[category] || '🎨'}</span>
          <h4 className="font-medium text-gray-700">
            {categoryLabels[category] || category}
          </h4>
        </div>
        <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            No {categoryLabels[category]?.toLowerCase()} products set up yet
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Add your favorite products in Settings to use them in quotes
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/settings/products', '_blank')}
            className="text-blue-600 border-blue-300"
          >
            <Settings className="w-4 h-4 mr-1" />
            Set Up Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{categoryIcons[category] || '🎨'}</span>
        <h4 className="font-medium text-gray-700">
          Choose {categoryLabels[category] || category}:
        </h4>
        <Badge variant="outline" className="text-xs">
          Your Favorites
        </Badge>
      </div>
      
      <div className="space-y-2">
        {favorites.map((product) => {
          const isSelected = selectedProduct?.id === product.id;
          const quality = getQualityBadge(product.costPerGallon);
          
          return (
            <Button
              key={product.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "w-full h-auto p-4 justify-between text-left transition-all",
                isSelected 
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg" 
                  : "hover:bg-gray-50 hover:border-blue-300"
              )}
              onClick={() => onProductSelect(product)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{product.supplier}</span>
                  <Badge className={cn("text-xs", quality.color)}>
                    {quality.label}
                  </Badge>
                </div>
                <div className="text-sm opacity-75">{product.productName}</div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    ${product.costPerGallon}/gal
                  </div>
                </div>
                {isSelected && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              </div>
            </Button>
          );
        })}
      </div>
      
      {favorites.length < 3 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 mb-2">
            💡 <strong>Tip:</strong> You can add up to 3 favorite products per category
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/settings/products', '_blank')}
            className="text-blue-600 border-blue-300"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add More Products
          </Button>
        </div>
      )}
    </div>
  );
}