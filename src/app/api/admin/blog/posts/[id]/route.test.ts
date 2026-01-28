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

const mockPublishedPost = {
  ...mockPost,
  id: 'post-2',
  slug: 'published-post',
  status: 'published',
  publishedAt: new Date('2024-01-01'),
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

describe('GET /api/admin/blog/posts/[id]', () => {
  let GET: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    GET = route.GET;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'GET',
    });

    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'GET',
    });

    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 404 for non-existent post', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/nonexistent', {
      method: 'GET',
    });

    const response = await GET(request, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
  });

  it('returns post for admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'GET',
    });

    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.post.id).toBe('post-1');
    expect(data.post.title).toBe('Test Post');
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'GET',
    });

    const response = await GET(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(500);
  });
});

describe('PATCH /api/admin/blog/posts/[id]', () => {
  let PATCH: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    PATCH = route.PATCH;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 404 for non-existent post', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/nonexistent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
  });

  it('updates post successfully', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);
    vi.mocked(mockPrismaClient.blogPost.update).mockResolvedValueOnce({
      ...mockPost,
      title: 'Updated Title',
    });

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.post.title).toBe('Updated Title');
  });

  it('blocks slug change for published posts', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPublishedPost);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-2', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'new-slug' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-2' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('slug');
  });

  it('allows slug change for draft posts', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);
    vi.mocked(mockPrismaClient.blogPost.update).mockResolvedValueOnce({
      ...mockPost,
      slug: 'new-slug',
    });

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'new-slug' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.post.slug).toBe('new-slug');
  });

  it('returns 400 for reserved slugs on update', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'admin' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('reserved');
  });

  it('returns 400 for invalid slug format', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'Invalid Slug' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('sets publishedAt when status changes to published', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);
    vi.mocked(mockPrismaClient.blogPost.update).mockResolvedValueOnce({
      ...mockPost,
      status: 'published',
      publishedAt: new Date(),
    });

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published' }),
    });

    await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });

    expect(mockPrismaClient.blogPost.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          publishedAt: expect.any(Date),
        }),
      })
    );
  });

  it('sanitizes HTML content on update', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);
    vi.mocked(mockPrismaClient.blogPost.update).mockResolvedValueOnce(mockPost);

    const maliciousContent = '<p>Good content</p><script>alert("xss")</script>';

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: maliciousContent }),
    });

    await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });

    expect(mockPrismaClient.blogPost.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: expect.not.stringContaining('<script>'),
        }),
      })
    );
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);
    vi.mocked(mockPrismaClient.blogPost.update).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(500);
  });
});

describe('DELETE /api/admin/blog/posts/[id]', () => {
  let DELETE: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    DELETE = route.DELETE;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 404 for non-existent post', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/nonexistent', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
  });

  it('deletes post successfully', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);
    vi.mocked(mockPrismaClient.blogPost.delete).mockResolvedValueOnce(mockPost);

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'post-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockPrismaClient.blogPost.delete).toHaveBeenCalledWith({
      where: { id: 'post-1' },
    });
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogPost.findUnique).mockResolvedValueOnce(mockPost);
    vi.mocked(mockPrismaClient.blogPost.delete).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/posts/post-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'post-1' }) });
    expect(response.status).toBe(500);
  });
});
