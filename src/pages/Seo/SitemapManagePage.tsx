"use client"

import { Link, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import dayjs from "dayjs"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteSitemap, useSitemapList } from "@/hooks/api/sitemap/useSitemap"
import { displaySitemapPath } from "@/pages/Seo/sitemapPath"
import { cn } from "@/lib/utils"

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Something went wrong"
}

function formatPath(url: string) {
  return displaySitemapPath(url)
}

export default function SitemapManagePage() {
  const navigate = useNavigate()
  const { data: items = [], isLoading, isError, error } = useSitemapList()
  const deleteSitemap = useDeleteSitemap()

  async function handleDelete(id: string, url: string) {
    if (
      !window.confirm(
        `Delete sitemap entry "${formatPath(url)}"? This cannot be undone.`,
      )
    ) {
      return
    }
    try {
      await deleteSitemap.mutateAsync(id)
      toast.success("Sitemap entry deleted")
    } catch (err) {
      toast.error(apiMessage(err))
    }
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
            SEO
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Sitemap Manage</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Add URLs, priorities, and change frequencies. The public site reads
            these entries to build <code className="text-xs">sitemap.xml</code>.
          </p>
        </div>
        <Button render={<Link to="/seo/sitemap/new" />} className="gap-1.5">
          <PlusIcon className="size-4" aria-hidden />
          New entry
        </Button>
      </div>

      {isError ? (
        <p className="text-destructive text-sm" role="alert">
          {error instanceof Error
            ? error.message
            : "Could not load sitemap entries."}
        </p>
      ) : null}

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : items.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
          No sitemap entries yet. Add your home page, about page, and product
          URLs.
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL path</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Change freq.</TableHead>
                <TableHead>Last modified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-mono text-sm">
                    {formatPath(item.url)}
                  </TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell className="capitalize">
                    {item.changeFrequency}
                  </TableCell>
                  <TableCell>
                    {dayjs(item.lastModified).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        item.enabled
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {item.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${formatPath(item.url)}`}
                        onClick={() => navigate(`/seo/sitemap/edit/${item._id}`)}
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete ${formatPath(item.url)}`}
                        disabled={deleteSitemap.isPending}
                        onClick={() => void handleDelete(item._id, item.url)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
