"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  active?: boolean;
}

interface OnboardingProgressBarProps {
  steps: OnboardingStep[];
  variant?: "default" | "compact" | "detailed";
  showPercentage?: boolean;
  animated?: boolean;
}

export function OnboardingProgressBar({
  steps,
  variant = "default",
  showPercentage = true,
  animated = true,
}: OnboardingProgressBarProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  const currentStepIndex = steps.findIndex(step => step.active) || completedSteps;

  if (variant === "compact") {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
          {showPercentage && (
            <p className="text-sm font-medium text-gray-700">{progressPercentage}%</p>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full",
              animated && "transition-all duration-500 ease-out"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className="w-full space-y-4">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Setup Progress</h3>
          {showPercentage && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
              <span className="text-sm text-gray-500">Complete</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  "h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full",
                  animated && "transition-all duration-500 ease-out"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Details */}
        <div className="space-y-3 mt-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all",
                step.completed && "bg-green-50",
                step.active && "bg-blue-50 ring-2 ring-blue-500 ring-opacity-50",
                !step.completed && !step.active && "bg-gray-50 opacity-60"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : step.active ? (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-600">
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "font-medium",
                  step.completed && "text-green-900",
                  step.active && "text-blue-900",
                  !step.completed && !step.active && "text-gray-500"
                )}>
                  {step.title}
                </p>
                {step.description && (
                  <p className={cn(
                    "text-sm mt-0.5",
                    step.completed && "text-green-700",
                    step.active && "text-blue-700",
                    !step.completed && !step.active && "text-gray-400"
                  )}>
                    {step.description}
                  </p>
                )}
              </div>
              {step.completed && (
                <span className="text-xs text-green-600 font-medium">Complete</span>
              )}
              {step.active && (
                <span className="text-xs text-blue-600 font-medium animate-pulse">In Progress</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - horizontal stepper
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Progress</h3>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">{progressPercentage}% Complete</span>
        )}
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className={cn(
              "h-full bg-blue-600",
              animated && "transition-all duration-500 ease-out"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all",
                  step.completed && "bg-blue-600 text-white",
                  step.active && "bg-white border-2 border-blue-600 text-blue-600",
                  !step.completed && !step.active && "bg-gray-200 text-gray-400"
                )}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <p className={cn(
                "text-xs mt-2 text-center max-w-[100px]",
                step.completed && "text-gray-900 font-medium",
                step.active && "text-blue-600 font-medium",
                !step.completed && !step.active && "text-gray-400"
              )}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}