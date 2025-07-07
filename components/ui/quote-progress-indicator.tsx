"use client";

import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuoteProgressStep {
  id: string;
  title: string;
  status: "completed" | "active" | "pending" | "error";
  description?: string;
}

interface QuoteProgressIndicatorProps {
  steps: QuoteProgressStep[];
  variant?: "horizontal" | "vertical" | "minimal";
  className?: string;
}

export function QuoteProgressIndicator({
  steps,
  variant = "horizontal",
  className
}: QuoteProgressIndicatorProps) {
  const activeIndex = steps.findIndex(step => step.status === "active");
  const completedCount = steps.filter(step => step.status === "completed").length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-gray-600">
          {completedCount}/{steps.length}
        </span>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                step.status === "completed" && "bg-green-500 text-white",
                step.status === "active" && "bg-blue-500 text-white animate-pulse",
                step.status === "pending" && "bg-gray-200 text-gray-400",
                step.status === "error" && "bg-red-500 text-white"
              )}>
                {step.status === "completed" && <CheckCircle2 className="w-5 h-5" />}
                {step.status === "active" && <Circle className="w-5 h-5 fill-current" />}
                {step.status === "pending" && <Circle className="w-5 h-5" />}
                {step.status === "error" && <AlertCircle className="w-5 h-5" />}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-0.5 h-16 mt-2",
                  step.status === "completed" ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
            <div className="flex-1 pt-1">
              <h4 className={cn(
                "font-medium",
                step.status === "completed" && "text-green-700",
                step.status === "active" && "text-blue-700",
                step.status === "pending" && "text-gray-500",
                step.status === "error" && "text-red-700"
              )}>
                {step.title}
              </h4>
              {step.description && (
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default horizontal variant
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                step.status === "completed" && "bg-green-500 text-white",
                step.status === "active" && "bg-blue-500 text-white animate-pulse",
                step.status === "pending" && "bg-gray-200 text-gray-400",
                step.status === "error" && "bg-red-500 text-white"
              )}>
                {step.status === "completed" && <CheckCircle2 className="w-6 h-6" />}
                {step.status === "active" && <span className="font-bold">{index + 1}</span>}
                {step.status === "pending" && <span>{index + 1}</span>}
                {step.status === "error" && <AlertCircle className="w-6 h-6" />}
              </div>
              <span className={cn(
                "text-xs mt-2 font-medium text-center",
                step.status === "completed" && "text-green-700",
                step.status === "active" && "text-blue-700",
                step.status === "pending" && "text-gray-500",
                step.status === "error" && "text-red-700"
              )}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 mt-[-16px]",
                steps[index + 1].status !== "pending" ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}