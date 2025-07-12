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
      <div>
        <div>
          <div></div>
          <p>Loading branding settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/settings')}
              >
                <ArrowLeft />
              </Button>
              <div>
                <h1>Company Branding</h1>
                <p>Customize your professional appearance</p>
              </div>
            </div>
            
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={previewQuote}
              >
                <Eye />
                Preview Quote
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadBrandingKit}
              >
                <Download />
                Brand Kit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Settings Navigation */}
        <SettingsNavigation currentPage="branding" />
        
        {/* Benefits Banner */}
        <Card>
          <CardContent>
            <div>
              <div>
                <Palette />
              </div>
              <div>
                <h3>
                  Professional Branding Benefits
                </h3>
                <div>
                  <div>
                    <div></div>
                    <span>Build Trust & Credibility</span>
                  </div>
                  <div>
                    <div></div>
                    <span>Consistent Professional Image</span>
                  </div>
                  <div>
                    <div></div>
                    <span>Higher Quote Acceptance Rates</span>
                  </div>
                </div>
                <p>
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
        <Card>
          <CardHeader>
            <CardTitle>Where Your Branding Appears</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  📄
                </div>
                <h4>PDF Quotes</h4>
                <p>Professional PDF documents with your branding</p>
              </div>
              
              <div>
                <div>
                  📧
                </div>
                <h4>Email Templates</h4>
                <p>Branded emails for quote delivery and follow-ups</p>
              </div>
              
              <div>
                <div>
                  🌐
                </div>
                <h4>Customer Portal</h4>
                <p>Online quote viewing pages with your branding</p>
              </div>
              
              <div>
                <div>
                  🖨️
                </div>
                <h4>Print Materials</h4>
                <p>Printable quotes and proposals with your logo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}