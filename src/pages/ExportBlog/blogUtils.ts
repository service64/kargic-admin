import type { BlogImageRef, ExportBlogDto } from '@/hooks/api/exportBlog/types'

export function getBlogImageUrl(
  image?: BlogImageRef | string | null,
): string | undefined {
  if (!image) return undefined
  if (typeof image === 'string') return undefined
  return image.url
}

export function getBlogFeaturedImageUrl(blog: ExportBlogDto): string | undefined {
  return getBlogImageUrl(blog.featuredImage)
}

export function getBlogImageId(
  image?: BlogImageRef | string | null,
): string | undefined {
  if (!image) return undefined
  if (typeof image === 'string') return image
  return image._id
}
