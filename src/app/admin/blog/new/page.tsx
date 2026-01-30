import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BlogPostForm } from "../post-form";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const categories = await prisma.blogCategory.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Post</h1>
        <p className="text-muted-foreground">Create a new blog post.</p>
      </div>
      <BlogPostForm categories={categories} mode="create" />
    </div>
  );
}
