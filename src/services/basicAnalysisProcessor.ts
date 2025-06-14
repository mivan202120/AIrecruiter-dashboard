import type {
  CandidateConversation,
  CandidateAnalysis,
  DashboardData,
  AggregateAnalysis,
} from '../types'
import { calculateDailyConversations } from '../utils/conversationStats'

export const processWithoutAI = async (
  conversations: CandidateConversation[]
): Promise<DashboardData> => {
  console.log('Processing without AI:', conversations.length, 'conversations')
  console.log('First conversation:', conversations[0])
  
  // Create basic analysis for each candidate
  const candidates: CandidateAnalysis[] = conversations.map((conversation) => {
    // Use decision if provided, otherwise determine based on message count
    let status: 'PASS' | 'FAIL' | 'NO_RESP' = 'NO_RESP'
    
    if (conversation.decision) {
      status = conversation.decision
    } else if (conversation.messageCount < 3) {
      status = 'NO_RESP'
    } else if (conversation.messageCount >= 6) {
      status = 'PASS'
    } else {
      status = 'FAIL'
    }

    // Debug date handling
    console.log('Processing candidate:', conversation.candidateId)
    console.log('Start time type:', typeof conversation.startTime)
    console.log('Start time value:', conversation.startTime)
    console.log('Is Date?', conversation.startTime instanceof Date)
    
    const startTime = conversation.startTime instanceof Date 
      ? conversation.startTime 
      : new Date(conversation.startTime)
    
    console.log('Converted start time:', startTime)
    console.log('Is valid date?', !isNaN(startTime.getTime()))

    return {
      candidateId: conversation.candidateId,
      candidateName: conversation.candidateName,
      status,
      conversationMetrics: {
        messageCount: conversation.messageCount,
        duration: conversation.duration,
        startTime,
        tags: conversation.tags || [],
      },
      aiAnalysis: {
        overallAssessment: 'AI analysis not available - API key not configured',
        keyStrengths: ['Data not available'],
        areasForImprovement: ['Data not available'],
        dimensionScores: {
          technicalExperience: 50,
          problemSolvingAbility: 50,
          communicationClarity: 50,
          culturalFit: 50,
          motivationLevel: 50,
          overallReadiness: 50,
        },
        hiringRecommendation: 'MAYBE',
        nextSteps: 'Configure API key for detailed analysis',
      },
    }
  })

  // Calculate status distribution
  const statusDistribution = {
    approved: candidates.filter((c) => c.status === 'PASS').length,
    rejected: candidates.filter((c) => c.status === 'FAIL').length,
    noResponse: candidates.filter((c) => c.status === 'NO_RESP').length,
  }
  
  console.log('Status distribution:', statusDistribution)
  console.log('Candidates:', candidates.length)

  // Calculate total messages
  const totalMessages = conversations.reduce((sum, conv) => sum + conv.messageCount, 0)

  // Generate basic aggregate analysis
  const aggregateAnalysis: AggregateAnalysis = {
    keyInsights: [
      `Processed ${conversations.length} candidates with ${totalMessages} total messages`,
      `Approval rate: ${((statusDistribution.approved / conversations.length) * 100).toFixed(1)}%`,
      `Response rate: ${(((statusDistribution.approved + statusDistribution.rejected) / conversations.length) * 100).toFixed(1)}%`,
      'Enable AI analysis for detailed insights and recommendations',
    ],
    recommendations: [
      {
        title: 'Enable AI Analysis',
        description: 'Add your OpenAI API key to unlock detailed candidate assessments and strategic recommendations',
        priority: 'High' as const,
      },
    ],
    observedBehaviors: ['Analysis not available without API key'],
    durationKeyFinding: conversations.length > 0 
      ? `Average conversation duration: ${Math.round(
          conversations.reduce((sum, c) => sum + c.duration, 0) / conversations.length / 1000 / 60
        )} minutes`
      : 'No conversation data available',
  }

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