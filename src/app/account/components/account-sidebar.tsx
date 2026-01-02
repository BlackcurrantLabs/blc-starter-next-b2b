"use client";

import Link from "next/link";
import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";
import { AccountNavMain } from "@/app/account/components/account-nav-main";
import { AccountNavSecondary } from "@/app/account/components/account-nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAccountNavItems } from "@/app/nav-config";

export function AccountSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const data = getAccountNavItems();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/account/dashboard">
                <span className="text-base font-semibold">
                  {process.env.NEXT_PUBLIC_SITE_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AccountNavMain items={data.navMain} />
        <AccountNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <OrganizationSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
