"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { fetchWithCSRF } from "@/lib/csrf";
import { OnboardingWelcome } from "./steps/onboarding-welcome";
import { OnboardingOrganization } from "./steps/onboarding-organization";
import { OnboardingProfile } from "./steps/onboarding-profile";
import { OnboardingTour } from "./steps/onboarding-tour";
import { OnboardingInvite } from "./steps/onboarding-invite";
import { OnboardingProgress } from "./onboarding-progress";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  { key: "welcome", component: OnboardingWelcome },
  { key: "organization", component: OnboardingOrganization },
  { key: "profile", component: OnboardingProfile },
  { key: "tour", component: OnboardingTour },
  { key: "invite", component: OnboardingInvite },
];

export function OnboardingWizard({
  isOpen,
  onClose,
  onComplete,
}: OnboardingWizardProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      loadProgress();
    }
  }, [isOpen, session?.user?.id]);

  const loadProgress = async () => {
    try {
      const response = await fetch("/api/onboarding/progress");
      const data = await response.json();
      if (data.success) {
        setProgress(data);
        const incompleteStep = data.progress.findIndex(
          (p: any) => !p.completed && !p.skipped
        );
        if (incompleteStep !== -1) {
          setCurrentStep(incompleteStep);
        }
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleNext = async (stepData?: any) => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      const currentStepKey = ONBOARDING_STEPS[currentStep].key;
      const response = await fetchWithCSRF("/api/onboarding/skip", {
        method: "POST",
        body: JSON.stringify({ step: currentStepKey }),
      });

      if (response.ok) {
        await loadProgress();
        if (currentStep < ONBOARDING_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          await handleComplete();
        }
      }
    } catch (error) {
      console.error("Error skipping step:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const currentStepKey = ONBOARDING_STEPS[currentStep].key;
      const response = await fetchWithCSRF("/api/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({ step: currentStepKey }),
      });

      if (response.ok) {
        onComplete();
        onClose();
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = async (stepData?: any) => {
    setLoading(true);
    try {
      const currentStepKey = ONBOARDING_STEPS[currentStep].key;
      const response = await fetchWithCSRF("/api/onboarding/complete", {
        method: "POST",
        body: JSON.stringify({
          step: currentStepKey,
          data: stepData,
        }),
      });

      if (response.ok) {
        await loadProgress();
        handleNext(stepData);
      }
    } catch (error) {
      console.error("Error completing step:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const CurrentStepComponent = ONBOARDING_STEPS[currentStep].component;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const canSkip = progress?.progress?.[currentStep]?.step?.required === false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="relative flex max-h-[min(88vh,36rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl shadow-black/10"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/80 px-5 py-4">
          <div className="min-w-0 space-y-0.5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Setup
            </p>
            <h2
              id="onboarding-title"
              className="truncate text-base font-semibold text-foreground"
            >
              Welcome
            </h2>
            <p className="text-xs text-muted-foreground">
              A few quick steps to get you started.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-foreground"
            aria-label="Close onboarding"
          >
            <Icon name="x" className="h-4 w-4" />
          </Button>
        </div>

        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={ONBOARDING_STEPS.length}
          progress={progress}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <CurrentStepComponent
            onComplete={handleStepComplete}
            onSkip={handleSkip}
            loading={loading}
            progress={progress}
          />
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border/80 bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={loading}
              >
                <Icon name="arrow-left" className="h-3.5 w-3.5" />
                Back
              </Button>
            )}
            {canSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Later
            </Button>
            {isLastStep && (
              <Button size="sm" onClick={handleComplete} disabled={loading}>
                {loading ? (
                  <>
                    <Icon
                      name="refresh-cw"
                      className="h-3.5 w-3.5 animate-spin"
                    />
                    Finishing…
                  </>
                ) : (
                  <>
                    <Icon name="check" className="h-3.5 w-3.5" />
                    Done
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
