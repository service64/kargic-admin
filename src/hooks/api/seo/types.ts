export type SeoOgImage = {
  _id: string
  url: string
  alt?: string
  name?: string
}

export type SeoListItem = {
  _id: string
  page: string
  title: string
  ogImage: SeoOgImage | null
}

export type SeoDetail = {
  _id: string
  page: string
  title: string
  description: string
  keywords: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage: SeoOgImage | null
  createdAt?: string
  updatedAt?: string
}

export type CreateSeoBody = {
  page: string
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export type UpdateSeoBody = {
  page?: string
  title?: string
  description?: string
  keywords?: string[] | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
}
