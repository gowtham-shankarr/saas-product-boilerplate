"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { Plus, Users, Building2, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import { OrganizationCard } from "@/components/organization-card";
import { CreateOrganizationDialog } from "@/components/organization/create-organization-dialog";

export default function OrganizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.id) {
      router.push("/auth/signin");
      return;
    }

    // Fetch organizations
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations");
        if (response.ok) {
          const data = await response.json();
          setMemberships(data.memberships);
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [session, status, router]);

  const handleCreateOrg = () => {
    setShowCreateDialog(true);
  };

  const onOrgCreated = (newOrg: any) => {
    setShowCreateDialog(false);
    // Refresh the organizations list
    window.location.reload();
  };

  if (status === "loading" || loading) {
    return (
      <DashboardWrapper>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading organizations...
                </p>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </DashboardWrapper>
    );
  }

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
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Organizations</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto px-4">
              <Button onClick={handleCreateOrg}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 sm:gap-5 sm:p-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight">
                Organizations
              </h1>
              <p className="max-w-lg text-sm text-muted-foreground">
                Workspaces you belong to and create.
              </p>
            </div>

            {memberships.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {memberships.map((membership: any) => (
                  <OrganizationCard
                    key={membership.organization.id}
                    membership={membership}
                    onDelete={(orgId) => {
                      // Remove from the list
                      setMemberships((prev) =>
                        prev.filter((m) => m.organization.id !== orgId)
                      );
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <CardTitle>No Organizations</CardTitle>
                  <CardDescription>
                    You don't have access to any organizations yet. Create your
                    first organization to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button onClick={handleCreateOrg} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Organization
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      <CreateOrganizationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onOrgCreated={onOrgCreated}
      />
    </DashboardWrapper>
  );
}
