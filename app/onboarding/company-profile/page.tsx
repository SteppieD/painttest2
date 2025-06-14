"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Phone, Mail, Globe, FileText, Shield, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function CompanyProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    companyPhone: "",
    companyEmail: "",
    companyWebsite: "",
    licenseNumber: "",
    insuranceInfo: "",
    quoteHeaderText: "",
    quoteFooterText: "Thank you for considering us for your painting project!",
    paymentTerms: "Net 30",
  });

  useEffect(() => {
    // Get company data from localStorage
    const storedCompany = localStorage.getItem("paintquote_company");
    if (storedCompany) {
      const company = JSON.parse(storedCompany);
      setCompanyData(company);
      setFormData(prev => ({
        ...prev,
        companyName: company.name || "",
        companyPhone: company.phone || "",
        companyEmail: company.email || "",
      }));
    } else {
      // Redirect to access code page if no company data
      router.push("/access-code");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll just show a placeholder message
    // In production, you'd upload to a storage service
    toast({
      title: "Logo uploaded",
      description: "Logo upload functionality will be implemented with cloud storage integration.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/company-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: companyData?.id,
          ...formData,
        }),
      });

      if (response.ok) {
        toast({
          title: "Company profile saved",
          description: "Your company information has been updated successfully.",
        });

        // Update localStorage with new company data
        const updatedCompany = {
          ...companyData,
          profileCompleted: true,
          ...formData,
        };
        localStorage.setItem("paintquote_company", JSON.stringify(updatedCompany));

        // Navigate to paint products setup
        router.push("/onboarding/paint-products");
      } else {
        throw new Error("Failed to save company profile");
      }
    } catch (error) {
      console.error("Error saving company profile:", error);
      toast({
        title: "Error",
        description: "Failed to save company profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Painting Quote Pro!</h1>
          <p className="text-gray-600 mt-2">Let's set up your company profile to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                This information will appear on your quotes and help customers identify your business.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    placeholder="ABC Painting Co."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyLogo">Company Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main St, Suite 100&#10;Anytown, ST 12345"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="companyPhone"
                    name="companyPhone"
                    type="tel"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    placeholder="info@abcpainting.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyWebsite" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website (optional)
                </Label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="url"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                  placeholder="https://www.abcpainting.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Licensing & Insurance
              </CardTitle>
              <CardDescription>
                Professional credentials that build customer trust.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="LIC#123456"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceInfo">Insurance Information</Label>
                  <Input
                    id="insuranceInfo"
                    name="insuranceInfo"
                    value={formData.insuranceInfo}
                    onChange={handleInputChange}
                    placeholder="Fully insured and bonded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quote Customization
              </CardTitle>
              <CardDescription>
                Customize how your quotes appear to customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quoteHeaderText">Quote Header Text (optional)</Label>
                <Textarea
                  id="quoteHeaderText"
                  name="quoteHeaderText"
                  value={formData.quoteHeaderText}
                  onChange={handleInputChange}
                  placeholder="Thank you for the opportunity to provide this quote..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quoteFooterText">Quote Footer Text</Label>
                <Textarea
                  id="quoteFooterText"
                  name="quoteFooterText"
                  value={formData.quoteFooterText}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  placeholder="Net 30"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Skip for now
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}