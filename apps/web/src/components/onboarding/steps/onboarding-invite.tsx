"use client";

import { useState } from "react";
import { Button, Input, Label } from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { cn } from "@/lib/utils";

interface OnboardingInviteProps {
  onComplete: (data?: any) => void;
  onSkip: () => void;
  loading: boolean;
  progress?: any;
}

export function OnboardingInvite({
  onComplete,
  onSkip,
  loading,
}: OnboardingInviteProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [message, setMessage] = useState("");

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmails = emails.filter(
      (email) => email.trim() && email.includes("@")
    );
    onComplete({ emails: validEmails, message });
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
          <Icon name="mail" className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-base font-semibold text-foreground">Invite team</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Optional — you can always invite from Settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-left">
        <div className="space-y-2">
          <Label className="text-xs">Email addresses</Label>
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1"
              />
              {emails.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveEmail(index)}
                  className="shrink-0 px-2"
                >
                  <Icon name="trash2" className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddEmail}
            className="w-full"
            size="sm"
          >
            <Icon name="plus" className="h-3.5 w-3.5" />
            Add email
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs">
            Note (optional)
          </Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Short message for the invite…"
            rows={2}
            className={cn(
              "flex min-h-[3.5rem] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Invites are sent by email. Recipients join your organization from
            the link.
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
          <Button type="submit" disabled={loading} className="flex-1" size="sm">
            {loading ? (
              <>
                <Icon name="refresh-cw" className="h-3.5 w-3.5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send invites
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
