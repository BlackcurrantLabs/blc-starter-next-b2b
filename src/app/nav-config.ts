import {
  LayoutDashboardIcon as IconDashboard,
  Settings2Icon as IconSettings,
  FileText,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export type NavSection = {
  navMain: NavItem[];
  navSecondary: NavItem[];
};

export function getPageTitle(pathname: string, navConfig: NavSection): string {
  const allItems = [...navConfig.navMain, ...navConfig.navSecondary];
  // Find exact match first
  const exactMatch = allItems.find((item) => item.url === pathname);
  if (exactMatch) return exactMatch.title;

  // Fallback to startsWith for nested routes (optional, but good UX)
  // Sort by length to match most specific path first
  const match = allItems
    .filter((item) => pathname.startsWith(item.url))
    .sort((a, b) => b.url.length - a.url.length)[0];

  return match ? match.title : process.env.NEXT_PUBLIC_SITE_NAME ?? "";
}

export function getAccountNavItems(): NavSection {
  return {
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
}

export function getOrgNavItems(slug: string): NavSection {
  return {
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
}

export function getAdminNavItems(): NavSection {
  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Blog",
        url: "/admin/blog",
        icon: FileText,
      },
      {
        title: "List Organizations",
        url: "/admin/list-orgs",
        icon: IconSettings,
      },
      {
        title: "Contact Queries",
        url: "/admin/queries",
        icon: IconDashboard,
      },
    ],
    navSecondary: [],
  };
}
