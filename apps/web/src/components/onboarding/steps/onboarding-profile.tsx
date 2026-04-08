"use client";

import { useState } from "react";
import { Button, Input, Label } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { cn } from "@/lib/utils";

const selectClass = cn(
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm",
  "shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
);

interface OnboardingProfileProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

export function OnboardingProfile({
  onComplete,
  onSkip,
  loading,
}: OnboardingProfileProps) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    department: "",
    phone: "",
    timezone: "UTC",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
          <Icon name="user" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Your profile</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Optional — helps teammates recognize you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="jobTitle" className="text-xs">
              Role
            </Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              placeholder="e.g. Engineer"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-xs">
              Department
            </Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="e.g. Product"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 …"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="timezone" className="text-xs">
              Timezone
            </Label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleInputChange("timezone", e.target.value)}
              className={selectClass}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern</option>
              <option value="America/Chicago">Central</option>
              <option value="America/Denver">Mountain</option>
              <option value="America/Los_Angeles">Pacific</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
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
          <Button type="submit" disabled={loading} className="flex-1" size="sm">
            {loading ? (
              <>
                <Icon name="refresh-cw" className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                Save
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
