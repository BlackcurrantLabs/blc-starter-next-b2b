import { z } from "zod";

import { prisma } from "@/app/database";
import { auth } from "@/lib/auth";
import { sendContactReplyEmail } from "@/lib/emails";
import { buildThreadHeaders } from "@/lib/email-thread-utils";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const schema = z.object({
  message: z.string().min(1).max(5000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const adminEmail = session.user.email;
  if (!adminEmail) {
    return new NextResponse("Missing admin email", { status: 400 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const query = await prisma.contactQuery.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        subject: true,
      },
    });

    if (!query) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const threadHeaders = await buildThreadHeaders(id);
    const mergedHeaders = {
      ...threadHeaders,
      // Ensure replies go to the admin who responded
      "Reply-To": adminEmail,
    };

    const result = await sendContactReplyEmail(
      query.email,
      query.subject,
      parsed.data.message,
      mergedHeaders
    );

    const messageId = result.data?.id ?? null;

    const reply = await prisma.contactReply.create({
      data: {
        id: crypto.randomUUID(),
        queryId: query.id,
        message: parsed.data.message,
        messageId,
        sentBy: adminEmail,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      replyId: reply.id,
      messageId,
    });
  } catch (error) {
    console.error("Error sending contact reply:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
