"use client"

import * as React from "react"
import { isAxiosError } from "axios"
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { CategoryDto } from "@/hooks/api/category/types"
import {
  useCategoryList,
  useDeleteCategory,
} from "@/hooks/api/category/useCategories"
import { CategoryFormDialog } from "./CategoryFormDialog"
import { getCategoryImageUrl } from "./categoryUtils"
import { cn } from "@/lib/utils"

function parentLabel(cat: CategoryDto): string {
  const p = cat.parentCategory
  if (p && typeof p === "object") return p.categoryName
  return "—"
}

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Delete failed"
}

function CategoryTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="size-10 shrink-0 rounded-md" />
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-36 max-w-full" />
              <Skeleton className="h-3 w-48 max-w-full md:w-64" />
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-3 w-24" />
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="mx-auto h-5 w-8 rounded-full" />
          </TableCell>
          <TableCell className="text-end">
            <Skeleton className="ml-auto size-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function CategoryTab() {
  const { data: categories = [], isLoading, isError, error } = useCategoryList()
  const deleteCategory = useDeleteCategory()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editTarget, setEditTarget] = React.useState<CategoryDto | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<CategoryDto | null>(
    null,
  )
  const [deleteError, setDeleteError] = React.useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="gap-1.5"
        >
          <PlusIcon className="size-4" aria-hidden />
          Add category
        </Button>
      </div>

      {isError ? (
        <p className="text-destructive text-sm" role="alert">
          {error instanceof Error ? error.message : "Could not load categories."}
        </p>
      ) : null}

      <div className="bg-card overflow-hidden rounded-xl border border-border/60 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden lg:table-cell">Parent</TableHead>
              <TableHead className="w-20 text-center">Level</TableHead>
              <TableHead className="w-12 text-end" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <CategoryTableSkeleton />
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground h-24">
                  No categories yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((row) => {
                const imageSrc = getCategoryImageUrl(row)
                return (
                  <TableRow key={row._id}>
                    <TableCell>
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center overflow-hidden rounded-md border bg-muted",
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
                    <TableCell>
                      <div className="font-medium">{row.categoryName}</div>
                      {row.description ? (
                        <div className="text-muted-foreground line-clamp-1 max-w-xs text-xs md:max-w-md">
                          {row.description}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <code className="text-muted-foreground text-xs">
                        {row.slug}
                      </code>
                    </TableCell>
                    <TableCell className="hidden text-sm lg:table-cell">
                      {parentLabel(row)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="tabular-nums">
                        {row.level ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="size-8"
                            />
                          }
                        >
                          <MoreHorizontalIcon className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => setEditTarget(row)}
                            className="gap-2"
                          >
                            <PencilIcon className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setDeleteError(null)
                              setDeleteTarget(row)
                            }}
                            className="gap-2"
                          >
                            <Trash2Icon className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        categories={categories}
      />

      <CategoryFormDialog
        open={editTarget !== null}
        onOpenChange={(o) => !o && setEditTarget(null)}
        mode="edit"
        category={editTarget}
        categories={categories}
      />

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              {deleteTarget ? (
                <>
                  This will permanently delete{" "}
                  <strong>{deleteTarget.categoryName}</strong>. Subcategories
                  must be removed first.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="text-destructive text-sm">{deleteError}</p>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteCategory.isPending}
              onClick={async () => {
                if (!deleteTarget) return
                setDeleteError(null)
                try {
                  await deleteCategory.mutateAsync(deleteTarget._id)
                  setDeleteTarget(null)
                } catch (e) {
                  setDeleteError(apiMessage(e))
                }
              }}
            >
              {deleteCategory.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
