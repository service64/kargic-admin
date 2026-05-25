import { useLocation } from 'react-router-dom'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/dispute': 'Dispute Management',
  '/subscription': 'Subscription Management',
  '/site-orders': 'Site Orders',
  '/user-management/impoters': 'Importers',
  '/user-management/exporters': 'Exporters',
  '/user-management/users': 'All users',
  '/seller-verification': 'Seller Verification',
}

export function SiteHeader() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Dashboard'

  return (
    <header className="flex   shrink-0 items-center gap-2 border-b h-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 shrink-0 data-vertical:self-auto"
        />
        <h1 className="min-w-0 truncate text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
