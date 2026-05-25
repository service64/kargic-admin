import { ArrowLeftIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAdminUserDetails } from '@/hooks/api/user/useAdminUserDetails'
import { useUpdateAdminUserStatus } from '@/hooks/api/user/useUpdateAdminUserStatus'
import type { UserStatus } from '@/hooks/api/user/types'
import { ExporterProfileDetails } from '@/pages/user-management/ExporterProfileDetails'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-sm font-medium wrap-break-word">{value}</dd>
    </div>
  )
}

const USER_STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'DELETED', label: 'Deleted' },
]

function UserStatusField({
  userId,
  status,
}: {
  userId: string
  status: UserStatus
}) {
  const updateStatus = useUpdateAdminUserStatus(userId)

  return (
    <div className="grid gap-1.5">
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        Status
      </span>
      <Select
        value={status}
        disabled={updateStatus.isPending}
        onValueChange={(value) => {
          if (!value || value === status) return
          updateStatus.mutate({ status: value as UserStatus })
        }}
      >
        <SelectTrigger className="h-9 w-full max-w-[12rem]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {USER_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {updateStatus.isError ? (
        <p className="text-destructive text-xs">
          {updateStatus.error instanceof Error
            ? updateStatus.error.message
            : 'Failed to update status.'}
        </p>
      ) : null}
      {updateStatus.isPending ? (
        <p className="text-muted-foreground text-xs">Updating status…</p>
      ) : null}
    </div>
  )
}

export default function SingleUserDetails() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useAdminUserDetails(id)

  const user = data?.user
  const importer = data?.importerProfile
  const exporter = data?.exporterProfile
  const sessions = data?.loginSessions ?? []

  const initials = useMemo(() => {
    const name = user?.name?.trim() ?? ''
    const email = user?.email?.trim() ?? ''
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
    }
    if (parts[0]) return parts[0].slice(0, 2).toUpperCase()
    return email.slice(0, 2).toUpperCase()
  }, [user?.email, user?.name])

  return (
    <div className="container mx-auto space-y-6 px-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            User details
          </h1>
          <p className="text-muted-foreground text-sm">
            User, importer/exporter profile, and login sessions.
          </p>
        </div>
        <Link
          to="/user-management/users"
          className={cn(buttonVariants({ variant: 'outline' }), 'w-fit')}
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Back to users
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-72 w-full lg:col-span-2" />
        </div>
      ) : isError ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">
              Failed to load user
            </CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'Unknown error.'}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : !data ? (
        <Card>
          <CardHeader>
            <CardTitle>No data</CardTitle>
            <CardDescription>Could not find the requested user.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>User</CardTitle>
              <CardDescription>Basic account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 rounded-xl">
                  {user?.profileImage && typeof user.profileImage === 'object' ? (
                    <AvatarImage
                      src={(user.profileImage as { url?: string })?.url ?? ''}
                      alt={user?.name || user?.email}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-xl text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">
                    {user?.name || '—'}
                  </p>
                  <p className="text-muted-foreground truncate text-sm">
                    {user?.email || '—'}
                  </p>
                </div>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone" value={user?.phone || '—'} />
                <Field label="Date of birth" value={user?.age || '—'} />
                {id && user?.status ? (
                  <UserStatusField
                    userId={id}
                    status={user.status as UserStatus}
                  />
                ) : (
                  <Field label="Status" value={user?.status || '—'} />
                )}
                <Field label="Verified" value={user?.isVerified ? 'Yes' : 'No'} />
                <Field label="Active role" value={user?.activeRole || '—'} />
                <Field label="Roles" value={(user?.roles ?? []).join(', ') || '—'} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Importer profile</CardTitle>
              <CardDescription>
                Only present if the user registered as importer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {importer ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Field label="Company name" value={importer.companyName || '—'} />
                  <Field label="Import license" value={importer.importLicense || '—'} />
                  <Field label="Business type" value={importer.businessType || '—'} />
                  <Field label="Country" value={importer.country || '—'} />
                </dl>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No importer profile found for this user.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>Exporter profile</CardTitle>
              <CardDescription>
                Company details, branding, and verification status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exporter && id ? (
                <ExporterProfileDetails exporter={exporter} userId={id} />
              ) : (
                <p className="text-muted-foreground text-sm">
                  No exporter profile found for this user.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>Login sessions</CardTitle>
              <CardDescription>
                Recent devices and environments used to sign in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No login sessions found.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {sessions.map((s) => (
                    <div
                      key={s._id}
                      className="bg-card rounded-lg border p-4"
                    >
                      <dl className="grid gap-3 sm:grid-cols-2">
                        <Field label="Device type" value={s.deviceType || '—'} />
                        <Field label="Device id" value={s.deviceId || '—'} />
                        <Field label="OS" value={s.os || '—'} />
                        <Field label="Browser" value={s.browser || '—'} />
                        <Field label="IP" value={s.ip || '—'} />
                        <Field label="Timezone" value={s.timezone || '—'} />
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
