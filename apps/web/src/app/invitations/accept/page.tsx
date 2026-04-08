import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acmecorp/ui";
import { Icon } from "@acmecorp/icons";

interface InvitationAcceptPageProps {
  searchParams: Promise<{
    email?: string;
    org?: string;
    role?: string;
    token?: string;
  }>;
}

export default async function InvitationAcceptPage({
  searchParams,
}: InvitationAcceptPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { email, org, role, token } = await searchParams;

  if (!email || !org || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Invalid Invitation
            </CardTitle>
            <CardDescription className="text-center">
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.history.back()}>
              <Icon name="arrow-left" className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is already a member of this organization
  const existingMembership = await db.membership.findFirst({
    where: {
      organization: { slug: org },
      userId: session.user.id,
    },
    include: {
      organization: {
        select: { id: true, name: true },
      },
    },
  });

  if (existingMembership) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              Already a Member
            </CardTitle>
            <CardDescription className="text-center">
              You are already a member of this organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => (window.location.href = `/settings`)}>
              <Icon name="users" className="mr-2 h-4 w-4" />
              Go to Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if organization exists
  const organization = await db.organization.findUnique({
    where: { slug: org },
    select: { id: true, name: true },
  });

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Organization Not Found
            </CardTitle>
            <CardDescription className="text-center">
              The organization you were invited to no longer exists.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => (window.location.href = "/dashboard")}>
              <Icon name="home" className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Accept Invitation</CardTitle>
          <CardDescription className="text-center">
            You've been invited to join {organization.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              You'll be added as a <strong>{role}</strong> to{" "}
              <strong>{organization.name}</strong>
            </p>
            <p className="text-sm text-muted-foreground">Email: {email}</p>
          </div>

          <form
            action="/api/invitations/accept"
            method="POST"
            className="space-y-4"
          >
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="token" value={token} />

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Icon name="check" className="mr-2 h-4 w-4" />
                Accept Invitation
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                <Icon name="x" className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
