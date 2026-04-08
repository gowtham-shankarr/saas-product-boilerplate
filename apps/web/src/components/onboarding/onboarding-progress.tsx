"use client";

import { Icon } from "@acmecorp/icons";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  progress?: any;
}

const STEP_LABELS = [
  "Welcome",
  "Organization",
  "Profile",
  "Tour",
  "Invite",
];

export function OnboardingProgress({
  currentStep,
  totalSteps,
  progress,
}: OnboardingProgressProps) {
  const getStepStatus = (stepIndex: number) => {
    if (!progress?.progress) return "pending";

    const stepProgress = progress.progress[stepIndex];
    if (!stepProgress) return "pending";

    if (stepProgress.completed) return "completed";
    if (stepProgress.skipped) return "skipped";
    if (stepIndex === currentStep) return "current";

    return "pending";
  };

  return (
    <div className="border-b border-border/80 bg-muted/20 px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="truncate text-[11px] font-medium text-foreground">
          {STEP_LABELS[currentStep]}
        </span>
      </div>
      <div
        className="flex items-center gap-1"
        role="list"
        aria-label="Onboarding progress"
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const status = getStepStatus(index);
          const isDone = status === "completed";
          const isCurrent = status === "current";
          const isSkipped = status === "skipped";

          return (
            <div key={index} className="flex min-w-0 flex-1 items-center gap-1">
              <div
                role="listitem"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                  isDone
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-primary/15 text-primary ring-2 ring-primary ring-offset-1 ring-offset-card"
                      : isSkipped
                        ? "bg-muted text-muted-foreground"
                        : "border border-border bg-background text-muted-foreground"
                }`}
              >
                {isDone ? (
                  <Icon name="check" className="h-3 w-3" />
                ) : isSkipped ? (
                  <Icon name="arrow-right" className="h-3 w-3 opacity-70" />
                ) : (
                  index + 1
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-px min-w-[2px] flex-1 rounded-full ${
                    isDone ? "bg-primary/50" : "bg-border"
                  }`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 hidden gap-1 sm:flex sm:justify-between">
        {STEP_LABELS.map((label, index) => {
          const status = getStepStatus(index);
          return (
            <span
              key={label}
              className={`max-w-[4.5rem] truncate text-center text-[10px] font-medium leading-tight ${
                status === "current"
                  ? "text-primary"
                  : status === "completed"
                    ? "text-muted-foreground"
                    : "text-muted-foreground/70"
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
