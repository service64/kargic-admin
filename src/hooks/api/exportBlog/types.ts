export type BlogImageRef = {
  _id: string
  url: string
  name?: string
  alt?: string
}

export type BlogSeo = {
  title?: string
  description?: string
  image?: BlogImageRef | string | null
  keywords?: string[]
}

export type ExportBlogStatus = 'draft' | 'published'

export type ExportBlogDto = {
  _id: string
  authorId?: { _id: string; email?: string } | string
  title: string
  slug: string
  excerpt?: string
  content: string
  tag?: string
  featuredImage?: BlogImageRef | string | null
  readTimeMinutes?: number
  status: ExportBlogStatus
  publishedAt?: string | null
  isFeatured?: boolean
  seo?: BlogSeo
  createdAt?: string
  updatedAt?: string
}

export type CreateExportBlogBody = {
  title: string
  excerpt?: string
  content: string
  tag?: string
  featuredImage?: string | null
  readTimeMinutes?: number
  isFeatured?: boolean
  status?: ExportBlogStatus
  seo?: {
    title?: string
    description?: string
    image?: string | null
    keywords?: string[]
  }
}

export type UpdateExportBlogBody = Partial<CreateExportBlogBody> & {
  excerpt?: string | null
  tag?: string | null
  featuredImage?: string | null
  readTimeMinutes?: number | null
  seo?: CreateExportBlogBody['seo'] | null
}
