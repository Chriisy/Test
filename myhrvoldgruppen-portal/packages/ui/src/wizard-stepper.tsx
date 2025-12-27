"use client";

import { Check } from "lucide-react";
import { cn } from "./cn";

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function WizardStepper({ steps, currentStep, onStepClick }: WizardStepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <li key={step.id} className="relative flex flex-1 flex-col items-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 top-4 h-0.5 w-full -translate-y-1/2",
                    isCompleted ? "bg-teal-600" : "bg-gray-200"
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Step circle */}
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-teal-600 bg-teal-600 text-white",
                  isCurrent && "border-teal-600 bg-white text-teal-600",
                  !isCompleted && !isCurrent && "border-gray-300 bg-white text-gray-500",
                  isClickable && "cursor-pointer hover:bg-teal-50",
                  !isClickable && "cursor-default"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </button>

              {/* Step label */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-teal-600" : isCompleted ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface WizardActionsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  nextDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
}

export function WizardActions({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
  nextDisabled = false,
  previousLabel = "Forrige",
  nextLabel = "Neste",
  submitLabel = "Opprett reklamasjon",
}: WizardActionsProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="mt-8 flex items-center justify-between border-t pt-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          isFirstStep
            ? "cursor-not-allowed text-gray-400"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        {previousLabel}
      </button>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || nextDisabled}
          className={cn(
            "rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white transition-colors",
            isSubmitting || nextDisabled
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-teal-700"
          )}
        >
          {isSubmitting ? "Oppretter..." : submitLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            "rounded-lg bg-teal-600 px-6 py-2 text-sm font-medium text-white transition-colors",
            nextDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-teal-700"
          )}
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
