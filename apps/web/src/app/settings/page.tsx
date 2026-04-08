import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { DashboardWrapper } from "@/components/dashboard-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Settings,
  Mail,
  Shield,
  CreditCard,
} from "lucide-react";
import { TeamSection } from "@/components/organization/team-section";
import { PricingPage } from "@/components/pricing/pricing-page";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get current organization from session
  const membership = await db.membership.findFirst({
    where: {
      userId: session.user.id,
      orgId: session.user.orgId,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          status: true,
          createdAt: true,
          billingEmail: true,
        },
      },
    },
  });

  if (!membership) {
    redirect("/org");
  }

  const organization = membership.organization;

  // Get team members
  const teamMembers = await db.membership.findMany({
    where: {
      orgId: organization.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Check if user can manage invitations (owner or admin)
  const canManageInvitations =
    membership.role === "owner" || membership.role === "admin";

  return (
    <DashboardWrapper>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Settings</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 sm:gap-5 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
              <p className="max-w-lg text-sm text-muted-foreground">
                Organization details, team, and billing.
              </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Organization
                    </CardTitle>
                    <CardDescription>
                      Update your organization details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Organization Name</Label>
                        <Input
                          id="name"
                          defaultValue={organization.name}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          defaultValue={organization.slug}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input
                        id="billingEmail"
                        type="email"
                        defaultValue={organization.billingEmail || ""}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          organization.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {organization.status}
                      </Badge>
                      <Badge variant="outline">{organization.plan} plan</Badge>
                      <span className="text-sm text-muted-foreground">
                        Created{" "}
                        {new Date(organization.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <TeamSection
                  teamMembers={teamMembers}
                  organizationId={organization.id}
                  canManageInvitations={canManageInvitations}
                  currentUserId={session.user.id}
                />
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      Pricing
                    </CardTitle>
                    <CardDescription>
                      Choose the best plan for your organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PricingPage />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing & Subscription</CardTitle>
                    <CardDescription>
                      Manage your billing information and subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Current Plan</p>
                          <p className="text-sm text-muted-foreground">
                            {organization.plan} plan
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {organization.plan}
                        </Badge>
                      </div>
                      <Button variant="outline">Upgrade Plan</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      Security
                    </CardTitle>
                    <CardDescription>
                      Manage security settings for your organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Require 2FA for all team members
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Session Management</p>
                          <p className="text-sm text-muted-foreground">
                            Manage active sessions
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Sessions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardWrapper>
  );
}
