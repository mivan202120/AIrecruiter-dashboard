export interface CSVRow {
  MessageID: string
  CandidateID: string
  Entity: string
  Message: string
  Date: string
  FullName?: string
}

export interface ParsedMessage {
  conversation_id: string
  user_id: string
  entity: 'AI_RECRUITER' | 'CANDIDATE'
  message: string
  timestamp: Date
  fullName?: string
}

export interface CandidateConversation {
  candidateId: string
  candidateName: string
  messages: ParsedMessage[]
  messageCount: number
  duration: number
  startTime: Date
  endTime: Date
  decision?: 'PASS' | 'FAIL' | 'NO_RESP'
  tags?: string[]
}

export interface CandidateAnalysis {
  candidateId: string
  candidateName: string
  status: 'PASS' | 'FAIL' | 'NO_RESP'
  statusJustification?: string
  dimensions?: {
    technicalExperience: DimensionScore
    logicalReasoning: DimensionScore
    aiAdoption: DimensionScore
    culturalFit: DimensionScore
    communicationClarity: DimensionScore
    engagement: DimensionScore
    professionalism: DimensionScore
  }
  sentiment?: 'Positive' | 'Negative' | 'Neutral'
  rejectionReason?: string
  conversationMetrics: {
    messageCount: number
    duration: number
    startTime: Date
    tags: string[]
  }
  aiAnalysis: {
    overallAssessment: string
    keyStrengths: string[]
    areasForImprovement: string[]
    dimensionScores: {
      technicalExperience: number
      problemSolvingAbility: number
      communicationClarity: number
      culturalFit: number
      motivationLevel: number
      overallReadiness: number
    }
    hiringRecommendation: string
    nextSteps: string
    sentiment?: 'Positive' | 'Negative' | 'Neutral'
    rejectionReason?: string
  }
}

export interface DimensionScore {
  score: number
  feedback: string
}

export interface AggregateAnalysis {
  keyInsights: string[]
  recommendations: Recommendation[]
  observedBehaviors: string[]
  durationKeyFinding: string
}

export interface Recommendation {
  priority: 'High' | 'Medium' | 'Low'
  title: string
  description: string
}

export interface DailyConversationCount {
  date: string
  count: number
  candidates: string[]
}

export interface ProcessingMetrics {
  tokensUsed?: number
  processingTimeMs: number
  apiCalls?: number
}

export interface DashboardData {
  totalMessages: number
  totalUsers: number
  processedAt: Date
  candidates: CandidateAnalysis[]
  aggregateAnalysis: AggregateAnalysis
  statusDistribution: {
    approved: number
    rejected: number
    noResponse: number
  }
  dailyConversations: DailyConversationCount[]
  processingMetrics?: ProcessingMetrics
}
