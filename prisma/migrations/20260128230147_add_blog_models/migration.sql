-- CreateTable
CREATE TABLE "blog_category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "blog_post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "bannerUrl" TEXT,
    "excerpt" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT NOT NULL,
    "ogImageUrl" TEXT,
    "status" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "blog_post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "blog_post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_category_name_key" ON "blog_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_category_slug_key" ON "blog_category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_slug_key" ON "blog_post"("slug");

-- CreateIndex
CREATE INDEX "blog_post_status_publishedAt_idx" ON "blog_post"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "blog_post_categoryId_status_idx" ON "blog_post"("categoryId", "status");
