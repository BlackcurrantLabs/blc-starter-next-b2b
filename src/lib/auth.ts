import 'server-only';

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/app/database";
import { admin, magicLink, organization } from "better-auth/plugins";
import { sendVerificationEmail, sendResetPasswordEmail, sendMagicLinkEmail } from "./emails";
export const auth = betterAuth({
  appName: "Multitude",
  trustedOrigins: [
    "http://localhost:3000",
    // Add more domains here
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
    freshAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      // Don't need to read user from database if read within this time
      enabled: true,
      maxAge: 60 * 5, // 5 Mins
    },
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    resetPasswordTokenExpiresIn: 60 * 15, // 15 minutes
    verificationTokenExpiresIn: 3600, // 1 hour
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, user.name, url)
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, user.name, url)
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  plugins: [
    admin(),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendMagicLinkEmail(email, url)
      },
      rateLimit: {
        max: 5,
        window: 60 * 5 // 5 mins
      }
    }),
    organization({
      requireEmailVerificationOnInvitation: true,
      schema: {
        organization: {

        },
        member: {

        },
      },
      organizationHooks: {

      },
    }),
  ],
  logger: {
    disabled: false,
    level: "debug",
    disableColors: true,
    log(level, message, ...args) {
      console[level](`[BetterAuth] ${message}`, ...args);
    },
  },
  telemetry: {
    enabled: false, // Disable telemetry for privacy concerns
  },
});