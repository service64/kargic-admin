export type AdminImporterListRowDto = {
  userId: string
  companyName: string
  importLicense: string
  businessType: string
  country: string
}

export type ImporterListMeta = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AdminImportersPageDto = {
  data: AdminImporterListRowDto[]
  meta: ImporterListMeta
}

export type AdminImportersQueryParams = {
  page?: number
  limit?: number
  companyName?: string
  importLicense?: string
  businessType?: string
  country?: string
}
