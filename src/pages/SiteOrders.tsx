import { OrdersSection } from '@/pages/site-orders/OrdersSection'

export function SiteOrders() {
  return (
    <div className="space-y-4 px-4 py-4">
      <h1 className="text-foreground text-lg font-semibold tracking-tight">
        Site Orders
      </h1>

      <OrdersSection />
    </div>
  )
}
