"use client"

import { Link, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDeleteSeo, useSeoList } from "@/hooks/api/seo/useSeo"
import { cn } from "@/lib/utils"

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Something went wrong"
}

export default function SeoPage() {
  const navigate = useNavigate()
  const { data: items = [], isLoading, isError, error } = useSeoList()
  const deleteSeo = useDeleteSeo()

  async function handleDelete(id: string, page: string) {
    if (
      !window.confirm(
        `Delete SEO for "${page}"? This cannot be undone.`,
      )
    ) {
      return
    }
    try {
      await deleteSeo.mutateAsync(id)
      toast.success("SEO entry deleted")
    } catch (err) {
      toast.error(apiMessage(err))
    }
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
            Site SEO
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Page metadata
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Manage titles, descriptions, and OG images for each public page.
          </p>
        </div>
        <Button render={<Link to="/seo/new" />} className="gap-1.5">
          <PlusIcon className="size-4" aria-hidden />
          New SEO entry
        </Button>
      </div>

      {isError ? (
        <p className="text-destructive text-sm" role="alert">
          {error instanceof Error ? error.message : "Could not load SEO list."}
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
          No SEO entries yet. Create one for your home page or product listing.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageUrl = item.ogImage?.url
            return (
              <Card
                key={item._id}
                className="overflow-hidden py-0 gap-0 shadow-sm"
              >
                <div
                  className={cn(
                    "relative flex h-36 items-center justify-center bg-muted",
                    !imageUrl && "text-muted-foreground",
                  )}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="size-10 opacity-40" aria-hidden />
                  )}
                  <span className="absolute top-2 left-2 rounded bg-background/90 px-2 py-0.5 font-mono text-[11px] font-medium">
                    {item.page}
                  </span>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base leading-snug">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    OG: {item.ogImage?.url ? "Image set" : "No image"}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-1 border-t py-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit SEO for ${item.page}`}
                    onClick={() => navigate(`/seo/edit/${item.page}`)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Delete SEO for ${item.page}`}
                    disabled={deleteSeo.isPending}
                    onClick={() => void handleDelete(item._id, item.page)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
