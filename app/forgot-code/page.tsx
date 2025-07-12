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
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Access Code Found!</CardTitle>
            <CardDescription>
              We found your access code. Save it somewhere safe this time!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p>Your Access Code:</p>
              <p>{foundCode}</p>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(foundCode);
                  alert('Access code copied to clipboard!');
                }}
               
              >
                Copy to Clipboard
              </Button>
              <p>
                An email has also been sent to {email} with this code
              </p>
            </div>
            
            <Link href="/access-code">
              <Button>
                Sign In Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Your Access Code?</CardTitle>
          <CardDescription>
            Enter your email address and we'll help you recover your access code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
               
              />
              <p>
                Enter the email address you used when creating your account
              </p>
            </div>

            {error && (
              <div>
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
             
              disabled={isLoading || !email}
            >
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  <Mail />
                  Recover Access Code
                </>
              )}
            </Button>
          </form>

          <div>
            <Link
              href="/access-code"
             
            >
              <ArrowLeft />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}