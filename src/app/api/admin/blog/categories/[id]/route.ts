import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const RESERVED_SLUGS = ["admin", "api", "blog", "category", "new", "edit", "draft"];

const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  sortOrder: z.number().int().optional(),
});

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
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const body = await req.json();
    const parseResult = categoryUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    if (data.slug && RESERVED_SLUGS.includes(data.slug)) {
      return NextResponse.json(
        { error: `Slug '${data.slug}' is reserved and cannot be used` },
        { status: 400 }
      );
    }

    const nameToCheck = data.name ?? existingCategory.name;
    const slugToCheck = data.slug ?? existingCategory.slug;

    const duplicateCategory = await prisma.blogCategory.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ name: nameToCheck }, { slug: slugToCheck }],
          },
        ],
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const category = await prisma.blogCategory.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error updating blog category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
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
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        posts: {
          select: { id: true },
        },
      },
    });

    if (!existingCategory) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (existingCategory.posts.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with posts" },
        { status: 400 }
      );
    }

    await prisma.blogCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
