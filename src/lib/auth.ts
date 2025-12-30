import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/app/database";
import { admin } from "better-auth/plugins";
export const auth = betterAuth({
  appName: "Multitude",
  trustedOrigins: [
    "http://localhost:3000",
    // Add more domains here
  ],
  logger: {
    disabled: false,
    level: "debug",
    disableColors: true,
    log(level, message, ...args) {
      console[level](`[BetterAuth] ${message}`, ...args);
    },
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite", // or "mysql", "postgresql", ...etc
  }),
  telemetry: {
    enabled: false, // Disable telemetry for privacy concerns
  },
  emailAndPassword: { 
    enabled: true, 
  }, 
  plugins: [
    admin(),
  ]
});