export const REQUIRED_CSV_COLUMNS = ['MessageID', 'CandidateID', 'Entity', 'Message', 'Date']

export const ENTITY_MAPPING = {
  AI: 'AI_RECRUITER',
  user: 'CANDIDATE',
  AI_RECRUITER: 'AI_RECRUITER',
  CANDIDATE: 'CANDIDATE',
  // Add variations to handle different formats
  ai: 'AI_RECRUITER',
  User: 'CANDIDATE',
  USER: 'CANDIDATE',
  candidate: 'CANDIDATE',
  Candidate: 'CANDIDATE',
  recruiter: 'AI_RECRUITER',
  Recruiter: 'AI_RECRUITER',
  RECRUITER: 'AI_RECRUITER',
  assistant: 'AI_RECRUITER',
  Assistant: 'AI_RECRUITER',
  ASSISTANT: 'AI_RECRUITER',
} as const

export const STATUS_COLORS = {
  PASS: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-800',
  FAIL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-800',
  NO_RESP: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400 border border-gray-300 dark:border-gray-700',
} as const

export const PRIORITY_COLORS = {
  High: 'border-red-500 bg-red-50 dark:bg-red-950',
  Medium: 'border-orange-500 bg-orange-50 dark:bg-orange-950',
  Low: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
} as const
