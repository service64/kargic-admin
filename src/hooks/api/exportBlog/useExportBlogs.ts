import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type {
  CreateExportBlogBody,
  ExportBlogDto,
  UpdateExportBlogBody,
} from './types'

export const exportBlogQueryKey = ['export-blogs'] as const

export function useExportBlogList() {
  return useQuery({
    queryKey: exportBlogQueryKey,
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<ExportBlogDto[]>>(
        '/export-blog/admin',
      )
      return unwrapData(res)
    },
  })
}

export function useExportBlogById(id: string | undefined) {
  return useQuery({
    queryKey: [...exportBlogQueryKey, id],
    queryFn: async () => {
      const res = await adminApi.get<ApiEnvelope<ExportBlogDto>>(
        `/export-blog/admin/${id}`,
      )
      return unwrapData(res)
    },
    enabled: Boolean(id),
  })
}

export function useCreateExportBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateExportBlogBody) => {
      const res = await adminApi.post<ApiEnvelope<ExportBlogDto>>(
        '/export-blog/create',
        body,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: exportBlogQueryKey }),
  })
}

export function useUpdateExportBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: UpdateExportBlogBody }) => {
      const res = await adminApi.patch<ApiEnvelope<ExportBlogDto>>(
        `/export-blog/${input.id}`,
        input.body,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: exportBlogQueryKey }),
  })
}

export function usePublishExportBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApi.patch<ApiEnvelope<ExportBlogDto>>(
        `/export-blog/${id}/publish`,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: exportBlogQueryKey }),
  })
}

export function useUnpublishExportBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await adminApi.patch<ApiEnvelope<ExportBlogDto>>(
        `/export-blog/${id}/unpublish`,
      )
      return unwrapData(res)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: exportBlogQueryKey }),
  })
}

export function useDeleteExportBlog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/export-blog/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: exportBlogQueryKey }),
  })
}
