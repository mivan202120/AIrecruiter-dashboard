export interface ConversationStage {
  id: string
  name: string
  type: 'engagement' | 'interview' | 'scheduling' | 'decision'
  subStage?: string // For interview questions (2.1, 2.2, etc.)
  timestamp: Date
  message: string
  completed: boolean
}

export interface CandidateFunnelData {
  candidateId: string
  candidateName: string
  stages: ConversationStage[]
  currentStage: string
  decisionMade: boolean
  decisionType?: 'PASS' | 'FAIL'
  decisionTimestamp?: Date
  totalDuration: number // Time from start to decision
  droppedAt?: string // Stage where candidate dropped
}

export interface FunnelStageMetrics {
  stageName: string
  stageId: string
  candidatesEntered: number
  candidatesCompleted: number
  candidatesDropped: number
  conversionRate: number
  avgTimeInStage: number
  subStages?: FunnelStageMetrics[]
}

export interface ConversationFunnelData {
  totalCandidates: number
  stages: FunnelStageMetrics[]
  overallConversionRate: number
  avgTimeToDecision: number
  candidateDetails: CandidateFunnelData[]
}
