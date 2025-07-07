"use client";

import { useState, useEffect } from "react";
import { X, Clock, Zap, ArrowRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface TrialExpiryBannerProps {
  trialStartDate: Date;
  trialDurationDays?: number;
  quotesUsed: number;
  quotesAllowed: number;
  companyId: string;
  variant?: "minimal" | "full";
  className?: string;
  onDismiss?: () => void;
}

export function TrialExpiryBanner({
  trialStartDate,
  trialDurationDays = 14,
  quotesUsed,
  quotesAllowed,
  companyId,
  variant = "full",
  className,
  onDismiss
}: TrialExpiryBannerProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiryDate = new Date(trialStartDate);
      expiryDate.setDate(expiryDate.getDate() + trialDurationDays);
      
      const difference = expiryDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, expired: true });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft({ days, hours, minutes, expired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [trialStartDate, trialDurationDays]);

  // Check if banner was dismissed for this company
  useEffect(() => {
    const dismissedKey = `trial_banner_dismissed_${companyId}`;
    const dismissed = localStorage.getItem(dismissedKey);
    if (dismissed) {
      setIsVisible(false);
    }
  }, [companyId]);

  const handleDismiss = () => {
    setIsVisible(false);
    const dismissedKey = `trial_banner_dismissed_${companyId}`;
    localStorage.setItem(dismissedKey, "true");
    onDismiss?.();
  };

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  if (!isVisible) return null;

  const quotesRemaining = quotesAllowed - quotesUsed;
  const isUrgent = timeLeft.days <= 3 || quotesRemaining <= 2;
  const bgColor = timeLeft.expired 
    ? "bg-red-600" 
    : isUrgent 
    ? "bg-orange-600" 
    : "bg-blue-600";

  if (variant === "minimal") {
    return (
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 py-2",
        bgColor,
        className
      )}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-white text-sm">
            <Clock className="w-4 h-4" />
            <span className="font-medium">
              {timeLeft.expired 
                ? "Trial expired" 
                : `${timeLeft.days}d ${timeLeft.hours}h left`}
            </span>
            <span className="opacity-80">•</span>
            <span>{quotesRemaining} quotes remaining</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20 h-7 px-2"
              onClick={handleUpgrade}
            >
              Upgrade
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50",
      bgColor,
      className
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {timeLeft.expired 
                  ? "Your free trial has expired" 
                  : `Free trial ends in ${timeLeft.days} days`}
              </h3>
              <p className="text-sm opacity-90">
                {timeLeft.expired 
                  ? "Upgrade now to continue creating quotes" 
                  : `${quotesRemaining} of ${quotesAllowed} quotes remaining • ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m left`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleUpgrade}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white p-2"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ 
              width: `${Math.max(0, Math.min(100, ((trialDurationDays - timeLeft.days) / trialDurationDays) * 100))}%` 
            }}
          />
        </div>

        {/* Special offer for last 3 days */}
        {isUrgent && !timeLeft.expired && (
          <div className="mt-3 text-center">
            <p className="text-sm text-white/90">
              🎉 <strong>Limited Time Offer:</strong> Get 20% off your first month when you upgrade today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}