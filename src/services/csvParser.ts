import Papa from 'papaparse'
import type { CSVRow, ParsedMessage, CandidateConversation } from '../types'
import { validateCSVHeaders } from '../utils/validators'
import { parseDate } from '../utils/dateUtils'
import { ENTITY_MAPPING } from '../constants'

export interface ParseResult {
  success: boolean
  data?: CandidateConversation[]
  error?: string
  totalRows?: number
  errorRows?: number
}

export const parseCSVFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parseResult = processCSVData(results.data, results.meta.fields || [])
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

const processCSVData = (rows: CSVRow[], headers: string[]): ParseResult => {
  console.log('Processing CSV data with headers:', headers)
  console.log('Total rows to process:', rows.length)
  console.log('First row sample:', rows[0])
  
  // Validate headers
  const headerValidation = validateCSVHeaders(headers)
  if (!headerValidation.isValid) {
    console.error('Header validation failed:', headerValidation)
    return {
      success: false,
      error: `Missing required columns: ${headerValidation.missingColumns.join(', ')}`,
    }
  }

  // Parse and normalize data
  const parsedMessages: ParsedMessage[] = []
  const errorRows: number[] = []

  rows.forEach((row, index) => {
    try {
      // Log problematic rows
      if (index < 3 || !row.Date || !row.Entity || !row.CandidateID) {
        console.log(`Row ${index + 2}:`, row)
      }
      
      const entity = ENTITY_MAPPING[row.Entity as keyof typeof ENTITY_MAPPING]
      if (!entity) {
        console.warn(`Invalid entity "${row.Entity}" at row ${index + 2}`)
        errorRows.push(index + 2)
        return
      }

      const parsedMessage: ParsedMessage = {
        conversation_id: row.MessageID,
        user_id: row.CandidateID,
        entity,
        message: row.Message,
        timestamp: parseDate(row.Date),
        fullName: row.FullName || `Candidate ${row.CandidateID}`,
      }

      parsedMessages.push(parsedMessage)
    } catch (error) {
      console.error(`Error parsing row ${index + 2}:`, error)
      console.error('Problematic row data:', row)
      errorRows.push(index + 2)
    }
  })

  // Group by candidate
  const candidateMap = new Map<string, ParsedMessage[]>()
  parsedMessages.forEach((message) => {
    const messages = candidateMap.get(message.user_id) || []
    messages.push(message)
    candidateMap.set(message.user_id, messages)
  })

  // Create candidate conversations
  const conversations: CandidateConversation[] = Array.from(candidateMap.entries()).map(
    ([candidateId, messages]) => {
      // Sort messages by timestamp
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      const firstMessage = messages[0]
      const lastMessage = messages[messages.length - 1]

      return {
        candidateId,
        candidateName: firstMessage.fullName || `Candidate ${candidateId}`,
        messages,
        messageCount: messages.length,
        duration: lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime(),
        startTime: firstMessage.timestamp,
        endTime: lastMessage.timestamp,
      }
    }
  )

  console.log('CSV parsing complete:')
  console.log('- Total rows:', rows.length)
  console.log('- Parsed messages:', parsedMessages.length)
  console.log('- Error rows:', errorRows.length)
  console.log('- Conversations created:', conversations.length)
  console.log('- Conversations:', conversations.map(c => ({
    candidateId: c.candidateId,
    name: c.candidateName,
    messages: c.messageCount,
    duration: c.duration
  })))

  return {
    success: true,
    data: conversations,
    totalRows: rows.length,
    errorRows: errorRows.length,
  }
}
