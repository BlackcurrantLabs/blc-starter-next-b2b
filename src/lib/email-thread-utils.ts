import { prisma } from "@/app/database";

export async function buildThreadHeaders(queryId: string) {
  const query = await prisma.contactQuery.findUnique({
    where: { id: queryId },
    select: { messageId: true },
  });

  if (!query) {
    throw new Error(`ContactQuery not found: ${queryId}`);
  }

  const replies = await prisma.contactReply.findMany({
    where: { queryId },
    orderBy: { createdAt: 'asc' },
    select: { messageId: true },
  });

  const messageIds = [query.messageId, ...replies.map(r => r.messageId)].filter(Boolean) as string[];

  if (messageIds.length === 0) {
     return {};
  }
  
  const lastMessageId = messageIds[messageIds.length - 1];
  const references = messageIds.join(' ');

  return {
    'In-Reply-To': lastMessageId,
    'References': references,
  };
}
