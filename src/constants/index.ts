export const REQUIRED_CSV_COLUMNS = ['MessageID', 'CandidateID', 'Entity', 'Message', 'Date']

export const ENTITY_MAPPING = {
  AI: 'AI_RECRUITER',
  user: 'CANDIDATE',
  AI_RECRUITER: 'AI_RECRUITER',
  CANDIDATE: 'CANDIDATE',
} as const

export const STATUS_COLORS = {
  PASS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  FAIL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  NO_RESP: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
} as const

export const PRIORITY_COLORS = {
  High: 'border-red-500 bg-red-50 dark:bg-red-950',
  Medium: 'border-orange-500 bg-orange-50 dark:bg-orange-950',
  Low: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
} as const
