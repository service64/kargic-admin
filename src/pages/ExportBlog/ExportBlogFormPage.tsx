"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { ImageIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { z } from "zod"

import { FormInput } from "@/components/form/FormInput"
import { FormQuillEditor } from "@/components/form/FormQuillEditor"
import { FormTextArea } from "@/components/form/FormTextArea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useCreateExportBlog,
  useExportBlogById,
  usePublishExportBlog,
  useUnpublishExportBlog,
  useUpdateExportBlog,
} from "@/hooks/api/exportBlog/useExportBlogs"
import {
  updateImageFile,
  uploadImageFile,
} from "@/hooks/media/useImageUpload"
import { cn } from "@/lib/utils"

import {
  getBlogFeaturedImageUrl,
  getBlogImageId,
} from "./blogUtils"

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Keep it under 500 characters"),
  content: z.string().min(1, "Article content is required"),
})

type BlogFormValues = z.infer<typeof blogFormSchema>

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Something went wrong"
}

function hasQuillContent(html: string): boolean {
  const text = html.replace(/<[^>]+>/g, "").trim()
  return text.length > 0
}

export function ExportBlogFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: blog, isLoading: loadingBlog } = useExportBlogById(
    isEdit ? id : undefined,
  )
  const createBlog = useCreateExportBlog()
  const updateBlog = useUpdateExportBlog()
  const publishBlog = usePublishExportBlog()
  const unpublishBlog = useUnpublishExportBlog()

  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(
    null,
  )
  const [removeImage, setRemoveImage] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isWorking, setIsWorking] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      content: "",
    },
  })

  React.useEffect(() => {
    if (!isEdit || !blog) return
    form.reset({
      title: blog.title,
      shortDescription: blog.excerpt ?? "",
      content: blog.content,
    })
    const featuredUrl = getBlogFeaturedImageUrl(blog)
    if (featuredUrl) setPreviewUrl(featuredUrl)
  }, [isEdit, blog, form])

  const saving = createBlog.isPending || updateBlog.isPending
  const submitBusy = isWorking || saving

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

  async function buildPayload(
    values: BlogFormValues,
    publishNow = false,
  ) {
    const title = values.title.trim()
    const shortDescription = values.shortDescription.trim()
    const altText = title || "Blog"

    let featuredImageId: string | undefined | null

    if (removeImage) {
      featuredImageId = null
    } else if (pendingImageFile) {
      if (isEdit && blog) {
        const existingId = getBlogImageId(blog.featuredImage)
        if (existingId) {
          await updateImageFile({
            id: existingId,
            file: pendingImageFile,
            useCase: "BLOG",
            alt: altText,
          })
        } else {
          const img = await uploadImageFile({
            file: pendingImageFile,
            useCase: "BLOG",
            alt: altText,
          })
          featuredImageId = img._id
        }
      } else {
        const img = await uploadImageFile({
          file: pendingImageFile,
          useCase: "BLOG",
          alt: altText,
        })
        featuredImageId = img._id
      }
    } else if (isEdit && blog) {
      const existingId = getBlogImageId(blog.featuredImage)
      if (existingId) featuredImageId = existingId
    }

    const seoImageId =
      featuredImageId && featuredImageId !== null ? featuredImageId : undefined

    const payload: {
      title: string
      excerpt: string
      content: string
      status?: "draft" | "published"
      featuredImage?: string | null
      seo: {
        title: string
        description: string
        image?: string
      }
    } = {
      title,
      excerpt: shortDescription,
      content: values.content,
      ...(featuredImageId !== undefined ? { featuredImage: featuredImageId } : {}),
      seo: {
        title,
        description: shortDescription,
        ...(seoImageId ? { image: seoImageId } : {}),
      },
    }

    if (!isEdit || publishNow) {
      payload.status = publishNow ? "published" : "draft"
    }

    return payload
  }

  async function saveArticle(values: BlogFormValues, publishNow = false) {
    if (!hasQuillContent(values.content)) {
      form.setError("content", { message: "Article content is required" })
      return
    }

    if (!isEdit && !pendingImageFile && !previewUrl) {
      setFormError("Featured image is required")
      return
    }

    if (isEdit && removeImage && !pendingImageFile) {
      setFormError("Featured image is required")
      return
    }

    setFormError(null)
    setIsWorking(true)
    try {
      const payload = await buildPayload(values, publishNow)
      if (isEdit && id) {
        await updateBlog.mutateAsync({ id, body: payload })
        if (publishNow && blog?.status !== "published") {
          await publishBlog.mutateAsync(id)
        }
        navigate("/export-blog")
        return
      }
      await createBlog.mutateAsync(payload)
      navigate("/export-blog")
    } catch (err) {
      setFormError(apiMessage(err))
    } finally {
      setIsWorking(false)
    }
  }

  async function onSubmit(values: BlogFormValues) {
    await saveArticle(values, false)
  }

  async function onPublish(values: BlogFormValues) {
    await saveArticle(values, true)
  }

  async function handlePublishToggle() {
    if (!id || !blog) return
    setFormError(null)
    try {
      if (blog.status === "published") {
        await unpublishBlog.mutateAsync(id)
      } else {
        await publishBlog.mutateAsync(id)
      }
    } catch (err) {
      setFormError(apiMessage(err))
    }
  }

  if (isEdit && loadingBlog) {
    return (
      <div className="container mx-auto max-w-3xl space-y-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const displayImageSrc =
    previewUrl ||
    (isEdit && blog && !removeImage && !pendingImageFile
      ? getBlogFeaturedImageUrl(blog)
      : undefined)

  return (
    <div className="container mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
            Export Blog
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit article" : "New article"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Add title, image, and short description. Write the full article below.
          </p>
        </div>
        <Button variant="outline" render={<Link to="/export-blog" />}>
          Back to list
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold">Basic info</h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Title and summary shown on the public blog listing.
              </p>
            </div>

            <FormInput
              control={form.control}
              name="title"
              label="Title"
              placeholder="Article title"
            />

            <FormTextArea
              control={form.control}
              name="shortDescription"
              label="Short description"
              placeholder="Brief summary for listing cards and search results"
              rows={3}
              maxLength={500}
            />
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold">Featured image</h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Used on the blog listing and article header.
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
                    : "JPEG, PNG, or WebP — required before saving."}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold">Article content</h2>
              <p className="text-muted-foreground text-xs mt-0.5">
                Full article body — format with the editor toolbar.
              </p>
            </div>

            <FormQuillEditor
              control={form.control}
              name="content"
              label=""
              placeholder="Write your article here…"
            />
          </section>

          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
            <Button type="submit" variant="outline" disabled={submitBusy}>
              {submitBusy && !publishBlog.isPending
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save changes"
                  : "Save as draft"}
            </Button>
            <Button
              type="button"
              disabled={submitBusy}
              onClick={form.handleSubmit(onPublish)}
            >
              {submitBusy
                ? "Publishing…"
                : isEdit && blog?.status === "published"
                  ? "Save & keep published"
                  : "Publish to website"}
            </Button>
            {isEdit && blog?.status === "published" ? (
              <Button
                type="button"
                variant="secondary"
                disabled={unpublishBlog.isPending}
                onClick={handlePublishToggle}
              >
                Unpublish
              </Button>
            ) : null}
          </div>
          <p className="text-muted-foreground text-xs">
            Only <strong>published</strong> articles appear on the public Export
            Blog page. Drafts stay in the admin panel only.
          </p>
        </form>
      </Form>
    </div>
  )
}
