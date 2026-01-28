import { createChallenge } from 'altcha-lib';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const challenge = await createChallenge({
      hmacKey: process.env.ALTCHA_HMAC_KEY || 'default-secret',
      maxNumber: 100000,
      algorithm: 'SHA-256',
    });
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error generating challenge:', error);
    return NextResponse.json({ error: 'Failed to generate challenge' }, { status: 500 });
  }
}
