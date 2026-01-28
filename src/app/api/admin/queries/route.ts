import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const queries = await prisma.contactQuery.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true,
        message: true,
      },
    });

    return NextResponse.json({ queries });
  } catch (error) {
    console.error("Error fetching contact queries:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
