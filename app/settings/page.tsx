"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Settings, Palette, Plus, Trash2, Edit3, Upload, Building2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import SettingsNavigation from "@/components/ui/settings-navigation";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface CompanySettings {
  default_walls_rate: number;
  default_ceilings_rate: number;
  default_trim_rate: number;
  default_walls_paint_cost: number;
  default_ceilings_paint_cost: number;
  default_trim_paint_cost: number;
  default_labor_percentage: number;
  default_paint_coverage: number;
  default_sundries_percentage: number;
  tax_rate: number;
  tax_on_materials_only: boolean;
  tax_label: string;
  // New contractor constants
  overhead_percentage: number;
  default_markup_percentage: number;
  ceiling_height: number;
  paint_multiplier: number;
  doors_per_gallon: number;
  windows_per_gallon: number;
  // Company branding
  logo_url?: string;
  
  // Product-Specific Spread Rates (from AI conversations)
  primer_spread_rate: number; // 200-300 sqft/gallon
  wall_paint_spread_rate: number; // 350-400 sqft/gallon  
  ceiling_paint_spread_rate: number; // 350 sqft/gallon
  trim_doors_per_gallon: number; // 4-5 doors per gallon
  trim_windows_per_gallon: number; // 2-3 windows per gallon
  
  // All-In Labor Rates (includes materials + labor from AI)
  wall_allin_rate_per_sqft: number; // e.g., $1.50
  ceiling_allin_rate_per_sqft: number; // e.g., $1.25
  primer_allin_rate_per_sqft: number; // e.g., $0.45
  door_allin_rate_each: number; // e.g., $150
  window_allin_rate_each: number; // e.g., $100
  
  // Product Preferences (contractor's go-to products from AI)
  preferred_primer_brand: string; // "Kilz"
  preferred_primer_product: string; // "PVA Primer"
  preferred_wall_paint_brand: string; // "Sherwin Williams"
  preferred_wall_paint_product: string; // "ProClassic"
  preferred_ceiling_paint_brand: string; // "Benjamin Moore"
  preferred_ceiling_paint_product: string; // "Waterborne Ceiling"
  preferred_trim_paint_brand: string; // "Sherwin Williams"
  preferred_trim_paint_product: string; // "ProClassic Semi-Gloss"
  
  // AI Learning Settings
  ai_learning_enabled: boolean; // Auto-save conversation data to settings
  ai_ask_before_saving: boolean; // Ask before saving new preferences
}

interface PaintBrand {
  id: string;
  brand_name: string;
  product_name: string;
  cost_per_gallon: number;
  quality_grade: 'good' | 'better' | 'best';
  coverage_sqft: number;
  notes?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [paints, setPaints] = useState<PaintBrand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [editingPaint, setEditingPaint] = useState<PaintBrand | null>(null);
  const [showAddPaint, setShowAddPaint] = useState(false);

  useEffect(() => {
    // Check authentication
    const company = localStorage.getItem("paintquote_company");
    if (!company) {
      router.push("/access-code");
      return;
    }

    try {
      const parsedCompany = JSON.parse(company);
      if (Date.now() - parsedCompany.loginTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("paintquote_company");
        router.push("/access-code");
        return;
      }
      setCompanyData(parsedCompany);
      loadSettings(parsedCompany.id);
      loadPaints(parsedCompany.id);
    } catch (e) {
      router.push("/access-code");
    }
  }, [router]);

  const loadSettings = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/settings?companyId=${companyId}`);
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPaints = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/paints?companyId=${companyId}`);
      const data = await response.json();
      setPaints(data.paints || []);
    } catch (error) {
      console.error('Error loading paints:', error);
    }
  };

  const saveSettings = async () => {
    if (!settings || !companyData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/companies/settings?companyId=${companyData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast({
          title: "Settings saved!",
          description: "Your company settings have been updated.",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const savePaint = async (paintData: PaintBrand) => {
    try {
      const method = paintData.id ? 'PUT' : 'POST';
      const response = await fetch(`/api/companies/paints?companyId=${companyData.id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paintData)
      });

      if (response.ok) {
        loadPaints(companyData.id);
        setEditingPaint(null);
        setShowAddPaint(false);
        toast({
          title: "Paint saved!",
          description: `${paintData.brand_name} ${paintData.product_name} has been saved.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save paint. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deletePaint = async (paintId: string) => {
    try {
      const response = await fetch(`/api/companies/paints?companyId=${companyData.id}&paintId=${paintId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadPaints(companyData.id);
        toast({
          title: "Paint deleted!",
          description: "The paint has been removed from your collection.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete paint. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateSetting = (key: keyof CompanySettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const PaintForm = ({ paint, onSave, onCancel }: { 
    paint?: PaintBrand | null; 
    onSave: (paint: PaintBrand) => void; 
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<PaintBrand>(
      paint || {
        id: '',
        brand_name: '',
        product_name: '',
        cost_per_gallon: 0,
        quality_grade: 'good',
        coverage_sqft: 350,
        notes: ''
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.brand_name || !formData.product_name || !formData.cost_per_gallon) {
        toast({
          title: "Missing Information",
          description: "Please fill in brand name, product name, and cost per gallon.",
          variant: "destructive",
        });
        return;
      }
      onSave({ ...formData, id: formData.id || `paint_${Date.now()}` });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand_name">Brand Name *</Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
              placeholder="e.g., Sherwin Williams"
              required
            />
          </div>
          <div>
            <Label htmlFor="product_name">Product Name *</Label>
            <Input
              id="product_name"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              placeholder="e.g., ProClassic Interior"
              required
            />
          </div>
          <div>
            <Label htmlFor="cost_per_gallon">Cost per Gallon *</Label>
            <Input
              id="cost_per_gallon"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost_per_gallon}
              onChange={(e) => setFormData({ ...formData, cost_per_gallon: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="quality_grade">Quality Grade</Label>
            <select
              id="quality_grade"
              value={formData.quality_grade}
              onChange={(e) => setFormData({ ...formData, quality_grade: e.target.value as 'good' | 'better' | 'best' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="good">Good</option>
              <option value="better">Better</option>
              <option value="best">Best</option>
            </select>
          </div>
          <div>
            <Label htmlFor="coverage_sqft">Coverage (sq ft/gallon)</Label>
            <Input
              id="coverage_sqft"
              type="number"
              min="200"
              max="500"
              value={formData.coverage_sqft}
              onChange={(e) => setFormData({ ...formData, coverage_sqft: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special notes..."
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {paint ? 'Update Paint' : 'Add Paint'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Settings not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Company Settings</h1>
                <p className="text-sm text-gray-500">{companyData?.company_name}</p>
              </div>
            </div>
            
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Settings Navigation */}
        <SettingsNavigation currentPage="general" />
        
        {/* Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Tax Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={settings.tax_rate}
                  onChange={(e) => updateSetting('tax_rate', Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="tax-label">Tax Label</Label>
                <Input
                  id="tax-label"
                  value={settings.tax_label}
                  onChange={(e) => updateSetting('tax_label', e.target.value)}
                  placeholder="e.g., HST, GST, Sales Tax"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tax-materials-only"
                checked={settings.tax_on_materials_only}
                onCheckedChange={(checked) => updateSetting('tax_on_materials_only', checked)}
              />
              <Label htmlFor="tax-materials-only">
                Apply tax to materials only (not labor)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Company Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Company Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="logo-url">Company Logo URL</Label>
              <Input
                id="logo-url"
                type="url"
                value={settings.logo_url || ''}
                onChange={(e) => updateSetting('logo_url', e.target.value)}
                placeholder="https://example.com/your-logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a URL to your company logo. This will appear on customer quotes and make your business look more professional.
              </p>
            </div>
            
            {/* Logo Preview */}
            {settings.logo_url && (
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 shrink-0">
                    <img 
                      src={settings.logo_url} 
                      alt="Company Logo Preview"
                      className="w-16 h-16 rounded-lg object-cover border shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{companyData?.company_name}</p>
                    <p className="text-sm text-gray-600">This is how your logo will appear on customer quotes</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a square or rectangular logo (recommended: 200x200px or larger)</li>
                <li>• Ensure the image URL is publicly accessible</li>
                <li>• PNG or JPG formats work best</li>
                <li>• Keep file size under 1MB for faster loading</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contractor Constants */}
        <Card>
          <CardHeader>
            <CardTitle>Contractor Constants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Business Settings</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overhead-percentage">Overhead Percentage (%)</Label>
                  <Input
                    id="overhead-percentage"
                    type="number"
                    min="0"
                    max="50"
                    value={settings.overhead_percentage || 10}
                    onChange={(e) => updateSetting('overhead_percentage', Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Applied to materials + labor</p>
                </div>
                <div>
                  <Label htmlFor="default-markup">Default Markup (%)</Label>
                  <Input
                    id="default-markup"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.default_markup_percentage || 20}
                    onChange={(e) => updateSetting('default_markup_percentage', Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Your standard profit margin</p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Project Constants</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ceiling-height">Standard Ceiling Height (ft)</Label>
                  <Input
                    id="ceiling-height"
                    type="number"
                    min="8"
                    max="12"
                    step="0.5"
                    value={settings.ceiling_height || 9}
                    onChange={(e) => updateSetting('ceiling_height', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="paint-multiplier">Paint Coverage Multiplier</Label>
                  <Input
                    id="paint-multiplier"
                    type="number"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={settings.paint_multiplier || 1.8}
                    onChange={(e) => updateSetting('paint_multiplier', Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">For 2-coat coverage</p>
                </div>
                <div>
                  <Label htmlFor="paint-coverage">Paint Coverage (sq ft/gallon)</Label>
                  <Input
                    id="paint-coverage"
                    type="number"
                    min="200"
                    max="500"
                    value={settings.default_paint_coverage}
                    onChange={(e) => updateSetting('default_paint_coverage', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Door & Window Constants</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doors-per-gallon">Doors per Gallon</Label>
                  <Input
                    id="doors-per-gallon"
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={settings.doors_per_gallon || 4.5}
                    onChange={(e) => updateSetting('doors_per_gallon', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="windows-per-gallon">Windows per Gallon</Label>
                  <Input
                    id="windows-per-gallon"
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={settings.windows_per_gallon || 2.5}
                    onChange={(e) => updateSetting('windows_per_gallon', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Labor & Sundries</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labor-percentage">Labor Percentage (%)</Label>
                  <Input
                    id="labor-percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.default_labor_percentage}
                    onChange={(e) => updateSetting('default_labor_percentage', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="sundries-percentage">Sundries Percentage (%)</Label>
                  <Input
                    id="sundries-percentage"
                    type="number"
                    min="0"
                    max="50"
                    value={settings.default_sundries_percentage}
                    onChange={(e) => updateSetting('default_sundries_percentage', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product-Specific Spread Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-green-600" />
              Product Spread Rates (From AI Conversations)
            </CardTitle>
            <p className="text-sm text-gray-600">Coverage rates for specific product types learned from your conversations</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primer-spread-rate">Primer Spread Rate (sqft/gallon)</Label>
                <Input
                  id="primer-spread-rate"
                  type="number"
                  min="200"
                  max="300"
                  value={settings.primer_spread_rate || 250}
                  onChange={(e) => updateSetting('primer_spread_rate', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Typical range: 200-300 sqft/gallon</p>
              </div>
              <div>
                <Label htmlFor="wall-paint-spread-rate">Wall Paint Spread Rate (sqft/gallon)</Label>
                <Input
                  id="wall-paint-spread-rate"
                  type="number"
                  min="300"
                  max="450"
                  value={settings.wall_paint_spread_rate || 375}
                  onChange={(e) => updateSetting('wall_paint_spread_rate', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Typical range: 350-400 sqft/gallon</p>
              </div>
              <div>
                <Label htmlFor="ceiling-paint-spread-rate">Ceiling Paint Spread Rate (sqft/gallon)</Label>
                <Input
                  id="ceiling-paint-spread-rate"
                  type="number"
                  min="300"
                  max="400"
                  value={settings.ceiling_paint_spread_rate || 350}
                  onChange={(e) => updateSetting('ceiling_paint_spread_rate', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Typical: 350 sqft/gallon</p>
              </div>
              <div>
                <Label htmlFor="trim-doors-per-gallon">Trim: Doors per Gallon</Label>
                <Input
                  id="trim-doors-per-gallon"
                  type="number"
                  min="3"
                  max="6"
                  step="0.5"
                  value={settings.trim_doors_per_gallon || 4.5}
                  onChange={(e) => updateSetting('trim_doors_per_gallon', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Typical range: 4-5 doors/gallon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All-In Labor Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              All-In Labor Rates (Materials + Labor)
            </CardTitle>
            <p className="text-sm text-gray-600">Your rates that include both materials and labor costs</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wall-allin-rate">Walls (per sqft, 2 coats + paint)</Label>
                <Input
                  id="wall-allin-rate"
                  type="number"
                  min="0.50"
                  max="5.00"
                  step="0.05"
                  value={settings.wall_allin_rate_per_sqft || 1.50}
                  onChange={(e) => updateSetting('wall_allin_rate_per_sqft', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Example: $1.50/sqft</p>
              </div>
              <div>
                <Label htmlFor="ceiling-allin-rate">Ceilings (per sqft, 2 coats + paint)</Label>
                <Input
                  id="ceiling-allin-rate"
                  type="number"
                  min="0.50"
                  max="5.00"
                  step="0.05"
                  value={settings.ceiling_allin_rate_per_sqft || 1.25}
                  onChange={(e) => updateSetting('ceiling_allin_rate_per_sqft', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Example: $1.25/sqft</p>
              </div>
              <div>
                <Label htmlFor="primer-allin-rate">Primer (per sqft, 1 coat)</Label>
                <Input
                  id="primer-allin-rate"
                  type="number"
                  min="0.25"
                  max="2.00"
                  step="0.05"
                  value={settings.primer_allin_rate_per_sqft || 0.45}
                  onChange={(e) => updateSetting('primer_allin_rate_per_sqft', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Example: $0.45/sqft</p>
              </div>
              <div>
                <Label htmlFor="door-allin-rate">Doors + Trim (each, 2 coats)</Label>
                <Input
                  id="door-allin-rate"
                  type="number"
                  min="50"
                  max="400"
                  step="5"
                  value={settings.door_allin_rate_each || 150}
                  onChange={(e) => updateSetting('door_allin_rate_each', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Example: $150/door</p>
              </div>
              <div>
                <Label htmlFor="window-allin-rate">Windows (each, 2 coats)</Label>
                <Input
                  id="window-allin-rate"
                  type="number"
                  min="25"
                  max="300"
                  step="5"
                  value={settings.window_allin_rate_each || 100}
                  onChange={(e) => updateSetting('window_allin_rate_each', Number(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">Example: $100/window</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Your Preferred Products (From AI Learning)
            </CardTitle>
            <p className="text-sm text-gray-600">Your go-to products learned from conversations - used to pre-fill quotes</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Primer Preferences</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred-primer-brand">Preferred Primer Brand</Label>
                  <Input
                    id="preferred-primer-brand"
                    value={settings.preferred_primer_brand || ''}
                    onChange={(e) => updateSetting('preferred_primer_brand', e.target.value)}
                    placeholder="e.g., Kilz, Zinsser"
                  />
                </div>
                <div>
                  <Label htmlFor="preferred-primer-product">Preferred Primer Product</Label>
                  <Input
                    id="preferred-primer-product"
                    value={settings.preferred_primer_product || ''}
                    onChange={(e) => updateSetting('preferred_primer_product', e.target.value)}
                    placeholder="e.g., PVA Primer"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Wall Paint Preferences</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred-wall-brand">Preferred Wall Paint Brand</Label>
                  <Input
                    id="preferred-wall-brand"
                    value={settings.preferred_wall_paint_brand || ''}
                    onChange={(e) => updateSetting('preferred_wall_paint_brand', e.target.value)}
                    placeholder="e.g., Sherwin Williams"
                  />
                </div>
                <div>
                  <Label htmlFor="preferred-wall-product">Preferred Wall Paint Product</Label>
                  <Input
                    id="preferred-wall-product"
                    value={settings.preferred_wall_paint_product || ''}
                    onChange={(e) => updateSetting('preferred_wall_paint_product', e.target.value)}
                    placeholder="e.g., ProClassic"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Ceiling Paint Preferences</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred-ceiling-brand">Preferred Ceiling Paint Brand</Label>
                  <Input
                    id="preferred-ceiling-brand"
                    value={settings.preferred_ceiling_paint_brand || ''}
                    onChange={(e) => updateSetting('preferred_ceiling_paint_brand', e.target.value)}
                    placeholder="e.g., Benjamin Moore"
                  />
                </div>
                <div>
                  <Label htmlFor="preferred-ceiling-product">Preferred Ceiling Paint Product</Label>
                  <Input
                    id="preferred-ceiling-product"
                    value={settings.preferred_ceiling_paint_product || ''}
                    onChange={(e) => updateSetting('preferred_ceiling_paint_product', e.target.value)}
                    placeholder="e.g., Waterborne Ceiling"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Trim Paint Preferences</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred-trim-brand">Preferred Trim Paint Brand</Label>
                  <Input
                    id="preferred-trim-brand"
                    value={settings.preferred_trim_paint_brand || ''}
                    onChange={(e) => updateSetting('preferred_trim_paint_brand', e.target.value)}
                    placeholder="e.g., Sherwin Williams"
                  />
                </div>
                <div>
                  <Label htmlFor="preferred-trim-product">Preferred Trim Paint Product</Label>
                  <Input
                    id="preferred-trim-product"
                    value={settings.preferred_trim_paint_product || ''}
                    onChange={(e) => updateSetting('preferred_trim_paint_product', e.target.value)}
                    placeholder="e.g., ProClassic Semi-Gloss"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Learning Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-600" />
              AI Learning Preferences
            </CardTitle>
            <p className="text-sm text-gray-600">Control how the AI learns and saves information from your conversations</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai-learning-enabled"
                checked={settings.ai_learning_enabled !== false}
                onCheckedChange={(checked) => updateSetting('ai_learning_enabled', checked)}
              />
              <Label htmlFor="ai-learning-enabled">
                Enable AI learning from conversations
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">Allow AI to automatically detect and save new products, rates, and preferences from quote conversations</p>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ai-ask-before-saving"
                checked={settings.ai_ask_before_saving !== false}
                onCheckedChange={(checked) => updateSetting('ai_ask_before_saving', checked)}
              />
              <Label htmlFor="ai-ask-before-saving">
                Ask before saving new preferences
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">AI will ask for confirmation before saving new products or changing existing preferences</p>
          </CardContent>
        </Card>

        {/* Paint Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                Your Paint Collection
              </span>
              <Button
                onClick={() => setShowAddPaint(true)}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Paint
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddPaint && (
              <PaintForm
                onSave={savePaint}
                onCancel={() => setShowAddPaint(false)}
              />
            )}

            {editingPaint && (
              <PaintForm
                paint={editingPaint}
                onSave={savePaint}
                onCancel={() => setEditingPaint(null)}
              />
            )}

            {paints.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No paints in your collection yet.</p>
                <p className="text-sm">Add your most-used paints for quick reference.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paints.map((paint) => (
                  <div key={paint.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{paint.brand_name}</h3>
                        <p className="text-sm text-gray-600">{paint.product_name}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPaint(paint)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePaint(paint.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-medium">${paint.cost_per_gallon}/gal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality:</span>
                        <span className="capitalize">{paint.quality_grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coverage:</span>
                        <span>{paint.coverage_sqft} sq ft/gal</span>
                      </div>
                      {paint.notes && (
                        <div className="pt-2 text-xs text-gray-500">
                          {paint.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}