import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { CandidateAnalysis } from '../../types'
import { formatDuration } from '../../utils/dateUtils'

interface DurationAnalysisProps {
  candidates: CandidateAnalysis[]
  keyFinding: string
}

export const DurationAnalysis = ({ candidates, keyFinding }: DurationAnalysisProps) => {
  const durations = candidates.map((c) => c.conversationMetrics.duration).sort((a, b) => a - b)
  const avgDuration =
    durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0
  const minDuration = durations.length > 0 ? Math.min(...durations) : 0
  const maxDuration = durations.length > 0 ? Math.max(...durations) : 0

  // Prepare data for line chart
  const chartData = candidates
    .map((c, index) => ({
      candidate: index + 1,
      duration: Math.round(c.conversationMetrics.duration / 1000 / 60), // Convert to minutes
      status: c.status,
    }))
    .sort((a, b) => a.duration - b.duration)

  const progressStats = {
    completed: candidates.filter((c) => c.status === 'PASS' || c.status === 'FAIL').length,
    notInitiated: candidates.filter((c) => c.status === 'NO_RESP').length,
    abandoned: candidates.filter(
      (c) => c.status === 'FAIL' && c.conversationMetrics.messageCount < 3
    ).length,
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Duration Analysis
      </h2>

      {/* Duration Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Fastest Time</p>
              <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {formatDuration(minDuration)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Average</p>
              <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                {formatDuration(avgDuration)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400">Longest Time</p>
              <p className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                {formatDuration(maxDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Duration Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
          Conversation Duration Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                dataKey="candidate"
                label={{ value: 'Candidates', position: 'insideBottom', offset: -5 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                label={{ value: 'Duration (minutes)', angle: -90, position: 'insideLeft' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                }}
                formatter={(value: number) => `${value} minutes`}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Progress Evaluation</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completed Evaluations
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {progressStats.completed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Not Initiated</span>
              <span className="font-semibold text-gray-600 dark:text-gray-400">
                {progressStats.notInitiated}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Abandoned</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {progressStats.abandoned}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
          <h3 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">
            Key Duration Finding
          </h3>
          <p className="text-sm text-indigo-800 dark:text-indigo-200">{keyFinding}</p>
        </div>
      </div>
    </div>
  )
}
