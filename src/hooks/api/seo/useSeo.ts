import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  CreateSeoBody,
  SeoDetail,
  SeoListItem,
  UpdateSeoBody,
} from './types'

export const seoQueryKey = ['seo'] as const

export function useSeoList() {
  return useQuery({
    queryKey: seoQueryKey,
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<SeoListItem[]>>('/seo')
      return unwrapData(res)
    },
  })
}

export function useSeoByPage(page: string | undefined) {
  return useQuery({
    queryKey: [...seoQueryKey, 'page', page],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<SeoDetail>>(
        `/seo/page/${encodeURIComponent(page!)}`,
      )
      return unwrapData(res)
    },
    enabled: Boolean(page),
  })
}

export function useCreateSeo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateSeoBody) => {
      const res = await adminApi.post<ApiEnvelope<SeoDetail>>('/seo', body)
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: seoQueryKey }),
  })
}

export function useUpdateSeo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: UpdateSeoBody }) => {
      const res = await adminApi.patch<ApiEnvelope<SeoDetail>>(
        `/seo/${input.id}`,
        input.body,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: seoQueryKey }),
  })
}

export function useDeleteSeo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/seo/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: seoQueryKey }),
  })
}
