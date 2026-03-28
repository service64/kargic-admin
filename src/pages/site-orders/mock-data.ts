export type OrderStatus = 'running' | 'completed' | 'delayed'

export type SiteOrder = {
  id: string
  client: string
  importerName: string
  exporterName: string
  status: OrderStatus
  /** ISO datetime */
  updatedAt: string
  amountCents: number
}

export type PartnerRow = {
  id: string
  company: string
  totalOrders: number
  lastOrderDate: string
  status: 'active' | 'inactive'
}

export type SiteOrdersStats = {
  ordersRunning: number
  totalImporters: number
  totalExporters: number
  ordersCompleted: number
}

export const MOCK_SITE_STATS: SiteOrdersStats = {
  ordersRunning: 18,
  totalImporters: 42,
  totalExporters: 36,
  ordersCompleted: 1240,
}

export const MOCK_ORDERS: SiteOrder[] = [
  {
    id: 'ORD-90821',
    client: 'Northwind Trading Pte Ltd',
    importerName: 'Northwind Trading',
    exporterName: 'Pacific Exports Ltd',
    status: 'running',
    updatedAt: '2026-03-27T09:40:00Z',
    amountCents: 45_200_00,
  },
  {
    id: 'ORD-90818',
    client: 'Pacific Exports Ltd',
    importerName: 'Harborline Imports',
    exporterName: 'Cobalt Export Group',
    status: 'running',
    updatedAt: '2026-03-27T08:55:00Z',
    amountCents: 12_890_50,
  },
  {
    id: 'ORD-90802',
    client: 'Harborline Imports',
    importerName: 'Harborline Imports',
    exporterName: 'Orient Shipping',
    status: 'delayed',
    updatedAt: '2026-03-26T22:10:00Z',
    amountCents: 8_100_00,
  },
  {
    id: 'ORD-90791',
    client: 'Summit Manufacturing',
    importerName: 'Keystone Retail',
    exporterName: 'Summit Manufacturing',
    status: 'completed',
    updatedAt: '2026-03-26T18:00:00Z',
    amountCents: 220_000_00,
  },
  {
    id: 'ORD-90788',
    client: 'Blue Delta Co.',
    importerName: 'Lumen Distribution',
    exporterName: 'TradeWind Partners',
    status: 'running',
    updatedAt: '2026-03-26T15:30:00Z',
    amountCents: 3_450_75,
  },
  {
    id: 'ORD-90775',
    client: 'Crescent Foods',
    importerName: 'Marina Wholesale',
    exporterName: 'Zenith Textiles',
    status: 'running',
    updatedAt: '2026-03-26T11:12:00Z',
    amountCents: 19_999_00,
  },
  {
    id: 'ORD-90760',
    client: 'Zenith Textiles',
    importerName: 'Bayfront Merchants',
    exporterName: 'Zenith Textiles',
    status: 'completed',
    updatedAt: '2026-03-25T20:45:00Z',
    amountCents: 56_000_00,
  },
  {
    id: 'ORD-90755',
    client: 'Atlas Logistics',
    importerName: 'Highline Procurement',
    exporterName: 'Vertex Outbound',
    status: 'delayed',
    updatedAt: '2026-03-25T14:00:00Z',
    amountCents: 1_200_00,
  },
  {
    id: 'ORD-90741',
    client: 'Keystone Retail',
    importerName: 'Keystone Retail',
    exporterName: 'Redwood Commodities',
    status: 'running',
    updatedAt: '2026-03-25T09:05:00Z',
    amountCents: 4_321_00,
  },
  {
    id: 'ORD-90730',
    client: 'Silver Fern Partners',
    importerName: 'Orchid Supply Chain',
    exporterName: 'Pacific Exports Ltd',
    status: 'running',
    updatedAt: '2026-03-24T16:40:00Z',
    amountCents: 990_00,
  },
  {
    id: 'ORD-90712',
    client: 'Redwood Commodities',
    importerName: 'Harborline Imports',
    exporterName: 'Redwood Commodities',
    status: 'completed',
    updatedAt: '2026-03-24T10:00:00Z',
    amountCents: 78_500_00,
  },
  {
    id: 'ORD-90698',
    client: 'Marina Wholesale',
    importerName: 'Marina Wholesale',
    exporterName: 'Summit Manufacturing',
    status: 'running',
    updatedAt: '2026-03-24T07:20:00Z',
    amountCents: 6_750_25,
  },
]

export const MOCK_IMPORTERS: PartnerRow[] = [
  {
    id: 'imp-1',
    company: 'Harborline Imports',
    totalOrders: 188,
    lastOrderDate: '2026-03-27',
    status: 'active',
  },
  {
    id: 'imp-2',
    company: 'Northwind Trading',
    totalOrders: 164,
    lastOrderDate: '2026-03-26',
    status: 'active',
  },
  {
    id: 'imp-3',
    company: 'Keystone Retail',
    totalOrders: 92,
    lastOrderDate: '2026-03-25',
    status: 'active',
  },
  {
    id: 'imp-4',
    company: 'Marina Wholesale',
    totalOrders: 71,
    lastOrderDate: '2026-03-24',
    status: 'inactive',
  },
  {
    id: 'imp-5',
    company: 'Lumen Distribution',
    totalOrders: 54,
    lastOrderDate: '2026-03-20',
    status: 'active',
  },
  {
    id: 'imp-6',
    company: 'Orchid Supply Chain',
    totalOrders: 48,
    lastOrderDate: '2026-03-18',
    status: 'active',
  },
  {
    id: 'imp-7',
    company: 'Bayfront Merchants',
    totalOrders: 39,
    lastOrderDate: '2026-03-15',
    status: 'inactive',
  },
  {
    id: 'imp-8',
    company: 'Highline Procurement',
    totalOrders: 31,
    lastOrderDate: '2026-03-12',
    status: 'active',
  },
]

export const MOCK_EXPORTERS: PartnerRow[] = [
  {
    id: 'exp-1',
    company: 'Pacific Exports Ltd',
    totalOrders: 201,
    lastOrderDate: '2026-03-27',
    status: 'active',
  },
  {
    id: 'exp-2',
    company: 'Summit Manufacturing',
    totalOrders: 156,
    lastOrderDate: '2026-03-26',
    status: 'active',
  },
  {
    id: 'exp-3',
    company: 'Zenith Textiles',
    totalOrders: 134,
    lastOrderDate: '2026-03-25',
    status: 'active',
  },
  {
    id: 'exp-4',
    company: 'Redwood Commodities',
    totalOrders: 98,
    lastOrderDate: '2026-03-24',
    status: 'active',
  },
  {
    id: 'exp-5',
    company: 'Orient Shipping',
    totalOrders: 76,
    lastOrderDate: '2026-03-21',
    status: 'inactive',
  },
  {
    id: 'exp-6',
    company: 'Cobalt Export Group',
    totalOrders: 62,
    lastOrderDate: '2026-03-19',
    status: 'active',
  },
  {
    id: 'exp-7',
    company: 'TradeWind Partners',
    totalOrders: 45,
    lastOrderDate: '2026-03-14',
    status: 'active',
  },
  {
    id: 'exp-8',
    company: 'Vertex Outbound',
    totalOrders: 33,
    lastOrderDate: '2026-03-10',
    status: 'inactive',
  },
]
