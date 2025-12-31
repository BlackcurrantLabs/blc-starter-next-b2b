"use client";

import * as React from "react";
import {
  LayoutDashboardIcon as IconDashboard,
  Settings2Icon as IconSettings,
} from "lucide-react";

import { OrgNavMain } from "@/app/org/[slug]/components/org-nav-main";
import { OrgNavSecondary } from "@/app/org/[slug]/components/org-nav-secondary";
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
import { useParams } from "next/navigation";

export function OrgSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { slug } = useParams();
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: `/org/${slug}/dashboard`,
        icon: IconDashboard,
      },
    ],
    navSecondary: [
      {
        title: "Organization Settings",
        url: `/org/${slug}/settings`,
        icon: IconSettings,
      },
      {
        title: "Organization Members",
        url: `/org/${slug}/members`,
        icon: IconSettings,
      },
    ],
  };

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
        <OrgNavMain items={data.navMain} />
        <OrgNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <OrganizationSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
