export type AdminReportSummaryRowDto = {
  userId: string
  name: string
  email: string
  status: string
  companyName: string | null
  totalReports: number
  resolvedReports: number
  unresolvedReports: number
  lastReportedAt: string
}

export type AdminReportSummaryMetaDto = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AdminReportSummaryOverviewDto = {
  totalReportedUsers: number
  totalReports: number
  totalResolvedReports: number
  totalUnresolvedReports: number
}

export type AdminReportSummaryPageDto = {
  data: AdminReportSummaryRowDto[]
  meta: AdminReportSummaryMetaDto
  overview: AdminReportSummaryOverviewDto
}

export type AdminReportSummaryQueryParams = {
  page?: number
  limit?: number
  searchTerm?: string
  sort?: 'newest' | 'oldest'
  dateRange?: '30' | '90' | 'all'
}

export type AdminReportUserDto = {
  _id: string
  name: string
  email: string
  status?: string
  profileImage?:
    | {
        _id?: string
        url?: string
        alt?: string
      }
    | null
}

export type AdminReportDetailRowDto = {
  _id: string
  userId: string | AdminReportUserDto
  reportBy: string | AdminReportUserDto
  reportMessage: string
  reportType: 'spam' | 'abuse' | 'scam' | 'fake_profile' | 'other'
  resolved: boolean
  resolvedAt?: string | null
  resolvedBy?: string | AdminReportUserDto | null
  resolvedMessage?: string | null
  createdAt?: string
  updatedAt?: string
}

export type AdminReportDetailsDto = {
  reportedUser: AdminReportUserDto
  reportedCompanyName: string | null
  totalReports: number
  resolvedReports: number
  unresolvedReports: number
  reports: AdminReportDetailRowDto[]
}

export type UpdateAdminReportResolutionBody = {
  resolved: boolean
  resolvedMessage?: string
}
