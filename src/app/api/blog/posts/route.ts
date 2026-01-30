import { prisma } from "@/app/database";
import { NextResponse } from "next/server";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 50;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const categorySlug = url.searchParams.get("category");
    const limitParam = url.searchParams.get("limit");

    const limit = Math.min(
      Math.max(1, parseInt(limitParam || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
      MAX_LIMIT
    );

    const where: {
      status: string;
      category?: { slug: string };
    } = {
      status: "published",
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const posts = await prisma.blogPost.findMany({
      where,
      take: limit,
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        bannerUrl: true,
        metaDescription: true,
        status: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
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
