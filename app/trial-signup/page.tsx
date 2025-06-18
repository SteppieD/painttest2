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

  const generateSuggestedCode = (companyName: string = formData.companyName) => {
    const prefix = companyName
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 6)
      .toUpperCase();
    const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return prefix + suffix;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) {
      setError("Please enter your company name to continue.");
      return;
    }

    if (!formData.email) {
      setError("Please enter your email address to receive your access code.");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address (e.g., yourname@company.com).");
      return;
    }

    if (!formData.accessCode) {
      setError("Access code generation failed. Please try typing your company name again.");
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
        if (result.error && result.error.includes("already exists")) {
          throw new Error("This company name or access code is already taken. Please try a different one.");
        } else if (result.error && result.error.includes("email")) {
          throw new Error("Please enter a valid email address.");
        } else if (result.error && result.error.includes("validation")) {
          throw new Error("Please check your information and try again.");
        } else {
          throw new Error("Account creation failed. Please try again or contact support.");
        }
      }

      setSuccess(true);
      
      // Auto-redirect to setup after 3 seconds
      setTimeout(() => {
        router.push(`/setup?code=${formData.accessCode}`);
      }, 3000);

    } catch (error: any) {
      if (error.message) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please check your internet connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate access code when company name changes
    if (field === "companyName" && value && value.length >= 3) {
      const newCode = generateSuggestedCode(value);
      setFormData(prev => ({ ...prev, accessCode: newCode }));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started in 30 Seconds</h1>
          <p className="text-gray-600">Just 2 fields to unlock your free professional quote</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start Your Free Trial</CardTitle>
            <CardDescription>
              No credit card required • Instant access • 1 free quote included
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="companyName" className="text-base font-medium">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="e.g., Elite Painting Co."
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  required
                  className="mt-2 h-12 text-base"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., mike@elitepainting.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="mt-2 h-12 text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll email you your access code and account details
                </p>
              </div>

              {formData.accessCode && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-sm font-medium text-blue-900">Your Access Code</Label>
                  <p className="text-lg font-bold text-blue-700 mt-1">{formData.accessCode}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Save this code - you'll use it to sign in after creating your account
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="font-medium text-green-900 mb-2">🎉 Your Free Trial Includes:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✅ 1 Professional Quote (No credit card required)</li>
                  <li>✅ AI Quote Assistant</li>
                  <li>✅ Full Dashboard Access</li>
                  <li>✅ Mobile & Desktop Compatible</li>
                </ul>
              </div>

              <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700" disabled={isLoading || !formData.companyName || !formData.email}>
                {isLoading ? "Creating Your Account..." : "Create Free Trial Account"}
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