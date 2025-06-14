import { GoogleGenerativeAI } from '@google/generative-ai'
import type { CandidateConversation, CandidateAnalysis, AggregateAnalysis } from '../types'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

// Configuration
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp'
const MAX_RETRIES = parseInt(import.meta.env.VITE_MAX_RETRIES || '3')
// const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '60000') // Reserved for future use

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const enforceRateLimit = async () => {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await wait(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }
  lastRequestTime = Date.now()
}

const retryWithBackoff = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  try {
    await enforceRateLimit()
    return await fn()
  } catch (error) {
    if (retries > 0) {
      const delay = (MAX_RETRIES - retries + 1) * 2000 // Exponential backoff
      console.warn(`API request failed, retrying in ${delay}ms...`, error)
      await wait(delay)
      return retryWithBackoff(fn, retries - 1)
    }
    throw error
  }
}

export const analyzeCandidate = async (
  conversation: CandidateConversation
): Promise<Partial<CandidateAnalysis>> => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  // Format conversation for analysis
  const formattedConversation = conversation.messages
    .map((msg) => `${msg.entity === 'AI_RECRUITER' ? 'Recruiter' : 'Candidate'}: ${msg.message}`)
    .join('\n\n')

  const prompt = `
You are an expert recruiter analyzing a conversation between an AI recruiter and a candidate.

Candidate Name: ${conversation.candidateName}
Conversation:
${formattedConversation}

Please analyze this conversation and provide your assessment in the following JSON format:

{
  "status": "PASS" | "FAIL" | "NO_RESP",
  "statusJustification": "Brief explanation of the status decision",
  "dimensions": {
    "technicalExperience": {
      "score": 1-10,
      "feedback": "Specific feedback about technical experience"
    },
    "logicalReasoning": {
      "score": 1-10,
      "feedback": "Specific feedback about logical reasoning abilities"
    },
    "aiAdoption": {
      "score": 1-10,
      "feedback": "Specific feedback about openness to AI and new technologies"
    },
    "culturalFit": {
      "score": 1-10,
      "feedback": "Specific feedback about cultural fit"
    },
    "communicationClarity": {
      "score": 1-10,
      "feedback": "Specific feedback about communication skills"
    },
    "engagement": {
      "score": 1-10,
      "feedback": "Specific feedback about engagement level"
    },
    "professionalism": {
      "score": 1-10,
      "feedback": "Specific feedback about professionalism"
    }
  },
  "sentiment": "Positive" | "Negative" | "Neutral",
  "rejectionReason": "If status is FAIL, provide specific reason"
}

Status definitions:
- PASS: Candidate showed interest and qualifications, moving forward
- FAIL: Candidate was rejected or showed clear disqualifications
- NO_RESP: Candidate didn't respond to the recruiter

Only include dimensions and scores if status is PASS or FAIL. For NO_RESP, only include status and statusJustification.
`

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      const text = response.response.text()
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }
      return JSON.parse(jsonMatch[0])
    })

    return {
      candidateId: conversation.candidateId,
      candidateName: conversation.candidateName,
      ...result,
      conversationMetrics: {
        messageCount: conversation.messageCount,
        duration: conversation.duration,
        startTime: conversation.startTime,
        endTime: conversation.endTime,
      },
    }
  } catch (error) {
    console.error(`Failed to analyze candidate ${conversation.candidateId}:`, error)
    throw error
  }
}

export const generateAggregateAnalysis = async (
  candidates: CandidateAnalysis[]
): Promise<AggregateAnalysis> => {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const summary = {
    total: candidates.length,
    passed: candidates.filter((c) => c.status === 'PASS').length,
    failed: candidates.filter((c) => c.status === 'FAIL').length,
    noResponse: candidates.filter((c) => c.status === 'NO_RESP').length,
  }

  const prompt = `
You are an expert recruitment analyst reviewing the results of an AI recruiting campaign.

Campaign Summary:
- Total candidates contacted: ${summary.total}
- Candidates who passed screening: ${summary.passed}
- Candidates who failed screening: ${summary.failed}
- Candidates who didn't respond: ${summary.noResponse}

Individual candidate results:
${candidates
  .map(
    (c) => `
- ${c.candidateName} (${c.candidateId}):
  Status: ${c.status}
  Messages: ${c.conversationMetrics.messageCount}
  Duration: ${Math.round(c.conversationMetrics.duration / 1000 / 60)} minutes
  ${c.statusJustification || ''}
`
  )
  .join('\n')}

Please provide a comprehensive analysis in the following JSON format:

{
  "keyInsights": [
    "List 3-5 key insights about the recruitment process"
  ],
  "recommendations": [
    {
      "priority": "High" | "Medium" | "Low",
      "title": "Short recommendation title",
      "description": "Detailed recommendation description"
    }
  ],
  "observedBehaviors": [
    "List 2-4 observed candidate behavior patterns"
  ],
  "durationKeyFinding": "One key finding about conversation durations and engagement"
}

Focus on actionable insights and strategic recommendations that can improve the recruitment process.
`

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt)
      const text = response.response.text()
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }
      return JSON.parse(jsonMatch[0])
    })

    return result
  } catch (error) {
    console.error('Failed to generate aggregate analysis:', error)
    throw error
  }
}
