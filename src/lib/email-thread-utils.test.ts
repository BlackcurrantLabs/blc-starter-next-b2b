import { vi } from 'vitest';
import { buildThreadHeaders } from './email-thread-utils';
import { prisma as realPrisma } from '@/app/database';

vi.mock('@/app/database', () => ({
  prisma: {
    contactQuery: {
      findUnique: vi.fn(),
    },
    contactReply: {
      findMany: vi.fn(),
    },
  },
}));

const mockPrisma = realPrisma as any;

describe('buildThreadHeaders() - Email Thread Headers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws error when ContactQuery not found', async () => {
    mockPrisma.contactQuery.findUnique.mockResolvedValue(null);

    await expect(buildThreadHeaders('non-existent-id')).rejects.toThrow(
      'ContactQuery not found: non-existent-id'
    );
  });

  it('returns empty object when no message IDs exist', async () => {
    mockPrisma.contactQuery.findUnique.mockResolvedValue({
      id: 'query-1',
      messageId: null,
    });
    mockPrisma.contactReply.findMany.mockResolvedValue([]);

    const headers = await buildThreadHeaders('query-1');

    expect(headers).toEqual({});
  });

  it('returns In-Reply-To with query messageId when no replies exist', async () => {
    const messageId = 'msg-query-123@example.com';
    mockPrisma.contactQuery.findUnique.mockResolvedValue({
      id: 'query-1',
      messageId,
    });
    mockPrisma.contactReply.findMany.mockResolvedValue([]);

    const headers = await buildThreadHeaders('query-1');

    expect(headers).toEqual({
      'In-Reply-To': messageId,
      'References': messageId,
    });
  });

  it('returns In-Reply-To with last reply messageId when replies exist', async () => {
    const queryMessageId = 'msg-query-123@example.com';
    const reply1MessageId = 'msg-reply-1@example.com';
    const reply2MessageId = 'msg-reply-2@example.com';

    mockPrisma.contactQuery.findUnique.mockResolvedValue({
      id: 'query-1',
      messageId: queryMessageId,
    });
    mockPrisma.contactReply.findMany.mockResolvedValue([
      { messageId: reply1MessageId },
      { messageId: reply2MessageId },
    ]);

    const headers = await buildThreadHeaders('query-1');

    expect(headers['In-Reply-To']).toBe(reply2MessageId);
  });

  it('builds References header with all message IDs in order', async () => {
    const queryMessageId = 'msg-query-123@example.com';
    const reply1MessageId = 'msg-reply-1@example.com';
    const reply2MessageId = 'msg-reply-2@example.com';

    mockPrisma.contactQuery.findUnique.mockResolvedValue({
      id: 'query-1',
      messageId: queryMessageId,
    });
    mockPrisma.contactReply.findMany.mockResolvedValue([
      { messageId: reply1MessageId },
      { messageId: reply2MessageId },
    ]);

    const headers = await buildThreadHeaders('query-1');

    expect(headers['References']).toBe(
      `${queryMessageId} ${reply1MessageId} ${reply2MessageId}`
    );
  });

  it('filters out null messageIds from References', async () => {
    const queryMessageId = 'msg-query-123@example.com';
    const reply2MessageId = 'msg-reply-2@example.com';

    mockPrisma.contactQuery.findUnique.mockResolvedValue({
      id: 'query-1',
      messageId: queryMessageId,
    });
    mockPrisma.contactReply.findMany.mockResolvedValue([
      { messageId: null },
      { messageId: reply2MessageId },
    ]);

    const headers = await buildThreadHeaders('query-1');

    expect(headers['References']).toBe(`${queryMessageId} ${reply2MessageId}`);
    expect(headers['In-Reply-To']).toBe(reply2MessageId);
  });

  it('maintains chronological order of replies in References', async () => {
    const queryMessageId = 'msg-query-123@example.com';
    const reply1MessageId = 'msg-reply-1@example.com';
    const reply2MessageId = 'msg-reply-2@example.com';

    mockPrisma.contactQuery.findUnique.mockResolvedValue({
      id: 'query-1',
      messageId: queryMessageId,
    });
    mockPrisma.contactReply.findMany.mockResolvedValue([
      { messageId: reply1MessageId, createdAt: new Date('2024-01-01T10:00:00Z') },
      { messageId: reply2MessageId, createdAt: new Date('2024-01-01T11:00:00Z') },
    ]);

    const headers = await buildThreadHeaders('query-1');

    const references = headers['References']!.split(' ');
    expect(references).toEqual([queryMessageId, reply1MessageId, reply2MessageId]);
  });
});
