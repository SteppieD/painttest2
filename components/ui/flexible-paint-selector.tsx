"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { CheckCircle, Settings, Plus, AlertCircle, Zap, Clock, Info } from "lucide-react";
import { useToast } from "./use-toast";

interface FavoritePaint {
  id: string;
  supplier: string;
  productName: string;
  costPerGallon: number;
  displayOrder: number;
}

interface QuickPaint {
  supplier: string;
  name: string;
  cost: number;
  description: string;
  tier: 'good' | 'better' | 'best';
}

interface FlexiblePaintSelectorProps {
  category: string;
  projectType: 'interior' | 'exterior' | 'both';
  companyId: string;
  accessCode: string;
  onProductSelect: (product: any) => void;
  selectedProduct?: any;
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

// Industry-standard fallback options when no favorites are set
const FALLBACK_OPTIONS: { [key: string]: QuickPaint[] } = {
  primer: [
    { supplier: "Kilz", name: "Premium Primer", cost: 28, description: "Most popular all-purpose primer", tier: 'good' },
    { supplier: "Zinsser", name: "Bulls Eye 1-2-3", cost: 35, description: "Superior adhesion primer", tier: 'better' },
    { supplier: "Sherwin-Williams", name: "ProBlock", cost: 42, description: "Professional grade primer", tier: 'best' }
  ],
  wall_paint: [
    { supplier: "Behr", name: "Premium Plus Ultra", cost: 48, description: "Popular retail option", tier: 'good' },
    { supplier: "Sherwin-Williams", name: "ProClassic", cost: 58, description: "Contractor favorite", tier: 'better' },
    { supplier: "Benjamin Moore", name: "Regal Select", cost: 68, description: "Premium quality", tier: 'best' }
  ],
  ceiling_paint: [
    { supplier: "Behr", name: "Premium Plus", cost: 38, description: "Budget-friendly option", tier: 'good' },
    { supplier: "Sherwin-Williams", name: "ProMar 200", cost: 45, description: "Most popular choice", tier: 'better' },
    { supplier: "Benjamin Moore", name: "Waterborne Ceiling", cost: 55, description: "Zero-spatter formula", tier: 'best' }
  ],
  trim_paint: [
    { supplier: "Sherwin-Williams", name: "ProClassic", cost: 58, description: "Reliable choice", tier: 'good' },
    { supplier: "Benjamin Moore", name: "Advance", cost: 68, description: "Industry standard", tier: 'better' },
    { supplier: "Benjamin Moore", name: "Aura", cost: 85, description: "Premium finish", tier: 'best' }
  ]
};

export function FlexiblePaintSelector({
  category,
  projectType,
  companyId,
  accessCode,
  onProductSelect,
  selectedProduct,
  className
}: FlexiblePaintSelectorProps) {
  const [favorites, setFavorites] = useState<FavoritePaint[]>([]);
  const [hasSetup, setHasSetup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallbackOptions, setShowFallbackOptions] = useState(false);
  const [showQuickSetup, setShowQuickSetup] = useState(false);
  const [customProduct, setCustomProduct] = useState({
    supplier: '',
    name: '',
    cost: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, [category, projectType, companyId]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/companies/favorite-paints?category=${category}&project_type=${projectType}&company_id=${companyId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        setHasSetup(data.favorites && data.favorites.length > 0);
      } else {
        setHasSetup(false);
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setHasSetup(false);
      setFavorites([]);
    }
    setIsLoading(false);
  };

  const handleQuickSetupForCategory = async (selectedOption: QuickPaint) => {
    try {
      const response = await fetch('/api/companies/quick-add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: accessCode,
          category,
          project_type: projectType,
          supplier: selectedOption.supplier,
          name: selectedOption.name,
          cost_per_gallon: selectedOption.cost
        }),
      });

      if (response.ok) {
        // Select this product immediately
        onProductSelect({
          supplier: selectedOption.supplier,
          productName: selectedOption.name,
          costPerGallon: selectedOption.cost
        });
        
        toast({
          title: "Product Added",
          description: `${selectedOption.supplier} ${selectedOption.name} has been added to your favorites.`,
        });
        
        setShowFallbackOptions(false);
        loadFavorites(); // Refresh favorites
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCustomProductAdd = async () => {
    if (!customProduct.supplier || !customProduct.name || !customProduct.cost) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const cost = parseFloat(customProduct.cost);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Invalid Cost",
        description: "Please enter a valid cost per gallon.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/companies/quick-add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: accessCode,
          category,
          project_type: projectType,
          supplier: customProduct.supplier,
          name: customProduct.name,
          cost_per_gallon: cost
        }),
      });

      if (response.ok) {
        // Select this product immediately
        onProductSelect({
          supplier: customProduct.supplier,
          productName: customProduct.name,
          costPerGallon: cost
        });
        
        toast({
          title: "Product Added",
          description: `${customProduct.supplier} ${customProduct.name} has been added to your favorites.`,
        });
        
        setShowQuickSetup(false);
        setCustomProduct({ supplier: '', name: '', cost: '' });
        loadFavorites(); // Refresh favorites
      }
    } catch (error) {
      console.error('Error adding custom product:', error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <span>{categoryIcons[category]}</span>
        <h3>{categoryLabels[category]}</h3>
        {!hasSetup && (
          <Badge variant="outline">
            <AlertCircle />
            Not Set Up
          </Badge>
        )}
      </div>

      {hasSetup && favorites.length > 0 ? (
        // Show configured favorites
        <div>
          {favorites.map((favorite) => (
            <Card
              key={favorite.id}
             
              onClick={() => onProductSelect(favorite)}
            >
              <CardContent>
                <div>
                  <div>
                    <p>{favorite.supplier} {favorite.productName}</p>
                    <p>${favorite.costPerGallon}/gallon</p>
                  </div>
                  {selectedProduct?.id === favorite.id && (
                    <CheckCircle />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFallbackOptions(true)}
           
          >
            <Plus />
            Add Another Option
          </Button>
        </div>
      ) : (
        // Show setup options for categories without favorites
        <Card>
          <CardContent>
            <AlertCircle />
            <h4>No {categoryLabels[category]} Products Set Up</h4>
            <p>
              Choose how you'd like to add {categoryLabels[category].toLowerCase()} options:
            </p>
            
            <div>
              <Button
                onClick={() => setShowFallbackOptions(true)}
               
                size="sm"
              >
                <Zap />
                Quick Pick (Popular Options)
              </Button>
              
              <Button
                onClick={() => setShowQuickSetup(true)}
                variant="outline"
               
                size="sm"
              >
                <Plus />
                Add My Product
              </Button>
              
              <div>
                <Info />
                Products you add will be saved for future quotes
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Pick Dialog */}
      <Dialog open={showFallbackOptions} onOpenChange={setShowFallbackOptions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Pick: {categoryLabels[category]}</DialogTitle>
            <DialogDescription>
              Choose from popular {categoryLabels[category].toLowerCase()} options with industry-standard pricing.
            </DialogDescription>
          </DialogHeader>
          
          <div>
            {(FALLBACK_OPTIONS[category] || []).map((option, index) => (
              <Card
                key={index}
               
                onClick={() => handleQuickSetupForCategory(option)}
              >
                <CardContent>
                  <div>
                    <div>
                      <div>
                        <p>{option.supplier} {option.name}</p>
                        <Badge 
                          variant={option.tier === 'best' ? 'default' : 'secondary'}
                         
                        >
                          {option.tier === 'good' ? 'Good' : option.tier === 'better' ? 'Better' : 'Best'}
                        </Badge>
                      </div>
                      <p>{option.description}</p>
                    </div>
                    <div>
                      <p>${option.cost}</p>
                      <p>per gallon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Product Dialog */}
      <Dialog open={showQuickSetup} onOpenChange={setShowQuickSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Your {categoryLabels[category]}</DialogTitle>
            <DialogDescription>
              Enter the specific product you use for {categoryLabels[category].toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          
          <div>
            <div>
              <Label htmlFor="supplier">Brand/Supplier</Label>
              <Input
                id="supplier"
                placeholder="e.g., Sherwin-Williams, Benjamin Moore"
                value={customProduct.supplier}
                onChange={(e) => setCustomProduct(prev => ({ ...prev, supplier: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="product">Product Name</Label>
              <Input
                id="product"
                placeholder="e.g., ProClassic, Advance"
                value={customProduct.name}
                onChange={(e) => setCustomProduct(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="cost">Your Cost (per gallon)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="e.g., 58.50"
                value={customProduct.cost}
                onChange={(e) => setCustomProduct(prev => ({ ...prev, cost: e.target.value }))}
              />
              <p>Enter your actual cost - markup will be applied during quoting</p>
            </div>
            
            <div>
              <Button
                variant="outline"
                onClick={() => setShowQuickSetup(false)}
               
              >
                Cancel
              </Button>
              <Button
                onClick={handleCustomProductAdd}
               
              >
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}