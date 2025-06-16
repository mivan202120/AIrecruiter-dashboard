import Papa from 'papaparse'
import type { CandidateConversation, ParsedMessage } from '../types'
import { filterTestCandidates, getFilteringStats } from '../utils/filterTestCandidates'

export interface SummaryCSVRow {
  candidateId: string
  candidateName: string
  messageCount: string
  startTime: string
  duration: string
  messages: string
  decision: string
  tags: string
}

export interface ParseResult {
  success: boolean
  data?: CandidateConversation[]
  error?: string
  totalRows?: number
  errorRows?: number
  filteredCount?: number
  filteredCandidates?: Array<{ id: string; name: string }>
}

export const parseSummaryCSVFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse<SummaryCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parseResult = processSummaryCSVData(results.data)
          resolve(parseResult)
        } catch (error) {
          resolve({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to parse CSV file',
          })
        }
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV parsing error: ${error.message}`,
        })
      },
    })
  })
}

const processSummaryCSVData = (rows: SummaryCSVRow[]): ParseResult => {
  console.log('Processing summary CSV data:', rows.length, 'rows')
  console.log('First row:', rows[0])

  const conversations: CandidateConversation[] = []
  const errorRows: number[] = []

  rows.forEach((row, index) => {
    try {
      if (!row.messages || !row.candidateId) {
        console.error('Missing required fields in row:', row)
        errorRows.push(index + 2)
        return
      }

      // Parse the messages field which contains pipe-separated messages
      // Also unescape any escaped characters
      const messageTexts = row.messages
        .replace(/\\!/g, '!')
        .split('|')
        .map((m) => m.trim())
        .filter((m) => m.length > 0)

      const messages: ParsedMessage[] = []

      const startTime = new Date(row.startTime)
      const duration = parseInt(row.duration) || 0
      const messageCount = parseInt(row.messageCount) || messageTexts.length

      // Create ParsedMessage objects from the message texts
      messageTexts.forEach((text, msgIndex) => {
        const isAI = text.startsWith('Assistant:')
        const cleanMessage = text.replace(/^(Assistant:|User:)\s*/, '')

        // Calculate approximate timestamp for each message
        const messageTime = new Date(startTime.getTime() + (duration / messageCount) * msgIndex)

        messages.push({
          conversation_id: `${row.candidateId}_msg_${msgIndex}`,
          user_id: row.candidateId,
          entity: isAI ? 'AI_RECRUITER' : 'CANDIDATE',
          message: cleanMessage,
          timestamp: messageTime,
          fullName: row.candidateName,
        })
      })

      const conversation: CandidateConversation = {
        candidateId: row.candidateId,
        candidateName: row.candidateName,
        messages,
        messageCount: messages.length,
        duration,
        startTime,
        endTime: new Date(startTime.getTime() + duration),
        decision: row.decision as 'PASS' | 'FAIL' | 'NO_RESP',
        tags: row.tags.split(',').map((t) => t.trim()),
      } as CandidateConversation & { decision: string; tags: string[] }

      conversations.push(conversation)
    } catch (error) {
      console.error(`Error parsing row ${index + 2}:`, error)
      console.error('Problematic row:', row)
      errorRows.push(index + 2)
    }
  })

  console.log('Parsed conversations:', conversations.length)
  console.log('First conversation:', conversations[0])

  // Filter out test candidates
  const filteredConversations = filterTestCandidates(conversations)

  // Log filtering statistics
  const filterStats = getFilteringStats(conversations, filteredConversations)
  if (filterStats.removedCount > 0) {
    console.log('🧹 Test candidates removed from summary:', filterStats.removedCandidates)
  }

  return {
    success: true,
    data: filteredConversations,
    totalRows: rows.length,
    errorRows: errorRows.length,
    filteredCount: filterStats.removedCount,
    filteredCandidates: filterStats.removedCandidates.map((c) => ({ id: c.id, name: c.name })),
  }
}
