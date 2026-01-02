"use client";

import Link from "next/link";
import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";
import { AdminNavMain } from "@/app/admin/components/admin-nav-main";
import { AdminNavSecondary } from "@/app/admin/components/admin-nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getAdminNavItems } from "@/app/nav-config";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const data = getAdminNavItems();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/admin/dashboard">
                <span className="text-base font-semibold">
                  {process.env.NEXT_PUBLIC_SITE_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={data.navMain} />
        <AdminNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <OrganizationSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
