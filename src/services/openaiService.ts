import OpenAI from 'openai'
import type { CandidateConversation, CandidateAnalysis, AggregateAnalysis } from '../types'
import { validateOpenAIApiKey } from './apiKeyValidator'

// OpenAI configuration
const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

// Initialize OpenAI client with validation
let openai: OpenAI | null = null
let apiKeyValidated = false

const initializeOpenAI = async () => {
  if (!apiKeyValidated && apiKey) {
    const validation = await validateOpenAIApiKey(apiKey)
    apiKeyValidated = true

    if (validation.isValid) {
      openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // Note: In production, use a backend service
      })
    } else {
      console.error('OpenAI API key validation failed:', validation.error)
      openai = null
    }
  }
  return openai
}

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
  console.log(`Analyzing candidate: ${conversation.candidateName} (${conversation.candidateId})`)
  console.log(`Messages in conversation: ${conversation.messageCount}`)
  console.log(
    'First few messages:',
    conversation.messages.slice(0, 3).map((m) => ({
      entity: m.entity,
      message: m.message.substring(0, 50) + '...',
    }))
  )

  const client = await initializeOpenAI()
  if (!client) {
    throw new Error('OpenAI API key not configured or invalid')
  }

  const prompt = `
    Analyze this complete AI recruiter conversation transcript and provide a comprehensive evaluation of the candidate.
    
    Candidate: ${conversation.candidateName}
    ${conversation.decision ? `Pre-determined Decision: ${conversation.decision}` : ''}
    Total Messages: ${conversation.messageCount}
    Conversation Duration: ${Math.round(conversation.duration / 1000 / 60)} minutes
    
    Full Conversation Transcript:
    ${conversation.messages.map((m, i) => `[${i + 1}] ${m.entity === 'AI_RECRUITER' ? 'AI Recruiter' : 'Candidate'}: ${m.message}`).join('\n')}
    
    Based on the ENTIRE conversation above, evaluate the candidate across multiple dimensions.
    Consider their responses, engagement level, technical knowledge, communication skills, and overall fit.
    
    IMPORTANT: Also identify these conversation stages:
    1. AI Engagement - When AI initiates conversation
    2. Interview Questions - When AI asks about experience, skills, etc.
    3. HR Interview Scheduling - When AI proposes specific time slots or dates for HR interview
    4. Completed - When candidate confirms a specific time slot
    
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
      "nextSteps": "Specific recommendation for next steps",
      "sentiment": "One of: Positive, Negative, Neutral - Overall sentiment of candidate's responses",
      "rejectionReason": "If hiringRecommendation is NO or STRONG_NO, provide specific reason",
      "funnelStages": {
        "reachedScheduling": true/false - Did AI propose time slots?,
        "completedProcess": true/false - Did candidate confirm a time slot?
      }
    }
  `

  try {
    const response = await retryWithBackoff(async () => {
      const completion = await client.chat.completions.create({
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

      console.log(
        `OpenAI response for ${conversation.candidateName}:`,
        content.substring(0, 200) + '...'
      )
      return JSON.parse(content)
    })

    // Determine status based on AI recommendation if no decision provided
    let status: 'PASS' | 'FAIL' | 'NO_RESP' = 'NO_RESP'
    if (conversation.decision) {
      status = conversation.decision
    } else if (response.hiringRecommendation) {
      if (
        response.hiringRecommendation === 'STRONG_YES' ||
        response.hiringRecommendation === 'YES'
      ) {
        status = 'PASS'
      } else if (
        response.hiringRecommendation === 'NO' ||
        response.hiringRecommendation === 'STRONG_NO'
      ) {
        status = 'FAIL'
      }
    }

    return {
      candidateId: conversation.candidateId,
      candidateName: conversation.candidateName,
      status,
      sentiment: response.sentiment || 'Neutral',
      rejectionReason: response.rejectionReason,
      conversationMetrics: {
        messageCount: conversation.messageCount,
        duration: conversation.duration,
        startTime:
          conversation.startTime instanceof Date
            ? conversation.startTime
            : new Date(conversation.startTime),
        tags: conversation.tags || [],
      },
      aiAnalysis: response,
    }
  } catch (error) {
    console.error('Error analyzing candidate:', error)
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        throw new Error('OpenAI API authentication failed. Please check your API key.')
      } else if (error.message.includes('429')) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.')
      } else if (error.message.includes('insufficient_quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing.')
      }
    }
    throw error
  }
}

export const generateAggregateInsights = async (
  candidates: CandidateAnalysis[]
): Promise<AggregateAnalysis> => {
  const client = await initializeOpenAI()
  if (!client) {
    throw new Error('OpenAI API key not configured or invalid')
  }

  const summary = {
    total: candidates.length,
    approved: candidates.filter((c) => c.status === 'PASS').length,
    rejected: candidates.filter((c) => c.status === 'FAIL').length,
    noResponse: candidates.filter((c) => c.status === 'NO_RESP').length,
    avgDuration:
      candidates.reduce((sum, c) => sum + c.conversationMetrics.duration, 0) / candidates.length,
    avgMessages:
      candidates.reduce((sum, c) => sum + c.conversationMetrics.messageCount, 0) /
      candidates.length,
  }

  const prompt = `
    Analyze this comprehensive recruitment data from AI-conducted interviews and provide strategic insights.
    
    Overall Statistics:
    - Total Candidates Interviewed: ${summary.total}
    - Approved for Next Round: ${summary.approved} (${((summary.approved / summary.total) * 100).toFixed(1)}%)
    - Rejected: ${summary.rejected} (${((summary.rejected / summary.total) * 100).toFixed(1)}%)
    - No Response/Incomplete: ${summary.noResponse} (${((summary.noResponse / summary.total) * 100).toFixed(1)}%)
    - Average Conversation Duration: ${Math.round(summary.avgDuration / 1000 / 60)} minutes
    - Average Messages per Conversation: ${summary.avgMessages.toFixed(1)}
    
    Detailed Candidate Assessments:
    ${candidates
      .map(
        (c, i) => `
      Candidate ${i + 1}: ${c.candidateName}
      - Status: ${c.status}
      - Conversation Length: ${c.conversationMetrics.messageCount} messages
      - Duration: ${Math.round(c.conversationMetrics.duration / 1000 / 60)} minutes
      - AI Recommendation: ${c.aiAnalysis.hiringRecommendation}
      - Assessment: ${c.aiAnalysis.overallAssessment}
      - Key Strengths: ${c.aiAnalysis.keyStrengths.join(', ')}
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
      const completion = await client.chat.completions.create({
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
      keyInsights: response.keyInsights || [],
      recommendations: response.recommendations || [],
      observedBehaviors: response.observedBehaviors || ['High engagement levels across candidates'],
      durationKeyFinding: response.durationKeyFinding || 'Analysis complete',
    }
  } catch (error) {
    console.error('Error generating insights:', error)
    throw error
  }
}
