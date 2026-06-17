"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { z } from "zod"

import { FormInput } from "@/components/form/FormInput"
import { FormTextArea } from "@/components/form/FormTextArea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useCreateSeo,
  useSeoByPage,
  useUpdateSeo,
} from "@/hooks/api/seo/useSeo"
import {
  updateImageFile,
  uploadImageFile,
} from "@/hooks/media/useImageUpload"
import { cn } from "@/lib/utils"
import { SeoPageKeyField } from "./SeoPageKeyField"

const pageKeySchema = z
  .string()
  .trim()
  .min(1, "Page key is required")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens")
  .refine((s) => !/^[a-fA-F0-9]{24}$/.test(s), "Use page key, not document id")

const seoFormSchema = z.object({
  page: pageKeySchema,
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(500),
  keywords: z.string().optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().max(500).optional(),
})

type SeoFormValues = z.infer<typeof seoFormSchema>

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Something went wrong"
}

function parseKeywords(raw: string | undefined): string[] | undefined {
  const items = (raw ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
  return items.length ? items : undefined
}

export default function SeoCreateUpdateForm() {
  const { page: pageParam } = useParams<{ page: string }>()
  const isEdit = Boolean(pageParam)
  const navigate = useNavigate()

  const { data: seo, isLoading: loadingSeo } = useSeoByPage(
    isEdit ? pageParam : undefined,
  )
  const createSeo = useCreateSeo()
  const updateSeo = useUpdateSeo()

  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(
    null,
  )
  const [removeImage, setRemoveImage] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isWorking, setIsWorking] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      page: "",
      title: "",
      description: "",
      keywords: "",
      ogTitle: "",
      ogDescription: "",
    },
  })

  React.useEffect(() => {
    if (!isEdit || !seo) return
    form.reset({
      page: seo.page,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords?.join(", ") ?? "",
      ogTitle: seo.ogTitle ?? "",
      ogDescription: seo.ogDescription ?? "",
    })
    if (seo.ogImage?.url) setPreviewUrl(seo.ogImage.url)
  }, [isEdit, seo, form])

  const submitBusy =
    isWorking || createSeo.isPending || updateSeo.isPending

  function onImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setFormError(null)
    setRemoveImage(false)
    setPendingImageFile(file)
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function resolveOgImageId(title: string): Promise<string | null | undefined> {
    const altText = title || "SEO OG image"

    if (removeImage) return null

    if (pendingImageFile) {
      const existingId = seo?.ogImage?._id
      if (isEdit && existingId) {
        await updateImageFile({
          id: existingId,
          file: pendingImageFile,
          useCase: "BANNER",
          alt: altText,
        })
        return existingId
      }
      const img = await uploadImageFile({
        file: pendingImageFile,
        useCase: "BANNER",
        alt: altText,
      })
      return img._id
    }

    if (isEdit && seo?.ogImage?._id) return seo.ogImage._id
    return undefined
  }

  async function onSubmit(values: SeoFormValues) {
    setFormError(null)
    setIsWorking(true)
    try {
      const title = values.title.trim()
      const ogImageId = await resolveOgImageId(title)
      const keywords = parseKeywords(values.keywords)
      const ogTitle = values.ogTitle?.trim() || undefined
      const ogDescription = values.ogDescription?.trim() || undefined

      if (isEdit && seo) {
        await updateSeo.mutateAsync({
          id: seo._id,
          body: {
            page: values.page.trim().toLowerCase(),
            title,
            description: values.description.trim(),
            keywords: keywords ?? null,
            ogTitle: ogTitle ?? null,
            ogDescription: ogDescription ?? null,
            ...(ogImageId !== undefined ? { ogImage: ogImageId } : {}),
          },
        })
      } else {
        await createSeo.mutateAsync({
          page: values.page.trim().toLowerCase(),
          title,
          description: values.description.trim(),
          keywords,
          ogTitle,
          ogDescription,
          ...(ogImageId ? { ogImage: ogImageId } : {}),
        })
      }
      navigate("/seo")
    } catch (err) {
      setFormError(apiMessage(err))
    } finally {
      setIsWorking(false)
    }
  }

  if (isEdit && loadingSeo) {
    return (
      <div className="container mx-auto max-w-2xl space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const displayImageSrc =
    previewUrl ||
    (isEdit && seo && !removeImage && !pendingImageFile
      ? seo.ogImage?.url
      : undefined)

  return (
    <div className="container mx-auto max-w-2xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
            SEO
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit page SEO" : "New page SEO"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage meta title, description, and Open Graph image per page.
          </p>
        </div>
        <Button variant="outline" render={<Link to="/seo" />}>
          Back to list
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SeoPageKeyField
            control={form.control}
            name="page"
            disabled={submitBusy || isEdit}
            fallbackKey={isEdit ? seo?.page : undefined}
          />

          <FormInput
            control={form.control}
            name="title"
            label="Meta title"
            placeholder="Page title for search engines"
            disabled={submitBusy}
          />

          <FormTextArea
            control={form.control}
            name="description"
            label="Meta description"
            placeholder="Short summary for search results"
            rows={3}
            maxLength={500}
            disabled={submitBusy}
          />

          <FormInput
            control={form.control}
            name="keywords"
            label="Keywords"
            placeholder="b2b, export, bangladesh (comma separated)"
            disabled={submitBusy}
          />

          <FormInput
            control={form.control}
            name="ogTitle"
            label="OG title (optional)"
            placeholder="Social share title"
            disabled={submitBusy}
          />

          <FormTextArea
            control={form.control}
            name="ogDescription"
            label="OG description (optional)"
            placeholder="Social share description"
            rows={2}
            maxLength={500}
            disabled={submitBusy}
          />

          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold">OG image</h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Shown when the page is shared on social platforms.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg bg-muted/40 p-4 sm:flex-row sm:items-center">
              <div
                className={cn(
                  "flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted",
                  !displayImageSrc && "text-muted-foreground",
                )}
              >
                {displayImageSrc ? (
                  <img
                    src={displayImageSrc}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-10 opacity-40" aria-hidden />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={onImagePick}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={submitBusy}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose image
                  </Button>
                  {displayImageSrc && !removeImage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      disabled={submitBusy}
                      onClick={() => {
                        setRemoveImage(true)
                        setPendingImageFile(null)
                        if (previewUrl?.startsWith("blob:")) {
                          URL.revokeObjectURL(previewUrl)
                        }
                        setPreviewUrl(null)
                      }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-xs">
                  {pendingImageFile
                    ? `Selected: ${pendingImageFile.name}`
                    : "JPEG, PNG, or WebP. On edit, replacing uses the image update API."}
                </p>
              </div>
            </div>
          </section>

          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="flex gap-3 border-t border-border/60 pt-6">
            <Button type="submit" disabled={submitBusy}>
              {submitBusy
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save changes"
                  : "Create SEO"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={submitBusy}
              onClick={() => navigate("/seo")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
