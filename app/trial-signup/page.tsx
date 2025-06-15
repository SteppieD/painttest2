"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Palette } from "lucide-react";

export default function TrialSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    accessCode: "",
    contactName: "",
    email: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const generateSuggestedCode = () => {
    const prefix = formData.companyName
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 6)
      .toUpperCase();
    const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return prefix + suffix;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.accessCode || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.accessCode.length < 4) {
      setError("Access code must be at least 4 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trial-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create trial account");
      }

      setSuccess(true);
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push(`/access-code?code=${formData.accessCode}`);
      }, 3000);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate access code when company name changes
    if (field === "companyName" && value && !formData.accessCode) {
      setFormData(prev => ({ ...prev, accessCode: generateSuggestedCode() }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Trial Account Created!</CardTitle>
            <CardDescription>
              Your free trial account is ready with 1 quote included.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Your Access Code:</p>
              <p className="text-xl font-bold text-blue-600">{formData.accessCode}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">✅ 1 Free Quote Included</p>
              <p className="mb-2">✅ Full Dashboard Access</p>
              <p className="mb-4">✅ AI-Powered Quote Generation</p>
              <p>Redirecting you to get started...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Palette className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">ProPaint Quote</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Your Free Trial</h1>
          <p className="text-gray-600">Create your account and get 1 free quote to test our system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Trial Account</CardTitle>
            <CardDescription>
              Get instant access with your custom access code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Your Painting Company"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="accessCode">Choose Your Access Code *</Label>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="YOURCODE123"
                  value={formData.accessCode}
                  onChange={(e) => handleInputChange("accessCode", e.target.value.toUpperCase())}
                  required
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be your unique code to access the system (4+ characters)
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@yourcompany.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  type="text"
                  placeholder="Your Name"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <h4 className="font-medium text-blue-900 mb-2">What's Included in Your Free Trial:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ 1 Professional Quote Generation</li>
                  <li>✅ AI-Powered Conversation Assistant</li>
                  <li>✅ Customer Dashboard Access</li>
                  <li>✅ Mobile-Responsive Interface</li>
                  <li>✅ Professional Quote Templates</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Free Trial Account"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                No credit card required • Instant access • 1 free quote included
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an access code?{" "}
            <a href="/access-code" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}