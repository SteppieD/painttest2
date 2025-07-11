"use client";

import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
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
      <div>
        <div>
          <div>
            <div 
             
             %` }}
            />
          </div>
        </div>
        <span>
          {completedCount}/{steps.length}
        </span>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div>
        {steps.map((step, index) => (
          <div key={step.id}>
            <div>
              <div>
                {step.status === "completed" && <CheckCircle2 />}
                {step.status === "active" && <Circle />}
                {step.status === "pending" && <Circle />}
                {step.status === "error" && <AlertCircle />}
              </div>
              {index < steps.length - 1 && (
                <div />
              )}
            </div>
            <div>
              <h4>
                {step.title}
              </h4>
              {step.description && (
                <p>{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default horizontal variant
  return (
    <div>
      <div>
        {steps.map((step, index) => (
          <div key={step.id}>
            <div>
              <div>
                {step.status === "completed" && <CheckCircle2 />}
                {step.status === "active" && <span>{index + 1}</span>}
                {step.status === "pending" && <span>{index + 1}</span>}
                {step.status === "error" && <AlertCircle />}
              </div>
              <span>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}