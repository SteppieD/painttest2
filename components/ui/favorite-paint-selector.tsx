"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
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
      <div>
        <div>
          <span>{categoryIcons[category] || '🎨'}</span>
          <h4>
            Loading {categoryLabels[category] || category}...
          </h4>
        </div>
        <div>
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>
          <span>⚠️</span>
          <h4>Error loading paint products</h4>
        </div>
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadFavorites}
         
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div>
        <div>
          <span>{categoryIcons[category] || '🎨'}</span>
          <h4>
            {categoryLabels[category] || category}
          </h4>
        </div>
        <div>
          <Plus />
          <p>
            No {categoryLabels[category]?.toLowerCase()} products set up yet
          </p>
          <p>
            Add your favorite products in Settings to use them in quotes
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/settings/products', '_blank')}
           
          >
            <Settings />
            Set Up Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <span>{categoryIcons[category] || '🎨'}</span>
        <h4>
          Choose {categoryLabels[category] || category}:
        </h4>
        <Badge variant="outline">
          Your Favorites
        </Badge>
      </div>
      
      <div>
        {favorites.map((product) => {
          const isSelected = selectedProduct?.id === product.id;
          const quality = getQualityBadge(product.costPerGallon);
          
          return (
            <Button
              key={product.id}
              variant="outline"
             
              onClick={() => onProductSelect(product)}
            >
              <div>
                <div>
                  <span>
                    {product.supplier}
                  </span>
                  <Badge>
                    {quality.label}
                  </Badge>
                </div>
                <div>
                  {product.productName}
                </div>
              </div>
              
              <div>
                <div>
                  <div>
                    ${product.costPerGallon}/gal
                  </div>
                </div>
                {isSelected && <CheckCircle />}
              </div>
            </Button>
          );
        })}
      </div>
      
      {favorites.length < 3 && (
        <div>
          <p>
            💡 <strong>Tip:</strong> You can add up to 3 favorite products per category
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/settings/products', '_blank')}
           
          >
            <Plus />
            Add More Products
          </Button>
        </div>
      )}
    </div>
  );
}