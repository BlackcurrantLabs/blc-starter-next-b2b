// Self-hosted ALTCHA captcha (proof-of-work v2) for public forms.
// Server integration: https://github.com/altcha-org/altcha-lib/blob/main/docs/nextjs.md

import 'server-only';
import {
  CappedMap,
  create,
  deriveHmacKeySecret,
  randomInt,
} from 'altcha-lib/frameworks/nextjs';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';

const CHALLENGE_TTL_MS = 10 * 60 * 1000;

// Remembers solved challenges so a payload cannot be submitted twice.
// This store is in-memory: use a shared store (e.g. Redis) when the app runs
// on more than one instance.
const usedChallenges = new CappedMap<string, boolean>({ maxSize: 1_000 });

async function getAltcha() {
  const hmacSignatureSecret = process.env.ALTCHA_HMAC_KEY;
  if (!hmacSignatureSecret) {
    throw new Error('Missing ALTCHA_HMAC_KEY');
  }

  const hmacKeySignatureSecret = await deriveHmacKeySecret(hmacSignatureSecret);

  const altcha = create({
    hmacSignatureSecret,
    hmacKeySignatureSecret,
    deriveKey,
    store: usedChallenges,
    createChallengeParameters: () => ({
      algorithm: 'PBKDF2/SHA-256',
      cost: 5_000,
      counter: randomInt(5_000, 10_000),
      expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
    }),
  });

  return { altcha, hmacSignatureSecret, hmacKeySignatureSecret };
}

/**
 * Responds with a new signed challenge for the `<altcha-widget>`.
 * Throws when ALTCHA_HMAC_KEY is not configured.
 */
export async function createAltchaChallengeResponse(req: Request): Promise<Response> {
  const { altcha } = await getAltcha();
  return altcha.challengeHandler(req);
}

/**
 * Verifies the payload produced by the `<altcha-widget>`. Resolves to `false`
 * for an invalid, expired or already used payload.
 * Throws when ALTCHA_HMAC_KEY is not configured.
 */
export async function verifyAltchaPayload(payload: string): Promise<boolean> {
  const { altcha, hmacSignatureSecret, hmacKeySignatureSecret } = await getAltcha();
  const result = await altcha.verify(
    payload,
    deriveKey,
    hmacSignatureSecret,
    hmacKeySignatureSecret,
    usedChallenges,
  );
  return result.error === null;
}
