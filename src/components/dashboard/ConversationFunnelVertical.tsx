import type { FunnelStageMetrics } from '../../types/funnel'
import { formatDuration } from '../../utils/dateUtils'

interface ConversationFunnelVerticalProps {
  stages: FunnelStageMetrics[]
  totalCandidates: number
  avgTimeToDecision: number
}

const stageColors = {
  ai_engagement: '#8B5CF6',
  interview_questions: '#3B82F6',
  hr_interview_scheduling: '#10B981',
  completed: '#F59E0B',
}

export const ConversationFunnelVertical = ({
  stages,
  totalCandidates,
  avgTimeToDecision,
}: ConversationFunnelVerticalProps) => {
  // If no stages, show empty state
  if (!stages || stages.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Conversation Funnel Analysis
        </h2>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No funnel data available</p>
          <p className="text-sm mt-2">Upload conversation data to see the funnel analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Conversation Funnel Analysis
        </h2>
        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            Total Candidates: <span className="font-semibold">{totalCandidates}</span>
          </div>
          <div>
            Avg Time to Decision:{' '}
            <span className="font-semibold">{formatDuration(avgTimeToDecision)}</span>
          </div>
        </div>
      </div>

      {/* Vertical Funnel Visualization */}
      <div className="relative max-w-md mx-auto">
        {stages.map((stage, index) => {
          const color = stageColors[stage.stageId as keyof typeof stageColors] || '#6B7280'
          const widthPercent = 100 - index * 15 // Progressive narrowing

          // Calculate metrics
          const dropOffFromPrevious =
            index > 0 ? stages[index - 1].candidatesEntered - stage.candidatesEntered : 0

          return (
            <div key={stage.stageId} className="relative">
              {/* Drop-off indicator */}
              {index > 0 && dropOffFromPrevious > 0 && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded-full text-xs whitespace-nowrap">
                    -{dropOffFromPrevious} dropped
                  </div>
                </div>
              )}

              {/* Funnel segment */}
              <div
                className="relative mx-auto transition-all duration-300"
                style={{
                  width: `${widthPercent}%`,
                  height: '100px',
                  backgroundColor: color,
                  clipPath:
                    index === stages.length - 1
                      ? 'polygon(10% 0%, 90% 0%, 50% 100%)' // Last segment is triangular
                      : 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)', // Others are trapezoid
                  marginTop: index === 0 ? '0' : '-20px',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <p className="font-semibold text-sm">{stage.stageName}</p>
                  <p className="text-2xl font-bold">{stage.candidatesEntered}</p>
                  <p className="text-xs opacity-90">{stage.conversionRate.toFixed(1)}% completed</p>
                </div>
              </div>

              {/* Stage details on the side */}
              <div className="absolute top-1/2 -right-48 transform -translate-y-1/2 text-sm w-40">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {stage.candidatesCompleted} completed
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Avg time: {formatDuration(stage.avgTimeInStage)}
                  </p>
                  {stage.candidatesDropped > 0 && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {stage.candidatesDropped} dropped here
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stages[stages.length - 1]?.candidatesCompleted || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Reached Decision</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {(
              ((stages[stages.length - 1]?.candidatesCompleted || 0) / totalCandidates) *
              100
            ).toFixed(1)}
            %
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Conversion</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {totalCandidates - (stages[stages.length - 1]?.candidatesCompleted || 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Dropped</p>
        </div>
      </div>
    </div>
  )
}
