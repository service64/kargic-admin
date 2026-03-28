import * as React from 'react'
import { SearchIcon, ShieldIcon, UserPlusIcon, UsersIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DIRECTORY_TEAM_FILTERS,
  MOCK_DIRECTORY_USERS,
  type DirectoryUser,
  type TradeRole,
} from '@/pages/user-management/user-directory-mock-data'
import { UserDirectoryTable } from '@/pages/user-management/UserDirectoryTable'

export function UserDirectoryPage() {
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState<'all' | TradeRole>('all')
  const [teamFilter, setTeamFilter] =
    React.useState<(typeof DIRECTORY_TEAM_FILTERS)[number]>('All')

  const filteredUsers = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return MOCK_DIRECTORY_USERS.filter((u: DirectoryUser) => {
      if (roleFilter !== 'all' && u.tradeRole !== roleFilter) {
        return false
      }
      if (teamFilter !== 'All' && u.team !== teamFilter) {
        return false
      }
      if (!q) return true
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    })
  }, [search, roleFilter, teamFilter])

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Manage administrative access, internal teams, and judicial roles
            across the platform ecosystem.
          </p>
        </div>
        <Button
          className="shrink-0 gap-2 bg-emerald-900 text-white hover:bg-emerald-950 dark:bg-emerald-800 dark:hover:bg-emerald-900"
          size="default"
        >
          <UserPlusIcon className="size-4" />
          Add New User
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background h-11 pl-10"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={roleFilter}
            onValueChange={(v) =>
              setRoleFilter((v ?? 'all') as 'all' | TradeRole)
            }
          >
            <SelectTrigger className="h-11 min-w-[200px] sm:w-[220px]">
              <div className="flex items-center gap-2">
                <ShieldIcon className="text-muted-foreground size-4 shrink-0" />
                <SelectValue placeholder="Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Role: All</SelectItem>
              <SelectItem value="Importer">Role: Importer</SelectItem>
              <SelectItem value="Exporter">Role: Exporter</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={teamFilter}
            onValueChange={(v) =>
              setTeamFilter(
                (v ?? 'All') as (typeof DIRECTORY_TEAM_FILTERS)[number]
              )
            }
          >
            <SelectTrigger className="h-11 min-w-[200px] sm:w-[220px]">
              <div className="flex items-center gap-2">
                <UsersIcon className="text-muted-foreground size-4 shrink-0" />
                <SelectValue placeholder="Team" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {DIRECTORY_TEAM_FILTERS.map((t) => (
                <SelectItem key={t} value={t}>
                  Team: {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <UserDirectoryTable data={filteredUsers} />
    </div>
  )
}
