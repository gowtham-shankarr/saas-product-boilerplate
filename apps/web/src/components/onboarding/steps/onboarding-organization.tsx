"use client";

import { useState } from "react";
import { Button, Input, Label, Textarea } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { cn } from "@/lib/utils";

const selectClass = cn(
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm",
  "shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
);

interface OnboardingOrganizationProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

export function OnboardingOrganization({
  onComplete,
  loading,
}: OnboardingOrganizationProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    teamSize: "",
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
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Icon name="users" className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Organization
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Used for billing and team access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Acme Inc."
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="What does your team do?"
            rows={2}
            className="min-h-[4rem] resize-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="industry" className="text-xs">
              Industry
            </Label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              className={selectClass}
            >
              <option value="">Select…</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="teamSize" className="text-xs">
              Team size
            </Label>
            <select
              id="teamSize"
              value={formData.teamSize}
              onChange={(e) => handleInputChange("teamSize", e.target.value)}
              className={selectClass}
            >
              <option value="">Select…</option>
              <option value="1-10">1–10</option>
              <option value="11-50">11–50</option>
              <option value="51-200">51–200</option>
              <option value="201-500">201–500</option>
              <option value="500+">500+</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !formData.name}
          className="w-full"
          size="sm"
        >
          {loading ? (
            <>
              <Icon name="refresh-cw" className="h-3.5 w-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Continue
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
