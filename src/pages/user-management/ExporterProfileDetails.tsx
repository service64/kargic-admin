import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePatchAdminCompanyVerification } from '@/hooks/api/exporter/usePatchAdminCompanyVerification'
import type { VerificationSectionKey } from '@/hooks/api/exporter/types'
import type {
  AdminCompanyVerificationDto,
  AdminExporterProfileDto,
  AdminMediaRefDto,
  AdminVerificationSubdocDto,
} from '@/hooks/api/user/types'
import { cn } from '@/lib/utils'

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

function mediaUrl(ref: AdminMediaRefDto): string | null {
  if (!ref) return null
  if (typeof ref === 'string') return null
  return typeof ref.url === 'string' && ref.url.length > 0 ? ref.url : null
}

function VerifiedBadge({ verified }: { verified?: boolean }) {
  return (
    <Badge
      variant={verified ? 'default' : 'outline'}
      className={cn(
        'shrink-0',
        verified &&
          'bg-emerald-600 text-white hover:bg-emerald-600 dark:bg-emerald-700',
      )}
    >
      {verified ? 'Verified' : 'Pending'}
    </Badge>
  )
}

function MediaThumb({ label, url }: { label: string; url: string | null }) {
  if (!url) {
    return (
      <div className="bg-muted/40 flex aspect-video w-full items-center justify-center rounded-lg border border-dashed">
        <span className="text-muted-foreground text-xs">No {label}</span>
      </div>
    )
  }
  return (
    <figure className="space-y-1.5">
      <figcaption className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </figcaption>
      <img
        src={url}
        alt={label}
        className="aspect-video w-full rounded-lg border object-cover"
      />
    </figure>
  )
}

function VerificationBlock({
  title,
  section,
  fields,
  imageField,
  imageLabel = 'Certificate',
  onToggleVerify,
  isUpdating,
}: {
  title: string
  section?: AdminVerificationSubdocDto
  fields: { label: string; key: string }[]
  imageField?: string
  imageLabel?: string
  onToggleVerify?: (verified: boolean) => void
  isUpdating?: boolean
}) {
  if (!section) return null

  const entries = fields
    .map(({ label, key }) => {
      const raw = section[key]
      if (raw === undefined || raw === null || raw === '') return null
      if (typeof raw === 'object') return null
      return { label, value: String(raw) }
    })
    .filter(Boolean) as { label: string; value: string }[]

  const certUrl = imageField
    ? mediaUrl(section[imageField] as AdminMediaRefDto)
    : null

  if (
    entries.length === 0 &&
    section.verifyByAdmin === undefined &&
    !certUrl
  ) {
    return null
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <VerifiedBadge verified={section.verifyByAdmin} />
      </div>
      {entries.length > 0 ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          {entries.map((f) => (
            <Field key={f.label} label={f.label} value={f.value} />
          ))}
        </dl>
      ) : (
        <p className="text-muted-foreground text-sm">No details submitted.</p>
      )}
      {imageField ? (
        <MediaThumb label={imageLabel} url={certUrl} />
      ) : null}
      {onToggleVerify ? (
        <div className="flex flex-wrap gap-2 border-t pt-3">
          {!section.verifyByAdmin ? (
            <Button
              type="button"
              size="sm"
              disabled={isUpdating}
              onClick={() => onToggleVerify(true)}
            >
              {isUpdating ? 'Saving…' : 'Approve section'}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() => onToggleVerify(false)}
            >
              {isUpdating ? 'Saving…' : 'Revoke approval'}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}

function CompanyVerificationSection({
  verification,
  userId,
}: {
  verification?: AdminCompanyVerificationDto
  userId: string
}) {
  const patchVerification = usePatchAdminCompanyVerification(userId)
  const pendingSection = patchVerification.isPending
    ? patchVerification.variables
      ? (Object.keys(patchVerification.variables)[0] as VerificationSectionKey)
      : null
    : null

  const toggleSection = (sectionKey: VerificationSectionKey, verified: boolean) => {
    patchVerification.mutate({ [sectionKey]: { verifyByAdmin: verified } })
  }
  if (!verification) {
    return (
      <p className="text-muted-foreground text-sm">
        No company verification data on file.
      </p>
    )
  }

  const percent = verification.verifyCompanyPercent ?? 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-muted-foreground text-sm">Verification progress</span>
        <span className="text-lg font-semibold tabular-nums">{percent}%</span>
        <div className="bg-muted h-2 min-w-[8rem] flex-1 overflow-hidden rounded-full">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all dark:bg-emerald-500"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <VerificationBlock
          title="Tax"
          section={verification.tax}
          imageField="vatBinCertificate"
          imageLabel="VAT / BIN certificate"
          isUpdating={pendingSection === 'tax'}
          onToggleVerify={(verified) => toggleSection('tax', verified)}
          fields={[
            { label: 'E-TIN number', key: 'eTinNumber' },
            { label: 'BIN number', key: 'binNumber' },
          ]}
        />
        <VerificationBlock
          title="Bank solvency"
          section={verification.bankSolvency}
          imageField="solvencyCertificate"
          imageLabel="Solvency certificate"
          isUpdating={pendingSection === 'bankSolvency'}
          onToggleVerify={(verified) => toggleSection('bankSolvency', verified)}
          fields={[
            { label: 'Bank name', key: 'bankName' },
            { label: 'Account holder', key: 'accountHolderName' },
            { label: 'Account number', key: 'accountNumber' },
            { label: 'Issue date', key: 'issueDate' },
          ]}
        />
        <VerificationBlock
          title="Chamber membership"
          section={verification.chamberMembership}
          imageField="membershipCertificate"
          imageLabel="Membership certificate"
          isUpdating={pendingSection === 'chamberMembership'}
          onToggleVerify={(verified) =>
            toggleSection('chamberMembership', verified)
          }
          fields={[
            { label: 'Chamber name', key: 'chamberName' },
            { label: 'Member ID', key: 'memberId' },
            { label: 'Validity date', key: 'validityDate' },
          ]}
        />
        <VerificationBlock
          title="ERC"
          section={verification.erc}
          imageField="certificate"
          imageLabel="ERC certificate"
          isUpdating={pendingSection === 'erc'}
          onToggleVerify={(verified) => toggleSection('erc', verified)}
          fields={[
            { label: 'ERC number', key: 'ercNumber' },
            { label: 'Issuing authority', key: 'issuingAuthority' },
            { label: 'Issue date', key: 'issueDate' },
            { label: 'Expiry date', key: 'expiryDate' },
          ]}
        />
        <VerificationBlock
          title="Trade license"
          section={verification.tradeLicense}
          imageField="tradeLicenseDocument"
          imageLabel="Trade license document"
          isUpdating={pendingSection === 'tradeLicense'}
          onToggleVerify={(verified) => toggleSection('tradeLicense', verified)}
          fields={[
            { label: 'License number', key: 'tradeLicenseNumber' },
            { label: 'Business type', key: 'businessType' },
            { label: 'Issue date', key: 'issueDate' },
            { label: 'Expiry date', key: 'expiryDate' },
          ]}
        />
      </div>
    </div>
  )
}

type ExporterProfileDetailsProps = {
  exporter: NonNullable<AdminExporterProfileDto>
  userId: string
}

export function ExporterProfileDetails({
  exporter,
  userId,
}: ExporterProfileDetailsProps) {
  const patchVerification = usePatchAdminCompanyVerification(userId)
  const products =
    exporter.mainProducts?.length > 0
      ? exporter.mainProducts.join(', ')
      : '—'

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Company overview</h3>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Company name" value={exporter.companyName || '—'} />
          <Field label="Slug" value={exporter.slug || '—'} />
          <Field label="Year established" value={exporter.yearEstablished || '—'} />
          <Field label="Company type" value={exporter.companyType || '—'} />
          <Field label="Employee count" value={exporter.employeeCount || '—'} />
          <Field
            label="Identification number"
            value={exporter.identificationNumber || '—'}
          />
          <Field label="Main products" value={products} />
        </dl>
        {exporter.description ? (
          <div className="grid gap-1">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Description
            </p>
            <p className="text-sm leading-relaxed">{exporter.description}</p>
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold">Branding</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MediaThumb label="Logo" url={mediaUrl(exporter.logoUrl)} />
          <MediaThumb label="Banner 1" url={mediaUrl(exporter.banner0)} />
          <MediaThumb label="Banner 2" url={mediaUrl(exporter.banner1)} />
          <MediaThumb label="Banner 3" url={mediaUrl(exporter.banner2)} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Company verification</h3>
          {patchVerification.isError ? (
            <p className="text-destructive text-xs">
              {patchVerification.error instanceof Error
                ? patchVerification.error.message
                : 'Failed to update verification.'}
            </p>
          ) : null}
        </div>
        <CompanyVerificationSection
          verification={exporter.companyVerification}
          userId={userId}
        />
      </section>
    </div>
  )
}
