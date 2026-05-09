import { useMutation } from '@tanstack/react-query'

import { adminApi } from '@/hooks/adminApi'
import { unwrapData, type ApiEnvelope } from '@/lib/apiEnvelope'

import type { MediaUseCase, UploadedImage } from './types'

export type { MediaUseCase, UploadedImage } from './types'

function buildImageFormData(
  file: File,
  useCase: MediaUseCase,
  alt?: string,
): FormData {
  const form = new FormData()
  form.append('image', file)
  form.append('useCase', useCase)
  if (alt !== undefined && alt !== '') {
    form.append('alt', alt)
  }
  return form
}

/** POST `/media` — multipart field name must be `image` (matches server multer). */
export async function uploadImageFile(input: {
  file: File
  useCase: MediaUseCase
  alt?: string
}): Promise<UploadedImage> {
  const form = buildImageFormData(input.file, input.useCase, input.alt)
  const res = await adminApi.post<ApiEnvelope<UploadedImage>>('/media', form)
  return unwrapData(res)
}

/** PATCH `/media/:id` — replaces file (same multipart shape as upload). */
export async function updateImageFile(input: {
  id: string
  file: File
  useCase: MediaUseCase
  alt?: string
}): Promise<UploadedImage> {
  const form = buildImageFormData(input.file, input.useCase, input.alt)
  const res = await adminApi.patch<ApiEnvelope<UploadedImage>>(
    `/media/${input.id}`,
    form,
  )
  return unwrapData(res)
}

export async function deleteImageFile(id: string): Promise<void> {
  await adminApi.delete(`/media/${id}`)
}

/**
 * Reusable image upload / update / delete aligned with `server-setup` media routes.
 * Use `upload` / `update` / `remove` mutations from any feature (categories, products, etc.).
 */
export function useImageUpload() {
  const upload = useMutation({
    mutationFn: uploadImageFile,
  })

  const update = useMutation({
    mutationFn: updateImageFile,
  })

  const remove = useMutation({
    mutationFn: deleteImageFile,
  })

  return {
    upload,
    update,
    remove,
    /** Convenience: pending state for any in-flight image op */
    isBusy: upload.isPending || update.isPending || remove.isPending,
  }
}
