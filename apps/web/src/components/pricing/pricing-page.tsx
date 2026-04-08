"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@acmecorp/ui";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, Flame } from "lucide-react";

interface PricingPlan {
  title: string;
  price: {
    monthly: string;
    yearly: string;
  };
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  enterprise?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    title: "Individuals",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "For your hobby projects",
    features: [
      "Free email alerts",
      "3-minute checks",
      "Automatic data enrichment",
      "10 monitors",
      "Up to 3 seats",
    ],
    buttonText: "Get started",
  },
  {
    title: "Teams",
    price: {
      monthly: "US$75",
      yearly: "US$49",
    },
    description: "Great for small businesses",
    features: [
      "Unlimited phone calls",
      "30 second checks",
      "Single-user account",
      "20 monitors",
      "Up to 6 seats",
    ],
    buttonText: "Get started",
    popular: true,
  },
  {
    title: "Organizations",
    price: {
      monthly: "US$100",
      yearly: "US$65",
    },
    description: "Great for large businesses",
    features: [
      "Unlimited phone calls",
      "15 second checks",
      "Single-user account",
      "50 monitors",
      "Up to 10 seats",
    ],
    buttonText: "Get started",
  },
  {
    title: "Enterprise",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For multiple teams",
    features: [
      "Everything in Organizations",
      "Up to 5 team members",
      "100 monitors",
      "15 status pages",
      "200+ integrations",
    ],
    buttonText: "Contact Us",
    enterprise: true,
  },
];

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Simple Pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the best plan for your needs
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="pricing-toggle" className="text-sm font-medium">
          Monthly
        </Label>
        <Switch
          id="pricing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="pricing-toggle" className="text-sm font-medium">
          Yearly
        </Label>
        {isYearly && (
          <Badge variant="secondary" className="ml-2">
            Save 35%
          </Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingPlans.map((plan, index) => (
          <Card
            key={plan.title}
            className={`relative ${
              plan.popular
                ? "ring-2 ring-primary shadow-lg"
                : plan.enterprise
                  ? "bg-black text-white border-black"
                  : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="flex items-center gap-1 bg-primary text-primary-foreground">
                  <Flame className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-base">{plan.title}</CardTitle>
              <div className="space-y-1">
                <div className="text-xl font-semibold tabular-nums">
                  {isYearly ? plan.price.yearly : plan.price.monthly}
                </div>
                {plan.price.monthly !== "Free" &&
                  plan.price.monthly !== "Custom" && (
                    <div className="text-sm text-muted-foreground">
                      Per month/user
                    </div>
                  )}
              </div>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.enterprise ? "bg-white text-black hover:bg-gray-100" : ""
                }`}
              >
                {plan.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
