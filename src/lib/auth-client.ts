/**
 * This file is where you configure your auth client
 * The client is used in "use client" files such as pages and components
 * It uses the auth system provided by better-auth
 * It handles authentication basics, token refresh and such
 */
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, adminClient, organizationClient, inferOrgAdditionalFields, magicLinkClient } from "better-auth/client/plugins";
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  //you can pass client configuration here
  plugins: [
    inferAdditionalFields<typeof auth>(),
    magicLinkClient(),
    adminClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});
