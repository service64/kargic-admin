"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { AlertTriangleIcon, MailIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FormSelect } from "@/components/form/FormSelect"
import { FormTextArea } from "@/components/form/FormTextArea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminReportDetails } from "@/hooks/api/report/useAdminReportDetails"
import { usePatchAdminReportResolution } from "@/hooks/api/report/usePatchAdminReportResolution"
import type { AdminReportDetailRowDto } from "@/hooks/api/report/types"
import { cn } from "@/lib/utils"

const resolutionSchema = z.object({
  resolved: z.enum(["true", "false"]),
  resolvedMessage: z.string().max(200).optional(),
})

type ResolutionFormValues = z.infer<typeof resolutionSchema>

function apiMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined
    return d?.message ?? err.message ?? "Request failed"
  }
  return err instanceof Error ? err.message : "Something went wrong"
}

function formatDateTime(value?: string | null) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
}

function initialsFor(name?: string | null, email?: string | null) {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase()
  return (email ?? "US").slice(0, 2).toUpperCase()
}

function reportTypeLabel(type: AdminReportDetailRowDto["reportType"]) {
  return type.replace(/_/g, " ")
}

function resolutionBadgeClass(resolved: boolean) {
  return resolved
    ? "border-orange-200 bg-orange-100 text-orange-900 dark:border-orange-900/40 dark:bg-orange-950/50 dark:text-orange-200"
    : "border-red-200 bg-red-100 text-red-900 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-200"
}

function reportUser(
  value: string | AdminReportDetailRowDto["reportBy"] | AdminReportDetailRowDto["resolvedBy"]
) {
  return value && typeof value === "object" ? value : null
}

function ReportResolutionEditor({
  report,
  userId,
}: {
  report: AdminReportDetailRowDto
  userId: string
}) {
  const mutation = usePatchAdminReportResolution(userId)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      resolved: report.resolved ? "true" : "false",
      resolvedMessage: report.resolvedMessage ?? "",
    },
  })

  React.useEffect(() => {
    form.reset({
      resolved: report.resolved ? "true" : "false",
      resolvedMessage: report.resolvedMessage ?? "",
    })
    setFormError(null)
  }, [form, report])

  async function onSubmit(values: ResolutionFormValues) {
    setFormError(null)
    try {
      await mutation.mutateAsync({
        reportId: report._id,
        body: {
          resolved: values.resolved === "true",
          resolvedMessage: values.resolvedMessage?.trim() || undefined,
        },
      })
    } catch (err) {
      setFormError(apiMessage(err))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-3 rounded-lg border bg-muted/20 p-3"
      >
        <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
          <FormSelect
            control={form.control}
            name="resolved"
            label="Resolution status"
            options={[
              { value: "false", label: "Pending" },
              { value: "true", label: "Resolved" },
            ]}
            placeholder="Select status"
            disabled={mutation.isPending}
          />
          <FormTextArea
            control={form.control}
            name="resolvedMessage"
            label="Resolution note"
            placeholder="Add an internal note for this report..."
            rows={3}
            maxLength={200}
            disabled={mutation.isPending}
            labelEnd={
              <span className="text-muted-foreground text-xs">
                {(form.watch("resolvedMessage") ?? "").length}/200
              </span>
            }
          />
        </div>

        {formError ? (
          <p className="text-sm text-destructive">{formError}</p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save resolution"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function ReportDetailsDialog({
  open,
  onOpenChange,
  userId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
}) {
  const { data, isLoading, isError, error } = useAdminReportDetails(userId, open)

  const reportedUser = data?.reportedUser

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Reported User Details</DialogTitle>
          <DialogDescription>
            Review reports against this user and update resolution status inline.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4 py-20">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-48 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-destructive/30 px-4 py-8 text-center">
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Failed to load report details."}
              </p>
            </div>
          ) : !data || !reportedUser || !userId ? (
            <div className="rounded-xl border px-4 py-8 text-center text-sm text-muted-foreground">
              No details available.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex items-start gap-3">
                  <Avatar className="size-11 rounded-lg">
                    {reportedUser.profileImage?.url ? (
                      <AvatarImage
                        src={reportedUser.profileImage.url}
                        alt={reportedUser.name || reportedUser.email}
                      />
                    ) : null}
                    <AvatarFallback className="rounded-lg text-xs font-medium">
                      {initialsFor(reportedUser.name, reportedUser.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-base font-semibold">
                      {reportedUser.name || "Unnamed user"}
                    </p>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <MailIcon className="size-4" />
                        {reportedUser.email || "—"}
                      </span>
                   
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Company: {data.reportedCompanyName || "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:min-w-[320px]">
                  <div className="rounded-lg border bg-background px-3 py-2">
                    <p className="text-muted-foreground text-xs uppercase">Total</p>
                    <p className="text-lg font-semibold">{data.totalReports}</p>
                  </div>
                  <div className="rounded-lg border bg-background px-3 py-2">
                    <p className="text-muted-foreground text-xs uppercase">Resolved</p>
                    <p className="text-lg font-semibold text-orange-500">
                      {data.resolvedReports}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-background px-3 py-2">
                    <p className="text-muted-foreground text-xs uppercase">Pending</p>
                    <p className="text-lg font-semibold text-red-500">
                      {data.unresolvedReports}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {data.reports.length === 0 ? (
                  <div className="rounded-xl border px-4 py-8 text-center text-sm text-muted-foreground">
                    No reports found for this user.
                  </div>
                ) : (
                  data.reports.map((report) => {
                    const reporter = reportUser(report.reportBy)
                    const resolver = reportUser(report.resolvedBy)

                    return (
                      <div
                        key={report._id}
                        className="space-y-4 rounded-xl border bg-background p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn("font-medium capitalize", resolutionBadgeClass(report.resolved))}
                              >
                                <AlertTriangleIcon className="size-3.5" />
                                {report.resolved ? "Resolved" : "Pending"}
                              </Badge>
                              <Badge variant="outline" className="font-medium capitalize">
                                {reportTypeLabel(report.reportType)}
                              </Badge>
                            </div>

                            <div>
                              <p className="font-medium">
                                {reporter?.name || "Unknown reporter"}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {reporter?.email || "Email unavailable"}
                              </p>
                            </div>
                          </div>

                          <div className="text-muted-foreground space-y-1 text-xs md:text-right">
                            <p>Reported at: {formatDateTime(report.createdAt)}</p>
                            <p>Resolved at: {formatDateTime(report.resolvedAt)}</p>
                            <p>Resolved by: {resolver?.email || "—"}</p>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                          <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase">
                              Report message
                            </p>
                            <p className="text-sm">{report.reportMessage}</p>
                          </div>
                          <div className="rounded-lg border bg-muted/20 p-3">
                            <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase">
                              Resolution note
                            </p>
                            <p className="text-sm">{report.resolvedMessage || "—"}</p>
                          </div>
                        </div>

                        <ReportResolutionEditor report={report} userId={userId} />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
