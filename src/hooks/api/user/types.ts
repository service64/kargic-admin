export type SiteStatisticsDto = {
  totalPeers: number
  activeUsers: number
  totalUsers: number
  totalImporters: number
  totalExporters: number
  totalOrders: number
  deliveredOrders: number
  cancelledOrders: number
  returnedOrders: number
}

export type AdminUserListRowDto = {
  userId: string
  name: string
  email: string
  phone: string
  image: string | null
}

export type UserListMeta = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AdminUsersPageDto = {
  data: AdminUserListRowDto[]
  meta: UserListMeta
}

export type AdminUsersQueryParams = {
  page?: number
  limit?: number
  name?: string
  email?: string
  phone?: string
}
