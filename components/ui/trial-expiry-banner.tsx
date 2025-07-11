"use client";

import { useState, useEffect } from "react";
import { X, Clock, Zap, ArrowRight } from "lucide-react";
import { Button } from "./button";
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
      <div>
        <div>
          <div>
            <Clock />
            <span>
              {timeLeft.expired 
                ? "Trial expired" 
                : `${timeLeft.days}d ${timeLeft.hours}h left`}
            </span>
            <span>•</span>
            <span>{quotesRemaining} quotes remaining</span>
          </div>
          <div>
            <Button
              size="sm"
              variant="ghost"
             
              onClick={handleUpgrade}
            >
              Upgrade
              <ArrowRight />
            </Button>
            <button
              onClick={handleDismiss}
             
            >
              <X />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div>
      <div>
        <div>
          <div>
            <div>
              <Clock />
            </div>
            <div>
              <h3>
                {timeLeft.expired 
                  ? "Your free trial has expired" 
                  : `Free trial ends in ${timeLeft.days} days`}
              </h3>
              <p>
                {timeLeft.expired 
                  ? "Upgrade now to continue creating quotes" 
                  : `${quotesRemaining} of ${quotesAllowed} quotes remaining • ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m left`}
              </p>
            </div>
          </div>
          
          <div>
            <Button
              onClick={handleUpgrade}
             
            >
              <Zap />
              Upgrade Now
            </Button>
            <button
              onClick={handleDismiss}
             
              aria-label="Dismiss banner"
            >
              <X />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div 
           
            style={{ 
              width: `${Math.max(0, Math.min(100, ((trialDurationDays - timeLeft.days) / trialDurationDays) * 100))}%` 
            }}
          />
        </div>

        {/* Special offer for last 3 days */}
        {isUrgent && !timeLeft.expired && (
          <div>
            <p>
              🎉 <strong>Limited Time Offer:</strong> Get 20% off your first month when you upgrade today!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}