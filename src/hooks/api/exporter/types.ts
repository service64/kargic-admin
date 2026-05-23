export type AdminExporterListRowDto = {
  userId: string
  companyName: string
  verifyCompanyPercent: number
  logo: string | null
}

export type ExporterListMeta = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AdminExportersPageDto = {
  data: AdminExporterListRowDto[]
  meta: ExporterListMeta
}

export type AdminExportersQueryParams = {
  page?: number
  limit?: number
  companyName?: string
}
