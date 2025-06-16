import type { DashboardData, CandidateAnalysis } from '../types'
import { ensureDate } from './dateUtils'

// Normalize dashboard data to ensure all dates are Date objects
export const normalizeDashboardData = (data: DashboardData): DashboardData => {
  return {
    ...data,
    processedAt: ensureDate(data.processedAt),
    candidates: data.candidates.map(normalizeCandidate),
    dailyConversations: data.dailyConversations || [],
  }
}

// Normalize a single candidate to ensure dates are Date objects
export const normalizeCandidate = (candidate: CandidateAnalysis): CandidateAnalysis => {
  return {
    ...candidate,
    conversationMetrics: {
      ...candidate.conversationMetrics,
      startTime: ensureDate(candidate.conversationMetrics.startTime),
    },
  }
}
