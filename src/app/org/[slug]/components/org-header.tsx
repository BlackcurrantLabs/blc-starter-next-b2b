"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@daveyplate/better-auth-ui";

import { useParams, usePathname } from "next/navigation";
import { getOrgNavItems, getPageTitle } from "@/app/nav-config";

export function OrgHeader() {
  const pathname = usePathname();
  const { slug } = useParams();
  const title = getPageTitle(pathname, getOrgNavItems(slug as string));

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>

        <div className="ml-auto flex items-center gap-2">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
