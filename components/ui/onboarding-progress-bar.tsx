"use client";

import { CheckCircle2, Circle } from "lucide-react";
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
      <div>
        <div>
          <p>
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
          {showPercentage && (
            <p>{progressPercentage}%</p>
          )}
        </div>
        <div>
          <div
            className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div>
        {/* Progress Header */}
        <div>
          <h3>Setup Progress</h3>
          {showPercentage && (
            <div>
              <span>{progressPercentage}%</span>
              <span>Complete</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div>
            <div>
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Details */}
        <div>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                step.completed ? 'opacity-60' : step.active ? 'bg-blue-50 border-blue-200 border' : ''
              }`}
            >
              <div>
                {step.completed ? (
                  <CheckCircle2 />
                ) : step.active ? (
                  <div>
                    <div />
                  </div>
                ) : (
                  <Circle />
                )}
              </div>
              <div>
                <p>
                  {step.title}
                </p>
                {step.description && (
                  <p>
                    {step.description}
                  </p>
                )}
              </div>
              {step.completed && (
                <span>Complete</span>
              )}
              {step.active && (
                <span>In Progress</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - horizontal stepper
  return (
    <div>
      <div>
        <h3>Progress</h3>
        {showPercentage && (
          <span>{progressPercentage}% Complete</span>
        )}
      </div>
      
      <div>
        {/* Progress Line */}
        <div>
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        <div>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative z-10"
              style={{ left: `${(index / (steps.length - 1)) * 100}%` }}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium text-sm transition-all ${
                  step.completed 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}