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
import { Building2, Users, Settings, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
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
        },
      },
    },
  });

  if (!membership) {
    // User has no organization, redirect to create one
    redirect("/org");
  }

  const organization = membership.organization;

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
                    <BreadcrumbPage>Overview</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 sm:gap-5 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Welcome back, {session.user?.name || session.user?.email}. Here
                is a quick overview of your workspace.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {organization.name}
                </CardTitle>
                <CardDescription>
                  Organization • {membership.role} • {organization.plan} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      organization.status === "active" ? "default" : "secondary"
                    }
                  >
                    {organization.status}
                  </Badge>
                  <Badge variant="outline">{organization.plan}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Created{" "}
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Team
                  </CardTitle>
                  <CardDescription>
                    Manage your team and invite new members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/settings">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your organization settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    New
                  </CardTitle>
                  <CardDescription>
                    Start a new project or feature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/forms">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Form
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mt-2">
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>
                  Latest updates from your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-border/80 p-3">
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Organization created</p>
                      <p className="text-xs text-muted-foreground">
                        {organization.name} was created
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DashboardWrapper>
  );
}
