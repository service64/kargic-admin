import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  CreateSitemapBody,
  SitemapDetail,
  SitemapListItem,
  UpdateSitemapBody,
} from './types'

export const sitemapQueryKey = ['sitemap'] as const

export function useSitemapList() {
  return useQuery({
    queryKey: sitemapQueryKey,
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<SitemapListItem[]>>('/sitemap')
      return unwrapData(res)
    },
  })
}

export function useSitemapById(id: string | undefined) {
  return useQuery({
    queryKey: [...sitemapQueryKey, id],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<SitemapDetail>>(
        `/sitemap/${id}`,
      )
      return unwrapData(res)
    },
    enabled: Boolean(id),
  })
}

export function useCreateSitemap() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateSitemapBody) => {
      const res = await adminApi.post<ApiEnvelope<SitemapDetail>>(
        '/sitemap',
        body,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: sitemapQueryKey }),
  })
}

export function useUpdateSitemap() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: UpdateSitemapBody }) => {
      const res = await adminApi.patch<ApiEnvelope<SitemapDetail>>(
        `/sitemap/${input.id}`,
        input.body,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: sitemapQueryKey }),
  })
}

export function useDeleteSitemap() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/sitemap/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: sitemapQueryKey }),
  })
}
