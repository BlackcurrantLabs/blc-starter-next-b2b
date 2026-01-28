import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    const query = await prisma.contactQuery.findUnique({
      where: { id },
      include: {
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!query) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ query, replies: query.replies });
  } catch (error) {
    console.error("Error fetching contact query:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new NextResponse("Missing status", { status: 400 });
    }

    const updatedQuery = await prisma.contactQuery.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedQuery);
  } catch (error) {
    console.error("Error updating contact query:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
