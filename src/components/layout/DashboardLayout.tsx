import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components/layout/AppSidebar'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4  lg:p-6  ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
