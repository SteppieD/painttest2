"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotCodePage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [foundCode, setFoundCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/recover-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.accessCode) {
        setFoundCode(data.accessCode);
        setSuccess(true);
      } else {
        setError(data.error || "No account found with this email address.");
      }
    } catch (error) {
      setError("Failed to recover access code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success && foundCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Code Found!</CardTitle>
            <CardDescription>
              We found your access code. Save it somewhere safe this time!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Your Access Code:</p>
              <p className="text-3xl font-bold text-blue-600 mb-3">{foundCode}</p>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(foundCode);
                  alert('Access code copied to clipboard!');
                }}
                className="mb-2"
              >
                Copy to Clipboard
              </Button>
              <p className="text-xs text-gray-500">
                An email has also been sent to {email} with this code
              </p>
            </div>
            
            <Link href="/access-code" className="block">
              <Button className="w-full">
                Sign In Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Your Access Code?</CardTitle>
          <CardDescription>
            Enter your email address and we'll help you recover your access code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Enter the email address you used when creating your account
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Recover Access Code
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Link
              href="/access-code"
              className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}