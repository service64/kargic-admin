export type DirectoryUserStatus = 'Active' | 'Inactive' | 'Pending'

export type TradeRole = 'Importer' | 'Exporter'

export type DirectoryUser = {
  id: string
  name: string
  email: string
  initials: string
  /** Job / judicial title shown in ROLE column */
  jobTitle: string
  tradeRole: TradeRole
  team: string
  status: DirectoryUserStatus
  /** ISO timestamp or null = never */
  lastActiveAt: string | null
}

const FIRST = [
  'Marcus',
  'Elena',
  'James',
  'Priya',
  'Sarah',
  'Jordan',
  'Amir',
  'Helena',
  'Omar',
  'Renee',
  'Alex',
  'Nina',
  'Thomas',
  'Sophia',
  'Daniel',
]
const LAST = [
  'Thorne',
  'Rodriguez',
  'Chen',
  'Nair',
  'Mitchell',
  'Lee',
  'Hassan',
  'Vogt',
  'Farouk',
  'Okonkwo',
  'Kim',
  'Patel',
  'Wilson',
  'Martinez',
  'Park',
]

const TITLES = [
  'Senior Mediator',
  'Arbitrator',
  'Case Analyst',
  'Legal Counsel',
  'Operations Lead',
  'Compliance Officer',
  'Platform Admin',
  'Judicial Clerk',
]

const TEAMS = [
  'Global',
  'Legal Operations',
  'Engineering',
  'Compliance',
  'Risk & Audit',
  'Product',
]

function slugEmail(first: string, last: string, n: number) {
  return `${first.toLowerCase()}.${last.toLowerCase()}${n > 0 ? n : ''}@acme.co`
}

export const DIRECTORY_TOTAL_MEMBERS = 48

export const MOCK_DIRECTORY_USERS: DirectoryUser[] = Array.from(
  { length: DIRECTORY_TOTAL_MEMBERS },
  (_, i) => {
    const fi = i % FIRST.length
    const li = (i + 3) % LAST.length
    const first = FIRST[fi]
    const last = LAST[li]
    const tradeRole: TradeRole = i % 2 === 0 ? 'Importer' : 'Exporter'
    const statusRoll = i % 7
    const status: DirectoryUserStatus =
      statusRoll === 5 ? 'Inactive' : statusRoll === 6 ? 'Pending' : 'Active'
    const mins = (i * 17 + 3) % 120
    const lastActiveAt =
      status === 'Inactive' && i % 3 === 0
        ? null
        : new Date(Date.now() - mins * 60 * 1000 - i * 3_600_000).toISOString()

    return {
      id: `USR-${String(2100 + i).padStart(5, '0')}`,
      name: `${first} ${last}`,
      email: slugEmail(first, last, Math.floor(i / 15)),
      initials: `${first[0]}${last[0]}`,
      jobTitle: TITLES[i % TITLES.length],
      tradeRole,
      team: TEAMS[i % TEAMS.length],
      status,
      lastActiveAt,
    }
  }
)

/** Select values: All + each team */
export const DIRECTORY_TEAM_FILTERS = [
  'All',
  ...TEAMS,
] as const
