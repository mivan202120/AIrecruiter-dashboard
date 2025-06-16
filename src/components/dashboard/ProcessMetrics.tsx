import type { DashboardData } from '../../types'
import { formatDuration } from '../../utils/dateUtils'

interface ProcessMetricsProps {
  data: DashboardData
}

export const ProcessMetrics = ({ data }: ProcessMetricsProps) => {
  const avgDuration =
    data.candidates.length > 0
      ? data.candidates.reduce((sum, c) => sum + c.conversationMetrics.duration, 0) /
        data.candidates.length
      : 0

  const fastestConversation =
    data.candidates.length > 0
      ? data.candidates.reduce((fastest, current) =>
          current.conversationMetrics.duration < fastest.conversationMetrics.duration
            ? current
            : fastest
        )
      : null

  const longestConversation =
    data.candidates.length > 0
      ? data.candidates.reduce((longest, current) =>
          current.conversationMetrics.duration > longest.conversationMetrics.duration
            ? current
            : longest
        )
      : null

  const metrics = [
    {
      label: 'Total Messages',
      value: data.totalMessages,
      icon: '💬',
    },
    {
      label: 'Evaluated Users',
      value: data.totalUsers,
      icon: '👥',
    },
    {
      label: 'Average Duration',
      value: formatDuration(avgDuration),
      icon: '⏱️',
    },
    {
      label: 'Fastest Conversation',
      value: fastestConversation
        ? formatDuration(fastestConversation.conversationMetrics.duration)
        : 'N/A',
      sublabel: fastestConversation?.candidateName,
      icon: '🚀',
    },
    {
      label: 'Longest Conversation',
      value: longestConversation
        ? formatDuration(longestConversation.conversationMetrics.duration)
        : 'N/A',
      sublabel: longestConversation?.candidateName,
      icon: '🐌',
    },
  ]

  const evaluationCriteria = [
    'Technical Experience',
    'Logical Reasoning',
    'AI Adoption',
    'Cultural Fit',
    'Communication Clarity',
    'Engagement Level',
    'Professionalism',
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Key Metrics</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {metrics.map((metric, index) => (
            <div key={index} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{metric.icon}</span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  {metric.sublabel && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">{metric.sublabel}</p>
                  )}
                </div>
              </div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Evaluation Criteria */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg p-4">
        <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
          AI Evaluation Criteria
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {evaluationCriteria.map((criterion, index) => (
            <div key={index} className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-500 dark:text-purple-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-purple-800 dark:text-purple-200">{criterion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Process Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Process Flow</h3>
        <div className="relative">
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
          <div className="space-y-4">
            {['CSV Upload', 'Data Processing', 'AI Analysis', 'Results Display'].map(
              (step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < 3 ? 'bg-green-500 text-white' : 'bg-primary-500 text-white'
                    }`}
                  >
                    {index < 3 ? '✓' : index + 1}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
