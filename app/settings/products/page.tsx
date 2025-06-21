"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaintBucket, Plus, Trash2, Edit3, MessageSquare, Home, Building, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaintProduct {
  id: string;
  projectType: "interior" | "exterior";
  productCategory: string;
  supplier: string;
  productName: string;
  productLine?: string;
  costPerGallon: number;
  displayOrder: number;
  sheen?: string;
}

const INTERIOR_CATEGORIES = [
  { value: "primer", label: "Primer" },
  { value: "ceiling_paint", label: "Ceiling Paint" },
  { value: "wall_paint", label: "Wall Paint" },
  { value: "trim_paint", label: "Trim, Windows & Doors Paint" },
];

const EXTERIOR_CATEGORIES = [
  { value: "primer", label: "Primer" },
  { value: "wall_paint", label: "Wall Paint" },
  { value: "trim_paint", label: "Trim, Windows & Doors Paint" },
];

const COMMON_SUPPLIERS = [
  "Sherwin-Williams",
  "Benjamin Moore",
  "PPG",
  "Behr",
  "Valspar",
  "Dunn-Edwards",
  "Kelly-Moore",
  "Zinsser",
  "Rust-Oleum",
  "Other",
];

const POPULAR_PRODUCTS = {
  interior: {
    primer: [
      { supplier: "Zinsser", name: "Bulls Eye 1-2-3", cost: 28 },
      { supplier: "Kilz", name: "Premium Primer", cost: 25 },
      { supplier: "Sherwin-Williams", name: "ProBlock", cost: 32 },
    ],
    wall_paint: [
      { supplier: "Benjamin Moore", name: "Regal Select", cost: 65 },
      { supplier: "Sherwin-Williams", name: "ProClassic", cost: 58 },
      { supplier: "Behr", name: "Premium Plus Ultra", cost: 45 },
    ],
    ceiling_paint: [
      { supplier: "Benjamin Moore", name: "Waterborne Ceiling", cost: 55 },
      { supplier: "Sherwin-Williams", name: "ProMar 200", cost: 42 },
      { supplier: "Behr", name: "Premium Plus", cost: 38 },
    ],
    trim_paint: [
      { supplier: "Benjamin Moore", name: "Advance", cost: 75 },
      { supplier: "Sherwin-Williams", name: "ProClassic", cost: 68 },
      { supplier: "PPG", name: "Break-Through!", cost: 72 },
    ],
  },
  exterior: {
    primer: [
      { supplier: "Kilz", name: "Adhesion Primer", cost: 35 },
      { supplier: "Zinsser", name: "Cover Stain", cost: 38 },
      { supplier: "Benjamin Moore", name: "Fresh Start", cost: 42 },
    ],
    wall_paint: [
      { supplier: "Benjamin Moore", name: "Aura Exterior", cost: 85 },
      { supplier: "Sherwin-Williams", name: "Duration", cost: 78 },
      { supplier: "Behr", name: "Marquee", cost: 65 },
    ],
    trim_paint: [
      { supplier: "Benjamin Moore", name: "Advance Exterior", cost: 82 },
      { supplier: "Sherwin-Williams", name: "ProClassic", cost: 75 },
      { supplier: "PPG", name: "Manor Hall", cost: 70 },
    ],
  },
};

export default function ProductSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<PaintProduct[]>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<PaintProduct | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const storedCompany = localStorage.getItem("paintquote_company");
    if (storedCompany) {
      const company = JSON.parse(storedCompany);
      setCompanyData(company);
      loadProducts(company.id);
    } else {
      router.push("/access-code");
    }
  }, [router]);

  const loadProducts = async (companyId: string) => {
    try {
      const response = await fetch(`/api/paint-products?companyId=${companyId}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      });
    }
  };

  const saveProduct = async (product: PaintProduct) => {
    if (!companyData || !companyData.id) {
      toast({
        title: "Error",
        description: "Company data not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Saving product:", { companyId: companyData.id, product });
      const response = await fetch("/api/paint-products/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: companyData.id,
          product,
        }),
      });

      if (response.ok) {
        toast({
          title: "Product saved",
          description: "Your product has been updated successfully.",
        });
        loadProducts(companyData.id);
        setIsEditDialogOpen(false);
        setEditingProduct(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: `Failed to save product: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/paint-products/single?id=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Product deleted",
          description: "Your product has been removed successfully.",
        });
        loadProducts(companyData.id);
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditProduct = (product: PaintProduct) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const addNewProduct = (projectType: "interior" | "exterior", category: string) => {
    const categoryProducts = products.filter(
      p => p.projectType === projectType && p.productCategory === category
    );
    
    if (categoryProducts.length >= 3) {
      toast({
        title: "Limit reached",
        description: "You can only have up to 3 products per category.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: PaintProduct = {
      id: "",
      projectType,
      productCategory: category,
      supplier: "",
      productName: "",
      costPerGallon: 0,
      displayOrder: categoryProducts.length + 1,
    };

    setEditingProduct(newProduct);
    setIsEditDialogOpen(true);
  };

  const addPopularProduct = async (
    projectType: "interior" | "exterior", 
    category: string, 
    product: { supplier: string; name: string; cost: number }
  ) => {
    console.log("🎨 Adding popular product:", { projectType, category, product });
    
    const categoryProducts = products.filter(
      p => p.projectType === projectType && p.productCategory === category
    );
    
    console.log("📊 Category products count:", categoryProducts.length);
    
    if (categoryProducts.length >= 3) {
      console.log("❌ Product limit reached");
      toast({
        title: "Limit reached",
        description: "You can only have up to 3 products per category.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: PaintProduct = {
      id: "",
      projectType,
      productCategory: category,
      supplier: product.supplier,
      productName: product.name,
      costPerGallon: product.cost,
      displayOrder: categoryProducts.length + 1,
    };

    console.log("💾 Saving new product:", newProduct);
    
    try {
      await saveProduct(newProduct);
      console.log("✅ Product save completed");
    } catch (error) {
      console.error("❌ Product save failed:", error);
    }
  };

  const renderProductCard = (product: PaintProduct) => (
    <Card key={product.id} className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="pt-4" onClick={() => startEditProduct(product)}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{product.productName}</h4>
              {product.sheen && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {product.sheen}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{product.supplier}</p>
            {product.productLine && (
              <p className="text-xs text-gray-500">{product.productLine}</p>
            )}
            <p className="text-lg font-semibold text-green-600 mt-1">
              ${product.costPerGallon.toFixed(2)}/gal
            </p>
          </div>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => startEditProduct(product)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => deleteProduct(product.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategorySection = (
    projectType: "interior" | "exterior",
    category: { value: string; label: string }
  ) => {
    const categoryProducts = products.filter(
      p => p.projectType === projectType && p.productCategory === category.value
    );

    const popularProducts = (POPULAR_PRODUCTS as any)[projectType]?.[category.value] || [];

    return (
      <div key={category.value} className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{category.label}</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addNewProduct(projectType, category.value)}
            disabled={categoryProducts.length >= 3}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Custom
          </Button>
        </div>
        
        {/* Popular Products Quick Add */}
        {categoryProducts.length === 0 && popularProducts.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick add popular products:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {popularProducts.map((product: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-3 text-left"
                  onClick={() => addPopularProduct(projectType, category.value, product)}
                  disabled={isLoading}
                >
                  <div className="flex flex-col items-start w-full">
                    <div className="font-medium text-xs">{product.supplier}</div>
                    <div className="text-xs text-gray-600">{product.name}</div>
                    <div className="text-xs font-semibold text-green-600">${product.cost}/gal</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {categoryProducts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-6 text-center text-gray-500">
              <PaintBucket className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No products added yet</p>
              {popularProducts.length === 0 && (
                <p className="text-xs mt-1">Click "Add Custom" to create your first product</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {categoryProducts.map(renderProductCard)}
            {/* Show remaining popular products if there's space */}
            {categoryProducts.length < 3 && popularProducts.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Add more popular products:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {popularProducts.slice(0, 3 - categoryProducts.length).map((product: any, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto p-2 text-left"
                      onClick={() => addPopularProduct(projectType, category.value, product)}
                      disabled={isLoading}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <div className="font-medium text-xs">{product.supplier}</div>
                          <div className="text-xs text-gray-600">{product.name}</div>
                        </div>
                        <div className="text-xs font-semibold text-green-600">${product.cost}/gal</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paint Products</h1>
              <p className="text-gray-600 mt-2">
                Manage your paint products and pricing for quotes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push("/settings/products/chat")}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Update via Chat
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Your Product Catalog
            </CardTitle>
            <CardDescription>
              Add popular products with one click, or edit individual products. Use the chat interface for bulk updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="interior" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="interior" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Interior Products
                </TabsTrigger>
                <TabsTrigger value="exterior" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Exterior Products
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interior" className="mt-6">
                {INTERIOR_CATEGORIES.map((category) =>
                  renderCategorySection("interior", category)
                )}
              </TabsContent>

              <TabsContent value="exterior" className="mt-6">
                {EXTERIOR_CATEGORIES.map((category) =>
                  renderCategorySection("exterior", category)
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct?.id ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                Update your product information and pricing.
              </DialogDescription>
            </DialogHeader>
            
            {editingProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Select
                      value={editingProduct.supplier}
                      onValueChange={(value) =>
                        setEditingProduct({ ...editingProduct, supplier: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_SUPPLIERS.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cost per Gallon</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={editingProduct.costPerGallon}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            costPerGallon: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={editingProduct.productName}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        productName: e.target.value,
                      })
                    }
                    placeholder="e.g., ProClassic Interior"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Line (optional)</Label>
                  <Input
                    value={editingProduct.productLine || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        productLine: e.target.value,
                      })
                    }
                    placeholder="e.g., Duration, Harmony"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => saveProduct(editingProduct)}
                    disabled={isLoading || !editingProduct.productName || !editingProduct.supplier}
                  >
                    {isLoading ? "Saving..." : "Save Product"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}