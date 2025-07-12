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
    <div>
      <div>
        <div>
          <h1>Welcome to Painting Quote Pro!</h1>
          <p>Let's set up your company profile to get started.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Building2 />
                Company Information
              </CardTitle>
              <CardDescription>
                This information will appear on your quotes and help customers identify your business.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div>
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

                <div>
                  <Label htmlFor="companyLogo">Company Logo</Label>
                  <div>
                    <Input
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                     
                    />
                  </div>
                </div>
              </div>

              <div>
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

              <div>
                <div>
                  <Label htmlFor="companyPhone">
                    <Phone />
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

                <div>
                  <Label htmlFor="companyEmail">
                    <Mail />
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

              <div>
                <Label htmlFor="companyWebsite">
                  <Globe />
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
              <CardTitle>
                <Shield />
                Licensing & Insurance
              </CardTitle>
              <CardDescription>
                Professional credentials that build customer trust.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="LIC#123456"
                  />
                </div>

                <div>
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
              <CardTitle>
                <FileText />
                Quote Customization
              </CardTitle>
              <CardDescription>
                Customize how your quotes appear to customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
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

              <div>
                <Label htmlFor="quoteFooterText">Quote Footer Text</Label>
                <Textarea
                  id="quoteFooterText"
                  name="quoteFooterText"
                  value={formData.quoteFooterText}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div>
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

          <div>
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