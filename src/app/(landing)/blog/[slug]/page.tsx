import { prisma } from "@/app/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        select: { title: true, metaDescription: true, bannerUrl: true }
    });
    if (!post) return {};
    return {
        title: post.title,
        description: post.metaDescription,
        openGraph: {
            images: post.bannerUrl ? [post.bannerUrl] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
            category: true,
            author: { select: { name: true, image: true } }
        }
    });

    if (!post || post.status !== 'published') {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto space-y-10 pb-12">
            <div className="space-y-6">
                <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                </Link>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="rounded-md border-primary/20 bg-primary/5 text-primary">
                        {post.category.name}
                    </Badge>
                    <time className="text-sm text-muted-foreground">
                        {new Date(post.publishedAt!).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 pt-2">
                     <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted border">
                         {post.author.image ? (
                             <Image 
                                 src={post.author.image} 
                                 alt={post.author.name}
                                 fill
                                 className="object-cover"
                             />
                         ) : (
                             <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold text-xs">
                                 {post.author.name.charAt(0).toUpperCase()}
                             </div>
                         )}
                     </div>
                     <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm">{post.author.name}</span>
                        <span className="text-xs text-muted-foreground">Author</span>
                     </div>
                </div>
            </div>

            {post.bannerUrl && (
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted border shadow-sm">
                    <Image
                        src={post.bannerUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </article>
    );
}
