import { verifySolution } from 'altcha-lib';
import { z } from 'zod';
import { prisma } from '@/app/database';
import { sendContactReceivedEmail } from '@/lib/emails';
import { NextResponse } from 'next/server';

const schema = z.object({
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1).max(5000),
  altcha: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { email, subject, message, altcha } = parsed.data;

    const isValid = await verifySolution(altcha, process.env.ALTCHA_HMAC_KEY || 'default-secret');
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid captcha' }, { status: 400 });
    }

    const query = await prisma.contactQuery.create({
      data: {
        id: crypto.randomUUID(),
        email,
        subject,
        message,
        status: 'unread',
      },
    });

    const result = await sendContactReceivedEmail(email, subject);
    
    if (result.data?.id) {
      await prisma.contactQuery.update({
        where: { id: query.id },
        data: { messageId: result.data.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
