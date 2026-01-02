"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCurrentOrganization } from "@daveyplate/better-auth-ui";
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
import { getOrgNavItems } from "@/app/nav-config";

export function OrgSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { slug } = useParams();
  const data = getOrgNavItems(slug as string);
  const org = useCurrentOrganization();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href={`/org/${slug}/dashboard`}>
                <span className="text-base font-semibold">
                  {org.data?.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <OrgNavMain items={data.navMain} />
        <OrgNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
