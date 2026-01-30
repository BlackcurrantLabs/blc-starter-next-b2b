import { z } from "zod";

export const blogPostStatusSchema = z.enum(["draft", "published", "archived"]);
export type BlogPostStatus = z.infer<typeof blogPostStatusSchema>;

const blogPostBaseFields = {
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  excerpt: z.string().max(500).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160, "Meta description too long"),
  status: blogPostStatusSchema,
  categoryId: z.string().min(1, "Category is required"),
};

export const blogPostCreateSchema = z.object({
  ...blogPostBaseFields,
  metaDescription: z.string().max(160),
});

export type BlogPostCreateInput = z.infer<typeof blogPostCreateSchema>;

export const blogPostUpdateSchema = z.object({
  title: blogPostBaseFields.title.optional(),
  slug: blogPostBaseFields.slug.optional(),
  content: blogPostBaseFields.content.optional(),
  bannerUrl: z.string().url().optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional(),
  status: blogPostStatusSchema.optional(),
  categoryId: z.string().optional(),
});

export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;

export const blogPostFormSchema = z.object({
  ...blogPostBaseFields,
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;

export type BlogPostCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPostAuthor = {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
};

export type BlogPostListItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: { name: string };
  author: { name: string };
  publishedAt: Date | string | null;
  createdAt: Date | string;
};

export type BlogPostWithRelations = {
  id: string;
  title: string;
  slug: string;
  content: string;
  bannerUrl: string | null;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string;
  status: string;
  authorId: string;
  categoryId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt: Date | string | null;
  category: BlogPostCategory;
  author: BlogPostAuthor;
};

export const blogCategoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  sortOrder: z.number().int().min(0).optional(),
});

export type BlogCategoryCreateInput = z.infer<typeof blogCategoryCreateSchema>;

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "blog",
  "category",
  "new",
  "edit",
  "draft",
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS)[number];

export function isReservedSlug(slug: string): slug is ReservedSlug {
  return RESERVED_SLUGS.includes(slug as ReservedSlug);
}
