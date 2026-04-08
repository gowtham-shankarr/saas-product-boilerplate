"use client";

import { Button } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface OnboardingTourProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

const highlights = [
  {
    icon: "users" as const,
    title: "Team",
    body: "Roles, invites, and membership.",
  },
  {
    icon: "settings" as const,
    title: "Settings",
    body: "Workspace name, billing, and security.",
  },
  {
    icon: "user" as const,
    title: "Profile",
    body: "Your account and preferences.",
  },
  {
    icon: "help-circle" as const,
    title: "Help",
    body: "Docs and support when you need them.",
  },
];

export function OnboardingTour({
  onComplete,
  onSkip,
  loading,
}: OnboardingTourProps) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
          <Icon name="map" className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Product tour</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Where to find the essentials.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {highlights.map((h) => (
          <li
            key={h.title}
            className="rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5"
          >
            <div className="mb-1 flex items-center gap-1.5">
              <Icon name={h.icon} className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">{h.title}</span>
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">
              {h.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-left">
        <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          You can reopen setup anytime from the dashboard reminder.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          disabled={loading}
          className="flex-1"
          size="sm"
        >
          Skip
        </Button>
        <Button
          onClick={() => onComplete()}
          disabled={loading}
          className="flex-1"
          size="sm"
        >
          {loading ? (
            <>
              <Icon name="refresh-cw" className="h-3.5 w-3.5 animate-spin" />
              …
            </>
          ) : (
            <>
              Continue
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
