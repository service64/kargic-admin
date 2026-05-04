import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { CategoryDto, CreateCategoryBody, UpdateCategoryBody } from './types'

export const categoryQueryKey = ['categories'] as const

export function useCategoryList() {
  return useQuery({
    queryKey: categoryQueryKey,
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<CategoryDto[]>>(`/category`)
      return unwrapData(res)
    },
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateCategoryBody) => {
      const res = await adminApi.post<ApiEnvelope<CategoryDto>>(
        `/category/create`,
        body,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryQueryKey }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: UpdateCategoryBody }) => {
      const res = await adminApi.patch<ApiEnvelope<CategoryDto>>(
        `/category/${input.id}`,
        input.body,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryQueryKey }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/category/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryQueryKey }),
  })
}
