import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaClient } from '@/generated/prisma/client';

const mockAdminSession = {
  user: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  session: {
    id: 'session-id',
    token: 'session-token',
  },
};

const mockNonAdminSession = {
  user: {
    id: 'user-id',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
  },
  session: {
    id: 'session-id',
    token: 'session-token',
  },
};

const mockCategory = {
  id: 'category-1',
  name: 'Technology',
  slug: 'technology',
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPost = {
  id: 'post-1',
  title: 'Test Post',
  slug: 'test-post',
  content: '<p>Test content</p>',
  bannerUrl: 'https://example.com/banner.jpg',
  excerpt: 'Test excerpt',
  metaTitle: 'Test Meta Title',
  metaDescription: 'Test meta description',
  ogImageUrl: 'https://example.com/og.jpg',
  status: 'draft',
  authorId: 'admin-user-id',
  categoryId: 'category-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: null,
  category: mockCategory,
  author: {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@example.com',
  },
};

const mockPrismaClient = {
  blogPost: {
    findMany: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  blogCategory: {
    findUnique: vi.fn(),
  },
  $disconnect: vi.fn(),
} as unknown as PrismaClient;

const mockGetSession = vi.fn();

vi.mock('@/app/database', () => ({
  prisma: mockPrismaClient,
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('dompurify', () => ({
  default: () => ({
    sanitize: (html: string) => html.replace(/<script.*?>.*?<\/script>/gi, ''),
  }),
}));

vi.mock('jsdom', () => ({
  JSDOM: class {
    window = {};
  },
}));

describe('GET /api/admin/blog/posts', () => {
  let GET: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    GET = route.GET;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('returns list of posts for admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findMany).mockResolvedValueOnce([mockPost]);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.posts).toHaveLength(1);
    expect(data.posts[0].title).toBe('Test Post');
  });

  it('filters posts by status query param', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findMany).mockResolvedValueOnce([mockPost]);

    const request = new Request('http://localhost:3000/api/admin/blog/posts?status=draft', {
      method: 'GET',
    });

    await GET(request);

    expect(mockPrismaClient.blogPost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'draft',
        }),
      })
    );
  });

  it('filters posts by categoryId query param', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findMany).mockResolvedValueOnce([mockPost]);

    const request = new Request('http://localhost:3000/api/admin/blog/posts?categoryId=category-1', {
      method: 'GET',
    });

    await GET(request);

    expect(mockPrismaClient.blogPost.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: 'category-1',
        }),
      })
    );
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findMany).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(500);
  });
});

describe('POST /api/admin/blog/posts', () => {
  let POST: (req: Request) => Promise<Response>;

  const validPostData = {
    title: 'New Post',
    slug: 'new-post',
    content: '<p>This is the content</p>',
    metaDescription: 'A description for SEO',
    status: 'draft',
    categoryId: 'category-1',
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    POST = route.POST;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPostData),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPostData),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('returns 400 for missing required fields', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Only title' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 400 for invalid slug format', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPostData,
        slug: 'Invalid Slug With Spaces',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 400 for reserved slugs', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);

    const reservedSlugs = ['admin', 'api', 'blog', 'category', 'new', 'edit', 'draft'];

    for (const slug of reservedSlugs) {
      vi.clearAllMocks();
      mockGetSession.mockResolvedValueOnce(mockAdminSession);

      const request = new Request('http://localhost:3000/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validPostData,
          slug,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('reserved');
    }
  });

  it('returns 400 for invalid status value', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPostData,
        status: 'invalid-status',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 404 for non-existent category', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPostData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain('Category');
  });

  it('creates post successfully with valid data', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogPost.create).mockResolvedValueOnce({
      ...mockPost,
      title: validPostData.title,
      slug: validPostData.slug,
    });

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPostData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.post).toBeDefined();
    expect(mockPrismaClient.blogPost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: validPostData.title,
          slug: validPostData.slug,
          authorId: mockAdminSession.user.id,
        }),
      })
    );
  });

  it('sanitizes HTML content before saving', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogPost.create).mockResolvedValueOnce(mockPost);

    const maliciousContent = '<p>Good content</p><script>alert("xss")</script>';

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPostData,
        content: maliciousContent,
      }),
    });

    await POST(request);

    expect(mockPrismaClient.blogPost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: expect.not.stringContaining('<script>'),
        }),
      })
    );
  });

  it('sets publishedAt when status is published', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogPost.create).mockResolvedValueOnce({
      ...mockPost,
      status: 'published',
      publishedAt: new Date(),
    });

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPostData,
        status: 'published',
      }),
    });

    await POST(request);

    expect(mockPrismaClient.blogPost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          publishedAt: expect.any(Date),
        }),
      })
    );
  });

  it('auto-generates excerpt from content if not provided', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogPost.create).mockResolvedValueOnce(mockPost);

    const longContent = '<p>' + 'A'.repeat(600) + '</p>';

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPostData,
        content: longContent,
        excerpt: undefined,
      }),
    });

    await POST(request);

    expect(mockPrismaClient.blogPost.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          excerpt: expect.any(String),
        }),
      })
    );
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogPost.create).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPostData),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
