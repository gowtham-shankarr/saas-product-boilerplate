import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@acmecorp/db";
import { EmailService } from "@/lib/email";
import { z } from "zod";
import { randomBytes } from "crypto";

const invitationSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "admin"]),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a member of this organization
    const userMembership = await db.membership.findFirst({
      where: {
        orgId,
        userId: session.user.id,
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: "You don't have access to this organization" },
        { status: 403 }
      );
    }

    // Get pending invitations
    const invitations = await db.invitation.findMany({
      where: {
        orgId,
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      invitations: invitations.map((invitation: any) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = invitationSchema.parse(body);

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
        { error: "You don't have permission to invite members" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
      include: {
        memberships: {
          where: {
            orgId,
          },
        },
      },
    });

    if (existingUser?.memberships.length) {
      return NextResponse.json(
        { error: "User is already a member of this organization" },
        { status: 400 }
      );
    }

    // Check if invitation already exists
    const existingInvitation = await db.invitation.findFirst({
      where: {
        email: validatedData.email,
        orgId,
        status: "pending",
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this email" },
        { status: 400 }
      );
    }

    // Get organization and inviter details
    const organization = await db.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const inviter = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    });

    // Generate invitation token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create invitation in database
    const invitation = await db.invitation.create({
      data: {
        email: validatedData.email,
        orgId,
        role: validatedData.role,
        token,
        expiresAt,
      },
    });

    // Initialize email service
    const emailService = new EmailService(process.env.RESEND_API_KEY || "");

    // Generate invitation URL
    const invitationUrl = `${process.env.NEXTAUTH_URL}/invitations/accept?token=${token}`;

    // Send invitation email
    const emailResult = await emailService.sendInvitationEmail(
      validatedData.email,
      organization.name,
      inviter?.name || "A team member",
      validatedData.role,
      invitationUrl
    );

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      // For development, we'll still return success but log the error
      if (
        process.env.NODE_ENV === "development" ||
        !process.env.RESEND_API_KEY
      ) {
        console.log("🚀 Development mode: Invitation URL:", invitationUrl);
        console.log(
          "📧 To send real emails, get a Resend API key from resend.com"
        );
        return NextResponse.json({
          success: true,
          message:
            "Invitation created! Check console for the invitation URL to share manually.",
          invitationUrl: invitationUrl,
          messageId: "dev-mode",
        });
      }
      return NextResponse.json(
        { error: "Failed to send invitation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("Invitation error:", error);

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
