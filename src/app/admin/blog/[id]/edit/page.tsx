import { auth } from "@/lib/auth";
import { prisma } from "@/app/database";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { BlogPostForm } from "../../post-form";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
    }),
    prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">Edit existing blog post.</p>
      </div>
      <BlogPostForm 
        initialData={post} 
        categories={categories} 
        mode="edit" 
      />
    </div>
  );
}
