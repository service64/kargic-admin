import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  CommandIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ScaleIcon,
  ShieldUserIcon,
  UsersRoundIcon,
  BadgeCheckIcon,
} from 'lucide-react'

import { DashboardNavUser } from '@/components/layout/DashboardNavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const user = {
  name: 'Demo User',
  email: 'user@example.com',
  avatar: '',
}

const mainNav: {
  title: string
  url: string
  icon: React.ReactNode
}[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: <LayoutDashboardIcon />,
  },
  {
    title: 'Dispute Management',
    url: '/dispute',
    icon: <ScaleIcon />,
  },
  {
    title: 'Subscriptions',
    url: '/subscription',
    icon: <CreditCardIcon />,
  },
  {
    title: 'Site Orders',
    url: '/site-orders',
    icon: <PackageIcon />,
  },
  {
    title: 'Activity Log',
    url: '/user-management/activity',
    icon: <ShieldUserIcon />,
  },
  {
    title: 'User Directory',
    url: '/user-management/users',
    icon: <UsersRoundIcon />,
  },
  {
    title: 'Seller Verification',
    url: '/seller-verification',
    icon: <BadgeCheckIcon />,
  },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

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
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                render={<Link to={item.url} />}
                isActive={
                  item.url === '/'
                    ? location.pathname === '/'
                    : location.pathname === item.url ||
                      location.pathname.startsWith(`${item.url}/`)
                }
                tooltip={item.title}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
