import OpenAI from 'openai'
import type { CandidateConversation, CandidateAnalysis } from '../types'

// OpenAI configuration
const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

// Initialize OpenAI client
const openai = apiKey
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, use a backend service
    })
  : null

// Rate limiting
const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests
let lastRequestTime = 0

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const enforceRateLimit = async () => {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await wait(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }
  lastRequestTime = Date.now()
}

// Retry logic with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      await enforceRateLimit()
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i === maxRetries - 1) break

      const delay = baseDelay * Math.pow(2, i)
      console.warn(`Retry ${i + 1} after ${delay}ms:`, error)
      await wait(delay)
    }
  }

  throw lastError
}

export const isOpenAIConfigured = () => {
  return !!apiKey
}

export const analyzeCandidateConversation = async (
  conversation: CandidateConversation
): Promise<CandidateAnalysis> => {
  if (!openai) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = `
    Analyze this AI recruiter conversation and provide a structured evaluation.
    
    Candidate: ${conversation.candidateName}
    Decision: ${conversation.decision}
    Message Count: ${conversation.messageCount}
    Duration: ${Math.round(conversation.duration / 1000 / 60)} minutes
    
    Conversation:
    ${conversation.messages}
    
    Provide a JSON response with the following structure:
    {
      "overallAssessment": "A comprehensive 2-3 sentence assessment of the candidate",
      "keyStrengths": ["strength1", "strength2", "strength3"],
      "areasForImprovement": ["area1", "area2"],
      "dimensionScores": {
        "technicalExperience": 0-100,
        "problemSolvingAbility": 0-100,
        "communicationClarity": 0-100,
        "culturalFit": 0-100,
        "motivationLevel": 0-100,
        "overallReadiness": 0-100
      },
      "hiringRecommendation": "One of: STRONG_YES, YES, MAYBE, NO, STRONG_NO",
      "nextSteps": "Specific recommendation for next steps"
    }
  `

  try {
    const response = await retryWithBackoff(async () => {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert HR analyst specializing in technical recruitment. Analyze conversations and provide structured assessments in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000,
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      return JSON.parse(content)
    })

    return {
      candidateId: conversation.candidateId,
      candidateName: conversation.candidateName,
      status: conversation.decision,
      conversationMetrics: {
        messageCount: conversation.messageCount,
        duration: conversation.duration,
        startTime: new Date(conversation.startTime),
        tags: conversation.tags.split(',').map((tag) => tag.trim()),
      },
      aiAnalysis: response,
    }
  } catch (error) {
    console.error('Error analyzing candidate:', error)
    throw error
  }
}

export const generateAggregateInsights = async (
  candidates: CandidateAnalysis[]
): Promise<{
  keyInsights: string[]
  recommendations: string[]
  durationKeyFinding: string
}> => {
  if (!openai) {
    throw new Error('OpenAI API key not configured')
  }

  const summary = {
    total: candidates.length,
    approved: candidates.filter((c) => c.status === 'PASS').length,
    rejected: candidates.filter((c) => c.status === 'FAIL').length,
    noResponse: candidates.filter((c) => c.status === 'NO_RESP').length,
    avgDuration:
      candidates.reduce((sum, c) => sum + c.conversationMetrics.duration, 0) / candidates.length,
    avgMessages:
      candidates.reduce((sum, c) => sum + c.conversationMetrics.messageCount, 0) / candidates.length,
  }

  const prompt = `
    Analyze this aggregate recruitment data and provide insights.
    
    Summary:
    - Total Candidates: ${summary.total}
    - Approved: ${summary.approved} (${((summary.approved / summary.total) * 100).toFixed(1)}%)
    - Rejected: ${summary.rejected} (${((summary.rejected / summary.total) * 100).toFixed(1)}%)
    - No Response: ${summary.noResponse} (${((summary.noResponse / summary.total) * 100).toFixed(1)}%)
    - Average Duration: ${Math.round(summary.avgDuration / 1000 / 60)} minutes
    - Average Messages: ${summary.avgMessages.toFixed(1)}
    
    Individual Assessments:
    ${candidates
      .map(
        (c) => `
      ${c.candidateName}: ${c.status}
      Hiring Recommendation: ${c.aiAnalysis.hiringRecommendation}
      Overall Assessment: ${c.aiAnalysis.overallAssessment}
    `
      )
      .join('\n')}
    
    Provide a JSON response with:
    {
      "keyInsights": ["insight1", "insight2", "insight3", "insight4"],
      "recommendations": [
        {
          "title": "Recommendation Title",
          "description": "Detailed recommendation",
          "priority": "HIGH/MEDIUM/LOW",
          "impact": "Description of expected impact"
        }
      ],
      "durationKeyFinding": "One key finding about conversation duration patterns"
    }
  `

  try {
    const response = await retryWithBackoff(async () => {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert in recruitment analytics. Provide actionable insights based on aggregate recruitment data in JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1500,
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No response from OpenAI')

      return JSON.parse(content)
    })

    return {
      keyInsights: response.keyInsights,
      recommendations: response.recommendations,
      durationKeyFinding: response.durationKeyFinding,
    }
  } catch (error) {
    console.error('Error generating insights:', error)
    throw error
  }
}