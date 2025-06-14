import type { CandidateAnalysis, DailyConversationCount } from '../types'
import { ensureDate } from './dateUtils'

export const calculateDailyConversations = (
  candidates: CandidateAnalysis[]
): DailyConversationCount[] => {
  console.log('Calculating daily conversations for', candidates.length, 'candidates')
  
  // Group conversations by date
  const dailyMap = new Map<string, { count: number; candidates: string[] }>()

  candidates.forEach((candidate) => {
    const startTime = ensureDate(candidate.conversationMetrics.startTime)
    // Format date as YYYY-MM-DD for grouping
    const dateKey = startTime.toISOString().split('T')[0]
    
    console.log(`Candidate ${candidate.candidateName}: ${startTime} -> ${dateKey}`)

    const existing = dailyMap.get(dateKey) || { count: 0, candidates: [] }
    existing.count += 1
    existing.candidates.push(candidate.candidateName)
    dailyMap.set(dateKey, existing)
  })

  // Convert to array and sort by date
  const dailyConversations: DailyConversationCount[] = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      count: data.count,
      candidates: data.candidates,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  console.log('Daily conversations result:', dailyConversations)
  return dailyConversations
}

export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(date)
}