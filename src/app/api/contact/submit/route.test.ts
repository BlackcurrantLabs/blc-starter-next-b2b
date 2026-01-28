import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mockEnv } from '@/../tests/utils/mocks';
import { PrismaClient } from '@/generated/prisma/client';

const mockPrismaClient = {
  contactQuery: {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  },
  $disconnect: vi.fn(),
} as unknown as PrismaClient;

const mockVerifySolution = vi.fn();

vi.mock('@/app/database', () => ({
  prisma: mockPrismaClient,
}));

vi.mock('@/lib/emails', () => ({
  sendContactReceivedEmail: vi.fn(async () => ({
    data: { id: 'email-test-id' },
  })),
}));

vi.mock('altcha-lib', () => ({
  verifySolution: mockVerifySolution,
}));

describe('POST /api/contact/submit', () => {
  let cleanupEnv: () => void;
  let POST: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    cleanupEnv = mockEnv({
      ALTCHA_HMAC_KEY: 'test-hmac-key-for-captcha',
    });

    const route = await import('./route');
    POST = route.POST;
  });

  afterEach(() => {
    cleanupEnv();
  });

  it('returns 400 for missing required fields', async () => {
    mockVerifySolution.mockResolvedValue(true);

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        // Missing subject and message
        altcha: 'valid-captcha-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 400 for invalid email format', async () => {
    mockVerifySolution.mockResolvedValue(true);

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'Test message',
        altcha: 'valid-captcha-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 400 for email without valid TLD', async () => {
    mockVerifySolution.mockResolvedValue(true);

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.c', // TLD too short
        subject: 'Test Subject',
        message: 'Test message',
        altcha: 'valid-captcha-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });

  it('returns 401 for invalid captcha', async () => {
    mockVerifySolution.mockResolvedValue(false); // Captcha validation fails

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        altcha: 'invalid-captcha-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('Captcha expired or invalid');
  });

  it('returns 500 when ALTCHA_HMAC_KEY is missing', async () => {
    // Override env to remove ALTCHA_HMAC_KEY
    cleanupEnv();
    cleanupEnv = mockEnv({});

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        altcha: 'valid-captcha-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Configuration error');
  });

  it('creates ContactQuery and returns 200 for valid submission', async () => {
    mockVerifySolution.mockResolvedValue(true);

    const createdQuery = {
      id: 'test-query-id',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      status: 'unread',
      messageId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockPrismaClient.contactQuery.create).mockResolvedValueOnce(createdQuery);

    const testData = {
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      altcha: 'valid-captcha-token',
    };

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    expect(mockPrismaClient.contactQuery.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: testData.email,
          subject: testData.subject,
          message: testData.message,
          status: 'unread',
        }),
      })
    );
  });

  it('updates ContactQuery with messageId when email sends successfully', async () => {
    mockVerifySolution.mockResolvedValue(true);

    const createdQuery = {
      id: 'test-query-id',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      status: 'unread',
      messageId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockPrismaClient.contactQuery.create).mockResolvedValueOnce(createdQuery);
    vi.mocked(mockPrismaClient.contactQuery.update).mockResolvedValueOnce({
      ...createdQuery,
      messageId: 'email-test-id',
    });

    const testData = {
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      altcha: 'valid-captcha-token',
    };

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(mockPrismaClient.contactQuery.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: createdQuery.id },
        data: { messageId: 'email-test-id' },
      })
    );
  });

  it('handles Resend failure gracefully and still creates query', async () => {
    mockAltcha(true);

    const createdQuery = {
      id: 'test-query-id',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      status: 'unread',
      messageId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockPrismaClient.contactQuery.create).mockResolvedValueOnce(createdQuery);

    const { sendContactReceivedEmail } = await import('@/lib/emails');
    vi.mocked(sendContactReceivedEmail).mockRejectedValueOnce(
      new Error('Email service unavailable')
    );

    const testData = {
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      altcha: 'valid-captcha-token',
    };

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    expect(mockPrismaClient.contactQuery.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: testData.email,
          subject: testData.subject,
          message: testData.message,
        }),
      })
    );

    expect(mockPrismaClient.contactQuery.update).not.toHaveBeenCalled();
  });

  it('returns 400 for message exceeding max length', async () => {
    mockAltcha(true);

    const longMessage = 'a'.repeat(5001); // Exceeds 5000 char limit

    const request = new Request('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        subject: 'Test Subject',
        message: longMessage,
        altcha: 'valid-captcha-token',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input');
  });
});
