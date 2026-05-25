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

export const VERIFICATION_SECTION_KEYS = [
  'tax',
  'bankSolvency',
  'chamberMembership',
  'erc',
  'tradeLicense',
] as const

export type VerificationSectionKey = (typeof VERIFICATION_SECTION_KEYS)[number]

export type PatchAdminVerificationSection = {
  verifyByAdmin?: boolean
}

export type PatchAdminCompanyVerificationBody = Partial<
  Record<VerificationSectionKey, PatchAdminVerificationSection>
>

export type SellerVerificationStatus = 'Reviewing' | 'Verified' | 'Flagged'

export type SellerVerificationDocStage = 'complete' | 'warning' | 'pending'

export type AdminSellerVerificationRowDto = {
  userId: string
  companyName: string
  slug: string
  displayId: string
  submittedAt: string
  verifyCompanyPercent: number
  docs: [
    SellerVerificationDocStage,
    SellerVerificationDocStage,
    SellerVerificationDocStage,
    SellerVerificationDocStage,
    SellerVerificationDocStage,
  ]
  status: SellerVerificationStatus
  companyType: string
  logo: string | null
}

export type SellerVerificationListMeta = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AdminSellerVerificationPageDto = {
  data: AdminSellerVerificationRowDto[]
  meta: SellerVerificationListMeta
  pipelineTotal: number
}

export type AdminSellerVerificationQueryParams = {
  page?: number
  limit?: number
  search?: string
  status?: SellerVerificationStatus
}
