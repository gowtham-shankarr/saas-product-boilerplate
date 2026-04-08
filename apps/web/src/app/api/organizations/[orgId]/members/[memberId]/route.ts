import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { z } from "zod";

const updateMemberSchema = z.object({
  role: z.enum(["member", "admin"]),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; memberId: string }> }
) {
  try {
    const { orgId, memberId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateMemberSchema.parse(body);

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
        { error: "You don't have permission to update members" },
        { status: 403 }
      );
    }

    // Check if target member exists
    const targetMembership = await db.membership.findUnique({
      where: { id: memberId },
      include: {
        organization: { select: { id: true } },
      },
    });

    if (
      !targetMembership ||
      targetMembership.organization.id !== orgId
    ) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent changing owner role
    if (targetMembership.role === "owner") {
      return NextResponse.json(
        { error: "Cannot change owner role" },
        { status: 400 }
      );
    }

    // Update member role
    const updatedMembership = await db.membership.update({
      where: { id: memberId },
      data: { role: validatedData.role },
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
    });

    return NextResponse.json({
      success: true,
      member: {
        id: updatedMembership.id,
        role: updatedMembership.role,
        user: updatedMembership.user,
      },
    });
  } catch (error) {
    console.error("Member update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string; memberId: string }> }
) {
  try {
    const { orgId, memberId } = await params;
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
        { error: "You don't have permission to remove members" },
        { status: 403 }
      );
    }

    // Check if target member exists
    const targetMembership = await db.membership.findUnique({
      where: { id: memberId },
      include: {
        organization: { select: { id: true } },
      },
    });

    if (
      !targetMembership ||
      targetMembership.organization.id !== orgId
    ) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent removing owner
    if (targetMembership.role === "owner") {
      return NextResponse.json(
        { error: "Cannot remove organization owner" },
        { status: 400 }
      );
    }

    // Prevent removing yourself
    if (targetMembership.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot remove yourself from the organization" },
        { status: 400 }
      );
    }

    // Remove member
    await db.membership.delete({
      where: { id: memberId },
    });

    return NextResponse.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Member removal error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
