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
  _count: { posts: 5 },
};

const mockCategoryWithoutCount = {
  id: 'category-1',
  name: 'Technology',
  slug: 'technology',
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaClient = {
  blogCategory: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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

describe('GET /api/admin/blog/categories', () => {
  let GET: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    GET = route.GET;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });

  it('returns list of categories with post count for admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findMany).mockResolvedValueOnce([mockCategory]);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toHaveLength(1);
    expect(data.categories[0].name).toBe('Technology');
    expect(data.categories[0].postCount).toBe(5);
  });

  it('returns empty array when no categories exist', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findMany).mockResolvedValueOnce([]);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'GET',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toHaveLength(0);
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findMany).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(500);
  });
});

describe('POST /api/admin/blog/categories', () => {
  let POST: (req: Request) => Promise<Response>;

  const validCategoryData = {
    name: 'New Category',
    slug: 'new-category',
    sortOrder: 1,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    POST = route.POST;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validCategoryData),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validCategoryData),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('returns 400 for missing required fields', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Only name' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 400 for invalid slug format', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validCategoryData,
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

      const request = new Request('http://localhost:3000/api/admin/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...validCategoryData,
          slug,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('reserved');
    }
  });

  it('returns 400 for duplicate name', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(mockCategoryWithoutCount);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Technology',
        slug: 'different-slug',
        sortOrder: 0,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('already exists');
  });

  it('returns 400 for duplicate slug', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(mockCategoryWithoutCount);

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Different Name',
        slug: 'technology',
        sortOrder: 0,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('already exists');
  });

  it('creates category successfully with valid data', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(null);
    vi.mocked(mockPrismaClient.blogCategory.create).mockResolvedValueOnce({
      ...mockCategoryWithoutCount,
      name: validCategoryData.name,
      slug: validCategoryData.slug,
      sortOrder: validCategoryData.sortOrder,
    });

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validCategoryData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.category).toBeDefined();
    expect(data.category.name).toBe(validCategoryData.name);
    expect(data.category.slug).toBe(validCategoryData.slug);
  });

  it('creates category with default sortOrder when not provided', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(null);
    vi.mocked(mockPrismaClient.blogCategory.create).mockResolvedValueOnce({
      ...mockCategoryWithoutCount,
      name: 'New Category',
      slug: 'new-category',
      sortOrder: 0,
    });

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Category',
        slug: 'new-category',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.category.sortOrder).toBe(0);
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(null);
    vi.mocked(mockPrismaClient.blogCategory.create).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validCategoryData),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
