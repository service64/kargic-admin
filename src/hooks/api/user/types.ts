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
  status: UserStatus
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

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED' | 'WARNING'

export type UpdateAdminUserStatusBody = {
  status: UserStatus
}

export type UpdateAdminUserStatusResult = {
  userId: string
  status: UserStatus
  deletedAt: string | null
}

export type AdminUsersQueryParams = {
  page?: number
  limit?: number
  name?: string
  email?: string
  phone?: string
}

export type AdminUserProfileImageDto = {
  _id: string
  url?: string
  alt?: string
} | null

export type AdminUserDetailsUserDto = {
  _id: string
  name: string
  age: string
  phone: string
  email: string
  roles: string[]
  activeRole: string
  status: string
  isVerified: boolean
  deletedAt?: string | null
  lastApiActivityAt?: string | null
  profileImage?: AdminUserProfileImageDto
  createdAt?: string
  updatedAt?: string
}

export type AdminImporterProfileDto = {
  _id: string
  userId: string
  companyName: string
  importLicense: string
  businessType: string
  country: string
  createdAt?: string
} | null

export type AdminMediaRefDto =
  | string
  | {
      _id: string
      url?: string
      alt?: string
    }
  | null
  | undefined

export type AdminVerificationSubdocDto = {
  verifyByAdmin?: boolean
  [key: string]: unknown
}

export type AdminCompanyVerificationDto = {
  verifyCompanyPercent?: number
  tax?: AdminVerificationSubdocDto
  bankSolvency?: AdminVerificationSubdocDto
  chamberMembership?: AdminVerificationSubdocDto
  erc?: AdminVerificationSubdocDto
  tradeLicense?: AdminVerificationSubdocDto
}

export type AdminExporterProfileDto = {
  _id: string
  userId: string
  companyName: string
  slug: string
  logoUrl?: AdminMediaRefDto
  banner0?: AdminMediaRefDto
  banner1?: AdminMediaRefDto
  banner2?: AdminMediaRefDto
  yearEstablished: string
  identificationNumber?: string
  companyType: string
  employeeCount: string
  mainProducts: string[]
  description?: string
  companyVerification?: AdminCompanyVerificationDto
  createdAt?: string
} | null

export type AdminLoginSessionDto = {
  _id: string
  userId: string
  deviceId: string
  deviceType: string
  os: string
  browser: string
  ip: string
  userAgent: string
  timezone: string
}[]

export type AdminUserDetailsDto = {
  user: AdminUserDetailsUserDto
  importerProfile: AdminImporterProfileDto
  exporterProfile: AdminExporterProfileDto
  loginSessions: AdminLoginSessionDto
}
