import { prisma } from "@/app/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = await prisma.blogCategory.findUnique({
        where: { slug },
        select: { name: true }
    });

    if (!category) return {};

    return {
        title: `${category.name} - Blog`,
        description: `Read articles about ${category.name}`,
    };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.blogCategory.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const posts = await prisma.blogPost.findMany({
    where: {
      status: "published",
      category: { slug },
    },
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      author: { select: { name: true, image: true } },
    },
  });

  return (
    <div className="space-y-10">
        <div className="space-y-6">
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all posts
            </Link>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-3 py-1 text-sm">Category</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        {category.name}
                    </h1>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted border">
                        {post.bannerUrl ? (
                            <Image 
                                src={post.bannerUrl} 
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                             <div className="flex h-full items-center justify-center text-muted-foreground bg-secondary/50">
                                <span className="text-sm font-medium">No Image</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                             <Badge variant="secondary" className="shadow-xs backdrop-blur-md bg-background/80 hover:bg-background/90">
                                {post.category.name}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
                            <span>•</span>
                            <span>{post.author.name}</span>
                        </div>
                        <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                        </h2>
                        <p className="text-muted-foreground line-clamp-3">
                            {post.excerpt || post.metaDescription}
                        </p>
                    </div>
                </Link>
            ))}
            {posts.length === 0 && (
                <div className="col-span-full py-24 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    </div>
                    <h3 className="text-lg font-medium">No posts found</h3>
                    <p className="text-muted-foreground mt-1">
                        We couldn't find any posts in this category.
                    </p>
                    <Link href="/blog" className="mt-4 inline-flex items-center text-primary hover:underline">
                        View all posts
                    </Link>
                </div>
            )}
        </div>
    </div>
  );
}
