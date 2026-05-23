export type OrderStatus =
  | 'awaiting_exporter_approval'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'received'
  | 'cheking'
  | 'completed'
  | 'cancelled'
  | 'returned'

export type AdminOrderListRowDto = {
  orderId: string
  orderCreatedAt: string
  productId: string
  productName: string
  unitPrice: number
  totalPrice: number
  importerName: string
  exporterName: string
  deliveryMaxAt: string | null
  status: OrderStatus
}

export type OrderListMeta = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AdminOrdersPageDto = {
  data: AdminOrderListRowDto[]
  meta: OrderListMeta
}

export type AdminOrdersQueryParams = {
  page?: number
  limit?: number
  status?: OrderStatus
  orderDate?: string
}
