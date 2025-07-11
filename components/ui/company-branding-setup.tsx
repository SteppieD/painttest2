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
    <div>
      {/* Header */}
      <div>
        <div>
          <h2>Company Branding</h2>
          <p>Customize your logo and colors for professional quotes</p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        )}
      </div>

      <div>
        {/* Configuration Panel */}
        <div>
          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Camera />
                Company Logo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {brandingData.logo_url ? (
                  <div>
                    <img 
                      src={brandingData.logo_url} 
                      alt="Company Logo" 
                     
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                     
                      onClick={() => setBrandingData(prev => ({ ...prev, logo_url: '' }))}
                    >
                      <X />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Camera />
                  </div>
                )}
                
                <div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                   
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload />
                        Upload Logo
                      </>
                    )}
                  </Button>
                  <p>
                    JPG, PNG, WebP, or SVG (max 5MB)
                  </p>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileUpload}
               
              />
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
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
              <CardTitle>
                <Paintbrush />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div>
                    <input
                      type="color"
                      id="primary_color"
                      value={brandingData.primary_color || '#3182ce'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        primary_color: e.target.value 
                      }))}
                     
                    />
                    <Input
                      value={brandingData.primary_color || '#3182ce'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        primary_color: e.target.value 
                      }))}
                     
                      placeholder="#3182ce"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div>
                    <input
                      type="color"
                      id="secondary_color"
                      value={brandingData.secondary_color || '#2d3748'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        secondary_color: e.target.value 
                      }))}
                     
                    />
                    <Input
                      value={brandingData.secondary_color || '#2d3748'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        secondary_color: e.target.value 
                      }))}
                     
                      placeholder="#2d3748"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div>
                    <input
                      type="color"
                      id="accent_color"
                      value={brandingData.accent_color || '#38a169'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        accent_color: e.target.value 
                      }))}
                     
                    />
                    <Input
                      value={brandingData.accent_color || '#38a169'}
                      onChange={(e) => setBrandingData(prev => ({ 
                        ...prev, 
                        accent_color: e.target.value 
                      }))}
                     
                      placeholder="#38a169"
                    />
                  </div>
                </div>
              </div>

              {/* Color Scheme Suggestions */}
              <div>
                <Label>Quick Color Schemes</Label>
                <div>
                  {colorSuggestions.slice(0, 6).map((scheme, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => applyColorScheme(scheme)}
                     
                    >
                      <div>
                        <div>
                          <div 
                           
                           
                          />
                          <div 
                           
                           
                          />
                          <div 
                           
                           
                          />
                        </div>
                        <span>{scheme.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Eye />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                dangerouslySetInnerHTML={{ __html: preview.sampleCard }}
               
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div>
            <Button
              onClick={handleSave}
              disabled={isLoading}
             
            >
              {isLoading ? (
                <>
                  <RefreshCw />
                  Saving...
                </>
              ) : (
                <>
                  <Save />
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