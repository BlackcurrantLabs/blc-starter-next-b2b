import { prisma } from "@/app/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        _count: {
          select: {
            posts: {
              where: {
                status: "published",
              },
            },
          },
        },
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      sortOrder: category.sortOrder,
      postCount: category._count.posts,
    }));

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
