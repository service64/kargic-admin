export const SITEMAP_CHANGE_FREQUENCIES = [
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
] as const

export type SitemapChangeFrequency = (typeof SITEMAP_CHANGE_FREQUENCIES)[number]

export type SitemapListItem = {
  _id: string
  url: string
  changeFrequency: SitemapChangeFrequency
  priority: number
  lastModified: string
  enabled: boolean
  updatedAt?: string
}

export type SitemapDetail = SitemapListItem & {
  createdAt?: string
}

export type CreateSitemapBody = {
  url: string
  changeFrequency: SitemapChangeFrequency
  priority: number
  lastModified: string
  enabled?: boolean
}

export type UpdateSitemapBody = {
  url?: string
  changeFrequency?: SitemapChangeFrequency
  priority?: number
  lastModified?: string
  enabled?: boolean
}

export const SITEMAP_PRIORITY_OPTIONS = [
  { label: '1.0 — Highest', value: '1' },
  { label: '0.9', value: '0.9' },
  { label: '0.8', value: '0.8' },
  { label: '0.7', value: '0.7' },
  { label: '0.6', value: '0.6' },
  { label: '0.5 — Default', value: '0.5' },
  { label: '0.4', value: '0.4' },
  { label: '0.3', value: '0.3' },
  { label: '0.2', value: '0.2' },
  { label: '0.1 — Lowest', value: '0.1' },
] as const

export const SITEMAP_FREQUENCY_OPTIONS = SITEMAP_CHANGE_FREQUENCIES.map(
  (value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
  }),
)
