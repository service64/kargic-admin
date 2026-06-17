"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { z } from "zod"

import { FormCalender } from "@/components/form/FormCalender"
import { FormSelect } from "@/components/form/FormSelect"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useCreateSitemap,
  useSitemapById,
  useUpdateSitemap,
} from "@/hooks/api/sitemap/useSitemap"
import {
  SITEMAP_CHANGE_FREQUENCIES,
  SITEMAP_FREQUENCY_OPTIONS,
  SITEMAP_PRIORITY_OPTIONS,
} from "@/hooks/api/sitemap/types"
import {
  displaySitemapPath,
  normalizeSitemapPath,
} from "@/pages/Seo/sitemapPath"
import { SitemapUrlPathField } from "@/pages/Seo/SitemapUrlPathField"

const urlPathSchema = z
  .string()
  .transform(normalizeSitemapPath)
  .pipe(
    z
      .string()
      .max(500)
      .refine((s) => !s.includes("://"), "Use a site path, not a full URL"),
  )

const sitemapFormSchema = z.object({
  url: urlPathSchema,
  changeFrequency: z.enum(SITEMAP_CHANGE_FREQUENCIES),
  priority: z.enum(
    SITEMAP_PRIORITY_OPTIONS.map((o) => o.value) as [string, ...string[]],
  ),
  lastModified: z.string().min(1, "Last modified date is required"),
  enabled: z.boolean(),
})

type SitemapFormValues = z.infer<typeof sitemapFormSchema>

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Something went wrong"
}

export default function SitemapFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: entry, isLoading: loadingEntry } = useSitemapById(
    isEdit ? id : undefined,
  )
  const createSitemap = useCreateSitemap()
  const updateSitemap = useUpdateSitemap()
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<SitemapFormValues>({
    resolver: zodResolver(sitemapFormSchema),
    defaultValues: {
      url: "/",
      changeFrequency: "monthly",
      priority: "0.8",
      lastModified: new Date().toISOString().slice(0, 10),
      enabled: true,
    },
  })

  React.useEffect(() => {
    if (!isEdit || !entry) return
    form.reset({
      url: displaySitemapPath(entry.url),
      changeFrequency: entry.changeFrequency,
      priority: String(entry.priority),
      lastModified: entry.lastModified.slice(0, 10),
      enabled: entry.enabled,
    })
  }, [isEdit, entry, form])

  const submitBusy = createSitemap.isPending || updateSitemap.isPending

  async function onSubmit(values: SitemapFormValues) {
    setFormError(null)
    const payload = {
      url: normalizeSitemapPath(values.url),
      changeFrequency: values.changeFrequency,
      priority: Number(values.priority),
      lastModified: values.lastModified,
      enabled: values.enabled,
    }

    try {
      if (isEdit && id) {
        await updateSitemap.mutateAsync({ id, body: payload })
      } else {
        await createSitemap.mutateAsync(payload)
      }
      navigate("/seo/sitemap")
    } catch (err) {
      setFormError(apiMessage(err))
    }
  }

  if (isEdit && loadingEntry) {
    return <Skeleton className="mx-auto h-96 max-w-2xl rounded-xl" />
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
          SEO · Sitemap
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Edit sitemap entry" : "New sitemap entry"}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Pick a public page from the list. Paths are stored without locale or
          domain — the site generates <code className="text-xs">/en</code>,{" "}
          <code className="text-xs">/bn</code>, etc. in sitemap.xml.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-xl border p-6"
        >
          <SitemapUrlPathField
            control={form.control}
            name="url"
            disabled={submitBusy}
            fallbackUrl={isEdit ? entry?.url : undefined}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              control={form.control}
              name="changeFrequency"
              label="Change frequency"
              options={[...SITEMAP_FREQUENCY_OPTIONS]}
            />
            <FormSelect
              control={form.control}
              name="priority"
              label="Priority"
              options={[...SITEMAP_PRIORITY_OPTIONS]}
            />
          </div>

          <FormCalender
            control={form.control}
            name="lastModified"
            label="Last modified"
            endMonth={new Date()}
          />

          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border px-4 py-3">
                <div className="space-y-1">
                  <FormLabel className="text-sm font-medium">Enabled</FormLabel>
                  <p className="text-muted-foreground text-xs">
                    Disabled entries are hidden from public sitemap.xml
                  </p>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {formError ? (
            <p className="text-destructive text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={submitBusy}>
              {isEdit ? "Save changes" : "Create entry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              render={<Link to="/seo/sitemap" />}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
