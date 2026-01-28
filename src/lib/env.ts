import { z } from 'zod';

const envSchema = z.object({
  RESEND_FROM: z.string().min(1),
  RESEND_KEY: z.string().min(1),
  ALTCHA_HMAC_KEY: z.string().min(1),
});

export function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    // In production, we might want to throw or exit, but for now we'll just log
    // throw new Error('Invalid environment variables');
  }
}

export const env = {
  ...process.env,
  ...envSchema.safeParse(process.env).data,
};
