import type { CandidateAnalysis } from '../../types'
import { STATUS_COLORS } from '../../constants'
import { formatDuration } from '../../utils/dateUtils'
import { DimensionScores } from './DimensionScores'

interface CandidateCardProps {
  candidate: CandidateAnalysis
  isExpanded: boolean
  onToggle: () => void
}

export const CandidateCard = ({ candidate, isExpanded, onToggle }: CandidateCardProps) => {
  const statusColors = STATUS_COLORS[candidate.status]
  const statusLabels = {
    PASS: 'Approved',
    FAIL: 'Rejected',
    NO_RESP: 'No Response',
  }

  const sentimentIcons = {
    Positive: '😊',
    Negative: '😔',
    Neutral: '😐',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {candidate.candidateName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              {candidate.candidateName}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{candidate.conversationMetrics.messageCount} messages</span>
              <span>{formatDuration(candidate.conversationMetrics.duration)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors}`}>
            {statusLabels[candidate.status]}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Conversation Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Time Period</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(candidate.conversationMetrics.startTime).toLocaleDateString()} -{' '}
                {new Date(candidate.conversationMetrics.endTime).toLocaleDateString()}
              </p>
            </div>
            {candidate.sentiment && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sentiment</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
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
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-xs text-red-700 dark:text-red-300 font-medium mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">{candidate.rejectionReason}</p>
            </div>
          )}

          {/* Dimension Scores */}
          {candidate.dimensions && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Evaluation Scores</p>
              <DimensionScores dimensions={candidate.dimensions} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
