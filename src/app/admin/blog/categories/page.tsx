import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CategoriesClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const categories = await prisma.blogCategory.findMany({
    orderBy: {
      sortOrder: "asc",
    },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  const formattedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    sortOrder: category.sortOrder,
    postCount: category._count.posts,
    createdAt: category.createdAt,
  }));

  return <CategoriesClientPage initialCategories={formattedCategories} />;
}
