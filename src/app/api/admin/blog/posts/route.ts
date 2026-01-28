import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const RESERVED_SLUGS = ["admin", "api", "blog", "category", "new", "edit", "draft"];

const blogPostCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  bannerUrl: z.string().url().optional(),
  excerpt: z.string().max(500).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160),
  ogImageUrl: z.string().url().optional(),
  status: z.enum(["draft", "published", "archived"]),
  categoryId: z.string(),
});

function sanitizeHtml(html: string): string {
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  return purify.sanitize(html);
}

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function generateExcerpt(content: string, maxLength: number = 300): string {
  const text = stripHtmlTags(content);
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
}

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const categoryId = url.searchParams.get("categoryId");

    const where: Record<string, string> = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
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

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = blogPostCreateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    if (RESERVED_SLUGS.includes(data.slug)) {
      return NextResponse.json(
        { error: `Slug '${data.slug}' is reserved and cannot be used` },
        { status: 400 }
      );
    }

    const category = await prisma.blogCategory.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const sanitizedContent = sanitizeHtml(data.content);
    const excerpt = data.excerpt || generateExcerpt(sanitizedContent);
    const publishedAt = data.status === "published" ? new Date() : null;

    const post = await prisma.blogPost.create({
      data: {
        id: crypto.randomUUID(),
        title: data.title,
        slug: data.slug,
        content: sanitizedContent,
        bannerUrl: data.bannerUrl,
        excerpt,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        ogImageUrl: data.ogImageUrl,
        status: data.status,
        categoryId: data.categoryId,
        authorId: session.user.id,
        publishedAt,
      },
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

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
