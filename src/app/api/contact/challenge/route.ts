import { createAltchaChallengeResponse } from '@/lib/altcha';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    return await createAltchaChallengeResponse(req);
  } catch (error) {
    console.error('Error generating challenge:', error);
    return NextResponse.json({ error: 'Failed to generate challenge' }, { status: 500 });
  }
}
