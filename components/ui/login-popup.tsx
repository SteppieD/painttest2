"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound } from "lucide-react";
import { trackAccessCodeUsed } from "@/lib/analytics/tracking";

interface LoginPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginPopup({ open, onOpenChange }: LoginPopupProps) {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode: accessCode.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Track access code usage
        trackAccessCodeUsed(accessCode.trim());
        
        // Store company info in localStorage for session management
        localStorage.setItem(
          "paintquote_company",
          JSON.stringify({
            id: data.company.id,
            accessCode: data.company.accessCode,
            name: data.company.name,
            phone: data.company.phone,
            email: data.company.email,
            logoUrl: data.company.logoUrl,
            loginTime: Date.now(),
            isNewCompany: data.isNewCompany || false,
          }),
        );

        // Check setup completion status
        const preferencesResponse = await fetch(`/api/companies/preferences?companyId=${data.company.id}`);
        const preferencesData = await preferencesResponse.json();
        const setupCompleted = preferencesData.preferences?.setup_completed;

        // Close the popup
        onOpenChange(false);
        
        // Redirect based on setup completion
        if (data.isNewCompany || !setupCompleted) {
          // New companies or companies that haven't completed setup go to conversational setup
          router.push(`/setup-chat`);
        } else {
          // Existing companies go straight to dashboard
          router.push('/dashboard');
        }
      } else {
        setError(data.message || "Invalid access code. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary-pink" />
            Enter Access Code
          </DialogTitle>
          <DialogDescription>
            Enter your company access code to access your dashboard
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="access-code">Access Code</Label>
            <Input
              id="access-code"
              type="text"
              placeholder="Enter your access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              disabled={isLoading}
              className="uppercase"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-800 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading || !accessCode.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Login"
              )}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              Don't have an access code?{" "}
              <a 
                href="/trial-signup" 
                className="text-primary-pink hover:underline font-medium"
                onClick={() => onOpenChange(false)}
              >
                Start free trial
              </a>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}