import { prisma } from "@/app/database";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.blogCategory.findMany({
    include: {
      _count: {
        select: { posts: { where: { status: "published" } } },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <main className="lg:col-span-8 xl:col-span-9">
          {children}
        </main>
        
        <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
           <Card className="border-none shadow-none bg-muted/50 sticky top-24">
             <CardHeader className="pb-3">
               <CardTitle className="text-lg font-semibold tracking-tight">Categories</CardTitle>
             </CardHeader>
             <CardContent className="grid gap-1 p-3 pt-0">
               <Link 
                 href="/blog" 
                 className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
               >
                 <span>All Posts</span>
               </Link>
               {categories.map((category) => (
                 <Link
                   key={category.id}
                   href={`/blog?category=${category.slug}`}
                   className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                 >
                   <span>{category.name}</span>
                   <Badge variant="secondary" className="ml-auto font-mono text-xs text-muted-foreground">
                     {category._count.posts}
                   </Badge>
                 </Link>
               ))}
             </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}
