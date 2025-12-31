"use client";

import * as React from "react";
import {
  LayoutDashboardIcon as IconDashboard,
  Settings2Icon as IconSettings,
} from "lucide-react";

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
import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/account/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Organizations",
      url: "/account/organizations",
      icon: IconSettings,
    },
  ],
  navSecondary: [
    {
      title: "User Settings",
      url: "/account/settings",
      icon: IconSettings,
    },
    {
      title: "Security",
      url: "/account/security",
      icon: IconSettings,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/account/dashboard">
                <span className="text-base font-semibold">
                  {process.env.NEXT_PUBLIC_SITE_NAME}
                </span>
              </a>
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
