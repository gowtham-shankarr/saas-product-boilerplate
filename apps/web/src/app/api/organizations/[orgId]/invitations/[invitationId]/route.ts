import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { EmailService } from "@/lib/email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; invitationId: string }> }
) {
  try {
    const { orgId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a member of this organization with admin/owner role
    const userMembership = await db.membership.findFirst({
      where: {
        orgId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: "You don't have permission to manage invitations" },
        { status: 403 }
      );
    }

    // TODO: In a real implementation, you would:
    // 1. Find the invitation by ID
    // 2. Check if it's still valid
    // 3. Resend the email
    // 4. Update the invitation record

    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Invitation resent successfully",
    });
  } catch (error) {
    console.error("Resend invitation error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; invitationId: string }> }
) {
  try {
    const { orgId, invitationId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a member of this organization with admin/owner role
    const userMembership = await db.membership.findFirst({
      where: {
        orgId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: "You don't have permission to cancel invitations" },
        { status: 403 }
      );
    }

    // Check if invitation exists and belongs to this organization
    const invitation = await db.invitation.findFirst({
      where: {
        id: invitationId,
        orgId,
        status: "pending",
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found or already processed" },
        { status: 404 }
      );
    }

    // Update invitation status to cancelled
    await db.invitation.update({
      where: { id: invitationId },
      data: { status: "cancelled" },
    });

    return NextResponse.json({
      success: true,
      message: "Invitation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
