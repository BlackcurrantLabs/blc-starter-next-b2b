import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LandingNavMenu } from "@/app/(landing)/components/nav-menu";
import { LandingNavigationSheet } from "@/app/(landing)/components/navigation-sheet";
import Link from "next/link";

const LandingNavbar = () => {
  return (
    <nav className="h-16 bg-background border-b">
      <div className="h-full flex items-center justify-between max-w-(--breakpoint-xl) mx-auto px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Menu */}
        <LandingNavMenu className="hidden md:block" />

        <div className="flex items-center gap-3">
          <Link href="/auth/sign-in">
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button>Get Started</Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <LandingNavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
