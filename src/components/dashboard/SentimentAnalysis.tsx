import type { CandidateAnalysis } from '../../types'

interface SentimentAnalysisProps {
  candidates: CandidateAnalysis[]
}

const sentimentColors = {
  Positive: {
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-800 dark:text-green-200',
    border: 'border-green-300 dark:border-green-700',
    icon: '😊',
  },
  Negative: {
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-800 dark:text-red-200',
    border: 'border-red-300 dark:border-red-700',
    icon: '😟',
  },
  Neutral: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-300 dark:border-gray-700',
    icon: '😐',
  },
}

export const SentimentAnalysis = ({ candidates }: SentimentAnalysisProps) => {
  // Calculate sentiment distribution
  const sentimentCounts = candidates.reduce(
    (acc, candidate) => {
      const sentiment = candidate.sentiment || 'Neutral'
      acc[sentiment] = (acc[sentiment] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const totalCandidates = candidates.length
  const sentimentData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    sentiment: sentiment as 'Positive' | 'Negative' | 'Neutral',
    count,
    percentage: (count / totalCandidates) * 100,
  }))

  // Sort by count descending
  sentimentData.sort((a, b) => b.count - a.count)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Sentiment Analysis
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Overall emotional tone of candidate responses
      </p>

      {/* Sentiment Distribution */}
      <div className="space-y-4">
        {sentimentData.map(({ sentiment, count, percentage }) => {
          const colors = sentimentColors[sentiment]
          return (
            <div key={sentiment} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{colors.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {sentiment}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {count}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    sentiment === 'Positive'
                      ? 'bg-green-500'
                      : sentiment === 'Negative'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Sentiment by Status */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
          Sentiment by Hiring Decision
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {['PASS', 'FAIL', 'NO_RESP'].map((status) => {
            const statusCandidates = candidates.filter((c) => c.status === status)
            const statusSentiments = statusCandidates.reduce(
              (acc, c) => {
                const sentiment = c.sentiment || 'Neutral'
                acc[sentiment] = (acc[sentiment] || 0) + 1
                return acc
              },
              {} as Record<string, number>
            )

            const dominantSentiment = Object.entries(statusSentiments).sort(
              (a, b) => b[1] - a[1]
            )[0]

            return (
              <div
                key={status}
                className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
              >
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {status === 'PASS' ? 'Approved' : status === 'FAIL' ? 'Rejected' : 'No Response'}
                </p>
                {dominantSentiment && (
                  <p className="mt-2">
                    <span className="text-2xl">
                      {sentimentColors[dominantSentiment[0] as keyof typeof sentimentColors].icon}
                    </span>
                    <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {dominantSentiment[0]}
                    </span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}