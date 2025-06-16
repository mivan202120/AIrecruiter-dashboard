import { useState, useEffect } from 'react'
import type { CandidateAnalysis } from '../../types'
import type { ParsedMessage } from '../../types'

interface ConversationViewerProps {
  candidate: CandidateAnalysis
  conversations: Map<string, ParsedMessage[]>
  isOpen: boolean
  onClose: () => void
}

export const ConversationViewer = ({
  candidate,
  conversations,
  isOpen,
  onClose,
}: ConversationViewerProps) => {
  const [messages, setMessages] = useState<ParsedMessage[]>([])

  useEffect(() => {
    if (isOpen && candidate) {
      console.log('ConversationViewer - Looking for candidate:', candidate.candidateId)
      console.log('ConversationViewer - Candidate object:', candidate)
      console.log('ConversationViewer - Available conversations:', Array.from(conversations.keys()))
      console.log('ConversationViewer - Conversations size:', conversations.size)
      
      // Try different ways to find the messages
      let candidateMessages = conversations.get(candidate.candidateId) || []
      
      if (candidateMessages.length === 0) {
        console.log('ConversationViewer - No messages found with candidateId, checking all conversations')
        
        // Log all conversation entries for debugging
        conversations.forEach((msgs, id) => {
          console.log(`  Conversation ID: "${id}", Messages: ${msgs.length}`)
          if (msgs.length > 0) {
            console.log(`    First message user_id: "${msgs[0].user_id}"`)
            console.log(`    First message fullName: "${msgs[0].fullName}"`)
          }
        })
        
        // Try to find by name match
        const candidateNameLower = candidate.candidateName.toLowerCase()
        conversations.forEach((msgs, id) => {
          if (msgs.length > 0 && msgs[0].fullName?.toLowerCase() === candidateNameLower) {
            console.log(`  Found conversation by name match: ${id}`)
            candidateMessages = msgs
          }
        })
      }
      
      console.log('ConversationViewer - Final messages found:', candidateMessages.length)
      setMessages(candidateMessages)
    }
  }, [isOpen, candidate, conversations])

  if (!isOpen) return null

  const formatTime = (date: Date) => {
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getMessageAlignment = (isAI: boolean) => {
    return isAI ? 'flex-row' : 'flex-row-reverse'
  }

  const getMessageStyle = (isAI: boolean) => {
    return isAI
      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
      : 'bg-blue-600 text-white'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Conversation with {candidate.candidateName}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  <strong>{messages.length}</strong> messages
                </span>
                <span>•</span>
                <span>
                  Duration: <strong>{Math.round(candidate.conversationMetrics.duration / 1000 / 60)} minutes</strong>
                </span>
                <span>•</span>
                <span className={`font-semibold ${
                  candidate.status === 'PASS' 
                    ? 'text-green-600 dark:text-green-400' 
                    : candidate.status === 'FAIL' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {candidate.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg">No messages found</p>
                <p className="text-sm mt-2">This conversation appears to be empty</p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isAI = message.entity === 'AI_RECRUITER'
                  let showDate = false
                  
                  if (index === 0) {
                    showDate = true
                  } else {
                    const prevDate = new Date(messages[index - 1].timestamp).toDateString()
                    const currDate = new Date(message.timestamp).toDateString()
                    showDate = prevDate !== currDate
                  }

                  return (
                    <div key={`${message.conversation_id}-${index}`}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${getMessageAlignment(isAI)} gap-3`}>
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {isAI ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {candidate.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Message bubble */}
                        <div className="flex-1 max-w-[70%]">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {isAI ? 'AI Recruiter' : candidate.candidateName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className={`rounded-lg px-4 py-3 ${getMessageStyle(isAI)}`}>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Started:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(candidate.conversationMetrics.startTime)}
                  </span>
                </div>
                {candidate.sentiment && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Sentiment:</span>
                    <span className={`ml-2 font-medium ${
                      candidate.sentiment === 'Positive' 
                        ? 'text-green-600 dark:text-green-400' 
                        : candidate.sentiment === 'Negative'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {candidate.sentiment}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}