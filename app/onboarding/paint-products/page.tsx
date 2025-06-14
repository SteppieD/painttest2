"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaintBucket, Plus, Trash2, Home, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaintProduct {
  id?: string;
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
  "Other",
];

const SHEEN_OPTIONS = [
  "Flat",
  "Matte",
  "Eggshell",
  "Satin",
  "Semi-Gloss",
  "Gloss",
  "High Gloss",
];

export default function PaintProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [products, setProducts] = useState<PaintProduct[]>([]);

  useEffect(() => {
    // Get company data from localStorage
    const storedCompany = localStorage.getItem("paintquote_company");
    if (storedCompany) {
      const company = JSON.parse(storedCompany);
      setCompanyData(company);
    } else {
      // Redirect to access code page if no company data
      router.push("/access-code");
    }
  }, [router]);

  const addProduct = (projectType: "interior" | "exterior", category: string) => {
    const categoryProducts = products.filter(
      p => p.projectType === projectType && p.productCategory === category
    );
    
    if (categoryProducts.length >= 3) {
      toast({
        title: "Limit reached",
        description: "You can only add up to 3 products per category.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: PaintProduct = {
      projectType,
      productCategory: category,
      supplier: "",
      productName: "",
      costPerGallon: 0,
      displayOrder: categoryProducts.length + 1,
    };

    setProducts([...products, newProduct]);
  };

  const updateProduct = (index: number, updates: Partial<PaintProduct>) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], ...updates };
    setProducts(updatedProducts);
  };

  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/paint-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: companyData?.id,
          products,
        }),
      });

      if (response.ok) {
        toast({
          title: "Paint products saved",
          description: "Your product catalog has been set up successfully.",
        });

        // Update onboarding status
        const updatedCompany = {
          ...companyData,
          onboardingCompleted: true,
        };
        localStorage.setItem("paintquote_company", JSON.stringify(updatedCompany));

        // Navigate to dashboard or success page
        router.push("/dashboard");
      } else {
        throw new Error("Failed to save paint products");
      }
    } catch (error) {
      console.error("Error saving paint products:", error);
      toast({
        title: "Error",
        description: "Failed to save paint products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductForm = (product: PaintProduct, index: number) => (
    <Card key={index} className="mb-4">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select
              value={product.supplier}
              onValueChange={(value) => updateProduct(index, { supplier: value })}
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
            <Label>Product Name *</Label>
            <Input
              value={product.productName}
              onChange={(e) => updateProduct(index, { productName: e.target.value })}
              placeholder="e.g., ProClassic Interior"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Product Line (optional)</Label>
            <Input
              value={product.productLine || ""}
              onChange={(e) => updateProduct(index, { productLine: e.target.value })}
              placeholder="e.g., Duration, Harmony"
            />
          </div>

          <div className="space-y-2">
            <Label>Cost per Gallon *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                type="number"
                step="0.01"
                value={product.costPerGallon || ""}
                onChange={(e) => updateProduct(index, { costPerGallon: parseFloat(e.target.value) || 0 })}
                className="pl-8"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {product.productCategory !== "primer" && (
            <div className="space-y-2">
              <Label>Sheen</Label>
              <Select
                value={product.sheen || ""}
                onValueChange={(value) => updateProduct(index, { sheen: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sheen" />
                </SelectTrigger>
                <SelectContent>
                  {SHEEN_OPTIONS.map((sheen) => (
                    <SelectItem key={sheen} value={sheen}>
                      {sheen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeProduct(index)}
            >
              <Trash2 className="h-4 w-4" />
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

    return (
      <div key={category.value} className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{category.label}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addProduct(projectType, category.value)}
            disabled={categoryProducts.length >= 3}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Button>
        </div>
        {categoryProducts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-gray-500">
              <PaintBucket className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No {category.label.toLowerCase()} products added yet.</p>
              <p className="text-sm">Click "Add Product" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          categoryProducts.map((product, idx) => {
            const globalIndex = products.indexOf(product);
            return renderProductForm(product, globalIndex);
          })
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paint Products Setup</h1>
          <p className="text-gray-600 mt-2">
            Configure your most commonly used paint products for quick quote generation.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Paint Product Catalog</CardTitle>
              <CardDescription>
                Add up to 3 products per category. These will be available as options when creating quotes.
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

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/onboarding/company-profile")}
            >
              Back
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Skip and go to dashboard
                  const updatedCompany = {
                    ...companyData,
                    onboardingCompleted: true,
                  };
                  localStorage.setItem("paintquote_company", JSON.stringify(updatedCompany));
                  router.push("/dashboard");
                }}
              >
                Skip for now
              </Button>
              <Button type="submit" disabled={isLoading || products.length === 0}>
                {isLoading ? "Saving..." : "Save & Complete Setup"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}