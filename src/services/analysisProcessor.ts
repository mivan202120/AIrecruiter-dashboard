import { analyzeCandidateConversation, generateAggregateInsights } from './openaiService'
import type {
  CandidateConversation,
  CandidateAnalysis,
  DashboardData,
  AggregateAnalysis,
} from '../types'
import { calculateDailyConversations } from '../utils/conversationStats'

export interface ProcessingProgress {
  stage: 'analyzing' | 'aggregating' | 'complete'
  current: number
  total: number
  message: string
}

export const processConversations = async (
  conversations: CandidateConversation[],
  onProgress?: (progress: ProcessingProgress) => void
): Promise<DashboardData> => {
  const candidates: CandidateAnalysis[] = []
  const totalCandidates = conversations.length

  // Stage 1: Analyze individual candidates
  for (let i = 0; i < conversations.length; i++) {
    const conversation = conversations[i]

    onProgress?.({
      stage: 'analyzing',
      current: i + 1,
      total: totalCandidates,
      message: `Analyzing ${conversation.candidateName}...`,
    })

    try {
      const analysis = await analyzeCandidateConversation(conversation)
      candidates.push(analysis as CandidateAnalysis)
    } catch (error) {
      console.error(`Failed to analyze candidate ${conversation.candidateId}:`, error)
      // Create a fallback analysis for failed API calls
      candidates.push({
        candidateId: conversation.candidateId,
        candidateName: conversation.candidateName,
        status: 'NO_RESP',
        statusJustification: 'Analysis failed - treating as no response',
        conversationMetrics: {
          messageCount: conversation.messageCount,
          duration: conversation.duration,
          startTime: conversation.startTime instanceof Date ? conversation.startTime : new Date(conversation.startTime),
          tags: conversation.tags || [],
        },
      })
    }
  }

  // Stage 2: Generate aggregate analysis
  onProgress?.({
    stage: 'aggregating',
    current: 1,
    total: 1,
    message: 'Generating strategic insights...',
  })

  let aggregateAnalysis: AggregateAnalysis
  try {
    aggregateAnalysis = await generateAggregateInsights(candidates)
  } catch (error) {
    console.error('Failed to generate aggregate analysis:', error)
    // Provide fallback aggregate analysis
    aggregateAnalysis = {
      keyInsights: [
        'Unable to generate AI insights at this time',
        'Please check your API key configuration',
      ],
      recommendations: [
        {
          priority: 'High',
          title: 'Configure API Access',
          description: 'Ensure your OpenAI API key is properly configured',
        },
      ],
      observedBehaviors: ['Analysis unavailable'],
      durationKeyFinding: 'Analysis unavailable',
    }
  }

  // Calculate status distribution
  const statusDistribution = {
    approved: candidates.filter((c) => c.status === 'PASS').length,
    rejected: candidates.filter((c) => c.status === 'FAIL').length,
    noResponse: candidates.filter((c) => c.status === 'NO_RESP').length,
  }

  // Calculate total messages
  const totalMessages = conversations.reduce((sum, conv) => sum + conv.messageCount, 0)

  onProgress?.({
    stage: 'complete',
    current: 1,
    total: 1,
    message: 'Analysis complete!',
  })

  // Calculate daily conversations
  const dailyConversations = calculateDailyConversations(candidates)

  return {
    totalMessages,
    totalUsers: conversations.length,
    processedAt: new Date(),
    candidates,
    aggregateAnalysis,
    statusDistribution,
    dailyConversations,
  }
}
