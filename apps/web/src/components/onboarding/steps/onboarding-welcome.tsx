"use client";

import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface OnboardingWelcomeProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

export function OnboardingWelcome({
  onComplete,
  loading,
}: OnboardingWelcomeProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Icon name="zap" className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground">
          You&apos;re in
        </h3>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
          We&apos;ll walk through workspace setup in under two minutes.
        </p>
      </div>

      <div className="grid gap-2 text-left sm:grid-cols-3">
        {[
          {
            icon: "users" as const,
            title: "Organization",
            desc: "Name your workspace",
          },
          {
            icon: "user" as const,
            title: "Profile",
            desc: "Optional details",
          },
          {
            icon: "mail" as const,
            title: "Invite",
            desc: "Add teammates",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border/80 bg-muted/30 px-3 py-2.5"
          >
            <div className="mb-1 flex items-center gap-2">
              <Icon name={item.icon} className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">
                {item.title}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={() => onComplete()}
        disabled={loading}
        className="w-full sm:w-auto"
        size="sm"
      >
        {loading ? (
          <>
            <Icon name="refresh-cw" className="h-3.5 w-3.5 animate-spin" />
            Starting…
          </>
        ) : (
          <>
            Continue
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </>
        )}
      </Button>
    </div>
  );
}
