"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";
import { CreateOrganizationDialog } from "@/components/organization/create-organization-dialog";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

interface Membership {
  id: string;
  role: string;
  organization: Organization;
}

export function OrganizationSwitcher() {
  const { data: session, update } = useSession();
  const [organizations, setOrganizations] = useState<Membership[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  useEffect(() => {
    if (session?.user?.id) {
      fetchOrganizations();
    }
  }, [session?.user?.id]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.memberships);

        // Set current org from session or first org
        const currentOrgId = session?.user?.orgId;
        const current = data.memberships.find(
          (m: Membership) => m.organization.id === currentOrgId
        );
        setCurrentOrg(
          current?.organization || data.memberships[0]?.organization
        );
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrgSwitch = async (orgId: string) => {
    try {
      const response = await fetch("/api/organizations/switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orgId }),
      });

      if (response.ok) {
        // Update session with new orgId
        await update({ orgId });

        // Update current org
        const newOrg = organizations.find(
          (m) => m.organization.id === orgId
        )?.organization;
        setCurrentOrg(newOrg || null);

        // Refresh the page to update all components with new org context
        // This ensures all components that depend on session.user.orgId are updated
        window.location.reload();
      } else {
        const error = await response.json();
        console.error("Failed to switch organization:", error);
        alert(error.error || "Failed to switch organization");
      }
    } catch (error) {
      console.error("Failed to switch organization:", error);
      alert("Failed to switch organization");
    }
  };

  const { isMobile } = useSidebar();

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Icon name="refresh-cw" size={16} className="animate-spin" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
    <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Icon name="users" size={16} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {currentOrg?.name || "Select Organization"}
                  </span>
                  <span className="truncate text-xs">
                    {organizations.find(
                      (m) => m.organization.id === currentOrg?.id
                    )?.role || "Member"}
                  </span>
                </div>
                <Icon name="chevrons-up-down" size={16} className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {organizations.map((membership) => (
                <DropdownMenuItem
                  key={membership.organization.id}
                  onClick={() => handleOrgSwitch(membership.organization.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Icon name="users" size={16} className="shrink-0" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {membership.organization.name}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {membership.role}
                    </div>
                  </div>
                  {currentOrg?.id === membership.organization.id && (
                    <div className="h-2 w-2 bg-primary rounded-full" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowCreateDialog(true)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Icon name="plus" size={16} />
                </div>
                <div className="font-medium">Create organization</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => (window.location.href = "/organizations")}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Icon name="users" size={16} />
                </div>
                <div className="font-medium">All Organizations</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateOrganizationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onOrgCreated={async (newOrg) => {
          setShowCreateDialog(false);
          if (!newOrg?.id) {
            await fetchOrganizations();
            return;
          }
          try {
            const res = await fetch("/api/organizations/switch", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orgId: newOrg.id }),
            });
            if (res.ok) {
              await update({ orgId: newOrg.id });
            }
          } catch {
            /* reload still refreshes list */
          }
          window.location.reload();
        }}
      />
    </>
  );
}
