export type CategoryImageRef = {
  _id: string
  url: string
  name?: string
  alt?: string
}

export type CategoryParentRef = {
  _id: string
  categoryName: string
  slug?: string
  level?: number
}

export type CategoryDto = {
  _id: string
  categoryName: string
  description?: string
  slug: string
  level?: number
  image?: CategoryImageRef | string | null
  parentCategory?: CategoryParentRef | string | null
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateCategoryBody = {
  categoryName: string
  description?: string
  image?: string
  parentCategory?: string | null
}

export type UpdateCategoryBody = {
  categoryName?: string
  description?: string | null
  image?: string | null
  parentCategory?: string | null
}
