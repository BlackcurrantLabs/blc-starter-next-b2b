import { verifySolution } from 'altcha-lib';
import { z } from 'zod';
import { prisma } from '@/app/database';
import { sendContactReceivedEmail } from '@/lib/emails';
import { NextResponse } from 'next/server';

const schema = z.object({
  email: z.string().email().refine(val => val.includes('.') && val.split('.').pop()!.length >= 2, {
    message: "Invalid email: TLD required",
  }),
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

    // Validate env vars
    if (!process.env.ALTCHA_HMAC_KEY) {
      console.error('Missing ALTCHA_HMAC_KEY');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const isValid = await verifySolution(altcha, process.env.ALTCHA_HMAC_KEY);
    if (!isValid) {
      // The requirement asks for 401 for expired/invalid challenge
      return NextResponse.json({ error: 'Captcha expired or invalid. Please try again.' }, { status: 401 });
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

    try {
      const result = await sendContactReceivedEmail(email, subject);
      
      if (result.data?.id) {
        await prisma.contactQuery.update({
          where: { id: query.id },
          data: { messageId: result.data.id },
        });
      }
    } catch (emailError) {
      // Gracefully handle Resend failure - query is already saved to DB
      console.error('Failed to send contact notification email:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
