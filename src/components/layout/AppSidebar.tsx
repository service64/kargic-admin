import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronRightIcon,
  CommandIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ScaleIcon,
  ShieldUserIcon,
  UsersRoundIcon,
  BadgeCheckIcon,
  Box,
  MessagesSquareIcon,
  MailIcon,
  NewspaperIcon,
  SearchIcon,
} from "lucide-react";

import { DashboardNavUser } from "@/components/layout/DashboardNavUser";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavLinkItem = {
  type: "link";
  title: string;
  url: string;
  icon: React.ReactNode;
};

type NavGroupItem = {
  type: "group";
  title: string;
  icon: React.ReactNode;
  items: { title: string; url: string }[];
};

type NavItem = NavLinkItem | NavGroupItem;

const mainNav: NavItem[] = [
  {
    type: "link",
    title: "Dashboard",
    url: "/",
    icon: <LayoutDashboardIcon />,
  },
  {
    type: "link",
    title: "Dispute Management",
    url: "/dispute",
    icon: <ScaleIcon />,
  },
  {
    type: "link",
    title: "Subscriptions",
    url: "/subscription",
    icon: <CreditCardIcon />,
  },
  {
    type: "link",
    title: "Site Orders",
    url: "/site-orders",
    icon: <PackageIcon />,
  },
  {
    type: "link",
    title: "Messages",
    url: "/messages",
    icon: <MessagesSquareIcon />,
  },
  {
    type: "link",
    title: "Contacts",
    url: "/contacts",
    icon: <MailIcon />,
  },
  {
    type: "link",
    title: "Export Blog",
    url: "/export-blog",
    icon: <NewspaperIcon />,
  },
  {
    type: "group",
    title: "SEO",
    icon: <SearchIcon />,
    items: [
      { title: "Page SEO", url: "/seo" },
      { title: "Sitemap Manage", url: "/seo/sitemap" },
    ],
  },
  {
    type: "link",
    title: "Product Category",
    url: "/product-config",
    icon: <Box />,
  },
  {
    type: "link",
    title: "Users",
    url: "/user-management/users",
    icon: <ShieldUserIcon />,
  },
  {
    type: "link",
    title: "Impoters",
    url: "/user-management/impoters",
    icon: <ShieldUserIcon />,
  },
  {
    type: "link",
    title: "Exporters",
    url: "/user-management/exporters",
    icon: <UsersRoundIcon />,
  },
  {
    type: "link",
    title: "Seller Verification",
    url: "/seller-verification",
    icon: <BadgeCheckIcon />,
  },
];

function isPathActive(pathname: string, url: string) {
  if (url === "/") {
    return pathname === "/";
  }

  if (url === "/seo") {
    return (
      pathname === "/seo" ||
      (pathname.startsWith("/seo/") && !pathname.startsWith("/seo/sitemap"))
    );
  }

  return pathname === url || pathname.startsWith(`${url}/`);
}

function NavGroup({
  item,
  pathname,
}: {
  item: NavGroupItem;
  pathname: string;
}) {
  const isGroupActive = item.items.some((child) =>
    isPathActive(pathname, child.url),
  );
  const [open, setOpen] = React.useState(isGroupActive);

  React.useEffect(() => {
    if (isGroupActive) {
      setOpen(true);
    }
  }, [isGroupActive]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={isGroupActive}
        onClick={() => setOpen((prev) => !prev)}
      >
        {item.icon}
        <span>{item.title}</span>
        <ChevronRightIcon
          className={cn(
            "ml-auto size-4 transition-transform",
            open && "rotate-90",
          )}
        />
      </SidebarMenuButton>
      {open ? (
        <SidebarMenuSub>
          {item.items.map((child) => (
            <SidebarMenuSubItem key={child.url}>
              <SidebarMenuSubButton
                render={<Link to={child.url} />}
                isActive={isPathActive(pathname, child.url)}
              >
                <span>{child.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const authUser = useAuthStore((s) => s.user);

  const user = {
    name: authUser?.email?.split("@")[0]?.trim() || "User",
    email: authUser?.email ?? "",
    avatar: "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link to="/" />}
              tooltip="Home"
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Acme Inc.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNav.map((item) =>
            item.type === "group" ? (
              <NavGroup
                key={item.title}
                item={item}
                pathname={location.pathname}
              />
            ) : (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  render={<Link to={item.url} />}
                  isActive={isPathActive(location.pathname, item.url)}
                  tooltip={item.title}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
