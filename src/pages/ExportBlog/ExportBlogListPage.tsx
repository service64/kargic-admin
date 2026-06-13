"use client"

import { Link, useNavigate } from "react-router-dom"
import { PlusIcon } from "lucide-react"

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
import { useExportBlogList } from "@/hooks/api/exportBlog/useExportBlogs"
import { cn } from "@/lib/utils"

import { getBlogFeaturedImageUrl } from "./blogUtils"

export function ExportBlogListPage() {
  const navigate = useNavigate()
  const { data: blogs = [], isLoading, isError, error } = useExportBlogList()

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-emerald-700 dark:text-emerald-400 mb-1 text-xs font-bold tracking-widest uppercase">
            Content
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Export Blog
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
            Manage export blog articles. Click a row to edit or publish.
          </p>
        </div>
        <Button render={<Link to="/export-blog/new" />} className="gap-1.5">
          <PlusIcon className="size-4" aria-hidden />
          New article
        </Button>
      </div>

      {isError ? (
        <p className="text-destructive text-sm" role="alert">
          {error instanceof Error ? error.message : "Could not load blogs."}
        </p>
      ) : null}

      <div className="bg-card overflow-hidden rounded-xl border border-border/60 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="w-[220px]">Title</TableHead>
              <TableHead>Short description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="size-14 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full max-w-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground h-24">
                  No articles yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((row) => {
                const imageSrc = getBlogFeaturedImageUrl(row)
                return (
                  <TableRow
                    key={row._id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/export-blog/${row._id}/edit`)}
                  >
                    <TableCell>
                      <div
                        className={cn(
                          "flex size-14 items-center justify-center overflow-hidden rounded-md bg-muted",
                        )}
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            —
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium align-middle">
                      {row.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground align-middle whitespace-normal">
                      <span className="line-clamp-2 text-sm">
                        {row.excerpt ?? "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
