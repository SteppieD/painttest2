'use client'

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, 
  Palette, 
  Eye, 
  Save,
  RefreshCw,
  X,
  Check,
  Camera,
  Paintbrush
} from 'lucide-react';
import CompanyBrandingManager, { CompanyBrandingData } from '@/lib/company-branding';

interface CompanyBrandingSetupProps {
  companyId: string;
  initialData?: Partial<CompanyBrandingData>;
  onSave?: (data: Partial<CompanyBrandingData>) => void;
  onClose?: () => void;
}

export default function CompanyBrandingSetup({ 
  companyId, 
  initialData,
  onSave,
  onClose 
}: CompanyBrandingSetupProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [brandingData, setBrandingData] = useState<Partial<CompanyBrandingData>>({
    company_name: 'Professional Painting Services',
    company_tagline: 'Licensed & Insured',
    primary_color: '#3182ce',
    secondary_color: '#2d3748',
    accent_color: '#38a169',
    logo_url: '',
    ...initialData
  });

  // Color scheme suggestions
  const colorSuggestions = CompanyBrandingManager.getColorSuggestions();

  useEffect(() => {
    loadBrandingData();
  }, [companyId]);

  const loadBrandingData = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}/branding`);
      if (response.ok) {
        const data = await response.json();
        setBrandingData(data);
      }
    } catch (error) {
      console.error('Error loading branding data:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG, PNG, WebP, or SVG image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);
      formData.append('companyId', companyId);

      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setBrandingData(prev => ({
          ...prev,
          logo_url: result.logo_url
        }));
        
        toast({
          title: "Logo Uploaded!",
          description: "Your company logo has been uploaded successfully.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const applyColorScheme = (scheme: any) => {
    setBrandingData(prev => ({
      ...prev,
      primary_color: scheme.primary,
      secondary_color: scheme.secondary,
      accent_color: scheme.accent
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/companies/${companyId}/branding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandingData)
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Branding Saved!",
          description: "Your company branding has been updated successfully.",
        });
        
        if (onSave) {
          onSave(result.data);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save branding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const preview = CompanyBrandingManager.generateBrandingPreview(brandingData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Branding</h2>
          <p className="text-gray-600">Customize your logo and colors for professional quotes</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Company Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {brandingData.logo_url ? (
                  <div className="relative">
                    <img 
                      src={brandingData.logo_url} 
                      alt="Company Logo" 
                      className="w-16 h-16 object-contain border border-gray-200 rounded-lg bg-white"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={() => setBrandingData(prev => ({ ...prev, logo_url: '' }))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP, or SVG (max 5MB)
                  </p>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={brandingData.company_name || ''}
                  onChange={(e) => setBrandingData(prev => ({ 
                    ...prev, 
                    company_name: e.target.value 
                  }))}
                  placeholder="Professional Painting Services"
                />
              </div>
              
              <div>
                <Label htmlFor="company_tagline">Tagline (Optional)</Label>
                <Input
                  id="company_tagline"
                  value={brandingData.company_tagline || ''}
                  onChange={(e) => setBrandingData(prev => ({ 
                    ...prev, 
                    company_tagline: e.target.value 
                  }))}
                  placeholder="Licensed & Insured"
                />
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="w-5 h-5 text-blue-600" />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      id="primary_color"
                      value={brandingData.primary_color || '#3182ce'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        primary_color: e.target.value 
                      }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingData.primary_color || '#3182ce'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        primary_color: e.target.value 
                      }))}
                      className="flex-1"
                      placeholder="#3182ce"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      id="secondary_color"
                      value={brandingData.secondary_color || '#2d3748'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        secondary_color: e.target.value 
                      }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingData.secondary_color || '#2d3748'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        secondary_color: e.target.value 
                      }))}
                      className="flex-1"
                      placeholder="#2d3748"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      id="accent_color"
                      value={brandingData.accent_color || '#38a169'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        accent_color: e.target.value 
                      }))}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={brandingData.accent_color || '#38a169'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        accent_color: e.target.value 
                      }))}
                      className="flex-1"
                      placeholder="#38a169"
                    />
                  </div>
                </div>
              </div>

              {/* Color Scheme Suggestions */}
              <div>
                <Label className="text-sm font-medium">Quick Color Schemes</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {colorSuggestions.slice(0, 6).map((scheme, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applyColorScheme(scheme)}
                      className="justify-start h-auto p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <div 
                            className="w-3 h-3 rounded-l"
                            style={{ backgroundColor: scheme.primary }}
                          />
                          <div 
                            className="w-3 h-3"
                            style={{ backgroundColor: scheme.secondary }}
                          />
                          <div 
                            className="w-3 h-3 rounded-r"
                            style={{ backgroundColor: scheme.accent }}
                          />
                        </div>
                        <span className="text-xs">{scheme.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                dangerouslySetInnerHTML={{ __html: preview.sampleCard }}
                className="[&>div]:!margin-0"
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Branding
                </>
              )}
            </Button>
            
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}