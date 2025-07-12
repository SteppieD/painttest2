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
  coveragePerGallon?: number;
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
      coveragePerGallon: 350,
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
      coveragePerGallon: 350,
    };

    console.log("💾 Saving new product:", newProduct);
    
    try {
      await saveProduct(newProduct);
      console.log("✅ Product save completed");
    } catch (error) {
      console.error("❌ Product save failed:", error);
    }
  };

  const [editingInlineProduct, setEditingInlineProduct] = useState<string | null>(null);
  const [inlineEditValues, setInlineEditValues] = useState<{[key: string]: number}>({});

  const startInlineEdit = (productId: string, currentCost: number) => {
    setEditingInlineProduct(productId);
    setInlineEditValues({ [productId]: currentCost });
  };

  const saveInlineEdit = async (product: PaintProduct) => {
    const newCost = inlineEditValues[product.id];
    if (newCost && newCost !== product.costPerGallon) {
      await saveProduct({ ...product, costPerGallon: newCost });
    }
    setEditingInlineProduct(null);
  };

  // Category styles mapping
  const getCategoryStyle = (category: string) => {
    const styles = {
      primer: 'card-flat-primer',
      wall_paint: 'card-flat-wall', 
      ceiling_paint: 'card-flat-ceiling',
      trim_paint: 'card-flat-trim',
    };
    return styles[category as keyof typeof styles] || 'card-flat';
  };

  const renderProductCard = (product: PaintProduct) => (
    <Card key={product.id}>
      <CardContent>
        <div>
          <div>
            <div>
              <h4>{product.productName}</h4>
              {product.sheen && (
                <span>
                  {product.sheen}
                </span>
              )}
            </div>
            <p>{product.supplier}</p>
            {product.productLine && (
              <p>{product.productLine}</p>
            )}
            <p>
              Coverage: {product.coveragePerGallon || 350} sq ft/gal
            </p>
            
            {/* Inline price editing */}
            {editingInlineProduct === product.id ? (
              <div>
                <div>
                  <span>$</span>
                  <Input
                    type="number"
                    step="0.01"
                    value={inlineEditValues[product.id] || product.costPerGallon}
                    onChange={(e) => setInlineEditValues({
                      ...inlineEditValues,
                      [product.id]: parseFloat(e.target.value) || 0
                    })}
                   
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        saveInlineEdit(product);
                      }
                    }}
                  />
                  <span>/gal</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => saveInlineEdit(product)}
                 
                >
                  ✓
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingInlineProduct(null)}
                 
                >
                  ✕
                </Button>
              </div>
            ) : (
              <button
                onClick={() => startInlineEdit(product.id, product.costPerGallon)}
               
              >
                ${product.costPerGallon.toFixed(2)}/gal
              </button>
            )}
          </div>
          <div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => startEditProduct(product)}
              title="Edit all details"
             
            >
              <Edit3 />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (confirm('Are you sure you want to delete this product?')) {
                  deleteProduct(product.id);
                }
              }}
              title="Delete product"
             
            >
              <Trash2 />
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
      <div key={category.value}>
        <div>
          <h3>{category.label}</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addNewProduct(projectType, category.value)}
            disabled={categoryProducts.length >= 3}
           
          >
            <Plus />
            Add Custom
          </Button>
        </div>
        
        {/* Popular Products Quick Add */}
        {categoryProducts.length === 0 && popularProducts.length > 0 && (
          <div>
            <p>Quick add popular products:</p>
            <div>
              {popularProducts.map((product: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                 
                  onClick={() => addPopularProduct(projectType, category.value, product)}
                  disabled={isLoading}
                >
                  <div>
                    <div>{product.supplier}</div>
                    <div>{product.name}</div>
                    <div>${product.cost}/gal</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {categoryProducts.length === 0 ? (
          <Card>
            <CardContent>
              <PaintBucket />
              <p>No products added yet</p>
              {popularProducts.length === 0 && (
                <p>Click "Add Custom" to create your first product</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {categoryProducts.map(renderProductCard)}
            {/* Show remaining popular products if there's space */}
            {categoryProducts.length < 3 && popularProducts.length > 0 && (
              <div>
                <p>Add more popular products:</p>
                <div>
                  {popularProducts.slice(0, 3 - categoryProducts.length).map((product: any, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                     
                      onClick={() => addPopularProduct(projectType, category.value, product)}
                      disabled={isLoading}
                    >
                      <div>
                        <div>
                          <div>{product.supplier}</div>
                          <div>{product.name}</div>
                        </div>
                        <div>${product.cost}/gal</div>
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
    <div>
      <div>
        {/* Header */}
        <div>
          <div>
            <div>
              <h1>Paint Products</h1>
              <p>
                Manage your paint products and pricing for quotes.
              </p>
            </div>
            <div>
              <Button
                onClick={() => router.push("/settings/products/chat")}
               
              >
                <MessageSquare />
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
            <CardTitle>
              <Settings />
              Your Product Catalog
            </CardTitle>
            <CardDescription>
              Add popular products with one click, or edit individual products. Use the chat interface for bulk updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="interior">
              <TabsList>
                <TabsTrigger value="interior">
                  <Home />
                  Interior Products
                </TabsTrigger>
                <TabsTrigger value="exterior">
                  <Building />
                  Exterior Products
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interior">
                {INTERIOR_CATEGORIES.map((category) =>
                  renderCategorySection("interior", category)
                )}
              </TabsContent>

              <TabsContent value="exterior">
                {EXTERIOR_CATEGORIES.map((category) =>
                  renderCategorySection("exterior", category)
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct?.id ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                Update your product information and pricing.
              </DialogDescription>
            </DialogHeader>
            
            {editingProduct && (
              <div>
                <div>
                  <div>
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

                  <div>
                    <Label>Cost per Gallon</Label>
                    <div>
                      <span>$</span>
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
                       
                      />
                    </div>
                  </div>
                </div>

                <div>
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

                <div>
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

                <div>
                  <Label>Coverage per Gallon (sq ft)</Label>
                  <Input
                    type="number"
                    value={editingProduct.coveragePerGallon || 350}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        coveragePerGallon: parseInt(e.target.value) || 350,
                      })
                    }
                    placeholder="350"
                  />
                  <p>
                    How many square feet does one gallon cover? (Standard: 350 sq ft/gal)
                  </p>
                </div>

                <div>
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