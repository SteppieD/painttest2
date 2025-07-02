'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Palette, Eye, Download } from 'lucide-react';
import CompanyBrandingSetup from '@/components/ui/company-branding-setup';
import SettingsNavigation from '@/components/ui/settings-navigation';
import { CompanyBrandingData } from '@/lib/company-branding';

export default function BrandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState<string>('');
  const [brandingData, setBrandingData] = useState<Partial<CompanyBrandingData> | null>(null);

  useEffect(() => {
    // Get company ID from localStorage or session
    const storedCompanyId = localStorage.getItem('company_id') || 'demo-company';
    setCompanyId(storedCompanyId);
  }, []);

  const handleBrandingSave = (data: Partial<CompanyBrandingData>) => {
    setBrandingData(data);
    toast({
      title: "Branding Updated!",
      description: "Your professional branding has been saved. It will now appear on all quotes and emails.",
    });
  };

  const previewQuote = () => {
    // Navigate to a demo quote with the new branding
    window.open('/quotes/demo/customer', '_blank');
  };

  const downloadBrandingKit = () => {
    toast({
      title: "Coming Soon",
      description: "Brand kit download will be available in the next update.",
    });
  };

  if (!companyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading branding settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/settings')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Company Branding</h1>
                <p className="text-sm text-gray-500">Customize your professional appearance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previewQuote}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Quote
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadBrandingKit}
              >
                <Download className="w-4 h-4 mr-2" />
                Brand Kit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 py-8">
        {/* Settings Navigation */}
        <SettingsNavigation currentPage="branding" />
        
        {/* Benefits Banner */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Professional Branding Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Build Trust & Credibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Consistent Professional Image</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Higher Quote Acceptance Rates</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-3">
                  Your logo and colors will appear on all quotes, emails, and customer communications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Setup Component */}
        <CompanyBrandingSetup
          companyId={companyId}
          initialData={brandingData || undefined}
          onSave={handleBrandingSave}
        />

        {/* Usage Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Where Your Branding Appears</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  📄
                </div>
                <h4 className="font-medium text-gray-900 mb-1">PDF Quotes</h4>
                <p className="text-sm text-gray-600">Professional PDF documents with your branding</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  📧
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Email Templates</h4>
                <p className="text-sm text-gray-600">Branded emails for quote delivery and follow-ups</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  🌐
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Customer Portal</h4>
                <p className="text-sm text-gray-600">Online quote viewing pages with your branding</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  🖨️
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Print Materials</h4>
                <p className="text-sm text-gray-600">Printable quotes and proposals with your logo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}