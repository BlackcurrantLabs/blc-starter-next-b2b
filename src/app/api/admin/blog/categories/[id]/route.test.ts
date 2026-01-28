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
  posts: [],
};

const mockCategoryWithPosts = {
  id: 'category-2',
  name: 'Business',
  slug: 'business',
  sortOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  posts: [{ id: 'post-1' }, { id: 'post-2' }],
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

describe('PATCH /api/admin/blog/categories/[id]', () => {
  let PATCH: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    PATCH = route.PATCH;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 404 for non-existent category', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/nonexistent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
  });

  it('updates category successfully', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(null);
    vi.mocked(mockPrismaClient.blogCategory.update).mockResolvedValueOnce({
      ...mockCategory,
      name: 'Updated Technology',
    });

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Technology' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category.name).toBe('Updated Technology');
  });

  it('returns 400 for reserved slugs on update', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'admin' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('reserved');
  });

  it('returns 400 for invalid slug format', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'Invalid Slug' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 400 for duplicate name (excluding current category)', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce({
      ...mockCategoryWithPosts,
      id: 'different-id',
    });

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Business' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('already exists');
  });

  it('allows same name/slug if updating same category', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(null);
    vi.mocked(mockPrismaClient.blogCategory.update).mockResolvedValueOnce({
      ...mockCategory,
      sortOrder: 5,
    });

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Technology', sortOrder: 5 }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category.sortOrder).toBe(5);
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogCategory.findFirst).mockResolvedValueOnce(null);
    vi.mocked(mockPrismaClient.blogCategory.update).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: 'category-1' }) });
    expect(response.status).toBe(500);
  });
});

describe('DELETE /api/admin/blog/categories/[id]', () => {
  let DELETE: (req: Request, context: { params: Promise<{ id: string }> }) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const route = await import('./route');
    DELETE = route.DELETE;
  });

  it('returns 401 for unauthenticated requests', async () => {
    mockGetSession.mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'category-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 401 for non-admin users', async () => {
    mockGetSession.mockResolvedValueOnce(mockNonAdminSession);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'category-1' }) });
    expect(response.status).toBe(401);
  });

  it('returns 404 for non-existent category', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(null);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/nonexistent', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(response.status).toBe(404);
  });

  it('returns 400 when category has posts', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategoryWithPosts);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-2', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'category-2' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Cannot delete category with posts');
  });

  it('deletes category successfully when no posts exist', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogCategory.delete).mockResolvedValueOnce(mockCategory);

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'category-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockPrismaClient.blogCategory.delete).toHaveBeenCalledWith({
      where: { id: 'category-1' },
    });
  });

  it('returns 500 on database error', async () => {
    mockGetSession.mockResolvedValueOnce(mockAdminSession);
    vi.mocked(mockPrismaClient.blogCategory.findUnique).mockResolvedValueOnce(mockCategory);
    vi.mocked(mockPrismaClient.blogCategory.delete).mockRejectedValueOnce(new Error('DB error'));

    const request = new Request('http://localhost:3000/api/admin/blog/categories/category-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'category-1' }) });
    expect(response.status).toBe(500);
  });
});
