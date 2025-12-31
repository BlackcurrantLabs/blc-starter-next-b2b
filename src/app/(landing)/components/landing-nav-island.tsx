"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";

export default function LandingNavIsland() {
  const session = authClient.useSession();
  const user = session.data?.user;

  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link href="/auth/sign-in">
          <Button variant="outline" className="hidden sm:inline-flex">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button>Get Started</Button>
        </Link>
      </SignedOut>
    </>
  );
}
