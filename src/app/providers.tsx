"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => {
        // Clear router cache (protected routes)
        router.refresh();
      }}
      Link={Link}
      redirectTo="/redirect-after-login"
      basePath="/auth"
      organization={{
        pathMode: "slug",
        basePath: "/org",
        slug,
      }}
      magicLink={true}
    >
      {children}
    </AuthUIProvider>
  );
}
