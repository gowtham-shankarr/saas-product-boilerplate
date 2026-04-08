"use client";

import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const {
    showOnboarding,
    onboardingCompleted,
    loading,
    openOnboarding,
    closeOnboarding,
    completeOnboarding,
  } = useOnboarding();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="refresh-cw" className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {showOnboarding && (
        <OnboardingWizard
          isOpen={showOnboarding}
          onClose={closeOnboarding}
          onComplete={completeOnboarding}
        />
      )}

      {!showOnboarding && !onboardingCompleted && (
        <div className="fixed bottom-4 right-4 z-40 max-w-[18rem]">
          <div className="rounded-xl border border-border bg-card p-3.5 shadow-lg shadow-black/5">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon name="zap" className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Finish setup
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    Complete onboarding to unlock the full workspace.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={openOnboarding} className="h-8 flex-1 text-xs">
                    Continue
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => completeOnboarding()}
                    className="h-8 shrink-0 px-2 text-xs text-muted-foreground"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
