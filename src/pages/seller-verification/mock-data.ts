export type SellerStatus = 'Reviewing' | 'Pending' | 'Flagged'

export type EntityType = 'Factory' | 'Distributor' | 'Trader' | 'Warehouse'

export type TradeRole = 'Importer' | 'Exporter'

export type DocStage = 'complete' | 'warning' | 'pending'

export type TimelineStep = {
  title: string
  at: string
  actor: string
}

export type SellerRequest = {
  id: string
  displayId: string
  name: string
  submittedAt: string
  docs: [DocStage, DocStage, DocStage, DocStage]
  status: SellerStatus
  entityType: EntityType
  tradeRole: TradeRole
  entityLabel: string
  registrationDate: string
  addressLines: string[]
  timeline: TimelineStep[]
}

const TL_DEFAULT: TimelineStep[] = [
  {
    title: 'Documents submitted',
    at: 'Oct 22, 2023 — 09:14',
    actor: 'Seller portal',
  },
  {
    title: 'Review started',
    at: 'Oct 23, 2023 — 11:02',
    actor: 'Elena Rodriguez',
  },
  {
    title: 'Automated compliance scan',
    at: 'Oct 23, 2023 — 11:08',
    actor: 'System',
  },
]

const NAMES = [
  ['Northwind Trading', 'RG-901'],
  ['Pacific Exports Ltd', 'RG-902'],
  ['Harborline Imports', 'RG-903'],
  ['Summit Manufacturing', 'RG-904'],
  ['Blue Delta Co.', 'RG-905'],
  ['Crescent Foods', 'RG-906'],
  ['Zenith Textiles', 'RG-907'],
  ['Atlas Logistics', 'RG-908'],
  ['Keystone Retail', 'RG-909'],
  ['Silver Fern Partners', 'RG-910'],
  ['Redwood Commodities', 'RG-911'],
  ['Marina Wholesale', 'RG-912'],
] as const

const ENTITY: EntityType[] = [
  'Factory',
  'Distributor',
  'Trader',
  'Warehouse',
  'Factory',
  'Distributor',
]

function docPattern(i: number): [DocStage, DocStage, DocStage, DocStage] {
  const p: DocStage[][] = [
    ['complete', 'complete', 'warning', 'pending'],
    ['complete', 'complete', 'complete', 'complete'],
    ['complete', 'warning', 'pending', 'pending'],
    ['warning', 'pending', 'pending', 'pending'],
  ]
  return p[i % p.length] as [DocStage, DocStage, DocStage, DocStage]
}

function statusFor(i: number): SellerStatus {
  const r = i % 5
  if (r === 0) return 'Reviewing'
  if (r === 1) return 'Flagged'
  return 'Pending'
}

export const PENDING_PIPELINE_TOTAL = 24

export const MOCK_SELLERS: SellerRequest[] = Array.from({ length: 24 }, (_, i) => {
  const [name, did] = NAMES[i % NAMES.length]
  const day = 15 + (i % 10)
  const type = ENTITY[i % ENTITY.length]
  return {
    id: `sv-${String(i + 1).padStart(3, '0')}`,
    displayId: `#${did}`,
    name: i >= 12 ? `${name} (${i + 1})` : name,
    submittedAt: `2023-10-${String(day).padStart(2, '0')}T${10 + (i % 8)}:${(i * 5) % 60}:00`,
    docs: docPattern(i),
    status: statusFor(i),
    entityType: type,
    tradeRole: i % 2 === 0 ? 'Importer' : 'Exporter',
    entityLabel:
      type === 'Factory'
        ? 'Manufacturing entity'
        : type === 'Distributor'
          ? 'Distribution partner'
          : type === 'Trader'
            ? 'Trading desk'
            : 'Storage & fulfillment',
    registrationDate: `March ${12 + (i % 15)}, 202${1 + (i % 3)}`,
    addressLines: [
      `${120 + i} Commerce Way, Suite ${100 + i}`,
      `Singapore ${89000 + i}`,
    ],
    timeline: TL_DEFAULT,
  }
})
