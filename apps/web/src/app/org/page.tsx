import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";

export default async function OrganizationPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Get user's first organization
  const user = await db.user.findUnique({
    where: { id: session.user?.id },
    include: {
      memberships: {
        include: {
          organization: true,
        },
        take: 1,
      },
    },
  });

  if (!user?.memberships.length) {
    redirect("/dashboard");
  }

  redirect("/settings");
}
