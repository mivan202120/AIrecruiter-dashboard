import { useEffect, useState } from 'react'
import type { CandidateAnalysis } from '../../types'
import { STATUS_COLORS } from '../../constants'
import { formatDuration } from '../../utils/dateUtils'
import { DimensionScores } from './DimensionScores'
import { CommentsService } from '../../services/commentsService'

interface CandidateCardProps {
  candidate: CandidateAnalysis
  isExpanded: boolean
  onToggle: () => void
  onViewConversation?: () => void
  onOpenComments?: () => void
}

export const CandidateCard = ({
  candidate,
  isExpanded,
  onToggle,
  onViewConversation,
  onOpenComments,
}: CandidateCardProps) => {
  const [commentCount, setCommentCount] = useState(0)
  const statusColors = STATUS_COLORS[candidate.status]
  const statusLabels = {
    PASS: 'Approved',
    FAIL: 'Rejected',
    NO_RESP: 'No Response',
  }

  useEffect(() => {
    const commentsService = new CommentsService()
    const comments = commentsService.getCommentsForCandidate(candidate.candidateId)
    setCommentCount(comments.length)
  }, [candidate.candidateId])

  const sentimentIcons = {
    Positive: '😊',
    Negative: '😔',
    Neutral: '😐',
  }

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center transition-all duration-200">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-200">
                {candidate.candidateName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {candidate.candidateName}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
                  />
                </svg>
                {candidate.conversationMetrics.messageCount} messages
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDuration(candidate.conversationMetrics.duration)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {commentCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenComments?.()
              }}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
              aria-label="View comments"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{commentCount}</span>
            </button>
          )}
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors} transition-all duration-200`}
          >
            {statusLabels[candidate.status]}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-all duration-200 ${
              isExpanded ? 'rotate-180' : ''
            } group-hover:text-blue-600 dark:group-hover:text-blue-400`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 space-y-4 bg-gray-50 dark:bg-slate-900">
          {/* Conversation Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Start Time</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(candidate.conversationMetrics.startTime).toLocaleString()}
              </p>
            </div>
            {candidate.sentiment && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sentiment</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {sentimentIcons[candidate.sentiment]} {candidate.sentiment}
                </p>
              </div>
            )}
          </div>

          {/* Status Justification */}
          {candidate.statusJustification && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">AI Assessment</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {candidate.statusJustification}
              </p>
            </div>
          )}

          {/* Rejection Reason */}
          {candidate.status === 'FAIL' && candidate.rejectionReason && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-400 font-medium mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">{candidate.rejectionReason}</p>
            </div>
          )}

          {/* Dimension Scores */}
          {candidate.dimensions && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Evaluation Scores</p>
              <DimensionScores dimensions={candidate.dimensions} />
            </div>
          )}

          {/* Action Buttons */}
          {(onViewConversation || onOpenComments) && (
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex gap-3">
              {onViewConversation && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log(
                      'CandidateCard - View Conversation clicked for:',
                      candidate.candidateId,
                      candidate.candidateName
                    )
                    onViewConversation()
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2"
                >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                View Full Conversation
              </button>
              )}
              {onOpenComments && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenComments()
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Comments ({commentCount})
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
