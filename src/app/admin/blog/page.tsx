import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BlogClientPage from "./client-page";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: {
        select: { name: true },
      },
      author: {
        select: { name: true },
      },
    },
  });

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    category: post.category,
    author: post.author,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
  }));

  return <BlogClientPage initialPosts={formattedPosts} />;
}
