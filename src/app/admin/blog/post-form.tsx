"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { TiptapEditor } from "@/components/blog/tiptap-editor";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  excerpt: z.string().max(500).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160, "Meta description too long"),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  categoryId: z.string().min(1, "Category is required"),
});

type BlogPostFormProps = {
  initialData?: any;
  categories: { id: string; name: string }[];
  mode: "create" | "edit";
};

export function BlogPostForm({ initialData, categories, mode }: BlogPostFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: initialData || {
      title: "",
      slug: "",
      content: "",
      bannerUrl: "",
      excerpt: "",
      metaTitle: "",
      metaDescription: "",
      ogImageUrl: "",
      status: "draft",
      categoryId: "",
    },
    validators: {
      onChange: ({ value }) => undefined, 
    },
    onSubmit: async ({ value }) => {
      try {
        const url = mode === "create" ? "/api/admin/blog/posts" : `/api/admin/blog/posts/${initialData.id}`;
        const method = mode === "create" ? "POST" : "PATCH";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save post");
        }

        toast.success(mode === "create" ? "Post created" : "Post updated");
        router.push("/admin/blog");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save post");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <form.Field
                name="title"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        if (mode === "create") {
                           const slugField = form.getFieldValue("slug");
                           if (!slugField) {
                             const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                             form.setFieldValue("slug", newSlug);
                           }
                        }
                      }}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="slug"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={mode === "edit" && initialData?.status === "published"}
                    />
                    {mode === "edit" && initialData?.status === "published" && (
                       <p className="text-xs text-muted-foreground">Cannot edit slug of published post</p>
                    )}
                  </div>
                )}
              />

              <form.Field
                name="content"
                children={(field) => (
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <TiptapEditor
                      content={field.state.value}
                      onChange={field.handleChange}
                    />
                    {field.state.meta.errors && (
                      <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                    )}
                  </div>
                )}
              />
              
              <form.Field
                name="excerpt"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                    <Textarea
                      id="excerpt"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <form.Field
                name="status"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <form.Field
                name="categoryId"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors && (
                      <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <form.Field
                name="bannerUrl"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="bannerUrl">Banner URL</Label>
                    <Input
                      id="bannerUrl"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <Card>
             <CardContent className="p-6 space-y-4">
               <h3 className="font-semibold mb-2">SEO</h3>
               <form.Field
                 name="metaTitle"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label htmlFor="metaTitle">Meta Title</Label>
                     <Input
                       id="metaTitle"
                       value={field.state.value}
                       onBlur={field.handleBlur}
                       onChange={(e) => field.handleChange(e.target.value)}
                     />
                   </div>
                 )}
               />
               <form.Field
                 name="metaDescription"
                 children={(field) => (
                   <div className="space-y-2">
                     <Label htmlFor="metaDescription">Meta Description</Label>
                     <Textarea
                       id="metaDescription"
                       value={field.state.value}
                       onBlur={field.handleBlur}
                       onChange={(e) => field.handleChange(e.target.value)}
                       className="min-h-[100px]"
                     />
                   </div>
                 )}
               />
             </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.state.isSubmitting}>
          {form.state.isSubmitting ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
        </Button>
      </div>
    </form>
  );
}
