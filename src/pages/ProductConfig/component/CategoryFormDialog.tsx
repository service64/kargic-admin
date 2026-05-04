"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { isAxiosError } from "axios"
import { ImageIcon } from "lucide-react"
import { z } from "zod"

import { FormInput } from "@/components/form/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextArea } from "@/components/form/FormTextArea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import {
  updateImageFile,
  uploadImageFile,
} from "@/hooks/media/useImageUpload"
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/api/category/useCategories"
import type { CategoryDto } from "@/hooks/api/category/types"
import { cn } from "@/lib/utils"

import {
  getCategoryImageId,
  getCategoryImageUrl,
} from "./categoryUtils"

const categoryFormSchema = z.object({
  categoryName: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Something went wrong"
}

type CategoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  category?: CategoryDto | null
  categories: CategoryDto[]
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  mode,
  category,
  categories,
}: CategoryFormDialogProps) {
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  /** Selected file — upload runs only on form submit (Create / Save). */
  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(
    null,
  )
  const [removeImage, setRemoveImage] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isWorking, setIsWorking] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const editingId = category?._id

  const parentOptions = React.useMemo(() => {
    const none = { value: "", label: "None (root category)" }
    const rows = categories
      .filter((c) => (mode === "edit" && editingId ? c._id !== editingId : true))
      .map((c) => ({ value: c._id, label: c.categoryName }))
    return [none, ...rows]
  }, [categories, mode, editingId])

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      categoryName: "",
      description: "",
      parentCategory: "",
    },
  })

  React.useEffect(() => {
    if (!open) return
    setFormError(null)
    setPendingImageFile(null)
    setRemoveImage(false)
    setIsWorking(false)
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)

    if (mode === "create") {
      form.reset({ categoryName: "", description: "", parentCategory: "" })
      return
    }

    if (category) {
      const parentVal =
        category.parentCategory &&
        typeof category.parentCategory === "object"
          ? category.parentCategory._id
          : typeof category.parentCategory === "string"
            ? category.parentCategory
            : ""
      form.reset({
        categoryName: category.categoryName,
        description: category.description ?? "",
        parentCategory: parentVal,
      })
      const u = getCategoryImageUrl(category)
      if (u) setPreviewUrl(u)
    }
  }, [open, mode, category, form])

  const saving = createCategory.isPending || updateCategory.isPending
  const submitBusy = isWorking || saving

  function onFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setFormError(null)
    setRemoveImage(false)
    setPendingImageFile(file)
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function onSubmit(values: CategoryFormValues) {
    setFormError(null)
    setIsWorking(true)
    const parentRaw = values.parentCategory?.trim()
    const parentPayload = parentRaw ? parentRaw : null
    const altText = values.categoryName.trim() || "Category"

    try {
      if (mode === "create") {
        let imageId: string | undefined
        if (pendingImageFile) {
          const img = await uploadImageFile({
            file: pendingImageFile,
            useCase: "CATEGORY",
            alt: altText,
          })
          imageId = img._id
        }

        await createCategory.mutateAsync({
          categoryName: values.categoryName.trim(),
          description: values.description?.trim() || undefined,
          image: imageId,
          parentCategory: parentPayload,
        })
        onOpenChange(false)
        return
      }

      if (!category) return

      const body: {
        categoryName?: string
        description?: string | null
        image?: string | null
        parentCategory?: string | null
      } = {
        categoryName: values.categoryName.trim(),
      }

      const desc = values.description?.trim()
      body.description = desc === "" ? null : desc ?? null
      body.parentCategory = parentPayload

      const existingImageId = getCategoryImageId(category)

      if (removeImage) {
        body.image = null
      } else if (pendingImageFile) {
        if (existingImageId) {
          await updateImageFile({
            id: existingImageId,
            file: pendingImageFile,
            useCase: "CATEGORY",
            alt: altText,
          })
        } else {
          const img = await uploadImageFile({
            file: pendingImageFile,
            useCase: "CATEGORY",
            alt: altText,
          })
          body.image = img._id
        }
      }

      await updateCategory.mutateAsync({ id: category._id, body })
      onOpenChange(false)
    } catch (err) {
      setFormError(apiMessage(err))
    } finally {
      setIsWorking(false)
    }
  }

  const displaySrc =
    previewUrl ||
    (mode === "edit" && category && !removeImage && !pendingImageFile
      ? getCategoryImageUrl(category)
      : undefined)

  const showRemove =
    mode === "edit" && (category?.image || pendingImageFile) && !removeImage

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create category" : "Edit category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Choose an optional image for preview; it is uploaded when you click Create."
              : "Replace or remove the image; changes apply when you save."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormInput
              control={form.control}
              name="categoryName"
              label="Category name"
              placeholder="e.g. Electronics"
            />

            <FormTextArea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Optional"
              rows={3}
            />

            <FormSelect
              control={form.control}
              name="parentCategory"
              label="Parent category"
              options={parentOptions}
              placeholder="None (root)"
            />

            <div className="space-y-2">
              <span className="text-sm font-medium">Image</span>
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className={cn(
                    "flex size-16 items-center justify-center overflow-hidden rounded-md border bg-muted",
                    !displaySrc && "text-muted-foreground",
                  )}
                >
                  {displaySrc ? (
                    <img
                      src={displaySrc}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-6 opacity-50" aria-hidden />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={onFilePick}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={submitBusy}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose image
                    </Button>
                    {showRemove ? (
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
                        Remove image
                      </Button>
                    ) : null}
                  </div>
                  {pendingImageFile ? (
                    <p className="text-muted-foreground truncate text-xs">
                      Selected: {pendingImageFile.name} — uploads when you{" "}
                      {mode === "create" ? "create" : "save"}.
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      JPEG, PNG, or WebP. Upload runs on submit.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {formError ? (
              <p className="text-destructive text-sm" role="alert">
                {formError}
              </p>
            ) : null}

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose
                render={<Button type="button" variant="outline" />}
              >
                Cancel
              </DialogClose>
              <Button type="submit" disabled={submitBusy}>
                {submitBusy
                  ? mode === "create"
                    ? "Creating…"
                    : "Saving…"
                  : mode === "create"
                    ? "Create"
                    : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
