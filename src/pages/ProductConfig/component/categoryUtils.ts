import type { CategoryDto } from "@/hooks/api/category/types"

export function getCategoryImageUrl(cat: CategoryDto): string | undefined {
  const img = cat.image
  if (img && typeof img === "object" && "url" in img) return img.url
  return undefined
}

export function getCategoryImageId(cat: CategoryDto): string | undefined {
  const img = cat.image
  if (!img) return undefined
  if (typeof img === "string") return img
  return img._id
}
