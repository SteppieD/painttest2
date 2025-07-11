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
           
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        <div>
          {steps.map((step, index) => (
            <div
              key={step.id}
             
              style={{ width: `${100 / steps.length}%` }}
            >
              <div
               
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