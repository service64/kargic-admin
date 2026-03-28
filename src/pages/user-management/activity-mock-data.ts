export type ActivityCategory =
  | 'MODIFICATION'
  | 'SECURITY ELEVATION'
  | 'AUTOMATED TASK'
  | 'ACCESS LOG'
  | 'CRITICAL ALERT'

export type ActivityUserRole = 'importer' | 'exporter' | 'system'

export type ActivityLogEntry = {
  id: string
  userName: string
  userInitials: string
  action: string
  timestamp: string
  ip: string
  category: ActivityCategory
  /** Importer vs exporter workspace; system = automation / platform */
  userRole: ActivityUserRole
  critical?: boolean
  /** Green = ok, red = alert on avatar dot */
  avatarStatus: 'ok' | 'alert'
}

export const ACTIVITY_TOTAL_EVENTS = 12_482

export const MOCK_ACTIVITY_LOGS: ActivityLogEntry[] = [
  {
    id: '1',
    userName: 'Marcus Thorne',
    userInitials: 'MT',
    action: 'Updated Dispute #8821',
    timestamp: '2023-10-24T14:22:00',
    ip: '192.168.1.105',
    category: 'MODIFICATION',
    avatarStatus: 'ok',
    userRole: 'importer',
  },
  {
    id: '2',
    userName: 'System Daemon',
    userInitials: 'SD',
    action: 'Scheduled backup verification complete',
    timestamp: '2023-10-24T14:18:00',
    ip: '10.0.0.2',
    category: 'AUTOMATED TASK',
    avatarStatus: 'ok',
    userRole: 'system',
  },
  {
    id: '3',
    userName: 'Elena Rodriguez',
    userInitials: 'ER',
    action: 'Elevated privileges for Support Tier 2',
    timestamp: '2023-10-24T14:05:00',
    ip: '192.168.1.44',
    category: 'SECURITY ELEVATION',
    avatarStatus: 'alert',
    userRole: 'exporter',
  },
  {
    id: '4',
    userName: 'James Chen',
    userInitials: 'JC',
    action: 'Exported customer PII report (masked)',
    timestamp: '2023-10-24T13:47:00',
    ip: '192.168.1.12',
    category: 'ACCESS LOG',
    avatarStatus: 'ok',
    userRole: 'exporter',
  },
  {
    id: '5',
    userName: 'Priya Nair',
    userInitials: 'PN',
    action: 'Modified subscription billing address',
    timestamp: '2023-10-24T13:32:00',
    ip: '192.168.1.89',
    category: 'MODIFICATION',
    avatarStatus: 'ok',
    userRole: 'importer',
  },
  {
    id: '6',
    userName: 'Audit Bot',
    userInitials: 'AB',
    action: 'Compliance snapshot archived',
    timestamp: '2023-10-24T13:15:00',
    ip: '10.0.0.5',
    category: 'AUTOMATED TASK',
    avatarStatus: 'ok',
    userRole: 'system',
  },
  {
    id: '7',
    userName: 'Sarah Mitchell',
    userInitials: 'SM',
    action: 'Logged in from new device',
    timestamp: '2023-10-24T13:01:00',
    ip: '203.0.113.14',
    category: 'ACCESS LOG',
    avatarStatus: 'ok',
    userRole: 'exporter',
  },
  ...Array.from({ length: 17 }, (_, i): ActivityLogEntry => {
    const n = i + 8
    const hour = 12 - Math.floor(i / 3)
    const min = (i * 7) % 60
    return {
      id: String(n),
      userName: `Service Account ${n}`,
      userInitials: `S${n % 10}`,
      action: `Routine config sync job #${4400 + n}`,
      timestamp: `2023-10-24T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`,
      ip: `10.0.${(n % 5) + 1}.${(n % 200) + 10}`,
      category: 'AUTOMATED TASK',
      avatarStatus: 'ok',
      userRole: n % 2 === 0 ? 'importer' : 'exporter',
    }
  }),
  {
    id: '25',
    userName: 'Security Monitor',
    userInitials: '!!',
    action: 'Multiple failed admin login attempts detected',
    timestamp: '2023-10-24T12:58:00',
    ip: '198.51.100.22',
    category: 'CRITICAL ALERT',
    critical: true,
    avatarStatus: 'alert',
    userRole: 'system',
  },
  {
    id: '26',
    userName: 'Nightly Reconciler',
    userInitials: 'NR',
    action: 'End-of-day ledger balance check',
    timestamp: '2023-10-24T12:45:00',
    ip: '10.0.0.9',
    category: 'AUTOMATED TASK',
    avatarStatus: 'ok',
    userRole: 'system',
  },
]

export const ACTIVE_ADMIN_AVATARS = ['JC', 'ER', 'MT', 'PN', 'SM', 'AH']
