import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { LandingNavMenu } from "@/app/(landing)/components/nav-menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const LandingNavigationSheet = () => {
  return (
    <Sheet>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="px-6 py-3">
        <Logo />
        <LandingNavMenu
          orientation="vertical"
          className="mt-6 [&>div]:h-full"
        />
      </SheetContent>
    </Sheet>
  );
};
