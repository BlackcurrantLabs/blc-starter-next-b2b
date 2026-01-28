import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const RESERVED_SLUGS = ["admin", "api", "blog", "category", "new", "edit", "draft"];

const blogPostUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/).optional(),
  content: z.string().min(1).optional(),
  bannerUrl: z.string().url().optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional(),
  ogImageUrl: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  categoryId: z.string().optional(),
});

function sanitizeHtml(html: string): string {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  return purify.sanitize(html);
}

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
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching blog post:", error);
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
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const body = await req.json();
    const parseResult = blogPostUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    if (data.slug && data.slug !== existingPost.slug) {
      if (existingPost.status === "published") {
        return NextResponse.json(
          { error: "Cannot change slug of a published post" },
          { status: 400 }
        );
      }

      if (RESERVED_SLUGS.includes(data.slug)) {
        return NextResponse.json(
          { error: `Slug '${data.slug}' is reserved and cannot be used` },
          { status: 400 }
        );
      }
    }

    if (data.categoryId) {
      const category = await prisma.blogCategory.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = sanitizeHtml(data.content);
    if (data.bannerUrl !== undefined) updateData.bannerUrl = data.bannerUrl;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
    if (data.ogImageUrl !== undefined) updateData.ogImageUrl = data.ogImageUrl;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === "published" && existingPost.status !== "published") {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating blog post:", error);
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
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
